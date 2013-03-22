/**
 * Output Driver to render into a canvas object
 */
function CanvasDriver_%uid%( canvasElement ) {
    if ( !canvasElement.getContext ) 
    {            
        window.alert( 'Unfortunatly your browser does not support the "Canvas" control.\\nDownload Firefox <http://mozilla.org/firefox> to make the 3D control display in your browser.' );
        throw "Canvas Control not available.";
    }

    this._canvas = canvasElement.getContext( '2d' );
}

CanvasDriver_%uid%.prototype = {
    /**
     * Canvas rendering context 
     */
    _canvas: false,

    /**
     * Create a "rgba" string from a specified color array
     */
    _getRgba: function( color ) 
    {
        if ( arguments[1] != undefined ) 
        {
            color["a"] = arguments[1];
        }
        return "rgba( " + color["r"] + ", " + color["g"] + ", " + color["b"] + ", " + color["a"] + " )";
    },

    /**
     * Starts output by recieving width and height of the image
     * to be rendered 
     */
    begin: function( x, y ) {
        // Nothing to do here
    },

    /**
     * Draw a given polygon into the approriate context
     */
    drawPolygon: function( polygon ) {
        this._canvas.beginPath();
        this._canvas.moveTo( polygon["points"][0][0], polygon["points"][0][1] );
        for ( var j = 1; j<polygon["points"].length; j++ ) 
        {
            this._canvas.lineTo( polygon["points"][j][0], polygon["points"][j][1] );                            
        }
        this._canvas.lineTo( polygon["points"][0][0], polygon["points"][0][1] );
        if ( polygon["colors"][1] == undefined ) 
        {
            // Only one color, means flat shading
            this._canvas.fillStyle = this._getRgba( polygon["colors"][0] );
            this._canvas.fill();                
        }
        else 
        {
            // More than one color. Gauroud shading is used

            // Create the main gradient between the first and the second point
            var mainGradient = this._canvas.createLinearGradient( polygon["points"][0][0], polygon["points"][0][1], polygon["points"][1][0], polygon["points"][1][1] );
            mainGradient.addColorStop( 0.0, this._getRgba( polygon["colors"][0] ) );
            mainGradient.addColorStop( 1.0, this._getRgba( polygon["colors"][1] ) );
            
            // Create the overlay gradient between the third point and the inbetween of the two other points
            var overlayGradient = this._canvas.createLinearGradient( 
                polygon["points"][2][0],
                polygon["points"][2][1],
                ( polygon["points"][0][0] + polygon["points"][1][0] ) / 2.0,
                ( polygon["points"][0][1] + polygon["points"][1][1] ) / 2.0
            );
            overlayGradient.addColorStop( 0.0, this._getRgba( polygon["colors"][2] ) );
            overlayGradient.addColorStop( 1.0, this._getRgba( polygon["colors"][2], 0.0 ) );
            
            // Draw the gradients
            this._canvas.fillStyle = mainGradient;
            this._canvas.fill();
            this._canvas.fillStyle = overlayGradient;
            this._canvas.fill();

            // Delete the gradients to free memory
            delete mainGradient;
            delete overlayGradient;
        }
    },

    /**
     * Finish the output 
     */
    finish: function() {
        // Nothing to do here
    }
}
