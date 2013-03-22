	
	Application.widget.button = {
		
		widgetName: "button",
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Application.widget.button.create( args[i] );
			}
		},
		
		create: function( args )
		{
			var object = document.getElementById( args.id );
			
			Application.event.add(object, "mouseover", 	function()
														{
															object.className = args.overClass;
														});
			
			Application.event.add(object, "mouseout", 	function()
														{
															object.className = args.outClass;
														});
			
			Application.event.add(object, "click", 	function()
													{
														args.clickFunction();
													});
		}
		
	}
	