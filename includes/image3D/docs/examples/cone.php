<?php

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(255, 255, 255));

$light = $world->createLight('Light', array(-2000, -2000, -2000));
$light->setColor(new Image_3D_Color(0, 0, 255));

$cone = $world->createObject('cone', array('detail' => 1));
$cone->setColor(new Image_3D_Color(255, 255, 255, 200));

$cone->transform($world->createMatrix('Scale', array(100, 400, 100)));
$cone->transform(
  $world->createMatrix('Move', array(0, -80, 0))->multiply(
  $world->createMatrix('Rotation', array(150, 30, 30))
  )
);

$world->createRenderer('perspectively');
$world->createDriver('SVG');
$world->render(400, 400, 'Image_3D_Object_Cone_2.svg');

echo $world->stats( );

