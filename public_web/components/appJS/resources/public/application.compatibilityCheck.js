	
	Application.compatibilityCheck = {
		
		_checkCompatibility: function()
		{
			var _cb = Application.configuration.compatibleBrowsers.browser, _b = Application.util.browserInformation.browser;
			
			for(var i=0;i<_cb.length;i++)
			{
				if( _cb[ i ].name != _b )
				{
					continue;
				}
				
				// this browser is in the compatible list
				
				if( parseInt( _cb[ i ].version ) > parseInt( Application.util.browserInformation.version ) )
				{
					return false;
				}
				
				return true;
			}
			
			// browser not found in the compatible list
			
			return false;
		},
		
		init: function( args )
		{
			if( this._checkCompatibility() )
			{
				args.afterInit();
				
				return;
			}
			
			var _incompatibleScreenObject = document.getElementById( "ascentBrowserIncompatibleScreen" );
			_incompatibleScreenObject.className = "ascentBrowserIncompatibleScreen";
			
			document.body.className = "incompatibleBodyBackground";
		}
		
	}
	