
	
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
		
		
		var questIdConstant_62 = 49;
														
		var questParameterNameConstant_63 = "q49_3AttackFirstTargetDummy";
														
		var numberConstant_64 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "damageTake", function( args )
			{
				
								var fromCharacterObject_23 = args.fromCharacterObject;
	
								var amount_24 = args.amount;
	
				quest.questConditionUpdate(
														{
															characterObject: fromCharacterObject_23,
	questId: questIdConstant_62,
	parameterName: questParameterNameConstant_63,
	value: numberConstant_64,
	
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
	