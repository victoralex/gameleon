
	/*
		Quest Giver page
	*/

	var _autoQuestGiverCloseDistanceCheckTimeout = null,
			_questGiverScrollBarObject = null;
	
	Component.bugcraft.pageQuestGiver = function( questGiverObject, args )
	{
		var questGiverPageObject = document.getElementById( args.id + '_questGiverPage' ),
			questGiverNameObject = document.getElementById( args.id + '_questGiverName' ),
			questNameObject = document.getElementById( args.id + '_questGiverQuestName' ),
			questGiverQuestsDataContainerObject = document.getElementById( args.id + '_questGiverQuestsDataContainer' ),
			questGiverQuestsDataControlsContainerObject = document.getElementById( args.id + '_questGiverQuestsDataControlsContainer' ),
			questDescriptionObject = document.getElementById( args.id + '_questGiverQuestDescription' ),
			questObjectivesObject = document.getElementById( args.id + '_questGiverQuestObjectives' ),
			questGiverCloseButtonObject = document.getElementById( args.id + "_questGiverCloseButton" ),
			questGiverAcceptButtonObject = document.getElementById( args.id + "_questGiverAcceptButton" ),
			questGiverDeclineButtonObject = document.getElementById( args.id + "_questGiverDeclineButton" ),
			questGiverFinalizeButtonObject = document.getElementById( args.id + "_questGiverFinalizeButton" ),
			questGiverSpoilPolenObject = document.getElementById( args.id + "_questSpoilPolen" ),
			questGiverSpoilAmberObject = document.getElementById( args.id + "_questSpoilAmber" ),
			questGiverSpoilXPObject = document.getElementById( args.id + "_questSpoilXP" ),
			questGiverSpoilGloryObject = document.getElementById( args.id + "_questSpoilGlory" ),
			questGiverQuestsListControlUpObject = document.getElementById( args.id + "_questGiverQuestsListControlUp" ),
			questGiverQuestsListControlDownObject = document.getElementById( args.id + "_questGiverQuestsListControlDown" ),
			questGiverQuestsDataControlUpObject = document.getElementById( args.id + "_questGiverQuestsDataControlUp" ),
			questGiverQuestsDataControlDownObject = document.getElementById( args.id + "_questGiverQuestsDataControlDown" ),
			questGiverQuestsListItemsContainerObject = document.getElementById( args.id + "_questsListItemsContainer" ),
			questGiverQuestsListItemsObject = document.getElementById( args.id + "_questsListItems" );
		
		var _qd = questGiverObject.questsData, _ccD = Component.bugcraft.currentCharacterObject.characterData;
		
		// window management
		questGiverObject.isShowingQuests = true;
		questGiverQuestsListItemsObject.style.top = "0px";
		
		Component.bugcraft.pageQuestGiverHide = function()
		{
			clearTimeout( _autoQuestGiverCloseDistanceCheckTimeout );
			questGiverObject.startIdleMovementCountdown();
			
			Component.bugcraft.sound.characters.playCharacterVoiceExclusive( questGiverObject, "npc_bye" );
			
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			questGiverObject.isShowingQuests = false;
			questGiverPageObject.className = "hidden";
		}
		
		// "close" button event
		questGiverCloseButtonObject.onclick = function()
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			questGiverPageObject.className = 'hidden';
			questGiverObject.isShowingQuests = false;
		};
		
		// "decline" button event
		questGiverDeclineButtonObject.onclick = function()
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
			
			questGiverPageObject.className = 'hidden';
			questGiverObject.isShowingQuests = false;
		};
		
		// mouse wheel scroll
		questGiverQuestsListItemsContainerObject.onmousewheel = function( e )
		{
			var mouseDelta = e.wheelDelta / 10;
			
			if(
				( mouseDelta > 0 && questGiverQuestsListItemsObject.offsetTop + mouseDelta <= 0 )
				|| ( mouseDelta < 0 && questGiverQuestsListItemsObject.offsetTop + mouseDelta > -questGiverQuestsListItemsObject.offsetHeight + questGiverQuestsListItemsContainerObject.offsetHeight )
			)
			{
				questGiverQuestsListItemsObject.style.top = ( questGiverQuestsListItemsObject.offsetTop + mouseDelta ) + "px";
			}
			else
			{
				if( mouseDelta > 0 )
				{
					questGiverQuestsListItemsObject.style.top = "0px";
				}
				else
				{
					questGiverQuestsListItemsObject.style.top = ( -questGiverQuestsListItemsObject.offsetHeight + questGiverQuestsListItemsContainerObject.offsetHeight ) + "px";
				}
			}
			
			return false;
		}
		
		// "up" button event
		questGiverQuestsListControlUpObject.onmousedown = function()
		{
			var _scrollTimeout = null;
			
			var _scrollFunction = function()
			{
				if( questGiverQuestsListItemsObject.offsetTop + 6 <= 0 )
				{
					questGiverQuestsListItemsObject.style.top = ( questGiverQuestsListItemsObject.offsetTop + 6 ) + "px";
				}
				else
				{
					questGiverQuestsListItemsObject.style.top = "0px";
				}
				
				_scrollTimeout = setTimeout( _scrollFunction, 100 );
			}
			
			var _scrollRemove = function()
			{
				clearTimeout( _scrollTimeout );
				
				Application.event.remove( document.body, "mouseup", _scrollRemove );
			};
			
			_scrollFunction();
			
			Application.event.add( document.body, "mouseup", _scrollRemove );
		};
		
		// "down" button event
		questGiverQuestsListControlDownObject.onmousedown = function()
		{
			var _scrollTimeout = null;
			
			var _scrollFunction = function()
			{
				if( questGiverQuestsListItemsObject.offsetTop - 6 > -questGiverQuestsListItemsObject.offsetHeight + questGiverQuestsListItemsContainerObject.offsetHeight )
				{
					questGiverQuestsListItemsObject.style.top = ( questGiverQuestsListItemsObject.offsetTop - 6 ) + "px";
				}
				else
				{
					questGiverQuestsListItemsObject.style.top = ( -questGiverQuestsListItemsObject.offsetHeight + questGiverQuestsListItemsContainerObject.offsetHeight ) + "px";
				}
				
				_scrollTimeout = setTimeout( _scrollFunction, 100 );
			}
			
			var _scrollRemove = function()
			{
				clearTimeout( _scrollTimeout );
				
				Application.event.remove( document.body, "mouseup", _scrollRemove );
			};
			
			_scrollFunction();
			
			Application.event.add( document.body, "mouseup", _scrollRemove );
		};
		
		var _hasGrabbableQuest = function()
		{
			for(var i in _qd)
			{
				if( _qd[ i ].grabbable == false )
				{
					continue;
				}
				
				return true;
			}
			
			return false;
		}
		
		// create individual quest items
		var _createQuestEntry = function( questID )
		{
			var _q = _qd[ questID ];
			
			var _showDetails = function()
			{
				for(var i=0;i<lines.length;i++)
				{
					if( lines[ i ] == questDivObject )
					{
						continue;
					}
					
					lines[ i ].className = "questListItem";
				}
				
				if( _q.isFinalized || _q.inProgress )
				{
					// quest is in progress or finalized
					
					questGiverAcceptButtonObject.className = "hidden";
					questGiverDeclineButtonObject.className = "hidden";
					
					if( _q.isFinalized )
					{
						questGiverFinalizeButtonObject.className = "questFinalize";
						
						questGiverFinalizeButtonObject.onclick = function( e )
						{
							Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
							
							Application.websocket.socket.send( JSON.stringify({
																							c: "questFinalize",
																							questId: questID
																						}) );
						}
					}
					else
					{
						questGiverFinalizeButtonObject.className = "questProgress";
					}
				}
				else
				{
					// quest may be accepted / denied
					
					questGiverAcceptButtonObject.className = "questAccept";
					questGiverDeclineButtonObject.className = "questDecline";
					questGiverFinalizeButtonObject.className = "hidden";
				} 
				
				questDivObject.className = "questListItemSelected";
				
				if( _q.quest_award_polen != 0 )
				{
					questGiverSpoilPolenObject.className = "spoilPolen";
					questGiverSpoilPolenObject.innerHTML = _q.quest_award_polen;
				}
				else
				{
					questGiverSpoilPolenObject.className = "hidden";
				}
				
				if( _q.quest_award_amber != 0 )
				{
					questGiverSpoilAmberObject.className = "spoilAmber";
					questGiverSpoilAmberObject.innerHTML = _q.quest_award_amber;
				}
				else
				{
					questGiverSpoilAmberObject.className = "hidden";
				}
				
				if( _q.quest_award_xp != 0 )
				{
					questGiverSpoilXPObject.className = "spoilXP";
					questGiverSpoilXPObject.innerHTML = _q.quest_award_xp;
				}
				else
				{
					questGiverSpoilXPObject.className = "hidden";
				}
				
				if( _q.quest_award_glory != 0 )
				{
					questGiverSpoilGloryObject.className = "spoilGlory";
					questGiverSpoilGloryObject.innerHTML = _q.quest_award_glory;
				}
				else
				{
					questGiverSpoilGloryObject.className = "hidden";
				}
				
				questNameObject.innerHTML = _q.quest_name;
				questDescriptionObject.innerHTML = _q.quest_description.replace( "%targetName", _ccD.character_name ).replace( "%targetClass", _ccD.character_class ).replace( "%targetRace", _ccD.character_race );
				questObjectivesObject.innerHTML = _q.quest_objectives.replace( "%targetName", _ccD.character_name ).replace( "%targetClass", _ccD.character_class ).replace( "%targetRace", _ccD.character_race );
				
				questGiverAcceptButtonObject.onclick = function()
				{
					Component.bugcraft.sound.ui.playEvent( "window", "questGrab" );
					
					Application.websocket.socket.send( '{"c":"questStart", "questId":' + questID + ', "questGiverID":' + questGiverObject.characterData.character_id + '}' );
				}
				
				if( _questGiverScrollBarObject == null )
				{
					_questGiverScrollBarObject = new Application.effects.scroll.scrollbar(
																								questGiverQuestsDataControlsContainerObject,
																								new Application.effects.scroll.scroller(
																																	questGiverQuestsDataContainerObject,
																																	questGiverQuestsDataContainerObject.offsetWidth,
																																	questGiverQuestsDataContainerObject.offsetHeight
																																),
																								false
																							);
				}
				
				_questGiverScrollBarObject.resetHeight();
			}
			
			var questDivObject = document.createElement("div"), _ccD = Component.bugcraft.currentCharacterObject.characterData;
			questDivObject.className = "questListItem";
			questDivObject.innerHTML = _q.quest_name;
			
			questGiverQuestsListItemsObject.appendChild( questDivObject );
			
			Application.event.add( questDivObject, "click", _showDetails );
			
			if( lines.length == 1 )
			{
				return questDivObject;
			}
			
			_showDetails();
			
			return questDivObject;
		}
		
		var _autoCloseDistanceCheck = function()
		{
			if( _ccD.character_distance_to_target < 120 )
			{
				_autoQuestGiverCloseDistanceCheckTimeout = setTimeout( _autoCloseDistanceCheck, 150 );
				
				return;
			}
			
			// moved too far away from the target
			
			Component.bugcraft.pageQuestGiverHide();
		}
		
		//
		// Initialize
		//
		
		if( _hasGrabbableQuest() == false )
		{
			// no quest is grabbable
			
			return false;
		}
		
		Component.bugcraft.sound.ui.playEvent( "window", "bookOpen" );
		
		questGiverPageObject.className = "questGiver";
		questGiverNameObject.innerHTML = questGiverObject.characterData.character_name;
		questGiverQuestsListItemsObject.innerHTML = '';
		
		Component.bugcraft.scaleWindow( questGiverPageObject );
		
		//Component.bugcraft.positionRelativeWindow( questGiverPageObject );
		
		Component.bugcraft.sound.characters.playCharacterVoiceExclusive( questGiverObject, "npc_hi" );
		
		var lines = [];
		
		// many quests
		for(var i in _qd)
		{
			var _q = _qd[ i ];
			
			if( _q.grabbable == false )
			{
				// cannot grab this quest yet
				
				continue;
			}
			
			// this quest may be grabbed
			lines.push( _createQuestEntry( i ) );
		}
		
		_autoCloseDistanceCheck();
		
		return true;
	}
	
	Component.bugcraft.pageQuestGiverHide = function()
	{
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	