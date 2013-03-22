<?php

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(255, 255, 255));

$light = $world->createLight('Light', array(-2000, -2000, -2000));
$light->setColor(new Image_3D_Color(255, 255, 255));

$redLight = $world->createLight('Light', array(90, 0, 50));
$redLight->setColor(new Image_3D_Color(255, 0, 0));

$sphere = $world->createObject('sphere', array('r' => 150, 'detail' => 4));
$sphere->setColor(new Image_3D_Color(150, 150, 150));

$renderer = $world->createRenderer('perspectively');

$world->createDriver('GD');
$world->render(400, 400, 'example.png');

echo $world->stats();

