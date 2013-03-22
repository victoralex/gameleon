
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		var _charsArray = [], _chars = args.instanceObject.characters;
		
		var _getQuests = function( _characterObject )
		{
			// this is a questgiver. get quests in relationship to the character requesting this
			_characterObject.getQuests( _c, function( quests )
			{
				if( Object.keys( quests ).length == 0)
				{
					// no quests from this questgiver
					
					return;
				}
				
				_c.sendToClient( JSON.stringify({
													c: "questGiverUpdate",
													cid: _characterObject.properties.character_id,
													q: quests,
													r: 200
												}) );
			});
		}
		
		// list all chars in the instance
		for(var i in _chars)
		{
			if(
				_chars[i].properties.character_is_alive != _c.properties.character_is_alive
			)
			{
				// skip characters which are in a different state as i am, or are myself (i should already know my data by now)
				
				continue;
			}
			
			if( _chars[ i ].properties.character_is_vendor != null )
			{
				//_chars[ i ].getVendorInventory();
			}
			
			if( _chars[ i ].properties.character_is_questgiver != null )
			{
				_getQuests( _chars[ i ] );
			}
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	