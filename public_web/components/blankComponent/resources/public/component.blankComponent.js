	
	/*
		blankComponent JS
	*/
	
	Component.blankComponent = {
		
		componentName: "blankComponent",
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.blankComponent.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			
		}
		
	};