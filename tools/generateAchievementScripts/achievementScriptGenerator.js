	
	var realmConfig = require('../../includes/config.realm').config,
		fs = require( "fs" ),
		log = require( '../../includes/classes/class.log' ),
		redis = require(realmConfig.libraries.redisPath),
		sql = require(realmConfig.libraries.mysqlPath).createConnectionSync(),
		path = require('path');
	
	
	var _createAchievementScript = function( args )
	{
		var _serverTemplateLocation = "../../includes/classes/class.achievement.js_files/achievement." + args.achievementId + ".js";
		
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
										_tc.toString().replace( /\[ACHIEVEMENTID\]/g, args.achievementId ).replace( /\[ACHIEVEMENTNAME\]/g, args.achievementName ).replace( /\[ACHIEVEMENTNRCONDITIONS\]/g, args.conditionCount ).replace( /\[ACHIEVEMENTCONDITIONS\]/g, args.conditionsData ),
										function( err )
										{
											if( err )
											{
												log.addError( "Template write error: " + err );
												
												return;
											}
											
											log.addNotice( "Default script written for " + args.achievementId + " @ " + _tl );
										}
									);
							
							return;
						}
						
						log.add( "Script for achievement " + args.achievementName + " ( " + args.achievementId + " ) already exists @ " + _tl );
					}
				);
		}
		
		_writeTemplate( _serverTemplateLocation, args.serverTemplate );
	}
	
	fs.readFile('template.server.js', function(err, templateServer)
	{
		if(err)
		{
			log.addError( "Server template read error: " + err );
			
			return false;
		}
		
			// connect to the database
			sql.connectSync( realmConfig.realmDatabaseHost, realmConfig.realmDatabaseUser, realmConfig.realmDatabasePass, realmConfig.realmDatabaseDB );
			
			sql.query(
						"SELECT `achievements`.`achievement_id`, `achievements`.`achievement_name`, `achievement_conditions_finalize`.`acf_parameter_name`, `achievement_conditions_finalize`.`acf_name`, `achievement_conditions_finalize`.`acf_parameter_value_max` " +
						" FROM `achievements` " +
						" left join `achievement_conditions_finalize` on `achievements`.`achievement_id` = `achievement_conditions_finalize`.`acf_id_achievement` " + 
						" order by `achievements`.`achievement_id`",
						function( err, achievementsData )
						{
							if( err )
							{
								log.addError( "Objects query error: " + err );
								
								return;
							}
							
							achievementsData.fetchAll( function( err, achievementsDataRows )
							{
								if( err )
								{
									log.addError( "Achievement fetch error: " + err );
									
									return;
								}
								/*
								for(var i=0;i<achievementsDataRows.length;i++)
								{
									_createAchievementScript({
													data: achievementsDataRows[ i ],
													serverTemplate: templateServer
												});
								}
								*/
								var lastAchievementId = -1;
								var conditionsInserted = 0;
								var conditionCount = 0;
								var conditionsData = "";
								
								for( var i = 0; i < achievementsDataRows.length; i++ )
								{
									if( lastAchievementId != achievementsDataRows[i].achievement_id )
									{
										if( lastAchievementId != -1 )
										{
											_createAchievementScript({
																achievementId: achievementsDataRows[i-1].achievement_id,
																achievementName: achievementsDataRows[i-1].achievement_name,
																conditionCount: conditionCount,
																conditionsData: conditionData,
																serverTemplate: templateServer
															});
										}
										// new achievement in the sql list
										lastAchievementId = achievementsDataRows[i].achievement_id;
										
										conditionCount = 0;
										conditionData = "";
									}
									
									conditionData += "this.conditions['" + achievementsDataRows[i].acf_parameter_name + "'] = new achievementCondition({parameterName:'" + achievementsDataRows[i].acf_parameter_name +
																																				"', targetValue:" + achievementsDataRows[i].acf_parameter_value_max +
																																				", achievement: self" + 
																																				", achievementServer: args.achievementServer});";
									conditionCount++;
								}
								
								_createAchievementScript({
														achievementId: achievementsDataRows[i-1].achievement_id,
														achievementName: achievementsDataRows[i-1].achievement_name,
														conditionCount: conditionCount,
														conditionsData: conditionData,
														serverTemplate: templateServer
													});
							});
						}
					);
	});