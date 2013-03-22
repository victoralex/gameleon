	
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		// fetch the buffs associated with this character
		args.sql.query(
				"select * " +
					" from `character_interface_actionbars_full` " +
					" where `cia_id_character` = " + _c.properties.character_id +
					" order by `cia_actionbar_slot` asc",
				function( err, result )
				{
					if( err )
					{
						_c.sendToClient( JSON.stringify({
																			c: args.res.c,
																			r: 301
																		}) );
						
						return;
					}
					
					result.fetchAll( function(err, rows)
					{
						if( err )
						{
							_c.sendToClient( JSON.stringify({
																				c: args.res.c,
																				r: 302
																			}) );
							
							return;
						}
						
						_c.sendToClient( JSON.stringify({
																			c: args.res.c,
																			b: rows,
																			r: 200
																		}) );
					} );
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	