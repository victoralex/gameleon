/**
 * Driver which outputs a png image of the rendering context
 */
function PngDriver_%uid%() {
    // Nothing to do here
}

PngDriver_%uid%.prototype = {
    /**
     * The in-memory canvas element, where the image will be
     * rendered to before it is saved to a png
     */
    _canvasElement: false,

    /**
     * Begin output by creating in-memory canvas to draw to 
     */
    begin: function( x, y ) {
        this._canvasElement = document.createElement( 'canvas' );
        this._canvasElement.width = x;
        this._canvasElement.height = y;

        if ( !this._canvasElement.toDataURL ) 
        {
            window.alert('Sorry your browser does not support export to an image file.');
            throw "Canvas does not support toDataURL";
        }
        this._canvasDriver = new CanvasDriver_%uid%( this._canvasElement );                
    },

    /**
     * Draw a given polygon 
     */
    drawPolygon: function( polygon ) 
    {
        this._canvasDriver.drawPolygon( polygon );
    },
    
    /**
     *  Finish the output process
     */
    finish: function() {
        window.location = this._canvasElement.toDataURL(); 
    }
}
