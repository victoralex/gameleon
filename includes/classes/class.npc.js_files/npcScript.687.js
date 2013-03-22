
	
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
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var thisInstanceObjectConstant_2 = _iO;
														
		var questIdConstant_38 = 75;
														
		var questParameterNameConstant_39 = "q75_1ForlornStalkersKilled";
														
		var numberConstant_40 = 1;
														
		var pathConstant_41 = [{"x":1337,"y":1185},{"x":1280,"y":1043},{"x":1229,"y":1138},{"x":1282,"y":1283},{"x":1340,"y":1346},{"x":1519,"y":1269},{"x":1408,"y":1244}];
														
		var timerObjectConstant_45 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_46 = 30000;
														
		var positiveNumberConstant_47 = 45000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_1,
	movePath: pathConstant_41,
	
														});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_6,
	questId: questIdConstant_38,
	parameterName: questParameterNameConstant_39,
	value: numberConstant_40,
	
														}
													);
	timerObjectConstant_45.startTimer({
			minDelay: positiveNumberConstant_46,
	maxDelay: positiveNumberConstant_47,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_1.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_1
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
		
		
	}
	