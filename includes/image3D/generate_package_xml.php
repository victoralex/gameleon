#!/usr/bin/php
<?php

    $make = true;
	require_once('PEAR/PackageFileManager.php');

	$pkg = new PEAR_PackageFileManager;

	// directory that PEAR CVS is located in
	$cvsdir  = dirname(__FILE__);
	$packagedir = $cvsdir;
	
	// Filemanager settings
	$category = 'Image';
	$package = 'Image_3D';
	
	$version = '0.4.0';
	$state = 'alpha';
	
	$summary = 'This class allows the rendering of 3 dimensional objects utilizing PHP.';
	$description = <<<EOT
Image_3D is a highly object oriented PHP5 package 
that allows the creation of 3 dimensional images
using PHP.

Image_3D currently supports:
* Creation of 3D objects like cubes, spheres, maps, text, pie, torus, ...
* Own object definitions possible
* Own material definitions
* Import of 3DSMax files
* Unlimited number of light sources
* Rendering output via GD, SVG or ASCII
EOT;

	$notes = <<<EOT
* Modified API to add lights
  * Added spotlights and ambient lights
* Added driver SVGControl
* Added bezier curves
* Several bugfixes
EOT;
	
	$e = $pkg->setOptions(
		array('simpleoutput'      => true,
		      'baseinstalldir'    => '',
		      'summary'           => $summary,
		      'description'       => $description,
		      'version'           => $version,
              'license'           => 'LGPL',
	          'packagedirectory'  => $packagedir,
	          'pathtopackagefile' => $packagedir,
              'state'             => $state,
              'filelistgenerator' => 'cvs',
              'notes'             => $notes,
			  'package'           => $package,
			  'dir_roles' => array(
                    'docs' => 'doc'),
		      'ignore' => array('*.xml',
                                '*.tgz',
                                '*.png',
		                        'generate_package*',
                                ),
	));
	
	if (PEAR::isError($e)) {
    	echo $e->getMessage();
        var_dump($e);
    	exit(__FILE__ . ':' . __LINE__ . "\n");
	}
	
	$e = $pkg->addMaintainer('kore', 'lead', 'Kore Nordmann', 'pear@kore-nordmann.de');
	$e = $pkg->addMaintainer('toby', 'lead', 'Tobias Schlitt', 'toby@php.net');
	$e = $pkg->addMaintainer('norro', 'developer', 'Arne Nordmann', 'mail@arne-nordmann.de');
	
	if (PEAR::isError($e)) {
    	echo $e->getMessage();
    	exit(__FILE__ . ':' . __LINE__ . "\n");
	}

    $e = $pkg->addDependency('gd', null, 'has', 'ext');
	if (PEAR::isError($e)) {
    	echo $e->getMessage();
    	exit(__FILE__ . ':' . __LINE__ . "\n");
	}
    $e = $pkg->addDependency('php', '5.0.0', 'ge', 'php');
	if (PEAR::isError($e)) {
    	echo $e->getMessage();
    	exit(__FILE__ . ':' . __LINE__ . "\n");
	}

    $e = $pkg->addGlobalReplacement('package-info', '@package_version@', 'version');
	if (PEAR::isError($e)) {
    	echo $e->getMessage();
    	exit(__FILE__ . ':' . __LINE__ . "\n");
	}
    $e = $pkg->addGlobalReplacement('pear-config', '@data_dir@', 'data_dir');

	if (PEAR::isError($e)) {
    	echo $e->getMessage();
    	exit(__FILE__ . ':' . __LINE__ . "\n");
	}
	// hack until they get their shit in line with docroot role
	$pkg->addRole('tpl', 'php');
	$pkg->addRole('png', 'php');
	$pkg->addRole('gif', 'php');
	$pkg->addRole('jpg', 'php');
	$pkg->addRole('css', 'php');
	$pkg->addRole('js', 'php');
	$pkg->addRole('ini', 'php');
	$pkg->addRole('inc', 'php');
	$pkg->addRole('afm', 'php');
	$pkg->addRole('pkg', 'doc');
	$pkg->addRole('cls', 'doc');
	$pkg->addRole('proc', 'doc');
	$pkg->addRole('sh', 'doc');
	
	if (isset($make)) {
    	$e = $pkg->writePackageFile();
	} else {
    	$e = $pkg->debugPackageFile();
	}
	
	if (PEAR::isError($e)) {
    	echo $e->getMessage();
	}
/*	
	if (!isset($make)) {
    	echo '<a href="' . $_SERVER['PHP_SELF'] . '?make=1">Make this file</a>';
	}
*/
?>
