	
	Application.debug = {
		
		windowVisible: false,
		windowObject: null,
		windowContentObject: null,
		windowContentCommandLineObject: null,
		windowCommandLineContainerObject: null,
		
		TYPE_INFO: "info",
		TYPE_WARNING: "warning",
		TYPE_ERROR: "error",
		
		init: function( args )
		{
			var _wID = document.body.getAttribute("globalID");
			
			var debugContainer = document.createElement("div");
			debugContainer.className = "ascentDebugWindowScreen hidden";
			debugContainer.innerHTML = '<div class="content" id="' + _wID + '_content"><![CDATA[ ]]></div><div class="commandLineContainer" id="' + _wID + '_commandLineContainer"><input class="commandLine" type="text" name="commandText" id="' + _wID + '_commandLine" /></div>';
			document.body.appendChild( debugContainer );
			
			/*
			Application.util.xslt.transform.fromXML({
								xmlString: '<component:debugWindow xmlns:component="http://component.emotionconcept.ro" />',
								xslFile: "/components/appJS/resources/public/debug.xsl",
								successFunction: function( newEl )
								{
								*/
									Application.debug.windowObject = debugContainer;
									Application.debug.windowContentObject = document.getElementById( _wID + "_content" );
									Application.debug.windowContentCommandLineObject = document.getElementById( _wID + "_commandLine" );
									Application.debug.windowCommandLineContainerObject = document.getElementById( _wID + "_commandLineContainer" );
									
									if( Application.configuration.debug.catchJSErrors == "true" )
									{
										// Set the production error reporting
										window.onerror = 	function( err, url, line )
																	{
																		Application.debug.addError( err + " on line " + line + "\n" + url + "\n" + Application.util.browserInformation.OS + " running " + Application.util.browserInformation.browser + " v" + Application.util.browserInformation.version );
																		
																		return true;
																	}
									}
									
									if( args.afterInit )
									{
										args.afterInit();
									}
									
									/*
									Application.connect.ajaxService({
																	port: 7000,
																	vars: {
																		requestVar1: 1,
																		requestVar2: 2
																	},
																	successFunction: function( domEl )
																							{
																								Application.debug.add(Application.util.serialize.xml(domEl.xml));
																							}
																});
									*/
									
									Application.debug.windowContentCommandLineObject.onkeyup = function( e )
									{
										switch( e.keyCode )
										{
											case 13:
												
												// Enter
												
												try
												{
													var commandLineObject = Application.debug.windowContentCommandLineObject;
													
													eval( commandLineObject.value );
													
													Application.debug.add( "Run: " + commandLineObject.value );
													
													commandLineObject.value = "";
												}
												catch( errorObject )
												{
													Application.debug.addError( errorObject.message );
												}
												
												return false;
												
											break;
											case 192:
											case 27:
												
												// Escape or "`"
												
												Application.debug.hide();
												
												// make sure global keybindings don't trigger
												e.cancelBubble = true;
												if( e.stopPropagation )
												{
													e.stopPropagation();
												}
												
												return false;
												
											break;
										}
										
										// make sure global keybindings don't trigger
										e.cancelBubble = true;
										if( e.stopPropagation )
										{
											e.stopPropagation();
										}
									}
									
									Application.effects.drag.attach({
																		object: Application.debug.windowObject,
																		saveName: "debugWindow"
																	});
									
									// Quake-style console
									Application.event.add(
														window,
														"keyup",
														function( e )
														{
															if( e.keyCode != 192 )
															{
																return;
															}
															
															// "`" key
															
															Application.debug.show( true );
														}
													);
								/*
								}
							});
							*/
		},
		
		hide: function()
		{
			Application.debug.windowObject.className = 'ascentDebugWindowScreen hidden';
			
			Application.debug.windowVisible = false;
			
			// lose the focus on the text field
			Application.debug.windowContentCommandLineObject.blur();
			
			// focus on the body to ensure global events (window.keyup, etc) continue to work
			document.body.focus();
			
			return true;
		},
		
		show: function( focus )
		{
			Application.debug.windowObject.className = 'ascentDebugWindowScreen visible';
//			Application.debug.windowObject.style.top = ( ( document.documentElement.clientHeight - Application.debug.windowObject.offsetHeight ) / 2 ) + "px";
			
			/*
			Application.sound.play({
									url: '/components/appJS/resources/public/mp3/debug_show.mp3'
								});
			*/
			
			if( focus )
			{
				Application.debug.windowContentCommandLineObject.focus();
			}
			
			Application.debug.windowVisible = true;
			
			return true;
		},
		
		clear: function()
		{
			Application.debug.windowContentObject.innerHTML = '';
		},
		
		addError: function( text, args )
		{
			if( !args )
			{
				args = {};
			}
			
			args.sendErrorReport = ( typeof args.sendErrorReport == "undefined" ) ? true : args.sendErrorReport;
			
			if(Application.debug.windowVisible == false)
			{
				Application.debug.show();
			}
			
			var d = new Date();
			
			var textContainer = document.createElement( "div" );
			textContainer.className = 'row';
			
			textContainer.innerHTML = '<span class="date">' + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds() + '</span><span class="error">' + ( text ? text.toString().replace(/\n/g, "<br/>") : text ) + '</span>';
			
			Application.debug.windowContentObject.appendChild(
																			textContainer
																		);
			
			if( Application.configuration.debug.logToServer == "true" && args.sendErrorReport )
			{
				args.component = ( typeof args.component == "undefined" ) ? "blankComponent" : args.component;
				args.title = ( typeof args.title == "undefined" ) ? "" : args.type;
				
				Application.connect.ajaxComponent({
											component: "serverError",
											event: "addDebugData",
											vars:
											{
												environmentBrowser: Application.util.browserInformation.browser,
												environmentVersion: Application.util.browserInformation.version,
												environmentOS: Application.util.browserInformation.OS,
												
												debugComponent: args.component,
												type: Application.debug.TYPE_ERROR,
												area: Application.configuration.areas['@attributes'].current.toString().substring( 7 ),
												
												description: text,
												title: args.title
											},
											sendErrorReport: false,
											successFunction: 	function( domEl )
																		{
																			var result = Application.util.xslt.xPath.search( domEl, "//component/header/result" );
																			
																			if( result[0].childNodes[0].nodeValue != "201" )
																			{
																				Application.debug.addError( "There was an error while sending the debug data to the server. The returned code was " + result[0].childNodes[0].nodeValue, { sendErrorReport: false } );
																			}
																		}
										});
			}
			
			// Scroll down
			Application.debug.windowContentObject.scrollTop = Application.debug.windowContentObject.scrollHeight;
		},
		
		str: function( text )
		{
			this.add( JSON.stringify( text ) );
		},
		
		add: function( text )
		{
			/*
			if(Application.debug.windowVisible == false)
			{
				Application.debug.show();
			}
			*/
			
			var d = new Date();
			
			var textContainer = document.createElement( "div" );
			textContainer.className = 'row';
			
			textContainer.innerHTML = '<span class="date">' + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds() + '</span>' + text;
			
			Application.debug.windowContentObject.appendChild(
																		textContainer
																	);
			
			// Scroll down
			Application.debug.windowContentObject.scrollTop = Application.debug.windowContentObject.scrollHeight;
		}
		
	}
	