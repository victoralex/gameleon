
	spellEffects.floatingTextDamage = function( args )
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
		
		//draw the floating damge effect
		this.draw = function()
		{
			Map.ctx.save();
			
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.textAlign = "center";
			Map.ctx.fillStyle = "orange";
			Map.ctx.strokeStyle = "black";
			Map.ctx.lineWidth = 2;
			Map.ctx.font = "bold 16px sans-serif";
			
			Map.ctx.strokeText( 
								args.text, 
								args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
								args.targetCharacter.characterData.character_zone_y - self.offsetY + Map.viewPortY
								);
			
			Map.ctx.fillText( 
								args.text, 
								args.targetCharacter.characterData.character_zone_x - self.offsetX + Map.viewPortX,
								args.targetCharacter.characterData.character_zone_y - self.offsetY + Map.viewPortY
								);
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX - 30;
			self.previousY = args.targetCharacter.characterData.character_zone_y - self.offsetY;
			
			Map.ctx.globalAlpha = 1;
			
			Map.ctx.restore();
		}
		
		//remove the effect
		this.remove = function()
		{
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[1][ this.ID ] = null;
		delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}

		var _animFunction =	function()
											{
												self.offsetY += 5;
												
												if( self.offsetY >  self.maximumDistance )
												{
													self.alpha-=0.1;
												}
												
												if( self.alpha < 0.05 )
												{
													self.remove();
													
													return;
												}
												
												setTimeout( _animFunction, 40 );
											}
		
		_animFunction();
		
	} //end floating text