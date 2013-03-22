	
	//
	// Tamerkhan ( 23 )
	// Level 1
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 23 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			npcObject.removeVisualEffect( spellEffects.vendorIcon );
			
			// create new chat bubble
			new spellEffects.vendorIcon({
												targetCharacter: npcObject,
												iconName: "blacksmith"
											});
		});
		
		npcObject.events._add( "hide", function()
		{
			npcObject.removeVisualEffect( spellEffects.vendorIcon );
		});
		
		npcObject.events._add( "use", function( pageContext )
		{
			Component.bugcraft.pageVendor( npcObject, pageContext );
		});
	}
	