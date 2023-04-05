'use strict';

class DockInfoWindow {
    /**
      * Constructor of DockInfoWindow.
      * dockDivId - id of target dock div.
      * InfoWindow - class to display information movable window,
      *   which we can drop to dock div.
    */
    constructor (dockDivId, InfoWindow) {
        this.divId = dockDivId;
        this.Window = InfoWindow;
        this.windows = [];
        
        this.tmpCounter = 1000;
        
        if (!this.divId || !this.Window) {
            throw new Error('Wrong input for DockInfoWindow');
        }
        
        
    }

    /**
      * Add/create InfoWindow
      */
    add (params) {
        var w = null;
        try {
            this.windows.push(w = new this.Window(
                $.extend({
                    /*move: function (theWin, x, y, op) {
                        if (this.tmpCounter > 0) {
                            if (x != 0 || y != 0) {
                                theWin.setPosition(0, 0);
                            }
                            --this.tmpCounter;
                        }
                    },*/
                },
                params))); // TODO identifying to disable duplicates
        } catch (e) {
            console.debug('wrong params: ', params);
            params = null;
        }
        if (!params) {
            throw new Error('InfoWindow must have correct params');
        }
        if (!!w) {
            w.show();
            
            w.setPosition(0, 0);
        }
        
        
        
        // TODO: animation of positon move to dock
        return w;
    }
    
    // TODO
};

