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
 *
 * @category Image
 * @package  Image_3D
 * @author   Arne Nordmann <3d-rotate@arne-nordmann.de>
 */

/**
 * Creates a SVG, to move and rotate the 3D-object at runtime
 *
 * @category Image
 * @package  Image_3D
 * @author   Arne Nordmann <3d-rotate@arne-nordmann.de>
 */
class Image_3D_Driver_SVGControl extends Image_3D_Driver
{

    /**
     * Width of the image
     */
    protected $_x;
    /**
     * Height of the image
     */
    protected $_y;

    /**
     * Current, increasing element-id (integer)
     */
    protected $_id;

    /**
     * Array of gradients
     */
    protected $_gradients;
    /**
     * Rectangle with background-color
     */
    protected $_background;
    /**
     * Array of polygones
     */
    protected $_polygones;

    /**
     * Constructor
     *
     */
    public function __construct()
    {
        $this->_image = '';
        $this->_id    = 1;

        $this->_gradients = array();
        $this->_polygones = array();
    }

    /**
     * Creates image header
     *
     * @param float $x width of the image
     * @param float $y height of the image
     *
     * @return void
     */
    public function createImage($x, $y)
    {
        $this->_x = (int) $x;
        $this->_y = (int) $y;

        $this->_image = <<<EOF
<?xml version="1.0" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"
         "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">

<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="{$this->_x}" height="{$this->_y}" onload="init(evt)">
EOF;

        $this->_image .= "\n\n";
    }

    /**
     * Adds coloured background to the image
     *
     * Draws a rectangle with the size of the image and the passed colour
     *
     * @param Image_3D_Color $color Background colour of the image
     *
     * @return void
     */
    public function setBackground(Image_3D_Color $color)
    {
        $this->_background  = "\t<!-- coloured background -->\n";
        $this->_background .= sprintf("\t<rect id=\"background\" x=\"0\" y=\"0\" width=\"%d\" height=\"%d\" style=\"%s\" />\n",
            $this->_x,
            $this->_y,
            $this->_getStyle($color));
    }

    protected function _getStyle(Image_3D_Color $color)
    {
        $values = $color->getValues();

        $values[0] = (int) round($values[0] * 255);
        $values[1] = (int) round($values[1] * 255);
        $values[2] = (int) round($values[2] * 255);
        $values[3] = 1 - $values[3];

        // optional: "shape-rendering: optimizeSpeed;" to increase speed
        return sprintf('fill:#%02x%02x%02x; stroke:none;',
                        $values[0],
                        $values[1],
                        $values[2])
               .((empty($values[3]))?'':' opacity:'.$values[3]); // opacity
    }

    protected function _getStop(Image_3D_Color $color, $offset = 0, $alpha = null)
    {
        $values = $color->getValues();

        $values[0] = (int) round($values[0] * 255);
        $values[1] = (int) round($values[1] * 255);
        $values[2] = (int) round($values[2] * 255);
        if ($alpha === null) {
            $values[3] = 1 - $values[3];
        } else {
            $values[3] = 1 - $alpha;
        }

        return sprintf("\t\t\t<stop id=\"stop%d\" offset=\"%.1f\" style=\"stop-color:rgb(%d, %d, %d); stop-opacity:%.4f;\" />\n",
                        $this->_id++,
                        $offset,
                        $values[0],
                        $values[1],
                        $values[2],
                        $values[3]);
    }

    protected function _addGradient($string)
    {
        $id = 'linearGradient' . $this->_id++;

        $this->_gradients[] = str_replace('[id]', $id, $string);
        return $id;
    }

    protected function _addPolygon($string)
    {
        $id = 'data_polygon' . $this->_id++;

        $this->_polygones[] = str_replace('[id]', $id, $string);
        return $id;
    }

    public function drawPolygon(Image_3D_Polygon $polygon)
    {
        $list   = '';
        $points = $polygon->getPoints();

        $svg = "\t\t\t<polygon id=\"[id]\" "; //Image_3D_P

        // number of points
        $svg .= 'nop="'.count($points).'" ';

        // coordinates on start
        foreach ($points as $nr => $point) {
            $svg .= 'x'.$nr.'="'.round($point->getX()).'" ';
            $svg .= 'y'.$nr.'="'.round($point->getY()).'" ';
            $svg .= 'z'.$nr.'="'.round($point->getZ()).'" ';
        }
        $svg .= 'style="'.$this->_getStyle($polygon->getColor())."\" />\n";

        $this->_addPolygon($svg);
    }

    public function drawGradientPolygon(Image_3D_Polygon $polygon)
    {
    }

    /**
     * Creates scripting area for moving and rotating the object
     *
     * @return string
     */
    protected function _getScript()
    {
        $p_count = count($this->_polygones);

        // Create entire scripting area for moving and rotating the polygones
        $script = <<<EOF
        <!-- ECMAScript for moving and rotating -->
        <script type="text/ecmascript"> <![CDATA[

            var svgdoc;
            var svgns;

            var width, height;
            var viewpoint, distance;

            var plist, pcont, t1;

            var timer;

            var mov_x, mov_y, mov_z;
            var rot_x, rot_y, rot_z;

            // Some kind of constructor
            function init(evt) {
                // Set image dimension
                width = {$this->_x};
                height = {$this->_y};

                // Set viewpoint and distance for perspective
                viewpoint = (width + height) / 2;
                distance = (width + height) / 2;

                // Set path to 0
                mov_x = 0;
                mov_y = 0;
                mov_z = 0;
                rot_x = 0;
                rot_y = 0;
                rot_z = 0;

                // Reference the SVG-Document
                svgdoc = evt.target.ownerDocument;
                svgns = 'http://www.w3.org/2000/svg';

                // Reference list of Image_3D_Polygons
                plist = svgdoc.getElementById('plist');

                // Reference container for polygones
                pcont = svgdoc.getElementById('pcont');

                drawAllPolygones();
            }

            // Draw all polygones
            function drawAllPolygones() {
                // Update all polygones
                for (i=1; i<={$p_count}; ++i) {
                    dp = svgdoc.getElementById("data_polygon"+i);

                    // Number of points for this polygon
                    nop = parseInt(dp.getAttribute("nop"));

                    // find coordinates of each point
                    pstr = '';
                    for (j=0; j<nop; ++j) {
                        x = parseInt(dp.getAttribute('x'+j));
                        y = parseInt(dp.getAttribute('y'+j));
                        z = parseInt(dp.getAttribute('z'+j));

                        // Rotation
                        if (rot_x!=0 || rot_y!=0 || rot_z!=0) {
                            /*if (rot_x!=0) {
                                // rotate around the x-axis
                            }

                            if (rot_y!=0) {
                                // rotate around the y-axis
                            }*/

                            if (rot_z!=0) {
                                // rotate around the z-axis
                                var b = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
                                var phi = Math.atan2(x, y);
                                x = b * Math.sin(phi + Math.PI/360*rot_z);
                                y = b * Math.cos(phi + Math.PI/360*rot_z);
                            }
                        }

                        // Calculate coordinates on screen (perspectively - viewpoint, distance: 500)
                        x = Math.round(viewpoint * (x + mov_x) / (z + distance) + {$this->_x}) / 2;
                        y = Math.round(viewpoint * (y + mov_y) / (z + distance) + {$this->_y}) / 2;

                        // Create string of points
                        pstr += x+','+y+' ';
                    }

                    // Manipulate the polygon if existing, otherwise create it
                    p = svgdoc.getElementById("polygon"+i);
                    if (p==null) {
                        // Polygon doesn't exist, create it
                        p = svgdoc.createElementNS(svgns, 'polygon');

                        // Get style of data polygon
                        var style = dp.getAttribute("style");
                        p.setAttributeNS(null, "style", style);

                        p.setAttributeNS(null, "id", "polygon"+i);
                        p.setAttributeNS(null, "points", pstr);
                        pcont.appendChild(p);
                    } else {
                        // Polygon exists, just update points-attribute
                        p.setAttributeNS(null, "points", pstr);
                    }
                }
            }

            // Translate X
            function move_left(steps) {
                if (steps>0) {
                    mov_x -= 3;
                    drawAllPolygones();
                    timer = setTimeout('move_left('+(steps-1)+')', 1);
                }
            }
            function move_right(steps) {
                if (steps>0) {
                    mov_x += 3;
                    drawAllPolygones();
                    timer = setTimeout('move_right('+(steps-1)+')', 1);
                }
            }

            // Translate Y
            function move_up(steps) {
                if (steps>0) {
                    mov_y -= 3;
                    drawAllPolygones();
                    timer = setTimeout('move_up('+(steps-1)+')', 1);
                }
            }
            function move_down(steps) {
                if (steps>0) {
                    mov_y += 3;
                    drawAllPolygones();
                    timer = setTimeout('move_down('+(steps-1)+')', 1);
                }
            }

            // Translate Z (zoom)
            function zoom_in(steps) {
                if (steps>0) {
                    distance -= 3;
                    viewpoint += 1;
                    drawAllPolygones();
                    timer = setTimeout('zoom_in('+(steps-1)+')', 1);
                }
            }
            function zoom_out(steps) {
                if (steps>0) {
                    distance += 3;
                    viewpoint -= 1;
                    drawAllPolygones();
                    timer = setTimeout('zoom_out('+(steps-1)+')', 1);
                }
            }

            // Rotate Z
            function rotate_z_cw(steps) {
                if (steps>0) {
                    rot_z -= 6;
                    drawAllPolygones();
                    timer = setTimeout('rotate_z_cw('+(steps-1)+')', 1);
                }
            }
            function rotate_z_ccw(steps) {
                if (steps>0) {
                    rot_z += 6;
                    drawAllPolygones();
                    timer = setTimeout('rotate_z_ccw('+(steps-1)+')', 1);
                }
            }

            // Back to default position
            function move_to_default() {
                // Move to default Position
                mov_x = 0;
                mov_y = 0;
                mov_z = 0;
                rot_x = 0;
                rot_y = 0;
                rot_z = 0;

                // Kill existing timer to stop remaining movements
                clearTimeout(timer);

                // Zoom to default position
                viewpoint = (width + height) / 2;
                distance = (width + height) / 2;

                // Draw all polygones with reset parameters
                drawAllPolygones();
            }

            // In- or decrease one of the three coordinates
            function moveAllPolygones(coord, step) {
                var p, c;

                // Find all polygones
                for (i=1; i<={$p_count}; ++i) {
                    p = svgdoc.getElementById('polygon'+i);

                    // Number of points for this polygon
                    nop = parseInt(p.getAttribute("nop"));

                    switch (coord) {
                        case 0  :   // X
                                    for (j=0; j<nop; ++j) {
                                        var c = parseInt(p.getAttribute('x'+j));
                                        p.setAttribute('x'+j, (c+step));
                                    }
                                 break;
                        case 1  :   // Y
                                    for (j=0; j<nop; ++j) {
                                        var c = parseInt(p.getAttribute('y'+j));
                                        p.setAttribute('y'+j, (c+step));
                                    }
                                 break;
                        case 2  :   // Z
                                    for (j=0; j<nop; ++j) {
                                        var c = parseInt(p.getAttribute('z'+j));
                                        p.setAttribute('z'+j, (c+step));
                                    }
                                 break;
                    }
                }
            }

        ]]> </script>

EOF;

        return $script;
    }

    /**
     * Creates controls for moving and rotating the object
     *
     * @return string
     */
    protected function _getControls()
    {

        function drawArrow($x, $y, $id, $rot, $funct)
        {
            $arrow_points = ($x+12).','.($y+3).' '.($x+3).','.($y+8).' '.($x+12).','.($y+13);

            $arrow  = "\t<g id=\"".$id.'" transform="rotate('.$rot.', '.($x+8).', '.($y+8)
                    .')" onclick="'.$funct."\" style=\"cursor:pointer\">\n";
            $arrow .= "\t\t<rect x=\"".$x.'" y="'.$y.'" width="16" height="16" '
                        ." style=\"fill:#bbb; stroke:none;\" />\n";
            $arrow .= "\t\t<rect x=\"".($x+1).'" y="'.($y+1).'" width="14" height="14" '
                        ." style=\"fill:#ddd; stroke:none;\" />\n";
            $arrow .= "\t\t<polygon points=\"".$arrow_points.'" '
                        ." style=\"fill:#000; stroke:none;\" />\n";
            $arrow .= "\t</g>\n";

            return $arrow;
        }

        $x = $this->_x * 0.05;
        $y = $this->_y * 0.05;

        $controls  = "\n\t<!-- Control Elements -->\n";
        $controls .= "\t<rect x=\"0\" y=\"0\" width=\"".$this->_x."\" height=\"20\" style=\"fill:#eee; stroke:#ddd; stroke-width:1px; shape-rendering:optimizeSpeed;\" />\n";

        // Button "1:1"
        $controls .= "\t<g onclick=\"move_to_default()\" style=\"cursor:pointer;\">\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"fill:url(#b_off); stroke:#ccc; stroke-width:1px; shape-rendering:optimizeSpeed;\" />\n";
        $controls .= "\t\t<text x=\"10\" y=\"14\" style=\"font-size:10px; text-anchor:middle;\">1:1</text>\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"opacity:0;\" />\n";
        $controls .= "\t</g>\n";

        // Button "zoom in"
        $controls .= "\t<g onclick=\"zoom_in(10)\" transform=\"translate(25, 0)\" style=\"cursor:pointer;\">\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"fill:url(#b_off); stroke:#ccc; stroke-width:1px; shape-rendering:optimizeSpeed;\" />\n";
        $controls .= "\t\t<path style=\"fill:#999; stroke:#aaa; stroke-width:1px;\" d=\"M 5 13 L 3 17 A 2 2 0 0 0 8 17 L 11 14\"/>\n";
        $controls .= "\t\t<circle cx=\"11\" cy=\"9\" r=\"7\" style=\"fill:#fff; stroke:#ccc; stroke-width:1px;\" />\n";
        $controls .= "\t\t<text x=\"11\" y=\"13\" style=\"font-size:10px; text-anchor:middle;\">+</text>\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"opacity:0;\" />\n";
        $controls .= "\t</g>\n";

        // Button "zoom out"
        $controls .= "\t<g onclick=\"zoom_out(10)\" transform=\"translate(46, 0)\" style=\"cursor:pointer;\">\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"fill:url(#b_off); stroke:#ccc; stroke-width:1px; shape-rendering:optimizeSpeed;\" />\n";
        $controls .= "\t\t<path style=\"fill:#999; stroke:#aaa; stroke-width:1px;\" d=\"M 5 13 L 3 17 A 2 2 0 0 0 8 17 L 11 14\"/>\n";
        $controls .= "\t\t<circle cx=\"11\" cy=\"9\" r=\"7\" style=\"fill:#fff; stroke:#ccc; stroke-width:1px;\" />\n";
        $controls .= "\t\t<text x=\"10\" y=\"8\" style=\"font-size:10px; text-anchor:middle;\">_</text>\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"opacity:0;\" />\n";
        $controls .= "\t</g>\n";

        /*// Button "hand"
        $controls .= "\t<g transform=\"translate(70, 0)\">\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"fill:url(#b_off); stroke:#ccc; stroke-width:1px; shape-rendering:optimizeSpeed;\" />\n";
        $controls .= "\t\t<path d=\"M 7.95,18.08 C 8.01,15.70 5.14,15.75 4.62,12.86 C 4.09,9.934 3.76,8.16 3.76,8.16 C 3.76,8.16 5.54,7.95 5.98,9.47 C 6.42,11 7.07,12.48 7.07,12.48 C 7.07,12.48 6.12,5.12 6.16,4.68 C 6.22,4.04 6.30,3.28 6.953,3.24 C 7.64,3.19 8.06,3.66 8.26,4.51 C 8.38,5.05 8.98,8.49 8.98,8.49 C 8.98,8.49 8.66,3.41 8.84,2.98 C 9.131,2.30 9.17,1.97 9.81,1.92 C 10.45,1.88 10.94,2.60 11.05,3.07 C 11.15,3.53 11.37,8.24 11.37,8.24 C 11.37,8.24 11.55,4.08 11.81,3.49 C 12.08,2.90 12.14,2.39 12.78,2.47 C 13.42,2.56 13.80,3.19 13.74,3.87 C 13.69,4.55 13.74,9.72 13.74,9.72 C 13.74,9.72 14.30,7.12 14.45,6.63 C 14.63,6.03 15.17,5.32 15.70,5.48 C 16.13,5.61 16.27,7.01 15.95,8.52 C 15.65,9.92 15.32,11.86 15.06,12.77 C 14.79,13.68 14.36,14.38 13.77,15.17 C 13.18,15.96 12.94,17.01 12.97,18.11 C 10.73,18.16 8.71,18.07 7.95,18.07\" style=\"fill:#fff; stroke:#000; stroke-width:.5;\" />\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"opacity:0;\" />\n";
        $controls .= "\t</g>\n";

        // Button "drag"
        $controls .= "\t<g transform=\"translate(91, 0)\">\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"fill:url(#b_off); stroke:#ccc; stroke-width:1px; shape-rendering:optimizeSpeed;\" />\n";
        $controls .= "\t\t<text x=\"10\" y=\"14\" style=\"font-size:10px; text-anchor:middle;\">d</text>\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"opacity:0;\" />\n";
        $controls .= "\t</g>\n";*/

        // Button "rotate counter-clockwise"
        $controls .= "\t<g transform=\"translate(115, 0)\" onclick=\"rotate_z_ccw(15)\" style=\"cursor:pointer;\">\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"fill:url(#b_off); stroke:#ccc; stroke-width:1px; shape-rendering:optimizeSpeed;\" />\n";
        $controls .= "\t\t<path style=\"fill:none; stroke:#000; stroke-width:1px;\" d=\"M 9 16 A 6 6 0 1 0 5 10\" />\n";
        $controls .= "\t\t<polygon style=\"fill:#000;\" points=\"2,10 8,10 5,14\" />\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"opacity:0;\" />\n";
        $controls .= "\t</g>\n";

        // Button "rotate clockwise"
        $controls .= "\t<g transform=\"translate(136, 0)\" onclick=\"rotate_z_cw(15)\" style=\"cursor:pointer;\">\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"fill:url(#b_off); stroke:#ccc; stroke-width:1px; shape-rendering:optimizeSpeed;\" />\n";
        $controls .= "\t\t<path style=\"fill:none; stroke:#000; stroke-width:1px;\" d=\"M 9 16 A 6 6 0 1 1 15 10\" />\n";
        $controls .= "\t\t<polygon style=\"fill:#000;\" points=\"12,10 18,10 15,14\" />\n";
        $controls .= "\t\t<rect x=\"0\" y=\"0\" width=\"20\" height=\"20\" style=\"opacity:0;\" />\n";
        $controls .= "\t</g>\n";

        // Move left
        $x = 0;
        $y = $this->_y / 2 - 8;

        $controls .= drawArrow($x, $y, 'move_left', 0, 'move_left(15)');

        // Move up
        $x = $this->_x / 2 - 8;
        $y = 20;

        $controls .= drawArrow($x, $y, 'move_up', 90, 'move_up(15)');

        // Move right
        $x = $this->_x - 16;
        $y = $this->_y / 2 - 8;

        $controls .= drawArrow($x, $y, 'move_right', 180, 'move_right(15)');

        // Move down
        $x = $this->_x / 2 - 8;
        $y = $this->_y - 16;

        $controls .= drawArrow($x, $y, 'move_down', -90, 'move_down(15)');

        return $controls;
    }

    public function save($file)
    {
        // Start of SVG definition area
        $this->_image .= sprintf("\t<defs id=\"defs%d\">\n", $this->_id++);

        // Add scripting for moving and rotating
        $this->_image .= $this->_getScript();

        // Add gradients in case of GAUROUD-shading
        if (count($this->_gradients)>0) {
            $this->_image .= implode('', $this->_gradients);
        }

        // Add all polygones
        $this->_image .= "\n\t\t<!-- polygon data elements -->\n\t\t<g id=\"plist\">\n";
        $this->_image .= implode('', $this->_polygones);
        $this->_image .= "\t\t</g>\n";

        /***** button gradients to defs *****/
        $this->_image .= "\t<linearGradient id=\"b_off\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n";
        $this->_image .= "\t\t<stop offset=\"0\" stop-color=\"#eee\" />\n";
        $this->_image .= "\t\t<stop offset=\"1\" stop-color=\"#ccc\" />\n";
        $this->_image .= "\t</linearGradient>\n";
        $this->_image .= "\t<linearGradient id=\"b_on\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\">\n";
        $this->_image .= "\t\t<stop offset=\"0\" stop-color=\"#ccc\" />\n";
        $this->_image .= "\t\t<stop offset=\"1\" stop-color=\"#eee\" />\n";
        $this->_image .= "\t</linearGradient>\n";
        /**********/

        // End of SVG definition area
        $this->_image .= sprintf("\t</defs>\n\n");

        // Draw background
        $this->_image .= $this->_background;

        // Create container for drawn polygones
        $this->_image .= "\n\t<!-- Container for drawn polygones-->";
        $this->_image .= "\n\t<g id=\"cont\">";
        $this->_image .= "\n\t\t<g id=\"pcont\">";
        $this->_image .= "\n\t\t</g>";
        $this->_image .= "\n\t</g>\n";

        // Add controls for moving and rotating
        $this->_image .= $this->_getControls();

        $this->_image .= "</svg>\n";
        file_put_contents($file, $this->_image);
    }

    public function getSupportedShading()
    {
        return array(Image_3D_Renderer::SHADE_NO, Image_3D_Renderer::SHADE_FLAT);
    }
}

?>
