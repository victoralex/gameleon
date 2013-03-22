
	
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
		
		
		var pathConstant_20 = [{"x":2597,"y":3100},{"x":2602,"y":3053},{"x":2614,"y":3010},{"x":2637,"y":2959},{"x":2677,"y":2890},{"x":2711,"y":2863},{"x":2760,"y":2859},{"x":2805,"y":2871},{"x":2843,"y":2941},{"x":2828,"y":3015},{"x":2789,"y":3061},{"x":2716,"y":3107},{"x":2631,"y":3112}];
														
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
	