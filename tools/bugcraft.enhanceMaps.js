#!/usr/local/bin/node
	
	var fs = require('fs'),
		log = require("../includes/classes/class.log"),
		enhance = require("../includes/classes/class.enhanceMaps2").enhance;
	
	var performOnDirs = function()
	{
		var mapsRawDir = "../public_web/components/bugcraft/resources/private/maps_raw/";
		var mapsMetaDir = "../public_web/components/bugcraft/resources/private/maps_meta/";
		
		fs.readdir( mapsRawDir, function( err, files )
		{
			for(var i=0;i<files.length;i++)
			{
				var _tokens = files[i].split( "." );
				
				if( _tokens[1] != "js" )
				{
					continue;
				}
				
				var self = new enhance({
											sourceMapFileName: "../" + mapsRawDir + _tokens[0],
											sourceMapID: _tokens[0],
											targetMapDir: mapsMetaDir,
											targetMapFileName: mapsMetaDir + _tokens[0] + ".js"
										});
			}
		});
	}
	
	performOnDirs();
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	