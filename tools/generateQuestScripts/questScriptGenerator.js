	
	var realmConfig = require('../../includes/config.realm').config,
		fs = require( "fs" ),
		log = require( '../../includes/classes/class.log' ),
		redis = require(realmConfig.libraries.redisPath),
		sql = require(realmConfig.libraries.mysqlPath).createConnectionSync(),
		path = require('path');
	
	
	var _createQuestScript = function( args )
	{
		var _serverTemplateLocation = "../../includes/classes/class.quest.js_files/quest." + args.questId + ".js";
		var _clientTemplateLocation = "../../includes/classes/class.quest.js_files/questRealm." + args.questId + ".js";
		
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
										_tc.toString().replace( /\[QUESTID\]/g, args.questId ).replace( /\[QUESTNAME\]/g, args.questName ).replace( /\[QUESTNRCONDITIONS\]/g, args.conditionCount ).replace( /\[QUESTCONDITIONS\]/g, args.conditionsData ),
										function( err )
										{
											if( err )
											{
												log.addError( "Template write error: " + err );
												
												return;
											}
											
											log.addNotice( "Default script written for " + args.questId + " @ " + _tl );
										}
									);
							
							return;
						}
						
						log.add( "Script for quest " + args.questName + " ( " + args.questId + " ) already exists @ " + _tl );
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
							"SELECT `quests`.`quest_id`, `quests`.`quest_name`, `quest_conditions_finalize`.`qcf_parameter_name`, `quest_conditions_finalize`.`qcf_name`, `quest_conditions_finalize`.`qcf_parameter_value_max` " +
							" FROM `quests` " +
							" left join `quest_conditions_finalize` on `quests`.`quest_id` = `quest_conditions_finalize`.`qcf_id_quest` " + 
							" order by `quests`.`quest_id`",
							function( err, questsData )
							{
								if( err )
								{
									log.addError( "Objects query error: " + err );
									
									return;
								}
								
								questsData.fetchAll( function( err, questsDataRows )
								{
									if( err )
									{
										log.addError( "Quest fetch error: " + err );
										
										return;
									}
									/*
									for(var i=0;i<questsDataRows.length;i++)
									{
										_createQuestScript({
														data: questsDataRows[ i ],
														serverTemplate: templateServer
													});
									}
									*/
									var lastQuestId = -1;
									var conditionsInserted = 0;
									var conditionCount = 0;
									var conditionsData = "";
									
									for( var i = 0; i < questsDataRows.length; i++ )
									{
										if( lastQuestId != questsDataRows[i].quest_id )
										{
											if( lastQuestId != -1 )
											{
												_createQuestScript({
																	questId: questsDataRows[i-1].quest_id,
																	questName: questsDataRows[i-1].quest_name,
																	conditionCount: conditionCount,
																	conditionsData: conditionData,
																	serverTemplate: templateServer,
																	clientTemplate: templateClient
																});
											}
											// new quest in the sql list
											lastQuestId = questsDataRows[i].quest_id;
											
											conditionCount = 0;
											conditionData = "";
										}
										
										conditionData += "this.conditions['" + questsDataRows[i].qcf_parameter_name + "'] = new questCondition.condition({parameterName:'" + questsDataRows[i].qcf_parameter_name +
																																						"', targetValue:" + questsDataRows[i].qcf_parameter_value_max +
																																						", quest: self" + 
																																						", questServer: args.questServer});";
										conditionCount++;
									}
									
									_createQuestScript({
															questId: questsDataRows[i-1].quest_id,
															questName: questsDataRows[i-1].quest_name,
															conditionCount: conditionCount,
															conditionsData: conditionData,
															serverTemplate: templateServer,
															clientTemplate: templateClient
														});
								});
							}
						);
		});
	});
	



/*
	var	realmConfig = require('../includes/config.realm').config,
		fs = require('fs'),
		log = require( "../includes/classes/class.log" ),
		sql = require(realmConfig.libraries.mysqlPath).createConnectionSync(),
		path = require('path');
	
	sql.connectSync( realmConfig.realmDatabaseHost, realmConfig.realmDatabaseUser, realmConfig.realmDatabasePass, realmConfig.realmDatabaseDB );
	
	
	var fileContentTop = "var log = require('../class.log'), realmConfig = require('../../config.realm').config, redis = require( realmConfig.libraries.redisPath ), questCondition = require('../class.questCondition');"
	fileContentTop += "exports.quest = function(){ var self = this; this.redisClient = redis.createClient(); this.conditions = [];";
	
	var fileContents = "";
	
	var writeFile = function( id )
	{
		fileContents += "}";
		
		//if( path.existsSync( '../includes/classes/class.quest.js_files/quest_' + id + '.js' ) == false )
		{
			fs.writeFileSync(
						'../includes/classes/class.quest.js_files/quest_' + id + '.js',
						fileContents
					);
		}
		
		if( path.existsSync( '../includes/classes/class.quest.js_files/questRealm_' + id + '.js' ) == false )
		{
			fs.writeFileSync(
						'../includes/classes/class.quest.js_files/questRealm_' + id + '.js',
						"var log = require( '../class.log' )\n\n\nexports.questStart = function( args ) {}\n\nexports.questAbandon = function( args ) {}\n\nexports.questCompleted = function( args ) {}\n\nexports.questDelivered = function( args ) {}"
					);
		}
	}
	
	sql.query(
				"SELECT `quests`.`quest_id`, `quest_conditions_finalize`.`qcf_parameter_name`, `quest_conditions_finalize`.`qcf_name`, `quest_conditions_finalize`.`qcf_parameter_value_max` " +
					" FROM `quests` " +
					" left join `quest_conditions_finalize` on `quests`.`quest_id` = `quest_conditions_finalize`.`qcf_id_quest` " + 
					" order by `quests`.`quest_id`",
				function( err, questsData )
				{
					if( err )
					{
						log.addError( "Quest query error: " + err );
						
						return;
					}
					
					questsData.fetchAll( function( err, questsDataRows )
					{
						if( err )
						{
							log.addError( "Quest fetch error: " + err );
							
							return;
						}
						
						console.log(questsDataRows);
						
						var lastQuestId = -1;
						var conditionsInserted = 0;
						var conditionCount = 0;
						
						for( var i = 0; i < questsDataRows.length; i++ )
						{
							if( lastQuestId != questsDataRows[i].quest_id )
							{
								if( lastQuestId != -1 )
								{
									writeFile( lastQuestId );
								}
								// new quest in the sql list
								lastQuestId = questsDataRows[i].quest_id;
								
								conditionCount = 0;
								
								fileContents = fileContentTop;
								fileContents += "this.id = " + lastQuestId + ";";
							}
							
							fileContents += "this.conditions.push( new questCondition.condition({id:" + conditionCount +
																								", parameterName:'" + questsDataRows[i].qcf_parameter_name +
																								"', targetValue:" + questsDataRows[i].qcf_parameter_value_max +
																								", quest: self}));";
							conditionCount++;
						}
						
						writeFile( lastQuestId );
					});
				}
			);
*/			
	/*
	quests[1] = new function( args )
					{
						var self = this;
						this.id = 4;
						this.name = "Squirrel Killer";
						this.redisClient = redis.createClient();
						
						this.conditions = [];
						
						this.conditions[0] = new condition({
																id: 0,
																name: "quest_" + this.id + "_kills",
																targetValue: 10,
																quest: self
															});
													
						this.conditions[1] = new condition({
																id: 1,
																name: "quest_" + this.id + "_squirrel_kills",
																targetValue: 5,
																quest: self
															});
					}
	*/