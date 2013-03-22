	
	var log = require( "../class.log" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.targetSlot == "undefined" ||
			/^[0-9]+$/.test( args.res.targetSlot ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		if(
			typeof args.res.targetActionBar == "undefined" ||
			/^(actionbar1|actionbar2)$/.test( args.res.targetActionBar ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 302
											}) );
			
			return;
		}
		
		syncSQL.q(
					"call character_buff_slot_delete(" + _c.properties.character_id + ", '" + args.res.targetActionBar + "', " + args.res.targetSlot + ")",
					function( res )
					{
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															r: res[0].result
														}) );
					}
				);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	