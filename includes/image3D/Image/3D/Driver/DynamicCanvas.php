<?php
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
 */

/**
 * Creates a HTML document, with embedded javascript code to draw, move, rotate
 * and export the 3D-object at runtime
 *
 * @category Image
 * @package  Image_3D
 * @author   Jakob Westhoff <jakob@westhoffswelt.de>
 */
class Image_3D_Driver_DynamicCanvas extends Image_3D_Driver
{

    /**
     * Width of the image
     *
     * @var integer
     */
    protected $_x;
    /**
     * Height of the image
     *
     * @var integer
     */
    protected $_y;

    /**
     * Polygones created during the rendering process
     *
     * @var array
     */
    protected $_polygones;

    /**
     * Background Color of the rendered image
     *
     * @var string
     */
    protected $_background;


    /**
     * Name of the Render created from the filename
     * Needed for the correct creation of the Image3D java class
     * 
     * @var mixed
     */
    protected $_name;

    /**
     * Class constructor
     */
    public function __construct() 
    {
        $this->_image = '';

        $this->_polygones  = array();
        $this->_background = array();
    }

    /**
     * Create the inital image
     * 
     * @param float $x Width of the image
     * @param float $y Height of the image
     * 
     * @return void
     */
    public function createImage($x, $y) 
    {
        $this->_x = (int) $x;
        $this->_y = (int) $y;
    }

    /**
     * Set the background color of the image 
     * 
     * @param Image_3D_Color $color Desired background color of the image
     *
     * @return void
     */
    public function setBackground(Image_3D_Color $color) 
    {
        $colorarray = $this->_getRgba($color);

        $this->_background = sprintf("{ r: %d, g: %d, b: %d, a:%.2f }",
                                     $colorarray['r'], $colorarray['g'],
                                     $colorarray['b'], $colorarray['a']);
    }

    /**
     * Create an appropriate array representation from a Image_3D_Color object
     * 
     * @param Image_3D_Color $color Color to transform to rgba syntax
     * @param float          $alpha optional Override the alpha value set in the Image_3D_Color object
     * 
     * @return array Array of color values reflecting the different color
     *               components of the input object
     */ 
    protected function _getRgba(Image_3D_Color $color, $alpha = null) 
    {
        $values = $color->getValues();

        $values[0] = (int) round($values[0] * 255);
        $values[1] = (int) round($values[1] * 255);
        $values[2] = (int) round($values[2] * 255);

        if ($alpha !== null) {
            $values[3] = 1.0 - $alpha;
        } else {
            $values[3] = 1.0 - $values[3];
        }

        return array('r' => $values[0], 'g' => $values[1], 'b' => $values[2], 'a' => $values[3]);
    }

    /**
     * Add a polygon to the polygones array 
     * 
     * @param array $points Array of points which represent the polygon to add
     * @param array $colors Array of maximal three colors. The second and the
     *                      third color are allowed to be null
     * 
     * @return void
     */
    protected function _addPolygon(array $points, array $colors) 
    {        
        $this->_polygones[] = array("points" => $points, "colors" => $colors);
    }

    /**
     * Draw a specified polygon 
     * 
     * @param Image_3D_Polygon $polygon Polygon to draw
     * 
     * @return void
     */
    public function drawPolygon(Image_3D_Polygon $polygon) 
    {
        $pointarray = array();

        $points = $polygon->getPoints();
        foreach ($points as $key => $point) {
            $pointarray[$key] = array('x' => $point->getX(), 'y' => $point->getY(), 'z' => $point->getZ());
        }

        $this->_addPolygon($pointarray,
            array($this->_getRgba($polygon->getColor()),
                null,
                null));
    }

    /**
     * Draw a specified polygon utilizing gradients between his points for
     * color representation (Gauroud-Shading)
     * 
     * @param Image_3D_Polygon $polygon Polygon to draw
     * 
     * @return void
     */
    public function drawGradientPolygon(Image_3D_Polygon $polygon) 
    {
        $pointarray = array();
        $colorarray = array();

        $points = $polygon->getPoints();
        foreach ($points as $key => $point) {
            $pointarray[$key] = array('x' => $point->getX(), 'y' => $point->getY(), 'z' => $point->getZ());
            $colorarray[$key] = $this->_getRgba($point->getColor());
        }

        $this->_addPolygon($pointarray, $colorarray);
    }

    /**
     * Convert php array to a javascript parsable data structure
     * 
     * @param array $data Array to convert
     * 
     * @return string Javascript readable representation of the given php array
     */
    private function _arrayToJs(array $data) 
    {
        $output = array();

        $assoiative = false;
        // Is our array associative?
        // Does anyone know a better/faster way to check this?
        foreach (array_keys($data) as $key) {
            if (is_int($key) === false) {
                $assoiative = true;
                break;
            }
        }
        $output[] = $assoiative === true ? "{" : "[";
        foreach ($data as $key => $value) {
            $line = '';

            if ($assoiative === true) {
                $line .= "\"$key\": "; 
            }

            switch (gettype($value)) {
            case "array":
                $line .= $this->_arrayToJs($value);
                break;
            case "integer":
            case "boolean":
                $line .= $value;
                break;
            case "double":
                $line .= sprintf("%.2f", $value);
                break;
            case "string":
                $line .= "\"$value\"";
                break;
            case "NULL":
            case "resource":
            case "object":
                $line .= "undefined";
                break;
            }

            if ($key !== end(array_keys($data))) {
                $line .= ",";
            }
            $output[] = $line;
        }
        
        $output[] = $assoiative === true ? "}" : "]";

        // If the output array has more than 5 entries seperate them by a new line.
        return implode(count($data) > 5 ? "\n" : " ", $output);
    }

    /**
     * Get the Javascript needed for dynamic rendering, moving, rotating
     * and exporting of the 3D Object
     * 
     * @return string needed javascript code (with <script> tags)
     */
    private function _getJs() 
    {
        $identifiers = array(
            "%polygones%",
            "%background%",
            "%width%",
            "%height%",
            "%uid%");

        $replacements = array(
            $this->_arrayToJs($this->_polygones) . ";\n",
            $this->_background,
            $this->_x,
            $this->_y,
            sha1(mt_rand() . mt_rand() . mt_rand() . mt_rand() . mt_rand() . mt_rand() . mt_rand()));

        $jsfiles = array(
            'Init.js',
            'Renderer.js',
            'CanvasDriver.js',
            'PngDriver.js',
            'SvgDriver.js',
            'MouseEventGenerator.js',
            'RotateAnimationEventGenerator.js',
            'Toolbar.js',
            'Base64.js',
            'Image3D.js',
            'Startup.js');

        return str_replace($identifiers,
            $replacements,
            implode("\n\n",
                array_map(create_function('$jsfile',
                         (is_dir(dirname(__FILE__) . '/../../../data/DynamicCanvas')) 
                         ? ('return file_get_contents(dirname(__FILE__) . "/../../../data/DynamicCanvas/" . $jsfile);')
                         : ('return file_get_contents("@data_dir@/Image_3D/data/DynamicCanvas/" . $jsfile);')),
                    $jsfiles)));
    }

    /**
     * Save all the gathered information to a html file
     * 
     * @param string $file File to write output to
     * 
     * @return void
     */
    public function save($file) 
    {
        file_put_contents($file, $this->_getJs());
    }

    /**
     * Return the shading methods this output driver is capable of
     *
     * @return array Shading methods supported by this driver
     */
    public function getSupportedShading() 
    {
        return array(Image_3D_Renderer::SHADE_NO, Image_3D_Renderer::SHADE_FLAT);
    }
}

?>
