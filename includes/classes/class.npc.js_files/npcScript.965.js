
	
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
		
		
		var thisCharacterObjectConstant_23 = npcObject;
														
		var questIdConstant_54 = 55;
														
		var questParameterNameConstant_55 = "q55_1SpyPlansRecovered";
														
		var numberConstant_56 = 1;
														
		var pathConstant_57 = [{"x":2236,"y":2569},{"x":2136,"y":2532},{"x":2097,"y":2527},{"x":2020,"y":2563},{"x":2000,"y":2601},{"x":2033,"y":2645},{"x":2094,"y":2661},{"x":2184,"y":2642},{"x":2246,"y":2577}];
														
		var timerObjectConstant_61 = new timerObject({ instanceObject: _iO });
														
		var timerObjectConstant_62 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_63 = 30000;
														
		var positiveNumberConstant_64 = 60000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_23,
	movePath: pathConstant_57,
	
														});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_5 = args.byCharacterObject;
	timerObjectConstant_62.startTimer({
			minDelay: positiveNumberConstant_63,
	maxDelay: positiveNumberConstant_64,
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
	