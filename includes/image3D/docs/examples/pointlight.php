<?php

set_include_path( "/usr/www/bugcraft.emotionconcept.ro/includes/Image_3D-0.4.1" );

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(250, 250, 250));

$light = $world->createLight('Point', array(0, -200, 0, 'distance' => 300, 'falloff' => 2));
$light->setColor(new Image_3D_Color(150, 150, 255));

$steps = 10;
$step = 20;

for ($i = 0; $i < $steps; ++$i) {
	$y = ($steps * $step / -2) + $i * $step;
	$p = $world->createObject('polygon', array(new Image_3D_Point(-100, $y, -30), new Image_3D_Point(-100, $y, 50), new Image_3D_Point(100, $y, 40)));
	$p->setColor(new Image_3D_Color(255, 255, 255));
}

$world->transform($world->createMatrix('Rotation', array(20, 0, 0)));

$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, false);
$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);

$world->createRenderer('perspectively');
$world->createDriver('ImageMagick');
$world->render(400, 400, 'Image_3D_Pointlight.png');

echo $world->stats( );

