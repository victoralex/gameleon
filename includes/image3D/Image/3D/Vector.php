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
 * @version   CVS: $Id: Vector.php,v 1.10 2008/12/02 13:32:44 clockwerx Exp $
 * @link      http://pear.php.net/package/PackageName
 * @since     File available since Release 0.1.0
 */

require_once('Image/3D/Coordinate.php');

/**
 * Image_3D_Vector
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
class Image_3D_Vector extends Image_3D_Coordinate {
    
    protected $_length;
    
    public function getAngle(Image_3D_Vector $vector)
    {
        $length = $vector->length() * $this->length();
        if ($length < 0.0001) return 1;

        return abs(acos($this->scalar($vector) / $length) / M_PI - .5) * 2;
    }
    
    public function getSide(Image_3D_Vector $vector) {
//        $vector->unify();
//        $this->unify();
        return $this->scalar($vector);
    }
    
    public function unify() {
        if ($this->length() == 0) return false;
        if ($this->_length == 1) return $this;

        $this->_x /= $this->_length;
        $this->_y /= $this->_length;
        $this->_z /= $this->_length;
        $this->_length = 1;
        return $this;
    }

    public function length() {
        if (empty($this->_length)) {
            $this->_length = sqrt(pow($this->_x, 2) + pow($this->_y, 2) + pow($this->_z, 2));
        }
        return $this->_length;
    }
    
    public function add(Image_3D_Coordinate $vector)
    {
        $this->_x += $vector->getX();
        $this->_y += $vector->getY();
        $this->_z += $vector->getZ();
        $this->_length = null;
        return $this;
    }
    
    public function sub(Image_3D_Coordinate $vector)
    {
        $this->_x -= $vector->getX();
        $this->_y -= $vector->getY();
        $this->_z -= $vector->getZ();
        $this->_length = null;
        return $this;
    }

    public function multiply($scalar) {
        if ($scalar instanceof Image_3D_Vector) return $this->scalar($scalar);

        $this->_x *= $scalar;
        $this->_y *= $scalar;
        $this->_z *= $scalar;
        $this->_length = null;
        return $this;
    }

    public function scalar(Image_3D_Coordinate $vector) {
        return (($this->_x * $vector->getX()) +
                ($this->_y * $vector->getY()) +
                ($this->_z * $vector->getZ()));
    }

    public function crossProduct(Image_3D_Coordinate $vector) {
        return new Image_3D_Vector(
                $this->getY() * $vector->getZ() - $this->getZ() * $vector->getY(),
                $this->getZ() * $vector->getX() - $this->getX() * $vector->getZ(),
                $this->getX() * $vector->getY() - $this->getY() * $vector->getX()
            );
    }
}

?>
