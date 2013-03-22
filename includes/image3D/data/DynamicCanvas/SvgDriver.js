function SvgDriver_%uid%() {
    this._polygones = new Array();
    this._gradients = new Array();
}

SvgDriver_%uid%.prototype = {
    _svg: "",
    _index: 0,
    _polygones: new Array(),
    _gradients: new Array(),

    _decimal2hex: function( decimal ) {
        var charset = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F"];
        var hex = Array();

        for( var d = decimal; d != 0; d = parseInt( d / 16 ) )
        {
            hex.unshift( charset[ d%16 ] ) 
            
        }
        if ( hex.length == 0 ) 
        {
            hex.unshift( "0" );
        }

        return hex.join( "" );
    },

    _getStyle: function( color ) {
        var rx = ( this._decimal2hex( color["r"] ).length < 2 ) ? "0" + this._decimal2hex( color["r"] ) : this._decimal2hex( color["r"] );
        var gx = ( this._decimal2hex( color["g"] ).length < 2 ) ? "0" + this._decimal2hex( color["g"] ) : this._decimal2hex( color["g"] );
        var bx = ( this._decimal2hex( color["b"] ).length < 2 ) ? "0" + this._decimal2hex( color["b"] ) : this._decimal2hex( color["b"] );

        return "fill: #" + rx + gx + bx + "; fill-opacity: " + color["a"] + "; stroke: none;";
    },

    _getGradientStop: function( color, offset, alpha ) {
    },

    begin: function( x, y ) {
        this._svg += '<?xml version="1.0" ?>\n';
        this._svg += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN"\n';             
        this._svg += '"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n\n';
        this._svg += '<svg xmlns="http://www.w3.org/2000/svg" x="0" y="0" width="' + x + '" height="' + y + '">\n';
    },

    drawPolygon: function( polygon ) {
        var pointlist = ""
        for( var i=0; i<polygon["points"].length; i++ ) 
        {
            pointlist += ( Math.round( polygon["points"][i][0] * 100 ) / 100 ) + "," + ( Math.round( polygon["points"][i][1] * 100 ) / 100 ) + " "; 
        }
        this._polygones.push( "<polygon points=\"" + pointlist.substr( 0, pointlist.length -1 ) + "\" style=\"" + this._getStyle( polygon["colors"][0] )  +"\" />\n" );
    },

    finish: function() {
        this._svg += "<defs></defs>\n";
        this._svg += this._polygones.join( "" );
        this._svg += "</svg>";
        window.location = "data:image/svg+xml;base64," + Base64_%uid%.encode( this._svg ); 
    }
}
