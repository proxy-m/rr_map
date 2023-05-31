'use strict';
window.BIG_ZOOM = 14;
//var dt = new Array; // unrequired here
//var tph = '';				//текст массива вузов для typehead
///var tphcord=new Array;	//массив координат поиска
var cordtph=new Array;	//массив координат вузов по поиску
var map=new Object;
var zummap;
var data; // ? unrequired here
//this.dtcntr //var dtcntr=new Array;	//массив данных стран для карт
var n,sv,lftur,hs;

var map=new Object;
var crd = null;
var code = null;

///var dt_world = {};
///var mrks_world = {};
var data;

window.subj = null; // subject
window.yr = null; // year
window.cntr = null; // country
window.reg = null; // region

var coord;
var scale;

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
        this.year = -1;
        this.clearCache();
                
        UnivDataService._instance = this;
    }
    
    toString () {
        return '[object ' + (this.constructor.name || 'Object') + ']';
    }
    
    getInstance () {
        return (!!UnivDataService._instance) ? UnivDataService._instance : new UnivDataService();
    }
    
    clearCache () {
        this.dtWorld = []; // dtWorld (wider) and dt are different
        this.dt = null;    // dt conains only current visible data
        this.dtWorldLegacy = []; // previous state of dtWorld
        this.loadTimes = 0; // 0, 1, 2 times or 3 (many)
        this.fastSearch = {};
    }
    
    setStateURL (url, forceFull, forceFrom, forceTo) { // forceFrom and forceTo indexes always starts from 1 (not from 0)
        this.forceFull = !!forceFull;
        this.url = '' + url + (!forceFull ? '&mode=head' : '');
        
        if (!this.forceFull || !forceFrom || !forceTo || forceFrom <= 0 || forceTo <= 0 || forceTo < forceFrom) {
            forceFrom = undefined;
            forceTo = undefined;
        }
        if (this.forceFull && forceFrom > 0 && forceTo > 0) {
            this.url += '&pos=' + (forceFrom - 1) + '_' + (forceTo - forceFrom + 1);
        }
        this.stateParamsNew = urlToParams(this.url);
        
        
        if ((!!this.stateParamsNew.yr && this.year != +this.stateParamsNew.yr) || this.year != +this.stateParamsNew.year) {
            ///this.dtWorld = []; // better to change after request finished
            ///this.tphWorld = '';
            this.year = +this.stateParamsNew.yr || +this.stateParamsNew.year;
            this.stateParamsNew.year = this.year;
            this.fastSearch = {}; ///////
        }
        this.stateParamsNew.forceFull = this.forceFull;
        
        return this.url;
    }
    
    getStateURL () {
        return this.url;
    }
    
    getDtWorld () {
        return (this.dtWorldLegacy.length <= this.dtWorld.length)? this.dtWorld : this.dtWorldLegacy;
    }
    
    getDt () {
///        return this.dt;
        var dt = this.dt; // but do not touch this.dt
        dt = dt.filter(function (e, i) {
            return (!!e) ? e : null;
        });
        if (!!dt[0]) { // BUG 1.5 !!! this.dt is broken, when it starts from 0 instead 1
            dt.unshift(undefined);  delete dt[0];
        }
        return dt;        
    }
    
    updateFastSearch () {
        var dtWorld = this.getDtWorld();
        for (var pos in dtWorld) {
            if (pos >= 1) {
                this.fastSearch[dtWorld[pos]['univ_name']] = +pos;
            }
        }
        
        var allPositions = [];
        for (var name in this.fastSearch) {
            if (!this.fastSearch[name]) {
                continue;
            }
            var pos2 = this.fastSearch[name];
            if (!pos2 || pos2 < 1) {
                this.fastSearch[name] = null;
                continue;
            }
            if ((!!dtWorld[pos2] && dtWorld[pos2]['univ_name'] != name) || allPositions.indexOf(pos2) >= 0) {
                delete this.fastSearch[name];
            }
            allPositions.push(pos2);
        }
    }
    
    getTphunnm () {
        var tphunnm = []; // массив имен вузов поиска
        tphunnm = this.getDtWorld().map(function (e, pos) {
            return (pos >= 1 && !!e) ? e['univ_name'] : undefined;
        });
        return tphunnm;
    }
    
    request () {
        this.requestAjax = $.ajax({
            "url": this.url, 
            "method": 'GET', 
            "async": true,
        });
        let stateParamsNew = $.extend(true, {}, this.stateParamsNew);
        
        subj = stateParamsNew.subj; // subject
        yr = stateParamsNew.yr || stateParamsNew.year || yr || this.year; // year
        if (!!stateParamsNew.pos) {
            stateParamsNew.cntr = cntr || 0;
            stateParamsNew.reg = reg || 0;
        } else {
            cntr = stateParamsNew.cntr; // country
            reg = stateParamsNew.reg; // region
        }
        this.year = yr;
        
        if (this.year != this.yearLegacy) {
            this.clearCache();
            this.yearLegacy = this.year;
            try {
                if (window.windowDock) { // windowDock appears only after first created infowindow
                    window.windowDock.closeAll();
                }
                new UnivDataController(this).resetInputExceptYear(cntr, reg, subj); // ? preserve subj too
            } catch (e534234532) {
                console.error(e534234532);
            }
        }
        
        if ((++this.loadTimes) > 3) {
            this.loadTimes = 3;
        }
        console.log('loadTimes0: ', this.loadTimes);
        
        this.requestAjax = this.requestAjax.then(function onSuccess (data) {
            'use strict';
            
            if (forceFull && !stateParamsNew.pos) {
                this.dtWorld = dt;
            } else {
                this.dtWorld = this.dtWorldLegacy || this.dtWorld || [];
                this.dtWorldLegacy = [];
            }
            var forceFull = stateParamsNew.forceFull;
            var dt = [];
            this.dt = dt; // reset local state of dt
            console.log('stateParamsNew: ', stateParamsNew);
                
            switch (Number(subj)) {
                case 1:sv='SO';break;
                case 2:sv='SH';break;
                case 3:sv='SL';break;
                case 4:sv='SM';break;
                case 5:sv='SN';break;
                case 6:sv='SS';break;
                case 7:sv='SE';break;
                default:sv='SO';
            }
            if (Number(data[0]) > 0) { // TODO: recheck                
                n = Number(data[0]);
                //n=540;
                //alert(n);
            
                ///if(Number(n)>100)
                ///{$('.mapinfo').html('<div id="map_div" style="display:none"></div><div id="nwmap"><h2>The map is loading.</h2></div>');}
                ///else
                ///{$('.mapinfo').html('<div id="map_div"></div>');}
                
                dt.length=0;
                //var dtFullTmp = $.extend([], this.dtWorld || dt);
                //dtFullTmp[0] = null;
                console.log('yr: ', yr);
                //console.log('tmp.length: ', dtFullTmp.length);                
                
                var posOffset = 0;
                if (!!forceFull && !!stateParamsNew.pos) {
                    posOffset = +stateParamsNew.pos.split('_')[0] || 0; // TODO: recheck
                }
                //var dtTmp = [];  dtTmp.unshift(undefined);  delete dtTmp[0];
                var posOffset1 = posOffset;
                var alreadyShifted = false;  var j = 0;
                this.updateFastSearch();
                for (var i=1; i<=n; ++i) {
                    //alert(data[4][i]);
                    var i1 = (i-posOffset1 < 0) ? 0 : i-posOffset1; // OLD i1: 0
                    if (false && !!forceFull && alreadyShifted) {
                        if ((!data[1][i1+posOffset1]['univ_name']) && (i1 = (alreadyShifted && !!this.fastSearch[dt[1]['univ_name']]) ? this.fastSearch[dt[1]['univ_name']] - posOffset1 : -1) > 0) { // NEW i1: 1
                            posOffset = i1 - i; // i + posOffset == i1
                        }
                        i1 = i-posOffset1; // i = i1 + posOffset1 !!! new posOffset !!!  // NEW i1: 2
                        ++j;
                    } else if ((!data[1][this.getDtWorld().length - 1] || data[1].length < this.getDtWorld().length - 1) && (i-posOffset1 < 1 || !!this.getDtWorld()[i-posOffset1]) && (n == 1 || (this.getDtWorld().length > n) || !data[1][i1+posOffset1] || !data[1][i1+posOffset1]['univ_name'] || data[1][i1+posOffset1]['univ_name'] != this.getDtWorld()[i-posOffset1]['univ_name'])) { // TODO: recheck please!
                        var dt1 = dt[++j];
                        dt[j] = this.genBasicData(j, data[1], []); // tmp
                        var newM = dataToMarker(dt, j, null, true); // tmp
                        if (alreadyShifted && !!data[1][j] && data[1][j]['univ_name']) {
                            i1 = this.fastSearch[data[1][j]['univ_name']];
                        } else {
                            i1 = -1;
                        }
                        dt[j] = dt1 || undefined;
                        var i1Old = i1;
                        if (!(i1 >= 0 && !!this.getDtWorld()[i1] && data[1][j]['univ_name'] == this.getDtWorld()[i1]['univ_name'])) {
                            //console.log('wrong i1: ', i1);
                            i1 = new UnivDataController(this).getMarkerPositionInDtWorld(newM, 0); // NOTE: this line is too complicated
                            //console.log('correct i1: ', i1);
                        }
                        if (i1 < 0) { // NEW i1: 3
                            console.error('[ERR] Can not shift position!', i1, i, posOffset, dt[i]);
                            
//                            if (!forceFull && alreadyShifted) {
//                                this.dtWorldLegacy = this.getDtWorld();
//                                this.dtWorld = []; ////////////
//                            } else if (!this.dtWorldLegacy || this.dtWorldLegacy.length || this.dtWorld.length == this.dt.length || this.dtWorldLegacy.length <= this.dtWorld.length || this.dtWorldLegacy.length <= this.dt.length) {
//                                this.dtWorldLegacy = $.extend(true, [], this.dtWorld);
//                            }
//                            this.dt = [];
//                            return null;
                            i1 = j;
                        }
                        posOffset1 = i - i1; // i = i1 + posOffset1 !!! new posOffset !!!
                        
                        alreadyShifted = true;
                        if (i1 != i1Old) {
                            console.trace('[WARN 3]: ' + i1 + ' ' + i1Old);
                        }
                        if (j != i1+posOffset1 || !data[1][i1+posOffset1]) {
                            console.error('bug 4: ' + j + ' ' + i1+posOffset1);
                            console.error('bug 5: ', data[1][i1+posOffset1]);
                            continue;
                        }
                        console.log('Shifted [dt position, data1/data_1 position, univ_name]: ', i-posOffset1, i1+posOffset1, data[1][i1+posOffset1]['univ_name']); // !!! maybe BUG
                    } else {
                        i1 = i;  // NEW i1: 4
                        posOffset1 = 0;
                        ++j;
                    }                        
                    dt[i-posOffset1] = []; //dtmap = [];
                    dt[i-posOffset1] = this.genBasicData(i1+posOffset1, data[1], dt[i-posOffset1]);
                    dt[i-posOffset1] = this.genLeagueStyles(i1+posOffset1, data[1], dt[i-posOffset1]);
                    dt[i-posOffset1] = this.genCardInfo(i1+posOffset1, data[1], dt[i-posOffset1]);
                    
                    //dtTmp.push(dt[i-posOffset1]);
                    
                    if (!!this.getDtWorld()[i-posOffset1] && this.getDtWorld()[i-posOffset1]['univ_name'] == dt[i-posOffset1]['univ_name']) {
                        if (!!dt[i-posOffset1]['info'] || !!forceFull) {
                            this.getDtWorld()[i-posOffset1]['info'] = dt[i-posOffset1]['info'];
                            if (forceFull && dt[i-posOffset1]['info'] && dt[i-posOffset1]['univ_name'] && dt[i-posOffset1]['O_WR'] && dt[i-posOffset1]['O_Color1'] && 'head' != stateParamsNew.mode) {
                                this.getDtWorld()[i-posOffset1]._mode = 'full';
                            }
                        }
                    } else {
                        if (!!this.getDtWorld()[i-posOffset1]) {
                            console.error('Fatal error: ', dt[i-posOffset1]['univ_name']);
                        }
                    }
                    
                    if (forceFull && dt[i-posOffset1]['info'] && dt[i-posOffset1]['univ_name'] && dt[i-posOffset1]['O_WR'] && dt[i-posOffset1]['O_Color1'] && 'head' != stateParamsNew.mode) {
                        dt[i-posOffset1]._mode = 'full';
                        this.fastSearch[dt[i-posOffset1]['univ_name']] = +i-posOffset1;
                    } else {
                        delete dt[i-posOffset1]._mode;
                    }
                }
                
                //if (!!dtTmp[0]) {
                //    dtTmp.unshift(undefined);  delete dtTmp[0]; // BUG 1.1 !!! this.dt is broken, when it starts from 0 instead 1
                //}
                                
                if (!!stateParamsNew.pos) {
                    this.dtWorldLegacy = this.dtWorld || this.dtWorldLegacy;
                    this.dtWorld = [];
                }
                
                if (!this.dtWorld || !this.dtWorld.length || (this.dtWorld.length <= 2 && !this.dtWorld[0] && !this.dtWorld[1]) || !Array.isArray(this.dtWorld)) {
                    this.dtWorld = [];
                }
                
                if (!this.dt) {
                    this.dt = [];
                }
                if ((!!forceFull || !stateParamsNew.pos || this.dt != this.dtWorld)) {
                    //this.dt = this.dt.filter(function (e, i) {
                    //    return (!!e) ? e : null;
                    //})
                    if (!!this.dt[0]) { // BUG 1.2 !!! this.dt is broken, when it starts from 0 instead 1
                        this.dt.unshift(undefined);  delete this.dt[0];
                    }
                }
                
                if (!stateParamsNew.pos) {
                    if (!this.dtWorld || !this.dtWorld.length) {
                        this.dtWorld = [];
                    }
                    if (this.dtWorld.length == this.dt.length) {
                        this.dtWorld = $.extend(true, [], this.dtWorld, this.dt);
                    } else if (this.dt.length > this.dtWorld.length) {
                        this.dtWorld = $.extend(true, [], this.dt);
                    }
                    
                    if (!forceFull && alreadyShifted) {
                        ///this.dt = $.extend(true, [], dt);
                        ///this.dt = this.dt.slice(posOffset1+i1-n+1);
                        this.dtWorldLegacy = this.getDtWorld(); ///(!!this.dtWorld && !!this.dtWorld.length) ? this.dtWorld : [];
                        this.dtWorld = []; ////////////
                        //this.dt = [];
                        //this.dt = dtTmp
                    } else if (!this.dtWorldLegacy || this.dtWorldLegacy.length || this.dtWorld.length == this.dt.length || this.dtWorldLegacy.length <= this.dtWorld.length || this.dtWorldLegacy.length <= this.dt.length) {
                        this.dtWorldLegacy = $.extend(true, [], this.dtWorld);
                    }
                }
                
                //if (this.dt && this.dt.length > 0) {
                //    this.dt = this.dt.filter(function (e, i) {
                //        return (!!e) ? e : null;
                //    })
                //    if (!!this.dt[0]) { // BUG 1.3 !!! this.dt is broken, when it starts from 0 instead 1
                //        this.dt.unshift(undefined);  delete this.dt[0];
                //    }
                //}
                
                //dtTmp = [];
                //console.log('this.dt: ', this.dt);
                
                console.log('dt length compare (world, legacy, local): ', this.dtWorld.length, this.dtWorldLegacy.length, this.dt.length);
                console.log('dt 0 compare (world, legacy, local): ', this.dtWorld[0], this.dtWorldLegacy[0], this.dt[0]);
                console.log('dt 1 compare (world, legacy, local): ', this.dtWorld[1], this.dtWorldLegacy[1], this.dt[1]);
                
                return data;
            } else {
                if (!forceFull && alreadyShifted) {
                    this.dtWorldLegacy = this.getDtWorld();
                    this.dtWorld = []; ////////////
                } else if (!this.dtWorldLegacy || this.dtWorldLegacy.length || this.dtWorld.length == this.dt.length || this.dtWorldLegacy.length <= this.dtWorld.length || this.dtWorldLegacy.length <= this.dt.length) {
                    this.dtWorldLegacy = $.extend(true, [], this.dtWorld);
                }
                this.dt = [];
                return data;
            }
        }.bind(this));
        
        return this.requestAjax;
    }
    
    genBasicData (i, data_1, dtI) {
						if (!dtI) {
							dtI = [];
						}
						dtI['univ_name']=$.trim(data_1[i]['univ_name']);
						dtI['country']=data_1[i]['country'];
						dtI['region']=data_1[i]['region'];
						dtI['Students']=data_1[i]['Students'];
						dtI['Faculty']=data_1[i]['Faculty'];
						dtI['FS']=data_1[i]['FS'];
						dtI['flag']=data_1[i]['flag'];
						dtI['logo']=data_1[i]['logo'];
						dtI['loc']=data_1[i]['loc'];
						dtI['found']=data_1[i]['found'];
						dtI['sh_nm']=data_1[i]['sh_nm'];
						dtI['type']=data_1[i]['type'];
						dtI['website']=data_1[i]['website'];
                        dtI['id_univ']=data_1[i]['id_univ']; ///
						
                        crd = data_1[i]['cord'].split(','); ///
                        
						dtI['lat']=crd[0];
						dtI['lng']=crd[1];
                        
						dtI['nm_page']=data_1[i]['nm_page'];
						dtI['O_CR']=data_1[i]['O_CR'];dtI['League']=data_1[i]['League'];
						dtI['O_WR']=data_1[i]['O_WR'];dtI['O_WS']=data_1[i]['O_WS'];

						//if(Number(cntr)==45)
						//{alert(dtI['lat']);}
						//alert(data_1[i]['cord']+'\n'+dtI['lat']+'\n'+dtI['lng']);
                        return dtI;
    }
    
    genLeagueStyles (i, data_1, dtI) {
						if (!dtI) {
							dtI = [];
						}
						dtI['O_TR']=data_1[i]['O_TR'];dtI['O_TS']=data_1[i]['O_TS'];
						dtI['O_RR']=data_1[i]['O_RR'];dtI['O_RS']=data_1[i]['O_RS'];
						dtI['O_IR']=data_1[i]['O_IR'];dtI['O_IS']=data_1[i]['O_IS'];
						dtI['O_FR']=data_1[i]['O_FR'];dtI['O_FS']=data_1[i]['O_FS'];
						
						dtI['O_80p']=data_1[i]['O_80p'];
						dtI['O_O_s']=data_1[i]['O_O_s'];dtI['O_Color1']=data_1[i]['O_Color1'];
						dtI['O_Color3']=data_1[i]['O_Color3'];dtI['O_Color4']=data_1[i]['O_Color4'];
						
						dtI['T_Os']=data_1[i]['T_Os'];dtI['T_Color1']=data_1[i]['T_Color1'];
						dtI['T_Color3']=data_1[i]['T_Color3'];dtI['T_Color4']=data_1[i]['T_Color4'];
						
						dtI['R_Os']=data_1[i]['R_Os'];dtI['R_Color1']=data_1[i]['R_Color1'];
						dtI['R_Color3']=data_1[i]['R_Color3'];dtI['R_Color3']=data_1[i]['R_Color3'];
						
						dtI['I_Os']=data_1[i]['I_Os'];dtI['I_Color1']=data_1[i]['I_Color1'];
						dtI['I_Color3']=data_1[i]['I_Color3'];dtI['I_Color4']=data_1[i]['I_Color4'];
						
						dtI['F_Os']=data_1[i]['F_Os'];dtI['F_Color1']=data_1[i]['F_Color1'];
						dtI['F_Color3']=data_1[i]['F_Color3'];dtI['F_Color4']=data_1[i]['F_Color4'];
						
						switch (dtI['League'])
						{
							case 'Diamond League':dtI['icon']='diamond';dtI['iconurl']='./images_rur/Konf/diamondw.png';break;
				 			case 'Golden League':dtI['icon']='gold';dtI['iconurl']='./images_rur/Konf/goldw.png';break;
				 			case 'Silver League':dtI['icon']='silver';dtI['iconurl']='./images_rur/Konf/silverw.png';break;
				 			case 'Bronze League':dtI['icon']='bronze';dtI['iconurl']='./images_rur/Konf/bronzew.png';break;
				 			case 'Copper League':dtI['icon']='cooper';dtI['iconurl']='./images_rur/Konf/cooperw.png';break;
				 			case 'World League':dtI['icon']='world';dtI['iconurl']='./images_rur/Konf/worldw.png';break;
						  	default:dtI['icon']='world';dtI['iconurl']='./images_rur/Konf/worldw.png';
						}
                        return dtI;
    }
    
    genCardInfo (i, data_1, dtI) {
						if (!dtI) {
							dtI = [];
						}
						var leftur = 'https://www.roundranking.com/universities/';hs=''; // NOTE !!! html id dt_i may be broken, do not use it
						
						dtI['info']='<div id="dt_i' + i + '" style="overflow:auto;font-family:arial; border:2px '+ dtI['O_Color1']+ 'solid; border: 2px '+ dtI['O_Color1']+ ' solid;padding:10px;padding-right:32px;padding-bottom:16px"><table style="font-family:arial;width:560px;height:300px;border-collapse:collapse" class="style5" border="0"><tbody><tr>';
						dtI['info']+='<td style="font-family:arial;text-align:center" rowspan="10" colspan="2"><img src="'+ dtI['logo']+ '" style="vertical-align:top;width: 8em;height: 8em;" ></td><td colspan="4" style="font-family:arial;text-align:left"><span style="font-family:arial;color:'+ dtI['O_Color1']+ ';font-size:17px"><strong>'+ dtI['univ_name']+ '</strong></span></td></tr>';
						dtI['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Foundation year:</b></span></td>';
						dtI['info']+='<td style="width:98px"><span style="font-size:9pt">'+ dtI['found']+ '</span></td>';
						dtI['info']+='<td rowspan="9" colspan="2" style="font-family:arial;text-align:center"><img src="'+ dtI['flag']+ '" style="vertical-align:top" height="80"><br><span style="font-family:arial;font-size:10px"></span><span style="font-family:arial;color:'+ dtI['O_Color1']+ '"><strong></strong></span></td></tr>';
						dtI['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Short name:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dtI['sh_nm']+ '</span></td></tr>';
						dtI['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Type:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dtI['type']+ '</span></td></tr>';
						dtI['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Students:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dtI['Students']+ '</span></td></tr>';
						dtI['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Faculty:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dtI['Faculty']+ '</span></td></tr>';
						dtI['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Web-site:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt"><a href="http://'+ dtI['website']+ '" target="_blank">'+ dtI['website']+ '</a></span></td></tr>';
						dtI['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Region:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dtI['region']+ '</span></td></tr>';
						dtI['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Location:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dtI['loc']+ '</span></td></tr>';
						dtI['info']+='<tr><td colspan="6">&nbsp;</td></tr><tr><td></td><td colspan="4" style="font-family:arial;border-top:'+ dtI['O_Color1']+ ' 2px solid"></td><td></td></tr>';
						dtI['info']+='<tr><td style="font-family:arial;width:114px;text-align:center" rowspan="6"><div style="font-family:arial;height:85px;width:85px"><img src="'+ dtI['O_80p']+ '" style=";width: 5em;height: 5em;" alt=""><br><div style="font-family:arial;color:#fff;font-size:14pt;font-weight:bold;padding-top:25px">'+ dtI['O_WR']+ '</div></div>';
						dtI['info']+='<div style="font-family:arial;width:80px"><strong><span style="color:'+ dtI['O_Color1']+ '"><span style="font-size:13pt">'+ dtI['O_WR']+ '</span></span></strong></div><div style="font-family:arial;width:80px"><strong><span style="color:'+ dtI['O_Color1']+ '"><span style="font-size:13pt">'+ dtI['League']+ '</span></span></strong></div></td>';
						dtI['info']+='<td style="font-family:arial;width:50px;height:7px"></td><td class="style6" style="width:110px;height:7px"><span style="font-size:9pt"><b>Dimension</b></span></td><td class="style6" style="font-family:arial;width:98px;height:7px"><span style="font-size:9pt"><b>Rank</b></span></td><td style="font-family:arial;width:63px;height:7px" class="style6"><span style="font-size:9pt"><b>Score</b></span></td><td style="font-family:arial;text-align:center" rowspan="4"><p class="style1"><span style="color:'+ dtI['O_Color1']+ '"><strong>Country rank</strong></span></p><p><span style="font-size:12pt"><span style="color:'+ dtI['O_Color1']+ '"><strong>'+ dtI['O_CR']+ '</strong></span></span></p></td></tr>';
						dtI['info']+='<tr style="font-family:arial;height:0px"><td colspan="4" style="font-family:arial;border-top:'+ dtI['O_Color1']+ ' 2px solid"></td><td></td></tr>';
						dtI['info']+='<tr style="font-family:arial;background:'+ dtI['O_Color4']+ ';height:35px"><td style="font-family:arial;width:50px" class="style1"><img alt="" src="'+ dtI['O_O_s']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px"><span style="font-size:9pt">Overall</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dtI['O_WR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dtI['O_WS']+ '</span></td></tr>';
						dtI['info']+='<tr style="font-family:arial;height:20px;background:'+ dtI['T_Color4']+ '"><td style="font-family:arial;width:50px"><img alt="" src="'+ dtI['T_Os']+ '" style="font-family:arial;float:right"></td><td style="width:110px"><span style="font-size:9pt">Teaching</span></td><td class="style6" style="width:98px"><span style="font-size:9pt">'+ dtI['O_TR']+ '</td><td class="style6" style="width:98px"><span style="font-size:9pt">'+ dtI['O_TS']+ '</span></td></tr>';
						dtI['info']+='<tr style="font-family:arial;background:'+ dtI['R_Color4']+ '"><td style="font-family:arial;width:50px;height:22px"><img alt="" src="'+ dtI['R_Os']+ '" style="font-family:arial;float:right"></td><td style="width:110px;height:30px"><span style="font-size:9pt">Research</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dtI['O_RR']+ '</td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dtI['O_RS']+ '</span></td><td style="font-family:arial;text-align:center;background:#ffffff" rowspan="3"><span style="font-family:arial;font-size:10px"><span style="font-family:arial;color:#999999"><a href="'+ leftur + dtI['nm_page']+ '.html?sort=O&year='+ (Number(yr)+2009)+ '&subject='+sv+hs+'" target="_blank">View full university profile</a></span></span></td></tr>';
						dtI['info']+='<tr style="font-family:arial;height:26px;background:'+ dtI['I_Color4']+ '"><td style="font-family:arial;width:50px;height:21px"><img alt="" src="'+ dtI['I_Os']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Internationalization</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dtI['O_IR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dtI['O_IS']+ '</span></td></tr>';
						dtI['info']+='<tr style="font-family:arial;background:'+ dtI['F_Color4']+ ';height:26px"><td style="font-family:arial;background:#ffffff"></td><td style="font-family:arial;width:50px;height:9px"><img alt="" src="'+ dtI['F_Os']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Finances</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dtI['O_FR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dtI['O_FS']+ '</span></td></tr></tbody></table></div>';
						
						//dtI['info']=data[4][i];
						//alert(dtI['info']);
                        return dtI;      
    }

};

class UnivDataController {
    constructor (udtService) {
        if (!udtService || !(udtService instanceof UnivDataService)) {
            this.udtService = null;
            throw new Error('[ERR] No udtService!');
        }
        //this._udtService = '' + udtService + '_' + (udtService.year);
        if (!!UnivDataController._instance) {
            return UnivDataController._instance;
        }
        this.udtService = udtService;
        this.promise = null;
        
        this.clearCache2();
        
        UnivDataController._instance = this;
    }
    
    toString () {
        return '[object ' + (this.constructor.name || 'Object') + ']';
    }
    
    clearCache2 () {        
        this.firstLoad = true;
        //if (!this.dtcntr) {
            this.dtcntr = [];
        //}
        
        this.tphWorld = ''; // tph and tphtxt can be only about world
        this.mrksWorld = [];
        this.mrks = [];
        
        this.clearMarkerLayers();
        console.trace('!clearCache2');
                
//        Object.defineProperty(this, 'getMrksWorldPart', {
//            get: () => (!!this.getMrksWorld() && !!this.getMrksWorld().length) ? this.getMrksWorld() : this.getMrks(),
//            enumerable: true,
//            configurable: false,
//        });
    }
    
    resetInputExceptYear (country = 0, region = 0, subject = 1) {
        cntr = (undefined !== country) ? country : cntr; // 0;
        reg = (undefined !== region) ? region : reg; // 0;
        subj = (undefined !== subject) ? subject : subj; // 1;
        
        $('.mfilter-country select option:selected').val(cntr);
        $('.mfilter-region select option:selected').val(reg);
        $('.mfilter-subject select option:selected').val(subj);
        
        console.log('cntr, reg, subj: ', cntr, reg, subj);
    }
    
    clearMarkerLayers () {
        mappanel.map.getLayers().getArray().map((e, i) => {if (i>0) mappanel.map.getLayers().getArray().splice(1) }); // rest only first layer
    }
    
    setForceFull (forceFull) {
        this.udtService.forceFull = forceFull;
        return this.udtService.forceFull;
    }
    
    getForceFull () {
        return this.udtService.forceFull;
    }
    
    getTphWorld () {
        return this.tphWorld;
    }
    
    getMrksWorld () {
        return this.mrksWorld;
    }
    
    getMrks () {
        return this.mrks;
    }
    
    getDtWorld () {
        return this.udtService.getDtWorld();
    }
    
    getDt () {
        return this.udtService.getDt();
    }
    
    getMrks3 (pos, city, scale) { // stateless
        var mrks3 = [];
        try {
            if (window.location.hash && window.location.hash.length > 2) {
                var mrks0 = decodeURIComponent(window.location.hash.substring(1)); /// For test use: window.location = 'https://roundranking.com/world-map_ggl23.html#{"lat": 34.137764,"lng": -118.125258,"z": 15},%231%20California%20Institute%20of%20Technology%20(Caltech),.%2Fimages_rur%2FKonf%2Fworldw.png,%23D6F5FF'
                window.location.hash = '';
                var p1 = -1;
                if (!(mrks0[0] !== '{' || (p1 = mrks0.indexOf('}')) < 0)) {
                    var mrks1 = JSON.parse(mrks0.substring(0, p1 + 1));
                    var mrks2 = mrks0.substring(p1 + 1).trim().split(',').filter(function (el) { return !!el && !!(el.trim()) });
                    mrks3 = [].concat(mrks1, mrks2);
                    console.log(null, [Object.values(mrks3)]); //
                    console.log(mrks3.length);
                    if (mrks3.length === 4 && mrks3[0].lat !== undefined && mrks3[0].lng !== undefined) {
                        var title = mrks3[1].substring(mrks3[1].indexOf(' ') + 1);
                        var wrData = getWorldRating(this.getDtWorld(), title, null);
                        if (!wrData) {
                            wrData = {};
                            wrData.title = title;
                            wrData.i = 1;
                            wrData.label = '5';
                        }
                        console.log('wrData: ', wrData);
                        console.log(mrks3.length);
                        if (!!mrks3[1] && !!mrks3[1].indexOf && mrks3[1].indexOf(title) >= 0) {
                            mrks3[3] = () => ({"univ_name": title,});
                            mrks3[4] = () => ('');
                            mrks3[1] = '#' + wrData.label + ' - ' + title;
                            mrks3[2] = this.getDtWorld()[wrData.i]['iconurl'] || mrks3[2];
                            pos = [mrks3[0].lng, mrks3[0].lat]; //
                            city = ol.proj.fromLonLat(pos); //
                            scale = +(mrks3[0].z); //
                            console.log(mrks3.length);
                            console.log(mrks3);
                        } else {
                            mrks3 = [];
                        }
                    } else {
                        mrks3 = [];
                    }
                }
            }
        } catch (e56345r3442) {
            window.location.hash = '';
            console.warn('[WARN] Hash parse error', e56345r3442);
            mrks3 = [];
        }
        return [[mrks3], pos, city, scale]; // returned other mrks3, already wraped!
    }
    
    clearSearchIngredients (tphselId) {
        $('#'+tphselId).html('');
    }
    
    addSearchIngredient (tphselId, dt, i) {
        $('#'+tphselId).append('<option value="'+i+'">' + dt[i]['univ_name'] + ' _' + dt[i]['id_univ'] +'</option>');
    }
    
    requestSecond (isRequestSecondParallel = false) {
        console.log('requestSecond will start without queue!');
        var res = null;
        if (this.udtService.getStateURL().indexOf('&pos=') >= 0 || this.udtService.getStateURL().indexOf('?pos=') >= 0) {
            if (!!this.getDt() && !!this.getDtWorld() && this.getDt().length != this.getDtWorld().length) {
                res = this.udtService.request();
                this.setForceFull(false);
            } else {
                res = this.udtService.request();
                console.warn('[WARN] Usually dt is less dtWorld here');
            }
        } else {
            isRequestSecondParallel = true;
        }
        res = (!isRequestSecondParallel) ? res : Promise.resolve(!0);        
        return res;
    }
    
    setStateURL (url = null, forceFull = true, forceFrom, forceTo) { // second set for single marker
        if (!(!!url && url.trim().length > 0)) {
            url = this.udtService.getStateURL();
            let stateParamsNew = urlToParams(url);
            delete stateParamsNew.forceFull;
            delete stateParamsNew.mode;
            delete stateParamsNew.pos;
            
            subj = stateParamsNew.subj; // subject
            yr = stateParamsNew.yr || stateParamsNew.year || yr || this.udtService.year; // year
            cntr = stateParamsNew.cntr; // country ///
            reg = stateParamsNew.reg; // region ///
            this.udtService.year = yr;
            
            url = '/final/getunivdata_gmap23.php?year='+this.udtService.year/*yr*/+'&subj='+subj+'&cntr='+cntr+'&reg='+reg;
        }
        
        if (forceFull && !!forceFrom && !!forceTo) {
            url = url.replaceAll('&cntr=', '&empty1=');
            url = url.replaceAll('&reg=', '&empty0=');
            if (url.indexOf('&') >= 0 && url.indexOf('?') >= 0) {
                url += '&cntr='+0;
                url += '&reg='+0;
            } else {
                url += '?cntr='+0;
                url += '&reg='+0;
            }
        }
        
        return this.udtService.setStateURL(url, forceFull, forceFrom, forceTo);
    }
    
    setState (state) {
        if (!(state instanceof Object)) {
            return null;
        }
        this.code = 1; // 1 - good, 0 - stop, 2 - warn, 3 - later promise, 4 - later repeat, 5 - method required, 9 - log, -900 .. -2 - error, -1 - unknown error
        $.extend(this, state); //this = $.extend(this, state);
        
        if (!this.udtService.forceFull && window.location.hash && window.location.hash.length > 2) {
            this.resetInputExceptYear();
        }
        //subj = this.subject;
        //cntr = this.country;
        //reg = this.region;
        yr = yr || this.udtService.year;
        this.udtService.year = yr;
        
        if (this.udtService.forceFull && reg == 0) {
            this.udtService.forceFull = false;
            this.code = 0;
            //return;
        } else if (cntr > 0) {
            this.udtService.forceFull = true; ///
        }
        
        code = this.code;
        console.log('code0: ', this.code);
        if (this.udtService.getStateURL() == this.udtService.setStateURL('/final/getunivdata_gmap23.php?year='+this.udtService.year/*yr*/+'&subj='+subj+'&cntr='+cntr+'&reg='+reg, this.udtService.forceFull) && 0 !== this.code) {
            this.code = 0;
            //return;
            code = this.code;
        } else {
            this.code = 1; /////
            this.promise = this.udtService.request();
        }
        code = this.code;
        
        return {
            code: this.code,
            year: yr,
            subject: subj,
            country: cntr,
            region: reg,
        };
    }
    
    getPromise (stateParams = undefined) {
        console.log(this.udtService.loadTimes);
        if (this.udtService.loadTimes++ == 1) {
            this.clearCache2();
        }
        ({year: yr, subject: subj, country: cntr, region: reg, code} = this.setState(stateParams || {
            code: this.code,
            year: yr, // warn: strange year number (not like 20xx)
            subject: subj,
            country: cntr,
            region: reg,
        })); // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
        console.log('code1: ', this.code);
        console.log('code2: ', code);
        if (code === 0) {
            return this.promise;
        }
        
        this.promise = this.promise.then(function onSuccess (data) {
            let stateParamsNew = $.extend(true, {}, this.udtService.stateParamsNew);
            
            subj = subj || stateParamsNew.subj; // subject
            yr = yr || stateParamsNew.yr || stateParamsNew.year; // year
            cntr = cntr || stateParamsNew.cntr; // country
            reg = reg || stateParamsNew.reg; // region
            stateParamsNew.year = yr;
            var forceFull = stateParamsNew.forceFull;
            let dt = (this.udtService.getDt().length > 2) ? this.udtService.getDt() : this.udtService.getDtWorld(); /// NOTE: Do not use this.getDtWorldPart property
            ///this.udtService.updateFastSearch(); ///
            
            stateParamsNew.subj = subj;
            stateParamsNew.year = yr;
            stateParamsNew.reg = reg;
            stateParamsNew.cntr = cntr;
            
            /////////////////////////////////////
            if ((forceFull && !stateParamsNew.pos) || this.firstLoad) {
                cordtph = [];
                console.log('true 1');
            }
            var tph;
               tph = '';
                    
                    if ((forceFull && !stateParamsNew.pos) || this.firstLoad) {
                        this.clearSearchIngredients('tphsel');
                        console.log('true 2');
                    }
                    
                    for (var i=1; i<=dt.length-1; i++) {
                        if (!dt[i]) {
                            //console.log('absent dt: ', i);
                            continue;
                        }
						tph = tph + '{ID:'+i+', Name: "' + dt[i]['univ_name'] + ' _' + dt[i]['id_univ'] + '"},';
						
                        if ((forceFull && !stateParamsNew.pos) || this.firstLoad) {
                            this.addSearchIngredient('tphsel', dt, i);
                        }
                        
                        cordtph[i]=[dt[i]['lat'],dt[i]['lng']];
                    }
                    
                    tph = tph.replace('undefined', '');
                    
                var mrks = [];
                
                var mrksWorldPart = $.extend(true, [], (dt.length == this.udtService.getDtWorld().length) ? this.getMrksWorld() : this.getMrks()); /// NOTE: Do not use this.getMrksWorldPart property
                if (!forceFull && !!mrksWorldPart && !!mrksWorldPart.length) { /// TODO: recheck
                    //var dt = this.getDtWorld(); ///
                    mrksWorldPart = mrksWorldPart.map(function (e1, i1) {
                        for (var t=0; t<dt.length-1; ++t) {
                            if (!dt[t+1] || !e1) {
                                continue;
                            }
                            if (dt[t+1]['univ_name'] === e1[3]['univ_name']) {
                                return e1;
                            }
                        }
                        return false;
                    }).filter(function (e1, i1) { return !!e1; });
                    
                    mrks = mrksWorldPart;
                    //dt = this.getDt();
                }
                if (!mrks || !mrks.length) {
                    mrksWorldPart = [];
                    mrks = [];
                    
                    for (var i=0; i<=dt.length-1; ++i) {
                        if (!dt[i+1]) {
                            continue;
                        }
                        //konf[i+1]=dt[i+1]['iconurl'];
                        let title = dt[i+1]['univ_name'];
                        if (false && this.udtService.fastSearch[title] && this.udtService.getDtWorld()[this.udtService.fastSearch[title]] == title) {
                            mrks.push(dataToMarker(this.udtService.getDtWorld(), this.udtService.fastSearch[title], title, false));
                        } else {
                            var mOld = dataToMarker(dt, i+1, title, false);
                            var marker = mOld; ///dataToMarker(this.udtService.getDtWorld(), this.getMarkerPositionInDtWorld(mOld), title, false);
                            //console.log('marker: ', marker);
                            mrks.push(marker);
                            
                            ///console.warn('Created marker may be buggy, because can not access fastSearch on getDtWorld()', mrks[mrks.length-1]);
                        }
                    }
                    //console.log('mrks[0][0]: ', mrks[0][0]);
                }
                this.mrks = mrks;
                    let oldCountrySelect = -1;
                    ///this.countryList(); // why not here 2 ???
					if ((oldCountrySelect = +($('.mfilter-country select').val())) != 0 && !isNaN(+($('.mfilter-country select').val()))) { /// && +($('.mfilter-country select option:selected').val()) != 0) {
                        let dtcntrOld = this.dtcntr;
                        this.countryList(); // why it is better here ???
                        var val001 = +$('.mfilter-country select option:selected').val() || +$('.mfilter-country select').val();                        
                        if (+val001 != +oldCountrySelect || +val001 == 0) {
                            val001 = oldCountrySelect;
                            this.dtcntr = dtcntrOld;
                            console.warn('[WARN] Old value will be: ', val001);
                        }
                        scale = +(this.dtcntr[val001]['scale']);
                        console.log('scale: ', scale);
                        crd = this.dtcntr[val001]['cord'].split(',');
                        coord = { lat: +(crd[0]), lng: +(crd[1]) };
                        //alert(crd[0]);
                        ///this.countryList(); // on fatal here 3 ???
					}
					else
					{
							switch ($('.mfilter-region select').val()) 
							{
							  case '0':
							    coord={ lat: 33, lng: 16.77 };
								scale=2;	
							    break;
							  case '1':
							    coord={ lat: 9.604317, lng: 17.823823 };
								scale=3;	
							    break;
							  case '2':
							    coord={ lat: 38.25898857820971, lng: 77.51449564808682 };
								scale=3;	
							    break;
							  case '3':
							    coord={ lat: 55.053202278679336, lng: 68.0712876284561 };
								scale=3;	
							    break;  
								case '4':
							    coord={ lat: -8.79822593747235, lng: -77.65136382423192 };
								scale=3;	
							    break;  
							    case '5':
							    coord={ lat: 57.49221340283756, lng: -118.08105372881057 };
								scale=3;	
							    break;  
							    case '6':
							    coord={ lat: -28.0591468595607, lng: 142.10785022041355 };
								scale=4;	
							    break;  
							  default:
							    coord={ lat: 33, lng: 16.77 };
								scale=2;	
							}
					}
                    
                
                if (!stateParamsNew.pos && (forceFull || !this.mrksWorld || !this.mrksWorld.length || !this.tphWorld || tph.length >= this.tphWorld.length)) {
                    console.log('true 3: ', $('#tphsel option').length === tph.split('},').length - 1, !this.mrksWorld || !this.mrksWorld.length);
                    if (!!tph && $('#tphsel option').length === tph.split('},').length - 1 && (!this.mrksWorld || !this.mrksWorld.length || (this.mrksWorld.length === $('#tphsel option').length)) && (!this.tphWorld || tph.length >= this.tphWorld.length)) {
                        //alert(tph);
                        //console.log('tphsel: ', $('#tphsel').html());
                        console.log('tph: ', tph); //
                        this.tphWorld = tph;
                        console.log('true 4');
                    }
                    if (forceFull) {
                        this.mrksWorld = this.mrks;
                        console.log('true 5');
                    }
                }
                this.reinitTypeaheadMapSearch(true);
                this.firstLoad = false; 
            /////////////////////////////////////
            return data;
        }.bind(this), function onFail (err) {
            console.error('[ERR0] ', err);
            return err;
        }.bind(this));
        
        return this.promise;
        //var res = this.promise;
        //this.promise = Promise.resolve(!0);
        //return res;
    }
    
    /**
     * Reinit typeahead map search
     * full:
     *   undefined/false - do not full reinit
     *   true or null - full reinit
     *   (null here is special variant of true (for empty placeholder))
     */
    reinitTypeaheadMapSearch (full) {
        if (full !== null) {
            $('#mapsrchvl').attr('placeholder', 'Enter the name of the university');
        } else {
            $('#mapsrchvl').attr('placeholder', '');
            full = true;
        }
        $('#mapsrchvl').val('');
        try {
            $('#mapsrchvl').typeahead('close');
        } catch (e54634365423122) {
            full = true;
        }
        if (full) {
            $('#mapsrchvl').typeahead('destroy');                           
            $('.typeahead:not(#mapsrchvl)').remove(); // fix bug
            var tphtxt='$("#mapsrchvl").typeahead({autoSelect:false,source: ['+this.getTphWorld()+'],displayField: "Name",valueField: "ID",limit:"20", afterSelect: function (item) { console.log("after selected: ", item); setTimeout(function () { $(\'input[type="button"]#mapsrchbtn,input[type="submit"]#mapsrchbtn\')[0].focus(); }, 100); return item; }, });';
            eval(tphtxt);
        }
    }
    
    /**
     * Search @marker position in dtWorld.
     *  @searchType 0: only by university title
     *  @searchType 1: by university title or coordinates (default)
     *  @searchType 2: by university title and coordinates
     *  @searchType 3: only coordinates
     * If instead marker we get string, then searchType forced to 1 and coordinates ignored.
     * @Returns integer for searchType 0, 1, 2 or array for searchType 3
     *  0 or positive integer - normal result;
     *  -1 - not found;
     *  -2 - wrong dtWorld state, can not search.
     */
    getMarkerPositionInDtWorld (marker, searchType = 1) {
        if (!this.getDtWorld() || !this.getDtWorld().length) {
            return -2; // search array is empty
        }
        
        if (!marker || !marker.length || searchType < 0 || searchType > 3) {
            return null;
        }
        var res = [];
        var curP;
        var curM = this.getDtWorld()[0] || this.getDtWorld()[1] || this.getDtWorld()[2];
        if (marker.length && !Array.isArray(marker)) { // string (special) instead of marker object array
            if (!marker.trim().length) {
                return null;
            }
            marker = simplifyName(marker);
            marker = [
                {lat: 0, lng: 0},
                '' + marker.trim(),
                curM[2],
                curM[3],
                curM[4],
            ];
            if (searchType == 3) {
                return -1;
            } else if (searchType == 1) {
                searchType = 0;
            }
        }
        ///marker = $.extend(true, [], marker);
        
        curP = this.getDtWorld().length;
        while ((--curP) >= 0) {
            var curD = this.getDtWorld()[curP];
            if (!curD) {
                continue;
            }
            curM = dataToMarker($.extend(true, [], {1: curD}), 1, null, true);
            if (!curM || !Array.isArray(curM) || (Array.isArray(curM) && !curM.length)) {
                continue;
            }
            curM[1] = simplifyName(curM[1]);
            marker[1] = simplifyName(marker[1]);
            var was = false;
            if (searchType < 3) { // firstly search by title
                if (curM[1] !== marker[1]) {
                    if (searchType % 2 == 0) {
                        continue;
                    }
                } else {
                    was = true;
                }
            }
            if (searchType >= 1) {
                if (curM[0].lat != marker[0].lat || curM[0].lng != marker[0].lng) {
                    if (!was || 2 == searchType) {
                        continue;
                    }
                }
                res.push(curP);
            }
            if (searchType < 3) {
                return curP;
            }
        }
        if (3 == searchType) {
            return res;
        } else {
            return -1;
        }
    }
    
    countryList () {
					subj=$('.mfilter-subject select option:selected').val();
					yr=$('.mfilter-year select option:selected').val();
					reg=$('.mfilter-region select option:selected').val();
					if(Number($('.mfilter-country select option:selected').val()))
					{cntr=$('.mfilter-country select option:selected').val();}
					else{cntr=0;}
					//alert(subj+'\n'+yr+'\n'+reg+'\n'+cntr);
					this.dtcntr=[];  this.dtcntr.length=0;
					//var urlc='final/getunivdata_ymap.php?year='+yr+'&subj='+subj+'&reg='+reg+'&cntr='+cntr;
					var urlc='./final/getcntrdata_gmap23.php?year='+yr+'&subj='+subj+'&reg='+reg;
					//alert(urlc);
                    if (this.oldUrlc === urlc && !!this.dtcntr && this.dtcntr.length > 0) {
                        return this.dtcntr; ///
                    } else {
                        this.oldUrlc = urlc;
                    }
					$('.mfilter-country select').html('<option value="0">World</option>');
					$.ajax(
					{
						url: urlc,
                        async: false, // you can ignore warning
						success: function(data)
					 	{   console.log(this.toString());
					 		var j=0;
					 		var m=Number(data[2]);
					 		//alert(j+'\n'+m);
                            if (!this.dtcntr || !this.dtcntr.length) {
                                this.dtcntr = [];
                            }

					 		$.each(data[1], function(key, val)
					 		{
								this.dtcntr[key]=[];
								//alert(key + '\n' + this.dtcntr[key]);
								$('.mfilter-country select').append('<option value="'+key+'">'+val['Country']+'</option>');
								
								this.dtcntr[key]['id_country']=val['id_country'];
								this.dtcntr[key]['Country']=val['Country'];
								this.dtcntr[key]['cord']=val['cord'];
								
								this.dtcntr[key]['scale']=val['scale'];
								this.dtcntr[key]['cntr_code']=val['cntr_code'];
								this.dtcntr[key]['cntr_iso']=val['cntr_iso'];
								this.dtcntr[key]['code_cntr']=val['code_cntr'];
								this.dtcntr[key]['code_reg']=val['code_reg'];
								//alert(key + '\n' + this.dtcntr[key]);
                                
							}.bind(this));
                            //this.dtcntr; // new value
                            $('.mfilter-country select').val(cntr);
                            if (!(+$('.mfilter-country select').val()) || 0 == (+$('.mfilter-country select').val())) {
                                cntr = 0;
                                $('.mfilter-country select').val(cntr);
                            }
						}.bind(this),
                         error: function (err) {
                            this.dtcntr = [];
                            this.oldUrlc = null;
                        }.bind(this),
		});
        return this.dtcntr; // valid only for async false
	}

    
};

if (!window.getWorldRating) {
    window.getWorldRating = function getWorldRating (dt, title, i) {
        if (!dt || !dt.length || (dt.length <= 2 && !dt[0] && !dt[1]) || !Array.isArray(dt)) {
            return undefined;
        }
        if (!title && (!i || i == 0 || i < 0)) {
            return null;
        }
        if (!title || title === true || Array.isArray(title) || !title.length || title.trim().length == 0) {
            title = null;
        } else if (!i || i == 0 || i < 0) {
            i = 0; // dt starts from index 1
        }
        
        if (i > 0 && !title) {
            title = dt[i]['univ_name'];
        } else {
            i = -1;
            for (let j=1; !!dt[j]; ++j) {
                if (dt[j]['univ_name'] == title) {
                    i = j;
                    break;
                }
            }
        }
        if (i <= 0 || dt[i]['univ_name'] != title) {
            console.warn('You should use only one of arguments: title, i');
            return null;
        }
        return {
            "label": dt[i]['O_WR'],
            "i": i,
            "title": title,
        };
    };
}

window.dataToMarkerCustom = function dataToMarkerCustom (dt = null, i1, title, coord, icnsrc) {
    return $.extend(true, [], dataToMarker(dt, i1, title, true), {
        0: coord, // position coord
        2: icnsrc, // icon
    });
};

window.dataToMarker = function dataToMarker (dt0 = null, i1, title, ignoreMissing = false) {
    const isFunction = function (value) {return !!value && !/^\s*class/.test(value.toString()) && (Object.prototype.toString.call(value) === "[object Function]" || "function" === typeof value || value instanceof Function) };
    let dt;
    if (isFunction(dt0)) { // already function
        dt = dt0;
    } else if (!dt0 || dt0 == [] || dt0 === true || dt0 === +dt0 || !dt0.length || dt0.length <= 0 || !!dt0.trim) { // empty
        var t = new UnivDataService();
        dt = () => (!!t.getDtWorld() && !!t.getDtWorld().length && !!t.getDtWorld()[1]) ? t.getDtWorld() : t.getDt(); /// NOTE: Do not use wrong: () => new UnivDataService().getDtWorldPart;
    } else { // data array
        dt = () => dt0;
    }
    let coord = {};
    try {
        coord = {lat: +((''+dt()[i1]['lat']).trim()), lng: +((''+dt()[i1]['lng']).trim())};
        if (!coord.lat || !coord.lng) {
            console.warn('[WARN] Wrong coordinates within dt()[' + i1 + ']: ', dt()[i1], coord); /// !!! TODO
        }
    } catch (e53345764532346) {
        if (!ignoreMissing) {
            throw e53345764532346;
        }
    }
    var res = null;
    try {
        res = _dataToMarkerInner(dt, i1, title, ignoreMissing, coord, (!ignoreMissing) ? `#${getWorldRating(dt(), title, i1).label} - ${title}` : ( !!title ? `#${getWorldRating(dt(), title, null).label} - ${title}` : `#${getWorldRating(dt(), null, i1).label} - ${getWorldRating(dt(), null, i1).title}` ));
    } catch (e65834737573628) {
        if (!ignoreMissing) {
            throw e65834737573628;
        }
        res = _dataToMarkerInner(dt, i1, title, ignoreMissing, coord, '' + title);
    } finally {        
        return res;
    }
};

window._dataToMarkerInner = function _dataToMarkerInner (dt, i1, title, ignoreMissing, coord, titleFull) {
    return [
        coord, // 0: position coord
        titleFull, // 1: title
        dt()[i1]['iconurl'], // 2: icon
        () => dt()[i1], // 3: data
        () => (!!dt()[i1] && 'full' === dt()[i1]._mode) ? dt()[i1]['info'] : '', // 4: info content (optional)
    ];
};

window.simplifyName = function simplifyName (markerStr) {
    if (('' + markerStr.trim())[0] === '#') {
        markerStr = ('' + markerStr.trim()).substring(1);
        markerStr = markerStr.split(' - ')[1] || markerStr.split(' - ')[0] || markerStr.split(' — ')[1] || markerStr.split(' — ')[0];
        markerStr = '' + markerStr.trim();
    }
    return markerStr;
};

window.urlToParams = function urlToParams (url) {
    let urlParams = [];
    let match,
        pl = /\+/g,  // Regex for replacing addition symbol with a space
        search = /([^&=]+)=?([^&]*)/g,
        decode = function (s) {
            return decodeURIComponent(s.replace(pl, " "));
        },
        query = (!!url) ? url.split('?')[1] : window.location.search.substring(1);

    while (match = search.exec(query)) {
        if (decode(match[1]) in urlParams) {
            if (!Array.isArray(urlParams[decode(match[1])])) {
                urlParams[decode(match[1])] = [urlParams[decode(match[1])]];
            }
            urlParams[decode(match[1])].push(decode(match[2]));
        } else {
            urlParams[decode(match[1])] = decode(match[2]);
        }
    }
    return urlParams;
};
