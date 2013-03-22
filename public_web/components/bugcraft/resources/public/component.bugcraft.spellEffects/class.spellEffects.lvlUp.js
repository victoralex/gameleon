
	spellEffects.lvlUp = function( args )
	{
		new spellEffects.lvlUpFirstPart({
			sourceCharacter: args.sourceCharacter,
			targetCharacter: args.targetCharacter,
			component: 0,
		});
		new spellEffects.lvlUpFirstPart({ 
			sourceCharacter: args.sourceCharacter,
			targetCharacter: args.targetCharacter,
			component: 1,
		});
		new spellEffects.lvlUpSecondPart({ 
			sourceCharacter: args.sourceCharacter,
			targetCharacter: args.targetCharacter,
			component: 0,
		});
		new spellEffects.lvlUpSecondPart({ 
			sourceCharacter: args.sourceCharacter,
			targetCharacter: args.targetCharacter,
			component: 1,
		});
		new spellEffects.lvlUpSecondPart({ 
			sourceCharacter: args.sourceCharacter,
			targetCharacter: args.targetCharacter,
			component: 2,
		});					
		new spellEffects.lvlUpThirdPart({ 
			sourceCharacter: args.sourceCharacter,
			targetCharacter: args.targetCharacter,
			component: 0,
		});
		new spellEffects.lvlUpThirdPart({ 
			sourceCharacter: args.sourceCharacter,
			targetCharacter: args.targetCharacter,
			component: 1,
		});
	} //end spinning aura