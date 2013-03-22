
	
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
		
		
		var questIdConstant_18 = 53;
														
		var numberConstant_19 = 1;
														
		var questParameterNameConstant_20 = "q53_1BeachBugsKilled";
														
		var pathConstant_24 = [{"x":1387,"y":2681},{"x":1292,"y":2678},{"x":1270,"y":2597},{"x":1323,"y":2551},{"x":1431,"y":2542},{"x":1573,"y":2554},{"x":1599,"y":2636},{"x":1505,"y":2717},{"x":1408,"y":2731},{"x":1396,"y":2705}];
														
		var timerObjectConstant_45 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_46 = 30000;
														
		var positiveNumberConstant_47 = 60000;
														
		var thisCharacterObjectConstant_52 = npcObject;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_52,
	movePath: pathConstant_24,
	
														});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_4 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_4,
	questId: questIdConstant_18,
	parameterName: questParameterNameConstant_20,
	value: numberConstant_19,
	
														}
													);
	timerObjectConstant_45.startTimer({
			minDelay: positiveNumberConstant_46,
	maxDelay: positiveNumberConstant_47,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_52.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_52
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
	