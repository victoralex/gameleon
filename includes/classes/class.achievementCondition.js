
	"use strict";

	var log = require( "./class.log" ),
		realmConfig = require('../config.realm').config,
		redis = require( realmConfig.libraries.redisPath );
	
	exports.condition = function( args )
	{
		var redisClient = args.achievementServer.redisSpeaker;
		
		var self = this;
		
		this.parameterName = args.parameterName;
		this.targetValue = args.targetValue;
		
		this.checkState = function( _args )
		{
			redisClient.HGET(
								"achievement." + args.achievement.id,
								_args.characterId + "." + self.parameterName,
								function(err, res)
								{
									if( err )
									{
										log.addError(err);
										
										return;
									}
									
									if( parseInt( res, 10 ) < self.targetValue )
									{
										return;
									}
									
									_args.after();
								}
							);
		}
		
	}