<?php

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(255, 255, 255));

$light = $world->createLight('Light', array(-2000, -2000, -2000));
$light->setColor(new Image_3D_Color(255, 255, 255));

$redSpot = $world->createLight('Spotlight', array(0, 0, -200, 'aim' => array(0, -25, 0), 'angle' => 30, 'float' => 2));
$redSpot->setColor(new Image_3D_Color(255, 0, 0));

$blueSpot = $world->createLight('Spotlight', array(0, 0, -200, 'aim' => array(-35, 25, 0), 'angle' => 30, 'float' => 2));
$blueSpot->setColor(new Image_3D_Color(0, 0, 255));

$greenSpot = $world->createLight('Spotlight', array(0, 0, -200, 'aim' => array(35, 25, 0), 'angle' => 30, 'float' => 2));
$greenSpot->setColor(new Image_3D_Color(0, 255, 0));

$map = $world->createObject('map');

$detail = 80;
$size = 200;
$height = 40;

$raster = 1 / $detail;
for ($x = -1; $x <= 1; $x += $raster) {
	$row = array();
	for ($y = -1; $y <= 1; $y += $raster) {
		$row[] = new Image_3D_Point($x * $size, $y * $size, sin($x * pi()) * sin($y * 2 * pi()) * $height);
	}
	$map->addRow($row);
}

$map->setColor(new Image_3D_Color(150, 150, 150, 0));

$world->transform($world->createMatrix('Rotation', array(-20, 10, -10)));

$world->createRenderer('perspectively');
$world->createDriver('GD');
$world->render(400, 400, 'Image_3D_Spotlights.png');

echo $world->stats();

