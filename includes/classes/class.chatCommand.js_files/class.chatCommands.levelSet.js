	
	var log = require( "../class.log" ),
			stats = require( "../class.stats" );
	
	exports.performCommand = function( args )
	{
		var _c = args.characterObject, _progressionRequested = null;
		
		if(
			typeof args.res.parameters == "undefined"
			|| typeof args.res.parameters.levelNumber == "undefined"
			|| typeof args.res.parameters.characterID == "undefined"
			|| /^[0-9]+$/.test( args.res.parameters.levelNumber ) == false
			|| /^[0-9]+$/.test( args.res.parameters.characterID ) == false
			|| !_c.getInstance().characters[ args.res.parameters.characterID ]
			|| !( _progressionRequested = _c.getArgs().characterProgression[ args.res.parameters.levelNumber ] )
		)
		{
			// send the invalid parameters error
			
			_c.sendToClient( JSON.stringify({
												c: "chatCommand",
												r: 400
											}) );
			
			return;
		}
		
		_c.modXP(
				_progressionRequested.cdlp_start_xp - _c.properties.character_xp_current + 1,
				function()
				{
					log.addNotice( "Level set for " + _c.properties.character_id + " to " + _c.properties.character_level );
				}
			);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	