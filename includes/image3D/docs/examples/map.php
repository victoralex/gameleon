<?php

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(255, 255, 255));

$light1 = $world->createLight('Light', array(-20, -20, -20));
$light1->setColor(new Image_3D_Color(255, 255, 255));

$light2 = $world->createLight('Light', array(20, 20, -20));
$light2->setColor(new Image_3D_Color(0, 200, 0));

$map = $world->createObject('map');

$detail = 30;
$size = 150;
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
$map->transform($world->createMatrix('Rotation', array(-40, 20, -10)));

$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, false);
$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);

$world->createRenderer('perspectively');
$world->createDriver('GD');
$world->render(400, 400, 'Image_3D_Object_Map.png');

echo $world->stats();

