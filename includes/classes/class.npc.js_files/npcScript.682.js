
	
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
														
		var achievementIdConstant_37 = 8;
														
		var achievementParameterNameConstant_38 = "q8_1Stalkerskilled";
														
		var numberConstant_39 = 4;
														
		var pathConstant_43 = [{"x":596,"y":811},{"x":671,"y":878},{"x":498,"y":943},{"x":459,"y":931},{"x":567,"y":831},{"x":450,"y":721},{"x":581,"y":656},{"x":559,"y":775}];
														
		var questIdConstant_48 = 75;
														
		var questParameterNameConstant_49 = "q75_1ForlornStalkersKilled";
														
		var numberConstant_50 = 1;
														
		var timerObjectConstant_54 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_55 = 30000;
														
		var positiveNumberConstant_56 = 45000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_1,
	movePath: pathConstant_43,
	
														});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	
				achievementsLibrary.achievementConditionUpdate(
																					{
																						characterObject: thisCharacterObjectConstant_1,
	achievementId: achievementIdConstant_37,
	parameterName: achievementParameterNameConstant_38,
	value: numberConstant_39,
	
																					}
																				);
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_6,
	questId: questIdConstant_48,
	parameterName: questParameterNameConstant_49,
	value: numberConstant_50,
	
														}
													);
	timerObjectConstant_54.startTimer({
			minDelay: positiveNumberConstant_55,
	maxDelay: positiveNumberConstant_56,
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
		
		
		// bind to instance
		npcObject.events._add( "afterInit", function( args )
		{
			npcObject.bindToInstance( _iO, function() { } );
		});
		
	}
	