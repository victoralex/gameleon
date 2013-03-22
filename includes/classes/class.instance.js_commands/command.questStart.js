
	var log = require( "../class.log" ),
		quest = require( "../class.quest" );
	
	exports.performCommand = function( args )
	{
		var _ch = args.instanceObject.characters, _c = _ch[ args.res.__characterID ], _qGO = _ch[ args.res.questGiverID ];
		
		if(
			typeof args.res.questId == "undefined"
			|| typeof args.res.questGiverID == "undefined"
			|| /^[0-9]+$/.test( args.res.questId ) == false
			|| /^[0-9]+$/.test( args.res.questGiverID ) == false
			|| typeof _qGO == "undefined"
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		var _qID = args.res.questId;
		
		if( !quest.startQuest({
							questGiverObject: _qGO,
							characterObject: _c,
							questId: parseInt(_qID, 10)
						},
						function( questConditionsToSend )
						{
							// update the client on its request
							var _updateClient = function()
							{
								_c.sendToClient( JSON.stringify({
																	c: args.res.c,
																	r: 200,
																	questId: _qID,
																	questConditions: questConditionsToSend
																}) );
								
								quest.getZoneQuestgiversByQuestID({
																			instanceObject: args.instanceObject,
																			questId: _qID
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
							
							if( questConditionsToSend == {} )
							{
								quest.markCompleted({
														characterObject: _c,
														questID: _qID,
														after: _updateClient
													});
								
								return;
							}
							
							_updateClient();
						})
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 300,
												questId: _qID
											}) );
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	