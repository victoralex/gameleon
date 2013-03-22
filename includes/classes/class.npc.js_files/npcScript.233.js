
	
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
		
		
		var pathConstant_17 = [{"x":1538,"y":2906},{"x":1423,"y":2939},{"x":1363,"y":2881},{"x":1376,"y":2801},{"x":1537,"y":2759},{"x":1607,"y":2778},{"x":1671,"y":2866},{"x":1669,"y":2963},{"x":1596,"y":2991},{"x":1526,"y":2927}];
														
		var questIdConstant_22 = 53;
														
		var questParameterNameConstant_23 = "q53_1BeachBugsKilled";
														
		var numberConstant_24 = 1;
														
		var thisCharacterObjectConstant_25 = npcObject;
														
		var timerObjectConstant_45 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_46 = 30000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_25,
	movePath: pathConstant_17,
	
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
	timerObjectConstant_45.startTimer({
			minDelay: positiveNumberConstant_46,
	maxDelay: positiveNumberConstant_46,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_25.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_25
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
	