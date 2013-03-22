	
	var log = require( "../class.log" ),
		stats = require( "../class.stats" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.cid == "undefined" ||
			typeof args.res.itemPosition == "undefined" ||
			/^[0-9]+$/.test( args.res.cid ) == false ||
			/^[0-9]+$/.test( args.res.itemPosition ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
													c: args.res.c,
													r: 300
												}) );
			
			return;
		}
		
		var _bagCarrier = args.instanceObject.characters[ args.res.cid ];
		
		if( !_bagCarrier )
		{
			_c.sendToClient( JSON.stringify({
													c: args.res.c,
													r: 301
												}) );
			
			return;
		}
		
		var _i = _bagCarrier.lootBagAttached[ args.res.itemPosition ];
		
		if( !_i )
		{
			// there is no item in the bag, at the requested position
			
			_c.sendToClient( JSON.stringify({
													c: args.res.c,
													r: 303
												}) );
			
			return;
		}
		
		// all ok. ready to perform transaction
		
		syncSQL.q(
				"call character_inventory_item_add( " + _c.properties.character_id + ", " + _i.loot.loot_id + ", " + _i.amount + " )",
				function( res )
				{
					if( res[0].result == 300 )
					{
						// no space for the item
						
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															i: _i,
															r: 304
														}) );
						
						return;
					}
					
					if( res[0].result != 200 )
					{
						// misc error
						
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															i: _i,
															r: 305
														}) );
						
						return;
					}
					
					// fetch the new inventory
					args.sql.query(
									"select * from `character_inventory_full` " +
										" where `ci_id_character` = " + args.res.__characterID + " and `loot_id` is not null and `ci_slot_bag` != 1",
									function( err, result )
									{
										if( err )
										{
											_c.sendToClient( JSON.stringify({
																					c: args.res.c,
																					r: 306
																				}) );
											
											log.addError( "Error getting updated inventory query result: " + err );
											
											return;
										}
										
										result.fetchAll( function(err, rows)
										{
											if( err )
											{
												_c.sendToClient( JSON.stringify({
																						c: args.res.c,
																						r: 307
																					}) );
												
												log.addError( "Error getting updated inventory details rows: " + err );
												
												return;
											}
											
											// transaction went ok
											
											_c.events._run( "lootGrab", { fromCharacterObject: _bagCarrier, item: _i } );
											_bagCarrier.events._run( "lootGiven", { toCharacterObject: _c, item: _i } );
											
											// send ok status to the issuer
											_c.sendToClient( JSON.stringify({
																				c: args.res.c,
																				r: 200
																			}) );
											
											// send details about the new bag configuration to the issuer
											_c.sendToClient( JSON.stringify({
																				c: "lootReceive",
																				l: _i.loot,
																				i: rows,
																				r: 200
																			}) );
											
											if( _i.loot.loot_is_quest_item == null )
											{
												// send updates to all interested parties
												for(var i=0;i<_bagCarrier.lootBagInterestedParties.length;i++)
												{
													var _ip = _bagCarrier.lootBagInterestedParties[ i ];
													
													_ip.sendToClient( JSON.stringify({
																						c: "lootGrabSlotEmpty",
																						tid: _bagCarrier.properties.character_id,
																						p: args.res.itemPosition
																					}) );
												}
												
												// remove the item from the bag
												delete _bagCarrier.lootBagAttached[ args.res.itemPosition ];
											}
											else
											{
												// send update just to this party
												_c.sendToClient( JSON.stringify({
																					c: "lootGrabSlotEmpty",
																					tid: _bagCarrier.properties.character_id,
																					p: args.res.itemPosition
																				}) );
												
												_i.lootableBy.splice(
																	_i.lootableBy.indexOf( args.res.__characterID ),
																	1
																);
											}
											
											// update stats
											stats.incrementNoCallback({
																			characterObject: _c,
																			name: "lifetime_looted_items_amount",
																			value: 1
																		});
											
											stats.incrementNoCallback({
																			characterObject: _bagCarrier,
																			name: "lifetime_given_items_amount",
																			value: 1
																		});
										});
									}
								);
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	