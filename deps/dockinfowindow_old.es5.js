"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var DockInfoWindow = (function () {
    /**
      * Constructor of DockInfoWindow.
      * dockDivId - id of target dock div.
      * InfoWindow - class to display information movable window,
      *   which we can drop to dock div.
    */

    function DockInfoWindow(dockDivId, InfoWindow) {
        _classCallCheck(this, DockInfoWindow);

        this.divId = dockDivId;
        this.Window = InfoWindow;
        if (!this.divId || !this.Window) {
            throw new Error("Wrong input for DockInfoWindow");
        }

        this.divId = this.divId.trim();
        if (0 === this.divId.indexOf("#")) {
            this.divId = this.divId.substring(1);
            if (this.divId.trim() !== this.divId) {
                throw new Error("Spaces here is error");
            }
        }
        if (0 === this.divId.indexOf(".")) {
            throw new Error("You need id selector instead of class selector");
        }

        this.div = document.getElementById(this.divId);
        if (!this.div) {
            throw new Error("Target DockInfoWindow div not found: #" + this.divId);
        }

        this.windows = [];
        this.windowsOut = [];

        this.tmpCounter = 1000;
    }

    _createClass(DockInfoWindow, {
        getAbsoluteClientRect: {
            value: function getAbsoluteClientRect() {
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
                    height: p.bottom - p.top };
            }
        },
        getBoundingClientRect: {
            value: function getBoundingClientRect() {
                this.div = document.getElementById(this.divId);
                return this.div.getBoundingClientRect();
            }
        },
        getInfoWindowSizes: {
            value: function getInfoWindowSizes() {
                var w = this.windows[this.windows.length - 1];
                var e = document.getElementById(w.id);
                if (!w || !e) {
                    return [0, 0];
                } else {
                    return [e.clientWidth, e.clientHeight];
                }
            }
        },
        refresh: {
            value: function refresh() {
                var allInfoWindows = arguments[0] === undefined ? false : arguments[0];
                var focusedWindow = arguments[1] === undefined ? null : arguments[1];

                if (allInfoWindows) {
                    this.windows = this.windows.concat(this.windowsOut);
                    this.windowsOut = [];
                }

                var focusedIndex = !focusedWindow ? -1 : this.windows.indexOf(focusedWindow);
                focusedWindow = focusedIndex >= 0 ? this.windows[focusedIndex] : null;
                if (!!focusedWindow) {
                    this.windows.splice(focusedIndex, 1);
                    this.windows.unshift(focusedWindow);
                }

                for (var i = 0; i < this.windows.length; ++i) {
                    var w = this.windows[i];
                    this.refreshWindowPosition(w);
                }
            }
        },
        refreshWindowPosition: {
            value: function refreshWindowPosition(w) {
                /////
                var n = this.getInfoWindowNumber(w);
                w = this.getInfoWindow(w);
                w.show();
                if (n < 0) {
                    return;
                }

                var p = undefined;
                if ("absolute" == $(document.getElementById(w.id)).css("position")) {
                    p = this.getAbsoluteClientRect();
                } else {
                    p = this.getBoundingClientRect();
                }
                var h = this.getInfoWindowSizes()[1];

                var posBegin = w.getPosition() || [0, 0];
                animateByJS(document.getElementById(w.id), (function (e, k, rest) {
                    var w = this.getInfoWindow(e);
                    if (!w) {
                        return;
                    }
                    var processMovementOld = w.processMovement;
                    if (w.processMovement) {
                        w.processMovement = false;
                    }
                    w.setPosition(posBegin[0] + (p.left - posBegin[0]) * k, posBegin[1] + (p.top + h * n - posBegin[1]) * k); // TODO: incremented
                    if (0 === rest || processMovementOld) {
                        w.processMovement = true;
                    }
                }).bind(this));
                /////
            }
        },
        getInfoWindowNumber: {
            value: function getInfoWindowNumber(idOrElOrW) {
                if (Array.isArray(idOrElOrW) || idOrElOrW == "") {
                    throw new Error("Must not be empty or array");
                }
                if (!idOrElOrW.length && !!idOrElOrW.id) {
                    idOrElOrW = idOrElOrW.id;
                }
                if (idOrElOrW.length > 0) {
                    idOrElOrW = document.getElementById(idOrElOrW);
                }
                if (!idOrElOrW || !idOrElOrW.id) {
                    return NaN;
                }
                for (var i = 0; i < this.windows.length; ++i) {
                    if (this.windows[i].id == idOrElOrW.id) {
                        return i;
                    }
                }
                for (var i = 0; i < this.windowsOut.length; ++i) {
                    if (this.windowsOut[i].id == idOrElOrW.id) {
                        return -i - 1;
                    }
                }
                return NaN;
            }
        },
        getInfoWindow: {
            value: function getInfoWindow(idOrElOrW) {
                var n = idOrElOrW === parseInt(+idOrElOrW) ? idOrElOrW : this.getInfoWindowNumber(idOrElOrW);
                if (n >= 0) {
                    return this.windows[n];
                } else if (n < 0) {
                    return this.windowsOut[-1 - n];
                } else {
                    return null;
                }
            }
        },
        closeAll: {
            value: function closeAll() {
                var allWindows = [].concat(this.windows, this.windowsOut);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = allWindows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var w = _step.value;

                        w.close();
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                            _iterator["return"]();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                this.windowsOut = [];
                this.windows = [];
                this.refresh(false);
            }
        },
        add: {

            /**
              * Add/create InfoWindow
              */

            value: function add(params) {
                var w = null;
                try {
                    w = new this.Window($.extend(true, {
                        processMovement: false,
                        listeners: {
                            move: (function (theWin, x, y, op) {
                                if (!theWin.processMovement) {
                                    return;
                                }
                                var i = this.windows.indexOf(theWin);
                                var j = this.windowsOut.indexOf(theWin);
                                if (i >= 0) {
                                    this.windows.splice(i, 1);
                                    if (j >= 0) {
                                        console.error("Window is not out yet! We will ignore broken window.");
                                        return;
                                    }
                                    this.windowsOut.push(theWin);
                                    this.refresh(false);
                                    console.log("" + theWin.id + "moved: ", x, y);
                                } else if (j >= 0) {
                                    console.debug("Window is out and moved. Good.");
                                } else {
                                    console.error("Unknown window:" + theWin.id);
                                }
                            }).bind(this),
                            beforeclose: (function (theWin, op) {
                                var n = this.getInfoWindowNumber(theWin);
                                if (n >= 0) {
                                    this.windows.splice(n, 1);
                                } else if (n < 0) {
                                    this.windowsOut.splice(-1 - n, 1);
                                }
                                this.refresh(false);
                            }).bind(this) } }, params, {
                        tools: [{
                            type: "refresh",
                            tooltip: null,
                            handler: (function (event, toolEl, panel) {
                                console.log("!!!resresh 7");
                                if (panel.id.endsWith("_header")) {
                                    var idTmp = panel.id.split("_header")[0];
                                    var n = this.getInfoWindowNumber(idTmp);
                                    var w = this.getInfoWindow(n);
                                    this.refresh(n < 0, w);
                                } else {
                                    throw new Error("Unknown refresh click: " + panel.id);
                                }
                            }).bind(this) }]
                    })); // TODO identifying to disable duplicates

                    if (!this.isOpenedAlready(w)) {
                        this.windows.unshift(w);
                        w.show();
                    } else {
                        w = null;
                    }
                } catch (e) {
                    console.debug("wrong params: ", params, e);
                    params = null;
                }
                if (!params) {
                    throw new Error("InfoWindow must have correct params");
                }
                if (!!w) {
                    this.refreshWindowPosition(w); // one new
                    this.refresh(); // all
                }

                return w;
            }
        },
        isOpenedAlready: {
            value: function isOpenedAlready(otherW) {
                // it is dependant of InfoWindow style formatting
                if (!this.windows.length && !this.windowsOut.length) {
                    return false;
                }
                var allWindows = [].concat(this.windows, this.windowsOut);
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = allWindows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var w = _step.value;

                        if (w === otherW || w.getEl().dom == otherW.getEl().dom || $(w.getEl().dom).find("strong").html() == $(otherW.getEl().dom).find("strong").html() && $(w.getEl().dom).find("a:contains(View full university profile)")[0].href.split("year=")[0] == $(otherW.getEl().dom).find("a:contains(View full university profile)")[0].href.split("year=")[0]) {
                            return true;
                        }
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator["return"]) {
                            _iterator["return"]();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return false;
            }

            // TODO: getter ??

        }
    });

    return DockInfoWindow;
})();

;

function cumulativeOffset(element) {
    var top = 0,
        left = 0;
    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);

    return {
        left: left,
        top: top };
};

function sleep(ms) {
    return new Promise(function (resolve) {
        return setTimeout(resolve, ms);
    });
}

function animateByJS(element, funcOrStyle) {
    var timeout = arguments[2] === undefined ? 500 : arguments[2];
    var ticks = arguments[3] === undefined ? 50 : arguments[3];
    var isFunction, delta, r, restTime, k;
    return regeneratorRuntime.async(function animateByJS$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                isFunction = function isFunction(value) {
                    return !!value && !/^\s*class/.test(value.toString()) && (Object.prototype.toString.call(value) === "[object Function]" || "function" === typeof value || value instanceof Function);
                };

                if (!(!element || !funcOrStyle)) {
                    context$1$0.next = 3;
                    break;
                }

                throw new Error("element and funcOrStyle are required to animate");

            case 3:
                timeout = parseInt(+timeout);
                ticks = parseInt(+ticks);

                if (!(isNaN(timeout) || isNaN(ticks) || timeout <= 9 || ticks <= 9 || timeout <= ticks)) {
                    context$1$0.next = 7;
                    break;
                }

                throw new Error("If you want custom timeout or ticks they must be positive integer numbers (timeout more ticks and both more 9)");

            case 7:
                if (ticks > 500) {
                    ticks = 500;
                }
                if (timeout <= ticks) {
                    timeout = ticks * 10;
                    console.log("[WARN] Greate timeout, because of wrong input. Ticks must not be more 500 (usually 50).");
                }

                delta = parseInt(timeout / ticks);
                r = timeout % ticks;

                if (r > 0) {
                    ticks += 1;
                }
                if (ticks * delta == timeout) {
                    r = 0;
                }

                if (!isFunction(funcOrStyle)) {
                    context$1$0.next = 32;
                    break;
                }

                restTime = timeout;
                k = 0;
                k = 0;

            case 17:
                if (!(k < ticks - 1)) {
                    context$1$0.next = 25;
                    break;
                }

                restTime -= delta;
                funcOrStyle(element, (timeout - restTime) / timeout, restTime);
                context$1$0.next = 22;
                return sleep(delta);

            case 22:
                ++k;
                context$1$0.next = 17;
                break;

            case 25:
                restTime -= delta;
                if (restTime <= 0) {
                    restTime = 0;
                }
                if (restTime !== 0) {
                    console.error("Wrong rest time: ", restTime);
                }
                restTime = 0; //
                funcOrStyle(element, (timeout - restTime) / timeout, restTime);
                context$1$0.next = 33;
                break;

            case 32:
                // TODO
                $(element).animate(funcOrStyle, timeout, function () {}); // TODO

            case 33:
            case "end":
                return context$1$0.stop();
        }
    }, null, this);
}
/* complete */
