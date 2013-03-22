	
	spellEffects.deathDecay = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 25;
		this.offsetY = 25;
		this.rotation = args.rotation;
		this.deleteRange = 70;
		this.previousX = args.sourceCharacter.characterData.character_zone_x - this.offsetX - 10;
		this.previousY = args.sourceCharacter.characterData.character_zone_y - this.offsetY - 10;
		
		var self = this, deathDecayImageObject = new Image();
		deathDecayImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/deathAnimation/decomposing_bugbody' + args.component + '.png';
		
		//draw the deathDecay spatter
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( self.previousX + self.offsetX + Map.viewPortX, self.previousY + self.offsetY + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							deathDecayImageObject,
							- self.offsetX,
							- self.offsetY
						);
			
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the deathDecay
		this.remove = function()
		{
			clearTimeout( _fadeOutPointer );
			
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var _fadeOut = function()
		{
			if( self.alpha < 0.01 )
			{
				self.alpha = 0;
				
				self.remove();
				
				return;
			}
			
			self.alpha -= 0.005;
			
			_fadeOutPointer = setTimeout( _fadeOut, 60 );
		}
		
		var _fadeOutPointer = setTimeout( _fadeOut, args.component * 20000 );
					
	} //end deathDecay