
	
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
		
		
		var questIdConstant_22 = 53;
														
		var questParameterNameConstant_23 = "q53_1BeachBugsKilled";
														
		var numberConstant_24 = 1;
														
		var pathConstant_27 = [{"x":1049,"y":2534},{"x":920,"y":2519},{"x":1017,"y":2382},{"x":1229,"y":2387},{"x":1257,"y":2510},{"x":1224,"y":2596},{"x":1130,"y":2640},{"x":1051,"y":2564}];
														
		var thisCharacterObjectConstant_28 = npcObject;
														
		var timerObjectConstant_46 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_47 = 30000;
														
		var positiveNumberConstant_48 = 45000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_28,
	movePath: pathConstant_27,
	
														});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_4 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_4,
	questId: questIdConstant_22,
	parameterName: questParameterNameConstant_23,
	value: numberConstant_24,
	
														}
													);
	timerObjectConstant_46.startTimer({
			minDelay: positiveNumberConstant_47,
	maxDelay: positiveNumberConstant_48,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_28.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_28
		});
	
								},
	
		});
	
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
	