
	
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
		
		
		var thisCharacterObjectConstant_34 = npcObject;
														
		var timerObjectConstant_38 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_39 = 30000;
														
		var positiveNumberConstant_40 = 60000;
														
		var questIdConstant_47 = 75;
														
		var questParameterNameConstant_48 = "q75_1ForlornStalkersKilled";
														
		var numberConstant_49 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcAggressive.enable({
												npcObject: thisCharacterObjectConstant_34,
	
											});
	
			});
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	timerObjectConstant_38.startTimer({
			minDelay: positiveNumberConstant_39,
	maxDelay: positiveNumberConstant_40,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_34.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_34
		});
	
								},
	
		});
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_6,
	questId: questIdConstant_47,
	parameterName: questParameterNameConstant_48,
	value: numberConstant_49,
	
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
	