
	
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
														
		var stringConstant_35 = "I've been given a new lease on life! No more mothpowder!";
														
		var positiveNumberConstant_40 = 0;
														
		var pathConstant_41 = [{"x":1477,"y":699},{"x":1563,"y":733},{"x":1555,"y":796}];
														
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
	