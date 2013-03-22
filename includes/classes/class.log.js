
    "use strict"; // enable strict mode within this file
	
	//
	//	Console logging treatment
	//
	
	var realmConfig = require('../config.realm').config,
			cluster = require('cluster'),
			util = require( "util" ),
			clc = require( realmConfig.libraries.cliColorPath );
	
	exports.TYPE_INFO = "INFO";
	exports.TYPE_WARNING = "WARNING";
	exports.TYPE_ERROR = "ERROR";
	exports.TYPE_NOTICE = "NOTICE";
	
	exports.addError = function( text )
	{
		this._add({
				type: this.TYPE_ERROR,
				color: clc.red,
				text: text
			});
		
		console.trace();
		
		//process.exit( 1 );
	};
	
	exports.addNotice = function( text )
	{
		this._add({
				type: this.TYPE_NOTICE,
				color: clc.bold,
				text: text
			});
	};
	
	exports.addWarning = function( text )
	{
		this._add({
				type: this.TYPE_WARNING,
				color: clc.yellow,
				text: text
			});
	};
	
	exports.add = function( text )
	{
		this._add({
			type: this.TYPE_INFO,
			color: clc.white,
			text: text
		});
	};
		
	exports._add = function( args )
	{
		args.type = args.type ? args.type : this.TYPE_INFO;
		var d = new Date();
		
		var pid = cluster.isMaster ? "M" : process.pid;
		
		console.log( clc.underline( d.getMinutes() + "." + d.getSeconds() ) + " (" + pid + ") " + args.color( args.type ) + ": " + ( ( typeof args.text == "string" ) ? args.text : util.inspect( args.text, false, true ) ) );
	};
	
	
	
	
	
	
	
	
	
	
	
	