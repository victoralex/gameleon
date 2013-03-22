	
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	