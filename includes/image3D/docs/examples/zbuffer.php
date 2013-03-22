<?php

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(50, 50, 50));

$light1 = $world->createLight('Light', array(-20, -20, -20));
$light1->setColor(new Image_3D_Color(255, 255, 255));

$light2 = $world->createLight('Light', array(20, 20, -20));
$light2->setColor(new Image_3D_Color(0, 200, 0));

$p1 = $world->createObject('polygon', array(new Image_3D_Point(-30, 100, 0), new Image_3D_Point(-30, -150, 0), new Image_3D_Point(80, 0, 30)));
$p1->setColor(new Image_3D_Color(100, 200, 100));
$p2 = $world->createObject('polygon', array(new Image_3D_Point(-100, 50, 30), new Image_3D_Point(-70, -100, -20), new Image_3D_Point(150, 90, 0)));
$p2->setColor(new Image_3D_Color(100, 100, 200));
$p2 = $world->createObject('polygon', array(new Image_3D_Point(-30, 20, -50), new Image_3D_Point(-50, -30, -80), new Image_3D_Point(50, 30, 40)));
$p2->setColor(new Image_3D_Color(200, 100, 100, 100));

$world->transform($world->createMatrix('Rotation', array(90, 90, 0)));

$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, false);
$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);

$world->createRenderer('perspectively');
$world->createDriver('ZBuffer');
$world->render(400, 400, 'Image_3D_ZBuffer.png');

echo $world->stats( );

