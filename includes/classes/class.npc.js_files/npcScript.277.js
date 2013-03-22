
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		// Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var questIdConstant_43 = 54;
														
		var questParameterNameConstant_44 = "q54_1SurvivingBugsRescued";
														
		var numberConstant_45 = 1;
														
		var thisInstanceObjectConstant_50 = _iO;
														
		var zoneIdConstant_51 = 51;
														
		var objectIdConstant_52 = 431;
														
		
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
	thisInstanceObjectConstant_50.addObject(
						{
							zone_id: zoneIdConstant_51,
	object_pool_id: objectIdConstant_52,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_46 = args.characterObject;
	characterObject_46.bindToInstance(
			thisInstanceObjectConstant_50,
			
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
	