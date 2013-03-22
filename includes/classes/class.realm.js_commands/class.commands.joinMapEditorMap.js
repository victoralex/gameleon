
	var log = require( "../class.log" ),
		syncSQL = new (require('../class.syncSQL')).p,
		character = require('../class.character'),
		queue = require( '../class.queue' );
	
	exports.performCommand = function( args )
	{
		
		args.ws.sessionData.editorMapID = args.res.bid;
		
		return;
		
	}