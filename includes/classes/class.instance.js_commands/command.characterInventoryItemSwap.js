	
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
		
		//log.add("call character_inventory_item_swap( " + args.res.__characterID + ", " + args.res.sourceBag + ", " + args.res.sourceSlot + ", " + args.res.targetBag + ", " + args.res.targetSlot + " )");
		
		// all parameters are ok
		syncSQL.q(
				"call character_inventory_item_swap( " + args.res.__characterID + ", " + args.res.sourceBag + ", " + args.res.sourceSlot + ", " + args.res.targetBag + ", " + args.res.targetSlot + " )",
				function( res )
				{
					if( res[0].result != 200 )
					{
						// misc error
						
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															r: 301
														}) );
						
						return;
					}
					
					if(
						res[0].result == 200
						&& ( args.res.targetBag == 1 || args.res.sourceBag == 1 )
					)
					{
						// have changed an item on self. change global stats
						
						for(var i in res[0])
						{
							if( i.toString().indexOf( "character_" ) != 0 )
							{
								continue;
							}
							
							if( _c.properties[ i ] == res[ 0 ][ i ] )
							{
								// the attribute hasn't changed
								
								continue;
							}
							
							// the attribute has changed
							
							_c.sendToClient( JSON.stringify({
																	c: "updateBattleField",
																	r: 200,
																	updates: [{
																			cid: _c.properties.character_id,
																			c: "modify",
																			a: i.toString().replace( "character_", "" ),
																			m: res[ 0 ][ i ] - _c.properties[ i ]
																		}]
																}) );
							
							_c.properties[ i ] = res[ 0 ][ i ];
						}
					}
					
					// transaction went ok
					
					_c.sendToClient( JSON.stringify({
														c: args.res.c,
														r: 200
													}) );
					
					// update stats
					stats.incrementNoCallback({
													characterObject: _c,
													name: "lifetime_inventory_item_swaps",
													value: 1
												});
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	