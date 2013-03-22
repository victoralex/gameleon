
    "use strict"; // enable strict mode within this file
	
	var log = require( "./class.log" );
	
	exports.incrementNoCallback =  function( args )
	{
		var _co = args.characterObject;
		
		_co.getInstance().redisClient.HINCRBY(
														"stats.character." + _co.properties.character_id,
														args.name,
														args.value,
														function(err, res)
														{
															if( err )
															{
																log.addError( "Stat update for CID " + _co.properties.character_id + ", var name " + args.name + " to value " + args.value + ". " + err );
																
																return;
															}
															
															
														}
													);
	}
	
	exports.incrementNoCallbackCustomRedisConnection =  function( args )
	{
		var _co = args.characterObject;
		
		args.redisClient.HINCRBY(
									"stats.character." + _co.properties.character_id,
									args.name,
									args.value,
									function(err, res)
									{
										if( err )
										{
											log.addError( "Stat update for CID " + _co.properties.character_id + ", var name " + args.name + " to value " + args.value + ". " + err );
											
											return;
										}
										
										
									}
								);
	}
	
	exports.increment =  function( args )
	{
		var _co = args.characterObject;
		
		_co.getInstance().redisClient.HINCRBY(
														"stats.character." + _co.properties.character_id,
														args.name,
														args.value,
														function(err, res)
														{
															if( err )
															{
																log.addError( "Stat update for CID " + _co.properties.character_id + ", var name " + args.name + " to value " + args.value + ". " + err );
																
																return;
															}
															
															args.after( parseInt( res ) );
														}
													);
	}
	
	exports.deleteInstanceData = function( instanceObject, after )
	{
		/*
		instanceObject.redisClient.DEL(
												"instance." + instanceObject.zone_id + ".stats",
												function( err, res )
												{
													if( err )
													{
														log.addError( "error removing previous instance statistical data for iID " + instanceObject.zone_id + ": " + err );
														
														return;
													}
													
													after();
												}
											);
		*/
		
		after();
	}
	
	exports.incrementInstanceNoCallback =  function( args )
	{
		var _co = args.characterObject;
		
		_co.getInstance().redisClient.HINCRBY(
														"stats.instance." + _co.getInstance().zone_id,
														"character." + _co.properties.character_id + "." + args.name,
														args.value,
														function(err, res)
														{
															if( err )
															{
																log.addError( "Stat update for CID " + _co.properties.character_id + ", var name " + args.name + " to value " + args.value + ". " + err );
																
																return;
															}
															
															
														}
													);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	