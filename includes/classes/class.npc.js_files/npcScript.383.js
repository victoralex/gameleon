
	
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
														
		var thisCharacterObjectConstant_29 = npcObject;
														
		var timerObjectConstant_33 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_34 = 30000;
														
		var positiveNumberConstant_35 = 30000;
														
		var thisInstanceObjectConstant_41 = _iO;
														
		var zoneIdConstant_42 = 51;
														
		var objectIdConstant_43 = 962;
														
		
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
	thisCharacterObjectConstant_29.setUnUsable();
	timerObjectConstant_33.startTimer({
			minDelay: positiveNumberConstant_34,
	maxDelay: positiveNumberConstant_35,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_29.setUsable();
	
								},
	
		});
	thisInstanceObjectConstant_41.addObject(
						{
							zone_id: zoneIdConstant_42,
	object_pool_id: objectIdConstant_43,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_37 = args.characterObject;
	characterObject_37.bindToInstance(
			thisInstanceObjectConstant_41,
			
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
	