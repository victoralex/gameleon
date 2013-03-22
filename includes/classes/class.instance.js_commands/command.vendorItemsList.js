	
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		// fetch the buffs associated with this character
		args.sql.query(
				"select `loot`.`loot_id`, `objects_pool_inventories`.`opi_id`, `objects_pool_inventories`.`opi_loot_amount` " + 
					" from `loot` " +
					" inner join `objects_pool_inventories` on `objects_pool_inventories`.`opi_id_loot` = `loot`.`loot_id` " +
					" inner join `characters` on `characters`.`character_id_object_pool` = `objects_pool_inventories`.`opi_id_object_pool` " +
					" where `characters`.`character_id` = " + args.res.vID +
					" order by `loot`.`loot_level` asc",
				function( err, result )
				{
					if( err )
					{
						_c.sendToClient( JSON.stringify({
																c: args.res.c,
																r: 300
															}) );
						
						return;
					}
					
					result.fetchAll( function(err, rows)
					{
						if( err )
						{
							_c.sendToClient( JSON.stringify({
																	c: args.res.c,
																	r: 301
																}) );
							
							return;
						}
						
						var returnedLoot = {}, _ld = args.instanceObject.getArgs().lootData;
						
						for(var i=0;i<rows.length;i++)
						{
							returnedLoot[ rows[ i ].loot_id ] = JSON.parse( JSON.stringify( _ld[ rows[ i ].loot_id ] ) );
							returnedLoot[ rows[ i ].loot_id ].loot_buy_price_polen *= rows[ i ].opi_loot_amount;
							returnedLoot[ rows[ i ].loot_id ].loot_buy_price_amber *= rows[ i ].opi_loot_amount;
							returnedLoot[ rows[ i ].loot_id ].opi_id = rows[ i ].opi_id;
							returnedLoot[ rows[ i ].loot_id ].opi_loot_amount = rows[ i ].opi_loot_amount;
						}
						
						_c.sendToClient( JSON.stringify({
																c: args.res.c,
																l: returnedLoot,
																b: _c.soldItems,
																r: 200
															}) );
					} );
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	