	
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		// fetch the buffs associated with this character
		args.sql.query(
				"select * from `character_inventory_full` " +
					" where `character_inventory_full`.`ci_id_character` = " + args.res.__characterID,
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
						
						_c.sendToClient( JSON.stringify({
																c: args.res.c,
																l: rows,
																r: 200
															}) );
					} );
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	