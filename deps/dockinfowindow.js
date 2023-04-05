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
        if (!this.divId || !this.Window) {
            throw new Error('Wrong input for DockInfoWindow');
        }
        
        this.divId = this.divId.trim();
        if (0 === this.divId.indexOf('#')) {
            this.divId = this.divId.substring(1);
            if (this.divId.trim() !== this.divId) {
                throw new Error('Spaces here is error');
            }
        }
        if (0 === this.divId.indexOf('.')) {
            throw new Error('You need id selector instead of class selector');
        }
        
        this.div = document.getElementById(this.divId);
        if (!this.div) {
            throw new Error('Target DockInfoWindow div not found: #' + this.divId);
        }
        
        this.windows = [];
        
        this.tmpCounter = 1000;
        
        
        
        
    }
    
    getBoundingClientRect () {
        this.div = document.getElementById(this.divId);
        return this.div.getBoundingClientRect();
    }
    
    getInfoWindowSizes () {
        var w = this.windows[this.windows.length - 1];
        var e = document.getElementById(w.id);
        if (!w || !e) {
            return [0, 0];
        } else {
            return [e.clientWidth, e.clientHeight];
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
            
            var p = this.getBoundingClientRect();
            var h = this.getInfoWindowSizes()[1];
            console.log([p.left, p.top + h * (this.windows.length - 1)]);
            
            w.setPosition(p.left, p.top + h * (this.windows.length - 1)); // TODO: incremented
        }
        
        
        
        // TODO: animation of positon move to dock
        return w;
    }
    
    // TODO
};

