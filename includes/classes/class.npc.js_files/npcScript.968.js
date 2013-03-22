
	
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
		
		
		var pathConstant_20 = [{"x":2568,"y":2842},{"x":2505,"y":2875},{"x":2470,"y":2902},{"x":2429,"y":2933},{"x":2414,"y":2967},{"x":2410,"y":3048},{"x":2428,"y":3087},{"x":2476,"y":3092},{"x":2525,"y":3076},{"x":2563,"y":3029},{"x":2593,"y":2969},{"x":2603,"y":2900},{"x":2577,"y":2844}];
														
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
	