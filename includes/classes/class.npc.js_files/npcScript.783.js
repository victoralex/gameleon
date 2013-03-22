
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var thisInstanceObjectConstant_75 = _iO;
														
		var zoneIdConstant_76 = 59;
														
		var objectIdConstant_77 = 711;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_3 = args.byCharacterObject;
	thisInstanceObjectConstant_75.addObject(
						{
							zone_id: zoneIdConstant_76,
	object_pool_id: objectIdConstant_77,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_71 = args.characterObject;
	
								}
	
								
								after({ characterObject: characterObject });
							}
						
					);
	
			});
		
		
		//
		// Post all objects initialisation
		//
		
		this.postInit = function()
		{
			
		}
		
		//
		// Initialize
		//
		
		
		// bind to instance
		npcObject.events._add( "afterInit", function( args )
		{
			npcObject.bindToInstance( _iO, function() { } );
		});
		
	}
	