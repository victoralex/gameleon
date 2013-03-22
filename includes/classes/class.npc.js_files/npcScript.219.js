
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		// Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var questIdConstant_32 = 52;
														
		var questParameterNameConstant_33 = "q52_1SuppliesDelivered";
														
		var numberConstant_34 = 1;
														
		var questIdConstant_39 = 62;
														
		var questParameterNameConstant_40 = "q62_1SpeaktotheQuartermaster";
														
		var numberConstant_41 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "auraEnter", function( args )
			{
				
								var withCharacterObject_11 = args.withCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: withCharacterObject_11,
	questId: questIdConstant_32,
	parameterName: questParameterNameConstant_33,
	value: numberConstant_34,
	
														}
													);
	
				quest.questConditionUpdate(
														{
															characterObject: withCharacterObject_11,
	questId: questIdConstant_39,
	parameterName: questParameterNameConstant_40,
	value: numberConstant_41,
	
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
	