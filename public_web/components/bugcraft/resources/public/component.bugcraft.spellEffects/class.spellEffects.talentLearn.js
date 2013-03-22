
	spellEffects.talentLearn = function( args )
	{
		setTimeout( function()
							{
								new spellEffects.talentLearnSecondPart({ 
									sourceCharacter: args.sourceCharacter,
									targetCharacter: args.targetCharacter,
									component: 0,
								});							
								new spellEffects.talentLearnSecondPart({ 
									sourceCharacter: args.sourceCharacter,
									targetCharacter: args.targetCharacter,
									component: 1,
								});			
								new spellEffects.talentLearnThirdPart({ 
									sourceCharacter: args.sourceCharacter,
									targetCharacter: args.targetCharacter,
									component: 0,
								});
								
							
							}, 1000 );
		
		new spellEffects.talentLearnFirstPart({
			sourceCharacter: args.sourceCharacter,
			targetCharacter: args.targetCharacter,
		});
	} //end talentLearn