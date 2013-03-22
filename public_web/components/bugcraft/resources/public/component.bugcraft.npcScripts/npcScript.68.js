	
	//
	// Smith Voulge ( 68 )
	// Level 10
	// Faction anterium
	// Assigned to Arthurius Keep ( 1 )
	//
	
	npcScript[ 68 ] = function( npcObject )
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
	