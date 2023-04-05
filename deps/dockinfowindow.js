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
        this.windowsOut = [];
        
        this.tmpCounter = 1000;
        
        
        
        
    }
    
    getAbsoluteClientRect () {
        this.div = document.getElementById(this.divId);
        var o = cumulativeOffset(this.div);
        if (!o || !o.left || !o.top) {
            return undefined;
        }
        var p = this.getBoundingClientRect();
        return {
            left: o.left,
            top: o.top,
            right: p.right + (o.left - p.left),
            bottom: p.bottom + (o.top - p.top),
            width: p.right - p.left,
            height: p.bottom - p.top,
        };
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
                $.extend(true, {
                    processMovement: false,
                    listeners: {
                        move: function (theWin, x, y, op) {
                            if (!theWin.processMovement) {
                                return;
                            }
                            var i = this.windows.indexOf(theWin);
                            var j = this.windowsOut.indexOf(theWin);
                            if (i >= 0) {
                                this.windows.splice(i, 1);
                                if (j >= 0) {
                                    console.error('Window is not out yet! We will ignore broken window.');
                                    return;
                                }
                                this.windowsOut.push(theWin);
                                console.log('' + theWin.id + 'moved: ', x, y);
                            } else if (j >= 0) {
                                console.debug('Window is out and moved. Good.');
                            } else {
                                console.error('Unknown window:' + theWin.id);
                            }
                        }.bind(this),
                    },
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
            
            var p;
            if ('absolute' == $(document.getElementById(w.id)).css('position')) {
                p = this.getAbsoluteClientRect();
            } else {
                p = this.getBoundingClientRect();
            }
            var h = this.getInfoWindowSizes()[1];
            console.log([p.left, p.top + h * (this.windows.length - 1)]);
            
            w.setPosition(p.left, p.top + h * (this.windows.length - 1)); // TODO: incremented
            
            w.processMovement = true;
        }
        
        
        
        // TODO: animation of positon move to dock
        return w;
    }
    
    // TODO
};



function cumulativeOffset (element) {
    var top = 0, left = 0;
    do {
        top += element.offsetTop  || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while(element);

    return {
        left: left,
        top: top,
    };
};
