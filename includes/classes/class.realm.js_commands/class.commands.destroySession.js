
	var log = require( "../class.log" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		// attempt a database session destroy
		
		syncSQL.q(
					"call session_destroy('" + args.ws.sessionData.userID + "')",
					function( res )
					{
						if(
							res[0].result != 200 &&
							res[0].result != 201
						)
						{
							log.add( "Session destroy failed with " + args.ws.sessionData.userID );
							
							args.ws.sendUTF( JSON.stringify({
																c: args.res.c,
																r: 301
															}) );
							
							return;
						}
						
						var _sessionDestroyFunction = function( data )
						{
							var response = JSON.parse( data.utf8Data );
							
							if( response.c != "realm_unset" )
							{
								return;
							}
							
							if( response.userID != args.ws.sessionData.userID )
							{
								return;
							}
							
							args.ws.sessionData.characterID = null;
							
							args.ws.sendUTF( JSON.stringify({
																c: args.res.c,
																sd: args.ws.sessionData,
																r: 200
															}) );
							
							// remove this listener
							args.realm.loginServerSocket.removeListener( "message", _sessionDestroyFunction );
							
							log.add( "Session destroyed for " + args.ws.sessionData.userID );
						}
						
						args.realm.loginServerSocket.addListener(
																			'message',
																			_sessionDestroyFunction
																		);
						
						args.realm.loginServerSocket.sendUTF( JSON.stringify({
																						c: "realm_unset",
																						userID: args.ws.sessionData.userID
																					}) );
					}
				);
	}