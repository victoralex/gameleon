<?php

set_time_limit(0);
require_once('Image/3D.php');

$world = new Image_3D();
$world->setColor(new Image_3D_Color(80, 80, 80));

$light = $world->createLight('Light', array(-1000, -1000, -1000));
$light->setColor(new Image_3D_Color(255, 255, 255));

$redSpot = $world->createLight('Spotlight', array(0, 0, -200, 'aim' => array(0, -25, 0), 'angle' => 30, 'float' => 2));
$redSpot->setColor(new Image_3D_Color(255, 0, 0));

$blueSpot = $world->createLight('Spotlight', array(0, 0, -200, 'aim' => array(-35, 25, 0), 'angle' => 30, 'float' => 2));
$blueSpot->setColor(new Image_3D_Color(0, 0, 255));

$greenSpot = $world->createLight('Spotlight', array(0, 0, -200, 'aim' => array(35, 25, 0), 'angle' => 30, 'float' => 2));
$greenSpot->setColor(new Image_3D_Color(0, 255, 0));

$bezier = $world->createObject('bezier', array( 'x_detail' => 120, 
                                                'y_detail' => 120,
                                                'points' => array(
        array(  array(200, -150, -200),
                array(-100, 150, 600),
                array(-300, 150, -600),
                array(200, -150, 200),
            ),
        array(  array(0, -200, -100),
                array(0, 100, 250),
                array(0, 200, -250),
                array(0, -100, 100),
            ),
        array(  array(-150, -150, -200),
                array(200, 150, 300),
                array(200, 200, -300),
                array(-150, -150, 200),
            ),
    )));
$bezier->setColor(new Image_3D_Color(250, 250, 250));
$bezier->transform($world->createMatrix('Rotation', array(0, 120, 180)));

$renderer = $world->createRenderer('perspectively');

$world->createDriver('ZBuffer');
$world->render(400, 400, 'example.png');

echo $world->stats();

