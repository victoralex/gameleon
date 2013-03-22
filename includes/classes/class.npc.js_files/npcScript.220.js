
	
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
		
		
		var questIdConstant_32 = 74;
														
		var questParameterNameConstant_33 = "q74_1TalktoCampLeader";
														
		var numberConstant_34 = 1;
														
		var thisCharacterObjectConstant_38 = npcObject;
														
		var numberConstant_39 = 25;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_1 = args.byCharacterObject;
	byCharacterObject_1.modHP({
			sourceCharacterObject: thisCharacterObjectConstant_38,
	amount: numberConstant_39,
	after: function( args )
								{
									
								},
	
		});
	
			});
		
			npcObject.events._add( "auraEnter", function( args )
			{
				
								var withCharacterObject_11 = args.withCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: withCharacterObject_11,
	questId: questIdConstant_32,
	parameterName: questParameterNameConstant_33,
	value: numberConstant_34,
	
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
	