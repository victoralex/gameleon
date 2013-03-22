	
	spellEffects[ 'Underwater' ] = function( args )
	{
		var self = this,
				_ccd = Component.bugcraft.currentCharacterObject.characterData,
				_moveFrames = {},
				_tc = args.targetCharacter,
				_tcd = _tc.characterData,
				_changeFrameFunctionPointer = null,
				_currentIndex = 1,
				_maxFrames = 1,
				_backgroundSound = null;
		
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = _tc._internal.spellEffects.push( this ) - 1;
		this.offsetX = 20;
		this.offsetY = 20;
		this.rotation = _tcd.character_rotation;
		this.deleteRange = 40;
		this.previousX = _tcd.character_zone_x - this.offsetX;
		this.previousY = _tcd.character_zone_y - this.offsetY;
		
		// initialize
		
		var _soundLoop = function()
		{
			_backgroundSound = Application.sound.playExclusive({
												url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/Underwater/Underwater.mp3',
												volume: spellEffects.volumeByRangeVoice(
																			_ccd.character_zone_x,
																			_ccd.character_zone_y,
																			_tcd.character_zone_x,
																			_tcd.character_zone_y,
																			spellEffects.volumeRangeLong
																		),
												onFinish: function()
												{
													_soundLoop();
												}
											});
		}
		
		// for(var i=1;i<=_maxFrames;i++)
		// {
		// 	_moveFrames[ i ] = { image: new Image(), alpha: 0 };
		// 	_moveFrames[ i ].image.src = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/images/Underwater/Underwater' + i + '.png';
		// }
		
		//draw the bombardierBeetleDeath spatter
		this.draw = function()
		{
			
		}
		
		//remove the deathDecay
		this.remove = function()
		{
			return;
			clearTimeout( _changeFrameFunctionPointer );
			
			if( _backgroundSound )
			{
				_backgroundSound.stop();
			}
			
			spellEffects.layerCleaner.push( this );
			spellEffects.layer[0][ this.ID ] = null;
			
			delete _tc._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		var _changeFrameFunction = function()
		{
			_currentIndex++;
			
			if( _currentIndex > _maxFrames )
			{
				_currentIndex = 1;
				
				setTimeout( _changeFrameFunction, 2000 + Math.random() * 5000 );
				
				return;
			}
			
			_changeFrameFunctionPointer = setTimeout( _changeFrameFunction, 100 );
		}
		
		_soundLoop();
		//_changeFrameFunction();
		
	} //end bombardierBeetleDeath