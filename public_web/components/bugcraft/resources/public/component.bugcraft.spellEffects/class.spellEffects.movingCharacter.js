
	spellEffects.movingCharacter = function( args )
	{
		this.ID = spellEffects.layer[1].push( this ) - 1;
		this.alpha = 1;
		this.centerX = -30;
		this.centerY = -30;
		this.speed = 5;
		
		var self = this;
		
		var movingCharacterImageObject = new Image();
		movingCharacterImageObject.src =  'images/_characters/character' + Math.floor( Math.random() * 6 )  + '.png';
		
		//
		//draw the movingCharacter effect
		//
		this.draw = function()
		{
			spellEffects.ctx.globalAlpha = self.alpha;
			
			spellEffects.ctx.save();
			
			spellEffects.ctx.translate( args.targetCharacter.x, args.targetCharacter.y );
			
			//spellEffects.ctx.rotate( args.rotation );
			
			spellEffects.ctx.drawImage(
											movingCharacterImageObject,
											self.centerX,
											self.centerY
										)

			spellEffects.ctx.restore();
										
			spellEffects.ctx.globalAlpha = 1;
		}
		
		
		//remove the dust effect
		
		this.remove = function()
		{
			spellEffects.layer[1][ this.ID ] = null;
		}
		
	} //end movingCharacter