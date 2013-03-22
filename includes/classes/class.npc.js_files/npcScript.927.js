
	
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
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var thisInstanceObjectConstant_2 = _iO;
														
		var zoneIdConstant_32 = 51;
														
		var stringConstant_35 = "SpaceMarine";
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_3 = args.byCharacterObject;
	byCharacterObject_3.command_disconnect_for_zone_pool_id({
																									zone_pool_id: zoneIdConstant_32,
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
		
			npcObject.events._add( "auraEnter", function( args )
			{
				
								var withCharacterObject_13 = args.withCharacterObject;
	withCharacterObject_13.changeSkin({
			skinName: stringConstant_35,
	
		});
	
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
	