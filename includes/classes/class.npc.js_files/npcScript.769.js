
	
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
		
		
		var zoneIdConstant_39 = 59;
														
		var objectIdConstant_40 = 776;
														
		var thisInstanceObjectConstant_50 = _iO;
														
		var timerObjectConstant_56 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_57 = 45000;
														
		var positiveNumberConstant_58 = 60000;
														
		var thisCharacterObjectConstant_61 = npcObject;
														
		var thisInstanceObjectConstant_66 = _iO;
														
		var zoneIdConstant_67 = 59;
														
		var objectIdConstant_68 = 777;
														
		var questIdConstant_75 = 78;
														
		var questParameterNameConstant_76 = "q78_1StalkerEggsDestroyed";
														
		var numberConstant_77 = 1;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_6 = args.byCharacterObject;
	thisInstanceObjectConstant_50.addObject(
						{
							zone_id: zoneIdConstant_39,
	object_pool_id: objectIdConstant_40,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_35 = args.characterObject;
	characterObject_35.bindToInstance(
			thisInstanceObjectConstant_50,
			
								function( args )
								{
									timerObjectConstant_56.startTimer({
			minDelay: positiveNumberConstant_57,
	maxDelay: positiveNumberConstant_58,
	onFinalize: function( args )
								{
									thisCharacterObjectConstant_61.resurrect({
			resurrectCharacterObject: thisCharacterObjectConstant_61
		});
	
								},
	
		});
	
								}
	
		);
	
								}
	
								
								after({ characterObject: characterObject });
							}
						
					);
	thisInstanceObjectConstant_66.addObject(
						{
							zone_id: zoneIdConstant_67,
	object_pool_id: objectIdConstant_68,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_62 = args.characterObject;
	characterObject_62.bindToInstance(
			thisInstanceObjectConstant_50,
			
								function( args )
								{
									
								}
	
		);
	
								}
	
								
								after({ characterObject: characterObject });
							}
						
					);
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_6,
	questId: questIdConstant_75,
	parameterName: questParameterNameConstant_76,
	value: numberConstant_77,
	
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
	