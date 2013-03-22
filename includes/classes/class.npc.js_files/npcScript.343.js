
	
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
		
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var thisInstanceObjectConstant_2 = _iO;
														
		var questIdConstant_34 = 70;
														
		var questParameterNameConstant_35 = "q70_1Messagesent";
														
		var numberConstant_36 = 1;
														
		var timerObjectConstant_41 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_42 = 30000;
														
		var positiveNumberConstant_43 = 60000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_3 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_3,
	questId: questIdConstant_34,
	parameterName: questParameterNameConstant_35,
	value: numberConstant_36,
	
														}
													);
	thisCharacterObjectConstant_1.setUnUsable();
	timerObjectConstant_41.startTimer({
			minDelay: positiveNumberConstant_42,
	maxDelay: positiveNumberConstant_43,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_1.setUsable();
	
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
	