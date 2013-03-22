Base64_%uid% = {
    charset: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "/" ],

    encode: function( data ) 
    {
        // Tranform data string to an array for easier handling
        var input = Array();                
        for ( var i = 0; i<data.length; i++ ) 
        {
            input[i] = data.charCodeAt( i );
        }

        var encoded = Array();
        
        // Create padding to let us operate on 24 bit ( 3 byte ) chunks till the end
        var padding = 0;
        while ( input.length % 3 != 0 ) 
        {
            input.push( 0 );
            padding++;
        }

        for( var i=0; i<input.length; i+=3 ) 
        {
            encoded.push( Base64_%uid%.charset[ input[i] >> 2 ] );
            encoded.push( Base64_%uid%.charset[ ( ( input[i] & 3) << 4 ) | ( input[i+1] >> 4 ) ] );
            encoded.push( Base64_%uid%.charset[ ( ( input[i+1] & 15) << 2 ) | ( input[i+2] >> 6 ) ] );
            encoded.push( Base64_%uid%.charset[ ( input[i+2] & 63 ) ] );
        }


        // Replace our added zeros with the correct padding characters
        for( var i=0; i<padding; i++ ) 
        {
            encoded[encoded.length-1-i]= "=";                    
        }

        return encoded.join( "" );
    }
}
