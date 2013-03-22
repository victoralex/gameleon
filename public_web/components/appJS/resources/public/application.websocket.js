
	Application.websocket = {
		
		socket: null,
		reconnectTimeout: 1000,
		handlers: {},
		
		reconnects: 0,
		
		URI: null,
		
		// Event handling
		
		event:
		{
			_events: {},
			
			add: function( eventName, callBack )
			{
				if( !this._events[ eventName ] )
				{
					this._events[ eventName ] = [];
				}
				
				this._events[ eventName ].push( callBack );
			},
			
			remove: function( eventName, callBack )
			{
				var _e = this._events[ eventName ];
				
				for(var i in _e )
				{
					if( _e[ i ] != callBack )
					{
						continue;
					}
					
					delete this._events[ eventName ][ i ];
					
					return true;
				}
				
				return false;
			},
			
			run: function( eventName, params )
			{
				var _e = this._events[ eventName ];
				
				for(var i in _e )
				{
					_e[ i ]( params, Application.websocket.socket );
				}
			}
		},
		
		// Default functions
		
		_onclose: function()
		{
			// automatically reconnect
			
			Component.bugcraft.pageLoader.setDisconnected();
			
			//Application.debug.addError( "Unable to connect to realm " + Application.websocket.URI );
			
			setTimeout(
					Application.websocket._connect,
					Application.websocket.reconnectTimeout
				);
		},
		
		_onerror: function( e )
		{
			Component.bugcraft.pageLoader.setDisconnected();
			
			//Application.debug.addError( "Unable to connect to realm " + Application.websocket.URI );
		},
		
		_onmessage: function( e )
		{
			var _result = JSON.parse( e.data ), _h = Application.websocket.handlers[ _result.c ];
			
			if( _h )
			{
				_h( _result, Application.websocket.socket );
			}
			else
			{
				Application.debug.addError( "no handler found for " + _result.c );
				
				Application.websocket.event.run( _result.c, _result );
			}
			
			/*
			try
			{
				Application.websocket.handlers[ _result.c ]( _result, Application.websocket.socket );
				
				return;
			}
			catch( e )
			{
				Application.debug.addError( "WS Error @ handler " + _result.c + " - " + e);
			}
			*/
		},
		
		_onopen: function()
		{
			Application.websocket.reconnects++;
			
			if( Application.websocket.reconnects > 1 )
			{
				// refresh to ensure proper variables reinitialization
				
				document.location.reload();
			}
			
			//Application.debug.add("Connected to realm");
		},
		
		_connect: function()
		{
			//Application.debug.add( "Connecting to realm" );
			
			Application.websocket.URI = "ws://" + Application.configuration.siteURL + ":10080/";
			
			Application.websocket.socket = new WebSocket( Application.websocket.URI );
			
			Application.websocket.socket.onopen = Application.websocket._onopen;
			Application.websocket.socket.onmessage = Application.websocket._onmessage;
			Application.websocket.socket.onclose = Application.websocket._onclose;
			Application.websocket.socket.onerror = Application.websocket._onerror;
		},
		
		init: function( args )
		{
			if (window.WebSocket)
			{
				args.afterFunction();
				
				return;
			};
			
			if( window.MozWebSocket )
			{
				window.WebSocket = window.MozWebSocket;
				
				args.afterFunction();
				
				return;
			};
			
			Application.debug.addError( "No websocket support. Unable to continue" );
		}
	};
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	