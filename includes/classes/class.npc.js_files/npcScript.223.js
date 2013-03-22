
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		
		var stringConstant_60 = "upped";
														
		var questIdConstant_65 = 47;
														
		var questParameterNameConstant_66 = "q47_1Gearpickedupfromchest";
														
		var numberConstant_67 = 1;
														
		var thisCharacterObjectConstant_70 = npcObject;
														
		var stringConstant_72 = "chest loot gave";
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_1 = args.byCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: byCharacterObject_1,
	questId: questIdConstant_65,
	parameterName: questParameterNameConstant_66,
	value: numberConstant_67,
	
														}
													);
	thisCharacterObjectConstant_70.generateAndSendLootBagData({
			toCharacterObject: byCharacterObject_1,
	after: function( args )
								{
									
		log.add( stringConstant_72 );
	
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
	