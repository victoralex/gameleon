
	var log = require( "../class.log" ),
			realmConfig = require( "../../config.realm" ).config;
	
	exports.performCommand = function( args )
	{
		var _c = args.instanceObject.characters[ args.res.__characterID ];
		
		if( _c.availableAmountOfMessagesToSend <= 0 )
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 302
											}) );
			
			return;
		}
		
		_c.availableAmountOfMessagesToSend--;
		
		// increase the number of messages that should be sent when the timeout comes
		setTimeout( function()
		{
			_c.availableAmountOfMessagesToSend++;
		}, realmConfig.chat.limitMessagesInterval );
		
		// perform variable checks
		
		if(
			typeof args.res.command == "undefined"
			|| /^[a-zA-Z0-9]+$/.test( args.res.command ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 301
											}) );
			
			return;
		}
		
		var _command = args.instanceObject.getArgs().instanceProcess._chatCommands[ _c.properties.character_role ][ args.res.command ];
		
		if( !_command )
		{
			//log.add( "Command not found '" + args.res.command.replace(/^\//,'').split(' ')[0] + "'" );
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 300,
												command: args.res.command
											}) );
			
			return;
		}
		
		// perform chat command
		_command.performCommand({
									res: args.res,
									characterObject: _c,
									instanceProcess: args.instanceProcess,
									instanceObject: args.instanceObject
								});
		
		// standard issued response
		_c.sendToClient( JSON.stringify({
											c: args.res.c,
											command: args.res.command,
											r: 200
										}) );
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	