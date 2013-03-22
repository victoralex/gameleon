	
	/*
		content JS
	*/
	
	Component.content = {
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.content.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			var formObject = document.getElementById( args.id + "_form" );
			var showObject = Application.util.urlInformation.params.show;
			
			if( showObject && showObject != "list" )
			{
				if( showObject == "add" )
				{
					var formSendLinkObject = document.getElementById( args.id + "_formApplyLink" );
					
					Application.event.add( formSendLinkObject, "click", function()
																		{
																			document.getElementById( args.id + "_formRedirect" ).value = "1";
																			
																			formObject.submit();
																			
																			return false;
																		});	
					
					var formSendLinkObject = document.getElementById( args.id + "_formSendLink" );
					
					Application.event.add( formSendLinkObject, "click", function()
																		{
																			formObject.submit();
																			
																			return false;
																		});
				}
				else if( showObject == "edit" )
				{
					var formSendLinkObject = document.getElementById( args.id + "_formApplyLink" );
					
					Application.event.add( formSendLinkObject, "click", function()
																		{
																			document.getElementById( args.id + "_formRedirect" ).value = "0";
																									
																			formObject.submit();
																			
																			return false;
																		});	
					
					var formSendLinkObject = document.getElementById( args.id + "_formSendLink" );
					
					Application.event.add( formSendLinkObject, "click", function()
																		{
																			formObject.submit();
																			
																			return false;
																		});	
				}
			}
			else
			{
				var switchGlobal = document.getElementById( args.id + "_globalSwitch" );
				
				var _addLinkEvents = function( object )
				{
					Application.event.add( object, "click", function()
															{
																var hrefObject = object.getAttribute("href").toString();
																
																formObject.setAttribute("action", hrefObject.substr( hrefObject.indexOf("#") + 1, hrefObject.length ) );
																
																formObject.submit();
																
																return false;
															});	
				}
				
				var position = 1;
				while(true)
				{
					var linkObject = document.getElementById( args.id + "_link_" + position );
					
					if(!linkObject)
					{
						break;
					}
					
					_addLinkEvents( linkObject );
					
					position++;
				}
				
				var _addFilterEvents = function( object )
				{
					Application.event.add( object, "change", 	function()
																{
																	document.getElementById( args.id + "_form_filters" ).submit();
																	
																	return false;
																});	
				}
				
				var position = 1;
				while(true)
				{
					var formFilterObject = document.getElementById( args.id + "_form_filter_" + position );
					
					if(!formFilterObject)
					{
						break;
					}
					
					_addFilterEvents( formFilterObject );
					
					position++;
				}
				
				switchGlobal.widgetObject.events.add( "click", 	function()
																{
																	var position = 1;
																	
																	while(true)
																	{
																		var switchObject = document.getElementById( args.id + "_switch_" + position );
																		
																		if(!switchObject)
																		{
																			return;
																		}
																		
																		if( switchGlobal.checked )
																		{
																			switchObject.widgetObject.check();
																		}
																		else
																		{
																			switchObject.widgetObject.uncheck();
																		}
																		
																		position++;
																	}
																});
			}
		},
		
		showComponents: function()
		{
			var newURL = '/index.php?';
			
			if(Application.util.urlInformation.params[ "language" ])
			{
				newURL += '&language=' + Application.util.urlInformation.params[ "language" ];
			}
			
			document.location.href = newURL;
		},
		
		showAdd: function()
		{
			var newURL = 'index.php?page=' + Application.util.urlInformation.params[ "page" ] + '&component=content&show=add&parentID=0';
			
			if(Application.util.urlInformation.params[ "language" ])
			{
				newURL += '&language=' + Application.util.urlInformation.params[ "language" ];
			}
			
			document.location.href = newURL;
		},
		
		showList: function()
		{
			var newURL = 'index.php?page=' + Application.util.urlInformation.params[ "page" ] + '&component=content&show=list';
			
			if(Application.util.urlInformation.params[ "language" ])
			{
				newURL += '&language=' + Application.util.urlInformation.params[ "language" ];
			}
			
			document.location.href = newURL;
		}
		
	};