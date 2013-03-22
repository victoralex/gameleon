
	
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
		
		
		var questIdConstant_42 = 49;
														
		var questParameterNameConstant_43 = "q49_2AttackThirdTargetDummy";
														
		var numberConstant_44 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "damageTake", function( args )
			{
				
								var fromCharacterObject_8 = args.fromCharacterObject;
	
								var amount_9 = args.amount;
	
				quest.questConditionUpdate(
														{
															characterObject: fromCharacterObject_8,
	questId: questIdConstant_42,
	parameterName: questParameterNameConstant_43,
	value: numberConstant_44,
	
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
	