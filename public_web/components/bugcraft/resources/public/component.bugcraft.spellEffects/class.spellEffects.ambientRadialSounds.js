
	spellEffects.ambientRadialSounds = function( args )
	{
		this.ID = spellEffects.layer[0].push( this ) - 1;
		this.characterSpellEffectID = args.targetCharacter._internal.spellEffects.push( this ) - 1;
		
		var self = this, _playTimeoutPointer = [], _playSoundObject = [], _tcd = args.targetCharacter.characterData, _soundObjects = [];
		
		this.remove = function()
		{
			for(var i=0;i<_soundObjects.length;i++)
			{
				clearTimeout( _playTimeoutPointer[ i ] );
			
				if( _playSoundObject[ i ] )
				{
					_playSoundObject[ i ].stop();
					//_playSoundObject[ i ].destruct();
				}
				
				delete args.targetCharacter._internal.soundEffects[ _soundObjects[ i ] ];
			}
			
			spellEffects.layer[0][ this.ID ] = null;
			delete args.targetCharacter._internal.spellEffects[ this.characterSpellEffectID ];
		}
		
		this.draw = function()
		{
			
		}
		
		var _soundLoop = function( _soundObjectIndex, maxDelay, streamSounds )
		{
			if( !Component.bugcraft.currentCharacterObject )
			{
				setTimeout( function()
				{
					_soundLoop( _soundObjectIndex, maxDelay, streamSounds );
				}, 3000 );		// retry in 3 sec
				
				return false;
			}
			
			var _ccd = Component.bugcraft.currentCharacterObject.characterData;
			
			_playSoundObject[ _soundObjectIndex ] = Application.sound.playRandomExclusive({
																											url: streamSounds,
																											volume: spellEffects.volumeByRangeAmbiental(
																																							_tcd.character_zone_x, 
																																							_tcd.character_zone_y, 
																																							_ccd.character_zone_x, 
																																							_ccd.character_zone_y, 
																																							spellEffects.volumeRangeLong 
																																						),
																											onFinish: function()
																											{
																												_playTimeoutPointer[ _soundObjectIndex ] = setTimeout( function()
																												{
																													_soundLoop( _soundObjectIndex, maxDelay, streamSounds );
																												}, 10000 + Math.random() * maxDelay );
																											}
																										});
			
			if( _playSoundObject[ _soundObjectIndex ] == false )
			{
				// the same sound must be playing already
				
				setTimeout( function()
				{
					_soundLoop( _soundObjectIndex, maxDelay, streamSounds );
				}, 600000 );		// retry in 1 min
				
				return false;
			}
			
			if( _soundObjects[ _soundObjectIndex ] == null )
			{
				// this sound in particular hasn't been indexed yet in the sound array associated to the player
				
				_soundObjects[ _soundObjectIndex ] = args.targetCharacter._internal.soundEffects.push( _playSoundObject[ _soundObjectIndex ] ) - 1;
			}
			
			args.targetCharacter._internal.soundEffects[ _soundObjects[ _soundObjectIndex ] ] = _playSoundObject[ _soundObjectIndex ];
		}
		
		//
		// Initialize
		//
		
		var _queueLoop = function( _soundObjectIndex, maxDelay, streamSounds )
		{
			setTimeout( function()
			{
				_soundLoop( _soundObjectIndex, maxDelay, streamSounds );
			}, 2000 + Math.random() * 5000 );
		}
		
		for(var i in args.streams)
		{
			for(var j=0;j<args.streams[ i ].length;j++)
			{
				args.streams[ i ][ j ] = '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/ambient/' + args.streams[ i ][ j ] + '.mp3';
			}
			
			// ensure a minimum delay
			_queueLoop( _soundObjects.push( null ) - 1, i, args.streams[ i ] );
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	