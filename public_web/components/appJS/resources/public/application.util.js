	
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
				
				//. HTML Node remover
				Application.util.html.removeNode = Application.util.html.removeNodeIE;
				
				// CSS manipulation
				Application.util.style.getCurrent = Application.util.style.IE.getCurrent;
				Application.util.style.getPos = Application.util.style.IE.getPos;
				Application.util.style.getRule = Application.util.style.IE.getRule;
				Application.util.style.getMatchingRules = Application.util.style.IE.getMatchingRules;
				Application.util.style.getWindowSize = Application.util.style.IE.getWindowSize;
				
				// XSLT
				Application.util.xslt.disableOutputEscaping.correct = Application.util.xslt.disableOutputEscaping.correctIE;
				Application.util.xslt.disableOutputEscaping.correctObject = Application.util.xslt.disableOutputEscaping.correctObjectIE;
				Application.util.xslt.xPath.search = Application.util.xslt.xPath.IE;
				Application.util.xslt.transform.fromFile = Application.util.xslt.transform.IE.fromFile;
				Application.util.xslt.transform.fromXML = Application.util.xslt.transform.IE.fromXML;
				
				// Text selection
				Application.util.selectText.range = Application.util.selectText.IE.range;
				
				// Screen
				Application.util.screen.getSize = Application.util.screen.IE.getSize;
			}
			else
			{
				// XML serialization
				Application.util.serialize.xml = Application.util.serialize.FF.xml;
				
				//. HTML Node remover
				Application.util.html.removeNode = Application.util.html.removeNodeFF;
				
				// CSS manipulation
				Application.util.style.getCurrent = Application.util.style.FF.getCurrent;
				Application.util.style.getPos = Application.util.style.FF.getPos;
				Application.util.style.getRule = Application.util.style.FF.getRule;
				Application.util.style.getMatchingRules = Application.util.style.FF.getMatchingRules;
				Application.util.style.getWindowSize = Application.util.style.FF.getWindowSize;
				
				// XSLT
				Application.util.xslt.disableOutputEscaping.correct = Application.util.xslt.disableOutputEscaping.correctFF;
				Application.util.xslt.disableOutputEscaping.correctObject = Application.util.xslt.disableOutputEscaping.correctObjectFF;
				Application.util.xslt.xPath.search = Application.util.xslt.xPath.FF;
				Application.util.xslt.transform.fromFile = Application.util.xslt.transform.FF.fromFile;
				Application.util.xslt.transform.fromXML = Application.util.xslt.transform.FF.fromXML;
				
				// Text selection
				Application.util.selectText.range = Application.util.selectText.FF.range;
				
				// Screen
				Application.util.screen.getSize = Application.util.screen.FF.getSize;
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
				Application.util.storage.cookie.set = Application.util.storage.cookie.add;
			},
			
			cookie:
			{
				set: null,
				
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
				getWindowSize: function()
				{
					return {
							width: document.documentElement.clientWidth,
							height: document.documentElement.clientHeight
						};
				},
				
				getCurrent: function(block, property)
				{
					return block.currentStyle[property];
				},
				
				getPos: function( obj )
				{
					var curleft = 0,
							curtop = 0;
					
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
				getWindowSize: function()
				{
					return {
							width: window.innerWidth,
							height: window.innerHeight
						};
				},
				
				getCurrent: function(block, property)
				{
					return document.defaultView.getComputedStyle(block, null).getPropertyValue(property);
				},
				
				getPos: function( obj )
				{
					var curleft = 0,
							curtop = 0;
					
					if( !obj.offsetParent )
					{
						return { left: obj.offsetLeft, top: obj.offsetTop };
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
				for (var i=0;i<data.length;i++)
				{
					var dataString = data[i].string;
					var dataProp = data[i].prop;
					this.versionSearchString = data[i].versionSearch || data[i].identity;
					if (dataString)
					{
						if (dataString.indexOf(data[i].subString) != -1)
						{
							return data[i].identity;
						}
					}
					else if (dataProp)
					{
						return data[i].identity;
					}
				}
			},
			
			searchVersion: function (dataString)
			{
				var index = dataString.indexOf(this.versionSearchString);
				if (index == -1) return;
				return parseFloat(dataString.substring( index + this.versionSearchString.length+1));
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
					identity: "Opera",
					versionSearch: "Version"
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
					   string: navigator.userAgent,
					   subString: "iPad",
					   identity: "iPad"
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
			page: null,
			
			params: null,
			
			init: function()
			{
				var paramsLocation = document.location.href.toString().indexOf( "#" );
				
				if( paramsLocation != -1 )
				{
					var url = document.location.href.toString().substring(0, paramsLocation ).split("://");
				}
				else
				{
					var url = document.location.href.toString().split("://");
				}
				
				this.protocol = url[0];
				
				// Replace multiple consecutive slashes
				var tokens = url[1].replace(/\/\/+/g, '/').split("/");
				
				this.siteName = tokens[0];
				this.page = tokens[1] ? tokens[1] : null;
				
				this.params = document.location.href.toString().substring( paramsLocation + 1 );
				
				return true;
			}
		},
		
		/*
			-------------
			HTML Entities
			-------------
		*/
		
		html:
		{
			removeNode: null,
			
			removeNodeFF: function( node )
			{
				node.parentNode.removeChild( node );
			},
			
			removeNodeIE: function( node )
			{
				node.removeNode( true );
			},
			
			htmlentities: function(string, quote_style)
			{
				// Convert all applicable characters to HTML entities  
				// 
				// version: 1006.1915
				// discuss at: http://phpjs.org/functions/htmlentities
				// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
				// +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
				// +   improved by: nobbler
				// +    tweaked by: Jack
				// +   bugfixed by: Onno Marsman
				// +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
				// +    bugfixed by: Brett Zamir (http://brett-zamir.me)
				// +      input by: Ratheous
				// -    depends on: get_html_translation_table
				// *     example 1: htmlentities('Kevin & van Zonneveld');
				// *     returns 1: 'Kevin &amp; van Zonneveld'
				// *     example 2: htmlentities("foo'bar","ENT_QUOTES");
				// *     returns 2: 'foo&#039;bar'
				var hash_map = {}, symbol = '', tmp_str = '', entity = '';
				tmp_str = string.toString();
				
				if (false === (hash_map = Application.util.html.get_html_translation_table('HTML_ENTITIES', quote_style))) {
					return false;
				}
				hash_map["'"] = '&#039;';
				for (symbol in hash_map) {
					entity = hash_map[symbol];
					tmp_str = tmp_str.split(symbol).join(entity);
				}
				
				return tmp_str;
			},
			
			get_html_translation_table: function(table, quote_style)
			{
				// Returns the internal translation table used by htmlspecialchars and htmlentities  
				// 
				// version: 1006.1915
				// discuss at: http://phpjs.org/functions/get_html_translation_table
				// +   original by: Philip Peterson
				// +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
				// +   bugfixed by: noname
				// +   bugfixed by: Alex
				// +   bugfixed by: Marco
				// +   bugfixed by: madipta
				// +   improved by: KELAN
				// +   improved by: Brett Zamir (http://brett-zamir.me)
				// +   bugfixed by: Brett Zamir (http://brett-zamir.me)
				// +      input by: Frank Forte
				// +   bugfixed by: T.Wild
				// +      input by: Ratheous
				// %          note: It has been decided that we're not going to add global
				// %          note: dependencies to php.js, meaning the constants are not
				// %          note: real constants, but strings instead. Integers are also supported if someone
				// %          note: chooses to create the constants themselves.
				// *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
				// *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

				var entities = {}, hash_map = {}, decimal = 0, symbol = '';
				var constMappingTable = {}, constMappingQuoteStyle = {};
				var useTable = {}, useQuoteStyle = {};

				// Translate arguments
				constMappingTable[0]      = 'HTML_SPECIALCHARS';
				constMappingTable[1]      = 'HTML_ENTITIES';
				constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
				constMappingQuoteStyle[2] = 'ENT_COMPAT';
				constMappingQuoteStyle[3] = 'ENT_QUOTES';

				useTable       = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
				useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_COMPAT';

				if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
				throw new Error("Table: "+useTable+' not supported');
				// return false;
				}

				entities['38'] = '&amp;';
				if (useTable === 'HTML_ENTITIES') {
				entities['160'] = '&nbsp;';
				entities['161'] = '&iexcl;';
				entities['162'] = '&cent;';
				entities['163'] = '&pound;';
				entities['164'] = '&curren;';
				entities['165'] = '&yen;';
				entities['166'] = '&brvbar;';
				entities['167'] = '&sect;';
				entities['168'] = '&uml;';
				entities['169'] = '&copy;';
				entities['170'] = '&ordf;';
				entities['171'] = '&laquo;';
				entities['172'] = '&not;';
				entities['173'] = '&shy;';
				entities['174'] = '&reg;';
				entities['175'] = '&macr;';
				entities['176'] = '&deg;';
				entities['177'] = '&plusmn;';
				entities['178'] = '&sup2;';
				entities['179'] = '&sup3;';
				entities['180'] = '&acute;';
				entities['181'] = '&micro;';
				entities['182'] = '&para;';
				entities['183'] = '&middot;';
				entities['184'] = '&cedil;';
				entities['185'] = '&sup1;';
				entities['186'] = '&ordm;';
				entities['187'] = '&raquo;';
				entities['188'] = '&frac14;';
				entities['189'] = '&frac12;';
				entities['190'] = '&frac34;';
				entities['191'] = '&iquest;';
				entities['192'] = '&Agrave;';
				entities['193'] = '&Aacute;';
				entities['194'] = '&Acirc;';
				entities['195'] = '&Atilde;';
				entities['196'] = '&Auml;';
				entities['197'] = '&Aring;';
				entities['198'] = '&AElig;';
				entities['199'] = '&Ccedil;';
				entities['200'] = '&Egrave;';
				entities['201'] = '&Eacute;';
				entities['202'] = '&Ecirc;';
				entities['203'] = '&Euml;';
				entities['204'] = '&Igrave;';
				entities['205'] = '&Iacute;';
				entities['206'] = '&Icirc;';
				entities['207'] = '&Iuml;';
				entities['208'] = '&ETH;';
				entities['209'] = '&Ntilde;';
				entities['210'] = '&Ograve;';
				entities['211'] = '&Oacute;';
				entities['212'] = '&Ocirc;';
				entities['213'] = '&Otilde;';
				entities['214'] = '&Ouml;';
				entities['215'] = '&times;';
				entities['216'] = '&Oslash;';
				entities['217'] = '&Ugrave;';
				entities['218'] = '&Uacute;';
				entities['219'] = '&Ucirc;';
				entities['220'] = '&Uuml;';
				entities['221'] = '&Yacute;';
				entities['222'] = '&THORN;';
				entities['223'] = '&szlig;';
				entities['224'] = '&agrave;';
				entities['225'] = '&aacute;';
				entities['226'] = '&acirc;';
				entities['227'] = '&atilde;';
				entities['228'] = '&auml;';
				entities['229'] = '&aring;';
				entities['230'] = '&aelig;';
				entities['231'] = '&ccedil;';
				entities['232'] = '&egrave;';
				entities['233'] = '&eacute;';
				entities['234'] = '&ecirc;';
				entities['235'] = '&euml;';
				entities['236'] = '&igrave;';
				entities['237'] = '&iacute;';
				entities['238'] = '&icirc;';
				entities['239'] = '&iuml;';
				entities['240'] = '&eth;';
				entities['241'] = '&ntilde;';
				entities['242'] = '&ograve;';
				entities['243'] = '&oacute;';
				entities['244'] = '&ocirc;';
				entities['245'] = '&otilde;';
				entities['246'] = '&ouml;';
				entities['247'] = '&divide;';
				entities['248'] = '&oslash;';
				entities['249'] = '&ugrave;';
				entities['250'] = '&uacute;';
				entities['251'] = '&ucirc;';
				entities['252'] = '&uuml;';
				entities['253'] = '&yacute;';
				entities['254'] = '&thorn;';
				entities['255'] = '&yuml;';
				}

				if (useQuoteStyle !== 'ENT_NOQUOTES') {
				entities['34'] = '&quot;';
				}
				if (useQuoteStyle === 'ENT_QUOTES') {
				entities['39'] = '&#39;';
				}
				entities['60'] = '&lt;';
				entities['62'] = '&gt;';
				
				// ascii decimals to real symbols
				for (decimal in entities) {
				symbol = String.fromCharCode(decimal);
				hash_map[symbol] = entities[decimal];
				}
				
				return hash_map;
			}
		
		},
		
		/*
			-------------------------
			Screen Manipulation
			-------------------------
		*/
		
		screen:
		{
			getSize: null,
			
			IE:
			{
				getSize: function()
				{
					return { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight };
				}
			},
			
			FF:
			{
				getSize: function()
				{
					return { width: window.innerWidth, height: window.innerHeight };
				}
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
				Array.prototype.inArray = 	function(value)
															{
																for (var i=(this.length-1); i>=0; i--)
																{
																	if (this[i] !== value)
																	{
																		continue;
																	}
																	
																	return true;
																}
																
																return false;
															};
				
				Array.prototype.indexOf = 	function(value)
															{
																for (var i=(this.length-1); i>=0; i--)
																{
																	if (this[i] !== value)
																	{
																		continue;
																	}
																	
																	return i;
																}
																
																return -1;
															};
			}
		}
		
	}
	