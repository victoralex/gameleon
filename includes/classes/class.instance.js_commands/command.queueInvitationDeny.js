	
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.bid == "undefined"
			|| /^[0-9]+$/.test( args.res.bid ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		// send the message to the realm
		process.send({
						cmd: "queueLeaveAllButCurrentInstance",
						uid: args.res.__userID,
						cid: args.res.__characterID,
						zID: args.res.bid
					});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	