	
	var realmConfig = require('../../includes/config.realm').config,
		fs = require( "fs" ),
		log = require( '../../includes/classes/class.log' ),
		redis = require(realmConfig.libraries.redisPath),
		sql = require(realmConfig.libraries.mysqlPath).createConnectionSync();
	
	var _createNPCScript = function( args )
	{
		var _serverTemplateLocation = "../../includes/classes/class.npc.js_files/npcScript." + args.data.op_id + ".js";
		var _clientTemplateLocation = "../../public_web/components/bugcraft/resources/public/component.bugcraft.npcScripts/npcScript." + args.data.op_id + ".js";
		
		var _writeTemplate = function( _tl, _tc )
		{
			fs.stat(
					_tl,
					function( err, stats )
					{
						if( err && err.code == "ENOENT" )
						{
							fs.writeFile(
										_tl,
										_tc.toString().replace( /\[NPCID\]/g, args.data.op_id ).replace( /\[NPCName\]/g, args.data.op_name ).replace( /\[NPCLevel\]/g, args.data.op_level ).replace( /\[NPCFaction\]/g, args.data.op_faction ).replace( /\[NPCZoneName\]/g, args.data.zp_name ).replace( /\[NPCIDZonePool\]/g, args.data.zp_id ),
										function( err )
										{
											if( err )
											{
												log.addError( "Template write error: " + err );
												
												return;
											}
											
											log.addNotice( "Default script written for " + args.data.op_id + " @ " + _tl );
										}
									);
							
							return;
						}
						
						log.add( "Script for NPC " + args.data.op_name + " ( " + args.data.op_id + " ) already exists @ " + _tl );
					}
				);
		}
		
		_writeTemplate( _serverTemplateLocation, args.serverTemplate );
		_writeTemplate( _clientTemplateLocation, args.clientTemplate );
	}
	
	fs.readFile('template.server.js', function(err, templateServer)
	{
		if(err)
		{
			log.addError( "Server template read error: " + err );
			
			return false;
		}
		
		fs.readFile('template.client.js', function(err, templateClient)
		{
			if(err)
			{
				log.addError( "Client template read error: " + err );
				
				return false;
			}
			
			// connect to the database
			sql.connectSync( realmConfig.realmDatabaseHost, realmConfig.realmDatabaseUser, realmConfig.realmDatabasePass, realmConfig.realmDatabaseDB );
			
			sql.query(
						"SELECT `objects_pool`.`op_id`, `objects_pool`.`op_name`, `objects_pool`.`op_level`, `objects_pool`.`op_faction`, `zones_pool`.`zp_name`, `zones_pool`.`zp_id` " +
							" from `objects_pool` " +
							" inner join `zones_pool` on `zones_pool`.`zp_id` = `objects_pool`.`op_id_zone_pool` " +
							" where `op_id_zone_pool` is not null",
						function( err, questsData )
						{
							if( err )
							{
								log.addError( "Objects query error: " + err );
								
								return;
							}
							
							questsData.fetchAll( function( err, npcData )
							{
								if( err )
								{
									log.addError( "Quest fetch error: " + err );
									
									return;
								}
								
								for(var i=0;i<npcData.length;i++)
								{
									_createNPCScript({
													data: npcData[ i ],
													serverTemplate: templateServer,
													clientTemplate: templateClient
												});
								}
							});
						}
					);
		});
	});
	