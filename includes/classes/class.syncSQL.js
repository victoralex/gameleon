
    "use strict"; // enable strict mode within this file
	
	//
	//	SQL Server Query Treatment
	//
	
	var net = require('net'),
			log = require("./class.log"),
			realmConfig = require('../../includes/config.realm').config;
	
	exports.q = function( query, callBack )
	{
		var s = net.Socket(), message = "";
		s.setEncoding('ascii');
		s.setNoDelay( true );
		
		var _connect = function()
		{
			s.connect( realmConfig.realmSyncSQLUnixSocket );
		}
		
		_connect();
		
		s.on('error',	function( socketException )
							{
								if( socketException.errno === process.ECONNREFUSED ) // ECONNREFUSED
								{
									// attempt a reconnect
									setTimeout( _connect, 50 );
								}
								
								log.add( "SyncSQL Socket error: " + socketException.errno );
							});
		
		s.on('data', 	function( data )
							{
								// buffer the data
								
								message += data;
							});
		
		s.on( 'end', function( data )
						{
							try
							{
								var d = JSON.parse( message );
							}
							catch( e )
							{
								log.add( "SQL client JSON parse error: " + e.error + " for " + message );
								
								return;
							}
							
							if( d.r != 200 )
							{
								throw "Query Error (" + d.r + ") : " + query;
							}
							
							callBack( d.q );
						});
		
		s.write( query );
	}
	
	exports.p = function()
	{
		//log.addNotice( "SyncSQL Iteration Created" );
		
		var s = net.Socket(), message = "", callBacks = [], packetSplitter = null + "" + null + "" + null;
		s.setNoDelay( true );
		s.connect( realmConfig.realmSyncSQLUnixSocket + "_p" );
		
		var _interpretData = function( string )
		{
			try
			{
				var d = JSON.parse( string );
			}
			catch( err )
			{
				log.add( "SQL client JSON parse error: " + err + "\nInterpretation function would have been: " + callBacks[0] + "\nResult: " + string);
				
				return;
			}
			
			if( d.r != 200 )
			{
				throw "Query Error (" + d.r + ") : " + string;
			}
			
			callBacks[0]( d.q );
			callBacks.splice( 0, 1 );
		}
		
		s.on('error',	function( socketException )
							{
								//if( socketException.errno === 61 ) // ECONNREFUSED
								
								log.add( "SyncSQL Socket error: " + socketException.errno );
							});
		
		s.on('data', 	function( data )
							{
								// buffer the data
								
								message += data;
								
								//log.add( "Buffer length: " + message.length );
								
								var _individualResults = message.split( packetSplitter );
								
								if( _individualResults.length > 1 )
								{
									// make sure we erase the analyzed part
									message = message.substring( message.lastIndexOf( packetSplitter ) + packetSplitter.length );
								}
								
								while( _individualResults.length > 1 )
								{
									var _q = _individualResults.splice( 0, 1 ).toString();
									
									if( _q.length == 0 )
									{
										continue;
									}
									
									_interpretData( _q );
								}
							});
		
		this.q = function( query, callBackFunction )
		{
			s.write( query + packetSplitter );
			
			callBacks.push( callBackFunction );
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	