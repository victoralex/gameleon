
	
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
		
		
		var pathConstant_17 = [{"x":1457,"y":3200},{"x":1350,"y":3195},{"x":1362,"y":3100},{"x":1506,"y":3057},{"x":1573,"y":3075},{"x":1560,"y":3211},{"x":1504,"y":3263},{"x":1423,"y":3240}];
														
		var questIdConstant_22 = 53;
														
		var questParameterNameConstant_23 = "q53_1BeachBugsKilled";
														
		var numberConstant_24 = 1;
														
		var thisCharacterObjectConstant_27 = npcObject;
														
		var thisCharacterObjectConstant_47 = npcObject;
														
		var timerObjectConstant_48 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_49 = 30000;
														
		var positiveNumberConstant_50 = 45000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_27,
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
	timerObjectConstant_48.startTimer({
			minDelay: positiveNumberConstant_49,
	maxDelay: positiveNumberConstant_50,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_27.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_27
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
	