<?php

$images = 'php://output';
$iterations = 50;

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(0, 0, 0));

$light1 = $world->createLight('Light', array(-500, -500, -500));
$light1->setColor(new Image_3D_Color(255, 255, 255));

$light2 = $world->createLight('Light', array(0, 500, -550));
$light2->setColor(new Image_3D_Color(0, 255, 0));

$p1 = $world->createObject('cube', array(80, 80, 80));
$p1->setColor(new Image_3D_Color(200, 200, 200));
$p1->transform($world->createMatrix('Rotation', array(45, 45, 0)));

$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, false);
$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);

$rotation = $world->createMatrix('Rotation', array(2, 5, 0));
$renderer = $world->createRenderer('perspectively');
$driver = $world->createDriver('ASCII');

$world->render(2 * 80, 6 * 30, $images);

$start = microtime(true);
$i = 0;
while ($i++ < $iterations) {
	$p1->transform($rotation);
	$driver->reset();
	$renderer->render($images);
}

$time = microtime(true) - $start;
printf("%2.2f fps\n", $iterations / $time);

