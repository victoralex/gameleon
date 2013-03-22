	
	var log = require( "../class.log" ),
		stats = require( "../class.stats" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.sourceBag == "undefined" ||
			typeof args.res.sourceSlot == "undefined" ||
			typeof args.res.targetBag == "undefined" ||
			typeof args.res.targetSlot == "undefined" ||
			/^[0-9]+$/.test( args.res.sourceBag ) == false ||
			/^[0-9]+$/.test( args.res.sourceSlot ) == false ||
			/^[0-9]+$/.test( args.res.targetBag ) == false ||
			/^[0-9]+$/.test( args.res.targetSlot ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 300
											}) );
			
			return;
		}
		
		if(
			args.res.sourceBag == 1
			|| args.res.targetBag == 1
		)
		{
			// do not allow mergers on the "equiped" bag
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		// all parameters are ok
		
		syncSQL.q(
				"call character_inventory_item_merge( " + args.res.__characterID + ", " + args.res.sourceBag + ", " + args.res.sourceSlot + ", " + args.res.targetBag + ", " + args.res.targetSlot + " )",
				function( res )
				{
					if( res[0].result != 200 && res[0].result != 201 )
					{
						// misc error
						
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															r: 302
														}) );
						
						return;
					}
					
					// fetch the new inventory
					args.sql.query(
									"select * from `character_inventory_full` " +
										" where " +
											" `ci_id_character` = " + args.res.__characterID +
											" and ( ( `ci_slot_bag` = " + args.res.sourceBag + " and `ci_slot_order` = " + args.res.sourceSlot + " ) or ( `ci_slot_bag` = " + args.res.targetBag + " and `ci_slot_order` = " + args.res.targetSlot + " ) ) ",
									function( err, result )
									{
										if( err )
										{
											_c.sendToClient( JSON.stringify({
																					c: args.res.c,
																					r: 303
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
																						r: 304
																					}) );
												
												log.addError( "Error getting updated inventory details rows: " + err );
												
												return;
											}
											
											// transaction went ok
											
											_c.sendToClient( JSON.stringify({
																				c: args.res.c,
																				l: rows,
																				r: 200
																			}) );
											
											// update stats
											stats.incrementNoCallback({
																			characterObject: _c,
																			name: "lifetime_inventory_item_mergers",
																			value: 1
																		});
										});
									}
								);
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	