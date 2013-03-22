	
	var log = require( "../class.log" ),
		stats = require( "../class.stats" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.itemOrder == "undefined" ||
			/^[0-9]+$/.test( args.res.itemOrder ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 300
											}) );
			
			return;
		}
		
		if(
			typeof _c.soldItems[ args.res.itemOrder ] == "undefined"
		)
		{
			// no item in the requested slot
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		var _bbItem = _c.soldItems[ args.res.itemOrder ],
			_pp = _bbItem.loot.loot_sell_price_polen * _bbItem.amount,
			_pa = _bbItem.loot.loot_sell_price_amber * _bbItem.amount;
		
		if(
			_c.properties.character_polen < _pp
			|| _c.properties.character_amber < _pa
		)
		{
			// not enough resources to buy the item back
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 302
											}) );
			
			return;
		}
		
		syncSQL.q(
				"call character_inventory_item_add( " + args.res.__characterID + ", " + _bbItem.loot.loot_id + ", " + _bbItem.amount + " )",
				function( res )
				{
					if( res[0].result == 300 )
					{
						// no space for the item
						
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															opi_id: args.res.opi_id,
															r: 303
														}) );
						
						return;
					}
					
					if( res[0].result != 200 )
					{
						// misc error
						
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															opi_id: args.res.opi_id,
															r: 304
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
																					r: 305
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
																						r: 306
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
											
											// remove the item from the buyback list
											_c.soldItems.splice( args.res.itemOrder, 1 );
											
											_c.sendToClient( JSON.stringify({
																				c: args.res.c,
																				item_id: res[ 0 ].itemID,
																				item_quantity: res[ 0 ].quantity,
																				order: args.res.itemOrder,
																				l: rows,
																				r: 200
																			}) );
											
											// update stats
											stats.incrementNoCallback({
																			characterObject: _c,
																			name: "lifetime_inventory_item_buybacks",
																			value: 1
																		});
										});
									}
								);
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	