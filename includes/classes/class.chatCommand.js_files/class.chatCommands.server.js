	
	var log = require( "../class.log" ),
			stats = require( "../class.stats" );
	
	exports.performCommand = function( args )
	{
		var _c = args.characterObject, _progressionRequested = null;
		
		if(
			typeof args.res.parameters == "undefined"
			|| /^[0-9a-zA-Z ]+$/.test( args.res.parameters ) == false
		)
		{
			// send the invalid parameters error
			
			_c.sendToClient( JSON.stringify({
												c: "chatCommand",
												r: 400
											}) );
			
			return;
		}
		
		var _tokens = args.res.parameters.toLowerCase().split( " " );
		
		switch( _tokens[ 0 ] )
		{
			case "instancestart":
				
				if( !_tokens[ 1 ] || /^[0-9]+$/.test( _tokens[ 1 ] ) == false )
				{
					// unrecognized chat command
					
					_c.sendToClient( JSON.stringify({
														c: "chatCommand",
														r: 401
													}) );
					
					return;
				}
				
				_c.getInstance().getArgs().instanceProcess.messageToRealm(
																							{
																								cmd: "queueCreateInstance",
																								bid: _tokens[ 1 ],
																								uid: args.res.__userID,
																								cid: args.res.__characterID
																							},
																							function( result )
																							{
																								_c.sendToClient( JSON.stringify({
																																	c: "chatCommand",
																																	t: "Instance " + result.iID + " ( " + _tokens[ 1 ] + " ) has started",
																																	r: 200
																																}) );
																							}
																						);
				
			break;
			case "instancestop":
				
				// T B I
				
			break;
			case "instanceswitch":
				
				if( !_tokens[ 1 ] || /^[0-9]+$/.test( _tokens[ 1 ] ) == false )
				{
					// unrecognized chat command
					
					_c.sendToClient( JSON.stringify({
														c: "chatCommand",
														r: 401
													}) );
					
					return;
				}
				
				args.instanceProcess.sql.query(
												"select `zp_name` from `zones_pool` where `zp_faction_allowed` = '" + _c.properties.character_faction + "' and `zp_id` = " + _tokens[ 1 ],
												function( err, res )
												{
													if( err )
													{
														log.addError( "Character compatibility to instance query error: " + err );
														
														return;
													}
													
													res.fetchAll( function (err, rows)
													{
														if( err )
														{
															log.addError( "Character compatibility to instance rows fetch error: " + err );
															
															return;
														}
														
														if( rows.length == 0 )
														{
															_c.sendToClient( JSON.stringify({
																								c: "chatCommand",
																								r: 402
																							}) );
															
															return;
														}
														
														// send a message to the requester
														
														_c.sendToClient( JSON.stringify({
																							c: "chatCommand",
																							t: "Aye, captain! Instance " + rows[ 0 ].zp_name + " ( " + _tokens[ 1 ] + " ) is starting",
																							r: 200
																						}) );
														
														// start the process
														
														var _iPO = _c.getInstance().getArgs().instanceProcess;
														
														_iPO.messageToRealm(
																				{
																					cmd: "queueCreateInstance",
																					bid: _tokens[ 1 ],
																					uid: args.res.__userID,
																					cid: args.res.__characterID
																				},
																				function( result )
																				{
																					_iPO.messageToRealm(
																											{
																												cmd: "queueAddForced",
																												zID: result.iID,
																												uid: args.res.__userID,
																												cid: args.res.__characterID
																											},
																											function( result )
																											{
																												log.add( "Teleport instance result: " + result.r );
																											}
																										);
																				}
																			);
													});
												}
											);
				
			break;
			case "instanceteleport":
				
				_c.getInstance().getArgs().instanceProcess.messageToRealm(
																							{
																								cmd: "queueAddForced",
																								zID: _tokens[ 1 ],
																								uid: args.res.__userID,
																								cid: args.res.__characterID
																							},
																							function( result )
																							{
																								log.add( "Teleport instance result: " + result.r );
																							}
																						);
				
			break;
			default:
				
				// unrecognized chat command
				
				_c.sendToClient( JSON.stringify({
													c: "chatCommand",
													r: 401
												}) );
				
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	