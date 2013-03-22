	
	/*
		login JS
	*/
	
	Component.login = {
		
		componentName: "login",
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.login.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			Application.facebook.init({
												afterFunction: 	function()
																		{
																			
																		}
											});
		}
		
	};