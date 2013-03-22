
	/*
		Quest Log page
	*/
	
	var _questLogScrollBarObject = null;
	
	Component.bugcraft.pageQuestLog = function( args )
	{
		var questsPageObject = document.getElementById( args.id + '_questLogPage' ),
			questLogQuestsDataControlsContainerObject = document.getElementById( args.id + '_questLogQuestsDataControlsContainer' ),
			questLogQuestsDataContainerObject = document.getElementById( args.id + '_questLogQuestsDataContainer' );
		
		// ensure this code is run only once
		if( typeof Component.bugcraft.initializedPages.questLog != "undefined" )
		{
			Component.bugcraft.initializedPages.questLog = !Component.bugcraft.initializedPages.questLog;
			questsPageObject.className = ( questsPageObject.className == "hidden" ) ? "questLog" : "hidden";
			
			if( !Component.bugcraft.initializedPages.questLog )
			{
				Component.bugcraft.sound.ui.playEvent( "window", "bookOpen" );
				
				Component.bugcraft.scaleWindow( questsPageObject );
				
				if( _questLogScrollBarObject == null )
				{
					_questLogScrollBarObject = new Application.effects.scroll.scrollbar(
																								questLogQuestsDataControlsContainerObject,
																								new Application.effects.scroll.scroller(
																																	questLogQuestsDataContainerObject,
																																	questLogQuestsDataContainerObject.offsetWidth,
																																	questLogQuestsDataContainerObject.offsetHeight
																																),
																								false
																							);
				}
			}
			else
			{
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			}
			
			return;
		}
		
		if( !args.hidden )
		{
			questsPageObject.className = "questLog";
		}
		
		Component.bugcraft.initializedPages.questLog = true;
		
		//
		// Define internal variables
		//
		
		var questsProgress = {}, lines = {}, _ccD = Component.bugcraft.currentCharacterObject.characterData,
			questLogNameObject = document.getElementById( args.id + '_questLogName' ),
			questLogProgressQuestsContainerObject = document.getElementById( args.id + '_questLogProgressQuestsContainer' ),
			questLogProgressContainerObject = document.getElementById( args.id + '_questLogProgressContainer' ),
			questNameObject = document.getElementById( args.id + '_questLogQuestName' ),
			questDescriptionObject = document.getElementById( args.id + '_questLogQuestDescription' ),
			questObjectivesObject = document.getElementById( args.id + '_questLogQuestObjectives' ),
			questLogCloseButtonObject = document.getElementById( args.id + "_questLogCloseButton" ),
			questLogAbandonButtonObject = document.getElementById( args.id + "_questLogAbandonButton" ),
			questLogSpoilPolenObject = document.getElementById( args.id + "_questLogSpoilPolen" ),
			questLogSpoilAmberObject = document.getElementById( args.id + "_questLogSpoilAmber" ),
			questLogSpoilXPObject = document.getElementById( args.id + "_questLogSpoilXP" ),
			questLogSpoilGloryObject = document.getElementById( args.id + "_questLogSpoilGlory" ),
			questLogQuestsListControlUpObject = document.getElementById( args.id + "_questLogQuestsListControlUp" ),
			questLogQuestsListControlDownObject = document.getElementById( args.id + "_questLogQuestsListControlDown" ),
			questLogQuestsListItemsObject = document.getElementById( args.id + "_questLogQuestsListItemsContainer" ),
			questLogQuestConditionsObject = document.getElementById( args.id + "_questLogQuestConditions" ),
			questLogNoQuestsContainerObject = document.getElementById( args.id + "_questLogNoQuestsContainer" ),
			questLogQuestDetailsObject = document.getElementById( args.id + "_questLogQuestDetails" ),
			questLogQuestListItemsObject = document.getElementById( args.id + "_questLogListItems" );
		
		// "close" button event
		questLogCloseButtonObject.onclick = function()
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			Component.bugcraft.initializedPages.questLog = !Component.bugcraft.initializedPages.questLog;
			
			questsPageObject.className = 'hidden';
		};
		
		//
		// Experimental Area
		//
		/*
		var killButton = document.getElementById( args.id + "_qtKillButton" );
		var killSquirrelButton = document.getElementById( args.id + "_qtKillSquirrelButton" );
		
		Application.event.add( killButton, "click", function()
		{
			Application.websocket.socket.send( JSON.stringify( {
																	c: "questEventTriggered_temp",
																	event: "kill"
																}) );
		});
		
		Application.event.add( killSquirrelButton, "click", function()
		{
			Application.websocket.socket.send( JSON.stringify( {
																	c: "questEventTriggered_temp",
																	event: "squirrelKill"
																}) );
		});
		*/
		
		//
		// Server Handlers
		//
		
		// quest start handler
		Application.websocket.handlers.questStart = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Error starting quest (" + jsonEl.r + ")" );
				
				return;
			}
			
			// hide the questLog interface
			Component.bugcraft.pageQuestGiverHide();
			
			// force a refresh of the active list
			Application.websocket.socket.send( '{"c":"questsGetActive"}' );
		}
		
		// handle quest abandonment
		Application.websocket.handlers.questAbandon = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Error abandon quest (" + jsonEl.r + ")" );
				
				return;
			}
			
			// force a refresh of the active list
			Application.websocket.socket.send( '{"c":"questsGetActive"}' );
		}
		
		// a quest condition's value has changed
		Application.websocket.handlers.questConditionUpdate = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Error receiving condition update: " + jsonEl.r );
				
				return;
			}
			
			var _questObject = lines[ jsonEl.questId ];
			
			_questObject._q.conditions[ jsonEl.condition ].currentValue = jsonEl.value;
			
			// update the quest tracking
			_questObject.updateQuestTrackingConditions();
			
			if( _questObject.isVisible )
			{
				_questObject.updateQuestConditions();
			}
		}
		
		// handle quest compelted event
		Application.websocket.handlers.questCompleted = function( jsonEl, ws )
		{
			// a quest has been completed
			
			
		}
		
		// handle quest finalize event (post click)
		Application.websocket.handlers.questFinalize = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.add( "Error finalizing quest (" + jsonEl.r + ")" );
				
				return;
			}
			
			// force a refresh of the active list
			Application.websocket.socket.send( '{"c":"questsGetActive"}' );
			
			// hide the questLog interface
			Component.bugcraft.pageQuestGiverHide();
		}
		
		// get all active quests in the log
		Application.websocket.handlers.questsGetActive = function( jsonEl, ws )
		{
			lines = {};
			
			// erase the current list
			questLogQuestListItemsObject.innerHTML = '';
			questLogProgressContainerObject.className = "hidden";
			questLogProgressQuestsContainerObject.innerHTML = '';
			
			if( Object.keys( jsonEl.q ).length <= 0 )
			{
				// no quests
				
				questLogQuestDetailsObject.className = "hidden";
				questLogNoQuestsContainerObject.className = "questLogNoQuests";
			}
			else
			{
				questLogQuestDetailsObject.className = "";
				questLogNoQuestsContainerObject.className = "hidden";
			}
			
			// create individual quest entry
			var _createQuestEntry = function( questID )
			{
				var self = this;
				
				this._q = jsonEl.q[ questID ];
				this.isVisible = false;
				
				this._hideDetails = function()
				{
					self.isVisible = false;
					
					questDivObject.className = "questListItem";
				}
				
				this._showDetails = function()
				{
					// mark other entries as not selected
					for(var i in lines)
					{
						if( lines[ i ] == self )
						{
							continue;
						}
						
						lines[ i ]._hideDetails();
					}
					
					// select this entry
					questDivObject.className = "questListItemSelected";
					self.isVisible = true;
					
					if( self._q.quest_award_polen != 0 )
					{
						questLogSpoilPolenObject.className = "spoilPolen";
						questLogSpoilPolenObject.innerHTML = self._q.quest_award_polen;
					}
					else
					{
						questLogSpoilPolenObject.className = "hidden";
					}
					
					if( self._q.quest_award_amber != 0 )
					{
						questLogSpoilAmberObject.className = "spoilAmber";
						questLogSpoilAmberObject.innerHTML = self._q.quest_award_amber;
					}
					else
					{
						questLogSpoilAmberObject.className = "hidden";
					}
					
					if( self._q.quest_award_xp != 0 )
					{
						questLogSpoilXPObject.className = "spoilXP";
						questLogSpoilXPObject.innerHTML = self._q.quest_award_xp;
					}
					else
					{
						questLogSpoilXPObject.className = "hidden";
					}
					
					if( self._q.quest_award_glory != 0 )
					{
						questLogSpoilGloryObject.className = "spoilGlory";
						questLogSpoilGloryObject.innerHTML = self._q.quest_award_glory;
					}
					else
					{
						questLogSpoilGloryObject.className = "hidden";
					}
					
					questNameObject.innerHTML = self._q.name;
					questDescriptionObject.innerHTML = self._q.description.replace( "%targetName", _ccD.character_name ).replace( "%targetClass", _ccD.character_class ).replace( "%targetRace", _ccD.character_race );
					questObjectivesObject.innerHTML = self._q.objectives.replace( "%targetName", _ccD.character_name ).replace( "%targetClass", _ccD.character_class ).replace( "%targetRace", _ccD.character_race );
					
					self.updateQuestConditions();
					
					questLogAbandonButtonObject.onclick = function()
					{
						Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
						
						Application.websocket.socket.send( '{"c":"questAbandon", "questId":' + questID + '}' );
					}
					
					if( _questLogScrollBarObject )
					{
						_questLogScrollBarObject.resetHeight();
					}
				}
				
				this.updateQuestConditions = function()
				{
					questLogQuestConditionsObject.innerHTML = '';
					
					for(var i in self._q.conditions)
					{
						var _condition = self._q.conditions[ i ];
						
						var conditionObject = document.createElement("div");
						conditionObject.className = ( _condition.currentValue < _condition.targetValue ) ? 'questCondition' : 'questConditionSolved';
						
						conditionObject.innerHTML = '<span class="conditionName">' + _condition.name + '</span><span class="conditionCurrentValue">' + _condition.currentValue + '</span> / <span class="conditionTargetValue">' + _condition.targetValue + '</span>';
						
						questLogQuestConditionsObject.appendChild( conditionObject );
					}
				}
				
				this.updateQuestTrackingConditions = function()
				{
					questTrackContainer.innerHTML = '<div class="questName">' + self._q.name + '</div>';
					
					for(var i in self._q.conditions)
					{
						var _condition = self._q.conditions[ i ];
						
						var conditionObject = document.createElement("div");
						conditionObject.className = ( _condition.currentValue < _condition.targetValue ) ? 'questCondition' : 'questConditionSolved';
						
						conditionObject.innerHTML = '<span class="conditionCurrentValue">' + _condition.currentValue + '</span>/<span class="conditionTargetValue">' + _condition.targetValue + '</span> - <span class="conditionName">' + _condition.name + '</span>';
						
						questTrackContainer.appendChild( conditionObject );
					}
				}
				
				var questTrackContainer = document.createElement("div");
				questTrackContainer.className = "questContainer";
				questLogProgressQuestsContainerObject.appendChild( questTrackContainer );
				
				// create the line in the grid
				var questDivObject = document.createElement("div");
				questDivObject.className = "questListItem";
				questDivObject.innerHTML = self._q.name;
				questDivObject.onclick = self._showDetails;
				
				// add the line to the grid
				questLogQuestListItemsObject.appendChild( questDivObject );
				
				// update the quest tracking
				this.updateQuestTrackingConditions();
				
				if( Object.keys( jsonEl.q )[ 0 ] == questID )
				{
					// ensure this happens only once
					questLogProgressContainerObject.className = "questLogProgress";
					
					// show the quest details
					self._showDetails();
				}
			}
			
			// go through each entry
			for( var i in jsonEl.q )
			{
				// this quest may be grabbed
				lines[ i ] = new _createQuestEntry( i );
			}
		}
		
		Application.websocket.socket.send( '{"c":"questsGetActive"}' );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	