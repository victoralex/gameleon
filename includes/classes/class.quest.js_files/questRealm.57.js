
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
		var zoneIdConstant_14 = 51;
														
		var objectIdConstant_16 = 339;
														
		exports.questStart = function( args )
		{
			
					args.instanceObject = args.characterObject.getInstance();
				
								var characterObject_1 = args.characterObject;
	
								var instanceObject_2 = args.instanceObject;
	
								var questGiverObject_9 = args.questGiverObject;
	instanceObject_2.addObject(
						{
							zone_id: zoneIdConstant_14,
	object_pool_id: objectIdConstant_16,
	
						},
						
							function( characterObject )
							{
								var after = 
								function( args )
								{
									
								var characterObject_10 = args.characterObject;
	characterObject_10.bindToInstance(
			instanceObject_2,
			
								function( args )
								{
									
								}
	
		);
	
								}
	
								
								after({ characterObject: characterObject });
							}
						
					);
	
		};
	
		exports.questAbandon = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_3 = args.byCharacterObject;
	
								var instanceObject_4 = args.instanceObject;
	
		};
	
		exports.questCompleted = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_5 = args.byCharacterObject;
	
								var instanceObject_6 = args.instanceObject;
	
		};
	
		exports.questDelivered = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_7 = args.byCharacterObject;
	
								var instanceObject_8 = args.instanceObject;
	
		};
	
		exports.questResume = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_8 = args.byCharacterObject;
	
								var instanceObject_9 = args.instanceObject;
	
		};
	