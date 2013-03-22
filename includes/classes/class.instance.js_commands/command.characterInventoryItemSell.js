	
	var log = require( "../class.log" ),
		stats = require( "../class.stats" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.sourceBag == "undefined" ||
			typeof args.res.sourceSlot == "undefined" ||
			/^[0-9]+$/.test( args.res.sourceBag ) == false ||
			/^[0-9]+$/.test( args.res.sourceSlot ) == false
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
		)
		{
			// do not allow selling using the "equiped" bag
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		syncSQL.q(
				"call character_inventory_item_remove( " + args.res.__characterID + ", " + args.res.sourceBag + ", " + args.res.sourceSlot + " )",
				function( res )
				{
					if( res[0].result != 200 )
					{
						// no item found in the slot or misc error
						
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															r: 302
														}) );
						
						return;
					}
					
					// all parameters are ok
					var _ld = args.instanceObject.getArgs().lootData,
						_pp = _ld[ res[ 0 ].ci_id_loot ].loot_sell_price_polen * res[ 0 ].ci_loot_amount;
						_pa = _ld[ res[ 0 ].ci_id_loot ].loot_sell_price_amber * res[ 0 ].ci_loot_amount;
					
					if( _pp != 0 )
					{
						_c.modPolen( _pp, function()
						{
							
						});
					}
					
					if( _pa != 0 )
					{
						_c.modAmber( _pa, function()
						{
							
						});
					}
					
					// add this item to the buyback list
					_c.soldItems.push({
										loot: _ld[ res[ 0 ].ci_id_loot ],
										amount: res[ 0 ].ci_loot_amount
									});
					
					if( _c.soldItems.length > 12 )
					{
						// do not allow more than 12 items in the buyback history
						
						_c.soldItems.shift();
					}
					
					// transaction went ok
					
					_c.events._run( "buyerSoldItem", { itemObject: _ld[ res[ 0 ].ci_id_loot ], amount: res[ 0 ].ci_loot_amount } );
					//_c.events._run( "vendorBoughtItem", { itemObject: _ld[ res[ 0 ].ci_id_loot ], amount: res[ 0 ].ci_loot_amount } );		// this needs a vendorObject. TBI
					
					_c.sendToClient( JSON.stringify({
														c: args.res.c,
														l: _c.soldItems[ _c.soldItems.length - 1 ],
														r: 200
													}) );
					
					// update stats
					stats.incrementNoCallback({
													characterObject: _c,
													name: "lifetime_inventory_item_sales",
													value: 1
												});
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	