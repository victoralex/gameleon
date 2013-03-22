
	var spellScenario = {
		
		parallel: function( args )
		{
			new args.effect1({
						sourceCharacter: args.sourceCharacter,
						targetCharacter: args.sourceCharacter,
						text: args.text
					});
					
			//in order to feel the fact that your spell has an effect, the effect on the target is seen after a delay of 300 ms
			setTimeout( function() {
									new args.effect2({
												sourceCharacter: args.sourceCharacter,
												targetCharacter: args.targetCharacter,
												text: args.text
											});
							}, 200);
		},
		
		cascade: function( args )
		{
			if ( args.targetCharacter != args.sourceCharacter )
			{
				new args.effect1({
							sourceCharacter: args.sourceCharacter,
							targetCharacter: args.targetCharacter,
							text: args.text,
							afterFunction: 	function()
													{
														new args.effect2({
																	sourceCharacter: args.sourceCharacter,
																	targetCharacter: args.targetCharacter,
																	text: args.text
																});
													}
						});
			}
			else
			{
				new args.effect2({
					sourceCharacter: args.sourceCharacter,
					targetCharacter: args.targetCharacter,
					text: args.text
				});
			}
		}
		
	};