<?php
	
	class Component extends ComponentDefault
	{
		// User Input Error Constants
		const ERR_INVALID_CHARACTER_ID = 501;
		const ERR_INVALID_USER_ID = 502;
		const ERR_INVALID_ITEM_ID = 503;
		const ERR_INVALID_SWAP_PARAMS = 504;
		const ERR_INVALID_BUFF_ENABLE_PARAMS = 505;
		const ERR_INVALID_NEW_ACCOUNT_PARAMS = 506;
		const ERR_INVALID_LOGIN_PARAMS = 507;
		const ERR_INVALID_FACEBOOK_POST_AUTH_PARAMS = 508;
		const ERR_INVALID_DELETE_CHARACTER_PARAMS = 509;
		const ERR_INVALID_AUCTION_ADD_PARAMS = 510;
		
		// Server Error Constants
		const ERR_QUERY_CHARACTER_RETREIVE = 401;
		const ERR_QUERY_INVENTORY_RETREIVE = 402;
		const ERR_QUERY_SWAP_RETREIVE = 403;
		const ERR_QUERY_BUFF_ENABLE_RETREIVE = 404;
		const ERR_QUERY_CHARACTER_ADD_RETREIVE = 405;
		const ERR_QUERY_LOGIN_RETREIVE = 406;
		const ERR_QUERY_GET_CHARACTERS_RETREIVE = 407;
		const ERR_QUERY_CHARACTER_DELETE_RETREIVE = 408;
		const ERR_QUERY_AUCTION_ADD_RETRIEVE = 409;
		
		// Component Name
		public $componentName = "bugcraft";
		
		public function onInit(  )
		{
			
		}
		
		/*
			Create maps
		*/
		
		public function onCreateMaps()
		{
			/*
			 Includes
			 */
			
			require_once("../includes/classes/class.BTree.php");
			
			set_time_limit( 0 );
			error_reporting(E_ALL);
			
			$mapsFolder = SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "maps_meta";
			
			$mapsFolderObject = dir( $mapsFolder );
			
			function _addPointToGraph( &$graph, &$edges, &$quadrants, $x, $y )
			{
				$quadrantWidth = 300;
				$quadrantHeight = 300;
				
				$coords = array( $x, $y );
				
				if( in_array( $coords, $graph ) )
				{
					return array_search( $coords, $graph );
				}
				
				$graph[] = $coords;
				$edges[] = array();
				
				$pointIndex = count($graph) - 1;
				
				//
				// assign to a quadrant
				//
				
				$quadrantX = floor( $x / $quadrantWidth );
				$quadrantY = floor( $y / $quadrantHeight );
				
				if( !isset( $quadrants[ $quadrantX ] ) )
				{
					$quadrants[ $quadrantX ] = array();
				}
				
				if( !isset( $quadrants[ $quadrantX ][ $quadrantY ] ) )
				{
					$quadrants[ $quadrantX ][ $quadrantY ] = array();
				}
				
				$quadrants[ $quadrantX ][ $quadrantY ][] = $pointIndex;
				
				return $pointIndex;
			}
			
			function _addEdge( $point1, $point2, &$edges, $distance )
			{
				/*
				$edges[ $point1 ][] = array( $point2, $distance );
				$edges[ $point2 ][] = array( $point1, $distance );
				*/
				
				$edges[ $point1 ][] = $point2 . ":" . $distance;
				$edges[ $point2 ][] = $point1 . ":" . $distance;
			}
			
			/*
			Compare functions
			*/
			
			function _cmpXAxis( $point1, $point2 )
			{
				
				if( $point1[0] == $point2[0] )
				{
					return 0;
				}
				
				return ($point1[0] < $point2[0]) ? -1 : 1;
				
			}
			
			function _cmpYAxis( $point1, $point2 )
			{
				
				if( $point1[1] == $point2[1] )
				{
					return 0;
				}
				
				return ($point1[1] < $point2[1]) ? -1 : 1;
				
				
			}
			
			/*
			 Generate 2D - Tree
			 */
			function _create2DTree( $pointsList, $depth = 0 )
			{
				
				if( !isset( $pointsList ) || empty($pointsList) )
				{
					
					return NULL;
					
				}
				
				$axis = $depth % 2;
				
				usort( $pointsList, $axis ? "_cmpYAxis" : "_cmpXAxis");
				
				$median = count($pointsList) / 2;
				
				$node = new BTree(
					        $pointsList[ $median ],
					        _create2DTree( array_slice($pointsList, 0, $median), $depth + 1 ),
					        _create2DTree( array_slice($pointsList, $median + 1), $depth + 1 )
					        );
				return $node;
			}
			
			while (false !== ($entry = $mapsFolderObject->read()))
			{
				if(
					is_dir( $mapsFolder . DIRECTORY_SEPARATOR . $entry )
				)
				{
					continue;
				}
				
				$pathInfo = pathinfo( $mapsFolder . DIRECTORY_SEPARATOR . $entry );
				
				if( strtolower( $pathInfo[ "extension" ] ) != "svg" )
				{
					continue;
				}
				
				// valid SVG file
				
				$graph = array();
				$edges = array();
				$quadrants = array();
				
				$mapObject = new DOMDocument();
				$mapObject->load( $mapsFolder . DIRECTORY_SEPARATOR . $entry );
				
				// searching for unique points
				
				$linesObjects = $mapObject->getElementsByTagName("line");
				foreach($linesObjects as $lineObject)
				{
					$x1 =  $lineObject->getAttribute("x1");
					$y1 =  $lineObject->getAttribute("y1");
					$x2 =  $lineObject->getAttribute("x2");
					$y2 =  $lineObject->getAttribute("y2");
					
					$graphPoint1 = _addPointToGraph( $graph, $edges, $quadrants, $x1, $y1 );
					$graphPoint2 = _addPointToGraph( $graph, $edges, $quadrants, $x2, $y2 );
					
					$distance = round( sqrt( pow( $x2 - $x1, 2 ) + pow( $y2 - $y1, 2 ) ) );
					
					// created links
					_addEdge( $graphPoint1, $graphPoint2, $edges, $distance );
				}
				
				//
				//Create 2DTree
				//
				
				/*$testPoints = Array
						(
							Array(2,3),
							Array(5,4),
							Array(9,6),
							Array(4,7),
							Array(8,1),
							Array(7,2)
						);*/
				
				$root = _create2DTree( $graph );
				
				$treeArray = Array();
				$treeArray[] = $root;
				
				$graphPoints = Array();
				$graphPoints[] = $root->getData();
				
				$i = 0;
				while( $i < count($treeArray) )
				{
					if( $treeArray[$i]->getLeft() != NULL )
					{
						$treeArray[] = $treeArray[$i]->getLeft();
						$graphPoints[] = $treeArray[$i]->getLeft()->getData();
					}
					
					if( $treeArray[$i]->getRight() != NULL )
					{
						$treeArray[] = $treeArray[$i]->getRight();
						$graphPoints[] = $treeArray[$i]->getRight()->getData();
					}
					
					$i++;
				}
				
				//
				// save the map to disk
				//
				
				$graphString = "graph:[";
				$graphStringAux = "graph:[";
				for($i=0;$i<count($graph);$i++)
				{
					$graphString .= "[" . $graph[$i][0] . "," . $graph[$i][1] . "],";
					
					$graphStringAux .= "[" . $graphPoints[$i][0] . "," . $graphPoints[$i][1] . "],";
				}
				
				$quadrantsString = "quadrants:[";
				for($i=0;$i<count($quadrants);$i++)
				{
					$quadrantsHorizontal = $quadrants[$i];
					
					$quadrantsString .= "[";
					
					for($j=0;$j<count($quadrantsHorizontal);$j++)
					{
						$quadrantsString .= "[" . implode( ",", $quadrantsHorizontal[$j] ) . "],";
					}
					
					if( count($quadrantsHorizontal) > 0 )
					{
						$quadrantsString = substr( $quadrantsString, 0, -1);
					}
					
					$quadrantsString .= "],";
				}
				
				$edgesString = "edges:{";
				foreach($edges as $edgeNode => $edgeConnections)
				{
					$edgesString .= $edgeNode . ":{" . implode( ",", $edgeConnections ) . "},";
				}
				
				file_put_contents(
							SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "maps_meta" . DIRECTORY_SEPARATOR . $pathInfo["filename"] . ".js",
							'exports.zoneMeta={' . substr($graphString, 0, -1) . '],' . substr($quadrantsString, 0, -1) . '],' . substr($edgesString, 0, -1) . '}}'
						);
				
				file_put_contents(
							SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "maps_meta" . DIRECTORY_SEPARATOR . $pathInfo["filename"] . ".2dtree.js",
							'exports.zoneMeta={' . substr($graphStringAux, 0, -1) . ']}'
						);
			}
			
			$mapsFolderObject->close();
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Create darker buffs images
		*/
		
		public function onBuffsDarken()
		{
			set_time_limit( 0 );
			
			$buffsLargeFolder = SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "img" . DIRECTORY_SEPARATOR . "abilities_large";
			$buffsMediumFolder = SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "img" . DIRECTORY_SEPARATOR . "abilities_medium";
			$buffsSmallFolder = SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "img" . DIRECTORY_SEPARATOR . "abilities_small";
			
			$buffsFolderDirObject = dir( $buffsLargeFolder );
			
			while (false !== ($entry = $buffsFolderDirObject->read()))
			{
				if(
					is_dir( $buffsLargeFolder . DIRECTORY_SEPARATOR . $entry )
					|| !preg_match("/^[0-9]+\.png/", $entry )
				)
				{
					continue;
				}
				
				// spell book mouseout abilities
				shell_exec( "/usr/local/bin/convert " . $buffsLargeFolder . DIRECTORY_SEPARATOR . $entry . " -fill black -colorize 25% " . $buffsLargeFolder . DIRECTORY_SEPARATOR . "darken_" . $entry );
				
				// spell book mouseout abilities
				shell_exec( "/usr/local/bin/convert " . $buffsLargeFolder . DIRECTORY_SEPARATOR . $entry . " -fill black -colorize 50% " . $buffsLargeFolder . DIRECTORY_SEPARATOR . "darker_" . $entry );
				
				// spell book disabled abilities
				shell_exec( "/usr/local/bin/convert " . $buffsLargeFolder . DIRECTORY_SEPARATOR . $entry . " -fill black -colorize 70% " . $buffsLargeFolder . DIRECTORY_SEPARATOR . "disabled_" . $entry );
				
				// bottom bar mouseout abilities
				shell_exec( "/usr/local/bin/convert " . $buffsLargeFolder . DIRECTORY_SEPARATOR . $entry . " -resize 30x30 -fill black -colorize 25% " . $buffsMediumFolder . DIRECTORY_SEPARATOR . "darken_" . $entry );
				
				// bottom bar disabled abilities
				shell_exec( "/usr/local/bin/convert " . $buffsLargeFolder . DIRECTORY_SEPARATOR . $entry . " -resize 30x30 -fill black -colorize 70% " . $buffsMediumFolder . DIRECTORY_SEPARATOR . "disabled_" . $entry );
				
				// top bar active buffs
				shell_exec( "/usr/local/bin/convert " . $buffsLargeFolder . DIRECTORY_SEPARATOR . $entry . " -resize 20x20 " . $buffsSmallFolder . DIRECTORY_SEPARATOR . $entry );
			}
			
			$buffsFolderDirObject->close();
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Create items
		*/
		
		public function onItemsIconsAdd()
		{
			set_time_limit( 0 );
			
			$targetItemSkinsFolder = SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "img" . DIRECTORY_SEPARATOR . "item_skins";
			$sourceItemSkinsFolder = "/usr/storage/itemSkins/";
			
			$sourceItemSkinsFolderObject = dir( $sourceItemSkinsFolder );
			
			while (false !== ($entry = $sourceItemSkinsFolderObject->read()))
			{
				if(
					is_dir( $sourceItemSkinsFolder . DIRECTORY_SEPARATOR . $entry )
					|| !preg_match("/^[0-9]+\.png/", $entry )
				)
				{
					continue;
				}
				
				$fileInfo = pathinfo( $entry );
				$targetFolder = $targetItemSkinsFolder . DIRECTORY_SEPARATOR . $fileInfo[ "filename" ];
				
				@ mkdir( $targetFolder, 0770 );
				
				// large items
				shell_exec( "/usr/local/bin/convert " . $sourceItemSkinsFolder . DIRECTORY_SEPARATOR . $entry . " -resize 64x64 " . $targetFolder . DIRECTORY_SEPARATOR . $fileInfo[ "filename" ] . "_64x64.png" );
				
				// small items
				shell_exec( "/usr/local/bin/convert " . $sourceItemSkinsFolder . DIRECTORY_SEPARATOR . $entry . " -resize 48x48 " . $targetFolder . DIRECTORY_SEPARATOR . $fileInfo[ "filename" ] . "_48x48.png" );
			}
			
			$sourceItemSkinsFolderObject->close();
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Process Mesh format to PNG files
		*/
		
		public function onMeshToPNG()
		{
			set_time_limit( 0 );
			
			$orbiterMeshPrefix = SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "orbiter_mesh";
			$meshDirectoryFiles = dir( $orbiterMeshPrefix );
			
			// Making sure that the library is included
			set_include_path( SystemConfig::$installDir . DIRECTORY_SEPARATOR . "includes" . DIRECTORY_SEPARATOR . "image3D" );
			require_once( 'Image' . DIRECTORY_SEPARATOR . '3D.php' );
			
			$sizes = array(
							"max" => array( 200, 200 ),
							"inventory_profile" => array( 70, 70 ),
							"inventory_inventory" => array( 40, 40 )
						);
			
			while (false !== ($entry = $meshDirectoryFiles->read()))
			{
				if( is_dir( $orbiterMeshPrefix . DIRECTORY_SEPARATOR . $entry ) )
				{
					continue;
				}
				
				$orbiterMeshFile = file( $orbiterMeshPrefix . DIRECTORY_SEPARATOR . $entry, FILE_IGNORE_NEW_LINES );
				$groupsNumber = substr( $orbiterMeshFile[1], strpos( $orbiterMeshFile[1], " " ) + 1 );
				
				foreach( $sizes as $sizeName => $sizeValue )
				{
					$points = array();
					$faces = array();
					$horizPoints = array();
					$vertPoints = array();
					$groupsStart = 6;
					
					for($j=0;$j<$groupsNumber;$j++)
					{
						$contentInfo = explode( " ", $orbiterMeshFile[ $groupsStart ] );
						$contentInfo[1] += $groupsStart + 1;
						$contentInfo[2] += $contentInfo[1];
						$points[ $j ] = array();
						$faces[ $j ] = array();
						
						for($i=$groupsStart + 1;$i<$contentInfo[1];$i++)
						{
							$pointCoords = explode( " ", $orbiterMeshFile[$i] );
							
							$horizPoints[] = $pointCoords[1];
							$vertPoints[] = $pointCoords[0];
							
							$points[$j][] = $pointCoords;
						}
						
						for($i=$contentInfo[1];$i<$contentInfo[2];$i++)
						{
							$faces[$j][] = explode( " ", $orbiterMeshFile[$i] );
						}
						
						$groupsStart = $contentInfo[2] + 4;
					}
					
					// Scale to fit the desired width and height
					$modelWidth = abs( max($horizPoints) ) + abs( min($horizPoints) );
					$modelHeight = abs( max($vertPoints) ) + abs( min($vertPoints) );
					
					if( $modelWidth > $modelHeight )
					{
						$factor = round( ( $sizeValue[0] / $modelWidth ), 1,  PHP_ROUND_HALF_DOWN );
					}
					else
					{
						$factor = round( ( $sizeValue[1] / $modelHeight ), 1, PHP_ROUND_HALF_DOWN );
					}
					
					// Resolve deviation from the center both horizontally and vertically
					$deviationX = ( max($horizPoints) + min($horizPoints) ) / 2;
					$deviationY = ( max($vertPoints) + min($vertPoints) ) / 2;
					
					/*
					// Stats
					echo "mdw: " . $modelWidth . "<br/>";
					echo "mdh: " . $modelHeight . "<br/>";
					echo "mxw: " . max($horizPoints) . "<br/>";
					echo "mnw: " . min($horizPoints) . "<br/>";
					echo "mxh: " . max($vertPoints) . "<br/>";
					echo "mnh: " . min($vertPoints) . "<br/>";
					echo "f: " . $factor . "<br/>";
					*/
					
					$world = new Image_3D();
					$world->setColor(new Image_3D_Color(255, 255, 255, 100));
					
					for($j=0;$j<$groupsNumber;$j++)
					{
						for($k=0;$k<count($faces[$j]);$k++)
						{
							$poly = $world->createObject('polygon', array(
								new Image_3D_Point( ( $points[$j][ $faces[$j][$k][0] ][ 0 ] - $deviationY ) * $factor, ( $points[$j][ $faces[$j][$k][0] ][ 1 ] - $deviationX ) * $factor, $points[$j][ $faces[$j][$k][0] ][ 2 ] * $factor),
								new Image_3D_Point( ( $points[$j][ $faces[$j][$k][1] ][ 0 ] - $deviationY ) * $factor, ( $points[$j][ $faces[$j][$k][1] ][ 1 ] - $deviationX ) * $factor, $points[$j][ $faces[$j][$k][1] ][ 2 ] * $factor),
								new Image_3D_Point( ( $points[$j][ $faces[$j][$k][2] ][ 0 ] - $deviationY ) * $factor, ( $points[$j][ $faces[$j][$k][2] ][ 1 ] - $deviationX ) * $factor, $points[$j][ $faces[$j][$k][2] ][ 2 ] * $factor)
							));
							$poly->setColor(new Image_3D_Color(200, 200, 200, 70, .9));
						}
					}
					
					// Create the lights
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
					
//					$light = $world->createLight('Point', array(0, -200, 0, 'distance' => 300, 'falloff' => 2));
//					$light->setColor(new Image_3D_Color(255, 255, 255, 75));

					// World generation
					$world->transform($world->createMatrix('Rotation', array(0, 115, 180)));
					
					$world->setOption(Image_3D::IMAGE_3D_OPTION_BF_CULLING, false);
					$world->setOption(Image_3D::IMAGE_3D_OPTION_FILLED, true);
					
					$renderer = $world->createRenderer('perspectively');
					$driver = $world->createDriver('ImageMagick');
					
					$world->render(
									$sizeValue[0],
									$sizeValue[1],
									SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "items" . DIRECTORY_SEPARATOR . substr( $entry, 0, strpos( $entry, "-" ) ) . "_" . $sizeName . ".png"
								);
					
					echo '<img src="http://' . SystemConfig::$applicationURL . "/components/bugcraft/resources/public/items/" . substr( $entry, 0, strpos( $entry, "-" ) ) . "_" . $sizeName . '.png" style="border:1px solid #000000" />';
				}
			}
			
			$meshDirectoryFiles->close();
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Process Mesh format to JSON format
		*/
		
		public function onMeshToJSON()
		{
			$orbiterMeshPrefix = SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "private" . DIRECTORY_SEPARATOR . "orbiter_mesh";
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
				$scales = "";
				
				$sizes = array(
								array( 200, 200 ),
								array( 70, 70 ),
								array( 40, 40 )
							);
				
				for($j=0;$j<$groupsNumber;$j++)
				{
					$points = array();
					$faces = array();
					$horizPoints = array();
					$vertPoints = array();
					
					$contentInfo = explode( " ", $orbiterMeshFile[ $groupsStart ] );
					$contentInfo[1] += $groupsStart + 1;
					$contentInfo[2] += $contentInfo[1];
					
					for($i=$groupsStart + 1;$i<$contentInfo[1];$i++)
					{
						$pointCoords = explode( " ", $orbiterMeshFile[$i] );
						
						$points[] = '[' . implode( ",", $pointCoords ) . ']';
						
						$horizPoints[] = $pointCoords[1];
						$vertPoints[] = $pointCoords[0];
					}
					
					for($i=$contentInfo[1];$i<$contentInfo[2];$i++)
					{
						$faces[] = '[' . str_replace( " ", ",", $orbiterMeshFile[$i] ) . ']';
					}
					
					$groupsStart = $contentInfo[2] + 4;
					
					$content[] = '{"points":[' . implode( ",", $points ) . '], "faces":[' . implode( ",", $faces ) . ']}';
				}
				
				// Scale to fit the desired width and height
				$modelWidth = abs( max($horizPoints) ) + abs( min($horizPoints) );
				$modelHeight = abs( max($vertPoints) ) + abs( min($vertPoints) );
				
				if( $modelWidth > $modelHeight )
				{
					foreach( $sizes as $size )
					{
						$scales .= '"' . $size[0] . "x" . $size[1] . '":' . round( ( $size[0] / $modelWidth ), 1,  PHP_ROUND_HALF_DOWN ) . ",";
					}
				}
				else
				{
					foreach( $sizes as $size )
					{
						$scales .= '"' . $size[0] . "x" . $size[1] . '":' . round( ( $size[1] / $modelHeight ), 1,  PHP_ROUND_HALF_DOWN ) . ",";
					}
				}
				
				file_put_contents(
							SystemConfig::$publicWebDir . DIRECTORY_SEPARATOR . "components" . DIRECTORY_SEPARATOR . "bugcraft" . DIRECTORY_SEPARATOR . "resources" . DIRECTORY_SEPARATOR . "public" . DIRECTORY_SEPARATOR . "items" . DIRECTORY_SEPARATOR . substr( $entry, 0, strpos( $entry, "-" ) ) . ".json",
							'{"data":{"model":[' . implode(",\n", $content) . '], "scales":{' . substr( $scales, 0, -1) . '}}}'
						);
			}
			
			$meshDirectoryFiles->close();
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Restore Session
		*/
		
		public function onRestoreSession()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( isset($_SESSION["character_id"]) )
			{
				$this->_selectCharacter( $_SESSION["character_id"] );
			}
			else
			{
				$this->content->setAttribute( "character_id", 0 );
			}
			
			$this->content->setAttribute( "user_id", isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : 0 );
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Login User
		*/
		
		public function onLogin()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if(
				!isset($_GET["id"]) ||
				!preg_match("/^[0-9]+$/", $_GET["id"])
			)
			{
				return $this->setHeaderResult( self::ERR_INVALID_LOGIN_PARAMS );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->multi_query("call user_login_facebook( " . $_GET["id"] . " )");
			
			if( !$result )
			{
				return $this->setHeaderResult( self::ERR_QUERY_LOGIN_RETREIVE );
			}
			
			$loginOK = false;
			
			do
			{
				if( false == ( $result = $this->dbpointer->store_result() ) )
				{
					continue;
				}
				
				while( $loginUserResult = $result->fetch_object() )
				{
					$this->content->setAttribute( "databaseResult", $loginUserResult->result );
					
					if( $loginUserResult->result != "200" )
					{
						continue;
					}
					
					$loginOK = true;
					
					$_SESSION["user_id"] = $loginUserResult->user_id;
					$_SESSION["character_id"] = $loginUserResult->character_id;
					$_SESSION["character_faction"] = $loginUserResult->character_faction;
					
					$this->content->setAttribute( "character_id", $loginUserResult->character_id );
				}
				
				$result->close();
			}
			while ( $this->dbpointer->next_result());
			
			if( $loginOK )
			{
				$this->_selectCharacter( $_SESSION["character_id"] );
			}
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Select Characters
		*/
		
		public function onGetCharacters()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_SESSION["user_id"]) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_USER_ID );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->query("select 	c.`character_id`, c.`character_name`, c.`character_race`, c.`character_class`, c.`character_faction`,
																							c.`character_energy_current`, c.`character_energy_max`, c.`character_level`, c.`character_happiness`, c.`character_attack`, c.`character_damage`, c.`character_defense`, c.`character_armor`
																							from `characters` c
																							where `character_id_user` = " . $_SESSION["user_id"] );
			
			if( !$result || $result->num_rows == 0 )
			{
				return $this->setHeaderResult( self::ERR_QUERY_GET_CHARACTERS_RETREIVE );
			}
			
			while( $charactersResult = $result->fetch_object() )
			{
				$characterEntry = $this->XMLDoc->createElement("character");
				
				$characterEntry->setAttribute("character_id", $charactersResult->character_id );
				$characterEntry->setAttribute("character_name", $charactersResult->character_name );
				$characterEntry->setAttribute("character_energy_current", $charactersResult->character_energy_max );
				$characterEntry->setAttribute("character_level", $charactersResult->character_level );
				$characterEntry->setAttribute("character_happiness", $charactersResult->character_happiness );
				$characterEntry->setAttribute("character_attack", $charactersResult->character_attack );
				$characterEntry->setAttribute("character_damage", $charactersResult->character_damage );
				$characterEntry->setAttribute("character_defense", $charactersResult->character_defense );
				$characterEntry->setAttribute("character_armor", $charactersResult->character_armor );
				$characterEntry->setAttribute("character_race", $charactersResult->character_race );
				$characterEntry->setAttribute("character_class", $charactersResult->character_class );
				$characterEntry->setAttribute("character_faction", $charactersResult->character_faction );
				
				$this->content->appendChild( $characterEntry );
			}
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Add Character
		*/
		
		public function onDeleteCharacter()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_SESSION["user_id"]) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_USER_ID );
			}
			
			if(
				!isset($_GET["id"]) ||
				!preg_match("/^[0-9]+$/", $_GET["id"])
			)
			{
				return $this->setHeaderResult( self::ERR_INVALID_DELETE_CHARACTER_PARAMS );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->multi_query("call character_delete( " . $_SESSION["user_id"] . ", " . $_GET["id"] . " )");
			
			if( !$result )
			{
				return $this->setHeaderResult( self::ERR_QUERY_CHARACTER_DELETE_RETREIVE );
			}
			
			do
			{
				if( false == ( $result = $this->dbpointer->store_result() ) ) 
				{
					continue;
				}
				
				while( $deleteCharacterResult = $result->fetch_object() )
				{
					$this->content->setAttribute( "databaseResult", $deleteCharacterResult->result );
					$this->content->setAttribute( "selected_character_id", $deleteCharacterResult->selected_character_id );
				}
				
				$result->close();
			}
			while ( $this->dbpointer->next_result());
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Add Character
		*/
		
		public function onAddCharacter()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if(
				!isset($_GET["characterName"]) ||
				!isset($_GET["race"]) ||
				!preg_match("/^[a-zA-Z]+$/", $_GET["characterName"]) ||
				!preg_match("/^(ant|fireant|butterfly|bee|ladybug|mantis)$/", $_GET["race"])
			)
			{
				return $this->setHeaderResult( self::ERR_INVALID_NEW_ACCOUNT_PARAMS );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->multi_query("call character_add( " . ( isset($_SESSION["user_id"]) ? $_SESSION["user_id"] : "NULL" ) . ", '" . $_GET["race"] . "', '" . $this->dbpointer->real_escape_string( $_GET["characterName"] ) . "' )");
			
			if( !$result )
			{
				return $this->setHeaderResult( self::ERR_QUERY_CHARACTER_ADD_RETREIVE );
			}
			
			$addedOk = false;
			
			do
			{
				if( false == ( $result = $this->dbpointer->store_result() ) ) 
				{
					continue;
				}
				
				while( $newCharacterResult = $result->fetch_object() )
				{
					$this->content->setAttribute( "databaseResult", $newCharacterResult->result );
					
					if( $newCharacterResult->result != "200" )
					{
						continue;
					}
					
					// Select this character
					
					$_SESSION["character_id"] = $newCharacterResult->character_id;
					
					$addedOk = true;
				}
				
				$result->close();
			}
			while ( $this->dbpointer->next_result());
			
			// Select this character
			if( $addedOk )
			{
				$this->_selectCharacter( $_SESSION["character_id"] );
			}
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Select Character
		*/
		
		public function onSelectCharacter()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_SESSION["user_id"]) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_USER_ID );
			}
			
			if( !isset($_GET["id"]) || !preg_match("/^[0-9]+$/", $_GET["id"]) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_CHARACTER_ID );
			}
			
			if( $this->_selectCharacter( $_GET["id"] ) )
			{
				$_SESSION["character_id"] = $_GET["id"];
			}
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Internal character select method
		*/
		
		protected function _selectCharacter( $characterID )
		{
			$this->DBConnect();
			
			/*
				assumptions:
				- $characterID is given and is numeric unsigned
				- $_SESSION["user_id"] is either numeric or not set
			*/
			
			$result = $this->dbpointer->query("select *
																				from character_profile_full
																				where `character_id` = " . $characterID . " and `character_id_user` " . ( isset($_SESSION["user_id"]) ? "= " . $_SESSION["user_id"] : "is NULL order by `buff_type` asc" ) );
			
			if( !$result || $result->num_rows == 0 )
			{
				return false;
			}
			
			// Store results
			$profileResult = $result->fetch_object();
			
			// General Attributes
			
			$this->content->setAttribute("character_id", $characterID );
			$this->content->setAttribute("character_name", $profileResult->character_name );
			$this->content->setAttribute("character_energy_current", $profileResult->character_energy_current );
			$this->content->setAttribute("character_energy_max", $profileResult->character_energy_max );
			$this->content->setAttribute("character_level", $profileResult->character_level );
			$this->content->setAttribute("character_happiness", $profileResult->character_happiness );
			$this->content->setAttribute("character_xp_current", $profileResult->character_xp_current );
			$this->content->setAttribute("character_xp_max", $profileResult->character_xp_max );
			$this->content->setAttribute("character_hp_current", $profileResult->character_hp_current );
			$this->content->setAttribute("character_hp_max", $profileResult->character_hp_max );
			$this->content->setAttribute("character_attack", $profileResult->character_attack );
			$this->content->setAttribute("character_defense", $profileResult->character_defense );
			$this->content->setAttribute("character_damage", $profileResult->character_damage );
			$this->content->setAttribute("character_armor", $profileResult->character_armor );
			$this->content->setAttribute("character_score", $profileResult->character_score );
			$this->content->setAttribute("character_amber", $profileResult->character_amber );
			$this->content->setAttribute("character_polen", $profileResult->character_polen );
			$this->content->setAttribute("character_class", $profileResult->character_class );
			$this->content->setAttribute("character_race", $profileResult->character_race );
			
			if( strlen( $profileResult->buff_id ) == 0 )
			{
				// No buffs available
				
				return true;
			}
			
			do
			{
				$buffEntry = $this->XMLDoc->createElement("buff");
				
				$buffEntry->setAttribute("buff_id", $profileResult->buff_id );
				$buffEntry->setAttribute("buff_name", $profileResult->buff_name );
				$buffEntry->setAttribute("buff_cooldown_seconds", $profileResult->buff_cooldown_seconds );
//				$buffEntry->setAttribute("buff_duration_time", $profileResult->buff_duration_time );
				$buffEntry->setAttribute("cb_id", $profileResult->cb_id );
				$buffEntry->setAttribute("cb_cooldown_end_date", $profileResult->cb_cooldown_end_date );
				$buffEntry->setAttribute("cb_cooldown_total_seconds", $profileResult->cb_cooldown_total_seconds );
				$buffEntry->setAttribute("buff_type", $profileResult->buff_type );
				
				$this->content->appendChild( $buffEntry );
			}
			while( $profileResult = $result->fetch_object() );
			
			return true;
		}
		
		/*
			Logout
		*/
		
		public function onLogout()
		{
			unset( $_SESSION["user_id"] );
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Profile items + Inventory items
		*/
		public function onGetFullInventory()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_GET["id"]) || !preg_match( "/^[0-9]+$/", $_GET["id"] ) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_CHARACTER_ID );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->query("select	`loot_id`, pow( 2, `loot_type` + 0 - 1) as loot_type, `loot_level`,  `loot_sell_price_amber`, `loot_max_stack`,
																				`ci_loot_amount`, `ci_slot_order`, `ci_slot_accept` + 0 as `ci_slot_accept`, `ci_slot_bag`,
																				`loot_bonus_attack`, `loot_bonus_defense`, `loot_bonus_energy`, `loot_bonus_damage`, `loot_bonus_armor`, `loot_bonus_hp`, `loot_vendor_only`
																		from `character_inventory`
																		left join `loot` on `loot`.`loot_id` = `character_inventory`.`ci_id_loot`
																		where `character_inventory`.`ci_id_character` = " . $_GET["id"] . " 
																		order by `ci_slot_bag` asc, `ci_slot_order` asc" );
			
			if( !$result || $result->num_rows == 0 )
			{
				return $this->setHeaderResult( self::ERR_QUERY_INVENTORY_RETREIVE );
			}
			
			while( $inventoryResult = $result->fetch_object() )
			{
				$inventoryEntry = $this->XMLDoc->createElement("item");
				
				$inventoryEntry->setAttribute("loot_id", $inventoryResult->loot_id );
				$inventoryEntry->setAttribute("loot_type", $inventoryResult->loot_type );
				$inventoryEntry->setAttribute("loot_level", $inventoryResult->loot_level );
				$inventoryEntry->setAttribute("loot_sell_amber_price", $inventoryResult->loot_sell_price_amber );
				$inventoryEntry->setAttribute("loot_max_stack", $inventoryResult->loot_max_stack );
				$inventoryEntry->setAttribute("ci_loot_amount", $inventoryResult->ci_loot_amount );
				$inventoryEntry->setAttribute("ci_slot_order", $inventoryResult->ci_slot_order );
				$inventoryEntry->setAttribute("ci_slot_accept", $inventoryResult->ci_slot_accept );
				$inventoryEntry->setAttribute("ci_slot_bag", $inventoryResult->ci_slot_bag );
				$inventoryEntry->setAttribute("loot_bonus_attack", $inventoryResult->loot_bonus_attack );
				$inventoryEntry->setAttribute("loot_bonus_defense", $inventoryResult->loot_bonus_defense );
				$inventoryEntry->setAttribute("loot_bonus_energy", $inventoryResult->loot_bonus_energy );
				$inventoryEntry->setAttribute("loot_bonus_damage", $inventoryResult->loot_bonus_damage );
				$inventoryEntry->setAttribute("loot_bonus_armor", $inventoryResult->loot_bonus_armor );
				$inventoryEntry->setAttribute("loot_bonus_hp", $inventoryResult->loot_bonus_hp );
				$inventoryEntry->setAttribute("loot_vendor_only", $inventoryResult->loot_vendor_only );
				
				$this->content->appendChild( $inventoryEntry );
			}
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Inventory Items (not equiped)
		*/
		public function onGetInventory()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_GET["id"]) || !preg_match( "/^[0-9]+$/", $_GET["id"] ) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_CHARACTER_ID );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->query("select	`loot_id`, pow( 2, `loot_type` + 0 - 1) as loot_type, `loot_level`,  `loot_sell_price_amber`, `loot_max_stack`,
																				`ci_loot_amount`, `ci_slot_order`, `ci_slot_accept` + 0 as `ci_slot_accept`, `ci_slot_bag`,
																				`loot_bonus_attack`, `loot_bonus_defense`, `loot_bonus_energy`, `loot_bonus_damage`, `loot_bonus_armor`, `loot_bonus_hp`, `loot_vendor_only`
																		from `character_inventory`
																		left join `loot` on `loot`.`loot_id` = `character_inventory`.`ci_id_loot`
																		where `character_inventory`.`ci_id_character` = " . $_GET["id"] . " and `ci_slot_bag`=2
																		order by `ci_slot_bag` asc, `ci_slot_order` asc" );
			
			if( !$result || $result->num_rows == 0 )
			{
				return $this->setHeaderResult( self::ERR_QUERY_INVENTORY_RETREIVE );
			}
			
			while( $inventoryResult = $result->fetch_object() )
			{
				$inventoryEntry = $this->XMLDoc->createElement("item");
				
				$inventoryEntry->setAttribute("loot_id", $inventoryResult->loot_id );
				$inventoryEntry->setAttribute("loot_type", $inventoryResult->loot_type );
				$inventoryEntry->setAttribute("loot_level", $inventoryResult->loot_level );
				$inventoryEntry->setAttribute("loot_sell_amber_price", $inventoryResult->loot_sell_price_amber );
				$inventoryEntry->setAttribute("loot_max_stack", $inventoryResult->loot_max_stack );
				$inventoryEntry->setAttribute("ci_loot_amount", $inventoryResult->ci_loot_amount );
				$inventoryEntry->setAttribute("ci_slot_order", $inventoryResult->ci_slot_order );
				$inventoryEntry->setAttribute("ci_slot_accept", $inventoryResult->ci_slot_accept );
				$inventoryEntry->setAttribute("ci_slot_bag", $inventoryResult->ci_slot_bag );
				$inventoryEntry->setAttribute("loot_bonus_attack", $inventoryResult->loot_bonus_attack );
				$inventoryEntry->setAttribute("loot_bonus_defense", $inventoryResult->loot_bonus_defense );
				$inventoryEntry->setAttribute("loot_bonus_energy", $inventoryResult->loot_bonus_energy );
				$inventoryEntry->setAttribute("loot_bonus_damage", $inventoryResult->loot_bonus_damage );
				$inventoryEntry->setAttribute("loot_bonus_armor", $inventoryResult->loot_bonus_armor );
				$inventoryEntry->setAttribute("loot_bonus_hp", $inventoryResult->loot_bonus_hp );
				$inventoryEntry->setAttribute("loot_vendor_only", $inventoryResult->loot_vendor_only );
				
				$this->content->appendChild( $inventoryEntry );
			}
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Profile items
		*/
		
		public function onGetProfileInventory()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_GET["id"]) || !preg_match( "/^[0-9]+$/", $_GET["id"] ) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_CHARACTER_ID );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->query("select	`loot_id`, `loot_type`, `loot_level`,  `loot_sell_amber_price`, `loot_max_stack`,
																				`ci_loot_amount`, `ci_slot_order`, `ci_slot_accept` + 0 as `ci_slot_accept`, `ci_slot_bag`
																				`loot_bonus_attack`, `loot_bonus_defense`, `loot_bonus_energy`, `loot_bonus_damage`, `loot_bonus_armor`, `loot_bonus_hp`, `loot_vendor_only`
																		from `loot`
																		inner join `character_inventory` on `character_inventory`.`ci_id_loot` = `loot`.`loot_id`
																		where `character_inventory`.`ci_id_character` = " . $_GET["id"] . " and `ci_slot_bag` != 1
																		order by `ci_slot_bag` asc, `ci_slot_order` asc" );
			
			if( !$result || $result->num_rows == 0 )
			{
				return $this->setHeaderResult( self::ERR_QUERY_INVENTORY_RETREIVE );
			}
			
			while( $inventoryResult = $result->fetch_object() )
			{
				$inventoryEntry = $this->XMLDoc->createElement("item");
				
				$inventoryEntry->setAttribute("loot_id", $inventoryResult->loot_id );
				$inventoryEntry->setAttribute("loot_type", $inventoryResult->loot_type );
				$inventoryEntry->setAttribute("loot_level", $inventoryResult->loot_level );
				$inventoryEntry->setAttribute("loot_sell_amber_price", $inventoryResult->loot_sell_amber_price );
				$inventoryEntry->setAttribute("loot_max_stack", $inventoryResult->loot_max_stack );
				$inventoryEntry->setAttribute("ci_loot_amount", $inventoryResult->ci_loot_amount );
				$inventoryEntry->setAttribute("ci_slot_order", $inventoryResult->ci_slot_order );
				$inventoryEntry->setAttribute("ci_slot_accept", $inventoryResult->ci_slot_accept );
				$inventoryEntry->setAttribute("ci_slot_bag", $inventoryResult->ci_slot_bag );
				$inventoryEntry->setAttribute("loot_bonus_attack", $inventoryResult->loot_bonus_attack );
				$inventoryEntry->setAttribute("loot_bonus_defense", $inventoryResult->loot_bonus_defense );
				$inventoryEntry->setAttribute("loot_bonus_energy", $inventoryResult->loot_bonus_energy );
				$inventoryEntry->setAttribute("loot_bonus_damage", $inventoryResult->loot_bonus_damage );
				$inventoryEntry->setAttribute("loot_bonus_armor", $inventoryResult->loot_bonus_armor );
				$inventoryEntry->setAttribute("loot_bonus_hp", $inventoryResult->loot_bonus_hp );
				$inventoryEntry->setAttribute("loot_vendor_only", $inventoryResult->loot_vendor_only );
				
				$this->content->appendChild( $inventoryEntry );
			}
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Character information
		*/
		public function onGetProfile()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_GET["id"]) || !preg_match( "/^[0-9]+$/", $_GET["id"] ) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_CHARACTER_ID );
			}
			
			if( !$this->_selectCharacter( $_GET["id"] ) )
			{
				return $this->setHeaderResult( self::ERR_QUERY_CHARACTER_RETREIVE );
			}
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Buff enable
		*/
		
		public function onBuffEnable()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_SESSION["character_id"]) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_CHARACTER_ID );
			}
			
			if(
				!isset($_GET["id"]) || !preg_match("/^[0-9]+$/", $_GET["id"])
			)
			{
				return $this->setHeaderResult( self::ERR_INVALID_BUFF_ENABLE_PARAMS );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->multi_query("call character_buff_enable( " . $_GET["id"] . ", " . $_SESSION["character_id"] . ", NULL, '' )"); // allow the casting of active buffs
			
			if( !$result )
			{
				return $this->setHeaderResult( self::ERR_QUERY_BUFF_ENABLE_RETREIVE );
			}
			
			do
			{
				if( false == ( $result = $this->dbpointer->store_result() ) ) 
				{
					continue;
				}
				
				if( $profileResult = $result->fetch_object() )
				{
					$this->content->setAttribute("databaseResult", $profileResult->result );
					
					if( $profileResult->result != "200" )
					{
						// Database result not ok
						
						break;
					}
					
					// General Attributes
					
					$this->content->setAttribute("character_id", $profileResult->character_id );
					$this->content->setAttribute("character_energy_current", $profileResult->character_energy_current );
					$this->content->setAttribute("character_energy_max", $profileResult->character_energy_max );
					$this->content->setAttribute("character_level", $profileResult->character_level );
					$this->content->setAttribute("character_happiness", $profileResult->character_happiness );
					$this->content->setAttribute("character_xp_current", $profileResult->character_xp_current );
					$this->content->setAttribute("character_xp_max", $profileResult->character_xp_max );
					$this->content->setAttribute("character_hp_current", $profileResult->character_hp_current );
					$this->content->setAttribute("character_hp_max", $profileResult->character_hp_max );
					$this->content->setAttribute("character_attack", $profileResult->character_attack );
					$this->content->setAttribute("character_defense", $profileResult->character_defense );
					$this->content->setAttribute("character_damage", $profileResult->character_damage );
					$this->content->setAttribute("character_armor", $profileResult->character_armor );
					$this->content->setAttribute("character_score", $profileResult->character_score );
					
					if( strlen( $profileResult->buff_id ) == 0 )
					{
						// No buffs available
						
						return true;
					}
					
					do
					{
						$buffEntry = $this->XMLDoc->createElement("buff");
						
						$buffEntry->setAttribute("buff_id", $profileResult->buff_id );
						$buffEntry->setAttribute("buff_name", $profileResult->buff_name );
						$buffEntry->setAttribute("buff_cooldown_seconds", $profileResult->buff_cooldown_seconds );
						$buffEntry->setAttribute("buff_duration_quests", $profileResult->buff_duration_quests );
						$buffEntry->setAttribute("buff_duration_attacks", $profileResult->buff_duration_attacks );
//						$buffEntry->setAttribute("buff_duration_time", $profileResult->buff_duration_time );
						$buffEntry->setAttribute("cb_id", $profileResult->cb_id );
						$buffEntry->setAttribute("cb_remaining_attacks", $profileResult->cb_remaining_attacks );
						$buffEntry->setAttribute("cb_remaining_quests", $profileResult->cb_remaining_quests );
						$buffEntry->setAttribute("cb_cooldown_end_date", $profileResult->cb_cooldown_end_date );
						$buffEntry->setAttribute("cb_cooldown_total_seconds", $profileResult->cb_cooldown_total_seconds );
						$buffEntry->setAttribute("buff_type", $profileResult->buff_type );
						
						$this->content->appendChild( $buffEntry );
					}
					while( $profileResult = $result->fetch_object() );
					
					break;
				}
				
				$result->close();
			}
			while ( $this->dbpointer->next_result());
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Inventory Item Swap
		*/
		
		public function onItemSwap()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_SESSION["character_id"]) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_CHARACTER_ID );
			}
			
			if(
				!isset($_GET["sourceBag"]) || !isset($_GET["targetBag"]) || !isset($_GET["sourceSlot"]) || !isset($_GET["targetSlot"]) ||
				!preg_match("/^[0-9]+$/", $_GET["sourceBag"]) || !preg_match("/^[0-9]+$/", $_GET["targetBag"]) || !preg_match("/^[0-9]+$/", $_GET["sourceSlot"]) || !preg_match("/^[0-9]+$/", $_GET["targetSlot"])
			) 
			{
				return $this->setHeaderResult( self::ERR_INVALID_SWAP_PARAMS );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->multi_query("call character_item_swap( " . $_SESSION["character_id"] . ", " . $_GET["sourceBag"] . ", " . $_GET["sourceSlot"] . ", " . $_GET["targetBag"] . ", " . $_GET["targetSlot"] . " )");
			
			if( !$result )
			{
				return $this->setHeaderResult( self::ERR_QUERY_SWAP_RETREIVE );
			}
			
			do
			{
				if( false == ( $result = $this->dbpointer->store_result() ) ) 
				{
					continue;
				}
				
				while ($row = $result->fetch_array(MYSQLI_ASSOC))
				{
					$this->content->setAttribute("databaseResult", $row["result"] );
				}
				
				$result->close();
			}
			while ( $this->dbpointer->next_result());
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*
			Inventory destroy item
		*/
		
		public function onDestroyItem()
		{
			
		}
		
		/*
			Facebook Post Authorize
		*/
		
		public function onFacebookPostAuthorize()
		{
			if( !isset($_GET["fb_sig_user"]) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_FACEBOOK_POST_AUTH_PARAMS );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->multi_query("call user_add_facebook( " . $_GET["fb_sig_user"] . ", '" . SystemConfig::$realmName . "', " . ( isset($_SESSION["character_id"]) ? $_SESSION["character_id"] : "NULL" ) . ", '" . ( isset($_GET["fb_sig_country"]) ? $_GET["fb_sig_country"] : "NULL" ) . "' )");
			
			if( !$result )
			{
				return $this->setHeaderResult( self::ERR_QUERY_SWAP_RETREIVE );
			}
			
			do
			{
				if( false == ( $result = $this->dbpointer->store_result() ) ) 
				{
					continue;
				}
				
				while ($row = $result->fetch_array(MYSQLI_ASSOC))
				{
					$this->content->setAttribute("databaseResult", $row["result"] );
					
					$_SESSION["user_id"] = $row["user_id"];
				}
				
				$result->close();
			}
			while( $this->dbpointer->next_result() );
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/* Create Auction*/
		public function onCreateAuction()
		{
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_SESSION["character_id"]) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_CHARACTER_ID );
			}
			
			
			if( !isset($_GET["bagOrder"]) || !isset($_GET["start_price"]) || !isset($_GET["buyout_price"]) || !isset($_GET["duration"]) ||
			    !preg_match("/^[0-9]+$/", $_GET["bagOrder"]) || !preg_match("/^[0-9]+$/", $_GET["start_price"]) || !preg_match("/^[0-9]+$/", $_GET["buyout_price"]) || !preg_match("/^[0-9]+$/", $_GET["duration"]))
			{
				return $this->setHeaderResult( self::ERR_INVALID_AUCTION_ADD_PARAMS );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->multi_query("call auction_add(" . $_GET["bagOrder"] . "," . $_SESSION["character_id"] . "," . $_GET["start_price"] . "," . $_GET["buyout_price"] . "," . $_GET["duration"] . ")");
			
			if( !$result )
			{
				
				return $this->setHeaderResult( self::ERR_QUERY_AUCTION_ADD_RETRIEVE );
			}
			
			do
			{
				
				if( false == ( $result = $this->dbpointer->store_result() ) )
				{
					continue;
				}
				
				while( $row = $result->fetch_array(MYSQLI_ASSOC) )
				{
					
					$this->content->setAttribute("databaseResult", $row["result"]);
					
				}
				
			}
			while( $this->dbpointer->next_result() );
			
			return $this->setHeaderResult( self::ERR_OK_NOCACHE );
		}
		
		/*public function onGetAuction()
		{
			
			$this->outputType = self::OUTPUT_JSON;
			
			if( !isset($_SESSION["character_id"]) )
			{
				return $this->setHeaderResult( self::ERR_INVALID_CHARACTER_ID );
			}
			
			$this->DBConnect();
			
			$result = $this->dbpointer->multi_query("");
			
			return $this->setHeaderResult( self::ERR_OK_NOCHACE );
		}*/
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
?>