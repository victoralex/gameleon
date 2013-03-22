	
	"use strict";
	
	exports.timer = function( args )
	{
		var self = this, _t = null;
		
		var _removeInstanceReference = function()
		{
			delete args.instanceObject.timers[ self.ID ];
		}
		
		this.ID = args.instanceObject.timers.push( this ) - 1;
		
		this.stopTimer = function( _args )
		{
			clearTimeout( _t );
			_removeInstanceReference();
			
			_args.onStop();
		}
		
		this.startTimer = function( _args )
		{
			_t = setTimeout( function()
			{
				_args.onFinalize();
			}, _args.minDelay + Math.round( Math.random() * Math.abs( _args.maxDelay - _args.minDelay ) ) );
		}
	}
	