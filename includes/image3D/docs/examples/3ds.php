<?php

require_once('Image/3D.php');

// Erstellen der Welt
$world = new Image_3D();
$world->setColor(new Image_3D_Color(255, 255, 255));

// Erstellung einer globalen Lichtquelle
$light = $world->createLight('Light', array(-2000, -2000, -2000));
$light->setColor(new Image_3D_Color(155, 155, 155));

// Eines Punktuellen Lichtes mit distancefalloff
$light = $world->createLight('Point', array(0, -100, 0, 'distance' => 200, 'falloff' => 2));
$light->setColor(new Image_3D_Color(255, 0, 0));

// Eines Spotlights
$light = $world->createLight('Spotlight', array(500, -500, -300, 'aim' => array(50, 30, 0), 'angle' => 10, 'float' => 2));
$light->setColor(new Image_3D_Color(0, 255, 0, 100));

// Erstellen einer Kugel
$sphere = $world->createObject('sphere', array('r' => 120, 'detail' => 5));
$sphere->setColor(new Image_3D_Color(200, 200, 200));
$sphere->transform($world->createMatrix('Move', array(70, 40, 0)));

// Import eines 3ds-Objekts (Schriftzug "Image 3D")
$text = $world->createObject('3ds', 'docs/examples/models/Image_3D.3ds');
$text->setColor(new Image_3D_Color(255, 255, 255, 180));
$text->transform($world->createMatrix('Rotation', array(90, 0, 0)));
$text->transform($world->createMatrix('Scale', array(5, 5, 5)));
$text->transform($world->createMatrix('Move', array(0, -40, 0)));

// Transformationen auf alle Objecte anwenden
$text->transform($world->createMatrix('Scale', array(2, 2, 2)));

// Erzeugen des gewuenschten Renderers
$world->createRenderer('perspectively');

// Erzeugen des gewuenschten Ausgabetreibers
$world->createDriver('SVG');

// Rendern des Bildes
$world->render(800, 400, 'example.svg');

// Ausgabe einiger Statistiken zu dem gerade erstellten Bild
echo $world->stats();
