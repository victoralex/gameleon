
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	 
		var achievementsLibrary = require( "../class.achievementsLibrary" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var thisInstanceObjectConstant_2 = _iO;
														
		var thisCharacterObjectConstant_30 = npcObject;
														
		var questIdConstant_36 = 79;
														
		var questParameterNameConstant_37 = "q79_1ForlornBroodmotherKilled";
														
		var numberConstant_38 = 1;
														
		var achievementIdConstant_43 = 14;
														
		var achievementParameterNameConstant_44 = "q14_1KillAForlornQueen";
														
		var numberConstant_45 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcAggressive.enable({
												npcObject: thisCharacterObjectConstant_30,
	
											});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: thisCharacterObjectConstant_1,
	questId: questIdConstant_36,
	parameterName: questParameterNameConstant_37,
	value: numberConstant_38,
	
														}
													);
	
				achievementsLibrary.achievementConditionUpdate(
																					{
																						characterObject: byCharacterObject_6,
	achievementId: achievementIdConstant_43,
	parameterName: achievementParameterNameConstant_44,
	value: numberConstant_45,
	
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
		
		
	}
	