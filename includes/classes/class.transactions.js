	
    "use strict"; // enable strict mode within this file
	
	//
	//	Transactions management
	//
	
	var realmConfig = require('../config.realm').config,
			log = require( "./class.log" );
	
	exports.transaction = function()
	{
		var _queue = [], self = this;
		
		this.inProgress = false;
		
		this.start = function( afterFunction )
		{
			self.addToQueue( afterFunction );
			
			if( self.inProgress )
			{
				return false;
			}
			
			return ( self.inProgress = true );
		}
		
		this.finish = function()
		{
			self.inProgress = false;
			
			for(var i=0;i<_queue.length;i++)
			{
				_queue[ i ]();
			}
			
			// erase the queue
			
			_queue = [];
		}
		
		this.addToQueue = function( afterFunction )
		{
			if( typeof afterFunction != "function" )
			{
				return false;
			}
			
			return _queue.push( afterFunction );
		}
	}
	
	
	
	
	
	
	
	
	
	
	
	
	