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
 * @version   CVS: $Id: Color.php,v 1.8 2008/12/02 13:30:40 clockwerx Exp $
 * @link      http://pear.php.net/package/PackageName
 * @since     File available since Release 0.1.0
 */

// {{{ Image_3D_Color

/**
 * Image_3D_Color
 *
 * Base class for colors and textures.
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
class Image_3D_Color
{
    
    // {{{ properties

    /**
     * Color values
     *
     * @var array
     */
    protected $_rgbaValue;

    /**
     * Array with lights which influence this color
     *
     * @var array
     */
    protected $_lights;

    /**
     * Resulting light for this color
     *
     * @var array
     */
    protected $_light;

    /**
     * Optinal value for reflection
     *
     * @var float
     */
    protected $_reflection;

    // }}}
    // {{{ __construct()

    /**
     * Constructor for Image_3D_Color
     *
     * All colors accept values in integer (0 - 255) or float (0 - 1)
     * 
     * @param mixed $red   red
     * @param mixed $green green
     * @param mixed $blue  blue
     * @param mixed $alpha alpha
     * 
     * @return  Image_3D_Color              Instance of Color
     */
    public function __construct($red = 0., $green = 0., $blue = 0., $alpha = 0., $reflection = null)
    {
        $this->_rgbaValue = array();
        
        $this->_lights = array();
        $this->_light  = array(0, 0, 0);
        
        $arglist  = func_get_args();
        $argcount = func_num_args();
        
        for ($i = 0; $i < 4; $i++) {
            if ($i >= $argcount) {
                $this->_rgbaValue[$i] = 0;
            } elseif (is_int($arglist[$i])) {
                $this->_rgbaValue[$i] = (float) min(1, max(0, (float) $arglist[$i] / 255));
            } elseif (is_float($arglist[$i])) {
                $this->_rgbaValue[$i] = (float) min(1, max(0, $arglist[$i]));
            } else {
                $this->_rgbaValue[$i] = 0;
            }
        }

        $this->setReflection($reflection);
    }
    
    // }}}
    // {{{ mixAlpha()

    /**
     * Apply alphavalue to color
     *
     * Apply alpha value to color. It may be int or float. 255 / 1. means full
     * oppacity
     *
     * @param mixed $alpha Alphavalue
     * 
     * @return  void
     */
    public function mixAlpha($alpha = 1.)
    {
        if (is_int($alpha)) {
            $this->_rgbaValue[3] *= (float) min(1, max(0, (float) $alpha / 255));
        } else {
            $this->_rgbaValue[3] *= (float) min(1, max(0, (float) $alpha));
        }
    }
    
    // }}}
    // {{{ setReflection()

    /**
     * sets reflection intensity
     *
     * @param float $reflection reflection
     * 
     * @return void
     */
    public function setReflection($reflection)
    {
        $this->_reflection = min(1, max(0, (float) $reflection));
    }
    
    // }}}
    // {{{ getReflection()

    /**
     * return reflection intensity
     *
     * @return  float           reflection
     */
    public function getReflection()
    {
        if (!isset($this->_reflection)) {
            return 0;
        } else {
            return $this->_reflection;
        }
    }
    
    // }}}
    // {{{ getValues()

    /**
     * return RGBA values
     *
     * Return an array with rgba-values
     *  0 =>    (float) red
     *  1 =>    (float) green
     *  2 =>    (float) blue
     *  3 =>    (float) alpha
     *
     * @return  array           RGBA-Values
     */
    public function getValues()
    {
        return $this->_rgbaValue;
    }
    
    // }}}
    // {{{ addLight()

    /**
     * Add light
     *
     * Add an light which influence the object this color is created for
     *
     * @param Image_3D_Color $color     Lightcolor
     * @param mixed          $intensity Intensity
     * 
     * @return  void
     */
    public function addLight(Image_3D_Color $color, $intensity = .5)
    {
        $this->_lights[] = array($intensity, $color);
    }
    
    // }}}
    // {{{ _calcLights()

    /**
     * Calculate lights
     *
     * Calculate light depending an all lights which influence this object
     *
     * @return  void
     */
    protected function _calcLights()
    {
        foreach ($this->_lights as $light) {
            list($intensity, $color) = $light;

            $colorArray = $color->getValues();

            $this->_light[0] += $colorArray[0] * $intensity * (1 - $colorArray[3]);
            $this->_light[1] += $colorArray[1] * $intensity * (1 - $colorArray[3]);
            $this->_light[2] += $colorArray[2] * $intensity * (1 - $colorArray[3]);
        }
    }
    
    // }}}
    // {{{ _mixColor()

    /**
     * Mix Color with light
     *
     * Recalculate color depending on the lights
     *
     * @return  void
     */
    protected function _mixColor()
    {
        $this->_rgbaValue[0] = min(1, $this->_rgbaValue[0] * $this->_light[0]);
        $this->_rgbaValue[1] = min(1, $this->_rgbaValue[1] * $this->_light[1]);
        $this->_rgbaValue[2] = min(1, $this->_rgbaValue[2] * $this->_light[2]);
    }
    
    // }}}
    // {{{ calculateColor()

    /**
     * Calculate new color
     *
     * Calculate color depending on the lights
     *
     * @return  void
     */
    public function calculateColor()
    {
        if (!count($this->_lights)) {
            $this->_rgbaValue = array(0, 0, 0, $this->_rgbaValue[3]);
            return true;
        }
        
        $this->_calcLights();
        $this->_mixColor();
    }

    // }}}
    // {{{ merge()

    /**
     * Merge with other colors
     *
     * Merge color with other colors
     *
     * @return  void
     */
    public function merge($colors)
    {
        $count = 0;
        foreach ($colors as $color) {
            if (!($color instanceof Image_3D_Color)) {
                continue;
            }

            $values = $color->getValues();

            $this->_rgbaValue[0] += $values[0];
            $this->_rgbaValue[1] += $values[1];
            $this->_rgbaValue[2] += $values[2];
            $this->_rgbaValue[3] += $values[3];

            ++$count;
        }

        $this->_rgbaValue[0] /= $count;
        $this->_rgbaValue[1] /= $count;
        $this->_rgbaValue[2] /= $count;
        $this->_rgbaValue[3] /= $count;

        return $this;
    }

    // }}}
    // {{{ __toString()

    /**
     * Return Color as string
     *
     * Return a string representation of the color
     *
     * @return  string          String representation of color
     */
    public function __toString()
    {
        return sprintf("Color: r %.2f g %.2f b %.2f a %.2f\n", $this->_rgbaValue[0], $this->_rgbaValue[1], $this->_rgbaValue[2], $this->_rgbaValue[3]);
    }
    
    // }}}
}

// }}}
