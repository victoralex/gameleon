<?php

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(240, 240, 240));

$light = $world->createLight('Light', array(0, 0, -500));
$light->setColor(new Image_3D_Color(255, 255, 255));

$cube = $world->createObject('quadcube', array(150, 150, 150));
$cube->setColor(new Image_3D_Color(50, 50, 250, 200));

$cube_s1 = $world->createObject('quadcube', array(150, 150, 150));
$cube_s1->subdivideSurfaces(1);
$cube_s1->setColor(new Image_3D_Color(50, 50, 250, 170));

$cube_s2 = $world->createObject('quadcube', array(150, 150, 150));
$cube_s2->subdivideSurfaces(2);
$cube_s2->setColor(new Image_3D_Color(50, 50, 250, 50));

$world->transform($world->createMatrix('Rotation', array(15, 15, 0)));

$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, true);
$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);

$world->createRenderer('perspectively');
$world->createDriver('GD');
$world->render(400, 400, 'Image_3D_Quadcube.png');

echo $world->stats();

