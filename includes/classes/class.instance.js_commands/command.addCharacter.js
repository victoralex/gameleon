	
	var instance = require('../class.instance').instance,
			character = require('../class.character').character,
			syncSQL = new (require('../class.syncSQL')).p,
			chatChannel = require( "../class.chatChannel" ),
			log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var _iO = args.instanceProcess.instanceObject;
		
		syncSQL.q(
				"call character_mark_active(" + args.res.user_id + ", " + args.res.character_id + ")",
				function( profileResult )
				{
					if( profileResult.length == 0 )
					{
						log.addWarning( "Profile not found: " + args.res.character_id );
						
						return;
					}
					
					// get the permanent buffs and character profile. the buffs are by definition castable or character bound
					
					args.sql.query(
							"select * from `character_applied_buffs_full` where `cb_id_character` = " + args.res.character_id,
							function( err, queryResult )
							{
								if( err )
								{
									log.addError( "character_applied_buffs_full fetch error: " + err );
									
									return;
								}
								
								queryResult.fetchAll( function( err, rows )
								{
									if( err )
									{
										log.addError( "Active buffs fetch error: " + err );
										
										return;
									}
									
									args.sql.query(
											"select * from `character_spellbook_full` where `cs_id_character` = " + args.res.character_id,
											function( err, queryResult )
											{
												if( err )
												{
													log.addError( "character_spellbook_full fetch error: " + err );
													
													return;
												}
												
												queryResult.fetchAll( function( err, spellBookRows )
												{
													if( err )
													{
														log.addError( "SpellBook buffs fetch error: " + err );
														
														return;
													}
													
													// create the actual character
													new character({
																		properties: profileResult,
																		activeBuffs: rows,
																		spellBookBuffs: spellBookRows,
																		characterProgression: _iO.getArgs().characterProgression,
																	},
																	function( _result )
																	{
																		_result.bindToInstance(
																						_iO,
																						function()
																						{
																							// character specific data
																							
																							_result.connectToRedis(function()
																							{
																								// subscribe to instance specific channels
																								chatChannel.subscribeToSpecialChannel({
																																characterObject: _result,
																																channelType: "say",
																																after: function()
																																{
																																	chatChannel.subscribeToSpecialChannel({
																																									characterObject: _result,
																																									channelType: "yell",
																																									after: function()
																																									{
																																										// join the instance main channel
																																										chatChannel.joinInstanceChannel({
																																																			characterObject: _result,
																																																			channelName: "general"
																																																		});
																																										
																																										_result.resumeAppliedActiveBuffs();				// will resume the current user's applied buffs
																																										_result.resumeSpellbookCooldowns();			// will resume the current user's cooldowns
																																										
																																										// command done. notify the realm
																																										process.send({
																																														cmd: args.res.cmd,
																																														id: args.id,
																																														data: {
																																															cn: profileResult[0].character_name,
																																															r: 200
																																														}
																																													});
																																										
																																										// send the message to the client
																																										_result.sendToClient( JSON.stringify({
																																																					c: "characterActive",
																																																					r: 200,
																																																					characterData: _result.properties,
																																																					assignedZoneID: _iO.zone_id,
																																																					assignedZonePoolID: _iO.zone_id_zone_pool,
																																																					assignedZoneRules: _iO.zoneData.zp_type,
																																																					assignedSurface: _iO.getSurface(),
																																																					assignedZoneName: _iO.zoneData.zp_name,
																																																					tic_interval: _iO.tic_interval
																																																				}) );
																																									}
																																								});
																																}
																															});
																								
																							});
																						}
																					);
																	}
																);
												});
											}
										);
								});
							});
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	