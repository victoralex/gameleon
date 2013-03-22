
	Component.bugcraft.pageChat = function( args )
	{
		var chatChannelNames = {}, chatWhisperNames = [], chatChannelsInstanceNames = [], chatInputObjectStructBuffer = {}, _chatWindowContainerPosition = null,
				regExGeneral = /[a-zA-Z0-9]+:[0-9]+:[a-zA-Z0-9 \(\)\,\']+\]/, regExInput = /[a-zA-Z0-9 \(\)\,\']+\]/, _bottomBarPosition = Application.util.style.getPos( Component.bugcraft._layoutObjects.bottomBarObject ),
				_mouseX = 0, _mouseY = 0, _currentOpacity = 0, _fadeTimeout = null, _periodicMousePositionCheckFunctionTimeout = null,
				_chatAreaWidth =  _bottomBarPosition.left - 60,
			chatContainerObject = document.getElementById( args.id + "_chatContainer" ),
			chatWindowContainerObject = document.getElementById( args.id + "_chatWindowContainer" ),
			chatMessagesContainerObject = document.getElementById( args.id + "_chatMessagesContainer" ),
			chatFloatingMessagesContainer = document.getElementById( args.id + "_chatFloatingMessagesContainer" ),
			chatBackgroundContainerObject = document.getElementById( args.id + "_chatBackgroundContainer" ),
			chatUpButtonObject = document.getElementById( args.id + "_chatUpButton" ),
			chatDownButtonObject = document.getElementById( args.id + "_chatDownButton" ),
			chatEmotesButtonObject = document.getElementById( args.id + "_chatEmotesButton" ),
			chatEmoteButtonsContainerObject = document.getElementById( args.id + "_chatEmoteButtonsContainer" ),
			chatInputObject = document.getElementById( args.id + "_chatInput" );
		
		// insert structure in input box at current caret position
		Component.bugcraft.pageChatInsertObjectInInput = function( serializedObject )
		{
			//find the caret in the input box
			var _getCaret = function(el)
			{
				if (el.selectionStart)
				{
					return el.selectionStart;
				}
				else if (document.selection)
				{
					el.focus();
					
					var r = document.selection.createRange();
					
					if (r == null)
					{
						return 0;
					}

					var re = el.createTextRange();
					rc = re.duplicate();
					re.moveToBookmark(r.getBookmark());
					rc.setEndPoint('EndToStart', re);

					return rc.text.length;
				}
				
				return 0;
			}
			
			var pos = _getCaret( chatInputObject ), _civ = chatInputObject.value;
			
			chatInputObjectStructBuffer[ serializedObject.objectName ] = serializedObject.objectType + ":" + serializedObject.objectID + ":" + serializedObject.objectName + "]";
			
			// create the structure for special text - aka objects
			chatInputObject.value = _civ.substring(0, pos) + '[' + serializedObject.objectName + ']' + _civ.substring(pos, _civ.length);
			
			// set the focus to the input textfield
			chatInputObject.focus();
		}
		
		// handle the "/" key press
		Component.bugcraft.pageChatFocusOnTextfield = function( textToAdd )
		{
			if( textToAdd )
			{
				chatInputObject.value = "/";
			}
			
			// set the focus to the input textfield
			chatInputObject.focus();
		}
		
		// add emote in chat area
		Component.bugcraft.pageChatInsertMessage = function( messageType, messageText )
		{
			var messageDiv = document.createElement( "div" );
			messageDiv.className = "messageType" + messageType;
			messageDiv.innerHTML = messageText;
			
			chatFloatingMessagesContainer.appendChild( messageDiv );
			
			_fadeOutContent( messageDiv );
			
			_scrollMessagesContainer();
		}
		
		// scroll the floating messages container
		var _scrollMessagesContainer = function()
		{
			if( chatFloatingMessagesContainer.offsetHeight < chatMessagesContainerObject.offsetHeight )
			{
				return;
			}
			
			// auto scroll the floating container
			
			chatFloatingMessagesContainer.style.top = ( chatMessagesContainerObject.offsetHeight - chatFloatingMessagesContainer.offsetHeight ) + "px";
		}
		
		// parse input string and replace inserted structures with the real ones
		var _createMessageToSend = function( msg )
		{
			var messageParts = msg.split("[");
			
			for( var i = 0; i < messageParts.length; i++ )
			{
				var rez = regExInput.exec( messageParts[i] );
				
				if( rez == null )
				{
					// plain text
					
					continue;
				}
				
				// embedded object
				
				rez[0] = rez[0].substring( 0, (rez[0].length - 1) ); // remove ']'
				
				if( rez[0] in chatInputObjectStructBuffer )
				{
					messageParts[i] = chatInputObjectStructBuffer[rez[0]] + messageParts[i].substring( (rez[0].length + 1) );
				}
			}
			
			return messageParts.join('[');
		}
		
		//attatch chat structure with this character to given string
		var _addSenderToMessage = function( message )
		{
			var _cd = Component.bugcraft.currentCharacterObject.characterData;
			
			return "[player:" + _cd.character_id + ":" + _cd.character_name + "] says: " + message;
		}
		
		var _fadeOutContent = function( htmlObject )
		{
			// fade out this content
			setTimeout( function()
			{
				var _alpha = 1;
				
				var _shrinkContent = function()
				{
					//Application.util.html.removeNode( htmlObject );
					
					htmlObject.style.height = ( htmlObject.offsetHeight - 1 ) + "px";
					
					_scrollMessagesContainer();
					
					if( htmlObject.offsetHeight <= 0 )
					{
						Application.util.html.removeNode( htmlObject );
						
						return;
					}
					
					setTimeout( _shrinkContent, 250 );
				}
				
				var _fadeOutFunction = function()
				{
					htmlObject.style.opacity = ( _alpha -= 0.05 );
					
					if( _alpha <= 0 )
					{
						// remove this node
						
						_shrinkContent();
						
						return;
					}
					
					setTimeout( _fadeOutFunction, 250 );
				}
				
				_fadeOutFunction();
				
			}, 30000 );	
		}
		
		// character emote
		Application.websocket.handlers.characterEmote = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Received error " + jsonEl.r + " on character emote" );
				
				return;
			}
			
			// emote sent ok
		}
		
		// new message received from the chat channel
		Application.websocket.handlers.chatMessage = function( jsonEl, ws )
		{
			if( jsonEl.r == 302 )
			{
				// too many messages at a time
				
				Component.bugcraft.pageChatInsertMessage( "Error", "You cannot send more messages at this time" );
				
				return;
			}
			
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Received error " + jsonEl.r + " on chat message" );
				
				return;
			}
			
			var fromPlayerID = null, messageInTextFormat = "";
			
			//make structures in chat click-able
			var _setChatStructureTrigger = function( args )
			{
				switch( args.params[0] )
				{
					case "player":
						
						Application.event.add( args.obj, "click", function()
						{
							chatInputObject.value = "/w " + args.params[ 2 ] + " ";
							chatInputObject.focus();
						});
						
						if( fromPlayerID == null )
						{
							// considering that the 1st player information coming to the chat is the player actually sending the message
							
							fromPlayerID = args.params[ 1 ];
						}
						
					break;
					case "buff":
						
						var _tooltipObject = null;
						
						Application.event.add( args.obj, "click", function( e )
						{
							if( _tooltipObject == null )
							{
								Application.websocket.handlers.tooltipGetBuffData = function( jsonEl, ws )
								{
									_tooltipObject = new Component.bugcraft.tooltip.buff( args.obj, jsonEl.d );
									
									_tooltipObject.show( e );
								}
								
								//get instance chat channel names for future referance
								Application.websocket.socket.send( '{"c":"tooltipGetBuffData","buffID":' + args.params[ 1 ] + '}' );
								
								return;
							}
							
							_tooltipObject.show( e );
						});
						
					break;
					case "itempoor":
					case "itemfair":
					case "itemsuperior":
					case "itemmasterwork":
						
						var _tooltipObject = null;
						
						Application.event.add( args.obj, "click", function( e )
						{
							if( _tooltipObject == null )
							{
								Application.websocket.handlers.tooltipGetItemData = function( jsonEl, ws )
								{
									_tooltipObject = new Component.bugcraft.tooltip.item( args.obj, jsonEl.d );
									
									_tooltipObject.show( e );
								}
								
								//get instance chat channel names for future referance
								Application.websocket.socket.send( '{"c":"tooltipGetItemData","lootID":' + args.params[ 1 ] + '}' );
								
								return;
							}
							
							_tooltipObject.show( e );
						});
						
					break;
					case "quest":
						
						/*
						Application.event.add( args.obj, "click", function()
						{
							
							alert( "quest" + "-" + args.params[1] + "-" + args.params[2] );
						});
						*/
						
					break;
				}
			}
			
			var playerID = /player:([0-9]+)/.exec( jsonEl.message ),
				newMessage = document.createElement("div"), //message container
				_c = null;
			
			if( playerID[ 1 ] && ( _c = Component.bugcraft._characterData[ playerID[ 1 ] ] ) && _c.characterData.character_type != 3 )
			{
				// NPC talking
				
				newMessage.className = "messageChannelNPC";
			}
			else
			{
				// player talking
				
				newMessage.className = "messageChannel" + ( ( jsonEl.channelType == 'battleground' || jsonEl.channelType == 'general' || jsonEl.channelType == 'yell' || jsonEl.channelType == 'say' || jsonEl.channelType == 'whisper' ) ? jsonEl.channelType : 'standard' );
			}
			
			newMessage.innerHTML = "<span class='chatChannelName'>[" + jsonEl.channelName + "]</span>";
			
			//start chat message parse
			var messageParts = jsonEl.message.split("[");
			messageParts.push("");
			
			for( var i = 0; i < messageParts.length - 1; i++ )
			{
				var rez = regExGeneral.exec(messageParts[i]);
				
				if( rez == null )
				{
					// plain text
					// check is current element is '[' and next is a structure
					
					if( messageParts[i].length == 0 && regExGeneral.exec(messageParts[i + 1]) != null )
					{
						continue;
					}
					
					messageInTextFormat += "[" + messageParts[i];
					
					newMessage.appendChild( document.createTextNode( "[" + messageParts[i] ) );
					
					continue;
				}
				
				var newChatStruct = document.createElement("span"), chatObjectParts = rez[0].split(":");
				
				chatObjectParts[2] = chatObjectParts[2].substring( 0, (chatObjectParts[2].length - 1) ); //take out the ']' from the last part
				
				newChatStruct.className = "chatObject" + chatObjectParts[0];
				newChatStruct.appendChild( document.createTextNode( "[" + chatObjectParts[2] + "]" ) );
				
				messageInTextFormat += "[" + chatObjectParts[2] + "]";
				
				_setChatStructureTrigger({
											obj: newChatStruct,
											params: chatObjectParts
										});
				
				newMessage.appendChild( newChatStruct );
				
				// there is more plain text after structure
				if( rez[0].length == messageParts[i].length )
				{
					continue;
				}
				
				messageInTextFormat += messageParts[i].slice(rez[0].length);
				
				newMessage.appendChild( document.createTextNode( messageParts[ i ].slice( rez[0].length ) ) );
			}
			
			// add the text to the container
			chatFloatingMessagesContainer.appendChild( newMessage );
			
			_fadeOutContent( newMessage );
			
			_scrollMessagesContainer();
			
			// handle chat bubbles
			var _c = Component.bugcraft._characterData[ fromPlayerID ];
			
			if( _c && jsonEl.channelType == "say" && fromPlayerID != null )
			{
				_c.showChatBubbleSay(
										messageInTextFormat.substring( messageInTextFormat.indexOf( ":" ) + 2 )	// include the space after the ":"
									);
			}
			else if( _c && jsonEl.channelType == "yell" && fromPlayerID != null )
			{
				_c.showChatBubbleYell(
										messageInTextFormat.substring( messageInTextFormat.indexOf( ":" ) + 2 )	// include the space after the ":"
									);
			}
		}
		
		// join command
		Application.websocket.handlers.joinChannel = function( jsonEl, ws )
		{
			if( jsonEl.r == 201 )
			{
				Component.bugcraft.pageChatInsertMessage( "Error", "You are already in channel " + jsonEl.channelName );
				
				return;
			}
			
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Received error " + jsonEl.r + " on bad chat message" );
				
				return;
			}
			
			chatChannelNames[ jsonEl.channelName ] = jsonEl.channelType;
			
			Component.bugcraft.pageChatInsertMessage( "Notice", "Joined channel " + jsonEl.channelName );
		}
		
		//leave
		Application.websocket.handlers.leaveChannel = function( jsonEl, ws )
		{
			if( jsonEl.r == 201 || jsonEl.r == 202 )
			{
				Component.bugcraft.pageChatInsertMessage( "Error", "You cannot leave channel " + jsonEl.channelName );
				
				return;
			}
			
			if( jsonEl.r == 404 )
			{
				Component.bugcraft.pageChatInsertMessage( "Error", "You cannot leave unexistent channel " + jsonEl.channelName );
				
				return;
			}
			
			if( jsonEl.r != 200 )
			{
				Component.bugcraft.pageChatInsertMessage( "Error", "Received error " + jsonEl.r + " while leaving channel " + jsonEl.channelName );
				
				return;
			}
			
			// all ok
			
			delete chatChannelNames[ jsonEl.channelName ];
			
			Component.bugcraft.pageChatInsertMessage( "Notice", "Left channel " + jsonEl.channelName );
		}
		
		// whisper
		Application.websocket.handlers.whisper = function( jsonEl, ws )
		{
			if( jsonEl.r == 301 )
			{
				Component.bugcraft.pageChatInsertMessage( "Error", "Can not whisper to that player" );
				
				return;
			}
			
			if( jsonEl.r == 404 )
			{
				Component.bugcraft.pageChatInsertMessage( "Error", "The player is unavailable" );
				
				if( chatWhisperNames.indexOf( jsonEl.characterName.toLowerCase() ) >= 0)
				{
					chatWhisperNames.splice( chatWhisperNames.indexOf( jsonEl.characterName.toLowerCase() ), 1 );
				}
				
				return;
			}
		
			if( jsonEl.r != 200 )
			{
				Component.bugcraft.pageChatInsertMessage( "Error", "Received error " + jsonEl.r + " while performing whisper" );
				
				return;
			}
			
			chatWhisperNames.push( jsonEl.characterName.toLowerCase() );
		}
		
		// list instance channels names
		Application.websocket.handlers.chatGetInstanceChannelNames = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Received error " + jsonEl.r + " while performing channel names listing" );
				
				return;
			}
			
			chatChannelsInstanceNames = jsonEl.chatChannelsInstanceNames;
		}
		
		// response for sending a chatCommand
		Application.websocket.handlers.chatCommand = function( jsonEl, ws )
		{
			if( jsonEl.r == 302 )
			{
				// too many messages at a time
				
				Component.bugcraft.pageChatInsertMessage( "Error", "You cannot send more messages at this time" );
				
				return;
			}
			
			if( jsonEl.r == 400 )
			{
				Component.bugcraft.pageChatInsertMessage( "Error", "Chat command parameters error" );
				
				return;
			}
			
			if( jsonEl.r == 401 )
			{
				Component.bugcraft.pageChatInsertMessage( "Error", "Specific chat command parameters error" );
				
				return;
			}
			
			if( jsonEl.r != 200 )
			{
				Component.bugcraft.pageChatInsertMessage( "Error", "Misc chat command error " + jsonEl.r );
				
				return;
			}
			
			// all went ok
			
			if( jsonEl.t )
			{
				Component.bugcraft.pageChatInsertMessage( "Notice", "Server: " + jsonEl.t );
			}
		}
		
		var _sendMessageToServer = function( messageText )
		{
			//check if input is a command
			if( messageText.indexOf( '/' ) != 0 )
			{
				//send plain message
				Application.websocket.socket.send( JSON.stringify({
																		c: "chatMessage",
																		message: _addSenderToMessage( _createMessageToSend( messageText ) )
																	}) );
				
				return;
			}
			
			//
			// Command has to be sent
			//
			
			//split input
			var aux = messageText.split(' ', 1);
			aux[0] = aux[0].slice(1);
			aux[1] = messageText.slice( aux[0].length + 2 );
			
			switch( aux[0].toLowerCase() )
			{
				case "server":
					
					
					
				break;
				case "levelset":
					
					aux[ 0 ] = "levelSet";
					aux[ 1 ] = {
								levelNumber: aux[ 1 ],
								characterID: Component.bugcraft.currentCharacterTarget.characterData.character_id
							};
					
				break;
				case "s":
				case "say":
					
					aux[1] = {
								channelName: "say",
								channelType: "say",
								message: _addSenderToMessage( _createMessageToSend( aux[1] ) )
							};
					aux[0] = "changeChannel";
					
				break;
				case "y":
				case "yell":
					
					aux[1] = {
								channelName: "yell",
								channelType: "yell",
								message: _addSenderToMessage( _createMessageToSend( aux[1] ) )
							};
					aux[0] = "changeChannel";
					
				break;
				case "w":
				case "whisper":
					
					var dest = aux[1].split(' ')[0];
					
					aux[1] = {
								destCharacterName: dest.toLowerCase(),
								message: _addSenderToMessage( _createMessageToSend( aux[1].slice( dest.length + 1 ) ) )
							};
					
					aux[ 0 ] = "whisper";
					
				break;
				case "sad":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster is sad for %target.".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster is sad".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "smile":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster smiles %target.".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster smiles".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "kiss":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster kisses %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster blows a kiss to the wind".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "boo":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster boos %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster boos".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "cheer":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster cheers for %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster cheers".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "clap":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster claps for %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster claps".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "applaud":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster applauds %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster applauds".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "as":
				case "assist":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster asks for assistance with %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster asks for assistance".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "ch":
				case "charge":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster tells %target to charge".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster tells everyone to charge".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "attack":
				case "att":
				case "fire":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster tells %target to attack".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster tells everyone to attack".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "flee":
				case "retreat":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster tells %target to flee".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster tells everyone to flee".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "f":
				case "follow":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster asks %target to follow them".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster asks everyone to follow them".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "bye":
				case "goodbye":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster says goodbye to %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster says goodbye".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "heal":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster asks %target for healing".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster asks everyone for healing".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "hi":
				case "hello":
				case "greetings":
				case "greet":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster says hello to %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster says hello to everyone.".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "help":
				case "aid":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster asks %target for help".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster asks everyone for help".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "no":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster says no to %target.".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster says no".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "thank":
				case "thanks":
				case "thankyou":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster thanks %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster thanks everyone".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "wait":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster asks %target to wait".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster asks everyone to wait".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "yes":
				case "agree":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster agrees with %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster agrees".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "laugh":
				case "rofl":
				case "lol":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster laughs at %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster laughs".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "wave":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster waves at %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster waves".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "point":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster points at %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster points at something".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "hug":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster hugs %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster hugs everyone".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "dance":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster bursts into dance with %target!".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster bursts into dance!".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "flirt":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster flirts with %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster flirts".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "funny":
				case "joke":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster tells a joke to %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster tells a joke".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "love":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster loves %target".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster loves everyone".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "slap":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster slaps %target. Oh, to the face!".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster receives a slap from nowhere. Looks self inflicted.".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "salute":
					
					// emote
					
					var _ct = Component.bugcraft.currentCharacterTarget, _cc = Component.bugcraft.currentCharacterObject;
					
					aux[ 1 ] = {
								emoteName: aux[ 0 ],
								target: _ct ? _ct.characterData.character_id : null,
								text: ( _ct != _cc )
												? "%caster salutes %target with respect!".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name ).replace( "%target", _ct.characterData.character_name )
												: "%caster salutes".replace( "%caster", Component.bugcraft.currentCharacterObject.characterData.character_name )
							}
					aux[ 0 ] = "emote";
					
				break;
				case "join":
				case "leave":
					
					var cn = aux[1].split(' ')[0].toLowerCase();																		
					if( cn == "say" )
					{
						aux[1] = {
									channelName: cn,
									channelType: "say"
								};
					}
					else
					{
						if( chatChannelsInstanceNames.indexOf( cn ) >= 0 )
						{
							aux[1] = {
										channelName: cn,
										channelType: "instance"
									};
						}
						else
						{
							aux[1] = {
										channelName: cn,
										channelType: "global"
									};
						}
					}
					
				break;
				default:
					
					//check if first parameter is a channel where the character is already on
					if( aux[0].toLowerCase() in chatChannelNames )
					{
						aux[1] = {
									channelName: aux[0].toLowerCase(),
									channelType: chatChannelNames[ aux[0].toLowerCase() ],
									message: _addSenderToMessage( _createMessageToSend( aux[1] ) )
								};
						aux[0] = "changeChannel";
					}
					
					//check if first parameter is a character this character already whisperd to
					if( chatWhisperNames.indexOf( aux[0].toLowerCase() ) >= 0 )
					{
						aux[1] = {
									destCharacterName: aux[0].toLowerCase(),
									message: _addSenderToMessage( _createMessageToSend( aux[1] ) )
								};
								
						aux[0] = "whisper";
					}
			}
			
			Application.websocket.socket.send( JSON.stringify({
																		c: "chatCommand",
																		command: aux[0],
																		parameters: aux[1]
																	}) );
		}
		
		// input area key typing listen
		Application.event.add( chatInputObject, "keypress", function( e )
		{
			if( e.which != 13 )
			{
				// enter not pressed yet
				
				return;
			}
			
			if( chatInputObject.value.length == 0 )
			{
				// no message to send
				
				return;
			}
			
			_sendMessageToServer( chatInputObject.value );
			
			// reset input object
			chatInputObject.value = "";
			
			// reset the internal structure buffer
			chatInputObjectStructBuffer = {};
		});
		
		Application.event.add( chatInputObject, "keydown",  function( e )
		{
			// prevent UI events (like showing windows or casting buffs) to happen
			
			e.cancelBubble = true;
		});
		
		Application.event.add( chatInputObject, "keyup", function( e )
		{
			// prevent UI events (like showing windows or casting buffs) to happen
			
			e.cancelBubble = true;
		});
		
		// "up" button press
		Application.event.add( chatUpButtonObject, "mousedown", function( e )
		{
			e.cancelBubble = true;	// prevent UI events (like showing windows or casting buffs) to happen
			
			if( chatFloatingMessagesContainer.offsetTop >= 0 )
			{
				return;
			}
			
			chatFloatingMessagesContainer.style.top = ( chatFloatingMessagesContainer.offsetTop + 10 ) + "px";
		});
		
		// "down" button press
		Application.event.add( chatDownButtonObject, "mousedown", function( e )
		{
			e.cancelBubble = true;	// prevent UI events (like showing windows or casting buffs) to happen
			
			if( Math.abs( chatFloatingMessagesContainer.offsetTop ) + chatMessagesContainerObject.offsetHeight >= chatFloatingMessagesContainer.offsetHeight )
			{
				return;
			}
			
			chatFloatingMessagesContainer.style.top = ( chatFloatingMessagesContainer.offsetTop - 10 ) + "px";
		});
		
		//
		// Focus rules
		//
		
		Application.event.add( chatInputObject, "focus", function( e )
		{
			clearTimeout( _periodicMousePositionCheckFunctionTimeout );
			
			// fade in the box
			_fadeFunction( 0.05, 0.7, true );
		});
		
		Application.event.add( chatInputObject, "blur", function( e )
		{
			clearTimeout( _periodicMousePositionCheckFunctionTimeout );	// prevent duplicate calls
			_periodicMousePositionCheckFunction();
		});
		
		// ensure easy focus for the chat area
		Application.event.add( chatWindowContainerObject, "click", function( e )
		{
			chatInputObject.focus();
		});
		
		// check the mouse position
		Application.event.add( document.body, "mousemove", function( e )
		{
			// track mouse movement
			
			_mouseX = e.x;
			_mouseY = e.y;
		});
		
		var _fadeFunction = function( increment, target, gtSign )
		{
			if( ( ( gtSign ) ? ( _currentOpacity + increment > target ) : ( _currentOpacity + increment < target ) ) )
			{
				return;
			}
			
			_currentOpacity += increment;
			
			// alter the background area's opacity
			chatBackgroundContainerObject.style.opacity = _currentOpacity;
			chatBackgroundContainerObject.style.mozOpacity = _currentOpacity;
			
			chatInputObject.style.opacity = ( _currentOpacity + 0.5 );
			chatInputObject.style.mozOpacity = ( _currentOpacity + 0.5 );
			
			_fadeTimeout = setTimeout( function() { _fadeFunction( increment, target, gtSign) }, 50 );
		}
		
		var _periodicMousePositionCheckFunction = function()
		{
			clearTimeout( _fadeTimeout );
			
			if(
				_mouseX < _chatWindowContainerPosition.left
				|| _mouseY < _chatWindowContainerPosition.top
				|| _mouseX > _chatWindowContainerPosition.left + chatWindowContainerObject.offsetWidth
				|| _mouseY > _chatWindowContainerPosition.top + chatWindowContainerObject.offsetHeight
			)
			{
				_fadeFunction( -0.05, 0, false );
				
				_periodicMousePositionCheckFunctionTimeout = setTimeout( _periodicMousePositionCheckFunction, 500 );
				
				return;
			}
			
			// over the chat window
			
			_fadeFunction( 0.05, 0.7, true );
			
			_periodicMousePositionCheckFunctionTimeout = setTimeout( _periodicMousePositionCheckFunction, 500 );
		}
		
		// start the mouseover checks a bit later
		setTimeout( function()
		{
			_chatWindowContainerPosition = Application.util.style.getPos( chatContainerObject );
			
			_periodicMousePositionCheckFunction();
		}, 2500 );
		
		//
		// Set the initial design
		//
		
		// stretch the chat window to the max extent possible
		chatWindowContainerObject.style.width = _chatAreaWidth + "px";
		chatBackgroundContainerObject.style.width = _chatAreaWidth + "px";
		
		if( _chatAreaWidth < 100 )
		{
			// unusable area due to the size. make it disappear to prevent a bad design
			
			chatContainerObject.className = "hidden";
		}
		
		//
		// attach events to each emote button
		//
		
		var _attachEmoteButtonEvents = function( emoteObject )
		{
			emoteObject.onclick = function( e )
			{
				_sendMessageToServer( "/" + emoteObject.getAttribute( "emoteCommand" ) );	// concatenate "/" to ensure that it is treated as a command
				
				chatEmoteButtonsContainerObject.className = "hidden";
			}
		}
		
		for(var i=1;i<=30;i++)
		{
			var emoteButtonObject = document.getElementById( args.id + '_chatEmote' + i );
			
			_attachEmoteButtonEvents( emoteButtonObject );
		}
		
		Application.event.add( chatEmotesButtonObject, "mouseover", function( e )
		{
			chatEmoteButtonsContainerObject.className = "emotesContainer";
		});
		
		Application.event.add( chatEmotesButtonObject, "mouseout", function( e )
		{
			chatEmoteButtonsContainerObject.className = "hidden";
		});
		
		//get instance chat channel names for future referance
		Application.websocket.socket.send( '{"c":"chatGetInstanceChannelNames"}' );
	}
	
	Component.bugcraft.pageChatInsertObjectInInput = function( serializedObject )
	{
		
	}
	
	Component.bugcraft.pageChatFocusOnTextfield = function( textToAdd )
	{
		
	}
	
	Component.bugcraft.pageChatInsertMessage = function( messageType, messageText )
	{
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	