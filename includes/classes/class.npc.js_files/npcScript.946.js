
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	 
		var timerObject = require( "../class.timer" ).timer;
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var questIdConstant_41 = 51;
														
		var questParameterNameConstant_42 = "q51_1Recoveredsupplies";
														
		var numberConstant_43 = 1;
														
		var thisCharacterObjectConstant_45 = npcObject;
														
		var timerObjectConstant_49 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_50 = 25000;
														
		var positiveNumberConstant_51 = 30000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_1 = args.byCharacterObject;
	byCharacterObject_1.generateAndSendLootBagData({
			toCharacterObject: byCharacterObject_1,
	after: function( args )
								{
									
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_1,
	questId: questIdConstant_41,
	parameterName: questParameterNameConstant_42,
	value: numberConstant_43,
	
														}
													);
	
								},
	
		});
	thisCharacterObjectConstant_45.setUnUsable();
	timerObjectConstant_49.startTimer({
			minDelay: positiveNumberConstant_50,
	maxDelay: positiveNumberConstant_51,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_45.setUsable();
	
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
	