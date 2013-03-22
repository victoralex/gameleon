
    "use strict"; // enable strict mode within this file
	
	var realmConfig = require('../config.realm').config,
		log = require( "./class.log" ),
		fs = require( "fs" );
	
	exports.instanceProcess = function()
	{
		var self = this;
		
		this.chatCommandsDir = realmConfig.realmInstallPath + "/includes/classes/class.chatCommand.js_files/";
		this.instanceCommandsDir = realmConfig.realmInstallPath + "/includes/classes/class.instance.js_commands/";
		
		this._commands = {};
		this._chatCommands = {};
		
		this.instanceObject = null;
		
		// init sql connection
		this.sql = require( realmConfig.libraries.mysqlPath ).createConnectionSync();
		this.sql.connectSync( realmConfig.realmDatabaseHost, realmConfig.realmDatabaseUser, realmConfig.realmDatabasePass, realmConfig.realmDatabaseDB );
		
		this.init = function()
		{
			self.loadCommands(function()
			{
				self.loadChat( function()
				{
					self.startListening();
				});
			});
		}
		
		this.loadChat = function( after )
		{
			// load commands support
			
			fs.readdir( this.chatCommandsDir, function( err, files )
			{
				for(var i=0;i<files.length;i++)
				{
					var _tokens = files[i].split( "." );
					
					for( var roleName in realmConfig.chat.roles )
					{
						if( !self._chatCommands[ roleName ] )
						{
							// init role vector
							
							self._chatCommands[ roleName ] = {};
						}
						
						if( realmConfig.chat.roles[ roleName ].indexOf(_tokens[2]) == -1 )
						{
							// command not associated with this role
							
							continue;
						}
						
						self._chatCommands[ roleName ][ _tokens[2] ] = require( self.chatCommandsDir + _tokens[0] + "." + _tokens[1] + "." + _tokens[2] );
						
						log.add( "Loaded chat command: " + roleName + " " + _tokens[2]);
					}
				}
				
				after();
			});
		};
		
		this.loadCommands = function( after )
		{
			// load commands support
			
			fs.readdir( this.instanceCommandsDir, function( err, files )
			{
				for(var i=0;i<files.length;i++)
				{
					var _tokens = files[i].split( "." );
					
					self._commands[ _tokens[1] ] = require( self.instanceCommandsDir + _tokens[0] + "." + _tokens[1] );
					
					log.add( "Loaded instance command: " + _tokens[1] );
				}
				
				after();
			});
		};
		
		//
		// internal diagnostics
		//
		
		var _lastBenchMarkDate = new Date();
		var _performanceBenchmark = function()
		{
			var _c = new Date ();
			var _t = _c - _lastBenchMarkDate;
			
			if( _t > realmConfig.instanceLagChecksMaxDifference )
			{
				// a 50ms lag is acceptable
				
				if( self.instanceObject )
				{
					log.addWarning( "Instance " + self.instanceObject.zone_id + " ( " + self.instanceObject.zone_id_zone_pool + " ) is lagging by " + ( _t - realmConfig.instanceLagChecksInterval ) + " ms" );
				}
				else
				{
					log.addWarning( "Instance process is lagging by " + ( _t - realmConfig.instanceLagChecksInterval ) + " ms" );
				}
			}
			
			_lastBenchMarkDate = _c;
			
			setTimeout( _performanceBenchmark,  realmConfig.instanceLagChecksInterval );
		};
		
		_performanceBenchmark();
		
		//
		// Initialize
		//
		
		var messageCallBacks = [];
		this.messageToRealm = function( args, callBack )
		{
			// send the ready command to the realm
			process.send({
						cmd: args.cmd,
						id: messageCallBacks.push( callBack ) - 1,
						p: args
					});
		};
		
		this.startListening = function()
		{
			// hack into the commands processing
			self._commands._processMessageFromRealm = { performCommand: function( args )
			{
				messageCallBacks[ args.id ]( args.res );
				
				delete messageCallBacks[ args.id ];
			}};
			
			// messages from the master
			process.on( "message", function( message )
			{
				if( !self._commands[ message.cmd ] )
				{
					// send error to client
					
					log.addError( "Instance Command <" + message.cmd + "> not found" );
					
					return;
				}
				
				// perform command
				self._commands[ message.cmd ].performCommand({
																					res: message.p,			// send the params
																					id: message.id,
																					sql: self.sql,
																					instanceProcess: self,
																					instanceObject: self.instanceObject
																				});
			});
			
			// process fully initialized. send the "ready" status to the realm
			process.send({
						cmd: "ready"
					});
		}
	}




















