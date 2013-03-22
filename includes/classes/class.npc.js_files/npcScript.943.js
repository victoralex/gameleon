
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var chatChannel = require( "../class.chatChannel" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		 
			npcObject.currentChatChannel = "chat.instance." + _iO.zone_id + "." + npcObject.properties.character_faction + ".say";
		
		var thisCharacterObjectConstant_1 = npcObject;
														
		var thisInstanceObjectConstant_2 = _iO;
														
		var stringConstant_32 = "WARNING - Biozhard detected. Extreme caution advised. Multiple uknown lifeforms detected in adjacent Medical Bay.";
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "auraEnter", function( args )
			{
				
								var withCharacterObject_13 = args.withCharacterObject;
	
		var senderObject = thisCharacterObjectConstant_1;
		chatChannel.sendMessageSpecial({
														channelType: "say",
														message: "[player:" + senderObject.properties.character_id + ":" + senderObject.properties.character_name + "] says: " + stringConstant_32,
														characterObject: senderObject,
														instanceObject: senderObject.getInstance()
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
	