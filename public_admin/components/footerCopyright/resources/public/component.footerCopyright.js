	
	/*
		footerCopyright JS
	*/
	
	Component.footerCopyright = {
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.footerCopyright.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			
		}
		
	};