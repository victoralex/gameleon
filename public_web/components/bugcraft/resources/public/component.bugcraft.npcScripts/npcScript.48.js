	
	//
	// Purveyor Beetrice	( 48 )
	// Level 1
	// Faction hegemony
	// Assigned to Fort Saltre ( 2 )
	//
	
	npcScript[ 48 ] = function( npcObject )
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
	