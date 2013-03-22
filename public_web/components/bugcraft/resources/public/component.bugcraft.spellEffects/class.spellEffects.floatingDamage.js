
	spellEffects.floatingDamage = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.characterSpelEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
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
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.fillStyle = "black";
			Map.ctx.font = "bold 13px sans-serif";
			
			Map.ctx.fillText( 
								args.damage, 
								args.targetCharacter.characterData.character_zone_x - self.offsetX, 
								args.targetCharacter.characterData.character_zone_y + self.offsetY
								);
			
			self.previousX = args.targetCharacter.characterData.character_zone_x - self.offsetX;
			self.previousY = args.targetCharacter.characterData.character_zone_y + self.offsetY;
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the slash effect
		
		this.remove = function()
		{
			spellEffects.layer[1][ this.ID ] = null;
		}

		var _animFunction =	function()
											{
												self.offsetY -= 5;
												
												if( self.offsetY < - maximumDistance )
												{
													self.alpha-=0.05;
												}
												
												if( self.alpha < 0 )
												{
													self.remove();
													
													return;
												}
												
												setTimeout( _animFunction, 30 );
											}
		
		_animFunction();
		
	} //end floating damage