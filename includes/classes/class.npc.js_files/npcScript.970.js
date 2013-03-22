
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var pathConstant_20 = [{"x":2918,"y":3180},{"x":2965,"y":3160},{"x":3007,"y":3141},{"x":3049,"y":3111},{"x":3078,"y":3079},{"x":3091,"y":2989},{"x":3080,"y":2968},{"x":2996,"y":2955},{"x":2952,"y":2971},{"x":2917,"y":3035},{"x":2906,"y":3084},{"x":2902,"y":3128}];
														
		var thisCharacterObjectConstant_23 = npcObject;
														
		var questIdConstant_54 = 55;
														
		var questParameterNameConstant_55 = "q55_1SpyPlansRecovered";
														
		var numberConstant_56 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_23,
	movePath: pathConstant_20,
	
														});
	
			});
		
			npcObject.events._add( "lootGiven", function( args )
			{
				
								var toCharacterObject_14 = args.toCharacterObject;
	
								var item_15 = args.item;
	
				quest.questConditionUpdate(
														{
															characterObject: toCharacterObject_14,
	questId: questIdConstant_54,
	parameterName: questParameterNameConstant_55,
	value: numberConstant_56,
	
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
	