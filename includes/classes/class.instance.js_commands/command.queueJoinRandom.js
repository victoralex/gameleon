	
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		// send this message to the master process
		process.send({
						cmd: "queueJoinRandom",
						uid: args.res.__userID,
						cid: args.res.__characterID
					});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	