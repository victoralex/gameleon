	
	var log = require( "../class.log" ),
		stats = require( "../class.stats" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ], _v = null;
		
		if(
			typeof args.res.opi_id == "undefined" ||
			typeof args.res.vendor_id == "undefined" ||
			/^[0-9]+$/.test( args.res.opi_id ) == false ||
			( args.res.vendor_id != null && ( /^[0-9]+$/.test( args.res.vendor_id ) == false || typeof ( _v = args.instanceObject.characters[ args.res.vendor_id ] ) == "undefined" ) )
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 300
											}) );
			
			return;
		}
		
		// get inventory information
		args.sql.query(
						"select `opi_loot_amount`, `opi_id_loot` from `objects_pool_inventories` where `opi_id` = " + args.res.opi_id,
						function( err, result )
						{
							if( err )
							{
								_c.sendToClient( JSON.stringify({
																		c: args.res.c,
																		r: 304
																	}) );
								
								log.addError( "Error getting attached inventory details query result: " + err );
								
								return;
							}
							
							result.fetchAll( function(err, rows)
							{
								if( err )
								{
									_c.sendToClient( JSON.stringify({
																			c: args.res.c,
																			r: 306
																		}) );
									
									log.addError( "Error getting attached inventory details rows: " + err );
									
									return;
								}
								
								if( rows.length != 1 )
								{
									// no returned result. maybe invalid opi_id.
									
									_c.sendToClient( JSON.stringify({
																			c: args.res.c,
																			r: 305
																		}) );
									
									log.addError( "Too many or no opi rows returned");
									
									return;
								}
								
								// all data is ok. ready to start transaction checks
								
								var _ld = args.instanceObject.getArgs().lootData,
									_pp = _ld[ rows[ 0 ].opi_id_loot ].loot_buy_price_polen * rows[ 0 ].opi_loot_amount,
									_pa = _ld[ rows[ 0 ].opi_id_loot ].loot_buy_price_amber * rows[ 0 ].opi_loot_amount;
								
								if(
									_c.properties.character_polen < _pp
									|| _c.properties.character_amber < _pa
								)
								{
									// not enough resources to purchase
									
									_c.sendToClient( JSON.stringify({
																		c: args.res.c,
																		r: 301
																	}) );
									
									return;
								}
								
								// resources ok. item requested is ok. perform transaction
								
								syncSQL.q(
										"call character_inventory_vendor_item_add( " + _c.properties.character_id + ", " + args.res.opi_id + " )",
										function( res )
										{
											if( res[0].result == 300 )
											{
												// no space for the item
												
												_c.sendToClient( JSON.stringify({
																					c: args.res.c,
																					opi_id: args.res.opi_id,
																					r: 302
																				}) );
												
												return;
											}
											
											if( res[0].result != 200 )
											{
												// misc error
												
												_c.sendToClient( JSON.stringify({
																					c: args.res.c,
																					opi_id: args.res.opi_id,
																					r: 303
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
																											r: 307
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
																												r: 308
																											}) );
																		
																		log.addError( "Error getting updated inventory details rows: " + err );
																		
																		return;
																	}
																	
																	// transaction went ok
																	
																	if( _pp != 0 )
																	{
																		_c.modPolen( -_pp, function()
																		{
																			
																		});
																	}
																	
																	if( _pa != 0 )
																	{
																		_c.modAmber( -_pa, function()
																		{
																			
																		});
																	}
																	
																	if( _v != null )
																	{
																		_v.events._run( "vendorSoldItem", { toCharacterObject: _c, itemID: res[ 0 ].itemID } );
																	}
																	
																	_c.events._run( "buyerBoughtItem", { fromCharacterObject: _c, itemID: res[ 0 ].itemID } );
																	
																	_c.sendToClient( JSON.stringify({
																										c: args.res.c,
																										item_id: res[ 0 ].itemID,
																										item_quantity: res[ 0 ].quantity,
																										opi_id: args.res.opi_id,
																										l: rows,
																										r: 200
																									}) );
																	
																	// update stats
																	stats.incrementNoCallback({
																									characterObject: _c,
																									name: "lifetime_purchased_items_amount",
																									value: 1
																								});
																});
															}
														);
										}
									);
							});
						}
					);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	