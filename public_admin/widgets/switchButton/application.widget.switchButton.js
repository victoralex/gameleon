	
	Application.widget.switchButton = {
		
		widgetName: "switchButton",
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Application.widget.switchButton.create( args[i] );
			}
		},
		
		create: function( args )
		{
			var object = document.getElementById( args.id );
			var objectHiddenInput = document.getElementById( args.id + "_hiddenInput" );
			
			/*
				Widget Events Structure
			*/
			
			var eventsList = [];
			
			this.events =
			{
				add: function( eventName, func )
				{
					if( !eventsList[ eventName ] )
					{
						eventsList[ eventName ] = [];
					}
					
					eventsList[ eventName ][ eventsList[ eventName ].length ] = func;
					
					return true;
				},
				
				handle: function( eventName )
				{
					if( !eventsList[ eventName ] )
					{
						return false;
					}
					
					var eventsLength = eventsList[ eventName ].length;
					
					for(var i=0;i<eventsLength;i++)
					{
//						Application.debug.addRow({text:eventsList[eventName][i]});
						eventsList[ eventName ][ i ]();
					}
					
					return true;
				}
			};
			
			/*
				Functional part
			*/
			
			args.checkedValue = args.checkedValue ? args.checkedValue : '1';
			args.uncheckedValue = args.uncheckedValue ? args.uncheckedValue : '0';
			
			this.check = function()
			{
				object.widgetObject.checked = true;
//				object.checked = true;
				object.className = args.checkClass;
				objectHiddenInput.value = args.checkedValue;
			};
			
			this.uncheck = function()
			{
				object.widgetObject.checked = false;
//				object.checked = false;
				object.className = args.uncheckClass;
				objectHiddenInput.value = args.uncheckedValue;
			};
			
			this.events.add( "click", 	function()
										{
											if( object.widgetObject.checked == true )
											{
												object.widgetObject.uncheck();
											}
											else
											{
												object.widgetObject.check();
											}
										});
			
			/*
				Events association
			*/
			
			Application.event.add(object, "mouseover", 	function(e)
														{
															if(!eventsList["mouseover"])
															{
																return;
															}
															
															var eventsLength = eventsList["mouseover"].length;
															
															for(var i=0;i<eventsLength;i++)
															{
																eventsList["mouseover"][ i ]( e );
															}
														});
			
			Application.event.add(object, "mouseout", 	function(e)
														{
															if(!eventsList["mouseover"])
															{
																return;
															}
															
															var eventsLength = eventsList["mouseout"].length;
															
															for(var i=0;i<eventsLength;i++)
															{
																eventsList["mouseout"][ i ]( e );
															}
														});
			
			Application.event.add(object, "click", 	function(e)
													{
														var eventsLength = eventsList["click"].length;
														
														for(var i=0;i<eventsLength;i++)
														{
															eventsList["click"][ i ]( e );
														}
													});
			
			// Make sure the HTML object links to this object
			object.widgetObject = this;
			
			if( args.isChecked == 'true' )
			{
				this.check();
			}
			else
			{
				this.uncheck();
			}
		}
		
	}
	