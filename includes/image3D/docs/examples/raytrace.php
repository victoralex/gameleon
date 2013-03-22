<?php

set_include_path( "/usr/www/bugcraft.emotionconcept.ro/includes/Image_3D-0.4.1" );

require_once 'Image/3D.php';
// resize image according to this factor
$factor = 400;

$orbiterMeshPrefix = "/usr/www/bugcraft.emotionconcept.ro/public_web/" . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "orbiter_mesh";
$meshDirectoryFiles = dir( $orbiterMeshPrefix );

while (false !== ($entry = $meshDirectoryFiles->read()))
{
	if( is_dir( $orbiterMeshPrefix . DIRECTORY_SEPARATOR . $entry ) )
	{
		continue;
	}
	
	$orbiterMeshFile = file( $orbiterMeshPrefix . DIRECTORY_SEPARATOR . $entry, FILE_IGNORE_NEW_LINES );
	$groupsNumber = substr( $orbiterMeshFile[1], strpos( $orbiterMeshFile[1], " " ) + 1 );
	$groupsStart = 6;
	$content = array();
	
	$world = new Image_3D();
	$world->setColor(new Image_3D_Color(255, 255, 255, 100));
	
	for($j=0;$j<$groupsNumber;$j++)
	{
		$points = array();
		$faces = array();
		
		$contentInfo = explode( " ", $orbiterMeshFile[ $groupsStart ] );
		$contentInfo[1] += $groupsStart + 1;
		$contentInfo[2] += $contentInfo[1];
		
		for($i=$groupsStart + 1;$i<$contentInfo[1];$i++)
		{
			$points[] = explode( " ", $orbiterMeshFile[$i] );
		}
		
		for($i=$contentInfo[1];$i<$contentInfo[2];$i++)
		{
			$faces = explode( " ", $orbiterMeshFile[$i] );
			
			$poly = $world->createObject('polygon', array(
				new Image_3D_Point( $points[ $faces[0] ][ 0 ] * $factor, $points[ $faces[0] ][ 1 ] * $factor, $points[ $faces[0] ][ 2 ] * $factor),
				new Image_3D_Point( $points[ $faces[1] ][ 0 ] * $factor, $points[ $faces[1] ][ 1 ] * $factor, $points[ $faces[1] ][ 2 ] * $factor),
				new Image_3D_Point( $points[ $faces[2] ][ 0 ] * $factor, $points[ $faces[2] ][ 1 ] * $factor, $points[ $faces[2] ][ 2 ] * $factor)
			));
			$poly->setColor(new Image_3D_Color(200, 200, 200, 70, .9));
		}
		
		$groupsStart = $contentInfo[2] + 4;
	}
	
	$light = $world->createLight('Light', array(-4 * $factor, -4 * $factor, 0));
	$light->setColor(new Image_3D_Color(255, 255, 255, 75));
	$lightSphere = $world->createObject('sphere', array('r' => $factor, 'detail' => 0));
	$lightSphere->transform($world->createMatrix('Move', array(-4 * $factor, -4 * $factor, 0)));
	$lightSphere->setColor(new Image_3D_Color(255, 255, 255, 75));

	$light = $world->createLight('Light', array(4 * $factor, -4 * $factor, 0));
	$light->setColor(new Image_3D_Color(255, 255, 255, 75));
	$lightSphere = $world->createObject('sphere', array('r' => $factor, 'detail' => 0));
	$lightSphere->transform($world->createMatrix('Move', array(4 * $factor, -4 * $factor, 0)));
	$lightSphere->setColor(new Image_3D_Color(255, 255, 255, 75));
	
	/*
	$light = $world->createLight('Point', array(0, -200, 0, 'distance' => 300, 'falloff' => 2));
	$light->setColor(new Image_3D_Color(150, 150, 255));
	*/
	
	// World generation
	$world->transform($world->createMatrix('Rotation', array(0, 115, 180)));
	
	$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, false);
	$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);

	$renderer = $world->createRenderer('perspectively');
	$driver = $world->createDriver('ImageMagick');
	
	$world->render($factor, $factor, $entry . '.png');
}

$meshDirectoryFiles->close();


/*
$p = array();
$bottom = $world->createObject('polygon', array(
    new Image_3D_Point(-5 * $factor, 3 * $factor, 5 * $factor),
    new Image_3D_Point(-5 * $factor, 3 * $factor, -5 * $factor),
    new Image_3D_Point(5 * $factor, 3 * $factor, -5 * $factor),
    new Image_3D_Point(5 * $factor, 3 * $factor, 5 * $factor),
));
$bottom->setColor(new Image_3D_Color(200, 200, 200, 0, .6));

$top = $world->createObject('polygon', array(
    new Image_3D_Point(-5 * $factor, 5 * $factor, 5 * $factor),
    new Image_3D_Point(5 * $factor, 5 * $factor, 5 * $factor),
    new Image_3D_Point(5 * $factor, -5 * $factor, 5 * $factor),
    new Image_3D_Point(-5 * $factor, -5 * $factor, 5 * $factor),
));
$top->setColor(new Image_3D_Color(200, 200, 200, 0, .5));

$redPlane = $world->createObject('polygon', array(
    new Image_3D_Point(-5 * $factor, 1 * $factor, 2 * $factor),
    new Image_3D_Point(-5 * $factor, 1 * $factor, -2 * $factor),
    new Image_3D_Point(-1 * $factor, -1 * $factor, -2 * $factor),
    new Image_3D_Point(-1 * $factor, -1 * $factor, 2 * $factor),
));
$redPlane->setColor(new Image_3D_Color(255, 0, 0, 100, 0));

$bluePlane = $world->createObject('polygon', array(
    new Image_3D_Point(5 * $factor, 1 * $factor, 2 * $factor),
    new Image_3D_Point(5 * $factor, 1 * $factor, -2 * $factor),
    new Image_3D_Point(1 * $factor, -1 * $factor, -2 * $factor),
    new Image_3D_Point(1 * $factor, -1 * $factor, 2 * $factor),
));
$bluePlane->setColor(new Image_3D_Color(100, 100, 255, 0, 0));
*/

/*
$world->transform($world->createMatrix('Rotation', array(0, 115, 180)));

$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, false);
$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);

if (!@$argv[1]) {
    // Create normal GD picture with projection
    echo "Render with projection.\n";
    
    $renderer = $world->createRenderer('perspectively');
    $driver = $world->createDriver('ImageMagick');
	
    $world->render($factor, $factor, 'Image_3D_No_Raytrace_ImageMagick.png');
	
} else {
    // Raytrace advanced crazy picture
    echo "RAYTRACE!\n";

    $renderer = $world->createRenderer('Raytrace');

    // Define the cameras position
    $renderer->setCameraPosition(new Image_3D_Coordinate(0, 0, -50 * $factor));

    // define antialiasing level
    $renderer->setRaysPerPixel(2);

    // Set recursive scan depth
    $renderer->scanDepth(3);

    // Enable shadows
    $renderer->enableShadows(true);

    $world->render($factor, $factor, 'Image_3D_Raytrace.png');
}

echo $world->stats();
*/