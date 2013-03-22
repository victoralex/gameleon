#!/usr/local/bin/node
	
	var gameRealm = require('../includes/classes/class.realm').gameRealm,
			instanceProcess = require('../includes/classes/class.instanceProcess').instanceProcess,
			cluster = require("cluster");
	
	// initialize
	if( cluster.isMaster )
	{
		( new gameRealm() ).init();
	}
	else
	{
		( new instanceProcess() ).init();
	}
	
	
	
	
	
	
	
	
	
	
	
	
	