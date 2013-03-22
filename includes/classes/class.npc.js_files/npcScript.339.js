
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	 
		var achievementsLibrary = require( "../class.achievementsLibrary" );
	 
		var timerObject = require( "../class.timer" ).timer;
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var questIdConstant_35 = 57;
														
		var questParameterNameConstant_36 = "q57_1SpyLeaderKilled";
														
		var numberConstant_37 = 1;
														
		var achievementIdConstant_42 = 10;
														
		var achievementParameterNameConstant_43 = "q10_1KilltheBrightStrandHegemonySpyLeader";
														
		var numberConstant_44 = 1;
														
		var timerObjectConstant_48 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_49 = 30000;
														
		var positiveNumberConstant_50 = 60000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcAggressive.enable({
												npcObject: thisCharacterObjectConstant_1,
	
											});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_6,
	questId: questIdConstant_35,
	parameterName: questParameterNameConstant_36,
	value: numberConstant_37,
	
														}
													);
	
				achievementsLibrary.achievementConditionUpdate(
																					{
																						characterObject: byCharacterObject_6,
	achievementId: achievementIdConstant_42,
	parameterName: achievementParameterNameConstant_43,
	value: numberConstant_44,
	
																					}
																				);
	timerObjectConstant_48.startTimer({
			minDelay: positiveNumberConstant_49,
	maxDelay: positiveNumberConstant_50,
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
	