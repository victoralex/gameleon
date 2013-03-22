	
	"use strict";
	
	var log = require( "./class.log" ),
		realmConfig = require('../config.realm').config,
		redis = require( realmConfig.libraries.redisPath );
	
	exports.condition = function( args )
	{
		var _q = args.quest,
				redisClient = args.questServer.redisSpeaker,
				self = this;
		
		this.parameterName = args.parameterName;
		this.targetValue = args.targetValue;
		
		this.checkState = function( _args )
		{
			redisClient.HGET(
								"quest." + _q.id,
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