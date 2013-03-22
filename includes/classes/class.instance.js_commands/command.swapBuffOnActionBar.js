	
	var log = require( "../class.log" ),
		syncSQL = new (require('../class.syncSQL')).p;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.sourceActionBar == "undefined" ||
			/^(actionbar1|actionbar2)$/.test( args.res.sourceActionBar ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		if(
			typeof args.res.sourceSlot == "undefined" ||
			/^[0-9]+$/.test( args.res.sourceSlot ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 302
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
												r: 303
											}) );
			
			return;
		}
		
		if(
			typeof args.res.targetSlot == "undefined" ||
			/^[0-9]+$/.test( args.res.targetSlot ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 304
											}) );
			
			return;
		}
		
		syncSQL.q(
					"call character_buff_slot_swap(" + _c.properties.character_id + ", '" + args.res.sourceActionBar + "', " + args.res.sourceSlot + ", '" + args.res.targetActionBar + "', " + args.res.targetSlot + ")",
					function( res )
					{
						_c.sendToClient( JSON.stringify({
															c: args.res.c,
															r: res[0].result
														}) );
					}
				);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	