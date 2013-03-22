
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var achievementsLibrary = require( "../class.achievementsLibrary" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var achievementIdConstant_41 = 11;
														
		var achievementParameterNameConstant_42 = "q11_1ClearthepathalongtheFormicaBridge";
														
		var numberConstant_43 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "auraEnter", function( args )
			{
				
								var withCharacterObject_16 = args.withCharacterObject;
	
				achievementsLibrary.achievementConditionUpdate(
																					{
																						characterObject: withCharacterObject_16,
	achievementId: achievementIdConstant_41,
	parameterName: achievementParameterNameConstant_42,
	value: numberConstant_43,
	
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
	