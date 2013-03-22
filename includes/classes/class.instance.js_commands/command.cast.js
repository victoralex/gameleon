
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
		
		if(
			typeof args.res.buff_id == "undefined" ||
			/^[0-9]+$/.test( args.res.buff_id ) == false
		)
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												r: 302
											}) );
			
			return;
		}
		
		//
		// validation ok. check logical
		//
		
		var _targetCharacter = _c.getInstance().characters[ args.res.target_id ];
		if( !_targetCharacter )
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												b: args.res.buff_id,
												t: args.res.target_id,
												r: 303
											}) );
			
			return;
		}
		
		var _sourceBuff = _c.buffs[ args.res.buff_id ];
		if( !_sourceBuff )
		{
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												b: args.res.buff_id,
												t: args.res.target_id,
												r: 304
											}) );
			
			return;
		}
		
		if( _c.properties.character_is_alive == null )
		{
			// can't cast while dead
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												b: args.res.buff_id,
												t: args.res.target_id,
												r: 305
											}) );
			
			return false;
		}
		
		if( _targetCharacter.properties.character_is_alive == null )
		{
			// can't cast on a dead target
			
			_c.sendToClient( JSON.stringify({
												c: args.res.c,
												b: args.res.buff_id,
												t: args.res.target_id,
												r: 306
											}) );
			
			return false;
		}
		
		_c.command_cast(
						_sourceBuff,
						_targetCharacter,
						function( result )
						{
							if( result.r == 300 )
							{
								// cannot target
								
								_c.sendToClient( JSON.stringify({
																	c: args.res.c,
																	b: args.res.buff_id,
																	t: args.res.target_id,
																	r: 307
																}) );
								return;
							}
							
							if( result.r == 301 )
							{
								// cannot cast while moving
								
								_c.sendToClient( JSON.stringify({
																	c: args.res.c,
																	b: args.res.buff_id,
																	t: args.res.target_id,
																	r: 308
																}) );
								
								return;
							}
							
							if( result.r == 302 )
							{
								// buff is in cooldown
								
								_c.sendToClient( JSON.stringify({
																	c: args.res.c,
																	b: args.res.buff_id,
																	t: args.res.target_id,
																	r: 309
																}) );
								
								return;
							}
							
							_c.changeRotationToCharacterAndBroadcast( _targetCharacter );
							
							_c.sendToClient( JSON.stringify({
																cds: result.buff.buff_cooldown_seconds,
																bid: args.res.buff_id,
																c: args.res.c,
																r: 200
															}) );
						}
					);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	