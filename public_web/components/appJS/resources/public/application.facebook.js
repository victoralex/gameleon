	
	Application.facebook = {
		
		permissions: new Array(),
		
		init: function( args )
		{
			window.fbAsyncInit =	function()
												{
													FB.Canvas.setAutoResize();
													
													FB.init({
														appId: Application.configuration.facebook.appID, 
														status: true,
														cookie: true,
														xfbml: true
													});
													
													// Set the permissions as array
													Application.facebook.permissions = Application.configuration.facebook.permissions.split(",");
													
													/*
													var _facebookConnected = function()
													{
														FB.Canvas.setAutoResize();
														
														var query = FB.Data.query('select name, uid from user where uid={0}', FB._session.uid);
														
														query.wait(function(rows)
														{
															alert( 'Your name is ' + rows[0].name );
														});
													}
													*/
													
													FB.getLoginStatus( function( response )
													{
														if( response.session )
														{
															// logged in and connected user, someone you know
															
															var _noPermissions =	function()
																								{
																									if( args.afterFunction )
																									{
																										args.afterFunction({
																															facebookID: FB._session.uid,
																															hasRights: false,
																															isLoggedIn: true
																														});
																									}
																									
//																																Application.facebook.redirectToSubscribe();
																								};
															
															var _hasPermissions = 	function()
																									{
																										if( args.afterFunction )
																										{
																											args.afterFunction({
																																facebookID: FB._session.uid,
																																hasRights: true,
																																isLoggedIn: true
																															});
																										}
																										
//																																	_facebookConnected();
//																																	Application.facebook.addBookmark();
//																																	Application.facebook.inviteFriends();
																									}
															
															Application.facebook.hasPermissions(
																								_hasPermissions,
																								_noPermissions
																							);
														}
														else
														{
															if( args.afterFunction )
															{
																args.afterFunction({
																					facebookID: null,
																					hasRights: false,
																					isLoggedIn: false
																				});
															}
															
//																						Application.facebook.redirectToSubscribe();
														}
													});
												};
			
			/*
				Create facebook specific DIV
			*/
			
			var facebookDiv = document.createElement("div");
			facebookDiv.setAttribute("id", "fb-root");
			
			document.body.appendChild( facebookDiv );
			
			/*
				Load external Facebook Script
			*/
			
			(function()
			{
				var e = document.createElement('script');
				
				e.async = true;
				e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
				
				facebookDiv.appendChild(e);
			}());
		},
		
		login: function()
		{
			FB.login(	function(response)
			{
				if (response.session)
				{
					if (response.perms)
					{
						// user is logged in and granted some permissions.
						// perms is a comma separated list of granted permissions
						
						document.location.reload();
					}
					else
					{
						// user is logged in, but did not grant any permissions
						
						// must log the data for statistics purposes
						alert('no perms');
					}
				}
				else
				{
					// user cancelled login
					
					// must log the data for statistics purposes
					alert('no login');
				}
			},
			{
				perms: Application.configuration.facebook.permissions
			});
 		},
		
		redirectToLogin: function( requestPermissions )
		{
//			document.location.href = 'http://www.facebook.com/connect/uiserver.php?app_id=' + Application.configuration.facebook.appID + '&method=permissions.request&display=page&next=http%3A%2F%2Fapps.facebook.com%2Fbugcraft%2F&type=user_agent&canvas=1#
			
			var newLocation = 'https://graph.facebook.com/oauth/authorize?client_id=' + Application.configuration.facebook.appID + '&redirect_uri=' + encodeURIComponent( Application.configuration.facebook.appURL + "/index.php?page=profile&component=bugcraft&event=facebookPostAuthorize" ) + '&type=user_agent&scope=' + ( requestPermissions ? Application.configuration.facebook.permissions : '' ) + '&display=page';
			
			if( parent )
			{
				parent.location.href = newLocation;
			}
			else
			{
				document.location.href = newLocation;
			}
			
		},
		
		publishToWall: function()
		{
			FB.ui(
				{
					method: 'stream.publish',
					message: 'Check out this great app! http://apps.facebook.com/bugcraft/'
				}
			);
		},
		
		addBookmark: function()
		{
			FB.api(
				{
					method: 'fql.query',
					query: 'select bookmarked from permissions where uid=' + FB._session.uid
				},
				function( perms )
				{
					if( perms[0].bookmarked == '1' )
					{
						return false;
					}
					
					FB.ui(
						{
							method: 'bookmark.add'
						},
						function( perms )
						{
							alert('Thanks');
						}
					);
				}
			);
		},
		
		hasPermissions: function( trueFunction, falseFunction )
		{
			FB.api(
				{
					method: 'fql.query',
					query: 'select ' + Application.configuration.facebook.permissions + ' from permissions where uid=' + FB._session.uid
				},
				function( perms )
				{
					var fetchedPermissions = new Array();
					
					for(var perm in perms[0])
					{
						if( perms[0][perm] != '1' )
						{
							continue;
						}
						
						fetchedPermissions.push( perm );
					}
					
					if( fetchedPermissions.join(',') != Application.configuration.facebook.permissions )
					{
						falseFunction();
						
						return false;
					}
					
					trueFunction();
					
					return true;
				}
			);
		},
		
		inviteFriends: function()
		{
			FB.api(
				{
					method: 'fql.query',
					query: 'SELECT uid FROM user WHERE uid IN (SELECT uid2 FROM friend WHERE uid1=' + FB._session.uid + ') AND has_added_app = 1'
				},
				function(response)
				{
					var excludedIDs = new Array();
					
					for(var i=0;i<response.length;i++)
					{
						excludedIDs.push( response[ i ].uid );
					}
					
					var tempHTML = '<fb:serverFbml><script type="text/fbml">'
					tempHTML += '<fb:request-form action="http://' + Application.configuration.siteURL + '" method="POST" invite="true" type="bugcraft" content="';
						tempHTML += Application.util.html.htmlentities('<fb:name uid="' + FB._session.uid + '" firstnameonly="true" shownetwork="false"/> invited you to BugCraft! <fb:req-choice url="http://' + Application.configuration.siteURL + '" label="Add BugCraft!"/>');
					tempHTML += '">';
					tempHTML += '<fb:multi-friend-selector max="20" actiontext="Here are your friends who haven\'t added BugCraft to their profile." showborder="false" rows="5" exclude_ids="' + excludedIDs.join(',') + '"></fb:request-form>';
					tempHTML += '</script></fb:serverFbml>';
					
					var newDivObject = document.createElement("div");
					newDivObject.className = "facebookInviteContainer";
					newDivObject.innerHTML = tempHTML;
					document.body.appendChild( newDivObject );
					
					FB.XFBML.parse( newDivObject );
				}
			);
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	 