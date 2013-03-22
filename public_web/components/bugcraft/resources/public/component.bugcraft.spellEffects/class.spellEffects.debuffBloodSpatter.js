	
	spellEffects.debuffBloodSpatter = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 20;
		this.offsetY = 30;
		this.rotation = Math.random() * (Math.PI * 2);
		this.deleteRange = 60;
		this.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY;
		this.duration = 15000 - Component.bugcraft.latency;
		
		var self = this;
		
		var debuffBloodSpatterImageObject = new Image();
		debuffBloodSpatterImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/splash/blood_spatter11.png';
		
		var debuffBloodSpatterSound = soundManager.createSound({
				id: 'debuffBloodSpatter' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/splash/blood_splatter.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( debuffBloodSpatterSound ) - 1;
		
		soundManager.play( 'debuffBloodSpatter' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the debuffBloodSpatter spatter
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.drawImage(
							debuffBloodSpatterImageObject,
							args.targetCharacter.characterData.character_zone_x + Map.viewPortX - self.offsetX,
							args.targetCharacter.characterData.character_zone_y + Map.viewPortY - self.offsetY
						);
						
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;	
					
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the debuffBloodSpatter
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var i = 2;
		
		var _animateFunction = function()
							{
								if ( i > 3)
								{
									i = 1;
									
									debuffBloodSpatterImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/splash/blood_spatter1' + i++ +'.png';
								
									_animateFunctionPointer = setTimeout( _animateFunction, 250 );
								}
								else
								{
									debuffBloodSpatterImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/splash/blood_spatter1' + i++ +'.png';
									
									_animateFunctionPointer = setTimeout( _animateFunction, 120 );
								}
							}
		
		var _animateFunctionPointer = setTimeout( _animateFunction, 10 );
		
		setTimeout( function() 
								{ 
									clearTimeout( _animateFunctionPointer );
									
									var _t = setInterval( function()
																		{
																			self.alpha -= 0.1;
																			
																			if( self.alpha > 0 )
																			{
																				return;
																			}
																			
																			self.remove();
																			
																			clearInterval( _t );
																			
																		}, 40 );
								}, self.duration );
		
	} //end debuffBloodSpatter