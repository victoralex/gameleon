	
	/*
		serverError JS
	*/
	
	Component.serverError = {
		
		componentName: "serverError",
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.serverError.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			
		}
		
	};