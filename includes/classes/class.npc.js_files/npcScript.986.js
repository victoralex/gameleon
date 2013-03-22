
	
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
		
		
		var thisCharacterObjectConstant_15 = npcObject;
														
		var questIdConstant_20 = 63;
														
		var questParameterNameConstant_21 = "q63_1WeedWinesCollected";
														
		var numberConstant_22 = 1;
														
		var timerObjectConstant_54 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_55 = 35000;
														
		var positiveNumberConstant_56 = 45000;
														
		var achievementIdConstant_70 = 13;
														
		var achievementParameterNameConstant_71 = "q13_1Kill10VineyPlants";
														
		var numberConstant_72 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcAggressive.enable({
												npcObject: thisCharacterObjectConstant_15,
	
											});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_4 = args.byCharacterObject;
	timerObjectConstant_54.startTimer({
			minDelay: positiveNumberConstant_55,
	maxDelay: positiveNumberConstant_56,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_15.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_15
		});
	
								},
	
		});
	
				achievementsLibrary.achievementConditionUpdate(
																					{
																						characterObject: byCharacterObject_4,
	achievementId: achievementIdConstant_70,
	parameterName: achievementParameterNameConstant_71,
	value: numberConstant_72,
	
																					}
																				);
	
			});
		
			npcObject.events._add( "lootGiven", function( args )
			{
				
								var toCharacterObject_12 = args.toCharacterObject;
	
								var item_13 = args.item;
	
				quest.questConditionUpdate(
														{
															characterObject: toCharacterObject_12,
	questId: questIdConstant_20,
	parameterName: questParameterNameConstant_21,
	value: numberConstant_22,
	
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
	