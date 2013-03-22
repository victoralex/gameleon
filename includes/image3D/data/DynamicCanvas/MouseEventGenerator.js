/**
 * EventGenerator which enables controlling the render by mouse movements
 */
function MouseEventGenerator_%uid%( activateObject, deactivateObject, movementObject ) {
    this._activateObject = activateObject;
    this._deactivateObject = deactivateObject;
    this._movementObject = movementObject;
    this.setControlState( null, MouseEventGenerator_%uid%.CONTROL_TRANSLATE_XY );
}           

// Class constants
MouseEventGenerator_%uid%.CONTROL_TRANSLATE_XY = 1;
MouseEventGenerator_%uid%.CONTROL_TRANSLATE_Z = 2;
MouseEventGenerator_%uid%.CONTROL_ROTATE_XY = 3;
MouseEventGenerator_%uid%.CONTROL_ROTATE_Z = 4;

MouseEventGenerator_%uid%.prototype =  {
    /**
     * The renderer which should be notified 
     */
    _renderer: false,

    /**
     * Dom object to register mousedown event on
     */
    _activateObject: false,
    /**
     * Dom object to register mouseup event on
     */
    _deactivateObject: false,
    /**
     * Dom object to register mousemove event on
     */
    _movementObject: false,

    /**
     * Anonymous function to be called on activation
     * Needed to compensate javascripts strange "this" behaviour
     */
    _activateFunction: false,
    /**
     * Anonymous function to be called on deactivation
     * Needed to compensate javascripts strange "this" behaviour
     */
    _deactivateFunction: false,
    /**
     * Anonymous function to be called on movement
     * Needed to compensate javascripts strange "this" behaviour
     */
    _movementFunction: false,
    
    /**
     * Last captured x mouse position 
     */
    _lastMouseX: 0,
    /**
     * Last captured y mouse position 
     */
    _lastMouseY: 0,
    /**
     * Calculated x offset from the last mouse position
     */
    _mouseXOffset: 0,
    /**
     * Calculated y offset from the last mouse position 
     */
    _mouseYOffset: 0,

    /**
     * Manipulation state 
     */
    _inProgress: false,

    /**
     * Current control state 
     */
    _currentControlState: 0,

    /**
     * Attach to a renderer 
     */
    attach: function( renderer ) {
        // Register events on the appropriate DOM objects
        var self = this;
        this._activateFunction = function( event ) { self._onMouseDown( event ); };
        this._deactivateFunction = function( event ) { self._onMouseUp( event ); };
        this._movementFunction = function( event ) { self._onMouseMove( event ); };
        this._activateObject.addEventListener( 'mousedown', this._activateFunction , true );
        this._deactivateObject.addEventListener( 'mouseup', this._deactivateFunction, true );
        this._movementObject.addEventListener( 'mousemove', this._movementFunction, true );
        // Set the renderer to notify of events
        this._renderer = renderer;
    },

    /**
     * Detach from a renderer 
     */
    detach: function() {
        // Stop notifying the renderer of events
        this._renderer = false;

        // Remove the registered event listeners
        this._activateObject.removeEventListener( 'mousedown', this._activateFunction, false );
        this._deactivateObject.removeEventListener( 'mouseup', this._deactivateFunction, false );
        this._movementObject.removeEventListener( 'mousemove', this._movementFunction, false );
    },

    /**
     * Notify the attached renderer of an occured event 
     */
    _notifyRenderer: function( event, data ) {
        if ( this._renderer != false ) 
        {
            this._renderer.notify( event, data );
        }
    },

    /**
     * Capture any mousemove event
     */
    _onMouseMove: function( event ) 
    {
        var progressOffset = 4;
        var calcOffsetX = 0;
        var calcOffsetY = 0;

        if( !this._inProgress ) 
        {   
            return;
        }

        if ( this._mouseXOffset < progressOffset && this._mouseXOffset > -progressOffset ) 
        {
            this._mouseXOffset += this._lastMouseX - event.clientX;
            calcOffsetX = 0;
        }
        else
        {
            calcOffsetX = Math.round( ( this._lastMouseX - event.clientX ) / progressOffset )
            this._lastMouseX = event.clientX;
            this._mouseXOffset = 0;
        }

        if ( this._mouseYOffset < progressOffset && this._mouseYOffset > -progressOffset ) 
        {
            this._mouseYOffset += this._lastMouseY - event.clientY;
            calcOffsetY = 0;
        }
        else
        {
            calcOffsetY = Math.round( ( this._lastMouseY - event.clientY ) / progressOffset )
            this._lastMouseY = event.clientY;
            this._mouseYOffset = 0;
        }


        if ( calcOffsetX != 0 || calcOffsetY != 0 ) 
        {
            switch ( this._currentControlState ) 
            {
                case MouseEventGenerator_%uid%.CONTROL_TRANSLATE_XY:
                    this._notifyRenderer( Renderer_%uid%.EVENT_TRANSLATE, [ -calcOffsetX * 2, -calcOffsetY * 2, 0 ] );
                break
                case MouseEventGenerator_%uid%.CONTROL_TRANSLATE_Z:
                    this._notifyRenderer( Renderer_%uid%.EVENT_TRANSLATE, [ 0, 0, -calcOffsetY * 2 ] );
                break;
                case MouseEventGenerator_%uid%.CONTROL_ROTATE_XY:
                    this._notifyRenderer( Renderer_%uid%.EVENT_ROTATE, [ calcOffsetY < 0 ? -calcOffsetY * 2 : 360 - calcOffsetY * 2, calcOffsetX < 0 ? 360 - -calcOffsetX * 2 : calcOffsetX * 2, 0 ] );
                break;
                case MouseEventGenerator_%uid%.CONTROL_ROTATE_Z:
                    this._notifyRenderer( Renderer_%uid%.EVENT_ROTATE, [ 0, 0, calcOffsetX < 0 ? 360 - -calcOffsetX * 2 : calcOffsetX * 2 ] );
                break;
            }
        }
    },
    
    /**
     * Capture any mousedown event
     */
    _onMouseDown: function( event ) 
    {
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._inProgress = true;
    },

    /**
     * Capture any mouseup event 
     */
    _onMouseUp: function( event ) 
    {
        this._inProgress = false;
    },

    /**
     * Set the specified control state and change the control
     * representation appropriatly
     */ 
    setControlState: function( event, state ) 
    {
        this._currentControlState = state;
    }

}
