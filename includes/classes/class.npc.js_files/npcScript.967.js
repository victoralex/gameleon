
	
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
		
		
		var pathConstant_20 = [{"x":2269,"y":3019},{"x":2240,"y":2978},{"x":2224,"y":2922},{"x":2251,"y":2873},{"x":2319,"y":2834},{"x":2359,"y":2821},{"x":2405,"y":2843},{"x":2413,"y":2885},{"x":2384,"y":2959},{"x":2360,"y":2988},{"x":2312,"y":3012}];
														
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
	