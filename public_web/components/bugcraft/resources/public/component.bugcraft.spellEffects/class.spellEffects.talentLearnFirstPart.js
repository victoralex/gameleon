
	spellEffects.talentLearnFirstPart = function( args )
	{//part with the spellbook
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.duration = 1900;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = 0;
		this.stepDistance =  25 / (this.duration / 100);
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;
		
		var talentLearnFirstPartImageObject = new Image();
		talentLearnFirstPartImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/other/talentLearn/talentLearn_book.png';
		
		var yMovement = 0;
		var shadowOffset  = 0;
		
		var talentLearnFirstPartSound = soundManager.createSound({
				id: 'talentLearnFirstPart' + ( ++spellEffects.soundIncrementor ),
				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/lvlUp/game_win_ident_1.mp3',
				volume: spellEffects.volumeByRange ( Component.bugcraft.currentCharacterObject.characterData.character_zone_x, Component.bugcraft.currentCharacterObject.characterData.character_zone_y, args.targetCharacter.characterData.character_zone_x, args.targetCharacter.characterData.character_zone_y, spellEffects.volumeRangeLong )
		});
		
		this.spellEffectSoundID = args.targetCharacter._internal.soundEffects.push( talentLearnFirstPartSound ) - 1;
	
		soundManager.play( 'talentLearnFirstPart' + spellEffects.soundIncrementor, 
										{
											onfinish: function () 
											{
												delete args.targetCharacter._internal.soundEffects[ self.spellEffectSoundID ];	
											}
										});
		
		//draw the the talentLearnFirstPart
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.drawImage(
								talentLearnFirstPartImageObject,
								args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
								args.targetCharacter.characterData.character_zone_y - self.offsetY + Map.viewPortY + yMovement
							);
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY + yMovement;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the talentLearnFirstPart
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			clearTimeout( _animateFunctionPointer );
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		self.alpha = 0;

		var _fadeIn = function()
								{
									if( self.alpha < 1 )
									{
										self.alpha += 0.1;
										
										setTimeout( _fadeIn, 50 );
										
										return;
									}
									
									return;
								}
		
		_fadeIn();
		
		var _animateFunction =	function()
											{
												yMovement -= self.stepDistance;
												
												if( yMovement < -25 )
												{
													self.alpha-=0.05;
												}
												
												if( self.alpha < 0 )
												{
													self.alpha = 0;
												
													self.remove();
													
													return;
												}
												
												_animateFunctionPointer = setTimeout( _animateFunction, 50 );
											}			
				
		var _animateFunctionPointer = setTimeout( _animateFunction, 1000 );
		
		setTimeout( function()
							{
								self.remove;
							
							}, self.duration );
	} //end the lvl up first part effect