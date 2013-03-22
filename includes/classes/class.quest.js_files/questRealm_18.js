	
	var log = require( "../class.log" );
	
	exports.questStart = function( args )
	{
		var _co = args.characterObject, _npcObject = _co.getInstance().getObjectsByZonePoolID( 42 );
		
		if( _npcObject && _npcObject.length == 1 )
		{
			// the character already exists in the instance
			
			_npcObject[ 0 ].bindToInstance( _co.getInstance(), function()
			{
				
			});
			
			return;
		}
		
		_co.getInstance().addObject(
										{
											object_pool_id: 42
										},
										function( npcObject )
										{
											npcObject.events._add( "die", function()
											{
												/*
												setTimeout( function()
												{
													npcObject.resurrect({
																			resurrectCharacterObject: self
																		});
												}, 5000 + Math.random() * 2000 );
												*/
											});
											
											npcObject.bindToInstance( _co.getInstance(), function()
											{
												
											});
										}
									);
	}
	
	exports.questAbandon = function( args )
	{
		// somebody has abandoned this quest
		
		var _npcObject = args.byCharacterObject.getInstance().getObjectsByZonePoolID( 42 );
		
		if( !_npcObject )
		{
			return;
		}
		
		_npcObject[ 0 ].command_disconnect( function() { } );
	}
	
	exports.questCompleted = function( args )
	{
		// somebody has completed this quest
		
		var _npcObject = args.byCharacterObject.getInstance().getObjectsByZonePoolID( 42 );
		
		if( !_npcObject )
		{
			return;
		}
		
		_npcObject[ 0 ].command_disconnect( function() { } );
	}
	
	exports.questDelivered = function( args )
	{
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	