	
	/*
		Spell book page
	*/
	
	Component.bugcraft.pageSpellBook = function( args )
	{
		var spellBookPageObject = document.getElementById( args.id + '_spellBookPage' );
		
		// ensure this code is run only once
		if( typeof Component.bugcraft.initializedPages.spellBook != "undefined" )
		{
			Component.bugcraft.initializedPages.spellBook = !Component.bugcraft.initializedPages.spellBook;
			spellBookPageObject.className = ( spellBookPageObject.className == "hidden" ) ? "spellBook" : "hidden";
			
			if( !Component.bugcraft.initializedPages.spellBook )
			{
				Component.bugcraft.sound.ui.playEvent( "window", "bookOpen" );
				
				Component.bugcraft.scaleWindow( spellBookPageObject );
			}
			else
			{
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			}
			
			return;
		}
		
		if( !args.hidden )
		{
			spellBookPageObject.className = "spellBook";
		}
		
		Component.bugcraft.initializedPages.spellBook = true;
		
		// make sure there is no context menu
		spellBookPageObject.oncontextmenu = function()
		{
			return false;
		}
		
		var spellsContainerObject = document.getElementById( args.id + '_spellsContainer' ),
			spellBookLeftArrowObject = document.getElementById( args.id + '_spellBookLeftArrow' ),
			spellBookRightArrowObject = document.getElementById( args.id + '_spellBookRightArrow' ),
			spellBookCloseButtonObject = document.getElementById( args.id + '_spellBookCloseButton' ),
			spellBookPlaceHolder1IconObject = document.getElementById( args.id + '_spellBookPlaceHolder1Icon' ),
			spellBookPlaceHolder2IconObject = document.getElementById( args.id + '_spellBookPlaceHolder2Icon' ),
			spellBookPlaceHolder3IconObject = document.getElementById( args.id + '_spellBookPlaceHolder3Icon' );
		
		var spellBookAssociations =
		{
			conqueror: document.getElementById( args.id + '_buffContainer1' ),
			champion: document.getElementById( args.id + '_buffContainer2' ),
			soldier: document.getElementById( args.id + '_buffContainer3' ),
			
			stalker: document.getElementById( args.id + '_buffContainer1' ),
			guide: document.getElementById( args.id + '_buffContainer2' ),
			scout: document.getElementById( args.id + '_buffContainer3' ),
			
			enzymage: document.getElementById( args.id + '_buffContainer1' ),
			sage: document.getElementById( args.id + '_buffContainer2' ),
			noble: document.getElementById( args.id + '_buffContainer3' ),
			
			misc: document.getElementById( args.id + '_buffContainer3' )
		};
		
		var spellPlaceHolders =
		{
			conqueror: document.getElementById( args.id + '_spellBookPlaceHolder1' ),
			champion: document.getElementById( args.id + '_spellBookPlaceHolder2' ),
			soldier: document.getElementById( args.id + '_spellBookPlaceHolder3' ),
			
			stalker: document.getElementById( args.id + '_spellBookPlaceHolder1' ),
			guide: document.getElementById( args.id + '_spellBookPlaceHolder2' ),
			scout: document.getElementById( args.id + '_spellBookPlaceHolder3' ),
			
			enzymage: document.getElementById( args.id + '_spellBookPlaceHolder1' ),
			sage: document.getElementById( args.id + '_spellBookPlaceHolder2' ),
			noble: document.getElementById( args.id + '_spellBookPlaceHolder3' )
		};
		
		var classTalentTreeAssociation =
		{
			soldier: [ "conqueror", "champion", "soldier" ],
			scout: [ "stalker", "guide", "scout" ],
			noble: [ "enzymage", "sage", "noble" ]
		};
		
		//
		// Show a specialization container
		//
		
		// show a page inside a specialization container
		var _lastVisibleContainer = null;
		var _switchToContainer = function( containerObject )
		{
			if( _lastVisibleContainer == containerObject )
			{
				return false;
			}
			
			if( _lastVisibleContainer )
			{
				_lastVisibleContainer.className = 'buffsContainerHidden';
			}
			
			containerObject.className = 'buffsContainer';
			_lastVisibleContainer = containerObject;
			
			// make sure the left and right buttons work using the selected container
			
			spellBookLeftArrowObject.onclick = function()
			{
				Component.bugcraft.sound.ui.playEvent( "window", "pageTurn" );
				
				_showPage( containerObject, -1 );
			};
			
			spellBookRightArrowObject.onclick = function()
			{
				Component.bugcraft.sound.ui.playEvent( "window", "pageTurn" );
				
				_showPage( containerObject, 1 );
			};
			
			return true;
		}
		
		// show the container associated to a specialization
		var _showContainer = function( holderObject, containerObject )
		{
			holderObject.className = "placeHolderSelected";
			
			for(var i in spellPlaceHolders)
			{
				if(
					spellPlaceHolders[ i ].className != "placeHolderSelected"
					|| spellPlaceHolders[ i ] == holderObject
				)
				{
					continue;
				}
				
				spellPlaceHolders[ i ].className = 'placeHolder';
				
				break;
			}
			
			_switchToContainer( containerObject );
		}
		
		// events association for the containers
		var _associateHolderWithContainer = function( holderObject, containerObject )
		{
			Application.event.add( holderObject, "click", function( e )
			{
				Component.bugcraft.sound.ui.playEvent( "window", "pageTurn" );
				
				_showContainer( holderObject, containerObject );
			});
		}
		
		//
		// Show a page inside the current specialization container
		//
		
		var _showPage = function( containerObject, pageNumber )
		{
			if( pageNumber == 0 )
			{
				if( containerObject.childNodes.length > 0 )
				{
					containerObject.childNodes[ pageNumber ].className = 'buffsContainerPage';
				}
				
				return true;
			}
			
			var _getOffsetPageNumber = function( currentPageNumber, offset )
			{
				if( currentPageNumber + offset >= containerObject.childNodes.length )
				{
					return 0;
				}
				else if( currentPageNumber + offset < 0 )
				{
					return containerObject.childNodes.length - 1;
				}
				
				return currentPageNumber + offset;
			}
			
			for(var i=0;i<containerObject.childNodes.length;i++)
			{
				if( containerObject.childNodes[ i ].className != 'buffsContainerPage' )
				{
					continue;
				}
				
				containerObject.childNodes[i].className = 'buffsContainerPageHidden';
				
				containerObject.childNodes[ _getOffsetPageNumber( i, pageNumber ) ].className = 'buffsContainerPage';
				
				break;
			}
		};
		
		//
		// Initialization
		//
		
		_associateHolderWithContainer( spellPlaceHolders.conqueror, spellBookAssociations.conqueror );
		_associateHolderWithContainer( spellPlaceHolders.champion, spellBookAssociations.champion );
		_associateHolderWithContainer( spellPlaceHolders.soldier, spellBookAssociations.soldier );
		
		_showContainer( spellPlaceHolders.noble, spellBookAssociations.noble ); // first container
		
		spellPlaceHolders.conqueror.style.backgroundImage = "url('/appSpecific/img/spellBook/" + classTalentTreeAssociation[ Component.bugcraft.currentCharacterObject.characterData.character_class ][0] + ".png')";
		spellPlaceHolders.conqueror.setAttribute("title", classTalentTreeAssociation[ Component.bugcraft.currentCharacterObject.characterData.character_class ][0] );
		spellPlaceHolders.champion.style.backgroundImage = "url('/appSpecific/img/spellBook/" + classTalentTreeAssociation[ Component.bugcraft.currentCharacterObject.characterData.character_class ][1] + ".png')";
		spellPlaceHolders.champion.setAttribute("title", classTalentTreeAssociation[ Component.bugcraft.currentCharacterObject.characterData.character_class ][1] );
		spellPlaceHolders.soldier.style.backgroundImage = "url('/appSpecific/img/spellBook/" + classTalentTreeAssociation[ Component.bugcraft.currentCharacterObject.characterData.character_class ][2] + ".png')";
		spellPlaceHolders.soldier.setAttribute("title", classTalentTreeAssociation[ Component.bugcraft.currentCharacterObject.characterData.character_class ][2] );
		
		// "close" button event
		Application.event.add( spellBookCloseButtonObject, "click", function()
		{
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			Component.bugcraft.initializedPages.spellBook = !Component.bugcraft.initializedPages.spellBook;
			
			spellBookPageObject.className = 'hidden';
		});
		
		//
		// Spellbook fetch & list
		//
		
		Application.websocket.handlers.listSpellBook = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.add( "Error fetching spellbook (" + jsonEl.r + ")" );
			}
			
			Component.bugcraft.pageSpellBookAddBuff = function( _b, showSpellPage )
			{
				var buffContainer = spellBookAssociations[ _b.buff_tree ];
				
				if(
					buffContainer.childNodes.length == 0 ||																						// container holds no pages
					buffContainer.childNodes[ buffContainer.childNodes.length - 1 ].childNodes.length >= 8			// container's last page is full
				)
				{
					// need to create a new buff container page
					
					var buffContainerPage = document.createElement( "div" );
					buffContainerPage.className = showSpellPage ? 'buffsContainerPage' : 'buffsContainerPageHidden';
					
					buffContainer.appendChild( buffContainerPage );
				}
				
				if( Component.bugcraft.ui.buffObjects[ _b.buff_id ] )
				{
					// the buff is already defined and visible
					Component.bugcraft.ui.buffObjects[ _b.buff_id ].addCopy( new Component.bugcraft.ui.buffObject({
																																								buff: _b,
																																								targetArea: buffContainer.childNodes[ buffContainer.childNodes.length - 1 ],	// append to the last page
																																								modelType: 2
																																							}) );
					
					return;
				}
				
				Component.bugcraft.ui.buffObjects[ _b.buff_id ] = new Component.bugcraft.ui.buffObject({
																																								buff: _b,
																																								targetArea: buffContainer.childNodes[ buffContainer.childNodes.length - 1 ],	// append to the last page
																																								modelType: 2
																																							});
			}
			
			for(var i=0;i<jsonEl.b.length;i++)
			{
				Component.bugcraft.pageSpellBookAddBuff( jsonEl.b[ i ] );
			}
			
			_showPage( spellBookAssociations.conqueror, 0 );
			_showPage( spellBookAssociations.champion, 0 );
			_showPage( spellBookAssociations.soldier, 0 );
			
			if( !args.hidden )
			{
				// update buffs considering the target
				Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
			}
		}
		
		// request listing
		Application.websocket.socket.send( '{"c":"listSpellBook"}' );
	}
	
	Component.bugcraft.pageSpellBookAddBuff = function( _buffData, showSpellPage ) { }	// this is redefined after the buffs are listed
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	