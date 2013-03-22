	
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
	