	
	/*
		Switch Character / New Character page
	*/
	
	Component.bugcraft.pageSelectCharacter = function( args )
	{
		var charactersListTabTitleObject = document.getElementById( args.id + '_tabTitle1' ),
			charactersListTabContentObject = document.getElementById( args.id + '_tabContent1' ),
			newCharacterTabTitleObject = document.getElementById( args.id + '_tabTitle2' ),
			newCharacterTabContentObject = document.getElementById( args.id + '_tabContent2' );
		
		//Component.bugcraft.sound.screen.selectCharacter();
		
		var self = this, _selectedCharObject = null;
		
		// create character handler. this is located here because it requires the variables to manipulate the tabs
		Application.websocket.handlers.createCharacter = function( jsonEl, ws )
		{
			if( jsonEl.r == 300 )
			{
				alert( "A character with the same name exists already" );
				
				return;
			}
			
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Create character error " + jsonEl.r + " has occured" );
				
				return;
			}
			
			self.populateCurrentCharactersTab({
															id: args.id,
															selectedCharacterPosition: 0
														});
			
			newCharacterTabContentObject.className = "hidden";
			charactersListTabContentObject.className = "visible";
		}
		
		/*
			The current characters
		*/
		
		this.populateCurrentCharactersTab = function( args )
		{
			var charactersListObject = document.getElementById( args.id + "_charactersList" ),
				selectedCharacterImageObject = document.getElementById( args.id + "_selectedCharacterImage" ),
				selectedCharacterNameObject = document.getElementById( args.id + "_selectedCharacterNameContainer" ),
				newCharacterButtonObject = document.getElementById( args.id + "_newCharacterButton" );
			
			// reset the layout
			
			charactersListObject.innerHTML = '';
			selectedCharacterNameObject.innerHTML = '';
			
			// set the page background
			document.body.className = "alternateBodyBackground3";
			
			Application.websocket.handlers.selectCharacter = function( jsonEl, ws )
			{
				if( jsonEl.r != 200 )
				{
					return false;
				}
				
				// Redirect to the main page
				Component.bugcraft.redirectToMainPage();
			}
			
			Application.websocket.handlers.destroySession = function( jsonEl, ws )
			{
				if( jsonEl.r != 200 )
				{
					return false;
				}
				
				// Redirect to the main page
				Component.bugcraft.redirectToRealmListPage();
			}
			
			Application.websocket.handlers.getCharacters = function( jsonEl, ws )
			{
				if( jsonEl.r != 200 )
				{
					return false;
				}
				
				var deleteButtonObject = document.getElementById( args.id + "_deleteCharacterButton" ),
					loginButtonObject = document.getElementById( args.id + "_loginCharacterButton" ),
					backButtonObject = document.getElementById( args.id + "_backButton" ),
					charactersListScrollUpButtonObject = document.getElementById( args.id + "_upButton" ),
					charactersListScrollDownButtonObject = document.getElementById( args.id + "_downButton" ),
					_totalCharacters = 0, _newPos = 0, _scrollPos = 0, _maxListLength = 0, _scrollEaseInOutPointer = null,
					_oldCharObject = null;
				
				loginButtonObject.className = "loginCharacter";
				deleteButtonObject.className = "deleteCharacter";
				
				_selectedCharObject = null;
				
				var _scrollEaseInOut =	function ( args )
														{
															if( Math.round( _scrollPos ) == args.finalPos )
															{
																// reached the end
																
																_scrollPos = args.finalPos;
																
																charactersListObject.style.marginTop = _scrollPos + "px";
																
																return;
															}
															
															_scrollPos += ( args.finalPos - _scrollPos ) / 8;
															
															charactersListObject.style.marginTop = _scrollPos + "px";
															
															_scrollEaseInOutPointer = setTimeout(	function() 
																															{
																																_scrollEaseInOut({
																																						direction: -1,
																																						finalPos: args.finalPos
																																					});
																															}, 30 );
																
														}
				
				Application.websocket.handlers.deleteCharacter = function( jsonEl, ws )
				{
					if( jsonEl.r != 200 )
					{
						return false;
					}
					
					_totalCharacters--;
					
					if( _totalCharacters <= 1 )
					{
						// do not allow the deletion of the last character
						
						_hideDeleteButton();
					}
					
					// Remove this node
					if( _selectedCharObject.removeNode )
					{
						_selectedCharObject.removeNode( true );
					}
					else
					{
						_selectedCharObject.parentNode.removeChild(
													_selectedCharObject
												);
					}
					
					self.populateCurrentCharactersTab({
																id: args.id,
																selectedCharacterPosition: 0
															});
					
					newCharacterTabContentObject.className = "hidden";
					charactersListTabContentObject.className = "visible";
				}
				
				newCharacterButtonObject.onclick = function()
				{
					Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
					
					self.populateNewCharacterTab({
														id: args.id,
														selectMemberSound: true
													});
					
					newCharacterTabContentObject.className = "visible";
					charactersListTabContentObject.className = "hidden";
				}
				
				loginButtonObject.onclick = function()
				{
					Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
					
					Application.websocket.socket.send( '{"c":"selectCharacter","characterID":' + _selectedCharObject._characterData.character_id + '}' );
				}
				
				backButtonObject.onclick =	function()
				{
					Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
					
					Application.websocket.socket.send( '{"c":"destroySession"}' );
				};
				
				deleteButtonObject.onclick =	function()
				{
					if( !_selectedCharObject )
					{
						return;
					}
					
					if( !confirm( "Are you sure you want to delete this character?" ) )
					{
						return;
					}
					
					Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
					
					Application.websocket.socket.send( '{"c":"deleteCharacter","characterID":' + _selectedCharObject._characterData.character_id + '}' );
				};
				
				var _scrollUp = function()
				{
					clearTimeout ( _scrollEaseInOutPointer );
					_newPos = _scrollPos + 128;
					
					if( _newPos > 0 )
					{
						_newPos = 0;
					}
					
					_scrollEaseInOut({
										direction: 1,
										finalPos: _newPos
									});
				}
				
				var _scrollDown = function()
				{
					clearTimeout ( _scrollEaseInOutPointer );
					_newPos = _scrollPos - 128;
					
					//440 is the height of the listContainer div
					if( _newPos < _maxListLength + 440 )
					{
						//442 so that the last line under the char would not be seen
						_newPos = _maxListLength + 442;
					}	
					
					_scrollEaseInOut({
										direction: -1,
										finalPos: _newPos
									});
				};
				
				charactersListScrollUpButtonObject.onclick = _scrollUp;
				charactersListScrollDownButtonObject.onclick = _scrollDown;
				
				charactersListObject.onmousewheel = function( e )
				{
					if( e.wheelDelta / 10 > 0 )
					{
						_scrollUp();
					}
					else
					{
						_scrollDown();
					}
				};
				
				var _createCharacterItem = function( characterData )
				{
					var _characterDiv = document.createElement( "div" );
					_characterDiv.className = "characterEntry " + characterData.character_faction + "Character";
					_characterDiv.innerHTML = "<div class='icon" + characterData.character_race + "'><div class='levelContainer'>" + characterData.character_level + "</div></div>" +
																"<div class='information'>" +
																	"<div class='nameContainer'><span class='name'>" + characterData.character_name + "</span><span class='nameShadow'>" + characterData.character_name + "</span></div>" +
																	"<div class='zoneContainer'>" + characterData.character_zone + "</div>" +
																	"<span class='race'>" + characterData.character_race + "</span><span class='class'>" + characterData.character_class + "</span>" +
																"</div>";
					_characterDiv._characterData = characterData;
					
					charactersListObject.appendChild( _characterDiv );
					
					// character selection
					_characterDiv._clickFunction = function()
					{
						//Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
						
						_oldCharObject = _selectedCharObject;
						
						_selectedCharObject = _characterDiv;
						
						if( _oldCharObject )
						{
							_oldCharObject._outFunction();
						}
						
						_characterDiv._overFunction();
						
						selectedCharacterImageObject.className = "image" + characterData.character_race;
						
						selectedCharacterNameObject.innerHTML = "<span class='name'>" + characterData.character_name + "</span>";
					};
					
					// special effects
					_characterDiv._overFunction = function()
					{
						_characterDiv.className = "characterEntry " + characterData.character_faction + "Character hover";
					}
					
					_characterDiv._outFunction = function()
					{
						if( _selectedCharObject == _characterDiv )
						{
							return;
						}
						
						_characterDiv.className = "characterEntry " + characterData.character_faction + "Character";
					}
					
					Application.event.add( _characterDiv, "mouseover", _characterDiv._overFunction );
					Application.event.add( _characterDiv, "mouseout", _characterDiv._outFunction );
					Application.event.add( _characterDiv, "click", _characterDiv._clickFunction );
					Application.event.add( _characterDiv, "dblclick", function( e )
					{
						_characterDiv._clickFunction( e );
						
						Application.websocket.socket.send( '{"c":"selectCharacter","characterID":' + _selectedCharObject._characterData.character_id + '}' );
					});
					
					return _characterDiv;
				}
				
				var _hideDeleteButton = function()
				{
					loginButtonObject.className = "hidden";
					deleteButtonObject.className = "hidden";
				}
				
				loginButtonObject.scrollIntoView( true );
				
				if( jsonEl.characters.length > 0 )
				{
					_totalCharacters = jsonEl.characters.length;
					
					for( var i=0;i<jsonEl.characters.length;i++)
					{
						var _attr = jsonEl.characters[ i ]
						
						var _c = _createCharacterItem( _attr );
						
						if( i == args.selectedCharacterPosition )
						{
							_c._clickFunction();
						}
					}
				}
				else
				{
					self.populateNewCharacterTab({
														id: args.id
													});
					
					newCharacterTabContentObject.className = "visible";
					charactersListTabContentObject.className = "hidden";
					
					_totalCharacters = 1;
					_hideDeleteButton();
				}
				
				//the length of the characters list in px ( must be negative )
				_maxListLength = -1 * ( _totalCharacters * 128 ); 
				
			}
			
			Application.websocket.socket.send( '{"c":"getCharacters"}' );
		};
		
		/*
			New Character Tab
		*/
		
		this.populateNewCharacterTab = function( args )
		{
			var createButtonObject = document.getElementById( args.id + "_createButton" ),
				changeRealmButtonObject = document.getElementById( args.id + "_changeRealmButton" ),
				newCharacterNameObject = document.getElementById( args.id + "_newCharacterName" ),
				memberLink1Object = document.getElementById( args.id + "_memberLink1" ),
				memberLink2Object = document.getElementById( args.id + "_memberLink2" ),
				memberLink3Object = document.getElementById( args.id + "_memberLink3" ),
				memberLink4Object = document.getElementById( args.id + "_memberLink4" ),
				memberLink5Object = document.getElementById( args.id + "_memberLink5" ),
				memberLink6Object = document.getElementById( args.id + "_memberLink6" ),
				description1Object = document.getElementById( args.id + "_description1" ),
				description2Object = document.getElementById( args.id + "_description2" ),
				description3Object = document.getElementById( args.id + "_description3" ),
				description4Object = document.getElementById( args.id + "_description4" ),
				description5Object = document.getElementById( args.id + "_description5" ),
				description6Object = document.getElementById( args.id + "_description6" ),
				playingRaceVoiceObject = null;
			
			var selectedMembersAssoc = [ "ant", "fireant", "butterfly", "bee", "ladybug", "mantis" ], selectedMemberRace = "";
			
			memberLink1Object.onclick = function() { _selectMember(1, true); };
			memberLink2Object.onclick = function() { _selectMember(2, true); };
			memberLink3Object.onclick = function() { _selectMember(3, true); };
			//memberLink4Object.onclick = function() { _selectMember(4, true); };
			//memberLink5Object.onclick = function() { _selectMember(5, true); };
			//memberLink6Object.onclick = function() { _selectMember(6, true); };
			
			if( !args.noBackgroundChange )
			{
				// set the page background
				document.body.className = "alternateBodyBackground2";
			}
			
			newCharacterNameObject.setAttribute( "defaultValue", newCharacterNameObject.value );
			
			Application.websocket.handlers.destroySession = function( jsonEl, ws )
			{
				if( jsonEl.r != 200 )
				{
					return false;
				}
				
				// Redirect to the main page
				Component.bugcraft.redirectToRealmListPage();
			}
			
			changeRealmButtonObject.onclick = function()
			{
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
				
				newCharacterTabContentObject.className = "hidden";
				charactersListTabContentObject.className = "visible";
				
				self.populateCurrentCharactersTab({
															id: args.id,
															selectedCharacterPosition: 0
														});
				
				//Application.websocket.socket.send( '{"c":"destroySession"}' );
			};
			
			var _selectMember = function( memberID, playSound )
			{
				//Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
				
				if( playSound == true )
				{
					if( playingRaceVoiceObject )
					{
						playingRaceVoiceObject.stop();
					}
					
					switch( memberID )
					{
						case 1:
							
							playingRaceVoiceObject = Component.bugcraft.sound.characters.playRaceVoiceOverwrite( "ant", "charge" );
							
						break;
						case 2:
							
							playingRaceVoiceObject = Component.bugcraft.sound.characters.playRaceVoiceOverwrite( "fireant", "charge" );
							
						break;
						case 3:
							
							playingRaceVoiceObject = Component.bugcraft.sound.characters.playRaceVoiceOverwrite( "butterfly", "charge" );
							
						break;
						case 4:
							
							playingRaceVoiceObject = Component.bugcraft.sound.characters.playRaceVoiceOverwrite( "bee", "charge" );
							
						break;
						case 5:
							
							playingRaceVoiceObject = Component.bugcraft.sound.characters.playRaceVoiceOverwrite( "ladybug", "charge" );
							
						break;
						case 6:
							
							playingRaceVoiceObject = Component.bugcraft.sound.characters.playRaceVoiceOverwrite( "mantis", "charge" );
							
						break;
					}
				}
				
				var iconObject = document.getElementById( args.id + "_icon" );
				
				for(var i=1;i<7;i++)
				{
					var descriptionObject = document.getElementById( args.id + "_description" + i );
					var memberObject = document.getElementById( args.id + "_memberLink" + i );
					
					if( i != memberID )
					{
						descriptionObject.className = "description hidden";
						memberObject.className = "member" + i;
					}
					else
					{
						descriptionObject.className = "description";
						memberObject.className = "member" + i + "Hover";
					}
				}
				
				selectedMemberRace = selectedMembersAssoc[ memberID - 1 ];
			}
			
			var _createCharacter = function()
			{
				if( /^[a-zA-Z]+$/.test( newCharacterNameObject.value ) == false )
				{
					alert( "Please enter a character name" );
					
					return;
				}
				
				Application.websocket.socket.send( '{"c":"createCharacter","name":"' + newCharacterNameObject.value + '","race":"' + selectedMemberRace + '"}' );
				
				newCharacterNameObject.value = newCharacterNameObject.getAttribute("defaultValue");
			};
			
			createButtonObject.onclick = function()
			{
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClick" );
				
				_createCharacter();
			}
			
			newCharacterNameObject.scrollIntoView( true );
			
			newCharacterNameObject.onkeyup = function(e)
			{
				e = e ? e : window.event;
				
				if( newCharacterNameObject.value.length > 20 )
				{
					newCharacterNameObject.value = newCharacterNameObject.value.substring( 0 , 20 );
				}
				
				if( newCharacterNameObject.value.match( /^[a-zA-Z]+$/ ) )
				{
					// valid character name
					
					createButtonObject.className = "createCharacterButtonEnabled";
				}
				else
				{
					createButtonObject.className = "createCharacterButtonDisabled";
				}
				
				if( e.keyCode != 13 || newCharacterNameObject.value.length == 0 )
				{
					return;
				}
				
				if( !newCharacterNameObject.value.match( /^[a-zA-Z]+$/ ) )
				{
					alert( "Your character name may only contain letters");
					
					return;
				}
				
				_createCharacter();
			};
			
			newCharacterNameObject.onfocus = function()
			{
				if( newCharacterNameObject.value != newCharacterNameObject.getAttribute("defaultValue") )
				{
					return;
				}
				
				newCharacterNameObject.value = "";
			};
			
			newCharacterNameObject.onblur = function()
			{
				if( newCharacterNameObject.value.length != 0)
				{
					return;
				}
				
				newCharacterNameObject.value = newCharacterNameObject.getAttribute("defaultValue");
			};
			
			// Select a random character
			//_selectMember( Math.ceil( Math.random() * 6 ), args.selectMemberSound );
			_selectMember( Math.ceil( Math.random() * 3 ), args.selectMemberSound );
		};
		
		/*
			Initialize
		*/
		
		switch( Application.util.urlInformation.params )
		{
			case "characterList":
				
				if( Component.bugcraft.currentUserFacebookID != null )
				{
					newCharacterTabContentObject.className = "hidden";
					charactersListTabContentObject.className = "visible";
					
					this.populateNewCharacterTab({
														id: args.id,
														selectMemberSound: false,
														noBackgroundChange: true
													});
					
					this.populateCurrentCharactersTab({
																id: args.id,
																selectedCharacterPosition: 0
															});
				}
				
			break;
			case "newCharacter":
				
				newCharacterTabContentObject.className = "visible";
				charactersListTabContentObject.className = "hidden";
				
				this.populateCurrentCharactersTab({
															id: args.id,
															selectedCharacterPosition: 0
														});
				
				this.populateNewCharacterTab({
													id: args.id,
													selectMemberSound: true
												});
				
			break;
			default:
				
				newCharacterTabContentObject.className = "hidden";
				charactersListTabContentObject.className = "visible";
				
				this.populateNewCharacterTab({
													id: args.id,
													selectMemberSound: false,
													noBackgroundChange: true
												});
				
				this.populateCurrentCharactersTab({
															id: args.id,
															selectedCharacterPosition: 0
														});
				
		}
		
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	