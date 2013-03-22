#!/usr/local/bin/node
	
	var net = require('net'),
			fs = require( 'fs' ),
			log = require("../includes/classes/class.log"),
			realmConfig = require('../includes/config.realm').config;
	
	// connect to the database
	
	var sql = require( realmConfig.libraries.mysqlPath ).createConnectionSync();
	//var sqlBindings = require('/storage/node-mysql-libmysqlclient/mysql_bindings');
	sql.connectSync(
				realmConfig.realmDatabaseHost,
				realmConfig.realmDatabaseUser,
				realmConfig.realmDatabasePass,
				realmConfig.realmDatabaseDB,
				null,
				null,
				sql.CLIENT_MULTI_RESULTS
			);
	
	if( !sql.connectedSync() )
	{
		log.addError( "Persistent SQL Sync unable to connect to " + realmConfig.realmDatabaseUser + ":" + realmConfig.realmDatabasePass + "@" + realmConfig.realmDatabaseHost + "/" + realmConfig.realmDatabaseDB );
	}
	
	var connectionsNumber = 0, transactionsNumber = 0, lastTransactionCount = 0, benchmarkInterval = 1000, packetSplitter = null + "" + null + "" + null;
	
	var server = net.createServer().on(
										'connection',
										function( sock )
										{
											var receivedData = "";
											
											//log.add( "Connections: " + ( ++connectionsNumber ) );
											
											sock.on('data', function(data)
											{
												receivedData += data.toString();
												
												var _individualQueries = receivedData.split( packetSplitter );
												
												//log.add( "Received queries: " + _individualQueries.length );
												
												while( _individualQueries.length > 1 )
												{
													var _q = _individualQueries.splice( 0, 1 ).toString();
													
													if( _q.length == 0 )
													{
														continue;
													}
													
													//log.add( _q );
													
													if( !sql.multiRealQuerySync( _q ) )
													{
														log.addWarning( "Query Error: " + _q );
														log.addWarning( "Received data: " + receivedData );
														log.addWarning( "Individual queries: " + JSON.stringify(_individualQueries) );
														log.addWarning( "Query Details: " +  sql.errorSync() );
														
														sock.end( JSON.stringify({
																						r: 302
																					}) );
														
														return;
													}
													
													/*
													if( !( res instanceof sqlBindings.MysqlResult ) )
													{
														sock.end( JSON.stringify({
																						r: 303
																					}) );
														
														return;
													}
													*/
													
													var _r = sql.storeResultSync()
													
													try
													{
														sock.write( JSON.stringify({
																						r: 200,
																						q: ( _r != true ) ? _r.fetchAllSync() : [],
																					}) + packetSplitter );
													}
													catch( err )
													{
														connectionsNumber--;
														
														sock.emit( "close" );
														
														// exhaust the buffer
														while(sql.multiMoreResultsSync())
														{
															sql.multiNextResultSync();
														}
														
														log.addNotice( err );
														
														return;
													}
													
													// exhaust the buffer
													while(sql.multiMoreResultsSync())
													{
														sql.multiNextResultSync();
													}
													//sql.freeSync();
													
													transactionsNumber++;
												}
												
												var _index = receivedData.lastIndexOf( packetSplitter );
												
												if( _index != -1 )
												{
													// make sure we erase the analyzed part
													receivedData = receivedData.substring( _index + packetSplitter.length );
												}
											});
											
											sock.on( 'error', function( err )
											{
												log.addNotice( err );
											});
											
											sock.on('close', function()
											{
												//log.addNotice( "Connection closed with client" );
											});
										}
								);
	
	var _savePID = function( after )
	{
		fs.writeFile(
				"daemon.psqlsync.pid",
				process.pid,
				function(err)
				{
					if( err )
					{
						log.addError( "Error saving process ID " + err );
					}
					
					after();
				}
			); 
	}
	
	log.add( "Starting server on " + realmConfig.realmSyncSQLUnixSocket + "_p" );
	
	_savePID( function()
	{
		fs.unlink( realmConfig.realmSyncSQLUnixSocket + "_p", function (err)
		{
			server.listen(
						realmConfig.realmSyncSQLUnixSocket + "_p", 
						function()
						{
							//
							// Initialize
							//
							
							log.addNotice( "Persistent Sync SQL Server Ready" );
							
							//
							// Internal Benchmark
							//
							
							var lastBenchMarkDate = new Date()
							setInterval( function()
							{
								var _c = new Date ();
								var _t = _c - lastBenchMarkDate;
								lastBenchMarkDate = _c;
								
								//log.addNotice( "Transactions / " + ( benchmarkInterval / 1000 ) + " sec: " + ( ( transactionsNumber - lastTransactionCount ) / ( _t / benchmarkInterval ) ) );
								
								lastTransactionCount = transactionsNumber;
							}, benchmarkInterval );
						}
					);
		});
	});
	
	
	
	
	
	
	
	
	
	
	
	
	
	