	
	/*
		payment JS
	*/
	
	Component.payment = {
		
		componentName: "payment",
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.payment.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			var getMouseXY = function(e)
			{
				var tempX = 0;
				var tempY = 0;
				
				if( !e.pageX )
				{ // grab the x-y pos.s if browser is IE
					tempX = event.clientX + document.body.scrollLeft;
					tempY = event.clientY + document.body.scrollTop;
				}
				else
				{  // grab the x-y pos.s if browser is NS
					tempX = e.pageX;
					tempY = e.pageY;
				}  

				if (tempX < 0)
				{
					tempX = 0;
				}
				if (tempY < 0)
				{
					tempY = 0;
				}  

				return { x: tempX, y: tempY };
			}
		
		
			var idCount = 0,
				addNPCFlag = false,
				npcs = [];
			
			var mainWorkZone = document.getElementById( args.id + "_mainWorkZone" ),
				behaviourEditContainer = document.getElementById( args.id + "_behaviourEditContainer" ),
				behaviourEditCanvas = document.getElementById( args.id + "_behaviourEditCanvas" ),
				ctx = behaviourEditCanvas.getContext("2d");
			
			var loadBehaviour = function( id )
			{
				ctx.clearRect( 0, 0, behaviourEditCanvas.width, behaviourEditCanvas.height );
				
				//retrieve npc object by id
				var selectedNPC;
				for( var i = 0; i < npcs.length; i++ )
				{
					if( npcs[i] == null || npcs[i].id != id )
					{
						continue;
					}
					
					selectedNPC = npcs[i];
					break;
				}
				
				selectedNPC.drawElement();
				
				behaviourEditContainer.className = "behaviourEditContainer";
			}
			
			var npc = function( _args )
			{
				var self = this;
				this.id = idCount++;
				this.events = [];
				this.input = [];
				this.posX = _args.posX;
				this.posY = _args.posY;
				
				var newdiv = document.createElement("div");
				newdiv.className = "npc";
				newdiv.style.left = _args.posX + "px";
				newdiv.style.top = _args.posY + "px";
				Application.event.add( newdiv,
										"click",
										function( e )
										{
											if( addNPCFlag )
											{
												return;
											}
											
											loadBehaviour( self.id );
										},
										false
									);
				mainWorkZone.appendChild( newdiv );
				
				addNPCFlag = false;
				
				this.drawElement = function()
				{
					var _height = Math.max( 1, Math.max( self.events.length, self.input.length ) ) * (30 + 5);
					var _width = 30;
					
					//draw element body
					ctx.fillStyle = "#FF0000";
					ctx.fillRect( self.posX + 30, self.posY,_width, _height );
					
					//draw element output nodes
					ctx.fillStyle = "#00ff00";
					for( var i = 0; i < self.events.length; i++ )
					{
						ctx.fillRect( self.posX + 30 + _width, i * (30 + 5), 30, 30 );
					}
					
					//draw element input nodes
					ctx.fillStyle = "#0000ff";
					for( var i = 0; i < self.events.length; i++ )
					{
						ctx.fillRect( self.posX, i * (30 + 5), 30, 30 );
					}
				}
			}
			
			Application.event.add( document.getElementById( args.id + "_addNPCButton" ), 
									"click", 
									function()
									{
										addNPCFlag = true;
									},
									false
								);
								
			Application.event.add( mainWorkZone, 
									"click", 
									function( e )
									{
										if( !addNPCFlag )
										{
											return;
										}
										
										var	mousePos = getMouseXY( e );
										
										npcs.push( new npc({
															posX: mousePos.x - mainWorkZone.offsetLeft,
															posY: mousePos.y - mainWorkZone.offsetTop
														})
												);
									},
									false
								);
			
			Application.event.add( document.getElementById( args.id + "_behaviourSaveButton" ), 
									"click", 
									function()
									{
										addNPCFlag = true;
									},
									false
								);
			Application.event.add( document.getElementById( args.id + "_behaviourCloseButton" ), 
									"click", 
									function()
									{
										behaviourEditContainer.className = "closed";
									},
									false
								);
		/*
			FB.init({
						appId: "115106231869046", 
						status: true, 
						cookie: true
					});

			FB.Canvas.getPageInfo( function()
									{
										document.getElementById( args.id + "_facebookContainer" ).style.display = "block";
									});
			
			var userId = /userID=[0-9]+/.exec( document.location.href ).toString().split('=')[1];
			var choice = 0;
			
			var sendOrder = function( itemId )
			{
				Application.connect.ajaxComponent({
													component: "payment",
													event: "addOrder",
													vars:
													{
														itemId: itemId,
														userId: userId
													},
													sendErrorReport: false,
													successFunction: 	function( jsonEl )
																				{
																					if(jsonEl.header.result != 200 && jsonEl.header.result != 201)
																					{
																						return;
																					}
																					
																					console.debug(jsonEl);
																					document.getElementById( args.id + "_itemNameInput" ).setAttribute( "value", (jsonEl.content["@attributes"].itemId * 100) + " amber" );
																					document.getElementById( args.id + "_amountInput" ).setAttribute( "value", (jsonEl.content["@attributes"].itemId * 5) );
																					document.getElementById( args.id + "_itemNumberInput" ).setAttribute( "value", jsonEl.content["@attributes"].itemId );
																					document.getElementById( args.id + "_orderIdInput" ).setAttribute( "value", jsonEl.content["@attributes"].orderId );
																					
																					document.getElementById( args.id + "_paypalForm").submit();
																				}
												});
			}
			
			var facebookPlaceOrder = function()
			{
				// Assign an ID - usually points to a db record 
				// found in your callback
				var order_info = document.getElementById("item_id").value;

				// calling the API ...
				var obj = {
							method: "pay",
							order_info: order_info,
							purchase_type: "item"
						};

				FB.ui(obj, callback);
			}

			var callback = function(data)
			{
				if (data["order_id"])
				{
					// Success, we received the order_id. The order states can be
					// settled or cancelled at this point.
					console.debug(data)
					return true;
				}
				else
				{
					//handle errors here
					return false;
				}
			}
			
			var buyQuantities = document.getElementById(args.id + "_buyQuantities");
			for( var i = 1; i < 4; i++ )
			{
				var newButton = document.createElement("input");
				newButton.setAttribute("type", "button");
				newButton.setAttribute("value", "Buy " + (i * 100) + " amber for " + (i * 5) + "$" );
				newButton.setAttribute("name", i );
				Application.event.add( newButton, "click", function(e)
															{
																sendOrder(e.target.getAttribute("name"));
															});
				buyQuantities.appendChild(newButton);
			}
			
			Application.event.add( document.getElementById( args.id + "_facebookBuyButton" ), "click", function()
																										{
																											facebookPlaceOrder();
																										});
		*/
		}
		
	};