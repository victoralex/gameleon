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
 * @version   CVS: $Id: Line.php,v 1.3 2008/12/02 13:32:44 clockwerx Exp $
 * @link      http://pear.php.net/package/PackageName
 * @since     File available since Release 0.1.0
 */

require_once 'Image/3D/Vector.php';

/**
 * Image_3D_Line
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
class Image_3D_Line extends Image_3D_Vector
{
    
    protected $_direction;
    
    public function __construct($x, $y, $z, Image_3D_Vector $direction)
    {
        parent::__construct($x, $y, $z);
        $this->_direction = $direction;
    }

    public function calcPoint($t)
    {
        $t = (float) $t;

        return new Image_3D_Coordinate(
            $this->getX() + $t * $this->_direction->getX(), 
            $this->getY() + $t * $this->_direction->getY(), 
            $this->getZ() + $t * $this->_direction->getZ()
        );
    }

    public function setDirection(Image_3D_Vector $direcetion)
    {
        $this->_direction = $direcetion;
    }

    public function getDirection()
    {
        return $this->_direction;
    }

    public function __toString()
    {
        return parent::__toString() . ' -> ' . $this->getDirection()->__toString();
    }
}

?>
