<?php

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(240, 240, 240));

$light1 = $world->createLight('Light', array(-300, 0, -300));
$light1->setColor(new Image_3D_Color(100, 100, 255));

$light2 = $world->createLight('Light', array(300, -300, -300));
$light2->setColor(new Image_3D_Color(100, 255, 100));

$count = 3;

$size = 20;
$offset = 10;

for ($x = -($count - 1) / 2; $x <= ($count - 1) / 2; ++$x) {
    for ($y = -($count - 1) / 2; $y <= ($count - 1) / 2; ++$y) {
        for ($z = -($count - 1) / 2; $z <= ($count - 1) / 2; ++$z) {
//        	if (max(abs($x), abs($y), abs($z)) < ($count - 1) / 2) continue;
        	if (max($x, $y, $z) <= 0) continue;
        	
        	$cube = $world->createObject('quadcube', array($size, $size, $size));
            $cube->setColor(new Image_3D_Color(255, 255, 255, 75));        	
            $cube->transform($world->createMatrix('Move', array($x * ($size + $offset), $y * ($size + $offset), $z * ($size + $offset))));
        }
    }
}

$world->transform($world->createMatrix('Rotation', array(220, 50, 0)));
$world->transform($world->createMatrix('Scale', array(2, 2, 2)));

$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, true);
$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);

$world->createRenderer('perspectively');
$world->createDriver('SVGControl');
$world->render(250, 250, 'Image_3D_Cubes.svg');

echo $world->stats();

