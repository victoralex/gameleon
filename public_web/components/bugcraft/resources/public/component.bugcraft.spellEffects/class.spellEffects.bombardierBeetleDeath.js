	
	spellEffects.bombardierBeetleDeath = function( args )
	{
		var self = this,
				_ccd = Component.bugcraft.currentCharacterObject.characterData,
				_deathFrames = {},
				_tc = args.targetCharacter,
				_tcd = _tc.characterData,
				_changeFrameFunctionPointer = null,
				_currentIndex = 1,
				_processingIndex = 1,
				_messImageAlpha = 0,
				_messIncrement = 0.1;
		
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = _tc._internal.spellEffects.push( this ) - 1;
		this.offsetX = 150;
		this.offsetY = 150;
		this.rotation = _tcd.character_rotation;
		this.deleteRange = 70;
		this.previousX = _tcd.character_zone_x - this.offsetX;
		this.previousY = _tcd.character_zone_y - this.offsetY;
		
		// initialize
		
		Application.sound.playExclusive({
											url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/bombardierBeetle/explosion.mp3',
											volume: spellEffects.volumeByRangeVoice(
																		_ccd.character_zone_x,
																		_ccd.character_zone_y,
																		_tcd.character_zone_x,
																		_tcd.character_zone_y,
																		spellEffects.volumeRangeLong
																	),
											onFinish: function()
											{
												
											}
										});
		
		var _corpseImage = new Image();
		_corpseImage.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/bombardierBeetle/corpse' + Math.ceil( Math.random() * 3 ) + '.png';
		
		for(var i=1;i<=8;i++)
		{
			_deathFrames[ i ] = { image: new Image(), alpha: 0 };
			_deathFrames[ i ].image.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/bombardierBeetle/' + i + '.png';
		}
		
		//draw the bombardierBeetleDeath spatter
		this.draw = function()
		{
			Map.ctx.save();
			
			Map.ctx.translate( self.previousX + self.offsetX + Map.viewPortX, self.previousY + self.offsetY + Map.viewPortY );
			
			Map.ctx.rotate( ( self.rotation - 90 ) * Math.PI / 180 );
			
			for(var i in _deathFrames)
			{
				var _ia = _deathFrames[ _currentIndex ];
				
				Map.ctx.globalAlpha = _ia.alpha;
				
				Map.ctx.drawImage(
								_ia.image,
								- self.offsetX,
								- self.offsetY
							);
			}
			
			Map.ctx.globalAlpha = _messImageAlpha;
			
			Map.ctx.drawImage( _corpseImage, -self.offsetX, -self.offsetY );
			
			Map.ctx.restore();
			
			Map.ctx.globalAlpha = 1;
		}
		
		//remove the deathDecay
		this.remove = function()
		{
			clearTimeout( _changeFrameFunctionPointer );
			
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			
			delete _tc._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var _messShow = function()
		{
			_messImageAlpha += _messIncrement;
			
			if( _messImageAlpha >= 1 )
			{
				_messImageAlpha = 1;
				_messIncrement = -0.1;
				
				_changeFrameFunctionPointer = setTimeout( _messShow, 5000 );
				
				return;
			}
			
			if( _messImageAlpha <= 0 )
			{
				_messImageAlpha = 0;
				self.remove();
				
				return;
			}
			
			_changeFrameFunctionPointer = setTimeout( _messShow, 100 );
		}
		
		var _changeFrameFunction = function()
		{
			_deathFrames[ _currentIndex ].alpha += 0.1;
			
			for(var i=_processingIndex - 1;i>0;i--)
			{
				if( i - 1 < 1 )
				{
					continue;
				}
				
				_deathFrames[ Math.min( i - 1, 8 ) ].alpha = Math.max( 0, _deathFrames[ Math.min( i, 8 ) ].alpha - 0.1 );
			}
			
			for(var i=_processingIndex;i<=_processingIndex + 1;i++)
			{
				if( i + 1 > 8 )
				{
					continue;
				}
				
				_deathFrames[ i + 1 ].alpha = Math.max( 0, _deathFrames[ i ].alpha - 0.1 );
			}
			
			if( _deathFrames[ _currentIndex ].alpha >= 1 )
			{
				_deathFrames[ _currentIndex ].alpha = 1;
				
				if( _currentIndex < 8 )
				{
					_currentIndex++;
				}
				
				if( _currentIndex == 4 )
				{
					_messShow();
				}
				
				_processingIndex++;
			}
			
			if( _currentIndex == 8 && _deathFrames[ _currentIndex ].alpha <= 0 )
			{
				return;
			}
			
			_changeFrameFunctionPointer = setTimeout( _changeFrameFunction, 65 );
		}
		
		_changeFrameFunction();
		
	} //end bombardierBeetleDeath