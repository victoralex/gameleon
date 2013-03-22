
	
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
		
		var thisCharacterObjectConstant_32 = npcObject;
														
		var positiveNumberConstant_45 = 0;
														
		var pathConstant_46 = [{"x":722,"y":173},{"x":925,"y":167},{"x":1507,"y":502},{"x":1515,"y":779}];
														
		var positiveNumberConstant_47 = 1;
														
		var thisCharacterObjectConstant_50 = npcObject;
														
		var stringConstant_51 = "Thank you for rescuing me!";
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "bindToInstance", function( args )
			{
				
								var instanceObject_5 = args.instanceObject;
	thisCharacterObjectConstant_32.command_move_path({
			startPoint: positiveNumberConstant_45,
	path: pathConstant_46,
	delay: positiveNumberConstant_47,
	iterate: function( args )
								{
									
								},
	after: function( args )
								{
									thisCharacterObjectConstant_32.command_disconnect(
			
								function( args )
								{
									
								}
	
		);
	
								},
	
		});
	
		var senderObject = thisCharacterObjectConstant_50;
		chatChannel.sendMessageSpecial({
														channelType: "say",
														message: "[player:" + senderObject.properties.character_id + ":" + senderObject.properties.character_name + "] says: " + stringConstant_51,
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
		
		
	}
	