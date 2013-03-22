
	
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
		
		
		var questIdConstant_45 = 54;
														
		var questParameterNameConstant_46 = "q54_1SurvivingBugsRescued";
														
		var numberConstant_47 = 1;
														
		var thisInstanceObjectConstant_52 = _iO;
														
		var zoneIdConstant_53 = 51;
														
		var objectIdConstant_54 = 433;
														
		var timerObjectConstant_60 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_61 = 30000;
														
		var positiveNumberConstant_62 = 45000;
														
		var thisCharacterObjectConstant_65 = npcObject;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_5 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_5,
	questId: questIdConstant_45,
	parameterName: questParameterNameConstant_46,
	value: numberConstant_47,
	
														}
													);
	thisInstanceObjectConstant_52.addObject(
						{
							zone_id: zoneIdConstant_53,
	object_pool_id: objectIdConstant_54,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_48 = args.characterObject;
	characterObject_48.bindToInstance(
			thisInstanceObjectConstant_52,
			
								function( args )
								{
									
								}
	
		);
	
								}
	
								
								after({ characterObject: characterObject });
							}
						
					);
	timerObjectConstant_60.startTimer({
			minDelay: positiveNumberConstant_61,
	maxDelay: positiveNumberConstant_62,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_65.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_65
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
	