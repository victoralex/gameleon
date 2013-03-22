
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
	
	
	exports.script = function( npcObject )
	{
		//
		// Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var zoneIdConstant_20 = 57;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_1 = args.byCharacterObject;
	byCharacterObject_1.command_disconnect_for_zone_pool_id({
																									zone_pool_id: zoneIdConstant_20,
	onComplete: function( args )
								{
									
								},
	
																								},
																								function()
																								{
																									log.addNotice( "Flying to another zone" );
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
	