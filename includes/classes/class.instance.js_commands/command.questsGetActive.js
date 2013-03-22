
	var log = require( "../class.log" ),
		quest = require( "../class.quest" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		quest.getActiveQuests(
								{
									characterObject: _c
								},
								function( questsActive )
								{
									_c.sendToClient( JSON.stringify({
																		c: args.res.c,
																		q: questsActive
																	}) );
								}
							);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	