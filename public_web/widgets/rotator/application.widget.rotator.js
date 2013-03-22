	
	Application.widget.rotator = {
		
		widgetName: "rotator",
		
		objectVisibilityTime: 5000,
		objectInterTime: 250,
		animationDelayTime: 75,
		
		areaInfo: [],
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				Application.widget.rotator.enableOn( args[i] );
			}
		},
		
		enableOn: function( args )
		{
			var activeArea = document.getElementById( args.activeArea );
			
			var getNextNodePosition = 	function( args )
										{
											for(var i=args.childNumber;i<args.area.childNodes.length;i++)
											{
												if(args.area.childNodes[i].nodeType != 1)
												{
													continue;
												}
												
												return i;
											}
											
											return false;
										}
			
			var fadeIn = 	function( fadeArgs )
							{
								// IE Width & Height Patch
								if(fadeArgs.opacity == 0)
								{
									fadeArgs.area.childNodes[ fadeArgs.childNumber ].style.width = fadeArgs.area.childNodes[ fadeArgs.childNumber ].offsetWidth + "px";
									fadeArgs.area.childNodes[ fadeArgs.childNumber ].style.height = fadeArgs.area.childNodes[ fadeArgs.childNumber ].offsetHeight + "px";
								}
								
								// Cross-browser alpha
								fadeArgs.area.childNodes[ fadeArgs.childNumber ].style.opacity = fadeArgs.opacity / 100;
								fadeArgs.area.childNodes[ fadeArgs.childNumber ].style.MozOpacity = fadeArgs.opacity / 100;
								fadeArgs.area.childNodes[ fadeArgs.childNumber ].style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + fadeArgs.opacity + ")";
								
								if(fadeArgs.opacity >= 100 && fadeArgs.area.childNodes.length > fadeArgs.childNumber + 1)
								{
									Application.widget.rotator.areaInfo[ args.activeArea ].delayPointer = setTimeout( 	function()
																														{
																															fadeOut({
																																   area: fadeArgs.area,
																																   childNumber: fadeArgs.childNumber,
																																   opacity: fadeArgs.opacity - 10
																																 });
																														}, Application.widget.rotator.objectVisibilityTime);
									
									return;
								}
								
								Application.widget.rotator.areaInfo[ args.activeArea ].delayPointer = setTimeout( 	function()
																													{
																														fadeIn({
																															   area: fadeArgs.area,
																															   childNumber: fadeArgs.childNumber,
																															   opacity: fadeArgs.opacity + 10
																															 });
																													}, Application.widget.rotator.animationDelayTime);
							}
			
			var fadeOut = 	function( fadeArgs )
							{
								// Cross-browser alpha
								fadeArgs.area.childNodes[ fadeArgs.childNumber ].style.opacity = fadeArgs.opacity / 100;
								fadeArgs.area.childNodes[ fadeArgs.childNumber ].style.MozOpacity = fadeArgs.opacity / 100;
								fadeArgs.area.childNodes[ fadeArgs.childNumber ].style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + fadeArgs.opacity + ");";
								
								if(fadeArgs.opacity <= 0)
								{
									fadeArgs.area.childNodes[ fadeArgs.childNumber ].className = args.hiddenClass;
									
									Application.widget.rotator.areaInfo[ args.activeArea ].delayPointer = setTimeout( 	function()
																														{
																															var nextNodePosition = getNextNodePosition({
																																							area: fadeArgs.area,
																																							childNumber: fadeArgs.childNumber + 1
																																						});
																															
																															if(nextNodePosition == false)
																															{
																																nextNodePosition = 0;
																															}
																															
																															fadeArgs.area.childNodes[ nextNodePosition ].className = args.visibleClass;
																															
																															fadeIn({
																																   area: fadeArgs.area,
																																   childNumber: nextNodePosition,
																																   opacity: 0
																																 });
																														}, Application.widget.rotator.objectInterTime);
									
									return;
								}
								
								Application.widget.rotator.areaInfo[ args.activeArea ].delayPointer = setTimeout( 	function()
																													{
																														fadeOut({
																															   area: fadeArgs.area,
																															   childNumber: fadeArgs.childNumber,
																															   opacity: fadeArgs.opacity - 10
																															 });
																													}, Application.widget.rotator.animationDelayTime);
							}
			
			Application.widget.rotator.areaInfo[ args.activeArea ] = {
																delayPointer: null
															};
			
			Application.widget.rotator.areaInfo[ args.activeArea ].delayPointer = setTimeout( 	function()
																								{
																									activeArea.childNodes[0].className = args.visibleClass;
																									
																									fadeIn({
																										   area: activeArea,
																										   childNumber: 0,
																										   opacity: 0
																										 });
																								}, Application.widget.rotator.animationDelayTime);
		}
		
	}
	