	
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		// fetch the talent tree buffs associated with this character
		args.sql.query(
				"select `buffs`.`buff_id`, `character_spellbook`.`cs_id`, `buffs`.`buff_tree`, `buffs`.`buff_points`, `buffs`.`buff_name`, `buffs`.`buff_description` " + 
					" from `buffs` " +
					" left join `character_spellbook` on ( `buffs`.`buff_id` = `character_spellbook`.`cs_id_buff` and `character_spellbook`.`cs_id_character` = " + _c.properties.character_id + " ) " +
					" where " + ( ( _c.properties.character_class == 'soldier' ) ? ( "`buffs`.`buff_tree` = 'champion' or `buffs`.`buff_tree` = 'conqueror'" ) : ( ( _c.properties.character_class == 'scout' ) ? ( "`buffs`.`buff_tree` = 'guide' or `buffs`.`buff_tree` = 'stalker'" ) : ( "`buffs`.`buff_tree` = 'sage' or `buffs`.`buff_tree` = 'enzymage'" ) ) ) +
					" order by `buffs`.`buff_points`, `buffs`.`buff_name` asc",
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
																		ps: _c.properties.character_talent_points_spent,
																		pt: _c.properties.character_talent_points_total,
																		r: 200
																	}) );
					} );
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	