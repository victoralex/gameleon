/**
 * Class to render the given set of polygones
 * Rendering will be done using a specified output driver
 * All further manipulations are based on an event generator
 * which is associated with the renderer
 */
function Renderer_%uid%() 
{
    // Generate sinus and cosinus lookup tables
    this._generateSinCosTables();
}

// Class constants
Renderer_%uid%.EVENT_TRANSLATE = 1;
Renderer_%uid%.EVENT_ROTATE = 2;

Renderer_%uid%.prototype = {
    /**
     * Width of the image
     */
    _imageSizeX: %width%.0,
    /**
     * Height of the image 
     */
    _imageSizeY: %height%.0,

    /**
     * Cos values (0-360 degrees, step 1 ) 
     */
    _cos: Array(),
    /**
     * Sin values ( 0-360 degrees, step 1 )
     */
    _sin: Array(),

    /**
     * Viewpoint used for rendering 
     */
    _viewpoint: 500.0,
    /**
     * Distance used for rendering 
     */
    _distance: 500.0,
    
    /**
     * Output driver which renders the actual data 
     */
    _driver: false,

    /**
     * Event generator to notify the renderer 
     */
    _eventGenerator: false,
    
    /**
     * Generate sinus and cosinus lookup tables for faster access
     */
    _generateSinCosTables: function() {
        var factor = Math.PI*2 / 360;
        this._sin = new Array();
        this._cos = new Array();
        for(var i=0; i<=360; i++) {
            this._sin[i] = Math.sin(factor*i);
            this._cos[i] = Math.cos(factor*i);
        }
    },

    /**
     * Set a driver to use for output rendering
     */
    setDriver: function( driver ) {
        // Delete the old driver class from memory
        delete this._driver;

        // Set the new one
        this._driver = driver;
    },

    /**
     * Return the current used driver 
     */
    getDriver: function() {
        return this._driver;
    },

    /**
     * Set an event generator to listen to 
     */
    setEventGenerator: function( eventGenerator ) {
        // Delete the old event generator to free memory and stop it from notifying the renderer
        if ( this._eventGenerator != false ) 
        {
            this._eventGenerator.detach();
        }
        delete this._eventGenerator;

        // Set new event generator and attach it to this renderer
        this._eventGenerator = eventGenerator;
        this._eventGenerator.attach( this );
    },

    /**
     * Set the viewpoint for rendering 
     */
    setViewpoint: function( viewpoint ) {
        this._viewpoint = viewpoint;
    },
    
    /**
     * Set the distance for rendering 
     */
    setDistance: function( distance ) {
        this._distance = distance;
    },

    /**
     * Compare two polygones by their medium z distance
     * Used for sorting the polygones array
     */
    _sortByMidZ: function( polygon1, polygon2 ) 
    {
        var midZ_polygon1 = 0.0;
        var midZ_polygon2 = 0.0;
        
        for( var i = 0; i<polygon1["points"].length; i++ ) 
        {
            midZ_polygon1 += polygon1["points"][i]["z"];
        }
        midZ_polygon1 = midZ_polygon1 / parseFloat( polygon1["points"].length );

        for( var i = 0; i<polygon2["points"].length; i++ ) 
        {
            midZ_polygon2 += polygon2["points"][i]["z"];
        }
        midZ_polygon2 = midZ_polygon2 / parseFloat( polygon2["points"].length );

        return midZ_polygon2 - midZ_polygon1;
    },

    /**
     * Sort the polygones by their medium z distance
     */
    _sortPolygones: function() 
    {
        polygones_%uid%.sort( this._sortByMidZ );
    },

    /**
     * Apply a specified rotation on all of the polygones
     */
    _rotate: function( rx, ry, rz ) 
    {
        for( var i = 0; i<polygones_%uid%.length; i++ ) 
        {
            for ( var j = 0; j<polygones_%uid%[i]["points"].length; j++ )
            {
                var px = polygones_%uid%[i]["points"][j]["x"];
                var py = polygones_%uid%[i]["points"][j]["y"];
                var pz = polygones_%uid%[i]["points"][j]["z"];

                // Rotate around the z axis
                if ( rz != 0 ) 
                {
                    var x = this._cos[rz] * px + this._sin[rz] * py;
                    var y = -this._sin[rz] * px + this._cos[rz] * py;
                    var z = pz;

                    px = x; py = y; pz = z;                           
                }

                // Rotate around the x axis
                if ( rx != 0 ) 
                {
                    var x = px;
                    var y = this._cos[rx] * py + ( -this._sin[rx] * pz );
                    var z = this._sin[rx] * py + this._cos[rx] * pz;

                    px = x; py = y; pz = z;                           
                }

                // Rotate around the y axis
                if ( ry != 0 ) 
                {
                    var x = this._cos[ry] * px + this._sin[ry] * pz;
                    var y = py;
                    var z = -this._sin[ry] * px + this._cos[ry] * pz;

                    px = x; py = y; pz = z;                           
                }

                polygones_%uid%[i]["points"][j]["x"] = px;
                polygones_%uid%[i]["points"][j]["y"] = py;
                polygones_%uid%[i]["points"][j]["z"] = pz;
            }
        }
    },

    /**
     * Apply a specified translation on all of the polygones
     */
    _translate: function( tx, ty, tz ) 
    {
        for( var i = 0; i<polygones_%uid%.length; i++ ) 
        {
            for ( var j = 0; j<polygones_%uid%[i]["points"].length; j++ )
            {
                polygones_%uid%[i]["points"][j]["x"] = polygones_%uid%[i]["points"][j]["x"] + tx;
                polygones_%uid%[i]["points"][j]["y"] = polygones_%uid%[i]["points"][j]["y"] + ty;
                polygones_%uid%[i]["points"][j]["z"] = polygones_%uid%[i]["points"][j]["z"] + tz;
            }
        }
    },


    /**
     *  A new event has been occured
     */
    notify: function( event, data ) {
        switch ( event ) 
        {
            case Renderer_%uid%.EVENT_TRANSLATE:
                this._translate( data[0], data[1], data[2] );
            break;
            case Renderer_%uid%.EVENT_ROTATE:
                this._rotate( data[0], data[1], data[2] );
            break;
        }
        this.render();
    },

    /**
     * Calculate screen coordinates for every polygon and render it 
     */
    render: function() {
        // Begin output
        this._driver.begin( this._imageSizeX, this._imageSizeY );

        // Sort all polygones by their Z-Order
        this._sortPolygones();
        
        // Draw the background
        this._driver.drawPolygon( { points: [ [ 0, 0 ], [ this._imageSizeX, 0 ], [ this._imageSizeX, this._imageSizeY ], [ 0, this._imageSizeY ] ], colors: [ %background%, undefined, undefined ] } );

        // Calculate screen coordinate for every polygon point and send it to the driver for drawing
        for( var i = 0; i<polygones_%uid%.length; i++ ) 
        {
            var screenCoords = new Array();
            for ( var j = 0; j<polygones_%uid%[i]["points"].length; j++ ) 
            {
                screenCoords.push( 
                    [ 
                        this._viewpoint * polygones_%uid%[i]["points"][j]["x"] / (polygones_%uid%[i]["points"][j]["z"] + this._distance) + this._imageSizeX/2,
                        this._viewpoint * polygones_%uid%[i]["points"][j]["y"] / (polygones_%uid%[i]["points"][j]["z"] + this._distance) + this._imageSizeY/2
                    ]
                );
            }
            this._driver.drawPolygon( { points: screenCoords, colors: polygones_%uid%[i]["colors"] } );
        }

        // Tell the driver to finish his work
        this._driver.finish();
    }
}
