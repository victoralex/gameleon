	
	/*
		--------------------------
		BattleField Character
		--------------------------
	*/
	
	Component.bugcraft._characterIDs = [];
	Component.bugcraft._characterData = [];
	
	Component.bugcraft.character = function( characterData, pageContext )
	{
		Component.bugcraft._characterIDs.push( characterData.cid );		// fast backtrace
		
		var self = this, _currentTargetCharacter = null, _oldDistance = 0, _skinObject = null,
				_moveTimeoutPointer = null, _updateDistancePointer = null,
				_currentPath = [], afterEndOfPath = function() {},
				idleTimeoutSeconds = 90, _evaluateDistanceMS = 1000, _idleTimeoutPointer = null, _followTimeoutPointer = null;
		
		//
		// Radial sounds
		//
		
		this.disableRadialSounds = function()
		{
			self.removeVisualEffect( spellEffects.ambientRadialSounds );
		}
		
		//
		// Skin management
		//
		
		this.setSkin = function( skinName )
		{
			if( self.characterData.character_skin == skinName )
			{
				return;
			}
			
			if( _skinObject != null )
			{
				// already have a skin on this object
				
				_skinObject.eventStop();
			}
			
			// set the new values
			
			self.characterData.character_skin = skinName;
			
			_skinObject = new Component.bugcraft.skinsStructure.skinObject({
																								skinName: skinName,
																								characterObject: self
																							});
			
			// my character's avatar
			_skinObject.getStartFrame();
		}
		
		this.getSkin = function()
		{
			return _skinObject;
		}
		
		//
		// Character data merging
		//
		
		this.mergeMinimalCharacterData = function( newData )
		{
			// init the skin object
			
			self.characterData.character_id = newData.cid;
			self.characterData.character_id_object_pool = newData.op;
			self.characterData.character_id_owner_character = newData.ow;
			self.characterData.character_id_corpse_character = newData.co;
			
			self.characterData.character_guild_name = newData.cg;
			self.characterData.character_name = newData.n;
			self.characterData.character_zone_x = newData.x;
			self.characterData.character_zone_x_target = newData.xt;
			self.characterData.character_zone_y = newData.y;
			self.characterData.character_zone_y_target = newData.yt;
			self.characterData.character_width = newData.w;
			self.characterData.character_height = newData.h;
			self.characterData.character_rotation = newData.ro;
			self.characterData.character_speed = newData.s;
			self.characterData.character_hp_current = newData.h_c;
			self.characterData.character_hp_max = newData.h_m;
			self.characterData.character_race = newData.r;
			self.characterData.character_class = newData.cl;
			self.characterData.character_faction = newData.f;
			self.characterData.character_faction_binary = newData.fb;
			self.characterData.character_level = newData.l;
			self.characterData.character_is_alive = newData.d;
			self.characterData.character_type = newData.ty;
			self.characterData.character_reacts_to_binary = newData.rtb;
			self.characterData.character_is_stealth = newData.st;
			self.characterData.character_is_vendor = newData.iv;
			self.characterData.character_is_questgiver = newData.iq;
			self.characterData.character_is_usable = newData.iu;
			self.characterData.character_is_targetable = newData.ta;
			
			self.setSkin( newData.sk );
		}
		
		// voice
		this.isSpeaking = false;
		
		// UI and login relationships
		this.isMain = false;
		this.isTarget = false;
		this.isVisible = false;
		this.isHovered = false;
		this.isCasting = false;
		this.isInSameLayer = true;
		this.isInside = false;
		this.currentPolyIndex = 0;
		
		// "use" windows
		this.isShowingQuests = false;
		this.isShowingInventory = false;
		
		// UI objects
		this._internal = {
			spellEffects: [],
			soundEffects: [],
			characterImage: new Image()
		};
		
		this.characterData = {};
		this.characterScript = null,
		
		this.questsData = {},
		
		this.mergeMinimalCharacterData( characterData ); // init the character data structure based on the init parameters
		
		this.appliedBuffs = characterData.b;
		this.appliedEffects = [ 0, 0, 0, 0, 0, 0 ]; // cleanse, bleed, stun, heal, disarm, modifier
		
		// attributes required only for graphical purposes
		this.characterData.character_previous_x = this.characterData.character_zone_x;
		this.characterData.character_previous_y = this.characterData.character_zone_y;
		this.characterData.character_deleteRange = 166;
		this.characterData.characterImageAlpha = 0;
		
		//
		// Events
		//
		
		this.events = {
			
			use: [],
			die: [],
			hide: [],
			show: [],
			setUnusable: [],
			setUsable: [],
			damageTake: [],
			
			_add: function( eventName, callBack )
			{
				return {
						index: self.events[ eventName ].push( callBack ) - 1,
						eventName: eventName
					}
			},
			
			_exists: function( eventName, callBack )
			{
				var _e = self.events[ eventName ];
				
				for(var i in _e)
				{
					if( _e[ i ] != callBack )
					{
						continue;
					}
					
					return true;
				}
				
				return false;
			},
			
			_removeByFunction: function( eventName, callBack )
			{
				var _e = self.events[ eventName ];
				
				for(var i in _e)
				{
					if( _e[ i ] != callBack )
					{
						continue;
					}
					
					delete self.events[ eventName ][ i ];
					
					return true;
				}
				
				return false;
			},
			
			_remove: function( eventObjectReturn )
			{
				delete self.events[ eventObjectReturn.eventName ][ eventObjectReturn.index ];
			},
			
			_run: function( eventName, eventParams )
			{
				var _e = self.events[ eventName ];
				
				for(var i in _e)
				{
					_e[ i ]( eventParams );
				}
			}
			
		};
		
		//
		// Un(Usable)
		//
		
		this.command_set_unusable = function( updateData )
		{
			self.characterData.character_is_usable = null;
			
			self.removeVisualEffect( spellEffects.lootableComplete );
			
			self.events._run( "setUnusable", { } );
		}
		
		this.command_set_usable = function( updateData )
		{
			if( ! (self.characterData.character_reacts_to_binary & Component.bugcraft.currentCharacterObject.characterData.character_faction_binary ) )
			{
				// doesn't react to the main character. useless.
				
				return;
			}
			
			self.characterData.character_is_usable = '';
			
			new spellEffects.lootableComplete({
													sourceCharacter: self,
													targetCharacter: self
												});
			
			self.events._run( "setUsable", { } );
		}
		
		//
		// Cast specific
		//
		
		var _castAnimationPointer = null;
		this.command_cast_start_self = function( updateData )
		{
			self.isCasting = true;
			
			var _lO = Component.bugcraft._layoutObjects,
					_currentProgress = 0,
					_castUpdateTimeoutPointer = null,
					_bCO = _lO.barCastTimeContainerObject,
					_bCOS = _bCO.style,
					_updateInterval = Math.max( 45, updateData.t / 100 ),
					_progressIncrement = 100 / ( updateData.t / _updateInterval );
			
			var _setAlpha = function( alphaIndex )
			{
				_bCOS.opacity = alphaIndex;
				_bCOS.MozOpacity = alphaIndex;
				_bCOS.filter = "alpha(opacity=" + ( alphaIndex * 100 ) + ")";
			}
			
			new spellEffects.castAnimationComplete({
														targetCharacter: self
													});
			
			var _periodicUpdate = function()
			{
				_currentProgress += _progressIncrement;
				
				Component.bugcraft._renderProgressBarWithText({
																	text: updateData.d,
																	number: _currentProgress > 100 ? 100 : _currentProgress,
																	total: 100,
																	numbersObject: _lO.barCastTimeNumbersObject,
																	fillingObject: _lO.barCastTimeFillingObject,
																	endingObject: _lO.barCastTimeEndingObject
																});
				
				if( _currentProgress >= 100 )
				{
					return;
				}
				
				_castUpdateTimeoutPointer = setTimeout( _periodicUpdate, _updateInterval );
			};
			
			var _fadeOutBar = function()
			{
				var _currentAlpha = 1;
				
				var _changeAlpha = function()
				{
					_currentAlpha -= 0.1;
					
					if( _currentAlpha < 0 )
					{
						_bCO.className = "hidden";
						
						return;
					}
					
					_setAlpha( _currentAlpha );
					
					_castAnimationPointer = setTimeout( _changeAlpha, 45 );
				}
				
				_changeAlpha();
			}
			
			self.command_cast_interrupt = function( updateData )
			{
				self.isCasting = false;
				
				self.removeVisualEffect( spellEffects.castAnimationComplete );
				
				// ensure the bar updates are no longer being done
				clearTimeout( _castUpdateTimeoutPointer );
				
				_bCO.className = "barCastTimeInterrupted";
				Component.bugcraft._renderProgressBarStatic({
																text: "interrupted",
																numbersObject: _lO.barCastTimeNumbersObject,
																fillingObject: _lO.barCastTimeFillingObject,
																endingObject: _lO.barCastTimeEndingObject
															});
				
				_castAnimationPointer = setTimeout( _fadeOutBar, 1500 );
				
				Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
			}
			
			self.command_cast_complete = function( updateData )
			{
				self.isCasting = false;
				
				self.removeVisualEffect( spellEffects.castAnimationComplete );
				
				_currentProgress = 100;
				
				_fadeOutBar();
				
				Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
			}
			
			clearTimeout( _castAnimationPointer );
			_bCO.className = "barCastTime";
			
			_setAlpha( 1 );
			_periodicUpdate();
			
			Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
		}
		
		this.command_cast_interrupt_self = function( updateData )
		{
			self.isCasting = false;
		}
		
		this.command_cast_complete_self = function( updateData )
		{
			self.isCasting = false;
		}
		
		this.command_cast_start_third_party = function( updateData )
		{
			self.isCasting = true;
		}
		
		this.command_cast_interrupt_third_party = function( updateData )
		{
			self.isCasting = false;
		}
		
		this.command_cast_complete_third_party = function( updateData )
		{
			self.isCasting = false;
		}
		
		//
		// Effects management
		//
		
		var _randomNPCEffectPeriodicPointer = null, _randomChosenNPCEffect = null;
		this.showRandomNPCEffectPeriodically = function()
		{
			var _randomEffectFunction = function()
			{
				var _NPCEffect = [
									spellEffects.buffTacticsComplete,
									spellEffects.auraMagicPurpleComplete,
									spellEffects.buffShield,
									spellEffects.auraBlue133Complete,
									spellEffects.buffRallyComplete,
									spellEffects.shieldWater,
									spellEffects.buffHerbalShieldYellow,
									spellEffects.buffPolishShell,
									spellEffects.auraSpin3,
									spellEffects.auraTime151Complete,
									spellEffects.buffInspiringVigorComplete,
									spellEffects.buffAwarenessComplete,
									spellEffects.buffCunningComplete
								],
				_chosenEffect = _NPCEffect[ Math.floor( Math.random() * _NPCEffect.length ) ];
				
				_randomChosenNPCEffect = new _chosenEffect({
																		targetCharacter: self
																	});
				
				_randomNPCEffectPeriodicPointer = setTimeout( _randomEffectFunction, 180000 + Math.random() * 300000 );
			}
			
			_randomNPCEffectPeriodicPointer = setTimeout( _randomEffectFunction, Math.random() * 60000 );
		}
		
		this.stopRandomNPCEffects = function()
		{
			if( _randomChosenNPCEffect )
			{
				_randomChosenNPCEffect.remove();
			}
			
			clearTimeout( _randomNPCEffectPeriodicPointer );
		}
		
		this.removeAllVisualEffects = function()
		{
			// remove old effect
			var _iSpellEffects = self._internal.spellEffects;
			
			for( var i in _iSpellEffects )
			{
				// effect needs to be removed
				
				if( typeof _iSpellEffects[ i ] != "object" )
				{
					continue;
				}
				
				_iSpellEffects[ i ].remove();
			}
		}
		
		this.showRandomDamageEffect = function()
		{
			var _damageEffects = [
												spellEffects.debrisBlood,
												spellEffects.debrisBloodStain1,
												spellEffects.debrisBloodStain2,
												spellEffects.debrisBloodStain3,
												spellEffects.debrisBloodStain4,
												spellEffects.debrisGrey,
												spellEffects.debrisMeat,
												spellEffects.debrisMeat2,
												spellEffects.debrisSplatter1,
												spellEffects.debrisSplatter2,
												spellEffects.debrisSplatter3,
												spellEffects.debrisYellow,
												spellEffects.damageChemicalCorrosive,
												spellEffects.damageChemicalPoison,
												spellEffects.damagePhysicalBloodSplatter,
												spellEffects.damagePhysicalExplodeBits,
												spellEffects.damagePhysicalExplodeGore,
												spellEffects.damagePhysicalHitExplode,
												spellEffects.damagePhysicalShards,
												spellEffects.damageMeatExplode
											],
					_chosenEffect = _damageEffects[ Math.floor( Math.random() * _damageEffects.length ) ];
			
			new _chosenEffect({
									targetCharacter: self
								});
		}
		
		this.removeVisualEffect = function( effectDefinition )
		{
			// remove old effect
			var _iSpellEffects = self._internal.spellEffects;
			
			for( var i in _iSpellEffects )
			{
				var spellEffectObject = _iSpellEffects[i].constructor;
				
				if( spellEffectObject != effectDefinition )
				{
					continue;
				}
				
				// effect needs to be removed
				
				_iSpellEffects[i].remove();
				
				return true;
			}
			
			return false;
		}
		
		//
		// Targetable specific
		//
		
		
		
		//
		// Stealth specific
		//
		
		this.command_stealth_enter_third_party = function()
		{
			if( self.characterData.character_is_friendly_to_main == true )
			{
				// friendly
				
				new spellEffects.characterInvisibility({
															targetCharacter: self
														});
			}
			else
			{
				// enemy
				
				self.hide(function()
				{
					
				});
			}
		}
		
		this.command_stealth_enter_self = function()
		{
			new spellEffects.characterInvisibility({
														targetCharacter: self
													});
		}
		
		this.command_stealth_leave_third_party = function( characterData )
		{
			// update properties
			self.mergeMinimalCharacterData( characterData );
			
			if( self.characterData.character_is_friendly_to_main )
			{
				// friendly
				
				new spellEffects.characterFadeIn({
															targetCharacter: self
														});
			}
			else
			{
				self.show();
			}
		}
		
		this.command_stealth_leave_self = function()
		{
			self.removeVisualEffect( spellEffects.characterInvisibility );
			
			new spellEffects.characterFadeIn({
														targetCharacter: self
													});
		}
		
		//
		// chat specific
		//
		
		this.showChatBubbleSay = function( chatText )
		{
			// remove old effect
			var _iSpellEffects = self._internal.spellEffects;
			
			for( var i in _iSpellEffects )
			{
				var spellEffectObject = _iSpellEffects[i].constructor;
				
				if(
					spellEffectObject != spellEffects.floatingChatImageBubble
					&& spellEffectObject != spellEffects.floatingChatTextBubble
				)
				{
					continue;
				}
				
				// effect needs to be removed
				
				_iSpellEffects[i].remove();
			}
			
			// create new chat bubble
			new spellEffects.floatingChatTextBubble({
															targetCharacter: self,
															text: chatText
														});
		}
		
		// yell
		this.showChatBubbleYell = function( chatText )
		{
			// remove old effect
			var _iSpellEffects = self._internal.spellEffects;
			
			for( var i in _iSpellEffects )
			{
				var spellEffectObject = _iSpellEffects[i].constructor;
				
				if(
					spellEffectObject != spellEffects.floatingChatImageBubble
					&& spellEffectObject != spellEffects.floatingChatTextBubble
				)
				{
					continue;
				}
				
				// effect needs to be removed
				
				_iSpellEffects[i].remove();
			}
			
			// create new chat bubble
			new spellEffects.floatingChatTextBubble({
														targetCharacter: self,
														text: chatText,
														color: "#f94c00"
													});
		}
		
		// yell
		this.showChatBubbleEmote = function( emoteName )
		{
			// remove old effect
			var _iSpellEffects = self._internal.spellEffects;
			
			for( var i in _iSpellEffects )
			{
				var spellEffectObject = _iSpellEffects[i].constructor;
				
				if(
					spellEffectObject != spellEffects.floatingChatImageBubble
					&& spellEffectObject != spellEffects.floatingChatTextBubble
				)
				{
					continue;
				}
				
				// effect needs to be removed
				
				_iSpellEffects[i].remove();
			}
			
			// create new chat bubble
			new spellEffects.floatingChatImageBubble({
															targetCharacter: self,
															image: Application.configuration.cdn.location[ 0 ].url + "/img/chat/emotes/" + emoteName + ".png"
														});
		}
		
		// emotes treatment
		this.command_emote = function( emoteName, emoteText )
		{
			// add to the chat window
			Component.bugcraft.pageChatInsertMessage( "Emote", emoteText );
			
			// decide which sound should be played
			switch( emoteName )
			{
				case "as":
				case "assist":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "assist" );
					self.showChatBubbleEmote( "assist" );
					
				break;
				case "ch":
				case "charge":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "charge" );
					self.showChatBubbleEmote( "charge" );
					
				break;
				case "attack":
				case "att":
				case "fire":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "attack" );
					self.showChatBubbleEmote( "attack" );
					
				break;
				case "flee":
				case "retreat":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "flee" );
					self.showChatBubbleEmote( "flee" );
					
				break;
				case "f":
				case "follow":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "follow" );
					self.showChatBubbleEmote( "follow" );
					
				break;
				case "bye":
				case "goodbye":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "goodbye" );
					self.showChatBubbleEmote( "goodbye" );
					
				break;
				case "heal":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "heal" );
					self.showChatBubbleEmote( "heal" );
					
				break;
				case "hi":
				case "hello":
				case "greetings":
				case "greet":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "hello" );
					self.showChatBubbleEmote( "hello" );
					
				break;
				case "help":
				case "aid":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "help" );
					self.showChatBubbleEmote( "help" );
					
				break;
				case "no":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "no" );
					self.showChatBubbleEmote( "no" );
					
				break;
				case "thank":
				case "thanks":
				case "thankyou":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "thanks" );
					self.showChatBubbleEmote( "thanks" );
					
				break;
				case "wait":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "wait" );
					self.showChatBubbleEmote( "wait" );
					
				break;
				case "yes":
				case "agree":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "yes" );
					self.showChatBubbleEmote( "yes" );
					
				break;
				case "laugh":
				case "rofl":
				case "lol":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "laugh" );
					self.showChatBubbleEmote( "laugh" );
					
				break;
				case "wave":
					
					self.showChatBubbleEmote( "wave" );
					
				break;
				case "point":
					
					self.showChatBubbleEmote( "point" );
					
				break;
				case "hug":
					
					self.showChatBubbleEmote( "hug" );
					
				break;
				case "dance":
					
					self.showChatBubbleEmote( "dance" );
					
				break;
				case "flirt":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "flirt" );
					self.showChatBubbleEmote( "flirt" );
					
				break;
				case "sad":
					
					self.showChatBubbleEmote( "sad" );
					
				break;
				case "kiss":
					
					self.showChatBubbleEmote( "kiss" );
					
				break;
				case "boo":
					
					self.showChatBubbleEmote( "boo" );
					
				break;
				case "cheer":
					
					self.showChatBubbleEmote( "cheer" );
					
				break;
				case "clap":
					
					self.showChatBubbleEmote( "clap" );
					
				break;
				case "applaud":
					
					self.showChatBubbleEmote( "applaud" );
					
				break;
				case "love":
					
					self.showChatBubbleEmote( "love" );
					
				break;
				case "slap":
					
					self.showChatBubbleEmote( "slap" );
					
				break;
				case "salute":
					
					self.showChatBubbleEmote( "salute" );
					
				break;
				case "smile":
					
					self.showChatBubbleEmote( "smile" );
					
				break;
				case "sad":
					
					self.showChatBubbleEmote( "sad" );
					
				break;
				case "funny":
				case "joke":
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "funny" );
					self.showChatBubbleEmote( "funny" );
					
				break;
			}
		}
		
		this.command_use = function( byCharacterObject )
		{
			// stop any idle movement
			self.stopIdleMovement();
			
			if( self.characterData.character_type != 2 )
			{
				var _cd = byCharacterObject.characterData;
				
				self.changeRotation( _cd.character_zone_x, _cd.character_zone_y );
			}
			
			self.events._run( "use", pageContext );
		}
		
		// set the character's initial state
		this.initialState = function()
		{
			// death and taxes
			
			( self.characterData.character_is_alive == null ) ? self.command_die() : null;//self.command_resurrect();
		}
		
		// more data about the current character has been received
		this.mergeCharacterData = function( newData )
		{
			for(var i in newData)
			{
				self.characterData[ i ] = newData[ i ];
			}
			
			return true;
		}
		
		this.evaluateRelationshipToMain = function()
		{
			self.characterData.character_is_friendly_to_main = Map._evaluateRelationshipToCharacter( self );
		}
		
		// post initialize function. will check if any existing actions are in progress
		this.checkExistingActions = function()
		{
			// if the character was moving already, initialize the movement
			
			if(
				_moveTimeoutPointer == null && self.characterData.character_zone_x_target != null && self.characterData.character_zone_y_target != null
				&& ( self.characterData.character_zone_x_target != self.characterData.character_zone_x || self.characterData.character_zone_y_target != self.characterData.character_zone_y )
			)
			{
				self.command_move( self.characterData.character_zone_x_target, self.characterData.character_zone_y_target );
				
				self.characterData.character_zone_x_target = null;
				self.characterData.character_zone_y_target = null;
			}
		}
		
		this.setTargetToMain = function()
		{
			if(
				self.isTarget == true
				&& !Component.bugcraft.currentCharacterTarget
			)
			{
				return false;
			}
			
			var _t = Component.bugcraft.currentCharacterTarget;
			
			//remove the target focus from the old target
			_t.removeFocusPointerEffect();
			
			if( self.characterData.character_id != _t.characterData.character_id )
			{
				_t.isTarget = false;
				_t.clearAppliedBuffsOnTarget();
			}
			
			Map.minimap.show();
			
			// ensure nothing will happen after the current path is done
			afterEndOfPath = function() { };
			
			if( self.isTarget == false )
			{
				Component.bugcraft.currentCharacterTarget = self;
				self.isTarget = true;
				
				self.stopUpdateDistanceToTarget();
			
				// update bottom bar buffs
				Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
				
				Application.debug.add( "Target set to (3): " + Component.bugcraft.currentCharacterTarget.characterData.character_id );
			}
		}
		
		this.setTarget = function( characterObject )
		{
			var _currentTargetCharacter = Component.bugcraft.currentCharacterTarget;
			
			// we've clicked on a character. set it as a target
			if( _currentTargetCharacter )
			{
				// we already had a target character. mark it as not being the target anymore
				
				//remove the target focus from the old target
				_currentTargetCharacter.removeFocusPointerEffect();
				
				_currentTargetCharacter.isTarget = false;
				_currentTargetCharacter.clearAppliedBuffsOnTarget();
			}
			
			// ensure nothing will happen after the current path is done
			afterEndOfPath = function() { };
			
			// specific for the main character
			Component.bugcraft.currentCharacterTarget = characterObject;
			
			_currentTargetCharacter = characterObject;
			_currentTargetCharacter.isTarget = true;
			
			_currentTargetCharacter.updateOnTarget();
			
			// start updating the distance to the target
			self.updateDistanceToTargetPeriodically();
			
			// update bottom bar buffs
			Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
		}
		
		//
		// Movement
		//
		
		var _attackAnimationTimeout = null, _attackAnimationFramesDisplayed = 0;
		this.performAttackAnimation = function( targetRange )
		{
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "groans_attack" );
			
			if( targetRange * 8 > 90 )
			{
				return false;
			}
			
			_skinObject.setState( "attackMelee" );
			
			var _animation = function()
			{
				_skinObject.getNextFrame();
				
				_attackAnimationFramesDisplayed++;
				
				if( _attackAnimationFramesDisplayed > 4 )
				{
					_skinObject.setState( "idle" );
					
					return;
				}
				
				_attackAnimationTimeout = setTimeout( _animation, 150 );
			}
			
			_attackAnimationFramesDisplayed = 0;
			clearTimeout( _attackAnimationTimeout );
			_animation();
			
			return true;
		}
		
		//
		// Distance Evaluation
		//
		
		this.evaluateDistanceToTarget = function( characterObject )
		{
			
		}
		
		this.updateDistanceToTargetPeriodically = function()
		{
			self.stopUpdateDistanceToTarget();
			
			var cd = self.characterData, ct = Component.bugcraft.currentCharacterTarget.characterData;
			
			if( !Map.getStraightPath(
									cd.character_zone_x,
									cd.character_zone_y,
									ct.character_zone_x,
									ct.character_zone_y,
									0,
									function( _path )
									{
									
									}
								) )
			{
				// not in line of sight
				
				self.characterData.character_distance_to_target = Infinity;
			}
			else
			{
				self.characterData.character_distance_to_target = Math.sqrt( Math.pow( cd.character_zone_y - ct.character_zone_y, 2 ) + Math.pow( cd.character_zone_x - ct.character_zone_x, 2 ) );
			}
			
			if( self.characterData.character_distance_to_target != _oldDistance )
			{
				_oldDistance = self.characterData.character_distance_to_target;
				
				Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
			}
			
			_updateDistancePointer= setTimeout( self.updateDistanceToTargetPeriodically, 166 ); // for 8 calculations / second
			
			return self.characterData.character_distance_to_target;
		}
		
		this.stopUpdateDistanceToTarget = function()
		{
			// distance is zero because i have no target, hence i target myself
			self.characterData.character_distance_to_target = 0;
			
			clearTimeout( _updateDistancePointer );
		}
		
		// function will change the character rotation considering the target points
		this.changeRotation = function( newX, newY )
		{
			self.characterData.character_rotation = Math.atan2( ( self.characterData.character_zone_y - newY ), ( self.characterData.character_zone_x - newX ) ) * 57.2957;
		}
		
		this.stopFollow = function()
		{
			afterEndOfPath = function() { };
			clearTimeout( _followTimeoutPointer );
		}
		
		this.followCharacter = function( characterObject )
		{
			var cd = characterObject.characterData;
			
			// issue the next movement action
			var _issueNextMovement = function()
			{
				if( self.updateDistanceToTargetPeriodically() == Infinity )
				{
					return;
				}
				
				self.requestMove(
								cd.character_zone_x,
								cd.character_zone_y,
								cd.character_width + 15
							);
				
				_followTimeoutPointer = setTimeout( _issueNextMovement, _evaluateDistanceMS );
			}
			
			_issueNextMovement();
		}
		
		this.interactWith = function( characterObject )
		{
			var _cd = characterObject.characterData;
			
			afterEndOfPath = function()
			{
				Application.websocket.socket.send( '{"c":"useObject","target_id":' + _cd.character_id + '}' );
				
				afterEndOfPath = function() { };
			}
			
			// issue the next movement action
			var _issueNextMovement = function()
			{
				self.requestMove(
								_cd.character_zone_x,
								_cd.character_zone_y,
								_cd.character_width * 0.75
							);
				
				_followTimeoutPointer = setTimeout( _issueNextMovement, _evaluateDistanceMS );
			}
			
			_issueNextMovement();
		}
		
		this.interactWithTarget = function()
		{
			var _cct = Component.bugcraft.currentCharacterTarget, _cd = _cct.characterData;
			
			afterEndOfPath = function()
			{
				afterEndOfPath = function() { };
				
				if( self.updateDistanceToTargetPeriodically() == Infinity )
				{
					return;
				}
				
				if( _cd.character_is_usable != null )
				{
					Application.websocket.socket.send( '{"c":"useObject","target_id":' + _cd.character_id + '}' );
				}
				else if( _cd.character_is_questgiver != null )
				{
					_cct.command_use( self );
				}
				else if( _cd.character_is_vendor != null )
				{
					_cct.command_use( self );
				}
			}
			
			// issue the next movement action
			var _issueNextMovement = function()
			{
				self.requestMove(
								_cd.character_zone_x,
								_cd.character_zone_y,
								75
							);
				
				_followTimeoutPointer = setTimeout( _issueNextMovement, _evaluateDistanceMS );
			}
			
			_issueNextMovement();
		}
		
		var _enableAutoAttackTimeout = null;
		this.enableAutoAttack = function( characterObject )
		{
			// using buff 75 (strike) which should be enabled by default
			var cd = characterObject.characterData, _b = Component.bugcraft.ui.buffObjects[ 75 ], _s = _b.args.buff.buff_cooldown_seconds * 1000;
			
			var _attackPeriodic = function()
			{
				if(
					self.characterData.character_distance_to_target > _b.args.buff.buff_target_range
					|| characterObject.isTarget == false	// set the target to something else
				)
				{
					// target moved too far away
					
					afterEndOfPath = function() { };
					
					return;
				}
				
				if( _b.isOnCooldown() )
				{
					_enableAutoAttackTimeout = setTimeout(
																	_attackPeriodic,
																	_b.args.buff.cs_cooldown_remaining_seconds * 1000
																);
					
					return;
				}
				
				Application.websocket.socket.send( '{"c":"cast","buff_id":75,"target_id":' + cd.character_id + '}' );
				
				_enableAutoAttackTimeout = setTimeout( _attackPeriodic, _s );
			}
			
			self.stopIdleMovement();
			_attackPeriodic();
		}
		
		this.attackCharacterInMelee = function( characterObject, _x, _y )
		{
			var cd = characterObject.characterData, _b = Component.bugcraft.ui.buffObjects[ 75 ];
			
			afterEndOfPath = function()
			{
				clearTimeout( _followTimeoutPointer );
				
				if( self.characterData.character_distance_to_target > _b.args.buff.buff_target_range )
				{
					// still too far away
					
					_issueNextMovement();
				}
				else
				{
					// we're in range for the auto attack
					
					afterEndOfPath = function() { };
					self.enableAutoAttack( characterObject );
				}
			};
			
			clearTimeout( _followTimeoutPointer );
			
			// issue the next movement action
			var _issueNextMovement = function()
			{
				self.requestMove(
								_x,
								_y,
								0
							);
				
				_followTimeoutPointer = setTimeout( _issueNextMovement, _evaluateDistanceMS );
			}
			
			_issueNextMovement();
		}
		
		this.requestMove = function( targetX, targetY, range )
		{
			var cd = self.characterData;
			
			Map.getMinimalPath(
							Math.round( cd.character_zone_x ),
							Math.round( cd.character_zone_y ),
							targetX,
							targetY,
							range,
							function( path )
							{
								// set this character's path
								
								if(
									path.length == 0
									|| _currentPath.toString() == path.toString()
									|| ( path[ 0 ][ 0 ] == cd.character_zone_x && path[ 0 ][ 1 ] == cd.character_zone_y )
								)
								{
									// we're already there
									
									afterEndOfPath();
									
									return;
								}
								
								// this is a new path
								
								_currentPath = path;
								
								// issue the first movement step
								
								self.changeRotation( path[0][0], path[0][1] );
								
								Application.websocket.socket.send( '{"c":"move","r":' + Math.round( cd.character_rotation ) + ',"x":' + ( path[0][0] ) + ',"y":' + ( path[0][1] ) + '}' );
								
								_currentPath.shift();		// remove this from the path
							}
						);
		}
		
		// show the pointer ( x arrow ) on the target place
		this.showMovementPointer = function( x, y )
		{
			var _iSpellEffects = self._internal.spellEffects;
			
			for( var i in _iSpellEffects )
			{
				var spellEffectObject = _iSpellEffects[i].constructor;
				
				if( spellEffectObject != spellEffects.moveAnimation )
				{
					continue;
				}
				
				// effect needs to be removed
				
				_iSpellEffects[i].remove();
			}
			
			// show the cursor for the target point
			new spellEffects.moveAnimation({
													targetCharacter: self,
													x: x,
													y: y
												});
		}
		
		this.command_rotate = function( r )
		{
			self.characterData.character_rotation = r;
		}
		
		// specific main character movement
		this.command_move_self = function( x, y )
		{
			//clearTimeout( _enableAutoAttackTimeout );
			clearTimeout( _idleTimeoutPointer );
			clearTimeout( _moveTimeoutPointer );
			_moveTimeoutPointer = null;
			
			_skinObject.setState( "walk" );
			
			this.showMovementPointer( x, y );
			
			var _w = x - self.characterData.character_zone_x,
				_h = y - self.characterData.character_zone_y,
				_phy = Math.atan2( _h, _w ),
				_vx = self.characterData.character_speed * Math.cos( _phy ),
				_vy = self.characterData.character_speed * Math.sin( _phy ),
				_distance = Math.round( Math.sqrt( Math.pow( _w, 2) + Math.pow( _h, 2 ) ) ),
				_movement = 0, _frameChangeMilestone = 12, _footStep = 0,
				_delay = Component.bugcraft._instance_tic_interval,
				_startDate = ( new Date() ).getTime();
			
			// start the walking audio
			_skinObject.getNextAudio();
			
			var _timeoutFunction = function()
			{
				var _r = ( ( ( ( new Date() ).getTime() - _startDate ) * self.characterData.character_speed ) / _delay ) / self.characterData.character_speed,
						_xOffset = _vx * _r,
						_yOffset = _vy * _r;
				
				self.characterData.character_zone_x += _xOffset;
				self.characterData.character_zone_y += _yOffset;
				
				// calculate the relative sound volume for each effect around
				
				for(var i in Component.bugcraft._characterData)
				{
					var cd = Component.bugcraft._characterData[ i ];
					
					if( typeof cd != "object" || cd.isMain == true )
					{
						continue;
					}
					
					var _iSoundEffects = cd._internal.soundEffects;
					
					for( var j in _iSoundEffects )
					{
						if( typeof _iSoundEffects[ j ] != "object" || _iSoundEffects[j] == null )
						{
							continue;
						}
						
						_iSoundEffects[ j ].setVolume(
													spellEffects.volumeByRange(
																				cd.characterData.character_zone_x, 
																				cd.characterData.character_zone_y, 
																				self.characterData.character_zone_x, 
																				self.characterData.character_zone_y, 
																				spellEffects.volumeRangeLong 
																			)
												);
						
						/*
						_iSoundEffects[ j ].setPan(
													spellEffects.soundPan(
																				cd.characterData.character_zone_x, 
																				self.characterData.character_zone_x,  
																				spellEffects.volumeRangeLong 
																			)
												);
						*/
					}
				}
				
				// calculate the movement so far
				
				_movement += _r * self.characterData.character_speed;
				
				//change the frames to give the impressin the character is walking
				if( _movement > _frameChangeMilestone )
				{
					_frameChangeMilestone += 15;
					
					_skinObject.getNextFrame();
				}
				
				if( _movement < _distance )
				{
					_startDate = ( new Date() ).getTime();
					
					// iterate again in _delay time
					_moveTimeoutPointer = setTimeout( _timeoutFunction, _delay );
					
					return;
				}
				
				_skinObject.setState( "idle" );
				
				// make sure we're spot on
				self.characterData.character_zone_x = x;
				self.characterData.character_zone_y = y;
				
				// start the random movement
				//self.startIdleMovementCountdown();
				
				//
				// issue the next movement step. only if the character is me
				//
				
				if(
					_currentPath.length > 0
				)
				{
					//orient character towards the moving direction
					
					self.changeRotation( _currentPath[0][0], _currentPath[0][1] );
					
					Application.websocket.socket.send( '{"c":"move","r":' + Math.round( self.characterData.character_rotation ) + ',"x":' + ( _currentPath[0][0] ) + ',"y":' + ( _currentPath[0][1] ) + '}' );
					
					_currentPath.shift();
				}
				else
				{
					// reached the end of the path
					
					_skinObject.stopAudio();
					
					afterEndOfPath();
				}
			};
			
			_timeoutFunction();
		};
		
		this.command_move_third_party =	function( x, y )
		{
			clearTimeout( _moveTimeoutPointer );
			_moveTimeoutPointer = null;
			
			self.changeRotation( x, y );
			
			_skinObject.setState( "walk" );
			
			//change the frames to give the impression the character is walking
			//self._internal.characterImage = _skinObject.getStartFrame();
			
			var _w = x - self.characterData.character_zone_x,
				_h = y - self.characterData.character_zone_y,
				_phy = Math.atan2( _h, _w ),
				_vx = self.characterData.character_speed * Math.cos( _phy ),
				_vy = self.characterData.character_speed * Math.sin( _phy ),
				_distance = Math.round( Math.sqrt( Math.pow( _w, 2) + Math.pow( _h, 2 ) ) ),
				_movement = 0, _frameChangeMilestone = 0,
				_delay = Component.bugcraft._instance_tic_interval,
				_startDate = ( new Date() ).getTime(),
				_ccOD = Component.bugcraft.currentCharacterObject.characterData;
			
			var _timeoutFunction = function()
			{
				var _r = ( ( ( ( new Date() ).getTime()  - _startDate ) * self.characterData.character_speed ) / _delay ) / self.characterData.character_speed,
					_xOffset = _vx * _r,
					_yOffset = _vy * _r,
					_iSoundEffects = self._internal.soundEffects;
				
				self.characterData.character_zone_x += _xOffset;
				self.characterData.character_zone_y += _yOffset;
				
				_movement += _r * self.characterData.character_speed;
				
				// calculate the relative sound volume, to the main character, for each effect this character has
				
				/*
				for( var i in _iSoundEffects )
				{
					if ( typeof _iSoundEffects[i] != "object" || _iSoundEffects[i] == null )
					{
						continue;
					}
					
					_iSoundEffects[ i ].setVolume(
												spellEffects.volumeByRange(
																			self.characterData.character_zone_x, 
																			self.characterData.character_zone_y, 
																			Component.bugcraft.currentCharacterObject.characterData.character_zone_x, 
																			Component.bugcraft.currentCharacterObject.characterData.character_zone_y, 
																			spellEffects.volumeRangeLong 
																		)
											);
					
					
					_iSoundEffects[ i ].setPan(
												spellEffects.soundPan(
																			self.characterData.character_zone_x, 
																			Component.bugcraft.currentCharacterObject.characterData.character_zone_x, 
																			spellEffects.volumeRangeLong 
																		)
											);
				}
				*/
				
				//change the frames to give the impressin the character is walking
				if( _movement > _frameChangeMilestone )
				{
					_frameChangeMilestone += 10;
					
					_skinObject.getNextFrame();
				}
				
				if( _movement < _distance )
				{
					_startDate = ( new Date() ).getTime();
					
					// iterate again in _delay time
					_moveTimeoutPointer = setTimeout( _timeoutFunction, _delay );
					
					return;
				}
				
				_skinObject.setState( "idle" );
				
				// make sure we're spot on
				self.characterData.character_zone_x = x;
				self.characterData.character_zone_y = y;
				
				if( self.characterData.character_type == 1 || self.characterData.character_type == 3 )
				{
					// for NPCs and Characters only
					
					//self.startIdleMovementCountdown();
				}
				
				// mark the fact that we've ended the cycle
				_moveTimeoutPointer = null;
			};
			
			_timeoutFunction();
		}
		
		this.command_move_stop_self = function( x, y )
		{
			clearTimeout( _enableAutoAttackTimeout );
			clearTimeout( _idleTimeoutPointer );
			clearTimeout( _moveTimeoutPointer );
			
			self.characterData.character_zone_x = x;
			self.characterData.character_zone_y = y;
			
			_moveTimeoutPointer = null;
		}
		
		this.command_move_stop_third_party = function( x, y )
		{
			self.characterData.character_zone_x = x;
			self.characterData.character_zone_y = y;
			
			clearTimeout( _moveTimeoutPointer );
			_moveTimeoutPointer = null;
		}
		
		this.focusMovement = function()
		{
			// cache the footsteps sounds
			
			self.command_move = self.command_move_self;
			self.command_die = self.command_die_self;
			self.command_resurrect = self.command_resurrect_self;
			self.command_modify = self.command_modify_self;
			self.command_stealth_enter = self.command_stealth_enter_self;
			self.command_stealth_leave = self.command_stealth_leave_self;
			self.command_move_stop = self.command_move_stop_self;
			self.command_cast_start = self.command_cast_start_self;
			self.command_cast_complete = self.command_cast_complete_self;
			self.command_cast_interrupt = self.command_cast_interrupt_self;
			
			if( self.characterData.character_is_stealth != null )
			{
				self.command_stealth_enter();
			}
		}
		
		this.removeMovementFocus = function()
		{
			self.command_move = self.command_move_third_party;
			self.command_die = self.command_die_third_party;
			self.command_resurrect = self.command_resurrect_third_party;
			self.command_modify = self.command_modify_third_party;
			self.command_stealth_enter = self.command_stealth_enter_third_party;
			self.command_stealth_leave = self.command_stealth_leave_third_party;
			self.command_move_stop = self.command_stealth_leave_third_party;
			self.command_cast_start = self.command_cast_start_third_party;
			self.command_cast_complete = self.command_cast_complete_third_party;
			self.command_cast_interrupt = self.command_cast_interrupt_third_party;
			
			if( self.characterData.character_is_stealth != null )
			{
				self.command_stealth_enter();
			}
		}
		
		this.stun = function()
		{
			if( !self.isMain && !self.isTarget )
			{
				return;
			}
			
			new spellEffects.floatingText({
													targetCharacter: self,
													text: 'Stunned',
													color: '#fff29a'
												});
			
			new spellEffects.stun({
										targetCharacter: self
									});
		}
		
		this.startIdleMovementCountdown = function()
		{
			self.stopIdleMovement();
			
			_idleTimeoutPointer = setTimeout( self.idleMovement, 1000 * ( Math.random() * idleTimeoutSeconds ) );
		}
		
		this.stopIdleMovement = function()
		{
			clearTimeout( _idleTimeoutPointer );
		}
		
		this.idleMovement = function()
		{
			var maxRotation = Math.round( -90 + Math.random() * 180 ), maxFrames = 10, rotationIncrement = Math.round( maxRotation / maxFrames ), _currentFrame = 0;
			
			var _animationFunction = function()
			{
				self.characterData.character_rotation += rotationIncrement;
				
				if( self.characterData.character_rotation % 2 == 0)
				{
					_skinObject.getNextFrame();
				}
				
				if( ++_currentFrame < maxFrames )
				{
					_idleTimeoutPointer = setTimeout( _animationFunction, 160);
					
					return;
				}
				
				self.startIdleMovementCountdown();
			}
			
			_idleTimeoutPointer = setTimeout( _animationFunction, 160);
		}
		
		// will remove the "circle" focus effect
		this.removeFocusPointerEffect = function()
		{
			var _iSpellEffects = self._internal.spellEffects;
			
			for( var i in _iSpellEffects )
			{
				var spellEffectObject = _iSpellEffects[i].constructor;
				
				if(
					spellEffectObject != spellEffects.selectEnemyAnimation
					&& spellEffectObject != spellEffects.selectFriendlyAnimation
					&& spellEffectObject != spellEffects.selectNeutralAnimation
					//&& spellEffectObject != spellEffects.selectSelfAnimation
				)
				{
					continue;
				}
				
				// effect needs to be removed
				
				_iSpellEffects[i].remove();
			}
		}
		
		this.removeVisualEffect = function( visualEffectConstructor )
		{
			var _iSpellEffects = self._internal.spellEffects;
			
			for( var i in _iSpellEffects )
			{
				var spellEffectObject = _iSpellEffects[i].constructor;
				
				if(
					spellEffectObject != visualEffectConstructor
				)
				{
					continue;
				}
				
				// effect needs to be removed
				
				_iSpellEffects[i].remove();
			}
		}
		
		// hide chat bubble(s) if any
		this.hideChatBubble = function()
		{
			self.removeVisualEffect( spellEffects.floatingChatImageBubble );
			self.removeVisualEffect( spellEffects.floatingChatTextBubble );
		}
		
		// should this character no longer receive any updates
		this.hide = function( after )
		{
			if( self.isVisible == false )
			{
				after();
				
				return false;
			}
			
			if( self.isTarget )
			{
				Component.bugcraft.currentCharacterObject.setTargetToMain();
			}
			
			self.isVisible = false;
			
			self.stopIdleMovement();
			self.disableRadialSounds();
			self.hideChatBubble();
			self.stopRandomNPCEffects();
			
			// if some effect is still active, remove it
			self.removeAllVisualEffects();
			
			new spellEffects.characterFadeOut({
														targetCharacter: self,
														after: function()
														{
															after();
														}
													});
			
			self.events._run( "hide", {} );
			
			// end any movement
			clearTimeout( _moveTimeoutPointer );
			_moveTimeoutPointer = null;
			
			return true;
		}
		
		var _vendorShowFunction = function( pageContext )
		{
			Component.bugcraft.pageVendor( self, pageContext );
		}
		
		var _questGiverShowFunction = function( pageContext )
		{
			Component.bugcraft.pageQuestGiver( self, pageContext );
		}
		
		this.show = function()
		{
			if( self.isVisible == true )
			{
				return false;
			}
			
			self.isVisible = true;
			
			if( self.characterData.character_is_alive != null )
			{
				new spellEffects.characterFadeIn({
														targetCharacter: self
													});
			}
			else
			{
				new spellEffects.characterInvisibility({
																	targetCharacter: self
																});
			}
			
			// vendor specific code
			if( self.characterData.character_is_vendor != null )
			{
				if( !self.events._exists( "use", _vendorShowFunction ) )
				{
					self.events._add( "use", _vendorShowFunction );
				}
				
				self.removeVisualEffect( spellEffects.vendorIcon );
				
				new spellEffects.vendorIcon({
												targetCharacter: self,
												iconName: "weapon"
											});
				
				new spellEffects.ambientRadialSounds({
															targetCharacter: self,
															streams:
															{
																10000: [ 'market1', 'market2' ],
																5000: [ 'coins1', 'coins2' ]
															}
														});
			}
			
			if( self.characterData.character_is_questgiver != null )
			{
				if( !self.events._exists( "use", _questGiverShowFunction ) )
				{
					self.events._add( "use", _questGiverShowFunction );
				}
			}
			
			// restart the effects
			for(var i in self.appliedBuffs)
			{
				var _b = self.appliedBuffs[ i ];
				
				if( !( _b.buff_type & 1 ) )
				{
					// passive buff
					
					continue;
				}
				
				new Component.bugcraft.ui.effectsHash[ _b.buff_id ]({
																					sourceCharacter: Component.bugcraft._characterData[ _b.buff_source_character_id ],
																					targetCharacter: self,
																					text: Math.floor( Math.random() * 999 )
																				});
			}
			
			self.events._run( "show", {} );
			
			return true;
		}
		
		//
		// Quest specific
		//
		
		this.removeQuestSymbols = function()
		{
			var _iSpellEffects = self._internal.spellEffects;
			
			for( var i in _iSpellEffects )
			{
				var spellEffectObject = _iSpellEffects[i].constructor;
				
				if(
					spellEffectObject != spellEffects.questNotAvailable
					&& spellEffectObject != spellEffects.questAvailable
					&& spellEffectObject != spellEffects.questWaiting
					&& spellEffectObject != spellEffects.questDone
				)
				{
					continue;
				}
				
				// effect needs to be removed
				
				_iSpellEffects[i].remove();
			}
		}
		
		this.showQuestAvailableSymbol = function()
		{
			self.removeQuestSymbols();
			
			new spellEffects.questAvailable({
													targetCharacter: self
												});
		}
		
		this.showQuestNotAvailableSymbol = function()
		{
			self.removeQuestSymbols();
			
			new spellEffects.questNotAvailable({
													targetCharacter: self
												});
		}
		
		this.showQuestDoneSymbol = function()
		{
			self.removeQuestSymbols();
			
			new spellEffects.questDone({
												targetCharacter: self
											});
		}
		
		this.showQuestWaitingSymbol = function()
		{
			self.removeQuestSymbols();
			
			new spellEffects.questWaiting({
												targetCharacter: self
											});
		}
		
		//
		// death and resurrection
		//
		
		this.command_die_self = function( update )
		{
			if( self.characterData.character_is_alive != null )
			{
				// no action if i've died into life
				
				return;
			}
			
			var _characterData = Component.bugcraft._characterData;
			
			// hide all characters but myself
			var _hideCharacter = function( characterID )
			{
				_characterData[ characterID ].hide( function()
				{
					delete Component.bugcraft._characterData[ characterID ];
				});
			}
			
			for(var i in _characterData)
			{
				if(
					typeof _characterData[ i ] != "object"
					|| i == self.characterData.character_id
				)
				{
					continue;
				}
				
				_hideCharacter( i );
			}
			
			self.stopIdleMovement();
			
			Component.bugcraft.sound.zone.stopRandomAreaLoop();
			Component.bugcraft.sound.zone.playDeathLoop();
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "groans_death" );
			
			Map.toggleLimbo();
			
			new spellEffects.characterInvisibility({
														targetCharacter: self
													});
			
			Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
			
			self.updateOnMain();
			
			if( self.isTarget )
			{
				self.updateOnTarget();
			}
			
			// request a battlefield update. this should have all the characters matching my new state
			Application.websocket.socket.send( '{"c":"updateBattleFieldFresh"}' );
		}
		
		this.command_die_third_party = function( update )
		{
			// 3rd party death
			
			self.stopIdleMovement();
			
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "death" );
			
			self.characterData.character_is_alive = null;
			
			// remove all spell effects on character
			for( var i in self._internal.spellEffects )
			{
				var _sEffect = self._internal.spellEffects[ i ];
				
				if( typeof _sEffect != "object" )
				{
					continue;
				}
				
				_sEffect.remove();
			}
			
			self.hide( function()
			{
			
			});
		}
		
		this.command_resurrect_self = function( update )
		{
			// i was resurrected
			
			if( self.characterData.character_is_alive == null )
			{
				// no action if i'm resurrected into death
				
				return;
			}
			
			Component.bugcraft.sound.zone.stopDeathLoop();
			Component.bugcraft.sound.zone.playRandomAreaLoop();
			
			var _characterData = Component.bugcraft._characterData;
			
			// hide all characters but myself
			var _hideCharacter = function( characterID )
			{
				_characterData[ characterID ].hide( function()
				{
					delete Component.bugcraft._characterData[ characterID ];
				});
			}
			
			for(var i in _characterData)
			{
				if(
					typeof _characterData[ i ] != "object"
					|| i == self.characterData.character_id
				)
				{
					continue;
				}
				
				_hideCharacter( i );
			}
			
			// switch map
			Map.toggleLimbo();
			
			new spellEffects.resurrectComplete({
															targetCharacter: self
														});
			
			Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
			
			self.updateOnMain();
			
			if( self.isTarget )
			{
				self.updateOnTarget();
			}
			
			// request a battlefield update. this should have all the characters matching my new state
			Application.websocket.socket.send( '{"c":"updateBattleFieldFresh"}' );
		}
		
		this.command_resurrect_third_party = function( update )
		{
			self.isVisible = true;
			
			self.characterData.appliedBuffs = update.p.b;
			
			if( self.characterData.character_is_alive == null )
			{
				// resurrected into death
				
				new spellEffects.characterInvisibility({
															targetCharacter: self
														});
				
			}
			else
			{
				// resurrected into life
				
				new spellEffects.resurrectComplete({
															targetCharacter: self
														});
			}
			
			/* check if i'm the owner and the corpse does not exist */
			
			if(
				self.characterData.character_id_corpse_character != null
				&& Component.bugcraft.currentCharacterTarget
				&& Component.bugcraft.currentCharacterTarget.characterData.character_id == self.characterData.character_id_corpse_character
			)
			{
				// this object has has a corpse and that corpse is the current target
				
				Component.bugcraft.currentCharacterTarget.removeFocusPointerEffect();
				Component.bugcraft.currentCharacterTarget.isTarget = false;
				Component.bugcraft.currentCharacterTarget.clearAppliedBuffsOnTarget();
				
				// updates for me
				Component.bugcraft.currentCharacterTarget = self;
				self.isTarget = true;
				
				self.updateOnTarget();
				
				// start updating the distance to the target
				Component.bugcraft.currentCharacterObject.updateDistanceToTargetPeriodically();
				
				// update bottom bar buffs
				Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
			}
			else if( self.isTarget )
			{
				self.updateOnTarget();
			}
		}
		
		//
		// Stats Modification management
		//
		
		this.command_modify_self = function( args )
		{
			self.characterData[ "character_" + args.a ] += args.m;
			
			if( args.a == "hp_current" && args.m < 0 )
			{
				self.events._run( "damageTake", {} );
			}
			
			self[ "update" + args.a + "OnMain" ]( args );
		}
		
		this.command_modify_third_party = function( args )
		{
			self.characterData[ "character_" + args.a ] += args.m;
			
			if( args.a == "hp_current" && args.m < 0 )
			{
				self.events._run( "damageTake", {} );
			}
			
			if( args.a == "hp_current" && args.m < 0 )
			{
				// damage
				
				if( args.sid )
				{
					// done by a buff
					
					Component.bugcraft._characterData[ args.sid ].performAttackAnimation( 8 );
				}
				
				self.showRandomDamageEffect();
			}
			
			if( !self.isTarget )
			{
				return;
			}
			
			self[ "update" + args.a + "OnTarget" ]( args );
		}
		
		//
		// received buffs management
		//
		
		this.command_add_buff_miss = function( args )
		{
			// TBC
			
			new spellEffects.floatingText({
													targetCharacter: self,
													text: "Miss"
												});
		}
		
		this.command_add_buff = function( args )
		{
			self.appliedBuffs[ args.bi ] = {
										buff_id: args.bid,
										buff_type: args.ty,
										buff_name: args.n,
										buff_description: args.d,
										buff_mechanic_tics: args.t,
										buff_mechanic_duration_seconds: args.s,
										buff_effect: args.e,
										buff_source_character_id: args.sid,
										cb_applied_effect_remaining_seconds: args.aers
									};
			
			self.appliedEffects[ args.e ]++;
			
			if( args.ty & 1 )
			{
				// only active buffs have an associated effect
				// run the animation for this buff
				
				new Component.bugcraft.ui.effectsHash[ args.bid ]({
																					sourceCharacter: Component.bugcraft._characterData[ args.sid ],
																					targetCharacter: self,
																					text: Math.floor( Math.random() * 999 )
																				});
			}
			
			switch( args.e )
			{
				case 0:
					
					// cleanse
					
				break;
				case 2:
					
					// stun
					
					// stop all movement
					
					self.stun();
					
				break;
				case 4:
					
					// disarm
					
				break;
				
			}
			
			if( self.isMain )
			{
				// the character receiving the buff is me
				
				if( self.appliedBuffs[ args.bi ].UIObject )
				{
					self.appliedBuffs[ args.bi ].UIObject.addCopy( new Component.bugcraft.ui.avatarBuffIcon({ buff: self.appliedBuffs[ args.bi ], targetArea: 1 }) );
				}
				else
				{
					self.appliedBuffs[ args.bi ].UIObject = new Component.bugcraft.ui.avatarBuffIcon({ buff: self.appliedBuffs[ args.bi ], targetArea: 1 });
				}
			}
			
			if( self.isTarget )
			{
				// the character receiving the buff is the current target
				
				if( self.appliedBuffs[ args.bi ].UIObject )
				{
					self.appliedBuffs[ args.bi ].UIObject.addCopy( new Component.bugcraft.ui.avatarBuffIcon({ buff: self.appliedBuffs[ args.bi ], targetArea: 2 }) );
				}
				else
				{
					self.appliedBuffs[ args.bi ].UIObject = new Component.bugcraft.ui.avatarBuffIcon({ buff: self.appliedBuffs[ args.bi ], targetArea: 2 });
				}
			}
		}
		
		this.command_del_buff = 	function( args )
		{
			if( self.isMain )
			{
				// the character deleting the buff is me
				
				self.appliedBuffs[ args.bi ].UIObject.remove( self.isTarget );
			}
			else if( self.isTarget )
			{
				// the character deleting the buff is the target. it is a sure thing that only one buff is to be deleted from the UI
				
				self.appliedBuffs[ args.bi ].UIObject.remove( false );
			}
			
			delete self.appliedBuffs[ args.bi ];
		}
		
		// character disconnection
		this.command_disconnect = function( args )
		{
			// delete the last frame from the canvas
			spellEffects.layerCleaner.push({ previousX: self.characterData.character_zone_x, previousY: self.characterData.character_zone_y, deleteRange: self.characterData.character_width /* sometimes an overkill is good */ });
			
			self.hide( function()
			{
				delete Component.bugcraft._characterData[ self.characterData.character_id ];
			});
			
			setTimeout( function()
			{
				Component.bugcraft._characterIDs.splice(
												Component.bugcraft._characterIDs.indexOf( self.characterData.character_id ),
												1
											);
				
				// delete the global reference
				
				delete Component.bugcraft._characterData[ self.characterData.character_id ];
				//delete self;
			}, 2500 );
		}
		
		// set level (level-up or down)
		this.command_level_set = function( args )
		{
			self.characterData.character_level = args.l;
			self.characterData.character_hp_current = args.hp_current;
			self.characterData.character_hp_max = args.hp_max;
			
			new spellEffects.lvlUp({
										targetCharacter: self,
										sourceCharacter: self
									});
			
			Component.bugcraft.pageChatInsertMessage( "Notice", self.characterData.character_name + " is now level " + self.characterData.character_level );
			
			if( args.cid == Component.bugcraft.currentCharacterObject.characterData.character_id )
			{
				self.characterData.character_xp_max = args.x_m;
				self.characterData.character_xp_base = args.x_b;
				self.refreshxp_currentOnMain();
			}
			
			if(
				args.cid == Component.bugcraft.currentCharacterTarget.characterData.character_id
			)
			{
				self.refreshhp_currentOnTarget();
				self.updatelevelOnTarget();
			}
		}
		
		// default action handlers
		this.command_move = this.command_move_third_party;
		this.command_die = this.command_die_third_party;
		this.command_resurrect = this.command_resurrect_third_party;
		this.command_modify = this.command_modify_third_party;
		this.command_stealth_enter = this.command_stealth_enter_third_party;
		this.command_stealth_leave = this.command_stealth_leave_third_party;
		this.command_move_stop = this.command_move_stop_third_party;
		this.command_cast_start = this.command_cast_start_third_party;
		this.command_cast_complete = this.command_cast_complete_third_party;
		this.command_cast_interrupt = this.command_cast_interrupt_third_party;
		
		//
		// update events management
		//
		
		this.updatearmorOnTarget = function()
		{
			
		}
		
		this.updatedefenseOnTarget = function()
		{
			
		}
		
		this.updateattackOnTarget = function()
		{
			
		}
		
		this.updatepotencyOnTarget = function()
		{
			
		}
		
		this.updatestrengthOnTarget = function()
		{
			
		}
		
		this.updatehappinessOnTarget = function()
		{
			
		}
		
		this.updatespeedOnTarget = function( args )
		{
			if( args.m >= 0 )
			{
				return;
			}
			
			new spellEffects.floatingText({
													targetCharacter: self,
													text: 'Slowed',
													color: '#fff29a'
												});
		}
		
		this.updatearmorOnMain = function()
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updatedefenseOnMain = function()
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updateattackOnMain = function()
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updatestrengthOnMain = function()
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updatepotencyOnMain = function()
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updatehappinessOnMain = function()
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updateresistanceOnMain = function()
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updatespeedOnMain = function( args )
		{
			Component.bugcraft.pageProfileSetAttributes();
			
			if( args.m >= 0 )
			{
				return;
			}
			
			new spellEffects.floatingText({
													targetCharacter: self,
													text: 'Slowed',
													color: '#fff29a'
												});
		}
		
		this.updategloryOnMain = function( args )
		{
			Component.bugcraft.pageProfileSetAttributes();
			
			setTimeout( function()
			{
				new spellEffects.floatingText({
													targetCharacter: self,
													text: ( ( args.m > 0 ) ? "+" : '' ) + args.m + " glory",
													color: '#a200ff'
												});
			}, 500 );
		}
		
		this.updatepolenOnMain = function( args )
		{
			// update vendors
			Component.bugcraft.pageVendorUpdatePlayerCurrency();
			
			// update bag
			Component.bugcraft.pageBagsUpdatePlayerCurrency();
			
			// battlefield
			setTimeout( function()
			{
				new spellEffects.floatingText({
														targetCharacter: self,
														text: ( ( args.m > 0 ) ? "+" : '' ) + args.m + " polen",
														color: '#ffde00'
													});
			}, 250 );
		}
		
		this.updateamberOnMain = function( args )
		{
			// update vendors
			Component.bugcraft.pageVendorUpdatePlayerCurrency();
			
			// update bag
			Component.bugcraft.pageBagsUpdatePlayerCurrency();
			
			// battlefield
			setTimeout( function()
			{
				new spellEffects.floatingText({
														targetCharacter: self,
														text: ( ( args.m > 0 ) ? "+" : '' ) + args.m + " amber",
														color: '#ffde00'
													});
			}, 250 );
		}
		
		this.enterCombatOnMain = function()
		{
			var _cm = Component.bugcraft._layoutObjects.characterCombatMarker,
					opacity = 0,
					modify = 0.1,
					_t = null;
			
			_cm.className = "inCombat";
			
			var _periodicGlow = function()
			{
				opacity += modify;
				
				_cm.style.opacity = opacity;
				_cm.style.MozOpacity = opacity;
				_cm.style.filter = "alpha(opacity=" + ( opacity * 100 ) + ")";
				
				if( opacity >= 1 )
				{
					modify = -0.1;
					
					_t = setTimeout( _periodicGlow, 500 );
					
					return;
				}
				else if( opacity <= 0 )
				{
					modify = 0.1;
					
					_t = setTimeout( _periodicGlow, 500 );
					
					return;
				}
				else
				{
					_t = setTimeout( _periodicGlow, 100 );
				}
			}
			
			self.leaveCombatOnMain = function()
			{
				clearTimeout( _t );
				
				_cm.className = "inCombatHidden";
			}
			
			_periodicGlow();
		}
		
		this.leaveCombatOnMain = function()
		{
			var _lo = Component.bugcraft._layoutObjects;
			
			_lo.characterCombatMarker.className = "inCombatHidden";
		}
		
		this.updatelevelOnTarget = function()
		{
			var _ccl = self.characterData.character_level;
			var _mcl = Component.bugcraft.currentCharacterObject.characterData.character_level;
			var _lo = Component.bugcraft._layoutObjects;
			
			if( _mcl - 5 >= _ccl )
			{
				_lo.targetLevelObject.className = "level levelNoChallenge";
			}
			else if( _mcl == _ccl )
			{
				_lo.targetLevelObject.className = "level levelSame";
			}
			else if( _mcl + 1 >= _ccl )
			{
				_lo.targetLevelObject.className = "level levelEasy";
			}
			else if( _mcl + 2 >= _ccl )
			{
				_lo.targetLevelObject.className = "level levelEasiest";
			}
			else if( _mcl - 2 <= _ccl )
			{
				_lo.targetLevelObject.className = "level levelHardest";
			}
			else
			{
				_lo.targetLevelObject.className = "level levelHard";
			}
			
			_lo.targetLevelNumberObject.innerHTML = _ccl;
			_lo.targetLevelNumberShadowObject.innerHTML = _ccl;
		}
		
		this.updateclassOnTarget = function()
		{
			var _cc = self.characterData;
			var _lo = Component.bugcraft._layoutObjects;
			
			_lo.targetClassObject.innerHTML = _cc.character_class;
			//_lo.targetClassShadowObject.innerHTML = _cc.character_class;
		}
		
		this.updatenameOnTarget = function()
		{
			var _cc = self.characterData;
			var _lo = Component.bugcraft._layoutObjects;
			
			_lo.targetNameObject.innerHTML = _cc.character_name;
			//_lo.targetNameShadowObject.innerHTML = _cc.character_name;
		}
		
		this.updateraceOnTarget = function()
		{
			var _cc = self.characterData;
			var _lo = Component.bugcraft._layoutObjects;
			
			_lo.targetRaceObject.innerHTML = _cc.character_race;
			//_lo.targetRaceShadowObject.innerHTML = _cc.character_race;
		}
		
		this.updateiconOnTarget = function()
		{
			var _lo = Component.bugcraft._layoutObjects;
			
			//_lo.targetIconObject.className = _skinObject.getTargetProfileIcon( self.characterData.character_is_friendly_to_main );
			_lo.targetIconObject.style.backgroundImage = "url('" + Application.configuration.cdn.location[ 0 ].url + "/object_skins/" + _skinObject.getSkinName() + "/portrait_" + ( ( self.characterData.character_is_friendly_to_main ) ? "friend" : ( ( self.characterData.character_faction == null ) ? "neutral" : "foe" ) ) + ".png')";
		}
		
		this.refreshhp_currentOnTarget = function()
		{
			var _cc = self.characterData;
			var _lo = Component.bugcraft._layoutObjects;
			
			if( _cc.character_hp_max > 0 )
			{
				Component.bugcraft._renderProgressBar({
																number: _cc.character_hp_current,
																total: _cc.character_hp_max,
																numbersObject: _lo.targetHealthNumberObject,
																fillingObject: _lo.targetHealthFillingObject,
																endingObject: _lo.targetHealthEndingObject
															});
			}
			else
			{
				Component.bugcraft._renderProgressBarStatic({
																		text: "invulnerable",
																		numbersObject: _lo.targetHealthNumberObject,
																		fillingObject: _lo.targetHealthFillingObject,
																		endingObject: _lo.targetHealthEndingObject
																	});
			}
		}
		
		this.updatemain_hand_damage_minOnMain = function( args )
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updatemain_hand_damage_maxOnMain = function( args )
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updateoff_hand_damage_minOnMain = function( args )
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updateoff_hand_damage_maxOnMain = function( args )
		{
			Component.bugcraft.pageProfileSetAttributes();
		}
		
		this.updatehp_currentOnTarget = function( args )
		{
			self.refreshhp_currentOnTarget();
			
			if( args.bi && self.appliedBuffs[ args.bi ].buff_source_character_id != Component.bugcraft.currentCharacterObject.characterData.character_id )
			{
				//return;
			}
			
			// everything here is dealt by main char
			
			if( args.cr )
			{
				// critical
				
				if( args.m >= 0 )
				{
					// heal
					new spellEffects.floatingTextCriticalHeal({
																targetCharacter: self,
																color: "#66ff00",
																text: args.m
															});
				}
				else
				{
					// damage
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "groans_pain" );
					
					new spellEffects.floatingTextCriticalDamage({
																targetCharacter: self,
																color: "#ffcc00",
																text: args.m
															});
					
					//self.showRandomDamageEffect();
				}
				
				return;
			}
			
			// not critical
			
			if( args.m >= 0 )
			{
				// heal
				
				new spellEffects.floatingTextHeal({
														targetCharacter: self,
														color: "#66ff00",
														text: args.m
													});
			}
			else
			{
				// damage
				
				Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "groans_pain" );
				
				new spellEffects.floatingTextDamage({
															targetCharacter: self,
															color: "#ffcc00",
															text: args.m
														});
				
				//self.showRandomDamageEffect();
			}
		}
		
		this.updateresistanceOnTarget = function()
		{
			
		}
		
		// clear all buffs on the target avatar
		this.clearAppliedBuffsOnTarget = function()
		{
			for(var i in self.appliedBuffs )
			{
				var buff = self.appliedBuffs[i];
				
				if( typeof buff == "function" )
				{
					continue;
				}
				
				// the character receiving the buff is the current target
				
				self.appliedBuffs[ i ].UIObject.removeOnlyOnTarget( true );
			}
		}
		
		// set current character's data on target position
		this.updateOnTarget = function()
		{
			var _lo = Component.bugcraft._layoutObjects;
			
			// put the target focus on the new target
			if( self.characterData.character_is_friendly_to_main )
			{
				new spellEffects.selectFriendlyAnimation({
															sourceCharacter: self,
															targetCharacter: self
														});
			}
			else if( self.characterData.character_faction != null )
			{
				new spellEffects.selectEnemyAnimation({
															sourceCharacter: self,
															targetCharacter: self
														});
			}
			else
			{
				new spellEffects.selectNeutralAnimation({
															sourceCharacter: self,
															targetCharacter: self
														});
			}
			
			Map.minimap.hide();
			
			// updates
			self.refreshhp_currentOnTarget();
			
			self.updatelevelOnTarget();
			self.updateclassOnTarget();
			self.updatenameOnTarget();
			self.updateraceOnTarget();
			self.updateiconOnTarget();
			
			for(var i in self.appliedBuffs )
			{
				var buff = self.appliedBuffs[i];
				
				if( typeof buff == "function" )
				{
					continue;
				}
				
				// the character receiving the buff is the current target
				
				if( self.appliedBuffs[ i ].UIObject )
				{
					self.appliedBuffs[ i ].UIObject.addCopy( new Component.bugcraft.ui.avatarBuffIcon({ buff: self.appliedBuffs[ i ], targetArea: 2 }) );
				}
				else
				{
					self.appliedBuffs[ i ].UIObject = new Component.bugcraft.ui.avatarBuffIcon({ buff: self.appliedBuffs[ i ], targetArea: 2 });
				}
			}
		}
		
		//
		// pointsic updaters
		//
		
		this.refreshhp_currentOnMain = function()
		{
			var _cc = self.characterData, _lo = Component.bugcraft._layoutObjects;
			
			// render the progress bar
			Component.bugcraft._renderProgressBar({
																number: _cc.character_hp_current,
																total: _cc.character_hp_max,
																numbersObject: _lo.characterHealthNumberObject,
																fillingObject: _lo.characterHealthFillingObject,
																endingObject: _lo.characterHealthEndingObject
															});
		}
		
		this.updatehp_maxOnMain = function( args )
		{
			self.refreshhp_currentOnMain();
			
			if( Component.bugcraft.currentCharacterTarget.characterData.character_id == self.characterData.character_id )
			{
				// this character is the target also
				
				self.refreshhp_currentOnTarget();
			}
		}
		
		this.updatehp_currentOnMain = function( args )
		{
			self.refreshhp_currentOnMain();
			
			if( Component.bugcraft.currentCharacterTarget.characterData.character_id == self.characterData.character_id )
			{
				// this character is the target also
				
				self.refreshhp_currentOnTarget();
			}
			
			if( args.cr )
			{
				// critical
				
				if( args.m >= 0 )
				{
					// critical heal
					
					new spellEffects.floatingTextCriticalHeal({
																targetCharacter: self,
																color: "#66ff00",
																text: args.m
															});
				}
				else
				{
					// critical damage
					
					Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "groans_pain" );
					
					new spellEffects.floatingTextCriticalDamage({
																targetCharacter: self,
																color: "#ff1200",
																text: args.m
															});
					
					self.showRandomDamageEffect();
				}
				
				return;
			}
			
			// not a critical
			
			if( args.m >= 0 )
			{
				// heal
				
				new spellEffects.floatingTextHeal({
														targetCharacter: self,
														color: "#66ff00",
														text: args.m
													});
			}
			else
			{
				// damage
				
				Component.bugcraft.sound.characters.playCharacterVoiceExclusive( self, "groans_pain" );
				
				new spellEffects.floatingTextDamage({
															targetCharacter: self,
															color: "#ff1200",
															text: args.m
														});
				
				self.showRandomDamageEffect();
			}
		}
		
		this.refreshxp_currentOnMain = function()
		{
			var _cc = self.characterData;
			var _lo = Component.bugcraft._layoutObjects;
			
			Component.bugcraft._renderProgressBar({
															number: _cc.character_xp_current,
															total: _cc.character_xp_max,
															base: _cc.character_xp_base - 1,
															numbersObject: _lo.characterExperienceNumberObject,
															fillingObject: _lo.characterExperienceFillingObject,
															endingObject: _lo.characterExperienceEndingObject
														});
		}
		
		this.updatexp_currentOnMain = function( args )
		{
			self.refreshxp_currentOnMain();
			
			new spellEffects.floatingText({
												targetCharacter: self,
												text: ( ( args.m > 0 ) ? "+" : '' ) + args.m + " xp",
												color: '#a200ff'
											});
		}
		
		this.updatelevelOnMain = function()
		{
			var _cc = self.characterData;
			var _lo = Component.bugcraft._layoutObjects;
			
			_lo.characterLevelObject.innerHTML = _cc.character_level;
			_lo.characterLevelShadowObject.innerHTML = _cc.character_level;
		}
		
		this.updateclassOnMain = function()
		{
			var _cc = self.characterData;
			var _lo = Component.bugcraft._layoutObjects;
			
			_lo.characterClassObject.innerHTML = _cc.character_class;
			//_lo.characterClassShadowObject.innerHTML = _cc.character_class;
		}
		
		this.updatenameOnMain = function()
		{
			var _cc = self.characterData;
			var _lo = Component.bugcraft._layoutObjects;
			
			_lo.characterNameObject.innerHTML = _cc.character_name;
			//_lo.characterNameShadowObject.innerHTML = _cc.character_name;
		}
		
		this.updateraceOnMain = function()
		{
			var _cc = self.characterData;
			var _lo = Component.bugcraft._layoutObjects;
			
			_lo.characterRaceObject.innerHTML = _cc.character_race;
			//_lo.characterRaceShadowObject.innerHTML = _cc.character_race;
		}
		
		this.updateiconOnMain = function()
		{
			var _cd = self.characterData,
					_lo = Component.bugcraft._layoutObjects;
			
			//_lo.characterIconObject.className = _skinObject.getMainProfileIcon();
			_lo.characterIconObject.style.backgroundImage = "url('" + Application.configuration.cdn.location[ 0 ].url + "/object_skins/" + _skinObject.getSkinName() + "/portrait_" + ( ( _cd.character_is_friendly_to_main ) ? "friend" : "foe" ) + ".png')";
		}
		
		// set current character's data on main position
		this.updateOnMain = function()
		{
			var _lo = Component.bugcraft._layoutObjects;
			
			var _clearArea = function( area )
			{
				while( area.childNodes.length )
				{
					Application.util.html.removeNode( area.childNodes[0] );
				}
			}
			
			self.refreshhp_currentOnMain();
			self.refreshxp_currentOnMain();
			
			self.updatelevelOnMain();
			self.updateclassOnMain();
			self.updatenameOnMain();
			self.updateraceOnMain();
			self.updateiconOnMain();
			
			// clearing buffs areas
			_clearArea( _lo.selfActiveBuffsObject );
			_clearArea( _lo.selfPassiveBuffsObject );
			
			for(var i in self.appliedBuffs )
			{
				var buff = self.appliedBuffs[i];
				
				if( typeof buff == "function" )
				{
					continue;
				}
				
				// the character receiving the buff is the current target
				
				if( self.appliedBuffs[ i ].UIObject )
				{
					self.appliedBuffs[ i ].UIObject.addCopy( new Component.bugcraft.ui.avatarBuffIcon({ buff: self.appliedBuffs[ i ], targetArea: 1 }) );
				}
				else
				{
					self.appliedBuffs[ i ].UIObject = new Component.bugcraft.ui.avatarBuffIcon({ buff: self.appliedBuffs[ i ], targetArea: 1 });
				}
			}
		}
		
		/*
			-----------
			Initialization
			-----------
		*/
		
		//self.characterData.character_width = Map.ctx.measureText( self.characterData.character_name );
		
		if( self.characterData.character_type == 1 || self.characterData.character_type == 3 )
		{
			// for NPCs and Characters only. No items
			
			/*
			if( self.characterData.character_type == 1 )
			{
				// NPC
				
				setTimeout( function() { self.showRandomNPCEffectPeriodically() }, 10000 );
			}
			*/
			
			self.startIdleMovementCountdown();
		}
		else
		{
			// items
			
			// set usable if it makes any sense
			//self.command_set_usable();
		}
		
		if( self.characterData.character_is_stealth != null )
		{
			self.command_stealth_enter();
		}
		
		if( self.characterData.character_id_object_pool != null )
		{
			// run this object's script
			
			if( npcScript[ self.characterData.character_id_object_pool ] )
			{
				this.characterScript = new npcScript[ self.characterData.character_id_object_pool ]( self );
			}
			
			// run the "show" events for the character initialization
			//self.events._run( "show", {} );
		}
		
		var _cOwner = null;
		
		if(
			self.characterData.character_id_owner_character != null
			&& ( _cOwner = Component.bugcraft._characterData[ self.characterData.character_id_owner_character ] )
			&& _cOwner.characterData.character_is_alive == null
			&& _cOwner == Component.bugcraft.currentCharacterTarget
			&& Component.bugcraft.currentCharacterTarget.characterData.character_id != self.characterData.character_id_owner_character		// don't apply this for the main character
		)
		{
			// this object has an owner and that owner is dead. move the target from the owner (current target) to self
			
			Component.bugcraft.currentCharacterTarget.removeFocusPointerEffect();
			Component.bugcraft.currentCharacterTarget.isTarget = false;
			Component.bugcraft.currentCharacterTarget.clearAppliedBuffsOnTarget();
			
			Component.bugcraft.currentCharacterTarget = self;
			self.isTarget = true;
			
			self.updateOnTarget();
			
			// start updating the distance to the target
			Component.bugcraft.currentCharacterObject.updateDistanceToTargetPeriodically();
			
			// update bottom bar buffs
			Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
