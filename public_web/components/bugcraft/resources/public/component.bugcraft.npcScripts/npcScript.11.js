	
	//
	// Farin ( 11 )
	// Level 10
	// Faction anterium
	// Assigned to Arthurius Keep ( 1 )
	//
	
	npcScript[ 11 ] = function( npcObject )
	{
		npcObject.events._add( "show", function()
		{
			npcObject.removeVisualEffect( spellEffects.vendorIcon );
			
			// create new chat bubble
			new spellEffects.vendorIcon({
												targetCharacter: npcObject,
												iconName: "anvil"
											});
			
			new spellEffects.ambientRadialSounds({
														targetCharacter: npcObject,
														streams:
														{
															20000: [ 'blacksmith1', 'blacksmith2' ]
														}
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
	