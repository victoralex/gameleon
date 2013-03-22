
	/*
		Market page
	*/
	
	Component.bugcraft.pageTalentTree = function( args )
	{
		var talentTreePageObject = document.getElementById( args.id + '_talentTreePage' );
		
		if( typeof Component.bugcraft.initializedPages.talentTree != "undefined" )
		{
			Component.bugcraft.initializedPages.talentTree = !Component.bugcraft.initializedPages.talentTree;
			talentTreePageObject.className = Component.bugcraft.initializedPages.talentTree ? "talentTree" : "hidden";
			
			if( !Component.bugcraft.initializedPages.talentTree )
			{
				Component.bugcraft.sound.ui.playEvent( "window", "bookOpen" );
				
				Component.bugcraft.scaleWindow( talentTreePageObject );
			}
			else
			{
				Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			}
			
			return;
		}
		
		Component.bugcraft.initializedPages.talentTree = true;
		talentTreePageObject.className = "talentTree";
		
		//
		// Talent Tree listing
		//
		
		var treeBuffs = {}, popupObject = null,
			talentTreeCloseButtonObject = document.getElementById( args.id + "_talentTreeCloseButton" ),
			talentTreePointsSpentObject = document.getElementById( args.id + "_talentTreePointsSpent" ),
			talentTreePointsAvailableObject = document.getElementById( args.id + "_talentTreePointsAvailable" ),
			talentTreeLeftTreeTitleObject = document.getElementById( args.id + "_talentTreeLeftTreeTitle" ),
			talentTreeRightTreeTitleObject = document.getElementById( args.id + "_talentTreeRightTreeTitle" ),
			talentTreeLeftTreeObject = document.getElementById( args.id + "_talentTreeLeftTree" ),
			talentTreeRightTreeObject = document.getElementById( args.id + "_talentTreeRightTree" ),
			talentTreeLeftTreeBuffsObject = document.getElementById( args.id + "_talentTreeLeftTreeBuffs" ),
			talentTreeRightTreeBuffsObject = document.getElementById( args.id + "_talentTreeRightTreeBuffs" );
		
		// "close" button event
		Application.event.add( talentTreeCloseButtonObject, "click",	function()
		{
			if( popupObject )
			{
				popupObject.remove();
				popupObject = null;
			}
			
			Component.bugcraft.sound.ui.playEvent( "window", "buttonClose" );
			
			Component.bugcraft.initializedPages.talentTree = !Component.bugcraft.initializedPages.talentTree;
			
			talentTreePageObject.className = 'hidden';
		});
		
		switch( Component.bugcraft.currentCharacterObject.characterData.character_class )
		{
			case "soldier":
				
				talentTreeLeftTreeTitleObject.innerHTML = "champion";
				talentTreeRightTreeTitleObject.innerHTML = "conqueror";
				
				treeBuffs = { champion: {}, conqueror: {} };
				
			break;
			case "scout":
				
				talentTreeLeftTreeTitleObject.innerHTML = "guide";
				talentTreeRightTreeTitleObject.innerHTML = "stalker";
				
				treeBuffs = { guide: {}, stalker: {} };
				
			break;
			case "noble":
				
				talentTreeLeftTreeTitleObject.innerHTML = "sage";
				talentTreeRightTreeTitleObject.innerHTML = "enzymage";
				
				treeBuffs = { sage: {}, enzymage: {} };
				
			break;
		}
		
		Application.websocket.handlers.talentTreeList = function( jsonEl, ws )
		{
			if( jsonEl.r != 200 )
			{
				Application.debug.addError( "Error getting talentTreeList response " + jsonEl.r );
				
				return;
			}
			
			var pointsTotal = jsonEl.pt, pointsSpent = jsonEl.ps;
			
			Application.websocket.handlers.talentTreePurchaseBuff = function( jsonEl, ws )
			{
				if( jsonEl.r != 200 )
				{
					Application.debug.addError( "Error getting talentTreePurchaseBuff response " + jsonEl.r );
					
					return;
				}
				
				if( popupObject )
				{
					popupObject.remove();
					popupObject = null;
				}
				
				var _ct = treeBuffs[ jsonEl.bd.buff_tree ][ jsonEl.bd.buff_points ], _nt = treeBuffs[ jsonEl.bd.buff_tree ][ jsonEl.bd.buff_points + 1 ];
				pointsTotal = jsonEl.pt, pointsSpent = jsonEl.ps;	// update the globals
				
				// perform actions on the tree, ensuring its ongoing functionality
				_ct._markPurchased();
				_ct.cs_id = jsonEl.cs_id;
				_ct.updateTalentWheel();
				
				// add buff to the spellbook
				Component.bugcraft.pageSpellBookAddBuff( jsonEl.bd, true );
				Component.bugcraft.ui.updateBuffsStatusConsideringTarget();
				
				if( pointsSpent >= pointsTotal )
				{
					for(var i in treeBuffs )
					{
						for(var j in treeBuffs[i])
						{
							if( treeBuffs[i][j] == _ct )
							{
								// skip the current buff
								
								continue;
							}
							
							treeBuffs[i][j]._mouseOutFunction();
						}
					}
				}
				else if( _nt )
				{
					_nt._markEnabled();
				}
				
				talentTreePointsSpentObject.innerHTML = pointsSpent;
				talentTreePointsAvailableObject.innerHTML = pointsTotal - pointsSpent;
			}
			
			// buff icon creator
			var _createBuffArea = function( _b )
			{
				var self = this, isOnLeft = false;
				
				this.cs_id = _b.cs_id;
				
				this._markDisabled = function()
				{
					treeBuffObject.className = "treeBuffObject";
					treeBuffObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_large/disabled_" + _b.buff_id + ".png')";
					hoverObject.innerHTML = "<div class='tooltipTop'></div><div class='tooltipTitle'>" + _b.buff_name + "</div><div class='tooltipDescription'>" + _b.buff_description + "<div class='purchaseStatus'>You don't have enough points to purchase this talent.</div></div><div class='tooltipBottom'></div>";
					
					treeBuffObject.onclick = function()
					{
						
					}
				}
				
				this._markGrayedOut = function()
				{
					treeBuffObject.className = "treeBuffObject";
					treeBuffObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_large/darker_" + _b.buff_id + ".png')";
					hoverObject.innerHTML = "<div class='tooltipTop'></div><div class='tooltipTitle'>" + _b.buff_name + "</div><div class='tooltipDescription'>" + _b.buff_description + "<div class='purchaseStatus'>You must learn all previous talents, in this tree, before you can invest a point in this ability.</div></div><div class='tooltipBottom'></div>";
					
					treeBuffObject.onclick = function()
					{
						
					}
				}
				
				this._markPurchased = function()
				{
					treeBuffObject.className = "treeBuffObjectSelected";
					treeBuffObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_large/" + _b.buff_id + ".png')";
					hoverObject.innerHTML = "<div class='tooltipTop'></div><div class='tooltipTitle'>" + _b.buff_name + "</div><div class='tooltipDescription'>" + _b.buff_description + "<div class='purchaseStatus'>You already know this talent.</div></div><div class='tooltipBottom'></div>";
					
					treeBuffObject.onclick = function()
					{
						
					}
				}
				
				this._markEnabled = function()
				{
					treeBuffObject.className = "treeBuffObject";
					treeBuffObject.style.backgroundImage = "url('/components/bugcraft/resources/public/img/abilities_large/" + _b.buff_id + ".png')";
					hoverObject.innerHTML = "<div class='tooltipTop'></div><div class='tooltipTitle'>" + _b.buff_name + "</div><div class='tooltipDescription'>" + _b.buff_description + "<div class='purchaseStatus'>You can learn this ability right away.</div></div><div class='tooltipBottom'></div>";
					
					treeBuffObject.onclick = function()
					{
						if( popupObject )
						{
							popupObject.remove();
							popupObject = null;
						}
						
						popupObject = new Component.bugcraft.notificationPopup.yesNoPopup({
																							id: args.id,
																							name: "talentBuffPurchaseConfirm",
																							questionText: 'Do you want to learn "' + _b.buff_name + '" ?',
																							acceptText: "Yes, add to spellbook",
																							denyText: "No, choose another",
																							onAccept: function()
																							{
																								Application.websocket.socket.send( '{"c":"talentTreePurchaseBuff","tid":' + _b.buff_id + '}' );
																							},
																							onDeny: function()
																							{
																								popupObject.hide();
																							}
																						});
					}
				}
				
				this._mouseOutFunction = function( e )
				{
					if( self.cs_id != null )
					{
						// already purchased
						
						self._markPurchased();
					}
					else if( pointsTotal - pointsSpent > 0 && ( _b.buff_points == 1 || ( _b.buff_points > 1 &&  treeBuffs[ _b.buff_tree ][ _b.buff_points - 1 ].cs_id != null ) ) )
					{
						// parent purchased or i am the 1st, and i am not purchased. available for purchase
						
						self._markEnabled();
					}
					else
					{
						// parent not purchased and i am not purchased. not available for purchase
						
						self._markGrayedOut();
					}
					
					hoverObject.className = "hidden";
				};
				
				var treeBuffObject = document.createElement("div");
				
				var buffIconObject = document.createElement("div");
				buffIconObject.className = "buffIcon";
				
				var hoverObject = document.createElement("div");
				hoverObject.className = "hidden";
				
				treeBuffObject.appendChild( hoverObject );
				treeBuffObject.appendChild( buffIconObject );
				
				hoverObject.onmouseout = self._mouseOutFunction;
				treeBuffObject.onmouseout = self._mouseOutFunction;
				
				treeBuffObject.onmouseover = function()
				{
					hoverObject.className = "tooltip";
				}
				
				// decide on which side to show the buff
				if( _b.buff_tree == "sage" || _b.buff_tree == "champion" || _b.buff_tree == "guide" )
				{
					this.updateTalentWheel = function()
					{
						if( self.cs_id == null )
						{
							return false;
						}
						
						talentTreeLeftTreeBuffsObject.style.backgroundImage = "url('/appSpecific/img/talentTree/octogon/octogon_talentpage_filling" + ( _b.buff_points - 1 ) + "_left.png')";
						
						return true;
					}
					
					document.getElementById( args.id + '_talentTreeLeftBuff' + _b.buff_points ).appendChild( treeBuffObject );
				}
				else
				{
					this.updateTalentWheel = function()
					{
						if( self.cs_id == null )
						{
							return false;
						}
						
						talentTreeRightTreeBuffsObject.style.backgroundImage = "url('/appSpecific/img/talentTree/octogon/octogon_talentpage_filling" + ( _b.buff_points - 1 ) + "_right.png')";
						
						return true;
					}
					
					document.getElementById( args.id + '_talentTreeRightBuff' + _b.buff_points ).appendChild( treeBuffObject );
				}
				
				this.updateTalentWheel();
				this._mouseOutFunction();
			}
			
			// go through the list
			for(var i=0;i<jsonEl.b.length;i++)
			{
				var _b = jsonEl.b[ i ];
				
				treeBuffs[ _b.buff_tree ][ _b.buff_points ] = new _createBuffArea( _b );
			}
			
			talentTreePointsSpentObject.innerHTML = pointsSpent;
			talentTreePointsAvailableObject.innerHTML = pointsTotal - pointsSpent;
		}
		
		//
		// Initialization
		//
		
		Component.bugcraft.scaleWindow( talentTreePageObject );
		
		// Enter the LFG by default
		Application.websocket.socket.send( '{"c":"talentTreeList"}' );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	