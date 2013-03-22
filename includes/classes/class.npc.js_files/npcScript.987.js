
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var thisInstanceObjectConstant_2 = _iO;
														
		var booleanConstant_32 = true;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		npcBehaviors.spiritHealer.enable({
											npcObject: thisCharacterObjectConstant_1,
	resurrectOnlySameFaction: booleanConstant_32,
	onComplete: function( args )
								{
									
								},
	
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
	