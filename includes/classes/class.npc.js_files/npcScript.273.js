
	
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
		
		
		var questIdConstant_43 = 54;
														
		var questParameterNameConstant_44 = "q54_1SurvivingBugsRescued";
														
		var numberConstant_45 = 1;
														
		var zoneIdConstant_50 = 51;
														
		var objectIdConstant_51 = 428;
														
		var thisInstanceObjectConstant_52 = _iO;
														
		var timerObjectConstant_64 = new timerObject({ instanceObject: _iO });
														
		var positiveNumberConstant_65 = 30000;
														
		var positiveNumberConstant_66 = 30000;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "die", function( args )
			{
				
								var byCharacterObject_5 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_5,
	questId: questIdConstant_43,
	parameterName: questParameterNameConstant_44,
	value: numberConstant_45,
	
														}
													);
	thisInstanceObjectConstant_52.addObject(
						{
							zone_id: zoneIdConstant_50,
	object_pool_id: objectIdConstant_51,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_46 = args.characterObject;
	characterObject_46.bindToInstance(
			thisInstanceObjectConstant_52,
			
								function( args )
								{
									
								}
	
		);
	
								}
	
								
								after({ characterObject: characterObject });
							}
						
					);
	timerObjectConstant_64.startTimer({
			minDelay: positiveNumberConstant_66,
	maxDelay: positiveNumberConstant_65,
	onFinalize: function( args )
								{
									
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
	