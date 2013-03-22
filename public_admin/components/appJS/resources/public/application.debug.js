	
	Application.debug = {
		
		windowVisible: false,
		windowObject: null,
		windowContentObject: null,
		
		TYPE_INFO: "info",
		TYPE_WARNING: "warning",
		TYPE_ERROR: "error",
		
		init: function( args )
		{
			Application.util.xslt.transform.fromXML({
															xmlString: '<component:debugWindow xmlns:component="http://component.emotionconcept.ro" />',
															xslFile: "/components/appJS/resources/public/debug.xsl",
															successFunction: 	function( newEl )
																						{
																							Application.debug.windowObject = newEl;
																							Application.debug.windowContentObject = document.getElementById( newEl.getAttribute("id") + "_content" );
																							
																							if( Application.configuration.debug.catchJSErrors == "true" )
																							{
																								// Set the production error reporting
																								window.onerror = 	function( err, url, line )
																															{
																																Application.debug.addError( err + " on line " + line + "\n" + url + "\n" + Application.util.browserInformation.OS + " running " + Application.util.browserInformation.browser + " v" + Application.util.browserInformation.version );
																																
																																return true;
																															}
																							}
																							
																							Application.debug.add( "Debug Initialized" );
//																							Application.debug.addError( "Debug Initialized" );
																							
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
																							
																							Application.effects.drag.attach({
																																object: Application.debug.windowObject,
																																saveName: "debugWindow"
																															});
																						}
														});
		},
		
		hide: function()
		{
			Application.debug.windowObject.className = 'debugWindowComponent hidden';
			
			Application.debug.windowVisible = false;
		},
		
		show: function()
		{
			Application.debug.windowObject.className = 'debugWindowComponent visible';
			Application.debug.windowObject.style.top = ( ( document.documentElement.clientHeight - Application.debug.windowObject.offsetHeight ) / 2 ) + "px";
			
			Application.debug.windowVisible = true;
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
			
			textContainer.innerHTML = '<span class="date">' + d.getMinutes() + ":" + d.getSeconds() + "." + d.getMilliseconds() + '</span><span class="error">' + text.replace(/\n/g, "<br/>") + '</span>';
			
			Application.debug.windowObject.appendChild(
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
			Application.debug.windowObject.scrollTop = Application.debug.windowObject.scrollHeight;
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
			
			Application.debug.windowObject.appendChild(
															textContainer
														);
			
			// Scroll down
			Application.debug.windowObject.scrollTop = Application.debug.windowObject.scrollHeight;
		}
		
	}
	