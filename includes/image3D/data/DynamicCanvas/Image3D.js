Image3D_%uid% = {
    container: false,
    canvas: false,
    controlOverlay: false,
    toolbar: false,
    bodyElement: false,
    mouseEventGenerator: false,                

    init: function() 
    {
        Image3D_%uid%.container = document.createElement( 'div' );
        Image3D_%uid%.canvas = document.createElement( 'canvas' );
        Image3D_%uid%.controlOverlay = document.createElement( 'div' );
        Image3D_%uid%.container.style.position = "relative";
        Image3D_%uid%.container.style.width = %width% + "px";
        Image3D_%uid%.container.style.height = %height% + "px";
        Image3D_%uid%.canvas.style.position = "absolute";
        Image3D_%uid%.canvas.style.top = "0px";
        Image3D_%uid%.canvas.style.left = "0px";
        Image3D_%uid%.canvas.style.width = %width% + "px";
        Image3D_%uid%.canvas.style.height = %height% + "px";
        Image3D_%uid%.canvas.width = %width%;
        Image3D_%uid%.canvas.height = %height%;
        Image3D_%uid%.controlOverlay.style.position = "absolute";
        Image3D_%uid%.controlOverlay.style.top = "0px";
        Image3D_%uid%.controlOverlay.style.left = "0px";
        Image3D_%uid%.controlOverlay.style.width = %width% + "px";
        Image3D_%uid%.controlOverlay.style.height = %height% + "px";
        Image3D_%uid%.toolbar = new Toolbar_%uid%( Image3D_%uid%.controlOverlay );

        // Create a new MouseEventGenerator
        var bodyElement = document.getElementsByTagName( "body" );
        Image3D_%uid%.bodyElement = bodyElement[0];
        Image3D_%uid%.mouseEventGenerator = new MouseEventGenerator_%uid%( Image3D_%uid%.controlOverlay, Image3D_%uid%.bodyElement, Image3D_%uid%.bodyElement );
        
        // Create the needed toolbar buttons
        Image3D_%uid%.toolbar.activate( 
            Image3D_%uid%.toolbar.addButton( 
                'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAUwwAAFMMBFXBNQgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAALHSURBVEiJrZU9aBRBFMd/s0lIiJdCMaiFYKyE4G5zexsEURFFkYAfIGJjo4UoWFxMTvJhzMflLjEEhWipIKLYGDURGysRHQbRaS2MdmIgGhEhYm4sMhvXc+88NQ+OvTc78/vPe/PmrTDGUKl5fjAEfNZKDlW6xvlLeAbIen7QtawCEXho/Z4fnF8WgSJ4Drhq//d6ftD3XwJF8EGt5DngVESk2/ODwX8S8PygCthk3X6tZBeAVtIUibR6fpAoqWCM+e3nJlPr7LPGTaYOl5gj3GTqnJtMNVo/ETdPFJepTctxYJdW8lW58CNr1gCPgQc2jfEpiuR8NXCwEri1Y0AzkLGMJVuKoOhAR+caD9wUgmvCmPEqmPiO8wgKk0aIJgEb+Dq/mxV12zAmL4wZaJiZaAHSdn0ujMSJgY9oJdvePsy8NDBjhOhbEE4GYTZXFcQNDNeBrdTXnjSmMAAmUZ/4dl8r2QaMWMZSJMJNpqLwYa1kRxjexr1Z1zjOS7uRy9NTmTMATfvyd8HsAepA7J+e6rgXSXMeaA8jcYC5SMoaPD8QoeMUzEfgm3XfhuMFYdJALfCkCC6Ahgjvk6OVzAGdduAkMB6KLFQ7OUAAz4Hu9XvGVgG8m8y8MbAgEK+L4OOWAdCulcw7AFrJLNAVFWlqzW4BcRS4UhCcBlZWVc9fIMZi4Ge1kiMQKVOt5CDQE4qsmH12CIcd1Wa+991k5gWYFlMwt5fSh9hJQYSHeiICT2slL4bz4i5aD3AE2K6V/BC345gIaoBbwFOt5NgvL0u0gYR9rnWTqfYyrSLnJlNu6FfUKiK7SgCKxYY3aus8fBfN+SzQrJV8H8cp2U21kl+AO9ZNe34wHAMHuFQKDjFnEBNJH9Bt3WEW6zyE92gl+8ut/6OAFRng510JrctWXlmr6JtsPzbZyFBnJXCoMILQbAObs7e/IvsBkv5/BeJknOEAAAAASUVORK5CYII=',
                function( event ) 
                {
                    Image3D_%uid%.mouseEventGenerator.setControlState( event, MouseEventGenerator_%uid%.CONTROL_TRANSLATE_XY );
                    Image3D_%uid%.toolbar.activate( this );
                }
            )
        );
        Image3D_%uid%.toolbar.addButton( 
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAUwwAAFMMBFXBNQgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKDSURBVEiJrZU9aBRBFIC/2btoc2k0onYqKYTgbnN722ohiqiFiNjZaBGi1ZmfMz9Kfi5nLhpEQnobg9gpsbK0GKZxaiFYpAgWxogoMbmMxc2Gybp3rpoHw+6bee97+97OvBHGGLJKEEbTwFet5HRWH+8v4UNANQijkT0N4MBjmQjC6P6eBEjAa8CCfX8QhNH4fwVIwKe0khWgzwkyGoTR1D8FCMIoB5y06oRWcgRAK2kSQS4FYVRoGcEY89vwi6Wj9tnhF0vXWtgIv1iq+MXSIasX0uxEcpvastwEzmol37dL3/E5DLwFXtkyppfIqXkXcCUL3MoNoAcYsowd2ckg8UMfaSXvxkbd52vdjRwvXUdjROXj0uAb5+NmgbJVa3EmXgq87sIBhGfWQSw2B13AKYFYc22sT92qO5kIv1hy4TNaycFWdThxoXbbCJ4KYfqXX1dm02yCMHoIDMSZeMC6s94ZhJFIczx2sXpmWzAHPGsDF0CnM/VFGGMIwugeEB+YBaDP7vcm/PLkcbGVVwhWRH77nPE2N/IbB358WLqzkYDPA712akArWfcAtJJVIG5gvcC8m4nXyF9FcBAIzJa3ys/9a5t8L7eB92sl6wD52EgrORWEkQeMW8MVoArgbTUWG/tyyi1HTrDsqLcceFkr+TheSDtoY8B14LRW8hMZJAijDuA58E4rObdrsUUbKNjnEb9YGmjTKmp+seTHeqZW4XxVAVA0G96ug5eo+WegRyu5msZp2U21kt+AF1YtB2E0kwIHeNIKDin/ICWTcWDUqjM093kMH9NKTrTz/2MAG2QSGE5Mj2gl2142kPFOtpdN1ZkazgKHjBnEYhvYulayltXnF0ETY0N5irsxAAAAAElFTkSuQmCC',
            function( event ) 
            {
                Image3D_%uid%.mouseEventGenerator.setControlState( event, MouseEventGenerator_%uid%.CONTROL_TRANSLATE_Z );
                Image3D_%uid%.toolbar.activate( this );
            }
        );
        Image3D_%uid%.toolbar.addButton( 
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAUwwAAFMMBFXBNQgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAPmSURBVEiJtZVdbFNlGMd/zznbWrqJCdkFuJisMqPJas/CTj9YMKEhIgwQg+K1KGq8MTFeWLxw4MWYEcFA/P64Nhr87qYsZFEjtqeDrdskJoNsiVEvFsc2t46t7Xm8GG0Krhsk+r98n+f5/Z//m5zziqryf6pqpaKISCAcbpWC7hAxdmSn/to2Ojq6YIUjZ9XljGD0Dp1PDugKW0qlmhWKPgp6ClhfPJup860Z6+u7aoUiZUP6B5jPZtI/f3VTBpZl1WqN96TAE0sd/CiududN6RlJpTIA97VGg4ahu4HdwOYlH3mf3PzzmUxmrqKBZVm11HhTQDMwgeiTGcf5ulJ8gGAoulfQD4B64BcWr0bKTYzrumu8x4BmhGRBNLgaHGAonfyyWgtBhCTQjMf7xrIJgqHQTsHoBial2gwOnjv3+2rwctm2vSEn5hBQLwb7BlOpz69LIGq8BSAGB28VDtDf3/+noTwOoC5vi4hRStASDjerygjohUzaaQWQxz41GycuVo9vZVE7Oty72095PHWTujC7Tjx1kzrySceiCNK49YinEfJ9fR15gJZQ5CeFNkM0POA46aUErjwIoGIkihttnLnsx+eZaXQ8bzbt6GrKy1w2O1dzPC/Zj+fmPFP+Xa+t9+88ehCfZ37M59lbnFNIALgq20tXpMJmYFpcKRlc+jZ+SVXfAQ4UTI6pkDXy1a+4oi8szeUPuyIvA9+PJ+Kni3MFgwQwjRAtXVEl3fPQ6/ULbm5MlDrg8FgifgTAv6urEzgEuKrY493xgUoMAyAQCNT4YzHvjcWc5htE8QEIcmfxvDa70AnkUL5ZDu6PxbyBQKCmZGD6ak+vnc3OByIRq7xRXU6gXBHkQ0UP3LXnVQtgpK9jFsgjTN0It+zNkbWz2XlzTV2iZCAuZwCqCrqztEX70YdBYyraWW1WxYFZdfV4pasoSdxrDF1iArgUegUTNaQd6AIY6z70BSBlo7eXc8YScd9yfIV2AQzR3lKCof7+X4HLKPdb4fCeVbesICsUfUQgBPw2mE5nSgZL0fQZQFH5yLbtDbcK37Rpyx2g7wEqLk8V34iSQcZxzqJ6EqjPGeZnLW1tDTcLb2lrayhU5U4D61A9OXg+9V2xdt3fdOa22jgwgBLVfGE4aEf2rwYP2pH9mi8Mo0RBnOz0lRfL6//60PyxmHft33NdiDwHiCgZ15AecHuGHOcHgBY7ukVx2wVpV8ECVOHE/NTkS6OjowsrGhRlhcPbUHkX2FhKuNyTqYy7Ik8Pp5O9y3EqPvoZxzkLNAVt+14D8wE12F47MeFeK3cjcsY06L2QTF6sxFgxwX+lfwBl/7JL8gMxeQAAAABJRU5ErkJggg==',
            function( event ) 
            {
                Image3D_%uid%.mouseEventGenerator.setControlState( event, MouseEventGenerator_%uid%.CONTROL_ROTATE_XY );
                Image3D_%uid%.toolbar.activate( this );
            }
        );
        Image3D_%uid%.toolbar.addButton( 
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAUwwAAFMMBFXBNQgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANkSURBVEiJtZXNT5xVFMZ/574DTKGyaEi0kkZIXWiYzjsp73ww6cJJY20JVaPWtbFa48bEFdWNX2msiYkGkxq18R9Q2vgxgExIE01wZqCFAetmVJoYdYHWUoEpwtzjgs4I+DJQo8/ynOc8zz25OeeIqvJ/IlArKSISisU6payHRczhxWu/HSwWi0tuLD6ilmHBZKYuZie0xitls5wbTTwG+g5wRyV2fWfjjpkLF2640fiaIv0ZnGcLY19/ui0D13WbtD7YJ/DkKoOvxOrAiiOD3+RyBYB9nYmwMdoD9ABdqz7yAcul5wuFwsKmBq7rNlEfzAEdwCyixwv5/GebtQ8QjiYeEvQs0AJc5s8b8bUmZh27Pvgm0IGQLYuGtxIHmBrLflKn5TBCFuigIfi2bwfhaPSIYAaAq1LnhCdHR3/aSnwtPM/bvSzOFNAihkcmc7nz6zoQNWcAxPDUrYoDjI+P/2KUJwDU8q6ImKpBJBbrQGgDvVRx/jeYGM+lBUaB2yPRaCdU5sDKAwiomLRf4Z6jp1oD1unfEH55Jn1yaCNXIQ0krcohYMwAqNAFzIkVXwOjziIwBAwptAIxY2Xej1s2pIE5hATUGDQ/tPW8flxUziLy0sznva9up8YAhEKh+vZUKlhb/I2kqJwBOXcl3ftaLW57KhUMhUL1VQOnsam/eX6xFIrHXb+CPUdPtYpqP/D9coM90XbfKw3y+EeOH9f1uuLN84slZ8fOdNVALMMAgbIe8StybOBhVnfSvXVL8iuNDaX2hR9e8H2+2JsauqoJYClnBAc10g2c3lhjA3LesXp5fXBlxk9foVsAI5qBNZ/sRuPfAXsRfXA7K8IPbjTxKOjHwI9T4/m7VFX/3kWizwCKyoee5+2+VfH9+w/cCfo+oGJ5unIjqgaFfH4E1T6gZdk45yLJZOt2xSPJZGs5sNwP7EK1b/Ji7otKbt02vX5b00lgAiWhK+XpsBc/tpV42Isf05XyNEoCJL8493vv2vw/Bq09lQo2/7FwGpHnABGlYI0Mgh2cyue/BIh4iQOK7RakWwUXUIW3SteuvlgsFpdqGlTgxmIHUXkP2Fvt0O9kKlesyInpsWzGT2fTo1/I50eAu8Oed4/BuV8Nh5pmZ+3N9AAiw44hcymb/XYzjZod/Ff4C3BLaHc8XLxLAAAAAElFTkSuQmCC',
            function( event ) 
            {
                Image3D_%uid%.mouseEventGenerator.setControlState( event, MouseEventGenerator_%uid%.CONTROL_ROTATE_Z );
                Image3D_%uid%.toolbar.activate( this );
            }
        );
        Image3D_%uid%.toolbar.addButton( 
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAUwwAAFMMBFXBNQgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAKYSURBVEiJtZRPSFRRFIe/8+Zppi2KoiiCojSEyKmcZhISE4Ig3UQFQS2iTaVWq1CjsEXQH2whZdKuCIRatAg1aBOtauZJqIsWRSkZFET0hwqdZubXoiZnpueUpgfe4p7z3vedc3n3miRmM1yA9ZHITiVVk1s0U/eA58XyATaEw5tSKfbl5oXFhvqj3S6AkqrB7Hg2na5Bz/P+1uGA5/VXVEYOYGrIbo4bQLfj+5XRNeTFGvUP+ydJg/2PGw11+tX/FEwBnhkDXqzJ4Ep+wTThE5LoUcFlf8F/wtMx5EWPIXX8TkgiGAqFAZPETD3BysgWST+hsxlu5qJ0e/vipJu4+2v5Fbg53NtyfVXd+R6Mjy97Wvavqr+wX1KTq5KasXkJJ/At3mFSBPhk4uzLvpb7mcysCcp2XFyesNQoRh+iCNgaSLhLk25iAFiK2AtagdmFRMmcYvfLeBfGXuAaqA7MRkpWr9HtPck00/8cSKOg54CjOcmiiXa4iFlxxpv1YPdcjZ82nIMSu1e+e1qQifIXYIeAPZK1v7jb/OpX8h6wCDgMUPghXogxH/T2u1NULfTQjCeBkoLSvwpknBrubV040td8YiLJqGHngCUA8QWFceAZUOt+Twwha/BjTTKBf+jbWDvY8EQjdgIoS7qBV5iugmJjhfYmj2DuOxxqA47dzAI72uWYLg0/aBtLmbbhUPt67efxkZ7mXnNTy5RSHWjzSDhe9fpO6/vsriTWVVaWz+Qhk8TajVWlkn5OYDiHg5siZ6ayXfkiGAofcZ3EydwtapsJSTAUPoJZp8ycXMF/S9JwwNI5v79oWhI/+GSCKUsmg0P6sjN7AnYrp1YeDFVFBvsfRfPBK0KhcrNANdjtrEIqFQVm/7r+AbMwjQnKOMtVAAAAAElFTkSuQmCC',
            function( event ) 
            {
                var oldDriver = Image3D_%uid%.renderer.getDriver();
                Image3D_%uid%.renderer.setDriver( new PngDriver_%uid%() );
                Image3D_%uid%.renderer.render();
                Image3D_%uid%.renderer.setDriver( oldDriver );
                return false;
            }
        );
        Image3D_%uid%.toolbar.addButton( 
            'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAUwwAAFMMBFXBNQgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAALDSURBVEiJtZVfiFR1FMc/33vHGQ0CEbaoxCxWWsictrnOsGDsQxrpRlGvvki9ZKZBuKx/EFsCdX0TXYTeRNpog32IzT8EQi/W7B1ldx8iiNgtMEZMqIdwWefebw825czOrrmuB+7LOfd+Pueee35c2eZhRgbgxVLpLSfubi5KHhqP47GFAJ3F4sY0ZXtz3mhsslIeygA4cTfSh410Tk/EcXyvDsfjuLKhUNqB/H5jc5wBhoKWT4nTk/HYLv+P+dn2ROX7XcKDrepzBfcBvzvG47EPBKcWFiwS/p+kvNtwsrXgAeH1mIzLe7BP/JuwTT6KioBss1RXvlDaZPsO9GFGpjnR/vqR9QnBgMzjmAtT5/cdWrvt2AVbk9Pn+nqf3Xr8OQfpGQcMhDO6lGR9EuiU+d2BDk6P9l2+mzdnixIHg5g2iy9T0fd0z0AXcFNK31F/f+DArwGlIE2uplmfFbwt+AaxTvY9tggA/QwUsF/B7Jge7bssewS0ak2c6zTeLLiy6nrbb8CroOFUfIK93ebdKPp02YIjIjvzEbeXT9vsltjyTM/R7K1k2fCKTO1WaG017k6tY38+dnMlKAeuhqjH4qyA60/cWA1ca/kGEmI29zlOV4SzagcSEayvXtz7F+ii8R7gUWXSkZ/O7b8BVI231EJdAg7MnUaTwMbGFVBvmvWvwEwaJp8BiHQEaAN+mPpq/4//3L9XKApr6TXgCPDt7dncHw1Nt1rTdduOttWkAoTjU1/3VgGeeqP/kaxzReRqXQCw5s3jTwaJO42rv4zuuzIHZpsXCoWOpTxktnn+pa5223dGJIL38htLH7ea4WIiHxV3ZoLaAWj8BoeXQpKPijuRBi0FzYIHltThgOq5Vj+cRUlawecT3LdkPjjUT7J0FfRFU60jH3WVJirflReCb4iiDil8GTTcUEjTMsxzDpYy/gZYSq+GrT8bOwAAAABJRU5ErkJggg==',
            function( event ) 
            {
                var oldDriver = Image3D_%uid%.renderer.getDriver();
                Image3D_%uid%.renderer.setDriver( new SvgDriver_%uid%() );
                Image3D_%uid%.renderer.render();
                Image3D_%uid%.renderer.setDriver( oldDriver );
                return false;
            }
        );

        // Put everything together and add it to the document
        Image3D_%uid%.container.appendChild( Image3D_%uid%.canvas );
        Image3D_%uid%.container.appendChild( Image3D_%uid%.controlOverlay );
        scriptTag_%uid%.parentNode.insertBefore( Image3D_%uid%.container, scriptTag_%uid%.nextSibling );

        // Init a new renderer
        Image3D_%uid%.renderer = new Renderer_%uid%();
        Image3D_%uid%.renderer.setDriver( new CanvasDriver_%uid%( Image3D_%uid%.canvas ) );
        Image3D_%uid%.renderer.setEventGenerator( Image3D_%uid%.mouseEventGenerator );

        // Render the scene for the first time
        Image3D_%uid%.renderer.render();
    }
}
