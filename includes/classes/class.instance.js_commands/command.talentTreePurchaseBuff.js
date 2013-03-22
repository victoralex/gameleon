	
	var log = require( "../class.log" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		if(
			typeof args.res.tid == "undefined" ||
			/^[0-9]+$/.test( args.res.tid ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		// get current character
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			_c.properties.character_talent_points_spent >= _c.properties.character_talent_points_total
		)
		{
			// not enough talent points available
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 302
											}) );
			
			return;
		}
		
		if(
			_c.buffs[ args.res.tid ]
		)
		{
			// buff already exists in the spellbook
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 303
											}) );
			
			return;
		}
		
		var _tb = args.instanceObject.getArgs().buffsStructure[ args.res.tid ];
		
		if(
			( _c.properties.character_class == "soldier" && _tb.buff_tree != "champion" && _tb.buff_tree != "conqueror" )
			|| ( _c.properties.character_class == "scout" && _tb.buff_tree != "guide" && _tb.buff_tree != "stalker" )
			|| ( _c.properties.character_class == "noble" && _tb.buff_tree != "sage" && _tb.buff_tree != "enzymage" )
		)
		{
			// tried to purchase smth that is not for my class
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 304
											}) );
			
			return;
		}
		
		if(
			_tb.buff_tree_parent_id_buff != null
			&& typeof _c.buffs[ _tb.buff_tree_parent_id_buff ] == "undefined"
		)
		{
			// there is a parent to this buff and i don't have the parent in my spellbook. can't purchase this child
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 305
											}) );
			
			return;
		}
		
		syncSQL.q(
					"call character_spellbook_buff_add( " + _c.properties.character_id + ", " + args.res.tid + " )",
					function( res )
					{
						if( res[0].result != 200 )
						{
							log.addError( "Received error " + res[0].result + " while calling character_spellbook_buff_add" );
							
							return;
						}
						
						// create buff entry in the buffs list for this character
						_c.properties.character_talent_points_spent = res[0].character_talent_points_spent;
						_c.buffs[ args.res.tid ] = {};
						
						for(var i in res[0])
						{
							if( i.indexOf( "buff_" ) == -1 && i.indexOf( "cs_" ) == -1 )
							{
								continue;
							}
							
							// add properties
							_c.buffs[ args.res.tid ][ i ] = res[ 0 ][ i ];
						}
						
						// let everybody know this event
						_c.addHistory({
										c: "buff_purchase"
									});
						
						// send specifics only to the player
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															bd: _c.buffs[ args.res.tid ],
															cs_id: res[0].characterSpellbookID,
															ps: res[0].character_talent_points_spent,
															pt: res[0].character_talent_points_total,
															r: 200
														}) );
					}
				);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	