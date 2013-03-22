
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var characterObject = args.instanceObject.characters[ args.res.__characterID ];
		
		var _charsArray = [], _chars = args.instanceObject.characters;
		
		for(var i in _chars)
		{
			if(
				_chars[i].properties.character_is_alive != characterObject.properties.character_is_alive
				|| ( _chars[ i ].properties.character_is_stealth != null && instanceObject.charactersCompareFriendRelationship( self, _c ) == false 
				|| _chars[i].mayBroadcast == false )	// stealth and enemy
			)
			{
				// skip characters which are in a different state as i am,
				// or are stealth
				
				continue;
			}
			
			var _profile = _chars[i].getMinimalProfile();
			_profile.cid = _chars[i].properties.character_id;
			
			_charsArray.push( _profile );
		}
		
		//args.ws.characterObject.last_update = args.ws.instanceObject.history - 1;
		
		characterObject.sendToClient( JSON.stringify({
																c: args.res.c,
																r: 200,
																zoneCharacters: _charsArray
															}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	