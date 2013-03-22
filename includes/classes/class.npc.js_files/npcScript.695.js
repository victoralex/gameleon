
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var questIdConstant_41 = 65;
														
		var questParameterNameConstant_42 = "q65_1EnterTheCavern";
														
		var numberConstant_43 = 1;
														
		var questIdConstant_50 = 77;
														
		var questParameterNameConstant_51 = "q77_1Reportthediscoveryoftheegg";
														
		var numberConstant_52 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "auraEnter", function( args )
			{
				
								var withCharacterObject_13 = args.withCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: withCharacterObject_13,
	questId: questIdConstant_41,
	parameterName: questParameterNameConstant_42,
	value: numberConstant_43,
	
														}
													);
	
				quest.questConditionUpdate(
														{
															characterObject: withCharacterObject_13,
	questId: questIdConstant_50,
	parameterName: questParameterNameConstant_51,
	value: numberConstant_52,
	
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
	