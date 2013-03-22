	
	var log = require( "../class.log" );
	
	//
	// Variables
	//
	
	var _removeSpanwedObjects = function( args )
	{
		var _spawnedObjects = args.byCharacterObject.getInstance().getObjectsByZonePoolID( 49 );
		
		if( !_spawnedObjects )
		{
			// no objects in the battlefield
			
			return;
		}
		
		for(var i=0;i<_spawnedObjects.length;i++)
		{
			_spawnedObjects[ i ].command_disconnect( function() { } );
		}
	}
	
	//
	// Events override
	//
	
	exports.questStart = function( args )
	{
		var _co = args.characterObject;
		
		var _spawnObject = function( after )
		{
			_co.getInstance().addObject(
											{
												object_pool_id: 49
											},
											function( npcObject )
											{
												after();
											}
										);
		}
		
		// spawn the NPCs required for this quest
		var _spawnObjects = function()
		{
			if( _spawnedObjectsNumber >= 7 )
			{
				return;
			}
			
			_spawnObject(function()
			{
				_spawnedObjectsNumber++;
				
				setTimeout( _spawnObjects, 1000 );
			})
		}
		
		var _spawnedObjectsNumber = 0;
		_spawnObjects();
	}
	
	exports.questAbandon = function( args )
	{
		// somebody has abandoned this quest
		
		_removeSpanwedObjects( args );
	}
	
	exports.questCompleted = function( args )
	{
		// somebody has completed this quest
		
		_removeSpanwedObjects( args );
	}
	
	exports.questDelivered = function( args )
	{
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	