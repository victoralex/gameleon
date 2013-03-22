
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
		exports.questStart = function( args )
		{
			
					args.instanceObject = args.characterObject.getInstance();
				
								var characterObject_1 = args.characterObject;
	
								var instanceObject_2 = args.instanceObject;
	
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
	