
	
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
														
		var stringConstant_35 = "I thought I was never going to make it out alive!";
														
		var positiveNumberConstant_40 = 0;
														
		var pathConstant_41 = [{"x":1249,"y":450},{"x":1468,"y":510},{"x":1537,"y":609},{"x":1551,"y":677},{"x":1527,"y":791}];
														
		var positiveNumberConstant_42 = 0;
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "bindToInstance", function( args )
			{
				
								var instanceObject_5 = args.instanceObject;
	
		var senderObject = thisCharacterObjectConstant_1;
		chatChannel.sendMessageSpecial({
														channelType: "say",
														message: "[player:" + senderObject.properties.character_id + ":" + senderObject.properties.character_name + "] says: " + stringConstant_35,
														characterObject: senderObject,
														instanceObject: senderObject.getInstance()
													});
	thisCharacterObjectConstant_1.command_move_path({
			startPoint: positiveNumberConstant_40,
	path: pathConstant_41,
	delay: positiveNumberConstant_42,
	iterate: function( args )
								{
									
								},
	after: function( args )
								{
									thisCharacterObjectConstant_1.command_disconnect(
			
								function( args )
								{
									
								}
	
		);
	
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
		
		
	}
	