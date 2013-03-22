	
	var log = require( "../class.log" );
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if(
			typeof args.res.target_id == "undefined" ||
			/^[0-9]+$/.test( args.res.target_id ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		var _targetCharacter = args.instanceObject.characters[ args.res.target_id ];
		if( !_targetCharacter )
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												t: args.res.target_id,
												r: 302
											}) );
			
			return;
		}
		
		// perform command
		_c.sendToClient( JSON.stringify({
												c: args.res.c,
												s: args.res.__characterID,
												t: args.res.target_id,
												r: _c.command_use( _targetCharacter ) ? 200 : 303
											}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	