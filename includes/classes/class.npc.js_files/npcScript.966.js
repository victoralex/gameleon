
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	 
		var timerObject = require( "../class.timer" ).timer;
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var pathConstant_20 = [{"x":2112,"y":2767},{"x":2166,"y":2699},{"x":2204,"y":2674},{"x":2255,"y":2660},{"x":2309,"y":2685},{"x":2327,"y":2720},{"x":2337,"y":2749},{"x":2331,"y":2772},{"x":2229,"y":2794},{"x":2151,"y":2812},{"x":2080,"y":2800}];
														
		var thisCharacterObjectConstant_23 = npcObject;
														
		var questIdConstant_54 = 55;
														
		var questParameterNameConstant_55 = "q55_1SpyPlansRecovered";
														
		var numberConstant_56 = 1;
														
		var timerObjectConstant_60 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_61 = 30000;
														
		var positiveNumberConstant_62 = 60000;
														
		
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
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_5 = args.byCharacterObject;
	timerObjectConstant_60.startTimer({
			minDelay: positiveNumberConstant_61,
	maxDelay: positiveNumberConstant_62,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_23.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_23
		});
	
								},
	
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
	