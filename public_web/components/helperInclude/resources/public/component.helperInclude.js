	
	/*
		helperInclude JS
	*/
	
	Component.helperInclude = {
		
		componentName: "helperInclude",
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.helperInclude.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			
		}
		
	};