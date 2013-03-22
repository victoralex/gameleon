
	spellEffects.lootableAura = function( args )
	{
		var _tc = args.targetCharacter, _tcd = _tc.characterData, self = this, yMovement = 0, _animateFunctionPointer = null;
		
		this.ID = spellEffects.layer[ 0 ].push( this ) - 1;
		this.characterSpellEffectID = _tc._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;	
		this.duration = 4000;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = 0;
		this.stepDistance = 2;
		this.maximumDistance = -40;
		this.deleteRange = 60;
		this.previousX = _tcd.character_zone_x - this.offsetX;
		this.previousY = _tcd.character_zone_y - this.offsetY;
		
		var lootableImageObject = new Image();
		lootableImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/lootable/lootable0.png';

		//draw the the lootable
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( _tcd.character_zone_x + Map.viewPortX, _tcd.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			Map.ctx.drawImage(
							lootableImageObject,
							- self.offsetX,
							- self.offsetY + yMovement
						);
										
			self.previousX = _tcd.character_zone_x - self.offsetX;
			self.previousY = _tcd.character_zone_y - self.offsetY + yMovement;
										
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the lootable
		this.remove = function()
		{
			clearTimeout( _animateFunctionPointer );
			
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[ 0 ][ this.ID ] = null;
			delete _tc._internal.spellEffects[ this.characterSpellEffectID ];
		}
			
		self.alpha = 0;

		var opacityVariation = 0;
		
		var _animateFunction =  function()
		{
			self.alpha = Math.abs( Math.sin( opacityVariation ) );
			
			opacityVariation += Math.PI / 32;
			
			if (self.alpha < 0.5 )
			{
				self.alpha = 0.5;
			}
			
			_animateFunctionPointer = setTimeout( _animateFunction, 50 );
		}
				
		_animateFunction();
		
	} //end the lootable