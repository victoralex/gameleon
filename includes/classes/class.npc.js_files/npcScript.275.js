
	
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
		
		
		var questIdConstant_40 = 54;
														
		var questParameterNameConstant_41 = "q54_1SurvivingBugsRescued";
														
		var numberConstant_42 = 1;
														
		var thisInstanceObjectConstant_47 = _iO;
														
		var zoneIdConstant_48 = 51;
														
		var objectIdConstant_49 = 432;
														
		var timerObjectConstant_55 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_56 = 30000;
														
		var positiveNumberConstant_57 = 45000;
														
		var thisCharacterObjectConstant_60 = npcObject;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_5 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_5,
	questId: questIdConstant_40,
	parameterName: questParameterNameConstant_41,
	value: numberConstant_42,
	
														}
													);
	thisInstanceObjectConstant_47.addObject(
						{
							zone_id: zoneIdConstant_48,
	object_pool_id: objectIdConstant_49,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_43 = args.characterObject;
	characterObject_43.bindToInstance(
			thisInstanceObjectConstant_47,
			
								function( args )
								{
									
								}
	
		);
	
								}
	
								
								after({ characterObject: characterObject });
							}
						
					);
	timerObjectConstant_55.startTimer({
			minDelay: positiveNumberConstant_56,
	maxDelay: positiveNumberConstant_57,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_60.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_60
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
	