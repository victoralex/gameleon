
	
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
		
		
		var pathConstant_18 = [{"x":934,"y":3208},{"x":852,"y":3204},{"x":704,"y":3184},{"x":785,"y":3088},{"x":871,"y":2944},{"x":956,"y":3018},{"x":1060,"y":3140},{"x":1102,"y":3239},{"x":1008,"y":3226}];
														
		var questIdConstant_23 = 53;
														
		var questParameterNameConstant_24 = "q53_1BeachBugsKilled";
														
		var numberConstant_25 = 1;
														
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
	movePath: pathConstant_18,
	
														});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_4 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_4,
	questId: questIdConstant_23,
	parameterName: questParameterNameConstant_24,
	value: numberConstant_25,
	
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
	