	
	//
	// Beetle Summoner (Left) ( 91 )
	// Level 1
	// Faction null
	// Assigned to Fortress Assault ( 9 )
	//
	
	npcScript[ 91 ] = function( npcObject )
	{
		var _changeSkin = function()
		{
			if( npcObject.characterData.character_is_usable == null )
			{
				npcObject.setSkin( "itemBeetleSummonerUnUsable" );
			}
			else
			{
				npcObject.setSkin( "itemBeetleSummonerUsable" );
			}
		}
		
		npcObject.events._add( "setUnusable", function()
		{
			_changeSkin();
		});
		
		npcObject.events._add( "setUsable", function()
		{
			_changeSkin();
		});
		
		npcObject.events._add( "show", function()
		{
			_changeSkin();
		});
		
		npcObject.events._add( "hide", function()
		{
			npcObject.removeVisualEffect( spellEffects.auraRevive );
		});
	}
	