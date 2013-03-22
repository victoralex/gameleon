
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var quest = require( "../class.quest" );
	 
		var chatChannel = require( "../class.chatChannel" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		 
			npcObject.currentChatChannel = "chat.instance." + _iO.zone_id + "." + npcObject.properties.character_faction + ".say";
		
		var characterObjectConstant_1 = npcObject;
														
		var stringConstant_16 = "casting, please wait...";
														
		var positiveNumberConstant_125 = 10000;
														
		var questIdConstant_171 = 48;
														
		var questParameterNameConstant_172 = "q48_1Talktothedrillmaster";
														
		var numberConstant_173 = 1;
														
		var thisInstanceObjectConstant_205 = _iO;
														
		var stringConstant_219 = "Ah, %targetName, our latest recruit!";
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "use", function( args )
			{
				
								var byCharacterObject_2 = args.byCharacterObject;
	characterObjectConstant_1.castStart({
			description: stringConstant_16,
	duration: positiveNumberConstant_125,
	onInterrupt: function( args )
								{
									
								},
	onComplete: function( args )
								{
									byCharacterObject_2.resurrect({
			resurrectCharacterObject: characterObjectConstant_1
		});
	
								},
	
		});
	byCharacterObject_2.die({
			killerCharacterObject: characterObjectConstant_1
		});
	
			});
		
			npcObject.events._add( "auraEnter", function( args )
			{
				
								var withCharacterObject_174 = args.withCharacterObject;
	
				quest.questConditionUpdate(
														{
															characterObject: withCharacterObject_174,
	questId: questIdConstant_171,
	parameterName: questParameterNameConstant_172,
	value: numberConstant_173,
	
														}
													);
	thisInstanceObjectConstant_205.isPlayer({
			characterObject: withCharacterObject_174,
	onSuccess: function( args )
								{
									
		chatChannel.sendMessageSpecialAutoComplete({
														characterObject: characterObjectConstant_1,
	targetCharacterObject: withCharacterObject_174,
	message: stringConstant_219,
	
		});
	
								},
	onFailure: function( args )
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
	