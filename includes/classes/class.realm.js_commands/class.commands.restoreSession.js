
	var log = require( "../class.log" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		if( /^[a-z0-9]+$/.test( args.res.sessionToken ) == false )
		{
			args.ws.sendUTF( JSON.stringify({
												c: args.res.c,
												r: 300
											}) );
			
			return;
		}
		
		// attempt a database restore using the session hash
		
		syncSQL.q(
					"call session_restore('" + args.res.sessionToken + "')",
					function( res )
					{
						if( res[0].result != 200 )
						{
							log.add( "Session restore failed with " + JSON.stringify( res[0] ) );
							
							args.ws.sendUTF( JSON.stringify({
																c: args.res.c,
																r: 301
															}) );
							
							return;
						}
						
						// attach this user to the realm-wide list
						
						/*
						if( args.realm._users[ res[0].user_id ] )
						{
							// user is already registered with this realm
							var _ccO = args.realm._users[ res[0].user_id ].characterObject, _iO = args.realm._users[ res[0].user_id ].instanceObject;
							
							// update the websocket. the old one is dead
							args.realm._users[ res[0].user_id ] = args.ws;
							
							if( _ccO )
							{
								args.realm._users[ res[0].user_id ].characterObject = _ccO;
								args.realm._users[ res[0].user_id ].instanceObject = _iO;
								
								_ccO.setSocket( args.ws );
							}
						}
						else
						{
							// add the new user to the realm
							
							args.realm._users[ res[0].user_id ] = args.ws;
						}
						*/
						
						
						
						if( args.realm._users[ res[0].user_id ] )
						{
							// connection already exists. it must be a refresh. the new websocket needs to have the previous' options
							
							var _previousSessionConnection = args.realm._users[ res[0].user_id ];
							
							// assign the instance object to the new connection
							args.ws.instanceObject = _previousSessionConnection.instanceObject;
							args.ws.nextInstanceObject = _previousSessionConnection.nextInstanceObject;
							args.ws.sessionData = _previousSessionConnection.sessionData;
							
							// reset the character ID
							args.ws.sessionData.characterID = ( res[0].character_is_active == 'true' || args.ws.nextInstanceObject ) ? res[0].user_id_selected_character : null;
						}
						else
						{
							// new connection
							log.addWarning( "user " + res[0].user_id + " connected" );
								
							args.ws.sessionData = {
														userID: res[0].user_id,
														characterID: ( res[0].character_is_active == 'true' || args.ws.nextInstanceObject ) ? res[0].user_id_selected_character : null
													};
						}
						
						// create / overwrite existing connection
						args.realm._users[ res[0].user_id ] = args.ws;
						
						args.ws.sendUTF( JSON.stringify({
															c: args.res.c,
															sd: args.ws.sessionData,
															r: 200
														}) );
						
						log.add( "Session restored: " + args.res.sessionToken + " using " + JSON.stringify( args.res ) );
					}
				);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	