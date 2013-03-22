
	var log = require( "../class.log" ),
		quest = require( "../class.quest" );
	
	exports.performCommand = function( args )
	{
		var _ch = args.instanceObject.characters, _c = _ch[ args.res.__characterID ];
		
		quest.abandonQuest({
								characterObject: _c,
								questId: parseInt(args.res.questId, 10)
							},
							function()
							{
								_c.sendToClient( JSON.stringify({
																	c: "questAbandon",
																	r: 200,
																	questId: args.res.questId
																}) );
								
								quest.getZoneQuestgiversByQuestID({
																			instanceObject: args.instanceObject,
																			questId: args.res.questId
																		},
																		function( questGivers )
																		{
																			var _getQuests = function( _qg )
																			{
																				_qg.getQuests( _c, function( quests )
																				{
																					_c.sendToClient( JSON.stringify({
																															c: "questGiverUpdate",
																															cid: _qg.properties.character_id,
																															q: quests,
																															r: 200
																														}) );
																				});
																			}
																			
																			for(var i=0;i<questGivers.length;i++)
																			{
																				var _qg = _ch[ questGivers[ i ].character_id ];
																				
																				_getQuests( _qg );
																			}
																		});
							}
						);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	