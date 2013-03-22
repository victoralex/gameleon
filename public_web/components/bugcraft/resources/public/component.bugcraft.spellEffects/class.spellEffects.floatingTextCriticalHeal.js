
	spellEffects.floatingTextCriticalHeal = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 0;
		this.offsetY = 10;
		this.maximumDistance = 60;
		this.deleteRange = 60;
		this.previousX = args.targetCharacter.characterData.character_zone_x - this.offsetX - 30;
		this.previousY = args.targetCharacter.characterData.character_zone_y - this.offsetY;
		
		var self = this;

		var fontFamily = "bold 10px sans-serif";
		
		//draw the effect
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.textAlign = "center";
			Map.ctx.fillStyle = "green";
			Map.ctx.strokeStyle = "black";
			Map.ctx.lineWidth = 2;
			Map.ctx.font = fontFamily;
			
			Map.ctx.strokeText( 
								args.text, 
								args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
								args.targetCharacter.characterData.character_zone_y - self.offsetY + Map.viewPortY
								);
			
			Map.ctx.fillText( 
								args.text, 
								args.targetCharacter.characterData.character_zone_x + Map.viewPortX - self.offsetX,
								args.targetCharacter.characterData.character_zone_y + Map.viewPortY - self.offsetY
								);
								
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX - 30;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the effect
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		var i = 10;
		var _popup = function()
								{
									fontFamily = "bold " + i + "px sans-serif";
									i+=2;
									
									if( i > 26 )
									{
										return;
									}
									
									setTimeout( _popup, 30);
								}
		_popup();
		
		var _animFunction =	function()
											{
												self.offsetY += 5;
												
												if( self.offsetY > self.maximumDistance )
												{
													self.alpha-=0.05;
												}
												
												if( self.alpha < 0 )
												{
													self.remove();
													
													return;
												}
												
												setTimeout( _animFunction, 40 );
											}
		
		_animFunction();
		
	} //end criticalText