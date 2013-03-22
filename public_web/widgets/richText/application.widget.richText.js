	
	Application.widget.richText = {
		
		initialized: false,
		
		init: function( args )
		{
			if(!Application.widget.richText.initialized)
			{
				/*
				var editor = CKEDITOR.replace(
										args.id,
										{
											toolbar: 
											[
												['NewPage','Preview'],
												['Cut','Copy','Paste','PasteText','PasteFromWord','-'],
												['Undo','Redo'],
												['Image'],
												['Bold','Italic','Underline','Strike'],
												['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
												['Link','Unlink','Anchor'],
												'/',
												['Styles','Format','Font','FontSize'],
												['TextColor','BGColor'],
											],
											skin: 'kama,/widgets/richText/ckeditor/skins/kama/',
											tabSpaces: 5
										}
									);
				*/
				
				// Widget is initilized
				Application.widget.richText.initialized = true;
			}
			
			for(var i=args.length-1;i>=0;i--)
			{
				new Application.widget.richText.create( args[i] );	
			}
		},
		
		create: function( args )
		{
			CKEDITOR.replace(
							args.id,
							{
								toolbar: 
								[
									['NewPage','Preview'],
									['Cut','Copy','Paste','PasteText','PasteFromWord','-'],
									['Undo','Redo'],
									['Image'],
									['Bold','Italic','Underline','Strike'],
									['NumberedList','BulletedList','-','Outdent','Indent','Blockquote'],
									['Link','Unlink','Anchor'],
									'/',
									['Styles','Format','Font','FontSize'],
									['TextColor','BGColor'],
								],
								skin: 'kama,/widgets/richText/ckeditor/skins/kama/',
								contentCss: "/widgets/richText/richText.php",
								tabSpaces: 5
							}
						);
		}
		
	}
	