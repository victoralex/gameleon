/**
 * Class managing the toolbar with all of the control buttons
 */
function Toolbar_%uid%( container )
{
    // Create the needed ul to hold the toolbar buttons
    this.container = document.createElement( 'ul' );
    this.container.setAttribute( 'style', '-moz-user-select: none;' );
    this.container.style.margin = '0px';
    this.container.style.padding = '0px';
    this.container.style.marginLeft = '8px';
    this.container.style.marginTop = '4px';
    this.container.style.width = ( %width% - 8 ) + 'px';

    // Add the ul to our outer container
    container.appendChild( this.container );
}

Toolbar_%uid%.prototype = {
    container: false,
    buttons: new Array(),
    activeButton: false,

    addButton: function( image, onClick ) {
        var button = document.createElement( 'li' );
        var img = document.createElement( 'img' );
        img.src = image;
        button.innerHtml = image;
        button.appendChild( img );
        button.style.backgroundColor = '#d3d7cf';
        button.style.borderBottom = '1px solid #555753';
        button.style.borderRight = '1px solid #555753';
        button.style.borderTop = '1px solid #eeeeec';
        button.style.borderLeft = '1px solid #eeeec';
        button.style.display = 'block';
        button.style.cssFloat = 'left';
        button.style.height = "24px";
        button.style.width = "24px";
        button.style.padding = "0px";
        button.style.margin = "0px";
        button.style.marginRight = "6px";

        button.addEventListener( 'click', onClick, false );

        this.container.appendChild( button );
        this.buttons.push( button );
        return button;
    },

    activate: function( o ) {
        for( var key in this.buttons ) 
        {
            this.buttons[key].style.borderBottom = '1px solid #555753';
            this.buttons[key].style.borderRight = '1px solid #555753';
            this.buttons[key].style.borderTop = '1px solid #eeeeec';
            this.buttons[key].style.borderLeft = '1px solid #eeeeec';
        }
        o.style.borderBottom = '1px solid #eeeeec';
        o.style.borderRight = '1px solid #eeeeec';
        o.style.borderTop = '1px solid #555753';
        o.style.borderLeft = '1px solid #555753';
        this.activeButton = o;
    }
}
