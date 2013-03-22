	
	/*
		translationEditor JS
	*/
	
	Component.translationEditor = {
		
		init: function( args )
		{
			for(var i=args.length-1;i>=0;i--)
			{
				new Component.translationEditor.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			var formObject = document.getElementById( args.id + "_form" );
			var showObject = Application.util.urlInformation.params.show;
			
			if( showObject && showObject != "list" )
			{
				if( showObject == "edit" )
				{
					var formSendLinkObject = document.getElementById( args.id + "_formApplyLink" );
					
					Application.event.add( formSendLinkObject, "click", 	function()
																								{
																									document.getElementById( args.id + "_formRedirect" ).value = "1";
																									
																									formObject.submit();
																									
																									return false;
																								});	
					
					var formSendLinkObject = document.getElementById( args.id + "_formSendLink" );
					
					Application.event.add( formSendLinkObject, "click", 	function()
																								{
																									formObject.submit();
																									
																									return false;
																								});	
				}
				
				return;
			}
			
			/*
				General filters
			*/
			
			var _addFilterEvents = function( object )
			{
				Application.event.add( object, "change", 	function()
																			{
																				document.getElementById( args.id + "_form_filters" ).submit();
																				
																				return false;
																			});	
			}
			
			var position = 1;
			while(true)
			{
				var formFilterObject = document.getElementById( args.id + "_form_filter_" + position );
				
				if(!formFilterObject)
				{
					break;
				}
				
				_addFilterEvents( formFilterObject );
				
				position++;
			}
		},
		
		showComponents: function()
		{
			var newURL = '/index.php?';
			
			if(Application.util.urlInformation.params[ "language" ])
			{
				newURL += '&language=' + Application.util.urlInformation.params[ "language" ];
			}
			
			document.location.href = newURL;
		},
		
		showList: function()
		{
			var newURL = 'index.php?page=' + Application.util.urlInformation.params[ "page" ] + '&component=translationEditor&show=list';
			
			if(Application.util.urlInformation.params[ "language" ])
			{
				newURL += '&language=' + Application.util.urlInformation.params[ "language" ];
			}
			
			document.location.href = newURL;
		}
		
	};