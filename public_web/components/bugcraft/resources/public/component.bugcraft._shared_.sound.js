
	/*
		-----------------
		BattleField sounds
		-----------------
	*/
	
	Component.bugcraft.sound = 
	{
		ui:
		{
			volume: 100,
			
			events:
			{
				actionBar:
				{
					backpackBottlePickup: 4,
					backpackMiscPickup: 3,
					backpackShieldPickup: 3,
					
					backpackHeavyPickup: 2,
					backpackLightPickup: 2,
					backpackMediumPickup: 3,
					
					backpackAxe1hPickup: 2,
					backpackAxe2hPickup: 2,
					backpackSpear1hPickup: 2,
					backpackSpear2hPickup: 2,
					backpackStaff1hPickup: 2,
					backpackStaff2hPickup: 2,
					backpackSword1hPickup: 2,
					backpackSword2hPickup: 2,
					backpackMace1hPickup: 2,
					backpackMace2hPickup: 2,
					backpackDaggerPickup: 3,
					
					buffMove: 1,
					buffRemove: 1
				},
				
				window:
				{
					pageTurn: 1,
					backPack: 2,
					characterProfile: 1,
					buttonClick: 1,
					buttonClose: 3,
					bookOpen: 2,
					loader: 1,
					questGrab: 1
				},
				
				vendor:
				{
					itemSell: 3
				}
			},
			
			playEvent: function( UIElement, eventName )
			{
				var chosenSound = Math.ceil( Math.random() * this.events[ UIElement ][ eventName ] );
				
				Application.sound.playOverwrite({
														url: Application.configuration.cdn.location[ 0 ].url + "/mp3/ui/" + UIElement + "/" + ( eventName + chosenSound ) + ".mp3",
														volume: this.volume
													});
			}
		},
		
		characters:
		{
			volume: 100,
			
			events:
			{
				ant:
				{
					assist: 2,
					bound: 2,
					cannotAfford: 2,
					cannotCarryMore: 2,
					cannotDoHere: 2,
					cannotDoThat: 2,
					cannotInvite: 2,
					cannotLoot: 2,
					cannotTrade: 2,
					cannotUse: 2,
					charge: 2,
					fire: 2,
					flee: 2,
					flirt: 7,
					follow: 2,
					fullBag: 2,
					funny: 9,
					goodbye: 2,
					heal: 2,
					hello: 2,
					help: 2,
					invalidTarget: 3,
					need2hands:2,
					no: 2,
					noTarget: 2,
					onCd: 2,
					outOfRange: 3,
					thanks: 2,
					wait: 2,
					wrongSlot: 2,
					yes: 2,
					
					//groans
					groans_attack: 14,
					groans_death: 4,
					groans_laugh: 1,
					groans_pain: 15,
					
					//npcs
					guard_hi: 1,
					npc_bye: 2,
					npc_hi: 1,
					trainer_bye: 1,
					trainer_hi: 2,
					vendor_bye: 2,
					vendor_hi: 2
				},
			
				bee:
				{
					assist: 2,
					bound: 2,
					cannotAfford: 3,
					cannotCarryMore: 2,
					cannotDoHere: 2,
					cannotDoThat: 2,
					cannotInvite: 2,
					cannotLoot: 2,
					cannotTrade: 2,
					cannotUse: 2,
					charge: 2,
					fire: 2,
					flee: 2,
					flirt: 7,
					follow: 2,
					fullBag: 2,
					funny: 7,
					goodbye: 2,
					heal: 2,
					hello: 2,
					help: 2,
					invalidTarget: 3,
					need2hands:2,
					no: 2,
					noTarget: 2,
					onCd: 2,
					outOfRange: 3,
					thanks: 2,
					wait: 2,
					wrongSlot: 2,
					yes: 2,
					
					//groans
					groans_attack: 24,
					groans_cry: 1,
					groans_death: 3,
					groans_laugh: 4,
					groans_pain: 11,
					groans_surprised: 4,
					groans_swing: 2,
					
					//npcs
					guard_hi: 1,
					npc_bye: 2,
					npc_hi: 1,
					trainer_bye: 1,
					trainer_hi: 2,
					vendor_bye: 2,
					vendor_hi: 2
				},
			
				butterfly:
				{
					assist: 2,
					bound: 2,
					cannotAfford: 2,
					cannotCarryMore: 2,
					cannotDoHere: 2,
					cannotDoThat: 2,
					cannotInvite: 2,
					cannotLoot: 2,
					cannotTrade: 2,
					cannotUse: 2,
					charge: 2,
					fire: 2,
					flee: 2,
					flirt: 7,
					follow: 2,
					fullBag: 2,
					funny: 9,
					goodbye: 2,
					heal: 2,
					hello: 2,
					help: 2,
					invalidTarget: 3,
					need2hands:2,
					no: 2,
					noTarget: 2,
					onCd: 2,
					outOfRange: 3,
					thanks: 2,
					wait: 2,
					wrongSlot: 0, //////
					yes: 2,
					
					//groans
					groans_attack: 10,
					groans_death: 9,
					groans_laugh: 1,
					groans_pain: 9,
					groans_bugSplat: 1,
					groans_cough: 2,
					
					//npcs
					guard_hi: 1,
					npc_bye: 2,
					npc_hi: 1,
					trainer_bye: 1,
					trainer_hi: 2,
					vendor_bye: 2,
					vendor_hi: 2
				},
			
				fireant:
				{
					assist: 2,
					bound: 2,
					cannotAfford: 2,
					cannotCarryMore: 2,
					cannotDoHere: 2,
					cannotDoThat: 2,
					cannotInvite: 2,
					cannotLoot: 2,
					cannotTrade: 2,
					cannotUse: 2,
					charge: 2,
					fire: 2,
					flee: 2,
					flirt: 7,
					follow: 2,
					fullBag: 2,
					funny: 12,
					goodbye: 2,
					heal: 2,
					hello: 2,
					help: 2,
					invalidTarget: 3,
					need2hands:2,
					no: 2,
					noTarget: 2,
					onCd: 2,
					outOfRange: 3,
					thanks: 2,
					wait: 2,
					wrongSlot: 2, 
					yes: 2,
					
					//groans
					groans_attack: 6,
					groans_death: 7,
					groans_pain: 7,
					groans_cough: 1,
					
					//npcs
					guard_hi: 1,
					npc_bye: 2,
					npc_hi: 1,
					trainer_bye: 1,
					trainer_hi: 2,
					vendor_bye: 2,
					vendor_hi: 2
				},
			
				ladybug:
				{
					assist: 2,
					bound: 2,
					cannotAfford: 2,
					cannotCarryMore: 2,
					cannotDoHere: 2,
					cannotDoThat: 2,
					cannotInvite: 2,
					cannotLoot: 2,
					cannotTrade: 2,
					cannotUse: 2,
					charge: 2,
					fire: 2,
					flee: 2,
					flirt: 7,
					follow: 3,
					fullBag: 2,
					funny: 14,
					goodbye: 2,
					heal: 2,
					hello: 2,
					help: 2,
					invalidTarget: 3,
					need2hands:2,
					no: 2,
					noTarget: 2,
					onCd: 2,
					outOfRange: 3,
					thanks: 2,
					wait: 2,
					wrongSlot: 2, 
					yes: 2,
					
					//groans
					groans_attack: 11,
					groans_death: 10,
					groans_pain: 12,
					
					//npcs
					guard_hi: 1,
					npc_bye: 2,
					npc_hi: 1,
					trainer_bye: 1,
					trainer_hi: 2,
					vendor_bye: 3,
					vendor_hi: 2
				},
				
				
				
				mantis:
				{
					assist: 2,
					bound: 2,
					cannotAfford: 2,
					cannotCarryMore: 2,
					cannotDoHere: 2,
					cannotDoThat: 2,
					cannotInvite: 2,
					cannotLoot: 2,
					cannotTrade: 2,
					cannotUse: 2,
					charge: 2,
					fire: 2,
					flee: 2,
					flirt: 5,
					follow: 2,
					fullBag: 2,
					funny: 10,
					goodbye: 2,
					heal: 2,
					hello: 2,
					help: 2,
					invalidTarget: 3,
					need2hands:2,
					no: 2,
					noTarget: 2,
					onCd: 2,
					outOfRange: 3,
					thanks: 2,
					wait: 2,
					wrongSlot: 2, 
					yes: 2,
					
					//groans
					groans_attack: 8,
					groans_death: 6,
					groans_pain: 12,
					groans_grunt: 2,
					groans_rage: 2,
					groans_effort: 2,
					
					//npcs
					guard_hi: 1,
					npc_bye: 2,
					npc_hi: 1,
					trainer_bye: 1,
					trainer_hi: 2,
					vendor_bye: 2,
					vendor_hi: 2
				},
				
				
				//only vendors
				cockroach:
				{
					vendor_buff: 2,
					vendor_bye: 1,
					funny: 5,
					vendor_hi: 2,
					vendor_randoms: 8
				},
				
				fly:
				{
					vendor_buff: 2,
					vendor_bye: 2,
					funny: 7,
					vendor_hi: 2,
					vendor_randoms: 9
				},
				
				mosquito:
				{
					vendor_buff: 2,
					vendor_bye: 2,
					funny: 9,
					vendor_hi: 2,
					vendor_randoms: 11
				},
				
				moth:
				{
					vendor_buff: 2,
					vendor_bye: 2,
					funny: 6,
					vendor_hi: 2,
					vendor_randoms: 7
				}
			},
			
			playMainVoice: function( eventName )
			{
				var _ccO = Component.bugcraft.currentCharacterObject;
				
				if( _ccO.isSpeaking )
				{
					return;
				}
				
				var raceName = _ccO.characterData.character_race, chosenSound = Math.ceil( Math.random() * this.events[ raceName ][ eventName ] );
				
				_ccO.isSpeaking = true;
				
				var _t = setTimeout( function()
				{
					_ccO.isSpeaking = false;
				}, 2000 );
				
				Application.sound.playOverwrite({
														url: Application.configuration.cdn.location[ 0 ].url + "/mp3/voices/" + raceName + "/" + ( eventName + chosenSound ) + ".mp3",
														volume: this.volume,
														onFinish: function()
														{
															clearTimeout( _t );
															
															_ccO.isSpeaking = false;
														}
													});
			},
			
			playRaceVoiceOverwrite: function( raceName, eventName )
			{
				var chosenSound = Math.ceil( Math.random() * this.events[ raceName ][ eventName ] );
				
				return Application.sound.playOverwrite({
														url: Application.configuration.cdn.location[ 0 ].url + "/mp3/voices/" + raceName + "/" + ( eventName + chosenSound ) + ".mp3",
														volume: this.volume
													});
			},
			
			// used for 3rd party voices
			playCharacterVoiceExclusiveOtherRace: function( characterObject, raceName, eventName )
			{
				if( characterObject.isSpeaking )
				{
					return false;
				}
				
				if( !raceName )
				{
					return false;
				}
				
				var  _tcd = characterObject.characterData, _ccd = Component.bugcraft.currentCharacterObject.characterData,
					chosenSound = Math.ceil( Math.random() * this.events[ raceName ][ eventName ] );
				
				characterObject.isSpeaking = true;
				
				var _t = setTimeout( function()
				{
					characterObject.isSpeaking = false;
				}, 2000 );
				
				Application.sound.playExclusive({
														url: Application.configuration.cdn.location[ 0 ].url + "/mp3/voices/" + raceName + "/" + ( eventName + chosenSound ) + ".mp3",
														volume: spellEffects.volumeByRangeVoice(
																					_ccd.character_zone_x,
																					_ccd.character_zone_y,
																					_tcd.character_zone_x,
																					_tcd.character_zone_y,
																					spellEffects.volumeRangeLong
																				),
														onFinish: function()
														{
															clearTimeout( _t );
															
															characterObject.isSpeaking = false;
														}
													});
			},
			
			// used for 3rd party voices
			playCharacterVoiceExclusive: function( characterObject, eventName )
			{
				if( characterObject.isSpeaking )
				{
					return false;
				}
				
				var  _tcd = characterObject.characterData, raceName = _tcd.character_race;
				
				if( !raceName )
				{
					return false;
				}
				
				var _ccd = Component.bugcraft.currentCharacterObject.characterData,
					chosenSound = Math.ceil( Math.random() * this.events[ raceName ][ eventName ] );
				
				characterObject.isSpeaking = true;
				
				var _t = setTimeout( function()
				{
					characterObject.isSpeaking = false;
				}, 2000 );
				
				Application.sound.playExclusive({
														url: Application.configuration.cdn.location[ 0 ].url + "/mp3/voices/" + raceName + "/" + ( eventName + chosenSound ) + ".mp3",
														volume: spellEffects.volumeByRangeVoice(
																					_ccd.character_zone_x,
																					_ccd.character_zone_y,
																					_tcd.character_zone_x,
																					_tcd.character_zone_y,
																					spellEffects.volumeRangeLong
																				),
														onFinish: function()
														{
															clearTimeout( _t );
															
															characterObject.isSpeaking = false;
														}
													});
			}
		},
		
		screen:
		{
			_soundPointer: null,
			_musicLoopTimeoutPointer: null,
			
			volume: 10,
			
			changeVolume: function( newVolume )
			{
				if( this._soundPointer )
				{
					this._soundPointer.setVolume( newVolume );
				}
				
				this.volume = newVolume;
			},
			
			selectCharacter: function()
			{
				self._soundPointer = Application.sound.playExclusive({
													url: Application.configuration.cdn.location[ 0 ].url + "/mp3/newCharacter/newCharacter1.mp3",
													volume: Component.bugcraft.sound.screen.volume,
													onFinish: function()
													{
														// play the next sound
														self._musicLoopTimeoutPointer = setTimeout(
																												Component.bugcraft.sound.screen.selectCharacter,
																												5000 + Math.random() * 12500
																											);
													}
												});
			}
		},
		
		zone:
		{
			zones:
			{
				1: 2,
				2: 2,
				4: 2,
				51: 2
			},
			
			volume: 10,
			minDelay: 5000,
			maxDelay: 30000,
			
			_musicLoopTimeoutPointer: null,
			_musicLoopTimeoutPointer2: null,
			_soundPointer: null,
			_soundPointer2: null,
			
			changeVolume: function( newVolume )
			{
				if( Component.bugcraft.sound.zone._soundPointer )
				{
					Component.bugcraft.sound.zone._soundPointer.setVolume( newVolume );
				}
				
				if( Component.bugcraft.sound.zone._soundPointer2 )
				{
					Component.bugcraft.sound.zone._soundPointer2.setVolume( newVolume );
				}
				
				Component.bugcraft.sound.zone.volume = newVolume;
			},
			
			stopDeathLoop: function()
			{
				clearTimeout( Component.bugcraft.sound.zone._musicLoopTimeoutPointer );
				clearTimeout( Component.bugcraft.sound.zone._musicLoopTimeoutPointer2 );
				
				if( Component.bugcraft.sound.zone._soundPointer )
				{
					Component.bugcraft.sound.zone._soundPointer.stop();
					//Component.bugcraft.sound.zone._soundPointer.destruct();
				}
				
				if( Component.bugcraft.sound.zone._soundPointer2 )
				{
					Component.bugcraft.sound.zone._soundPointer2.stop();
					//Component.bugcraft.sound.zone._soundPointer2.destruct();
				}
			},
			
			playDeathLoop: function()
			{
				var _deathSound = function()
				{
					Component.bugcraft.sound.zone._soundPointer = Application.sound.playExclusive({
														url: Application.configuration.cdn.location[ 0 ].url + "/mp3/death/soundTrack1.mp3",
														volume: Component.bugcraft.sound.zone.volume,
														onFinish: function()
														{
															// play the next sound
															Component.bugcraft.sound.zone._musicLoopTimeoutPointer = setTimeout(
																													_deathSound,
																													self.minDelay + Math.random() * ( self.maxDelay - self.minDelay )
																												);
														}
													});
				}
				
				var _deathVoice = function()
				{
					Component.bugcraft.sound.zone._soundPointer2 = Application.sound.playExclusive({
															url: Application.configuration.cdn.location[ 0 ].url + "/mp3/death/soundTrack2.mp3",
															volume: Component.bugcraft.sound.zone.volume,
															onFinish: function()
															{
																// play the next sound
																Component.bugcraft.sound.zone._musicLoopTimeoutPointer2 = setTimeout(
																														_deathVoice,
																														self.minDelay
																													);
															}
														});
				}
				
				_deathSound();
				_deathVoice();
			},
			
			stopRandomAreaLoop: function()
			{
				clearTimeout( Component.bugcraft.sound.zone._musicLoopTimeoutPointer );
				
				if( Component.bugcraft.sound.zone._soundPointer )
				{
					Component.bugcraft.sound.zone._soundPointer.stop();
					//Component.bugcraft.sound.zone._soundPointer.destruct();
				}
			},
			
			playRandomAreaLoop: function()
			{
				var _maxSounds = this.zones[ Map.mapID ], self = this, _playedSounds = [];
				
				var _playSound = function()
				{
					if( _playedSounds.length >= _maxSounds - 1 )
					{
						_playedSounds = [];
					}
					
					while( true )
					{
						//Application.debug.addError( "entering while loop" );
						
						var _soundNumber = Math.ceil( Math.random() * _maxSounds );
						
						if( _playedSounds.indexOf( _soundNumber ) != -1 )
						{
							continue;
						}
						
						break;
					}
					
					Component.bugcraft.sound.zone._soundPointer = Application.sound.playExclusive({
															url: Application.configuration.cdn.location[ 0 ].url + "/mp3/zones/" + Map.mapID + "/" + _soundNumber + ".mp3",
															volume: Component.bugcraft.sound.zone.volume,
															onFinish: function()
															{
																// play the next sound
																Component.bugcraft.sound.zone._musicLoopTimeoutPointer = setTimeout(
																														_playSound,
																														self.minDelay + Math.random() * ( self.maxDelay - self.minDelay )
																													);
															}
														});
				}
				
				// the first time the loop starts the delay must be minimum
				Component.bugcraft.sound.zone._musicLoopTimeoutPointer = setTimeout( _playSound, self.minDelay );
			}
		}
	}	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
