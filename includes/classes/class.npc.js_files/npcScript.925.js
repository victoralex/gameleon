
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
		var npcBehaviors = require( "../class.npcBehaviors" );
	 
		var chatChannel = require( "../class.chatChannel" );
	
	
	
	exports.script = function( npcObject )
	{
		//
		//	Variables
		//
		
		var _iO = npcObject.getArgs().createdByInstanceObject,
			_cooldownPointer = null;
		
		 
			npcObject.currentChatChannel = "chat.instance." + _iO.zone_id + "." + npcObject.properties.character_faction + ".say";
		
		var thisCharacterObjectConstant_36 = npcObject;
														
		var pathConstant_37 = [{"x":1450,"y":335},{"x":1313,"y":522},{"x":1216,"y":637},{"x":1194,"y":771},{"x":1496,"y":852},{"x":1491,"y":907},{"x":1200,"y":883},{"x":1196,"y":950},{"x":1176,"y":1175},{"x":1057,"y":1252},{"x":854,"y":1398},{"x":716,"y":1508},{"x":604,"y":1543},{"x":591,"y":1614},{"x":870,"y":1440},{"x":985,"y":1357},{"x":1157,"y":1238},{"x":1211,"y":1159},{"x":1227,"y":1016},{"x":1234,"y":826},{"x":1207,"y":689},{"x":1266,"y":559},{"x":1402,"y":433}];
														
		var stringConstant_38 = "They're coming outta the walls. They're coming outta the goddamn walls!";
														
		
		//
		// Events override
		//
		
		
			npcObject.events._add( "afterInit", function( args )
			{
				
		new npcBehaviors.npcPatrolAggressiveLoop.enable({
															npcObject: thisCharacterObjectConstant_36,
	movePath: pathConstant_37,
	
														});
	
			});
		
			npcObject.events._add( "auraEnter", function( args )
			{
				
								var withCharacterObject_13 = args.withCharacterObject;
	
		var senderObject = thisCharacterObjectConstant_36;
		chatChannel.sendMessageSpecial({
														channelType: "say",
														message: "[player:" + senderObject.properties.character_id + ":" + senderObject.properties.character_name + "] says: " + stringConstant_38,
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
	