
	
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
		
		
		var characterObjectConstant_1 = npcObject;
														
		var questIdConstant_33 = 59;
														
		var questParameterNameConstant_34 = "q59_1BeansCrushed";
														
		var numberConstant_35 = 1;
														
		var thisCharacterObjectConstant_37 = npcObject;
														
		var timerObjectConstant_41 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_42 = 30000;
														
		var positiveNumberConstant_43 = 30000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_2 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_2,
	questId: questIdConstant_33,
	parameterName: questParameterNameConstant_34,
	value: numberConstant_35,
	
														}
													);
	characterObjectConstant_1.setUnUsable();
	timerObjectConstant_41.startTimer({
			minDelay: positiveNumberConstant_42,
	maxDelay: positiveNumberConstant_43,
	onFinalize: function( args )
								{
									characterObjectConstant_1.setUsable();
	
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
	