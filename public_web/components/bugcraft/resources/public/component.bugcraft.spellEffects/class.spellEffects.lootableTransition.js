
	spellEffects.lootableTransition = function( args )
	{
		var _tc = args.targetCharacter, _tcd = _tc.characterData;
		
		this.ID = spellEffects.layer[ 1 ].push( this ) - 1;
		this.characterSpellEffectID = _tc._internal.spellEffects.push( this ) - 1;
		this.offsetX = 30;
		this.offsetY = 30;
		this.rotation = 0;
		this.stepDistance = 2;
		this.maximumDistance = -40;
		this.deleteRange = 60;
		this.previousX = _tcd.character_zone_x - this.offsetX;
		this.previousY = _tcd.character_zone_y - this.offsetY;
		
		var self = this, _imageProperties = [], _animateFunctionPointer = null,
			_fadeInTimeoutPointer = null, _fadeOutTimeoutPointer = null;
		
		var lootableImageObject = new Image();
		lootableImageObject.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/lootable/lootable1.png';
		
		var _initImageObject = function()
		{
			setTimeout( function()
			{
				_imageProperties.push({
											fadeIn: true,
											alpha: 0,
											x: Math.round( Math.random() * ( _tcd.character_width - 20 ) ) + 10,
											y: 0
										});
				
				if( _imageProperties.length >= 5 )
				{
					return;
				}
				
				_initImageObject();
			}, Math.random() * 1000 );
		}
		
		// create all lines
		_initImageObject();
		
		//draw the the lootable
		this.draw = function()
		{	
			Map.ctx.save();
			
			Map.ctx.translate( _tcd.character_zone_x + Map.viewPortX, _tcd.character_zone_y + Map.viewPortY );
			
			Map.ctx.rotate( self.rotation );
			
			for(var i=0;i<_imageProperties.length;i++)
			{
				var _ip = _imageProperties[ i ];
				
				Map.ctx.globalAlpha = _ip.alpha;
				
				Map.ctx.drawImage(
								lootableImageObject,
								- _ip.x,
								- self.offsetY + _ip.y
							);
			}
			
			self.previousX = _tcd.character_zone_x - self.offsetX;
			self.previousY = _tcd.character_zone_y - self.offsetY;
			
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the lootable
		this.remove = function()
		{
			clearTimeout( _animateFunctionPointer );
			
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[ 1 ][ this.ID ] = null;
			delete _tc._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var _animateFunction = function()
		{
			for(var i=0;i<_imageProperties.length;i++)
			{
				var _ip = _imageProperties[ i ];
				
				_ip.y -= self.stepDistance;
				
				if( _ip.fadeIn )
				{
					_ip.alpha += 0.1;
					
					if( _ip.alpha >= 1 )
					{
						_ip.alpha = 1;
						_ip.fadeIn = false;
					}
				}
				
				if( _ip.y >= self.maximumDistance )
				{
					continue;
				}
				
				// max point reached
				
				_ip.alpha -= 0.1;
				
				if( _ip.alpha <= 0 )
				{
					_ip.alpha = 0;
					_ip.y = 0;
					_ip.x = Math.round( Math.random() * ( _tcd.character_width - 20 ) ) + 10;
					_ip.fadeIn = true;
				}
			}
			
			_animateFunctionPointer = setTimeout( _animateFunction, 45 );
		}
		
		_animateFunction();
		
	} //end the lootable
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	