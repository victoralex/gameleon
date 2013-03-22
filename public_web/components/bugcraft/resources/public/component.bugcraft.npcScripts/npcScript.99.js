	
	//
	// Hegemony Tower ( 99 )
	// Level 1
	// Faction hegemony
	// Assigned to Jungle Camps ( 7 )
	//
	
	npcScript[ 99 ] = function( npcObject )
	{
		var _showedDeathAnimation = false;
		
		npcObject.events._add( "damageTake", function()
		{
			if( npcObject.characterData.character_hp_current > 0 || _showedDeathAnimation == true )
			{
				return;
			}
			
			_showedDeathAnimation = true;
			
			npcObject.setSkin( "corpse" );
			
			new spellEffects.towerExplosion({
													targetCharacter: npcObject
												});
		});
	}
	