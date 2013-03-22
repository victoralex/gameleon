	
	spellEffects[ 'EggDeathz' ] = function( args )
	{
		var self = this,
				_ccd = Component.bugcraft.currentCharacterObject.characterData,
				_moveFrames = {},
				_tc = args.targetCharacter,
				_tcd = _tc.characterData,
				_changeFrameFunctionPointer = null,
				_currentIndex = 1,
				_maxFrames = 4;
		
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = _tc._internal.spellEffects.push( this ) - 1;
		this.offsetX = 20;
		this.offsetY = 20;
		this.rotation = _tcd.character_rotation;
		this.deleteRange = 40;
		this.previousX = _tcd.character_zone_x - this.offsetX;
		this.previousY = _tcd.character_zone_y - this.offsetY;
		
		// initialize
		
		Application.sound.playExclusive({
											url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/EggDeathz/EggDeathz.mp3',
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
		
		for(var i=1;i<=_maxFrames;i++)
		{
			_moveFrames[ i ] = { image: new Image(), alpha: 0 };
			_moveFrames[ i ].image.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/EggDeathz/EggDeathz' + i + '.png';
		}
		
		//draw the bombardierBeetleDeath spatter
		this.draw = function()
		{
			Map.ctx.save();
			
			Map.ctx.translate( self.previousX + self.offsetX + Map.viewPortX, self.previousY + self.offsetY + Map.viewPortY );
			
			Map.ctx.rotate( ( self.rotation - 90 ) * Math.PI / 180 );
			
			Map.ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
			Map.ctx.shadowOffsetX = 3;
			Map.ctx.shadowOffsetY = 3;
			
			Map.ctx.drawImage(
							_moveFrames[ _currentIndex ].image,
							- self.offsetX,
							- self.offsetY
						);
			
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
		
		var _changeFrameFunction = function()
		{
			_currentIndex++;
			
			if( _currentIndex > _maxFrames )
			{
				self.remove();
				
				return;
			}
			
			_changeFrameFunctionPointer = setTimeout( _changeFrameFunction, 100 );
		}
		
		_changeFrameFunction();
		
	} //end bombardierBeetleDeath