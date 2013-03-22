	
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
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	