
	
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
		
		
		var characterObjectConstant_1 = npcObject;
														
		var questIdConstant_33 = 60;
														
		var questParameterNameConstant_34 = "q60_1ScoutFound";
														
		var numberConstant_35 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "auraEnter", function( args )
			{
				
								var withCharacterObject_13 = args.withCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: withCharacterObject_13,
	questId: questIdConstant_33,
	parameterName: questParameterNameConstant_34,
	value: numberConstant_35,
	
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
	