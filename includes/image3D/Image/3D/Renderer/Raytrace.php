<?php

/* vim: set expandtab tabstop=4 shiftwidth=4 softtabstop=4: */

/**
 * 3d Library
 *
 * PHP versions 5
 *
 * LICENSE: 
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 * 
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public
 * License along with this library; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301  USA
 *
 * @category  Image
 * @package   Image_3D
 * @author    Kore Nordmann <3d@kore-nordmann.de>
 * @copyright 1997-2005 Kore Nordmann
 * @license   http://www.gnu.org/licenses/lgpl.txt lgpl 2.1
 * @version   CVS: $Id: Raytrace.php,v 1.2 2008/12/02 14:20:11 clockwerx Exp $
 * @link      http://pear.php.net/package/PackageName
 * @since     File available since Release 0.1.0
 */

// {{{ Image_3D_Renderer_Raytrace

/**
 * Image_3D_Renderer_Raytrace
 *
 * @category  Image
 * @package   Image_3D
 * @author    Kore Nordmann <3d@kore-nordmann.de>
 * @copyright 1997-2005 Kore Nordmann
 * @license   http://www.gnu.org/licenses/lgpl.txt lgpl 2.1
 * @version   Release: @package_version@
 * @link      http://pear.php.net/package/PackageName
 * @since     Class available since Release 0.1.0
 */
class Image_3D_Renderer_Raytrace extends Image_3D_Renderer
{
    
    protected $_image;
    
    protected $_camera;
    protected $_shadows;
    protected $_rays;
    protected $_depth;

    public function __construct()
    {
        parent::__construct();

        $this->_camera  = new Image_3D_Coordinate(0, 0, -100);
        $this->_shadows = true;
        $this->_rays    = 1;
        $this->_depth   = 5;
    }
    
    // {{{ _calculateScreenCoordiantes()

    /**
     * Caclulate Screen Coordinates
     *
     * Does not do anything
     *
     * @param Image_3D_Point $point Point to process
     *
     * @return  void
     */
    protected function _calculateScreenCoordiantes(Image_3D_Point $point)
    {
    }
    
    // }}}
    // {{{ _sortPolygones()

    /**
     * Sort polygones
     *
     * Does not do anything
     *
     * @return  void
     */
    protected function _sortPolygones()
    {
    }

    // }}}
    // {{{ setShading()
    
    /**
     * Set the quality of the shading
     *
     * Does not do anything
     *
     * @return  void
     */
    public function setShading()
    {
    }
    
    // }}}
    // {{{ setDriver()
    
    /**
     * Set the driver
     *
     * Does not do anything
     *
     * @return  void
     */
    public function setDriver()
    {
    }
    
    // }}}
    public function setCameraPosition(Image_3D_Coordinate $position)
    {
        $this->_camera = $position;
    }

    public function setRaysPerPixel($rays)
    {
        $this->_rays = max(1, (int) $rays);
    }

    public function scanDepth($depth) 
    {
        $this->_depth = max(1, (int) $depth);
    }

    public function enableShadows($shadows) 
    {
        $this->_shadows = (bool) $shadows;
    }
    
    protected function _sendRay(Image_3D_Line $ray, $depth) 
    {
        if ($depth <= 0) {
            return false;
        }

        $lowest  = 1000;
        $nearest = false;
        foreach ($this->_polygones as $nr => $polygon) {
            $t = $polygon->distance($ray);
            if ($t === false) {
                continue;
            }

            if ($t < $lowest) {
                $nearest = $nr;
                $lowest  = $t;
            }
        }

        if ($nearest === false) {
            return false;
        }

        // Examine cutting point
        $cuttingPoint = clone $ray;
        $direction    = $cuttingPoint->getDirection();
        $cuttingPoint->add($cuttingPoint->getDirection()->multiply($lowest));

        // Create point to use for enlightenment
        $point = new Image_3D_Point($cuttingPoint->getX(), $cuttingPoint->getY(), $cuttingPoint->getZ());
        $point->addVector($this->_polygones[$nearest]->getNormale());
        $point->addColor($this->_polygones[$nearest]->getColor());

        // Perhaps send new rays
        $transparency = end($this->_polygones[$nearest]->getColor()->getValues());
        $reflection   = $this->_polygones[$nearest]->getColor()->getReflection();


        if ($reflection > 0) {
            // Calculate reflection vector
            $normale = $this->_polygones[$nearest]->getNormale();
            $normale->unify();

            $direction = $ray->getDirection();

            $reflectionRay = new Image_3D_Line($cuttingPoint->getX(), 
                                                $cuttingPoint->getY(), 
                                                $cuttingPoint->getZ(), 
                                                // l - 2n (n * l)   
                                                $direction->sub($normale->multiply($normale->scalar($direction))->multiply(2)));

            $reflectionColor = $this->_sendRay($reflectionRay, $depth - 1);
            if ($reflectionColor === false) {
                $reflectionColor = $this->_background;
            }
            $reflectionColor->mixAlpha($reflection);
            $point->addColor($reflectionColor);
        }

        if ($transparency > 0) {
            // Calculate colors in the back of our polygon
            $transparencyRay = new Image_3D_Line($cuttingPoint->getX(), $cuttingPoint->getY(), $cuttingPoint->getZ(), $ray->getDirection());
            
            $transparencyColor = $this->_sendRay($transparencyRay, $depth - 1);
            if ($transparencyColor === false) {
                $transparencyColor = $this->_background;
            }
            $transparencyColor->mixAlpha($transparency);
            $point->addColor($transparencyColor);
        }

        // Check lights influence for cutting point
        $pointLights = array();
        foreach ($this->_lights as $light) {
            // Check for shadow casting polygones
            if ($this->_shadows) {
                // Create line from point to light source
                $lightVector = new Image_3D_Vector($light->getX(), $light->getY(), $light->getZ());
                $lightVector->sub($cuttingPoint);

                $lightVector = new Image_3D_Line($cuttingPoint->getX(), $cuttingPoint->getY(), $cuttingPoint->getZ(), $lightVector);

                // Check all polygones for possible shadows to cast
                $modifyingPolygones = array();

                $modifyLight = false;
                foreach ($this->_polygones as $polygon) {
                    $t = $polygon->distance($lightVector);
                    
                    // $t > 1 means polygon is behind the light, but crosses the ray
                    if (($t !== false) && ($t < 1)) {
                        $transparency = end($polygon->getColor()->getValues());
                        if ($transparency > 0) {
                            // Polygon modifies light source
                            $modifyingPolygones[] = $polygon;

                            $modifyLight = true;
                        } else {
                            // Does not use lightsource when non transparent polygon is in its way
                            continue 2;
                        }
                    }
                }

                // We only reach this code with no, or only transparent polygones
                if ($modifyLight) {
                    $light = clone $light;

                    $lightColor = $light->getRawColor()->getValues();

                    // Modify color for all polygones in the rays way to earth
                    foreach ($modifyingPolygones as $polygon) {
                        $polygonColor = $polygon->getColor()->getValues();

                        $lightColor[0] *= $polygonColor[0] * (1 - $polygonColor[3]);
                        $lightColor[1] *= $polygonColor[1] * (1 - $polygonColor[3]);
                        $lightColor[2] *= $polygonColor[2] * (1 - $polygonColor[3]);
                        $lightColor[3] *= $polygonColor[3];
                    }
                    
                    $light->setColor(new Image_3D_Color($lightColor[0], $lightColor[1], $lightColor[2], $lightColor[3]));
                }
            }

            $pointLights[] = $light;
        }
    
        $point->calculateColor($pointLights);
        return $point->getColor();
    }
    
    protected function _raytrace()
    {
        // Create basic ray ... modify direction later
        $ray = new Image_3D_Line($this->_camera->getX(), $this->_camera->getY(), $this->_camera->getZ(), new Image_3D_Vector(0, 0, 1));
        
        // Colorarray for resulting image
        $canvas = array();
        
        // Iterate over viewplane
        for ($x = -$this->_size[0]; $x < $this->_size[0]; ++$x) {
            for ($y = -$this->_size[1]; $y < $this->_size[1]; ++$y) {
                $canvas[$x + $this->_size[0]][$y + $this->_size[1]] = array();

                // Iterate over rays for one pixel
                $inPixelRayDiff = 1 / ($this->_rays + 1);
                for ($i = 0; $i < $this->_rays; ++$i) {
                    for ($j = 0; $j < $this->_rays; ++$j) {
                        
                        // Modify ray
                        $ray->setDirection(new Image_3D_Vector(
                            ($x + $i * $inPixelRayDiff) - $this->_camera->getX(),
                            ($y + $j * $inPixelRayDiff) - $this->_camera->getY(),
                            - $this->_camera->getZ()
                        ));

                        // Get color for ray
                        $color = $this->_sendRay($ray, $this->_depth);
                        if ($color !== false) {
                            $canvas[$x + $this->_size[0]][$y + $this->_size[1]][] = $color;
                        } else {
                            $canvas[$x + $this->_size[0]][$y + $this->_size[1]][] = $this->_background;
                        }
                    }
                }
            }
        }

        return $canvas;
    }
    
    protected function _getColor(Image_3D_Color $color)
    {
        $values = $color->getValues();

        $values[0] = (int) round($values[0] * 255);
        $values[1] = (int) round($values[1] * 255);
        $values[2] = (int) round($values[2] * 255);
        $values[3] = (int) round($values[3] * 127);

        if ($values[3] > 0) {
            // Tranzparente Farbe allokieren
            $color = imageColorExactAlpha($this->_image, $values[0], $values[1], $values[2], $values[3]);
            if ($color === -1) {
                // Wenn nicht Farbe neu alloziieren
                $color = imageColorAllocateAlpha($this->_image, $values[0], $values[1], $values[2], $values[3]);
            }
        } else {
            // Deckende Farbe allozieren
            $color = imageColorExact($this->_image, $values[0], $values[1], $values[2]);
            if ($color === -1) {
                // Wenn nicht Farbe neu alloziieren
                $color = imageColorAllocate($this->_image, $values[0], $values[1], $values[2]);
            }
        }
        
        return $color;
    }
    
    // {{{ render()
    
    /**
     * Render the image
     *
     * Render the image into the metioned file
     *
     * @param string $file Filename
     *
     * @return  void
     */
    public function render($file)
    {
        // Render image...
        $canvas = $this->_raytrace();

        // Write canvas to file
        $this->_image = imagecreatetruecolor($this->_size[0] * 2, $this->_size[1] * 2);
        
        $bg = $this->_getColor($this->_background);
        imagefill($this->_image, 1, 1, $bg);
        
        $x = 0;
        foreach ($canvas as $row) {
            $y = 0;
            foreach ($row as $pixel) {
                if (count($pixel)) {
                    $color = new Image_3D_Color();
                    $color->merge($pixel);

                    imagesetpixel($this->_image, $x, $y, $this->_getColor($color));
                }
                ++$y;
            }
            ++$x;
        }

        imagepng($this->_image, $file);
    }

    // }}}
}

// }}}
