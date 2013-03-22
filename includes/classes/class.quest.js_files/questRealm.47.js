
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	 
		var chatChannel = require( "../class.chatChannel" );
	
		var objectIdConstant_16 = 223;
														
		var positiveNumberConstant_22 = 6;
														
		var stringConstant_26 = "get your stuff %targetName";
														
		var positiveNumberConstant_29 = 6;
														
		var stringConstant_33 = "motherfucker...";
														
		var objectIdConstant_39 = 223;
														
		exports.questStart = function( args )
		{
			
					args.instanceObject = args.characterObject.getInstance();
				
								var characterObject_1 = args.characterObject;
	
								var questGiverObject_2 = args.questGiverObject;
	
								var instanceObject_3 = args.instanceObject;
	instanceObject_3.getFirstObjectByZonePoolID({
			objectPoolID: objectIdConstant_16,
	onSuccess: function( args )
								{
									
								var characterObject_13 = args.characterObject;
	characterObject_13.addLootbagInterestedParty({
			characterObject: characterObject_1,
	
		});
	characterObject_13.setLootbagItemVisibleToCharacter({
			affectedCharacter: characterObject_13,
	loot_id: positiveNumberConstant_22,
	characterObject: characterObject_1,
	onSuccess: function( args )
								{
									
		chatChannel.sendMessageSpecialAutoComplete({
														characterObject: questGiverObject_2,
	targetCharacterObject: characterObject_1,
	message: stringConstant_26,
	
		});
	
								},
	onFailure: function( args )
								{
									
								},
	
		});
	
								},
	onFailure: function( args )
								{
									
								},
	
		});
	
		};
	
		exports.questAbandon = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_4 = args.byCharacterObject;
	
								var instanceObject_5 = args.instanceObject;
	byCharacterObject_4.removeLootItemByID({
			loot_id: positiveNumberConstant_29,
	onSuccess: function( args )
								{
									
		chatChannel.sendMessageSpecialAutoComplete({
														characterObject: byCharacterObject_4,
	targetCharacterObject: byCharacterObject_4,
	message: stringConstant_33,
	
		});
	instanceObject_5.getFirstObjectByZonePoolID({
			objectPoolID: objectIdConstant_39,
	onSuccess: function( args )
								{
									
								var characterObject_36 = args.characterObject;
	characterObject_36.removeLootbagInterestedParty({
			characterObject: byCharacterObject_4,
	
		});
	
								},
	onFailure: function( args )
								{
									
								},
	
		});
	
								},
	onFailure: function( args )
								{
									
								},
	
		});
	
		};
	
		exports.questCompleted = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_6 = args.byCharacterObject;
	
								var instanceObject_7 = args.instanceObject;
	
		};
	
		exports.questDelivered = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_8 = args.byCharacterObject;
	
								var instanceObject_9 = args.instanceObject;
	
		};
	
		exports.questResume = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_42 = args.byCharacterObject;
	
								var instanceObject_43 = args.instanceObject;
	
		};
	