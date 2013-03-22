	
	spellEffects.auraRevive = function( args )
	{
		var _c = args.targetCharacter, _cd = _c.characterData;
		
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = _c._internal.spellEffects.push( this ) - 1;
		this.alpha = 1;
		this.offsetX = 100; //half the width of the image 
		this.offsetY = 100; //half the height of the image
		this.deleteRange = 300; // greatest of the height or widht of the image
		this.previousX = _cd.character_zone_x - this.offsetX - 100; // both previousX/Y used to erase the image from the canvas
		this.previousY = _cd.character_zone_y - this.offsetY - 100;
		
		var self = this, _images = [], _rotationSpeed = [], _timeoutPointers = [], _rotation = [], _framesAmount = 5;
		
		var _startRotation = function( index )
		{
			var _rotationFunction = function()
			{
				_rotation[ index ] += 0.01 * index;
				
				_timeoutPointers[ index ] = setTimeout( _rotationFunction, _rotationSpeed[ index ] );
			}
			
			_rotationFunction();
		}
		
		for(var i=0;i<_framesAmount;i++)
		{
			_images[ i ] = new Image();
			_images[ i ].src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/auraRevive/aura_revive_twirl' + i + '.png';
			
			_rotation[ i ] = Math.random() * Math.PI * 2;
			_rotationSpeed[ i ] = 40 + Math.random() * 200;
			
			_startRotation( i );
		}
		
		//draw the anteriumFlag
		this.draw = function()
		{
			Map.ctx.globalAlpha = self.alpha;
			
			Map.ctx.save();
			
			Map.ctx.translate( _cd.character_zone_x + Map.viewPortX, _cd.character_zone_y + Map.viewPortY );
			
			for(var i=0;i<5;i++)
			{
				Map.ctx.rotate( _rotation[ i ] );
				
				Map.ctx.drawImage(
										_images[ i ],
										- self.offsetX,
										- self.offsetY
									);
			}
			
			self.previousX = _cd.character_zone_x - self.offsetX - 50;
			self.previousY = _cd.character_zone_y - self.offsetY - 50;
			
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the anteriumFlag
		this.remove = function()
		{
			for(var i=0;i<_framesAmount;i++)
			{
				clearTimeout( _timeoutPointers[ i ] );
			}
			
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			delete _c._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	