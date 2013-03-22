
	/*
		-----------------------------
		BattleField object skins
		-----------------------------
	*/
	
	Component.bugcraft.skinsStructure = 
	{
		defs: {
		
		},
		
		_skinCache:
		{
			images: {},
			inQueue: 0,
			
			onEmptyQueue: function()
			{
				
			},
			
			add: function( url )
			{
				var _sc = Component.bugcraft.skinsStructure._skinCache, _imageObject = null;
				
				if( !_sc.images[ url ] )
				{
					// new image
					
					_imageObject = ( _sc.images[ url ] = new Image() )
				}
				else
				{
					// this image has already been added to the queue
					
					return _sc.images[ url ];
				}
				
				_sc.inQueue++;
				
				_imageObject.onload = function()
				{
					_sc.inQueue--;
					
					if( _sc.inQueue <= 0 )
					{
						Component.bugcraft.skinsStructure._skinCache.onEmptyQueue();
					}
				}
				
				_imageObject.src = url;
				
				return _imageObject;
			}
		},
		
		_cacheSkinFramesBase: function( skinDefinition, skinName )
		{
			var _images = {}, _prefix = skinDefinition.prefix ? skinDefinition.prefix : ( Application.configuration.cdn.location[ 0 ].url + "/object_skins/" + skinName + "/" );
			
			for( var _s in skinDefinition.frames )
			{
				_images[ _s ] = {};
				
				for(var j=1;j<=skinDefinition.frames[ _s ];j++)
				{
					_images[ _s ][ j ] = this._skinCache.add( _prefix + _s + j + ".png" );
				}

			}
			console.log( _images )
			return _images;
		},
		
		_cacheSkinFramesAdditional: function( skinDefinition, skinName )
		{
			var _images = {}, _prefix = skinDefinition.prefix ? skinDefinition.prefix : ( Application.configuration.cdn.location[ 0 ].url + "/object_skins/" + skinName + "/" );
			
			for( var _s in skinDefinition.frames )
			{
				for(var j=1;j<=skinDefinition.frames[ _s ];j++)
				{
					skinDefinition._images[ _s ][ j + "_friend" ] = this._skinCache.add( _prefix + _s + j + "_friend.png" );
					skinDefinition._images[ _s ][ j + "_neutral" ] = this._skinCache.add( _prefix + _s + j + "_neutral.png" );
					skinDefinition._images[ _s ][ j + "_foe" ] = this._skinCache.add( _prefix + _s + j + "_foe.png" );
				}
			}
		},
		
		_cacheSkinSounds: function( skinDefinition, skinName )
		{
			var _sounds = {}, _prefix = skinDefinition.prefix ? skinDefinition.prefix : ( Application.configuration.cdn.location[ 0 ].url + "/object_skins/" + skinName + "/" );
			
			for( var _s in skinDefinition.frames )
			{
				_sounds[ _s ] = {};
				
				for(var j=1;j<=skinDefinition.frames[ _s ];j++)
				{
					_sounds[ _s ][ j ] = soundManager.createSound({
																	id: "_cached_sound_" + _s + "_" + j,
																	url: _prefix + "audio/" + _s + j + '.mp3'
																});
				}
			}
			
			return _sounds;
		},
		
		init: function()
		{
			// cache the frames for the default skins
			
			for(var _sn in this.defs)
			{
				this.defs[ _sn ]._images = this._cacheSkinFramesBase( this.defs[ _sn ], _sn );
				this.defs[ _sn ]._sounds = this._cacheSkinSounds( this.defs[ _sn ], _sn );
			}
		},
		
		skinObject: function( args )
		{
			var _currentFrame = 1, _currentAudioSoundNumber = 1, _skinDefinition = null, _footStepsSoundObject = [], self = this, _currentAudioObject = null;
			
			if( args.skinName )
			{
				// existing skin
				
				_skinDefinition = Component.bugcraft.skinsStructure.defs[ args.skinName ];
			}
			else
			{
				// new skin
				
				_skinDefinition = args;
				_skinDefinition._images = Component.bugcraft.skinsStructure._cacheSkinFramesBase( args );
				Component.bugcraft.skinsStructure._cacheSkinFramesAdditional( args );
				_skinDefinition._sounds = Component.bugcraft.skinsStructure._cacheSkinSounds( args );
			}
			
			//
			// Properties
			//
			
			this.currentState = "idle";
			this.currentRelationship = null;
			
			//
			// skin specific functions
			//
			
			this.setState = function( stateName )
			{
				if(
					stateName != "walk"
					&& stateName != "idle"
					&& stateName != "attackMelee"
					&& stateName != "attackRanged"
				)
				{
					return false;
				}
				
				this.currentState = stateName;
				_currentFrame = 1;
				_currentAudioSoundNumber = 1;
				
				this.getNextFrame();
			}
			
			this.setRelationship = function( relationshipName )
			{
				// cache on demand
				Component.bugcraft.skinsStructure._cacheSkinFramesAdditional( Component.bugcraft.skinsStructure.defs[ args.skinName ], args.skinName );
				
				// change the current image for the skin
				self.currentRelationship = relationshipName;
				args.characterObject._internal.characterImage = _skinDefinition._images[ self.currentState ][ _currentFrame + "_" + self.currentRelationship ];
				
				// default handlers
				self.getStartFrame = function()
				{
					_currentFrame = 1;
					
					args.characterObject._internal.characterImage = _skinDefinition._images[ self.currentState ][ "1_" + self.currentRelationship ];
				}
				
				self.getNextFrame = function()
				{
					_currentFrame++;
					
					if( _currentFrame > _skinDefinition.frames[ self.currentState ] )
					{
						// reset the frames
						
						_currentFrame = 1;
					}
					
					args.characterObject._internal.characterImage = _skinDefinition._images[ self.currentState ][ _currentFrame + "_" + self.currentRelationship ];
				}
			}
			
			this.clearRelationship = function()
			{
				self.currentRelationship = null;
				args.characterObject._internal.characterImage = _skinDefinition._images[ self.currentState ][ _currentFrame ];
				
				// default handlers
				self.getStartFrame = self.getStartFrameDefault;
				self.getNextFrame = self.getNextFrameDefault;
			}
			
			this.getTargetProfileIcon = function( friendOrFoe )
			{
				return "icon icon_" + args.skinName + "_" + ( friendOrFoe ? "friend" : "foe" );
			}
			
			this.getSkinName = function()
			{
				return args.skinName;
			}
			
			this.getMainProfileIcon = function()
			{
				return "icon icon_" + args.skinName;
			}
			
			this.getCurrentFrameNumber = function()
			{
				return _currentFrame;
			}
			
			this.getCurrentAudioNumber = function()
			{
				return _currentAudioSoundNumber;
			}
			
			this.getStartFrameDefault = function()
			{
				_currentFrame = 1;
				
				args.characterObject._internal.characterImage = _skinDefinition._images[ this.currentState ][ 1 ];
			}
			
			this.getNextFrameDefault = function()
			{
				_currentFrame++;
				
				if( _currentFrame > _skinDefinition.frames[ this.currentState ] )
				{
					// reset the frames
					
					_currentFrame = 1;
				}
				
				args.characterObject._internal.characterImage = _skinDefinition._images[ this.currentState ][ _currentFrame ];
			}
			
			this.getNextAudio = function()
			{
				_currentAudioObject = _skinDefinition._sounds[ this.currentState ][ ++_currentAudioSoundNumber ];
				
				if( !_currentAudioObject )
				{
					// reset sound pointer
					_currentAudioSoundNumber = 1;
					
					_currentAudioObject = _skinDefinition._sounds[ this.currentState ][ ++_currentAudioSoundNumber ];
					//alert( args.characterObject.characterData.character_skin + " - " + this.currentState + " - " + _currentAudioSoundNumber );
				}
				
				_currentAudioObject.play({
											volume: Component.bugcraft.sound.ui.volume,
											onfinish: function()
											{
												// ensure continous play
												self.getNextAudio();
											}
										});
			}
			
			this.eventStop = function()
			{
				if( !_skinDefinition.events.hide )
				{
					return;
				}
				
				_skinDefinition.events.hide( args.characterObject );
			}
			
			this.stopAudio = function()
			{
				_currentAudioObject.togglePause();
			}
			
			//
			// Initialize
			//
			
			// default handlers
			this.getStartFrame = this.getStartFrameDefault;
			this.getNextFrame = this.getNextFrameDefault;
			
			//footsteps sound
			for(var i=0;i<=5;i++)
			{
				_footStepsSoundObject[ i ] = soundManager.createSound({
																				id: 'footsteps' + i,
																				url: '/components/bugcraft/resources/public/component.bugcraft.spellEffects/sounds/footsteps/steps_on_grass' + i + '.mp3'
																			});
			}
			
			if( _skinDefinition.events.show )
			{
				_skinDefinition.events.show( args.characterObject );
			}
		}
	}	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
