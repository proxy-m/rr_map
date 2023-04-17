'use strict';

class UnivDataService {
    /**
     * Singleton constructor of UnivDataService.
     * 
     */
    constructor () {
        if (!!UnivDataService._instance) {
            return UnivDataService._instance;
        }
        this.forceFull = false;
        this.url = null;
        this.requestAjax = null;
        
        
        
        
        UnivDataService._instance = this;
    }
    
    getInstance () {
        return (!!UnivDataService._instance) ? UnivDataService._instance : new UnivDataService();
    }
    
    setStateURL (url, forceFull) {
        this.forceFull = !!forceFull;
        this.url = '' + url + (!forceFull ? '&mode=head' : '');
        return this.url;
    }
    
    getStateURL () {
        return this.url;
    }
    
    request () {
        this.requestAjax = $.ajax({
            "url": this.url, 
            "method": 'GET', 
            'sync': false,
        });
        return this.requestAjax;
    }

};

class UnivDataController {
    constructor (udtService) {
        if (!udtService) {
            this.udtService = null;
            throw new Error('[ERR] No udtService!');
        }
        this.udtService = udtService;
    }
    
    setForceFull (forceFull) {
        this.forceFull = forceFull;
        return this.forceFull;
    }
    
    getForceFull () {
        return this.forceFull;
    }
    
    setState (state) {
        if (!(state instanceof Object)) {
            return null;
        }
        this.state = 1; // 1 - good, 0 - stop, 2 - warn, 3 - later promise, 4 - later repeat, 5 - method required, 9 - log, -900 .. -2 - error, -1 - unknown error
        $.extend(this, state); //this = $.extend(this, state);
        
        if (!this.forceFull && window.location.hash && window.location.hash.length > 2) {
            this.subject = 1;
            this.country = 0;
            this.region = 0;
            
            $('.mfilter-subject select option:selected').val(this.subject);
            $('.mfilter-country select option:selected').val(this.country);
            $('.mfilter-region select option:selected').val(this.region);
        }
        
        if (this.forceFull && !(this.subject == 1 && this.country == 0 && this.region == 0)) {
            this.forceFull = false;
            this.code = 0;
            //return;
        }
        
        
        if (0 !== this.code && this.udtService.getStateURL() == this.udtService.setStateURL('/final/getunivdata_gmap23.php?year='+this.year+'&subj='+this.subject+'&cntr='+this.country+'&reg='+this.region, this.forceFull)) {
            this.code = 0;
            //return;
        } else {
            this.promise = this.udtService.request();
        }
        
        return {
            code: this.code,
            year: this.year,
            subject: this.subject,
            country: this.country,
            region: this.region,
        };
    }
    
    getPromise () {
        return this.promise;
    }
    
};
