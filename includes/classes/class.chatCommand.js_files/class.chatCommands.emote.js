	
	var log = require( "../class.log" ),
			stats = require( "../class.stats" );
	
	exports.performCommand = function( args )
	{
		var _c = args.characterObject;
		
		if(
			typeof args.res.parameters == "undefined"
			|| typeof args.res.parameters.emoteName == "undefined"
			|| typeof args.res.parameters.text == "undefined"
			|| /^[a-z]+$/.test( args.res.parameters.emoteName ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: "characterEmote",
												r: 300
											}) );
			
			return;
		}
		
		_c.addHistory({
						c: "character_emote",
						e: args.res.parameters.emoteName,
						t: args.res.parameters.text
					});
		
		_c.sendToClient( JSON.stringify({
											c: "characterEmote",
											r: 200
										}) );
		
		//
		// stats
		//
		
		stats.incrementNoCallback({
										characterObject: _c,
										name: "lifetime_emotes_given",
										value: 1
									});
		
		stats.incrementNoCallback({
										characterObject: _c,
										name: "lifetime_emote_given_" + args.res.parameters.emoteName,
										value: 1
									});
		
		if( 
			typeof args.res.parameters.target != "undefined"
			&& /^[0-9]+$/.test( args.res.parameters.target )
			&& args.instanceObject.characters[ args.res.parameters.target ]
		)
		{
			var _targetCharacterObject = args.instanceObject.characters[ args.res.parameters.target ];
			
			stats.incrementNoCallback({
											characterObject: _targetCharacterObject,
											name: "lifetime_emotes_received",
											value: 1
										});
			
			stats.incrementNoCallback({
											characterObject: _targetCharacterObject,
											name: "lifetime_emote_received_" + args.res.parameters.emoteName,
											value: 1
										});
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	