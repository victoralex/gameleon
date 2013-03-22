
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
		exports.questStart = function( args )
		{
			
					args.instanceObject = args.characterObject.getInstance();
				
								var characterObject_1 = args.characterObject;
	
								var questGiverObject_2 = args.questGiverObject;
	
								var instanceObject_3 = args.instanceObject;
	
		};
	
		exports.questAbandon = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_4 = args.byCharacterObject;
	
								var instanceObject_5 = args.instanceObject;
	
		};
	
		exports.questCompleted = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_6 = args.byCharacterObject;
	
								var instanceObject_7 = args.instanceObject;
	
		};
	
		exports.questResume = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_8 = args.byCharacterObject;
	
								var instanceObject_9 = args.instanceObject;
	
		};
	
		exports.questDelivered = function( args )
		{
			
					args.instanceObject = args.byCharacterObject.getInstance();
				
								var byCharacterObject_10 = args.byCharacterObject;
	
								var instanceObject_11 = args.instanceObject;
	
		};
	