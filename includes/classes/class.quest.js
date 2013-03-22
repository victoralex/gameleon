
	var log = require( "./class.log" ),
		stats = require( "./class.stats" ),
		realmConfig = require('../config.realm').config;
		
	exports.startQuest =  function( args, after )
	{
		var _co = args.characterObject;
	
		var _resetQuestConditions = function()
		{
			var questConditionsToSend = {},
					resettedConditionsAmount = 0,
					_qObject = _co.getInstance().getArgs().questsData[ args.questId ],
					_qd = _qObject.conditions;
			
			if( _qd.length == 0 )
			{
				// quest is automatically completed
				
				// perform the starting script
				_qObject.script.questStart({
												questGiverObject: args.questGiverObject,
												characterObject: _co
											});
				
				// do the callback
				after( questConditionsToSend );
				
				return;
			}
			
			// we have conditions to fulfill
			
			for(var i in _qd )
			{
				questConditionsToSend[ i ] = {
												name: _qd[ i ].name,
												targetValue: _qd[i].targetValue,
												currentValue: 0
											};
				
				// reset the condition to zero
				_co.getInstance().redisClient.HSET(
													"quest." + args.questId, 
													_co.properties.character_id + "." + i,
													0,
													function( err, res )
													{
														if( err )
														{
															log.addError( "Quest condition reset error: " + err );
															
															return;
														}
														
														resettedConditionsAmount++;
														
														if( resettedConditionsAmount < _qd.length )
														{
															return;
														}
														
														_co.getInstance().redisClient.SREM(
																							"character." + _co.properties.character_id + ".questsCompleted",
																							args.questId,
																							function(err, res)
																							{
																								if( err )
																								{
																									log.addError( "Error deleting completed quest: " + err);
																									
																									return;
																								}
																								
																								// update stats
																								stats.incrementNoCallback({
																																characterObject: _co,
																																name: "lifetime_quests_started",
																																value: 1
																															});
																								
																								// perform the starting script
																								_qObject.script.questStart({
																																questGiverObject: args.questGiverObject,
																																characterObject: _co
																															});
																								
																								// do the callback
																								after( questConditionsToSend );
																							}
																						);
													}
												);
			}
		}
		
		if( _co.activeQuests.indexOf( args.questId ) >= 0 )
		{
			// this quest is already in the list of active quests
			
			//_resetQuestConditions();
			
			return false;
		}
		
		_co.getInstance().redisClient.SADD(
											"character." + _co.properties.character_id + ".questsActive",
											args.questId,
											function(err, res)
											{
												if( err )
												{
													log.addError( "Active quests add error: " + err);
													
													return;
												}
												
												_co.activeQuests.push( args.questId );
												
												_resetQuestConditions();
											}
										);
		
		return true;
	}
	
	// update a variabile belonging to one or more quests
	exports.questConditionUpdate = function( args )
	{
		var _co = args.characterObject;
		
		if( _co.properties.character_id_object_pool != null )
		{
			// NPC or Item
			
			return;
		}
		
		if( _co.activeQuests.indexOf( args.questId ) < 0 )
		{
			// the character does not have a quest having this condition
			
			log.add( "Character " + _co.properties.character_id + " - " + _co.properties.character_name + " does not have this quest" );
			
			return;
		}
		
		log.add( "quest." + args.questId + " - " + _co.properties.character_id + "." + args.parameterName + " - " + args.value );
		
		_co.getInstance().redisClient.HINCRBY(
												"quest." + args.questId, 
												_co.properties.character_id + "." + args.parameterName,
												args.value,
												function(err, newValue)
												{
													if( err )
													{
														log.addError( "Quest condition update error: " + err);
														
														return;
													}
													
													// send this update on the condition's channel
													_co.getInstance().redisClient.publish(
																							realmConfig.questServer.redisChannel,
																							'{"characterId":' + _co.properties.character_id + ',' +
																								'"questId":' + args.questId + ',' +
																								'"parameterName":"' + args.parameterName + '",' +
																								'"value":' + newValue + '}'
																						);
												}
											);
	}
	
	exports.abandonQuest =  function( args, after )
	{
		var _co = args.characterObject, _qObject = _co.getInstance().getArgs().questsData[ args.questId ];
		
		// remove the quest from the character's active list
		_co.activeQuests.splice( _co.activeQuests.indexOf(args.questId), 1);
		
		_co.getInstance().redisClient.SREM(
											"character." + _co.properties.character_id + ".questsActive",
											args.questId,
											function(err, res)
											{
												if( err )
												{
													log.addError( "Error removing the quest from the character's active quests " + err );
													
													return;
												}
												
												_co.getInstance().redisClient.SREM(
																					"character." + _co.properties.character_id + ".questsCompleted",
																					args.questId,
																					function(err, res)
																					{
																						if( err )
																						{
																							log.addError( "Error removing the quest from the character's active quests " + err );
																							
																							return;
																						}
																						
																						// perform the starting script
																						_qObject.script.questAbandon({
																														byCharacterObject: _co
																													});
																						
																						// update stats
																						stats.incrementNoCallback({
																														characterObject: _co,
																														name: "lifetime_quests_abandoned",
																														value: 1
																													});
												
																						after();
																					}
																				);
											}
										);
	}
	
	var checkIfCompleted = function( args, after )
	{
		var _co = args.characterObject;
		
		// check if this quest is marked as completed by the associated daemon
		_co.getInstance().redisClient.SISMEMBER(
												"character." + _co.properties.character_id + ".questsCompleted",
												args.questId,
												function( err, res )
												{
													if( err )
													{
														log.addError( err );
														
														return;
													}
													
													after( parseInt( res, 10 ) != 0 );
												}
											);
	}
	
	var checkIfDelivered = function( args, after )
	{
		var _co = args.characterObject;
		
		// check if this quest is marked as completed by the associated daemon
		_co.getInstance().redisClient.SISMEMBER(
												"character." + _co.properties.character_id + ".questsDelivered",
												args.questId,
												function( err, res )
												{
													if( err )
													{
														log.addError( err );
														
														return;
													}
													
													after( parseInt( res, 10 ) != 0 );
												}
											);
	}
	
	// make the check function public
	exports.checkIfCompleted = checkIfCompleted;
	exports.checkIfDelivered = checkIfDelivered;
	
	exports.markCompleted = function( args )
	{
		var //_co = args.characterObject,
				_cID = args.characterId,
				_rc = args.questServer.redisSpeaker;
		
		// all conditions passed. quest completed
		_rc.SADD(
				"character." + _cID + ".questsCompleted",
				args.questId,
				function(err, res)
				{
					if( err )
					{
						log.addError( err );
						return;
					}
					
					// send the message to the character
					_rc.PUBLISH(
								"character_" + _cID,
								'{"type":"quest", "action":"complete", "questId":' + args.questId + '}'
							);
					
					args.after();
					
					// update stats
					/*
					stats.incrementNoCallback({
													characterObject: _co,
													name: "lifetime_quests_started",
													value: 1
												});
					*/
				});
	}
	
	// mark quest as finalized. the quest has to already be marked as completed
	exports.finalizeQuest =  function( args, onNotFinalized, onSuccess )
	{
		var _co = args.characterObject, _rc = _co.getInstance().redisClient;
		
		var _deliverQuest = function( after )
		{
			if( _co.getInstance().getQuestInfo( args.questId ).quest_is_repeatable != null )
			{
				// repeatable quest
				
				// update stats
				stats.incrementNoCallback({
												characterObject: _co,
												name: "lifetime_quests_completed_repeatable",
												value: 1
											});
				
				after();
				
				return;
			}
			
			// non-repeatable quest
			
			_rc.SADD(
					"character." + _co.properties.character_id + ".questsDelivered",
					args.questId,
					function(err, res)
					{
						if( err )
						{
							log.addError( "Finalized quests add error: " + err);
							
							return;
						}
						
						after();
					}
				);
		}
		
		checkIfCompleted({
							characterObject: _co,
							questId: args.questId
						},
						function( isFinalized )
						{
							if( !isFinalized )
							{
								onNotFinalized();
								
								return;
							}
							
							//remove quest from the active list associated to this character								
							_rc.SREM(
									"character." + _co.properties.character_id + ".questsActive", 
									args.questId,
									function(err, res)
									{
										if( err )
										{
											log.addError( err );
											
											return;
										}
										
										_co.activeQuests.splice( _co.activeQuests.indexOf(args.questId), 1);
										
										//remove quest from completed list
										_rc.SREM(
												"character." + _co.properties.character_id + ".questsCompleted", 
												args.questId,
												function(err, res)
												{
													if( err )
													{
														log.addError( err );
														
														return;
													}
													
													_deliverQuest( function()
													{
														// remove the quest parameters. they will not be used anymore
														_rc.SMEMBERS(
																		"quest." + args.questId + ".parameterNameList",
																		function( err, questParamerterNameList )
																		{
																			// got the quest parameters
																			
																			// delete each parameter individually
																			for( var j = 0; j < questParamerterNameList.length; j++ )
																			{
																				_rc.HDEL(
																						"quest." + args.questId,
																						_co.properties.character_id + "." + questParamerterNameList[j],
																						function( err, res )
																						{
																							if( err )
																							{
																								log.addError( err );
																								
																								return;
																							}
																							
																							
																						}
																					);
																			}
																		}
																	);
														
														//
														// give the loot
														//
														
														var _questData = _co.getInstance().getQuestInfo( args.questId ), _cl = _co.properties.character_level, _levelRequired = 0;
														
														for(var i=0;i<_questData.conditionsGet.length;i++)
														{
															if( _questData.conditionsGet[ i ].qcg_parameter_name != "stats.character.[characterID]:level_current" )
															{
																continue;
															}
															
															_levelRequired = _questData.conditionsGet[ i ].qcg_parameter_value_min;
															
															break;
														}
														
														_co.modXP(
																( _questData.quest_award_xp == null ) ? _co.getAutoRewardXP( _cl, _levelRequired ) : _questData.quest_award_xp,
																function()
																{
																	_co.modGlory(
																				( _questData.quest_award_glory == null ) ? _co.getAutoRewardGlory( _cl, _levelRequired ) : _questData.quest_award_glory,
																				function()
																				{
																					_co.modPolen(
																									( _questData.quest_award_polen == null ) ? _co.getAutoRewardPolen( _cl ) : _questData.quest_award_polen,
																									function()
																									{
																										if( _questData.quest_award_amber != null )
																										{
																											_co.modAmber(
																															_questData.quest_award_amber,
																															function()
																															{
																																log.addNotice( "Player " + _co.properties.character_id + " received " + _questData.quest_award_amber + " amber" );
																															}
																														);
																										}
																										
																										// update stats
																										stats.incrementNoCallback({
																																	characterObject: _co,
																																	name: "lifetime_quests_completed",
																																	value: 1
																																});
																										
																										onSuccess();
																									}
																								);
																				}
																			);
																}
															);
													});
												}
											);
									}
								);
						}
					);
	}
	
	exports.getZoneQuestgiversByQuestID = function( args, after )
	{
		var _io = args.instanceObject;
		
		// send updates to the client, with changes to the NPCs bearing the same quest
		_io.getArgs().instanceProcess.sql.query(
													"select `characters`.`character_id` from `characters` " +
														" inner join `objects_pool_quests` on `characters`.`character_id_object_pool` = `objects_pool_quests`.`opq_id_object_pool` " +
														" where `objects_pool_quests`.`opq_id_quest` = " + args.questId + " and `characters`.`character_id_zone` = " + _io.zone_id,
													function( err, res )
													{
														if( err )
														{
															log.addError( "Questgivers bearing the same quest query error: " + err );
															
															return;
														}
														
														res.fetchAll( function( err, rows )
														{
															if( err )
															{
																log.addError( "Questgivers bearing the same quest fetch error: " + err );
																
																return;
															}
															
															after( rows );
														});
													}
												);
	}
	
	// get active quests per character
	exports.getActiveQuests = function( args, after )
	{
		var questsActive = {}, _co = args.characterObject, _evaluatedQuests = 0, _maxQuests = 0;
		
		// function will check the quest for validity against the character (_co) and set the proper values for loot
		var _getGetConditions = function( qID, after )
		{
			var _qa = questsActive[ qID ], _values = [], _valuesCaught = 0;
			
			// all the values have been caught, evaluate the results
			var _evaluateValues = function()
			{
				var _lc = _values[ "level_current" ], _cl = _co.properties.character_level;
				
				// set the level difference to emphasis the difficulty
				questsActive[ qID ].levelDifference = _lc.req - _lc.val;
				
				// set the XP reward
				questsActive[ qID ].quest_award_xp = ( questsActive[ qID ].quest_award_xp == null ) ? _co.getAutoRewardXP( _cl, _lc.req ) : questsActive[ qID ].quest_award_xp;
				
				// set the Glory reward
				questsActive[ qID ].quest_award_glory = ( questsActive[ qID ].quest_award_glory == null ) ? _co.getAutoRewardGlory( _cl, _lc.req ) : questsActive[ qID ].quest_award_glory;
				
				// set the polen reward
				questsActive[ qID ].quest_award_polen = ( questsActive[ qID ].quest_award_polen == null ) ? _co.getAutoRewardPolen( _cl ) : questsActive[ qID ].quest_award_polen;
				
				after();
			}
			
			// get the values for the requested character
			var _getCriteria = function( _cg )
			{
				var _pn = _cg.qcg_parameter_name.split( ":" );
				
				if( _cg.qcg_parameter_value_min != null )
				{
					// get the properties for the values for the character
					_co.getInstance().redisClient.HGET(
														_pn[ 0 ].replace( "[characterID]", _co.properties.character_id ),
														_pn[ 1 ],
														function( err, res )
														{
															if( err )
															{
																log.addError( "Quest get criteria get for qID " + qID + " (" + _cg.qcg_parameter_name + ") : " + err );
																
																return;
															}
															
															_values[ _pn[ 1 ] ] = {
																					req: _cg.qcg_parameter_value_min,
																					val: parseInt( res )
																				};
															
															_valuesCaught++;
															
															if( _valuesCaught < _qa.conditionsGet.length )
															{
																return;
															}
															
															// all values caught. we can now evaluate them
															_evaluateValues();
														}
													);
				}
				else
				{
					// set search
					_co.getInstance().redisClient.SISMEMBER(
															_pn[ 0 ].replace( "[characterID]", _co.properties.character_id ),
															_pn[ 1 ],
															function( err, res )
															{
																if( err )
																{
																	log.addError( "Quest set get criteria get for qID " + i + ": " + err );
																	
																	return;
																}
																
																_values[ _cg.qcg_parameter_name ] = {
																							req: 1,
																							val: parseInt( res )
																						};
																
																_valuesCaught++;
																
																if( _valuesCaught < _qa.conditionsGet.length )
																{
																	return;
																}
																
																// all values caught. we can now evaluate them
																_evaluateValues();
															}
														);
				}
			}
			
			for(var j=0;j<_qa.conditionsGet.length;j++)
			{
				_getCriteria( _qa.conditionsGet[ j ] );
			}
		}
		
		var _populateConditionsWithCurrentValues = function( qID, after )
		{
			var _qc = questsActive[ qID ].conditions, conditionsRemaining = _qc.length;
			
			var _getValueForActiveQuestParameter = function( args )
			{
				_co.getInstance().redisClient.HGET(
														"quest." + qID,
														_co.properties.character_id + "." + args.condition, 
														function(err, res)
														{
															if( err )
															{
																log.addError( "_getValueForActiveQuestParameter: " + err );
																
																return;
															}
															
															// set the value for this parameter
															if( res != null )
															{
																questsActive[ qID ].conditions[ args.condition ].currentValue = res;
															}
															
															args.after();
														}
													);
			}
			
			for(var i in _qc)
			{
				_getValueForActiveQuestParameter({
													condition: i,
													after: function()
													{
														conditionsRemaining--;
														
														if( conditionsRemaining > 0 )
														{
															return;
														}
														
														// get the "get" criteria
														_getGetConditions(
																		qID,
																		after
																	);
													}
												});
			}
		}
		
		if( _co.activeQuests.length <= 0 )
		{
			// no quests in the log
			
			after( {} );
			
			return;
		}
		
		// fetch quests data
		for(var i=0;i<_co.activeQuests.length;i++)
		{
			var _qID = _co.activeQuests[ i ], _aqds = _co.getInstance().getQuestInfo( _qID );
			
			_maxQuests++;
			
			questsActive[ _qID ] = {
										questId: _qID,
										quest_is_repeatable: _aqds.quest_is_repeatable,
										quest_is_daily: _aqds.quest_is_daily,
										name: _aqds.quest_name,
										description: _aqds.quest_description,
										objectives: _aqds.quest_objectives,
										quest_award_xp: _aqds.quest_award_xp,
										quest_award_glory: _aqds.quest_award_glory,
										quest_award_polen: _aqds.quest_award_polen,
										quest_award_amber: _aqds.quest_award_amber,
										conditions: {},
										conditionsGet: _aqds.conditionsGet
									};
			
			var _conditions = _aqds.conditions;
			for( var j in _conditions )
			{
				var _condition = _conditions[j];
				questsActive[ _qID ].conditions[j] = ({
														name: _condition.name,
														currentValue: 0,
														targetValue: _condition.targetValue,
													});
			}
			
			_populateConditionsWithCurrentValues( _qID, function()
			{
				_evaluatedQuests++;
				
				if( _evaluatedQuests < _maxQuests )
				{
					return;
				}
				
				// all quests have been evaluated
				after( questsActive );
			});
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	