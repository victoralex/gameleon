
	
	"use strict";
	
	var log = require( "../class.log" );
	var realmConfig = require( "../../config.realm" ).config;
	
	
	
	exports.script = function( instanceObject )
	{
		//
		// Variables
		//
	
		
		var stringConstant_66 = "nebulon";
														
		var thisCharacterObjectConstant_69 = "The Harrowed Cave_0";
														
		var thisInstanceObjectConstant_70 = instanceObject;
														
		
		//
		// Events override
		//
		
		
			instanceObject.events._add( "addObjects", function( args )
			{
				
		log.add( stringConstant_66 );
	thisInstanceObjectConstant_70[ 'interface' ] = stringConstant_66;
		
		
			});
		
		
	}	
	