#!/usr/local/bin/node
	
	var net = require('net'),
			log = require("../includes/classes/class.log"),
			realmConfig = require('../includes/config.realm').config;
	
	// connect to the database
	
	var sql = require('/storage/node-mysql-libmysqlclient').createConnectionSync();
	sql.connectSync(
				realmConfig.realmDatabaseHost,
				realmConfig.realmDatabaseUser,
				realmConfig.realmDatabasePass,
				realmConfig.realmDatabaseDB,
				null,
				null,
				sql.CLIENT_MULTI_RESULTS
			);
	
	var server = net.createServer().on(
										'connection',
										function( sock )
										{
											sock.on('data', function(data)
											{
												//log.add( data );
												
												var res = sql.querySync( data.toString() );
												
												if( !res )
												{
													console.log( "Query Error: " + data );
													console.log( "Query Details: " +  sql.errorSync() );
													
													sock.end( JSON.stringify({
																					r: 302
																				}) );
													
													return;
												}
												
												var proc_res = res.fetchAllSync();
												
												if( !proc_res )
												{
													sock.end( JSON.stringify({
																					r: 303
																				}) );
													
													return;
												}
												
												sock.end( JSON.stringify({
																				r: 200,
																				q: proc_res
																			}) );
																			
												while(sql.multiMoreResultsSync())
												{
													sql.multiNextResultSync();
												}
												
												res.freeSync();
											});
											
											/*
											sock.on('close', function()
											{
												console.log( "Connection closed" )
											});
											*/
										}
								);
	
	log.add( "Starting server on " + realmConfig.realmSyncSQLUnixSocket );
	
	server.listen(
				realmConfig.realmSyncSQLUnixSocket, 
				function()
				{
					log.add( "Sync SQL Server Ready" );
					
					// start the database transaction
					//sql.querySync("start transaction;");
					
					setInterval(	function()
										{
											/*
											sql.querySync("commit");
											sql.querySync("start transaction");
											*/
											
											//log.add( "Realm Saved" );
											
										}, realmConfig.realmSyncSQLTransactionDelay );
				}
			);
	
	
	
	
	
	
	
	
	
	
	
	
	
	