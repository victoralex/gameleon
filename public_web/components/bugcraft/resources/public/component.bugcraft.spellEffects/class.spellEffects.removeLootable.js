
	spellEffects.removeLootable = function( args )
	{
		var _iSpellEffects = args.targetCharacter._internal.spellEffects;
			
		for( var i in _iSpellEffects )
		{
			var spellEffectObject = _iSpellEffects[i].constructor;
			
			if( spellEffectObject != spellEffects.lootableComplete )
			{
				continue;
			}
			
			// effect needs to be removed
			
			_iSpellEffects[i].remove();
		}
	}