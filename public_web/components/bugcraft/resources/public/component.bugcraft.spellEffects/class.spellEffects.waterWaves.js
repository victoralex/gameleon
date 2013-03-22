	
	spellEffects.waterWaves = function( args )
	{
		var self = this,
				_animationFrames = {},
				_tc = args.targetCharacter,
				_tcd = _tc.characterData,
				_changeFrameFunctionPointer = null,
				_currentIndex = 1,
				_maxFrames = 9;
		
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = _tc._internal.spellEffects.push( this ) - 1;
		this.offsetX = 150;
		this.offsetY = 150;
		this.deleteRange = 150;
		this.previousX = _tcd.character_zone_x - this.offsetX;
		this.previousY = _tcd.character_zone_y - this.offsetY;
		
		// initialize
		
		Application.sound.playExclusive({
											url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/waterWaves/gulls.mp3',
											onFinish: function()
											{
												
											}
										});
		
		for(var i=1;i<=_maxFrames;i++)
		{
			_animationFrames[ i ] = { image: new Image(), alpha: 0 };
			_animationFrames[ i ].image.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/waterWaves/singlewave' + i + '.png';
		}
		
		//draw the bombardierBeetleDeath spatter
		this.draw = function()
		{
			Map.ctx.save();
			
			Map.ctx.translate( self.previousX + self.offsetX + Map.viewPortX, self.previousY + self.offsetY + Map.viewPortY );
			
			Map.ctx.rotate( ( _tcd.character_rotation - 90 ) * Math.PI / 180 );
			
			Map.ctx.drawImage(
							_animationFrames[ _currentIndex ].image,
							- self.offsetX,
							- self.offsetY
						);
			
			Map.ctx.restore();
		}
		
		//remove the deathDecay
		this.remove = function()
		{
			clearTimeout( _changeFrameFunctionPointer );
			
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			
			delete _tc._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var _changeFrameFunction = function()
		{
			_currentIndex++;
			
			if( _currentIndex == _maxFrames )
			{
				_changeFrameFunctionPointer = setTimeout( _changeFrameFunction, 1000 + Math.random() * 2000 );
				
				return;
			}
			else if( _currentIndex < _maxFrames )
			{
				_changeFrameFunctionPointer = setTimeout( _changeFrameFunction, 100 );
				
				return;
			}
			else
			{
				_currentIndex = 1;
				
				_changeFrameFunctionPointer = setTimeout( _changeFrameFunction, 100 );
			}
		}
		
		_changeFrameFunction();
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	