
	
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
		
		
		var questIdConstant_24 = 59;
														
		var questParameterNameConstant_25 = "q59_1BeansCrushed";
														
		var numberConstant_26 = 1;
														
		var thisCharacterObjectConstant_42 = npcObject;
														
		var timerObjectConstant_46 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_47 = 30000;
														
		var positiveNumberConstant_48 = 30000;
														
		var thisInstanceObjectConstant_54 = _iO;
														
		var zoneIdConstant_55 = 51;
														
		var objectIdConstant_56 = 963;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_2 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_2,
	questId: questIdConstant_24,
	parameterName: questParameterNameConstant_25,
	value: numberConstant_26,
	
														}
													);
	thisCharacterObjectConstant_42.setUnUsable();
	timerObjectConstant_46.startTimer({
			minDelay: positiveNumberConstant_47,
	maxDelay: positiveNumberConstant_48,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_42.setUsable();
	
								},
	
		});
	thisInstanceObjectConstant_54.addObject(
						{
							zone_id: zoneIdConstant_55,
	object_pool_id: objectIdConstant_56,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_50 = args.characterObject;
	characterObject_50.bindToInstance(
			thisInstanceObjectConstant_54,
			
								function( args )
								{
									
								}
	
		);
	
								}
	
								
								after({ characterObject: characterObject });
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
	