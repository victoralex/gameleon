"use strict";



/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/blankComponent/resources/public/component.blankComponent.js
*/

	
	/*
		blankComponent JS
	*/
	
	Component.blankComponent = {
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.blankComponent.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			
		}
		
	};















/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/footerCopyright/resources/public/component.footerCopyright.js
*/

	
	/*
		footerCopyright JS
	*/
	
	Component.footerCopyright = {
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.footerCopyright.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			
		}
		
	};











/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/componentsListFront/resources/public/component.componentsListFront.js
*/

	
	/*
		componentsListFront main JS
	*/
	
	Components.componentListFront = {
		
		show: function( args )
		{
			alert( args );
		}
		
	}





/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/appJS/resources/public/application.connect.js
*/

	
	Application.connect = {
		
		ajax: null,
		component: null,
		validateXML: null,
		
		REQUEST_POST: "POST",
		REQUEST_GET: "GET",
		REQUEST_DELETE: "DELETE",
		REQUEST_PUT: "PUT",
		
		RESULT_XML: 1,
		RESULT_JSON: 2,
		RESULT_AUTO: 99,
		
		timeout: 30000,	//timeout in 30 seconds
		sendErrorReport: true,
		
		init: function()
		{
			// Init AjaxConn
			if(Application.util.browserInformation.browser == "Explorer")
			{
				if(!window.ActiveXObject)
				{
					Application.debug.addError(
													"AJAX: This browser does not support ActiveX controls calls",
													{
														sendErrorReport: false
													}
												);
					
					return false;
				}
				
				Application.connect.ajax = this.ajaxConnIE;
				Application.connect.validateXML = this.validateXMLIE;
			}
			else
			{
				if(!window.XMLHttpRequest)
				{
					Application.debug.addError(
													"AJAX: This browser does not support AJAX calls",
													{
														sendErrorReport: false
													}
												);
					
					return false;
				}
				
				Application.connect.ajax = this.ajaxConnFF;
				Application.connect.validateXML = this.validateXMLFF;
			}
		},
		
		validateXMLIE: function( contentXMLObject, sendErrorRepport )
		{
			if( !contentXMLObject )
			{
				return false;
			}
			
			var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = "false";
			xmlDoc.loadXML( contentXMLObject.xml );
			
			if( xmlDoc.parseError.errorCode !=0 )
			{
				Application.debug.addError(
											"AJAX: There was a problem validating the XML data:\nError Code: " + xmlDoc.parseError.errorCode + "\nReason: " + xmlDoc.parseError.reason + "Line: " + xmlDoc.parseError.line,
											{
												sendErrorReport: sendErrorRepport
											}
										);
				
				return false;
			}
			
			return true;
		},
		
		validateXMLFF: function( contentXMLObject, sendErrorRepport )
		{
			var serializeResult = Application.util.serialize.xml( contentXMLObject );
			
			if( !serializeResult )
			{
				return false;
			}
			
			var xmlDoc = (new DOMParser()).parseFromString( serializeResult, "text/xml" );
			
			if( xmlDoc.documentElement.nodeName == "parsererror" )
			{
				return false;
			}
			
			return true;
		},
		
		ajaxComponent: function( args )
		{
			if(
				!args.component ||
				!args.event
			)
			{
				return false;
			}
			
			args.requestType = Application.connect.REQUEST_POST;
			args.postVars = args.vars;
			args.url = "/component.php";
			args.vars = {
				component: args.component,
				event: args.event,
				language: ( typeof args.language == "undefined" ) ? null : args.language
			};
			
			Application.connect.ajax( args );
		},
		
		ajaxService: function( args )
		{
			if(
				!args.port
			)
			{
				return false;
			}
			
			connectArgs = {};
			
			connectArgs.successFunction = args.successFunction;
			connectArgs.url = document.location.protocol + "//" + document.location.hostname + ":" + args.port + "/";
			connectArgs.requestType = Application.connect.REQUEST_GET;
			connectArgs.vars = args.vars
			
			Application.connect.ajax( connectArgs );
		},
		
		/*
			--------
			AjaxConn
			--------
		*/
		
		/*
			Firefox, Opera, Safari, Netscape
		*/
		
		ajaxConnFF: function(args)
		{
			if(!args.url)
			{
				return false;
			}
			
			var variables = [];
			var headers = [];
			var xmlObj = null;
			
			if(!args.vars)
			{
				args.vars = [];
			}
			
			if(!args.headers)
			{
				args.headers = [];
			}
			
			try
			{
				var xmlObj = new XMLHttpRequest();
			}
			catch( e )
			{
				Application.debug.addError( 
										"AJAX: An error has occured while creating the XMLHTTP object:\nErrorName: " + e.name + "\nErrorMessage: " + e.message,
										{
											sendErrorReport: false
										}
									);
				
				return false;
			}
			
			this.cancel =	function()
								{
									xmlObj.abort();
								}
			
			this.addHeader = 	function( headerName, headerValue )
										{
											args.headers[ headerName ] = headerValue;
										};
			
			this.addVariable =	function( variableName, variableValue )
										{
											args.vars[ variableName ] = variableValue;
										};
			
			this.execute = 	function()
									{
										args.username = args.username ? args.username : null;
										args.password = args.password ? args.password : null;
										args.requestType = (typeof args.requestType == "undefined" ) ? Application.connect.REQUEST_GET : args.requestType;
										args.async = (typeof args.async == "undefined") ? true : args.async;
										args.resultType = (typeof args.resultType == "undefined") ? Application.connect.RESULT_AUTO : args.resultType;
										args.timeout = (typeof args.timeout == "undefined") ? Application.connect.timeout : args.timeout;
										args.sendErrorReport = (typeof args.sendErrorReport == "undefined") ? Application.connect.sendErrorReport : args.sendErrorReport;
										
										xmlObj.onerror = function( e ) { };
										xmlObj.onprogress = function( e ) { };
										
										args.onProgress = args.onProgress ? args.onProgress:	function( domEl ) { };
										
										args.successFunction = args.successFunction ? args.successFunction:	function()
																																			{
																																				Application.debug.add( "AJAX: URL:" + args.url + "\nStatus: " + xmlObj.status + "\nStatusText: " + xmlObj.statusText + "\nReturn value: " + domEl );
																																			};
										
										args.onError = args.onError ? args.onError :	function()
																											{
																												Application.debug.addError(
																																			"AJAX: There was a problem retrieving the XML data:\nServer: " + args.url + "\nServer status: " + xmlObj.status + "\nServer message: " + xmlObj.statusText,
																																			{
																																				sendErrorReport: args.sendErrorReport
																																			}
																																		);
																											}
										
										//
										//	Generate Args
										//
										
										var _urlArgs = "";
										
										var _recursiveVars = function( prefix, arg )
																		{
																			if( typeof arg != "object" )
																			{
																				_urlArgs += prefix + '[]=' + encodeURI( arg );
																				
																				return;
																			}
																			
																			for( var i in arg )
																			{
																				if( typeof arg[i] == "function" )
																				{
																					continue;
																				}
																				
																				if( /^[0-9]+$/.test( i ) )
																				{
																					_recursiveVars( prefix, arg[i] );
																				}
																				else
																				{
																					_recursiveVars( prefix + "[" + i + "]", arg[i] );
																				}
																			}
																		}
										
										for(var i in args.vars)
										{
											if( typeof args.vars[i] == "function" )
											{
												continue;
											}
											
											if( typeof args.vars[i] == "object" )
											{
												_recursiveVars( "&" + i, args.vars[i] );
											}
											else
											{
												_urlArgs = _urlArgs + '&' + (i) + '=' + encodeURI(args.vars[i]);
											}
										}
										
										//
										//	Send request
										//
										
										try
										{
											xmlObj.onreadystatechange = function()
																						{
																							switch( xmlObj.readyState )
																							{
																								case 0:
																								case 1:
																								case 2:
																								case 3:
																									
	//																									args.onProgress( xmlObj );
																									
																								break;
																								case 4:
																									
																									clearTimeout( _timeoutPointer );
																									
																									if (xmlObj.status != 200)
																									{
																										args.onError(xmlObj);
																										
																										return;
																									}
																									
																									if( args.resultType == Application.connect.RESULT_AUTO )
																									{
																										// Automatic result requested
																										
																										switch( xmlObj.getResponseHeader('Content-type') )
																										{
																											case "application/xml":
																												
																												args.resultType = Application.connect.RESULT_XML;
																												
																											break;
																											case "application/json":
																												
																												args.resultType = Application.connect.RESULT_JSON;
																												
																											break;
																											default:
																												
																												args.resultType = Application.connect.RESULT_XML;
																										}
																									}
																									
																									switch( args.resultType )
																									{
																										case Application.connect.RESULT_XML:
																											
																											if( !Application.connect.validateXML( xmlObj.responseXML, args.sendErrorReport ) )
																											{
																												Application.debug.addError(
																																			"AJAX: Expected XML response but got invalid result on " + args.url + ". Response was: " + xmlObj.responseText,
																																			{
																																				sendErrorReport: args.sendErrorReport
																																			}
																																		);
																												
																												return;
																											}
																										
																											args.successFunction(
																														xmlObj.responseXML,
																														xmlObj.responseText
																													);
																											
																										break;
																										case Application.connect.RESULT_JSON:
																											
																											var interpretationResult = JSON.parse( xmlObj.responseText );
																											if( !interpretationResult )
																											{
																												Application.debug.addError(
																																			"AJAX: Expected JSON response but got invalid result on " + args.url + ". Response was: " + xmlObj.responseText,
																																			{
																																				sendErrorReport: args.sendErrorReport
																																			}
																																		);
																												
																												return;
																											}
																											
																											args.successFunction(
																														interpretationResult,
																														xmlObj.responseText
																													);
																											
																										break;
																										default:
																											
																											Application.debug.addError(
																																	"AJAX: invalid args.resultType: " + args.resultType,
																																	{
																																		sendErrorReport: args.sendErrorReport
																																	}
																																);
																									}
																									
																								break;
																								default:
																									
																									Application.debug.addError(
																																	"AJAX: Unforseen readyState encountered: " + xmlObj.readyState,
																																	{
																																		sendErrorReport: args.sendErrorReport
																																	}
																																);
																							}
																						};
											
											switch(args.requestType)
											{
												case Application.connect.REQUEST_GET:
													
													args.url += _urlArgs.replace(/&/, '?');
													
													var sendArguments = null;
													
												break;
												case Application.connect.REQUEST_POST:
													
													args.url += _urlArgs.replace(/&/, '?');
													
													if( args.postVars )
													{
														_urlArgs = "";
														
														for(var i in args.postVars)
														{
															if( typeof args.postVars[i] == "function" )
															{
																continue;
															}
															
															if( typeof args.postVars[i] == "object" )
															{
																_recursiveVars( "&" + i, args.postVars[i] );
															}
															else
															{
																_urlArgs = _urlArgs + '&' + (i) + '=' + encodeURI(args.postVars[i]);
															}
														}
														
														sendArguments = _urlArgs;
													}
													else
													{
														sendArguments = null;
													}
													
													this.addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
													
												break;
											}
											
											// Add AJAX specific request header
											this.addHeader( "X-Requested-With", "XMLHTTPRequest" );
											
											xmlObj.open(args.requestType, args.url, args.async, args.username, args.password);
											
											for(var i in args.headers)
											{
												if(typeof args.headers[i] == "function")
												{
													continue;
												}
												
												xmlObj.setRequestHeader(i, args.headers[i]);
											}
											
											xmlObj.send(sendArguments);
											
											// Start the timeout function
											var _timeoutPointer = setTimeout( this.cancel, args.timeout );
											
											return true;
										}
										catch( e )
										{
											Application.debug.addError(
																		"AJAX: Unforseen error encountered in AJAX request execution: ErrorNumber: " + e.number + " " + e.message + " File: " + e.filename + " Line: " + e.lineNumber + " URL: " + args.url + " Args: " + sendArguments,
																		{
																			sendErrorReport: args.sendErrorReport
																		}
																	);
											
											return false;
										}
									}
			
			if( !args.dontExecute )
			{
				this.execute();
			}
		},
		
		/*
			Internet Explorer
		*/
		
		ajaxConnIE: function(args)
		{
			if(!args.url)
			{
				return false;
			}
			
			var variables = [];
			var headers = [];
			var xmlObj = null;
			
			if(!args.vars)
			{
				args.vars = [];
			}
			
			if(!args.headers)
			{
				args.headers = [];
			}
			
			try
			{
				var xmlObj = new ActiveXObject("Msxml2.XMLHTTP");
			}
			catch(e)
			{
				Application.debug.addError(
												"AJAX: An error has occured while creating the XMLHTTP object\nErrorName: " + e.name + "\nErrorMessage: " + e.message,
												{
													sendErrorReport: false
												}
											);
				
				return false;
			}
			
			this.cancel =	function()
								{
									xmlObj.abort();
								}
			
			this.addHeader = 	function( headerName, headerValue )
										{
											args.headers[ headerName ] = headerValue;
										};
			
			this.addVariable =	function( variableName, variableValue )
										{
											args.vars[ variableName ] = variableValue;
										};
			
			this.execute = 	function()
									{
										args.username = args.username?args.username:null;
										args.password = args.password?args.password:null;
										args.requestType = (typeof args.requestType == "undefined") ? Application.connect.REQUEST_GET : args.requestType;
										args.resultType = (typeof args.resultType == "undefined") ? Application.connect.RESULT_AUTO : args.resultType;
										args.timeout = (typeof args.timeout == "undefined") ? Application.connect.timeout : args.timeout;
										
										args.onload = args.onload ? args.onload: function() { };
										args.successFunction = args.successFunction ? args.successFunction:	function(domEl)
																																			{
																																				Application.debug.add(
																																										"AJAX: URL:" + args.url + "\nStatus: " + xmlObj.status + "\nStatusText: " + xmlObj.statusText + "\nReturn value: " + domEl.xml,
																																										{
																																											sendErrorReport: args.sendErrorReport
																																										}
																																									);
																																			};
										
										args.onError = args.onError ? args.onError :	function()
																											{
																												Application.debug.addError(
																																			"AJAX: There was a problem retrieving the XML data:\nServer: " + args.url + "\nServer status: " + xmlObj.status + "\nServer message: " + xmlObj.statusText,
																																			{
																																				sendErrorReport: args.sendErrorReport
																																			}
																																		);
																											}
										
										//
										//	Generate Args
										//
										
										var _urlArgs = "";
										
										var _recursiveVars = function( prefix, arg )
																		{
																			if( typeof arg != "object" )
																			{
																				_urlArgs += prefix + '[]=' + encodeURI( arg );
																				
																				return;
																			}
																			
																			for( var i in arg )
																			{
																				if( typeof arg[i] == "function" )
																				{
																					continue;
																				}
																				
																				if( /^[0-9]+$/.test( i ) )
																				{
																					_recursiveVars( prefix, arg[i] );
																				}
																				else
																				{
																					_recursiveVars( prefix + "[" + i + "]", arg[i] );
																				}
																			}
																		}
										
										for(var i in args.vars)
										{
											if( typeof args.vars[i] == "function" )
											{
												continue;
											}
											
											if( typeof args.vars[i] == "object" )
											{
												_recursiveVars( "&" + i, args.vars[i] );
											}
											else
											{
												_urlArgs = _urlArgs + '&' + (i) + '=' + encodeURI(args.vars[i]);
											}
										}
										
										//
										//	Send request
										//
										
										try
										{
											xmlObj.onreadystatechange = function()
																						{
																							switch( xmlObj.readyState )
																							{
																								case 1:
																								case 2:
																								case 3:
																									
																									// Onload Event for IE
																									args.onload(xmlObj);
																									
																								break;
																								case 4:
																									
																									clearTimeout( _timeoutPointer );
																									
																									if (xmlObj.status != 200)
																									{
																										args.onError(xmlObj);
																										
																										return;
																									}
																									
																									if( args.resultType == Application.connect.RESULT_AUTO )
																									{
																										// Automatic result requested
																										
																										switch( xmlObj.getResponseHeader('Content-type') )
																										{
																											case "application/xml":
																												
																												args.resultType = Application.connect.RESULT_XML;
																												
																											break;
																											case "application/json":
																												
																												args.resultType = Application.connect.RESULT_JSON;
																												
																											break;
																											default:
																												
																												args.resultType = Application.connect.RESULT_XML;
																										}
																									}
																									
																									switch( args.resultType )
																									{
																										case Application.connect.RESULT_XML:
																											
																											if( !Application.connect.validateXML( xmlObj.responseXML, args.sendErrorReport ) )
																											{
																												Application.debug.addError(
																																				"AJAX: Expected XML response but got invalid result on " + args.url + ". Response was: " + xmlObj.responseText,
																																				{
																																					sendErrorReport: args.sendErrorReport
																																				}
																																			);
																												
																												return;
																											}
																											
																											args.successFunction(
																														xmlObj.responseXML,
																														xmlObj.responseText
																													);
																											
																										break;
																										case Application.connect.RESULT_JSON:
																											
																											var interpretationResult = JSON.parse( xmlObj.responseText );
																											if( !interpretationResult )
																											{
																												Application.debug.addError(
																																			"AJAX: Expected JSON response but got invalid result on " + args.url + ". Response was: " + xmlObj.responseText,
																																			{
																																				sendErrorReport: args.sendErrorReport
																																			}
																																		);
																												
																												return;
																											}
																											
																											args.successFunction(
																														interpretationResult,
																														xmlObj.responseText
																													);
																											
																										break;
																										default:
																											
																											Application.debug.addError(
																																			"AJAX: invalid args.resultType: " + args.resultType,
																																			{
																																				sendErrorReport: args.sendErrorReport
																																			} 
																																		);
																									}
																									
																								break;
																								default:
																									
																									Application.debug.addError(
																																	"AJAX: Unforseen readyState encountered: " + xmlObj.readyState,
																																	{
																																		sendErrorReport: args.sendErrorReport
																																	}
																																);
																							}
																						};
											
											switch(args.requestType)
											{
												case Application.connect.REQUEST_GET:
													
													args.url += _urlArgs.replace(/&/, '?');
													
													var sendArguments = null;
													
												break;
												case Application.connect.REQUEST_POST:
													
													args.url += _urlArgs.replace(/&/, '?');
													
													if( args.postVars )
													{
														_urlArgs = "";
														
														for(var i in args.postVars)
														{
															if( typeof args.postVars[i] == "function" )
															{
																continue;
															}
															
															if( typeof args.postVars[i] == "object" )
															{
																_recursiveVars( "&" + i, args.postVars[i] );
															}
															else
															{
																_urlArgs = _urlArgs + '&' + (i) + '=' + encodeURI(args.postVars[i]);
															}
														}
														
														sendArguments = _urlArgs;
													}
													else
													{
														sendArguments = null;
													}
													
													this.addHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
													
												break;
											}
											
											// Add AJAX specific request header
											this.addHeader( "X-Requested-With", "XMLHTTPRequest" );
											
											xmlObj.open(args.requestType, args.url, args.async, args.username, args.password);
											
											for(var i in args.headers)
											{
												xmlObj.setRequestHeader(i, args.headers[i]);
											}
											
											xmlObj.send(sendArguments);
											
											// Start the timeout function
											var _timeoutPointer = setTimeout( this.cancel, args.timeout );
											
											return true;
										}
										catch( e )
										{
											Application.debug.addError(
																			"AJAX: try/catch error: " + e.number + " " + e.description + " Path: " + args.url + " Args: " + sendArguments,
																			{
																				sendErrorReport: args.sendErrorReport
																			}
																		);
											
											return false;
										}
									};
			
			if( !args.dontExecute )
			{
				this.execute();
			}
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/appJS/resources/public/application.debug.js
*/

	
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
	

/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/appJS/resources/public/application.effects.js
*/

	
	// Effects Library
	
	Application.effects = {
		
		init: function()
		{
			
		},
		
		drag:
		{
			attach: function( args )
			{
				if( !args.object )
				{
					return false;
				}
				
				args.targetObject = ( typeof args.targetObject == "undefined" ) ? args.object : args.targetObject;
				args.onmousemove = ( typeof args.onmousemove == "undefined" ) ? function() {}: args.onmousemove;
				args.onmouseup = ( typeof args.onmouseup == "undefined" ) ? function() {}: args.onmouseup;
				
				// Restore the old position, should a cookie be available
				if( args.saveName )
				{
					var result = Application.util.storage.cookie.get({
																name: args.saveName + "_position"
															});
					
					if( result != false )
					{
						result = result.split("_");
						
						args.targetObject.style.left = result[0] + "px";
						args.targetObject.style.top = result[1] + "px";
					}
				}
				
				var _moveFunction = function( e )
				{
					e = e ? e : window.event;
					
					var xPos = e.x ? e.x : e.clientX;
					var yPos = e.y ? e.y : e.clientY;
					
					var initX = xPos - args.targetObject.offsetLeft;
					var initY = yPos - args.targetObject.offsetTop;
					
					var _mouseMoveFunction = 	function( e )
															{
																e = e ? e : window.event;
																
																var xPos = e.x ? e.x : e.clientX;
																var yPos = e.y ? e.y : e.clientY;
																
																args.targetObject.style.left = ( xPos - initX ) + "px";
																args.targetObject.style.top = ( yPos - initY ) + "px";
																
																args.onmousemove( e );
															};
					
					var _mouseUpFunction = 	function( e )
														{
															if( args.saveName )
															{
																Application.util.storage.cookie.add({
																											name: args.saveName + "_position",
																											value: args.targetObject.offsetLeft + "_" + args.targetObject.offsetTop
																										});
															}
															
															args.onmouseup( e );
															
															Application.event.remove( document.body, "mouseup",  _mouseUpFunction );
															Application.event.remove( document.body, "mousemove",  _mouseMoveFunction );
														};
					
					Application.event.add( document.body, "mousemove", _mouseMoveFunction );
					Application.event.add( document.body, "mouseup",  _mouseUpFunction );
				}
				
				if( args.eventObject )
				{
					_moveFunction( args.eventObject );
				}
				else
				{
					// Set the events
					Application.event.add( args.object, "mousedown", 	function( e )
																						{
																							_moveFunction( e );
																						});
				}
			},
			
			load: function( args )
			{
				if( !args.targetObject || !args.saveName )
				{
					return false;
				}
				
				// Restore the old position, should a cookie be available
				
				var result = Application.util.storage.cookie.get({
															name: args.saveName + "_position"
														});
				
				if( result == false )
				{
					return false;
				}
				
				result = result.split("_");
				
				args.targetObject.style.left = result[0] + "px";
				args.targetObject.style.top = result[1] + "px";
				
				return true;
			}
		},
		
		slide:
		{
			amount: 20,
			delay: 10,
			
			absolute: function( args )
			{
				
			},
			
			fromRight: function( args )
			{
				
			},
			
			fromLeft: function( args )
			{
				if(!args.object)
				{
					return false;
				}
				
				var amount = ((typeof args.amount) != "undefined") ? args.amount : Application.effects.slide.amount;
				var delay = ((typeof args.delay) != "undefined") ? args.delay : Application.effects.slide.delay;
				
				var endClass = Application.util.style.getMatchingRules( '.' + args.object.className.toString().replace( / /g, '.' ) + " .endEffect" )[0];
				
				var startX = args.object.offsetLeft;
				var endX = parseFloat(endClass.style.left.replace( /px/, '' ));
				
				var intervalPointer = setInterval( 	function()
													{
														startX += amount;
														
														if( startX > endX )
														{
															startX = endX;
														}
														
														args.object.style.left = (startX) + "px";
														
														if( startX == endX)
														{
															clearInterval( intervalPointer );
															
															return;
														}
													}, 50);
			}
		},
		
		fade:
		{
			amount: 10,
			delay: 50,
			
			fadeIn: function( args )
			{
				if(!args.object)
				{
					return false;
				}
				
				var amount = ((typeof args.amount) != "undefined") ? args.amount : Application.effects.fade.amount;
				var delay = ((typeof args.delay) != "undefined") ? args.delay : Application.effects.fade.delay;
				var minOpacity = ((typeof args.minOpacity) != "undefined") ? args.minOpacity : 0;
				var maxOpacity = ((typeof args.maxOpacity) != "undefined") ? args.maxOpacity : 100;
				
				if(Application.util.style.getCurrent(args.object, "filter").length == 0)
				{
					args.object.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + minOpacity + ")";
				}
				
				var intervalPointer = setInterval( 	function()
													{
														minOpacity += amount;
														
														if(minOpacity > maxOpacity)
														{
															minOpacity = maxOpacity;
														}
														
														args.object.style.MozOpacity = minOpacity / 100;
														//ImageObj.style.filters.alpha.opacity=90
														args.object.style.filter = Application.util.style.getCurrent(args.object, "filter").replace( /opacity\=[0-9]+/, "opacity=" + minOpacity );
														args.object.style.opacity = minOpacity / 100;
														
														if( minOpacity == maxOpacity )
														{
															clearInterval( intervalPointer );
															
															if(args.onComplete)
															{
																args.onComplete();
															}
															
															return;
														}
													}, delay);
				
				return intervalPointer;
			},
			
			fadeOut: function ( args )
			{
				if(!args.object)
				{
					return false;
				}
				
				var amount = ((typeof args.amount) != "undefined") ? args.amount : Application.effects.fade.amount;
				var delay = ((typeof args.delay) != "undefined") ? args.delay : Application.effects.fade.delay;
				var minOpacity = ((typeof args.minOpacity) != "undefined") ? args.minOpacity : 100;
				var maxOpacity = ((typeof args.maxOpacity) != "undefined") ? args.maxOpacity : 0;
				
				var intervalPointer = setInterval( 	function()
													{
														minOpacity -= amount;
														
														if(minOpacity < maxOpacity)
														{
															minOpacity = maxOpacity;
														}
														
														args.object.style.MozOpacity = minOpacity / 100;
														//ImageObj.style.filters.alpha.opacity=90
														args.object.style.filter = Application.util.style.getCurrent(args.object, "filter").replace( /opacity\=[0-9]+/, "opacity=" + minOpacity );
														args.object.style.opacity = minOpacity / 100;
														
														if( minOpacity == maxOpacity )
														{
															clearInterval( intervalPointer );
															
															if(args.onComplete)
															{
																args.onComplete();
															}
															
															return;
														}
													}, delay);
				
				return intervalPointer;
			}
		}
		
	};
	

/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/appJS/resources/public/application.event.js
*/

	
	Application.event = {
		
		add: null,
		remove: null,
		
		init: function()
		{
			// Init Events based on the current browser
			
			// IE
			if(Application.util.browserInformation.browser == "Explorer")
			{
				Application.event.add = Application.event.IE.add;
				Application.event.remove = Application.event.IE.remove;
				
				return;
			}
			
			// Firefox
			Application.event.add = Application.event.FF.add;
			Application.event.remove = Application.event.FF.remove;
			
			return;
		},
		
		IE:
		{
			add: function(element, type, handler)
			{
				element.attachEvent("on" + type, handler);
			},
			
			remove: function(element, type, handler)
			{
				element.detachEvent("on" + type, handler);
			}
		},
		
		FF:
		{
			add: function(element, type, handler)
			{
				element.addEventListener(type, handler, false);
			},
			
			remove: function(element, type, handler)
			{
				element.removeEventListener(type, handler, false);
			}
		}
		
	}
	

/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/appJS/resources/public/application.util.js
*/

	
	Application.util = {
		
		init: function()
		{
			// Browser information
			this.browserInformation.init();
			
			// Storage facility
			this.storage.init();
			
			if(Application.util.browserInformation.browser == "Explorer")
			{
				// XML serialization
				Application.util.serialize.xml = Application.util.serialize.IE.xml;
				
				// CSS manipulation
				Application.util.style.getCurrent = Application.util.style.IE.getCurrent;
				Application.util.style.getPos = Application.util.style.IE.getPos;
				Application.util.style.getRule = Application.util.style.IE.getRule;
				Application.util.style.getMatchingRules = Application.util.style.IE.getMatchingRules;
				
				// XSLT
				Application.util.xslt.disableOutputEscaping.correct = Application.util.xslt.disableOutputEscaping.correctIE;
				Application.util.xslt.disableOutputEscaping.correctObject = Application.util.xslt.disableOutputEscaping.correctObjectIE;
				Application.util.xslt.xPath.search = Application.util.xslt.xPath.IE;
				Application.util.xslt.transform.fromFile = Application.util.xslt.transform.IE.fromFile;
				Application.util.xslt.transform.fromXML = Application.util.xslt.transform.IE.fromXML;
				
				// Text selection
				Application.util.selectText.range = Application.util.selectText.IE.range;
			}
			else
			{
				// XML serialization
				Application.util.serialize.xml = Application.util.serialize.FF.xml;
				
				// CSS manipulation
				Application.util.style.getCurrent = Application.util.style.FF.getCurrent;
				Application.util.style.getPos = Application.util.style.FF.getPos;
				Application.util.style.getRule = Application.util.style.FF.getRule;
				Application.util.style.getMatchingRules = Application.util.style.FF.getMatchingRules;
				
				// XSLT
				Application.util.xslt.disableOutputEscaping.correct = Application.util.xslt.disableOutputEscaping.correctFF;
				Application.util.xslt.disableOutputEscaping.correctObject = Application.util.xslt.disableOutputEscaping.correctObjectFF;
				Application.util.xslt.xPath.search = Application.util.xslt.xPath.FF;
				Application.util.xslt.transform.fromFile = Application.util.xslt.transform.FF.fromFile;
				Application.util.xslt.transform.fromXML = Application.util.xslt.transform.FF.fromXML;
				
				// Text selection
				Application.util.selectText.range = Application.util.selectText.FF.range;
			}
			
			// URL information
			this.urlInformation.init();
			
			// Default Objects Enhancements
			this.objectsEnhancements.init();
		},
		
		/*
			-------------------------
			Local storage manipulation
			-------------------------
		*/
		
		storage:
		{
			init: function()
			{
				
			},
			
			cookie:
			{
				add: function( args )
				{
					if( typeof args != "object" || !args.name || !args.value )
					{
						return false;
					}
					
					// set time, it's in milliseconds
					var today = new Date();
					today.setTime( today.getTime() );
					
					if ( args.expiresMinutes )
					{
						var expires_date = new Date( today.getTime() + ( args.expiresMinutes * 1000 * 60 ) );
					}
					else
					{
						var expires_date = new Date( today.getTime() + 31536000000 );	// 1 year
					}
					
					document.cookie = args.name + "=" + escape( args.value ) + ";expires=" + expires_date.toGMTString() +
					( ( args.path ) ? ";path=" + args.path : "" ) +
					( ( args.domain ) ? ";domain=" + args.domain : "" ) +
					( ( args.secure ) ? ";secure" : "" );
					
//					Application.debug.add( args.name + " " + args.value );
					
					return true;
				},
				
				get: function( args )
				{
					if( typeof args != "object" || !args.name )
					{
						return false;
					}
					
					// first we'll split this cookie up into name/value pairs
					// note: document.cookie only returns name=value, not the other components
					var a_all_cookies = document.cookie.split( ';' );
					var cookie_value = null;
					
					for ( var i = 0; i < a_all_cookies.length; i++ )
					{
						// now we'll split apart each name=value pair
						var a_temp_cookie = a_all_cookies[i].split( '=' );
						
						// and trim left/right whitespace while we're at it
						var cookie_name = a_temp_cookie[0].replace(/^\s+|\s+$/g, '');

						// if the extracted name matches passed args.name
						if ( cookie_name != args.name )
						{
							continue;
						}
						
						// we need to handle case where cookie has no value but exists (no = sign, that is):
						if ( a_temp_cookie.length > 1 )
						{
							cookie_value = unescape( a_temp_cookie[1].replace(/^\s+|\s+$/g, '') );
						}
						
						// note that in cases where cookie is initialized but no value, null is returned
						return cookie_value;
					}
					
					return false;
				},
				
				del: function( args )
				{
					if( typeof args != "object" || !args.name )
					{
						return false;
					}
					
					if(
						!Application.util.storage.cookie.get({
																name: args.name
															})
					)
					{
						return false;
					}
					
					Application.util.storage.cookie.add({
															name: args.name,
															expiresMinutes: -1
														});
					
					return true;
				}
			},
			
			gears:
			{
			
			},
			
			flash:
			{
			
			}
		},
		
		/*
			-----------
			XML to Text
			-----------
		*/
		
		serialize:
		{
			xml: null,
			
			init: function()
			{
				
			},
			
			IE:
			{
				xml: function(xmlNode)
				{
					if( xmlNode == null )
					{
						return false;
					}
					
					return xmlNode.xml;
				}
			},
			
			FF:
			{
				xml: function(xmlNode)
				{
					if( xmlNode == null )
					{
						return false;
					}
					
					return ( new XMLSerializer() ).serializeToString(xmlNode);
				}
			}
		},
		
		/*
			-----------
			Select Text
			-----------
		*/
		
		selectText:
		{
			range: null,
			
			init: function()
			{
				
			},
			
			IE:
			{
				range: function(element, start, end)
				{
					var sel = element.createTextRange();
					sel.collapse(true);
					sel.moveStart("character", start);
					sel.moveEnd("character", end);
					sel.select();
				}
			},
			
			FF:
			{
				range: function(element, start, end)
				{
					element.selectionStart = start;
					element.selectionEnd = end;
				}
			}
		},
		
		/*
			---------
			Style Lib
			---------
		*/
		
		style:
		{
			getCurrent: null,
			getPos: null,
			getRule: null,
			getMatchingRules: null,
			
			init: function()
			{
				
			},
			
			IE:
			{
				getCurrent: function(block, property)
				{
					return block.currentStyle[property];
				},
				
				getPos: function( obj )
				{
					var curleft = curtop = 0;
					
					if (!obj.offsetParent)
					{
						return false;
					}
					
					do
					{
						curleft += obj.offsetLeft;
						curtop += obj.offsetTop;
					} while (obj = obj.offsetParent);
					
					return { left: curleft, top: curtop };
				},
				
				getMatchingRules: function( ruleName )
				{
					var rules = document.styleSheets[0].rules;
					var matchingRules = [];
					
					ruleName = ruleName.toLowerCase();
					
					for (i=rules.length-1;i>=0;i--)
					{
						if(rules.item(i).selectorText.toLowerCase().indexOf( ruleName ) == -1)
						{
							continue;
						}
						
						matchingRules[ matchingRules.length ] = rules[i];
					}
					
					return matchingRules;
				},
				
				getRule: function( ruleName )
				{
					var rules = document.styleSheets[0].rules;
					ruleName = ruleName.toLowerCase();
					
					for (i=rules.length-1;i>=0;i--)
					{
						if(rules[i].selectorText.toLowerCase() == ruleName)
						{
							continue;
						}
						
						return rules[i];
					}
					
					return false;
				}
			},
			
			FF:
			{
				getCurrent: function(block, property)
				{
					return document.defaultView.getComputedStyle(block, null).getPropertyValue(property);
				},
				
				getPos: function( obj )
				{
					var curleft = curtop = 0;
					
					if (!obj.offsetParent)
					{
						return false;
					}
					
					do
					{
						curleft += obj.offsetLeft;
						curtop += obj.offsetTop;
					} while (obj = obj.offsetParent);
					
					return { left: curleft, top: curtop };
				},
				
				getMatchingRules: function( ruleName )
				{
					var rules = document.styleSheets[0].cssRules;
					var matchingRules = [];
					
					for (i=rules.length-1;i>=0;i--)
					{
						if(rules.item(i).selectorText.indexOf( ruleName ) == -1)
						{
							continue;
						}
						
						matchingRules[ matchingRules.length ] = rules[i];
					}
					
					return matchingRules;
				},
				
				getRule: function( ruleName )
				{
					var rules = document.styleSheets[0].cssRules;
					
					for (i=rules.length-1;i>=0;i--)
					{
						if(rules[i].selectorText == ruleName)
						{
							continue;
						}
						
						return rules[i];
					}
					
					return false;
				}
			}
		},
		
		/*
			------------------
			BrowserInformation
			------------------
		*/
		
		browserInformation:
		{
			init: function ()
			{
				this.browser = this.searchString(this.dataBrowser) || "An unknown browser";
				this.version = this.searchVersion(navigator.userAgent)
					|| this.searchVersion(navigator.appVersion)
					|| "an unknown version";
				this.OS = this.searchString(this.dataOS) || "an unknown OS";
			},
			
			searchString: function (data)
			{
				for (var i=0;i<data.length;i++)	{
					var dataString = data[i].string;
					var dataProp = data[i].prop;
					this.versionSearchString = data[i].versionSearch || data[i].identity;
					if (dataString) {
						if (dataString.indexOf(data[i].subString) != -1)
							return data[i].identity;
					}
					else if (dataProp)
						return data[i].identity;
				}
			},
			
			searchVersion: function (dataString)
			{
				var index = dataString.indexOf(this.versionSearchString);
				if (index == -1) return;
				return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
			},
			
			dataBrowser: [
				{
					string: navigator.userAgent,
					subString: "Chrome",
					identity: "Chrome"
				},
				{ 	string: navigator.userAgent,
					subString: "OmniWeb",
					versionSearch: "OmniWeb/",
					identity: "OmniWeb"
				},
				{
					string: navigator.vendor,
					subString: "Apple",
					identity: "Safari",
					versionSearch: "Version"
				},
				{
					prop: window.opera,
					identity: "Opera"
				},
				{
					string: navigator.vendor,
					subString: "iCab",
					identity: "iCab"
				},
				{
					string: navigator.vendor,
					subString: "KDE",
					identity: "Konqueror"
				},
				{
					string: navigator.userAgent,
					subString: "Firefox",
					identity: "Firefox"
				},
				{
					string: navigator.vendor,
					subString: "Camino",
					identity: "Camino"
				},
				{		// for newer Netscapes (6+)
					string: navigator.userAgent,
					subString: "Netscape",
					identity: "Netscape"
				},
				{
					string: navigator.userAgent,
					subString: "MSIE",
					identity: "Explorer",
					versionSearch: "MSIE"
				},
				{
					string: navigator.userAgent,
					subString: "Gecko",
					identity: "Mozilla",
					versionSearch: "rv"
				},
				{ 		// for older Netscapes (4-)
					string: navigator.userAgent,
					subString: "Mozilla",
					identity: "Netscape",
					versionSearch: "Mozilla"
				}
			],
			dataOS : [
				{
					string: navigator.platform,
					subString: "Win",
					identity: "Windows"
				},
				{
					string: navigator.platform,
					subString: "Mac",
					identity: "Mac"
				},
				{
					   string: navigator.userAgent,
					   subString: "iPhone",
					   identity: "iPhone/iPod"
				},
				{
					string: navigator.platform,
					subString: "Linux",
					identity: "Linux"
				}
			]
		},
		
		/*
			--------------------
			XSL Transformations
			--------------------
		*/
		
		xslt:
		{
			init: function()
			{
				
			},
			
			xPath:
			{
				search: null,
				
				IE: function( xmlObject, expression )
				{
					return xmlObject.selectNodes( expression );
				},
				
				FF: function( xmlObject, expression )
				{
					var result = [];
					var i = -1;
					
					var nodes = xmlObject.evaluate( expression, xmlObject, null, XPathResult.ANY_TYPE, null );
					
					result[ ++i ] = nodes.iterateNext();
					
					while( result[ i ] )
					{
						result[ ++i ] = nodes.iterateNext();
					}
					
					result[ i ] = null;
					
					return result;
				}
			},
			
			transform:
			{
				fromFile: null,
				fromXML: null,
				
				xslCache: [],
				
				IE:
				{
					fromXML: function( args )
					{
						if(
							typeof args != "object" ||
							!args.xmlString ||
							!args.xslFile
						)
						{
							return false;
						}
						
						// Default append to the body
						args.targetNode = args.targetNode ? args.targetNode : document.body;
						
						var xmlEl = new ActiveXObject("Microsoft.XMLDOM");
						xmlEl.async = "false";
						xmlEl.loadXML( args.xmlString );
						
						// Load XSL File
						
						if( Application.util.xslt.transform.xslCache[ args.xslFile ] )
						{
							var htmlResult = xmlEl.transformNode( Application.util.xslt.transform.xslCache[ args.xslFile ] );
							
							var newNode = document.createElement("div");
							newNode.innerHTML = htmlResult;
							
							args.targetNode.appendChild( newNode.childNodes[0] );
							
							if( args.successFunction )
							{
								var childNodesCollection = args.targetNode.childNodes;
								
								args.successFunction( childNodesCollection[ childNodesCollection.length - 1 ] );
							}
						}
						else
						{
							new Application.connect.ajax({
															url: args.xslFile,
															successFunction: function( xslEl )
																					{
																						// Cache the xsl file
																						Application.util.xslt.transform.xslCache[ args.xslFile ] = xslEl;
																						
																						// Perform the transformation
																						var htmlResult = xmlEl.transformNode( xslEl );
																						
																						var newNode = document.createElement("div");
																						newNode.innerHTML = htmlResult;
																						
																						args.targetNode.appendChild( newNode.childNodes[0] );
																						
																						// Exec post transformation success function
																						if( args.successFunction )
																						{
																							var childNodesCollection = args.targetNode.childNodes;
																							
																							args.successFunction( childNodesCollection[ childNodesCollection.length - 1 ] );
																						}
																					}
														});
						}
					},
					
					fromFile: function( args )
					{
						if(
							typeof args != "object" ||
							!args.xmlFile ||
							!args.xslFile
						)
						{
							return false;
						}
						
						// Default append to the body
						args.targetNode = args.targetNode ? args.targetNode : document.body;
						
						// Load XML File
						
						new Application.connect.ajax({
														url: args.xmlFile,
														successFunction: function( xmlEl )
																				{
																					// Load XSL File
																					
																					if( Application.util.xslt.transform.xslCache[ args.xslFile ] )
																					{
																						var htmlResult = xmlEl.transformNode( Application.util.xslt.transform.xslCache[ args.xslFile ] );
																						
																						var newNode = document.createElement("div");
																						newNode.innerHTML = htmlResult;
																						
																						args.targetNode.appendChild( newNode.childNodes[0] );
																						
																						if( args.successFunction )
																						{
																							var childNodesCollection = args.targetNode.childNodes;
																							
																							args.successFunction( childNodesCollection[ childNodesCollection.length - 1 ] );
																						}
																					}
																					else
																					{
																						new Application.connect.ajax({
																														url: args.xslFile,
																														successFunction: function( xslEl )
																																				{
																																					// Cache the xsl file
																																					Application.util.xslt.transform.xslCache[ args.xslFile ] = xslEl;
																																					
																																					// Perform the transformation
																																					var htmlResult = xmlEl.transformNode( xslEl );
																																					
																																					var newNode = document.createElement("div");
																																					newNode.innerHTML = htmlResult;
																																					
																																					args.targetNode.appendChild( newNode.childNodes[0] );
																																					
																																					// Exec post transformation success function
																																					if( args.successFunction )
																																					{
																																						var childNodesCollection = args.targetNode.childNodes;
																																						
																																						args.successFunction( childNodesCollection[ childNodesCollection.length - 1 ] );
																																					}
																																				}
																													});
																					}
																				}
												});
					}
				},
				
				FF:
				{
					fromXML: function( args )
					{
						if(
							typeof args != "object" ||
							!args.xmlString ||
							!args.xslFile
						)
						{
							return false;
						}
						
						// Default append to the body
						args.targetNode = args.targetNode ? args.targetNode : document.body;
						
						var xmlEl = ( new DOMParser() ).parseFromString(args.xmlString, "text/xml");
						
						if( !xmlEl )
						{
							return false;
						}
						
						// Load XSL File
						
						if( Application.util.xslt.transform.xslCache[ args.xslFile ] )
						{
							// Perform the transformation
							
							var xsltProcessor = new XSLTProcessor();
							xsltProcessor.importStylesheet( Application.util.xslt.transform.xslCache[ args.xslFile ] );
							
							var fragment = xsltProcessor.transformToFragment(xmlEl, document);
							
							args.targetNode.appendChild( fragment );
							
							// Exec post transformation success function
							if( args.successFunction )
							{
								var childNodesCollection = args.targetNode.childNodes;
								
								args.successFunction( childNodesCollection[ childNodesCollection.length - 1 ] );
							}
						}
						else
						{
							new Application.connect.ajax({
															url: args.xslFile,
															successFunction: function( xslEl )
																					{
																						// Cache the xsl file
																						Application.util.xslt.transform.xslCache[ args.xslFile ] = xslEl;
																						
																						// Perform the transformation
																						
																						var xsltProcessor = new XSLTProcessor();
																						xsltProcessor.importStylesheet( xslEl );
																						
																						var fragment = xsltProcessor.transformToFragment(xmlEl, document);
																						
																						args.targetNode.appendChild( fragment );
																						
																						// Exec post transformation success function
																						if( args.successFunction )
																						{
																							var childNodesCollection = args.targetNode.childNodes;
																							
																							args.successFunction( childNodesCollection[ childNodesCollection.length - 1 ] );
																						}
																					}
														});
						}
					},
					
					fromFile: function( args )
					{
						if(
							typeof args != "object" ||
							!args.xmlFile ||
							!args.xslFile
						)
						{
							return false;
						}
						
						// Default append to the body
						args.targetNode = args.targetNode ? args.targetNode : document.body;
						
						// Load XML File
						
						new Application.connect.ajax({
														url: args.xmlFile,
														successFunction: function( xmlEl )
																				{
																					// Load XSL File
																					
																					if( Application.util.xslt.transform.xslCache[ args.xslFile ] )
																					{
																						// Perform the transformation
																						
																						var xmlRef = document.implementation.createDocument("", "", null);
																						xmlRef.appendChild( xmlRef.importNode( xmlEl.childNodes.item(0), true ) );
																						
																						var xsltProcessor = new XSLTProcessor();
																						xsltProcessor.importStylesheet( Application.util.xslt.transform.xslCache[ args.xslFile ] );
																						
																						var fragment = xsltProcessor.transformToFragment(xmlRef, document);
																						
																						args.targetNode.appendChild( fragment );
																						
																						// Exec post transformation success function
																						if( args.successFunction )
																						{
																							var childNodesCollection = args.targetNode.childNodes;
																							
																							args.successFunction( childNodesCollection[ childNodesCollection.length - 1 ] );
																						}
																					}
																					else
																					{
																						new Application.connect.ajax({
																														url: args.xslFile,
																														successFunction: function( xslEl )
																																				{
																																					// Cache the xsl file
																																					Application.util.xslt.transform.xslCache[ args.xslFile ] = xslEl;
																																					
																																					// Perform the transformation
																																					
																																					var xmlRef = document.implementation.createDocument("", "", null);
																																					xmlRef.appendChild( xmlRef.importNode( xmlEl.childNodes.item(0), true ) );
																																					
																																					var xsltProcessor = new XSLTProcessor();
																																					xsltProcessor.importStylesheet( xslEl );
																																					
																																					var fragment = xsltProcessor.transformToFragment(xmlRef, document);
																																					
																																					args.targetNode.appendChild( fragment );
																																					
																																					// Exec post transformation success function
																																					if( args.successFunction )
																																					{
																																						var childNodesCollection = args.targetNode.childNodes;
																																						
																																						args.successFunction( childNodesCollection[ childNodesCollection.length - 1 ] );
																																					}
																																				}
																													});
																					}
																				}
												});
					}
				}
			},
			
			disableOutputEscaping:
			{
				correct: null,
				correctObject: null,
				
				init: function()
				{
					
				},
				
				correctIE: function( args )
				{
					return true;
				},
				
				correctObjectIE: function( args )
				{
					return true;
				},
				
				correctFF: function( args )
				{
					var area = document.getElementById( args.id );
					
					area.innerHTML = area.textContent;
					
					return true;
				},
				
				correctObjectFF: function( args )
				{
					args.object.innerHTML = args.object.textContent;
					
					return true;
				}
			}
		},
		
		urlInformation:
		{
			siteName: null,
			protocol: null,
			params: null,
			
			init: function()
			{
				var url = document.location.href.toString();
				var internalArray = url.split("://");
				
				this.protocol = internalArray[0];
				
				// Replace multiple consecutive slashes
				var tokens = internalArray[1].replace(/\/\/+/, '/').split("/");
				
				this.siteName = tokens[0];
				
				// Create parameters
				this.params = new Array();
				
				if( tokens[1].length == 0 )
				{
					return true;
				}
				
				for( var i = 1; i < tokens.length ; i++ )
				{
					var currentParam = tokens[i].split("_");
					
					this.params[ currentParam[0] ] = ( currentParam[1] ? currentParam[1] : null );
				}
				
				return true;
			}
		},
		
		/*
			----------------------
			Prototype Manipulation
			----------------------
		*/
		
		objectsEnhancements:
		{
			init: function()
			{
				this.array();
			},
			
			array: function()
			{
				Array.prototype.inArray = 	function (value)
														{
															for (var i=(this.length-1); i>=0; i--)
															{
																if (this[i] === value)
																{
																	return true;
																}
															}
															
															return false;
														};
			}
		}
		
	}
	

/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/appJS/resources/public/json2.js
*/

/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/appJS/resources/public/objects.js
*/

	
	/*
		Objects prototype
	*/
	
	var $ = function( objectName )
	{
		if(typeof objectName != "string")
		{
			return false;
		}
		
		this._object = document.getElementById( objectName );
		
		if( !this._object )
		{
			return false;
		}
	}
	
	switch( Application.util.browserInformation.browser )
	{
		case "Firefox":
			
			/**
			*		Correct XSLT Output
			*/
			
			$.prototype.correctOutputEscaping = function()
			{
				this._object.innerHTML = this._object.textContent;
				
				return true;
			}
			
		break;
		default:
			
			/**
			*		Correct XSLT Output
			*/
			
			$.prototype.correctOutputEscaping = function()
			{
				return true;
			}
			
	}
	
	/**
	*		Load XSLT transformation 
	*/
	
	$.prototype.loadTransformation = function( args )
	{
		if( typeof args != "object" )
		{
			return false;
		}
		
		if( !args.xmlFile )
		{
			Application.debug.addRow({
								text: '$.loadTransformation No XML file specified'
						});
			
			return false;
		}
		
		if( !args.xslFile )
		{
			Application.debug.addRow({
								text: '$.loadTransformation No XSL file specified'
						});
			
			return false;
		}
		
		new Application.connect.ajax({
										url: args.xmlFile,
										successFunction: 	function( xmlEl )
																	{
																		new Application.connect.ajax({
																										url: args.xslFile,
																										successFunction: 	function( xslEl )
																																	{
																																		
																																	}
																							});
																	}
								});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	



/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/news/resources/public/component.news.js
*/

	
	/*
		news JS
	*/
	
	Component.news = {
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.news.create( args[i] );	
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
			var newURL = 'index.php?page=' + Application.util.urlInformation.params[ "page" ] + '&component=news&show=add';
			
			if(Application.util.urlInformation.params[ "language" ])
			{
				newURL += '&language=' + Application.util.urlInformation.params[ "language" ];
			}
			
			document.location.href = newURL;
		},
		
		showList: function()
		{
			var newURL = 'index.php?page=' + Application.util.urlInformation.params[ "page" ] + '&component=news&show=list';
			
			if(Application.util.urlInformation.params[ "language" ])
			{
				newURL += '&language=' + Application.util.urlInformation.params[ "language" ];
			}
			
			document.location.href = newURL;
		}
		
	};





/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/content/resources/public/component.content.js
*/

	
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







/*
	File: /usr/www/s507.r.gameleon.co//public_admin/components/translationEditor/resources/public/component.translationEditor.js
*/

	
	/*
		translationEditor JS
	*/
	
	Component.translationEditor = {
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.translationEditor.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			var formObject = document.getElementById( args.id + "_form" );
			var showObject = Application.util.urlInformation.params.show;
			
			if( showObject && showObject != "list" )
			{
				if( showObject == "edit" )
				{
					var formSendLinkObject = document.getElementById( args.id + "_formApplyLink" );
					
					Application.event.add( formSendLinkObject, "click", 	function()
																								{
																									document.getElementById( args.id + "_formRedirect" ).value = "1";
																									
																									formObject.submit();
																									
																									return false;
																								});	
					
					var formSendLinkObject = document.getElementById( args.id + "_formSendLink" );
					
					Application.event.add( formSendLinkObject, "click", 	function()
																								{
																									formObject.submit();
																									
																									return false;
																								});	
				}
				
				return;
			}
			
			/*
				General filters
			*/
			
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
		
		showList: function()
		{
			var newURL = 'index.php?page=' + Application.util.urlInformation.params[ "page" ] + '&component=translationEditor&show=list';
			
			if(Application.util.urlInformation.params[ "language" ])
			{
				newURL += '&language=' + Application.util.urlInformation.params[ "language" ];
			}
			
			document.location.href = newURL;
		}
		
	};

