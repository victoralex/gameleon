	
    "use strict"; // enable strict mode within this file
	
	var instance = require('../class.instance').instance,
				realmConfig = require( "../../config.realm" ).config,
				log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var buffsScripts = {},
				_structure = args.res.buffsStructure,
				_buffsPath = realmConfig.realmInstallPath + "includes/classes/class.buffEffect.js_files/",
				_questsPath = realmConfig.realmInstallPath + "includes/classes/class.quest.js_files/";
		
		// load the buffs scripts
		for(var i in _structure)
		{
			try
			{
				buffsScripts[ _structure[ i ].buff_id ] = require( _buffsPath + "buffScript." + _structure[ i ].buff_id ).script;
				
				log.add( "Loaded script for buff ID " + _structure[ i ].buff_id );
			}
			catch( err )
			{
				// should fire if the buff has no script attached
				
				buffsScripts[ _structure[ i ].buff_id ] = function( buffObject )
				{
					this.specific = function()
					{
						
					}
				};
			}
		}
		
		// load the quests scripts
		for(var i in args.res.questsData)
		{
			args.res.questsData[ i ].script = require( _questsPath + "questRealm." + i + ".js" );
			
			log.add( "Loaded script for quest ID " + i );
		}
		
		// create the instance object
		args.instanceProcess.instanceObject = new instance({
																		castSchemes: args.res.castSchemes,
																		zone_id: args.res.zone_id,
																		zone_id_zone_pool: args.res.zone_id_zone_pool,
																		zoneSurface: args.res.zoneSurface,
																		zoneData: args.res.zoneData,
																		questsData: args.res.questsData,
																		achievementsData: args.res.achievementsData,
																		lootData: args.res.lootData,
																		buffsStructure: args.res.buffsStructure,
																		buffsScripts: buffsScripts,
																		instanceProcess: args.instanceProcess,
																		characterProgression: args.res.characterProgression,
																		afterFunction: function( instanceObject )
																		{
																			log.addNotice( "Initialized instance " + args.res.zone_id );
																			
																			process.send({
																							cmd: args.res.cmd,
																							id: args.id,
																							data: {
																								r: 200,
																								zoneID: args.res.zone_id
																							}
																						});
																		}
																	});
	}