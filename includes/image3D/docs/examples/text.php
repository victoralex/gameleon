<?php

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(240, 240, 240));

$light = $world->createLight('Light', array(-20, -20, -20));
$light->setColor(new Image_3D_Color(100, 100, 255));

$text = $world->createObject('text', 'Image_3D_Object_Text');
$text->setColor(new Image_3D_Color(150, 150, 150));
$text->transform($world->createMatrix('Rotation', array(0, 10, 0)));
$text->transform($world->createMatrix('Move', array(-50, 0, 20)));
$text->transform($world->createMatrix('Scale', array(3, 3, 3)));

$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, false);
$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);

$world->createRenderer('perspectively');
$world->createDriver('GD');
$world->render(400, 50, 'Image_3D_Object_Text.png');

echo $world->stats( );

