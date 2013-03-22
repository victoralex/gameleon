
	var log = require( "../class.log" ),
		chatChannel = require( "../class.chatChannel" );
	
	exports.performCommand = function( args )
	{
		var _iO = args.instanceObject, _c = _iO.characters[ args.res.__characterID ], _zd = _iO.zoneData;
		
		// prevent the auto countdown's timeout
		_c.stopDisconnectCountdown();
		
		_c.joinDate = new Date();
		
		// reconnect to the redis store
		// needed for quests to work
		
		_c.connectToRedis(function()
		{
			// run attached scripts
			_iO.events._run( "reconnectCharacter", { characterObject: _c } );
			
			// this user is already in the instance. the client just needs a refresh on its data
			_c.sendToClient( JSON.stringify({
												c: "characterActive",
												r: 200,
												characterData: _c.properties,
												assignedZoneID: _iO.zone_id,
												assignedZonePoolID: _iO.zone_id_zone_pool,
												assignedZoneRules: _zd.zp_type,
												assignedSurface: _iO.getSurface(),
												assignedZoneName: _zd.zp_name,
												tic_interval: _iO.tic_interval
											}) );
			
			// simmulate joining chat channels
			
			_c.sendToClient( JSON.stringify({
												c: "joinChannel",
												r: 200,
												channelName: "general",
												channelType: "instance"
											}) );
			
			_c.sendToClient( JSON.stringify({
												c: "joinChannel",
												r: 200,
												channelName: "say",
												channelType: "say"
											}) );
			
			_c.sendToClient( JSON.stringify({
												c: "joinChannel",
												r: 200,
												channelName: "yell",
												channelType: "yell"
											}) );
		});
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	