<?php

$iterations = 40;
$images = 'php://output';

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(0, 0, 0));

$light1 = $world->createLight('Light', array(-500, 0, -500));
$light1->setColor(new Image_3D_Color(255, 50, 50));

$light2 = $world->createLight('Light', array(500, 0, -500));
$light2->setColor(new Image_3D_Color(50, 50, 255));

$p1 = $world->createObject('torus', array('inner_radius' => 50, 'outer_radius' => 90, 'detail_1' => 10, 'detail_2' => 1));
$p1->setColor(new Image_3D_Color(255, 255, 255));

$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, false);
$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);

$rotation = $world->createMatrix('Rotation', array(0, 0, 15));
$Xrotation = $world->createMatrix('Rotation', array(10, 2, 0));
$move = $world->createMatrix('Move', array(0, 0, -10));
$renderer = $world->createRenderer('perspectively');
$driver = $world->createDriver('ASCII');

$world->render(2 * 100, 6 * 50, $images);

$start = microtime(true);
$i = 0;
while ($i++ < $iterations) {
	$light1->transform($rotation);
	$light2->transform($rotation);
	$p1->setColor(new Image_3D_Color(255, 255, 255));
	$p1->transform($Xrotation);
	
	$driver->reset();
	$renderer->render($images);
}

$time = microtime(true) - $start;
printf("%2.2f fps\n", $iterations / $time);

