
	
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
		
		
		var questIdConstant_39 = 49;
														
		var questParameterNameConstant_40 = "q49_1AttackSecondTargetDummy";
														
		var numberConstant_41 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "damageTake", function( args )
			{
				
								var fromCharacterObject_7 = args.fromCharacterObject;
	
								var amount_8 = args.amount;
	
				quest.questConditionUpdate(
														{
															characterObject: fromCharacterObject_7,
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
	