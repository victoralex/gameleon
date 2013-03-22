	
	//
	// Fortitude pheromone
	//
	
	var log = require( "../class.log" )
				npc = require( "../class.npc" ),
				syncSQL = new ( require('../class.syncSQL') ).p;
	
	exports.script = function( buffObject )
	{
		var _createNPC = function( id, instanceID )
		{
			var _moveIterations = 0;
			
			syncSQL.q(
					"call character_add( 8, 'npc" + id + "', 'fireant', 'soldier' )",
					function( resCreate )
					{
						//log.add( JSON.stringify( resCreate ) );
						log.add( "npc " + id + " " + resCreate[0].character_id + " created" );
						
						syncSQL.q(
								"call character_mark_active( " + resCreate[0].character_id + " )",
								function( res )
								{
									if( res.length == 0 )
									{
										log.addError( "Profile not found: " + id );
										
										return;
									}
									
									log.add( "npc " + id + " " + resCreate[0].character_id + " active" );
									
									var npcObject = npc.createNPC({
																	properties: res,
																	realm: buffObject.getRealm()
																});
									
									npcObject.bindToInstance( buffObject.getRealm().getInstance( instanceID ) );
									
									log.add( "Initialized char no " + id + " on instance " + instanceID );
									
									/*
									if( id % 985 == 0 )
									{
										log.addWarning( id + " mark hit" );
										setTimeout( function()
										{
											for(var i=id+15;i<id+999;i++)
											{
												if( ++createdChars >= 40 )
												{
													buffObject.getRealm().addInstance( ++lastCreatedInstanceID );
													createdChars = 0;
													
													//log.add( "Created instance " + lastCreatedInstanceID );
												}
												
												_createNPC( i, lastCreatedInstanceID );
											}
										}, 10000 );
									}
									*/
									
									//log.add( "Starting movement" );
									setInterval( function()
														{
															_moveIterations++;
															
															npcObject.command_move( 50, Math.random() * 1000, Math.random() * 1000 );
														}, 200 );
								}
							);
					}
				);
		}
		
		var lastCreatedInstanceID = 2, createdChars = 0;
		
		syncSQL.q(
				"delete from `characters` where `character_id` > 228",
				function( res )
				{
					for(var i=1;i<2500;i++)
					{
						if( ++createdChars >= 40 )
						{
							buffObject.getRealm().addInstance( ++lastCreatedInstanceID );
							createdChars = 0;
							
							//log.add( "Created instance " + lastCreatedInstanceID );
						}
						
						//var spawn = require('child_process').spawn();
						
						//log.addNotice( "Spawned process: " + spawn.pid );
						
						_createNPC( i, lastCreatedInstanceID );
					}
				}
			);
		
		/*
		for(var i=1;i<2500;i++)
		{
			if( ++createdChars >= 40 )
			{
				buffObject.getRealm().addInstance( ++lastCreatedInstanceID );
				createdChars = 0;
				
				//log.add( "Created instance " + lastCreatedInstanceID );
			}
			
			_createNPC( i, lastCreatedInstanceID );
		}
		*/
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	