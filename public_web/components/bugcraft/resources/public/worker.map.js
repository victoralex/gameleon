	
	var dragContainer = {},
		square_width = 0,
		square_height = 0,
		big_size_width = 0,
		big_size_height = 0,
		mapWidth = 0,
		mapHeight = 0;
		

	self.addEventListener(
							'message',
							function(e) 
							{
								var data = e.data;
								switch (data.c)
								{
									case 'init':
									
										dragContainer = data.dragContainer;
										square_width = data.square_width;
										square_height = data.square_height;
										big_size_width = data.big_size_width;
										big_size_height = data.big_size_height;
										mapWidth = data.mapWidth;
										mapHeight = data.mapHeight;
									
										self.postMessage({
															c: data.c,
															r: 200
														});
									
									break;
									case 'checkMapMove':
									
										var dx = data.dx,
											dy = data.dy;
											
										//check for valid move START
										//map at 0 x
										if( dx > 0 && (dragContainer.offsetLeft + dx) > -square_width )
										{
											dx = -dragContainer.offsetLeft - square_width;
										}
										
										//map at 0 y
										if( dy > 0 && (dragContainer.offsetTop + dy) > -square_height )
										{
											dy = -dragContainer.offsetTop - square_height;
										}
										
										//map at max x
										if( dx < 0 && (dragContainer.offsetLeft + dx) < (-1) * (big_size_width - mapWidth + square_width) )
										{
											dx = -dragContainer.offsetLeft - (big_size_width - mapWidth + square_width) ;
										}
										
										//map at max y
										if( dy < 0 && (dragContainer.offsetTop + dy) < (-1) * (big_size_height - mapHeight + square_height) )
										{
											dy = -dragContainer.offsetTop - (big_size_height - mapHeight + square_height);
										}
										
										if( dx == 0 && dy == 0 )
										{
											self.postMessage({
															c: data.c,
															r: 300
														});
														
											return;
										}
										//check for valid move END
										
										var edx = 0, edy = 0;
										if( dragContainer.offsetLeft + dx < -300 )
										{
											if( Math.abs(dx) > square_width/2 )
											{
												edx = Math.floor(Math.abs(dx) / square_width);
												if( dx < 0 )
												{
													edx *= (-1);
												}
											}
										}
										
										if( dragContainer.offsetTop + dy < -300 )
										{
											if( Math.abs(dy) > square_height/2 )
											{
												edy = Math.floor(Math.abs(dy) / square_height);
												if( dy < 0 )
												{
													edy *= (-1);
												}
											}
										}
										
										self.postMessage({
															c: data.c,
															r: 200,
															dx: dx,
															dy: dy,
															edx: edx,
															edy: edy
														});
										
									break;
									case 'stop':
									
										self.postMessage('WORKER STOPPED: ' + data.msg + '. (buttons will no longer work)');
										self.close(); // Terminates the worker.
										
									break;
									default:
									
										self.postMessage('Unknown command: ' + data.msg);
								};
							},
							false);