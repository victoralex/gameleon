	
	"use strict";

	var log = require( "./class.log" ),
		stats = require( "./class.stats" ),
		realmConfig = require('../config.realm').config;
	
	exports.getAchievementsProgress = function( args, after )
	{
		var achievementsProgress = {}, _co = args.characterObject, _evaluatedAchievements = 0, _maxAchievements = 0;
		
		var _populateConditionsWithCurrentValues = function( aID, after )
		{
			var _ac = achievementsProgress[ aID ].conditions, conditionsRemaining = Object.keys( _ac ).length;
			
			var _getValueForActiveAchievementParameter = function( args )
			{
				_co.getInstance().redisClient.HGET(
														"achievement." + aID,
														_co.properties.character_id + "." + args.condition, 
														function(err, res)
														{
															if( err )
															{
																log.addError( "_getValueForActiveAchievementParameter: " + err );
																
																return;
															}
															
															// set the value for this parameter
															if( res != null )
															{
																achievementsProgress[ aID ].conditions[ args.condition ].currentValue = res;
															}
															
															args.after();
														}
													);
			}
			
			for(var i in _ac)
			{
				_getValueForActiveAchievementParameter({
													condition: i,
													after: function()
													{
														conditionsRemaining--;
														
														if( conditionsRemaining > 0 )
														{
															return;
														}
														
														after();
													}
												});
			}
		}
		
		var _processAchievement = function( achievementId )
		{
			var ad = achievementsData[ achievementId ];
			
			_maxAchievements++;
			
			_co.getInstance().redisClient.SISMEMBER(
														"character." + _co.properties.character_id  + ".achievementsFinalized",
														achievementId,
														function( err, res )
														{
															if( err )
															{
																log.addError( "Completed achievements fetch error: " + err );
																
																return;
															}
															
															achievementsProgress[ achievementId ] = {
																										status: res,
																										achievementId: achievementId,
																										name: ad.achievement_name,
																										description: ad.achievement_description,
																										objectives: ad.achievement_objectives,
																										conditions: {}
																									};
															
															var _conditions = ad.conditions;
															for( var j in _conditions )
															{
																var _condition = _conditions[j];
																achievementsProgress[ achievementId ].conditions[j] = ({
																																				name: _condition.name,
																																				currentValue: 0,
																																				targetValue: _condition.targetValue,
																																			});
															}
															
															_populateConditionsWithCurrentValues( 
																												achievementId,
																												function()
																												{
																													_evaluatedAchievements++;
																													
																													if( _evaluatedAchievements < _maxAchievements )
																													{
																														return;
																													}
																													
																													// all achievements have been evaluated
																													after( achievementsProgress );
																												}
																											);
														}
													);
		}
		
		// fetch achievements data
		var achievementsData = _co.getInstance().getAchievementsData();
		for(var achievementId in achievementsData )
		{
			_processAchievement( achievementId );
		}
	}
	
	// update a variabile belonging to one or more quests
	exports.achievementConditionUpdate = function( args )
	{
		var _co = args.characterObject;
		
		//log.add( "achievement." + args.achievementId + " - " + _co.properties.character_id + "." + args.parameterName + " - " + args.value );
		
		// send this update on the condition's channel
		_co.getInstance().redisClient.publish(
												realmConfig.achievementServer.redisChannel,
												'{"characterId":' + _co.properties.character_id + ',' +
													'"achievementId":' + args.achievementId + ',' +
													'"parameterName":"' + args.parameterName + '",' +
													'"value":' + args.value + '}'
											);
	}
	
	// mark quest as finalized and give notice
	exports.finalizeAchievement =  function( args )
	{
		var _cID = args.characterId,
			_rc = args.achievementServer.redisSpeaker;
		
		// all conditions passed. quest completed
		_rc.SADD(
				"character." + _cID + ".achievementsFinalized",
				args.achievementId,
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
								'{"type":"achievement", "action":"finalized", "achievementId":' + args.achievementId + '}'
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	