	
	/*
		blankComponent JS
	*/
	
	Component.blankComponent = {
		
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