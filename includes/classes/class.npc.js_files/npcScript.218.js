
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var achievementsLibrary = require( "../class.achievementsLibrary" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		// Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var achievementIdConstant_8 = 1;
														
		var achievementParameterNameConstant_9 = "a1_1BarrelRolls";
														
		var numberConstant_10 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_1 = args.byCharacterObject;
	
				achievementsLibrary.achievementConditionUpdate(
																					{
																						characterObject: byCharacterObject_1,
	achievementId: achievementIdConstant_8,
	parameterName: achievementParameterNameConstant_9,
	value: numberConstant_10,
	
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
	