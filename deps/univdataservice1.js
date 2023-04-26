﻿'use strict';

var yr,sb,cntr,reg,n,sv,lftur,hs;
var dt=new Array;var dtmap=new Array; ///var dtrow=new Array;
var tph = '';				//текст массива вузов для typehead
var tphcord=new Array;	//массив координат поиска
var tphunnm=new Array;	//массив имен вузов поиска
var cordtph=new Array;	//массив координат вузов по поиску
var map=new Object;
///var dt_world = {};
///var mrks_world = {};
var data;
var dtcntr=new Array;	//массив данных стран для карт

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
        this.firstLoad = true;
        this.url = null;
        this.requestAjax = null;
        this.yearWorld = -1;
        this.tphWorld = ''; // tph and tphtxt can be only about world
        this.dtWorld = []; // dtWorld (wider) and dt are different
        this.dt = null;
        this.mrksWorld = [];
        this.mrks = [];
        
        
        
        
        UnivDataService._instance = this;
    }
    
    getInstance () {
        return (!!UnivDataService._instance) ? UnivDataService._instance : new UnivDataService();
    }

    toString () {
        return '[object ' + (this.constructor.name || 'Object') + ']';
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
        if ((!!this.stateParamsNew.yr && this.yearWorld != +this.stateParamsNew.yr) || this.yearWorld != +this.stateParamsNew.year) {
            ///this.dtWorld = []; // better to change after request finished
            ///this.tphWorld = '';
            this.yearWorld = +this.stateParamsNew.yr || +this.stateParamsNew.year;
        }
        this.stateParamsNew.forceFull = this.forceFull;
        
        return this.url;
    }
    
    getStateURL () {
        return this.url;
    }
    
    getTphWorld () {
        return this.tphWorld;
    }
    
    getDtWorld () {
        return this.dtWorld;
    }
    
    getDt () {
        return this.dt;
    }
    
    getMrksWorld () {
        return this.mrksWorld;
    }
    
    getMrks () {
        return this.mrks;
    }
    
    clearSearchIngredients (tphselId) {
        $('#'+tphselId).html('');
    }
    
    addSearchIngredient (tphselId, dt, i) {
        $('#'+tphselId).append('<option value="'+i+'">' + dt[i]['univ_name'] + ' _' + dt[i]['id_univ'] +'</option>');
    }
    
    request () {
        this.requestAjax = $.ajax({
            "url": this.url, 
            "method": 'GET', 
            "async": true,
        });
        this.dt = []; // reset local state of dt
        
        let stateParamsNew = $.extend(true, {}, this.stateParamsNew);
        
        this.requestAjax = this.requestAjax.then(function onSuccess (data) {
            'use strict';
            
            var sb = stateParamsNew.sb; // subject
            var yr = stateParamsNew.yr || stateParamsNew.year; // year
            var cntr = stateParamsNew.cntr; // country
            var reg = stateParamsNew.reg; // region
            var forceFull = stateParamsNew.forceFull;
            var dt = [];
            if (forceFull && !stateParamsNew.pos) {
                this.dtWorld = dt;
                this.firstLoad = false;
            }
            var tph;
            this.dt = dt;
            console.log('stateParamsNew: ', stateParamsNew);
                
		  	 		switch (Number(sb))
					{
						case 1:sv='SO';break;
			 			case 2:sv='SH';break;
			 			case 3:sv='SL';break;
			 			case 4:sv='SM';break;
			 			case 5:sv='SN';break;
			 			case 6:sv='SS';break;
			 			case 7:sv='SE';break;
					  	default:sv='SO';
					}
	  	 		if(Number(data[0])>0)
	  	 		{
	  	 			
	  	 			n=Number(data[0]);
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
	  	 			
	  	 			for(var i=1;i<=n;i++)
	  	 			{
						//alert(data[4][i]);
						dt[i]=[]; //dtmap=[];
                        dt[i] = this.genBasicData(i, data[1], dt)[i];
                        dt[i] = this.genLeagueStyles(i, data[1], dt)[i];
                        dt[i] = this.genCardInfo(i, data[1], dt)[i];
					}
                    
                    ///if (!this.dtWorld || this.dtWorld.length !== dt.length) {
                        tph = '';
                        ///dtrow = [];
                    ///}
                    
                    if (forceFull && !stateParamsNew.pos) {
                        this.clearSearchIngredients('tphsel');
                    }
                    
                    //for(var i=1;i<=dtFullTmp.length-1;i++) {
                    for(var i=1;i<=dt.length-1;i++) {
                        //if (!!dtrow[i] && !!this.dtWorld && this.dtWorld.length === dt.length) { // TODO reset dtrow and tph only after year change
                        //    continue;
                        //}
                        ///dtrow[i]=[];
						///dtrow[i].push(Number(dt[i]['lat']));
						///dtrow[i].push(Number(dt[i]['lng']));
						///dtrow[i].push(dt[i]['info']);
						
						///dtrow[i].push(dt[i]['icon']);
						tph = tph + '{ID:'+i+', Name: "' + dt[i]['univ_name'] + ' _' + dt[i]['id_univ'] + '"},';
						
                        if ((forceFull && !stateParamsNew.pos) || this.firstLoad) {
                            this.addSearchIngredient('tphsel', dt, i);
                        }
                        
                        cordtph[i]=[dt[i]['lat'],dt[i]['lng']];
                    }
                    
                    ///if (!this.dtWorld || this.dtWorld.length !== dt.length) {
                        tph = tph.replace('undefined', '');
                        ///tph = tph.substring(0,tph.length - 1);
                    ///}
                
				///var mrkstr='var mrks=[';	
                var konf=[];var infwnd=[];
                var mrks=[];
                
                var mrksWorldPart = $.extend(true, [], this.getMrksWorld() || this.getMrks());
                if (!forceFull && !!mrksWorldPart && !!mrksWorldPart.length) {
                    //dt = this.getDtWorld(); ///
                    mrksWorldPart = mrksWorldPart.map(function (e1, i1) {
                        for (var t=0; t<dt.length-1; ++t) {
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
                    
                    for(var i=0;i<n;i++)
                    {
                        //konf[i]=dt[i+1]['iconurl'];
                        //infwnd[i]=dt[i+1]['info'];
                        let title = dt[i+1]['univ_name'];
                        mrks.push([
                            {lat: +((''+dt[i+1]['lat']).trim()), lng: +((''+dt[i+1]['lng']).trim())},
                            `#${getWorldRating(dt, title, i + 1).label} - ${title}`, //`#${dt[i + 1]['League']} - ${title}`,
                            dt[i+1]['iconurl'],
                            dt[i+1],
                            dt[i+1]['info'],
                        ]);
                        ///mrkstr+='[{lat:'+dt[i+1]['lat']+',lng:'+dt[i+1]['lng']+'},"'+dt[i+1]['univ_name']+'"],';
                        //alert(infwnd[i]);
                    }
                    ///mrkstr+='];';
                    //alert(mrkstr);
                    ///eval(mrkstr);
                    //console.log('mrks[0][0]: ', mrks[0][0]);
                }
                this.mrks = mrks;
				
					if(Number($('.mfilter-country select').val())!=0)			
					{
						scale=Number(dtcntr[$('.mfilter-country select option:selected').val()]['scale']);
						crd=dtcntr[$('.mfilter-country select option:selected').val()]['cord'].split(',');
						coord={ lat: Number(crd[0]), lng: Number(crd[1]) };
						//alert(crd[0]);
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
                    
                }
                if (forceFull && !stateParamsNew.pos) {
                    this.tphWorld = tph;
                    this.mrksWorld = this.mrks;
                    //alert(tph);
                    //console.log('tphsel: ', $('#tphsel').html());
                    console.log('tph: ', tph); //
                    $('#mapsrchvl').typeahead('destroy');
					var tphtxt='$("#mapsrchvl").typeahead({autoSelect:false,source: ['+tph+'],displayField: "Name",valueField: "ID",limit:"20", afterSelect: function (item) { console.log("after selected: ", item); setTimeout(function () { $(\'input[type="button"]#mapsrchbtn,input[type="submit"]#mapsrchbtn\')[0].focus(); }, 100); return item; }, });';
					eval(tphtxt);
                }
                this.firstLoad = false;
                return data;
        }.bind(this), function onFail (err) {
            console.error('[ERR0] ', err);
        }.bind(this));
        
        return this.requestAjax;
    }
    
    genBasicData (i, data_1, dt) {
						if (!dt) {
							dt = [];
						}
						if (!dt[i]) {
							dt[i] = [];
						}
						dt[i]['univ_name']=$.trim(data_1[i]['univ_name']);
						dt[i]['country']=data_1[i]['country'];
						dt[i]['region']=data_1[i]['region'];
						dt[i]['Students']=data_1[i]['Students'];
						dt[i]['Faculty']=data_1[i]['Faculty'];
						dt[i]['FS']=data_1[i]['FS'];
						dt[i]['flag']=data_1[i]['flag'];
						dt[i]['logo']=data_1[i]['logo'];
						dt[i]['loc']=data_1[i]['loc'];
						dt[i]['found']=data_1[i]['found'];
						dt[i]['sh_nm']=data_1[i]['sh_nm'];
						dt[i]['type']=data_1[i]['type'];
						dt[i]['website']=data_1[i]['website'];
                        dt[i]['id_univ']=data_1[i]['id_univ']; ///
						
						var crd=data_1[i]['cord'].split(',');
						dt[i]['lat']=crd[0];
						dt[i]['lng']=crd[1];
						//if(Number(cntr)==45)
						//{alert(dt[i]['lat']);}
						//alert(data_1[i]['cord']+'\n'+dt[i]['lat']+'\n'+dt[i]['lng']);
                        return dt;
    }
    
    genLeagueStyles (i, data_1, dt) {
						dt[i]['nm_page']=data_1[i]['nm_page'];
						dt[i]['O_CR']=data_1[i]['O_CR'];dt[i]['League']=data_1[i]['League'];
						dt[i]['O_WR']=data_1[i]['O_WR'];dt[i]['O_WS']=data_1[i]['O_WS'];
						dt[i]['O_TR']=data_1[i]['O_TR'];dt[i]['O_TS']=data_1[i]['O_TS'];
						dt[i]['O_RR']=data_1[i]['O_RR'];dt[i]['O_RS']=data_1[i]['O_RS'];
						dt[i]['O_IR']=data_1[i]['O_IR'];dt[i]['O_IS']=data_1[i]['O_IS'];
						dt[i]['O_FR']=data_1[i]['O_FR'];dt[i]['O_FS']=data_1[i]['O_FS'];
						
						dt[i]['O_80p']=data_1[i]['O_80p'];
						dt[i]['O_O_s']=data_1[i]['O_O_s'];dt[i]['O_Color1']=data_1[i]['O_Color1'];
						dt[i]['O_Color3']=data_1[i]['O_Color3'];dt[i]['O_Color4']=data_1[i]['O_Color4'];
						
						dt[i]['T_Os']=data_1[i]['T_Os'];dt[i]['T_Color1']=data_1[i]['T_Color1'];
						dt[i]['T_Color3']=data_1[i]['T_Color3'];dt[i]['T_Color4']=data_1[i]['T_Color4'];
						
						dt[i]['R_Os']=data_1[i]['R_Os'];dt[i]['R_Color1']=data_1[i]['R_Color1'];
						dt[i]['R_Color3']=data_1[i]['R_Color3'];dt[i]['R_Color3']=data_1[i]['R_Color3'];
						
						dt[i]['I_Os']=data_1[i]['I_Os'];dt[i]['I_Color1']=data_1[i]['I_Color1'];
						dt[i]['I_Color3']=data_1[i]['I_Color3'];dt[i]['I_Color4']=data_1[i]['I_Color4'];
						
						dt[i]['F_Os']=data_1[i]['F_Os'];dt[i]['F_Color1']=data_1[i]['F_Color1'];
						dt[i]['F_Color3']=data_1[i]['F_Color3'];dt[i]['F_Color4']=data_1[i]['F_Color4'];
						
						switch (dt[i]['League'])
						{
							case 'Diamond League':dt[i]['icon']='diamond';dt[i]['iconurl']='./images_rur/Konf/diamondw.png';break;
				 			case 'Golden League':dt[i]['icon']='gold';dt[i]['iconurl']='./images_rur/Konf/goldw.png';break;
				 			case 'Silver League':dt[i]['icon']='silver';dt[i]['iconurl']='./images_rur/Konf/silverw.png';break;
				 			case 'Bronze League':dt[i]['icon']='bronze';dt[i]['iconurl']='./images_rur/Konf/bronzew.png';break;
				 			case 'Copper League':dt[i]['icon']='cooper';dt[i]['iconurl']='./images_rur/Konf/cooperw.png';break;
				 			case 'World League':dt[i]['icon']='world';dt[i]['iconurl']='./images_rur/Konf/worldw.png';break;
						  	default:dt[i]['icon']='world';dt[i]['iconurl']='./images_rur/Konf/worldw.png';
						}
                        return dt;
    }
    
    genCardInfo (i, data_1, dt) {
						dt[i]['info']='<div id="dt_i' + i + '" style="overflow:auto;font-family:arial; border:2px '+ dt[i]['O_Color1']+ 'solid; border: 2px '+ dt[i]['O_Color1']+ ' solid;padding:10px;padding-right:32px;padding-bottom:16px"><table style="font-family:arial;width:560px;height:300px;border-collapse:collapse" class="style5" border="0"><tbody><tr>';
						dt[i]['info']+='<td style="font-family:arial;text-align:center" rowspan="10" colspan="2"><img src="'+ dt[i]['logo']+ '" style="vertical-align:top;width: 8em;height: 8em;" ></td><td colspan="4" style="font-family:arial;text-align:left"><span style="font-family:arial;color:'+ dt[i]['O_Color1']+ ';font-size:17px"><strong>'+ dt[i]['univ_name']+ '</strong></span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Foundation year:</b></span></td>';
						dt[i]['info']+='<td style="width:98px"><span style="font-size:9pt">'+ dt[i]['found']+ '</span></td>';
						dt[i]['info']+='<td rowspan="9" colspan="2" style="font-family:arial;text-align:center"><img src="'+ dt[i]['flag']+ '" style="vertical-align:top" height="80"><br><span style="font-family:arial;font-size:10px"></span><span style="font-family:arial;color:'+ dt[i]['O_Color1']+ '"><strong></strong></span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Short name:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['sh_nm']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Type:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['type']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Students:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['Students']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Faculty:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['Faculty']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Web-site:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt"><a href="http://'+ dt[i]['website']+ '" target="_blank">'+ dt[i]['website']+ '</a></span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Region:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['region']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Location:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i]['loc']+ '</span></td></tr>';
						dt[i]['info']+='<tr><td colspan="6">&nbsp;</td></tr><tr><td></td><td colspan="4" style="font-family:arial;border-top:'+ dt[i]['O_Color1']+ ' 2px solid"></td><td></td></tr>';
						dt[i]['info']+='<tr><td style="font-family:arial;width:114px;text-align:center" rowspan="6"><div style="font-family:arial;height:85px;width:85px"><img src="'+ dt[i]['O_80p']+ '" style=";width: 5em;height: 5em;" alt=""><br><div style="font-family:arial;color:#fff;font-size:14pt;font-weight:bold;padding-top:25px">'+ dt[i]['O_WR']+ '</div></div>';
						dt[i]['info']+='<div style="font-family:arial;width:80px"><strong><span style="color:'+ dt[i]['O_Color1']+ '"><span style="font-size:13pt">'+ dt[i]['O_WR']+ '</span></span></strong></div><div style="font-family:arial;width:80px"><strong><span style="color:'+ dt[i]['O_Color1']+ '"><span style="font-size:13pt">'+ dt[i]['League']+ '</span></span></strong></div></td>';
						dt[i]['info']+='<td style="font-family:arial;width:50px;height:7px"></td><td class="style6" style="width:110px;height:7px"><span style="font-size:9pt"><b>Dimension</b></span></td><td class="style6" style="font-family:arial;width:98px;height:7px"><span style="font-size:9pt"><b>Rank</b></span></td><td style="font-family:arial;width:63px;height:7px" class="style6"><span style="font-size:9pt"><b>Score</b></span></td><td style="font-family:arial;text-align:center" rowspan="4"><p class="style1"><span style="color:'+ dt[i]['O_Color1']+ '"><strong>Country rank</strong></span></p><p><span style="font-size:12pt"><span style="color:'+ dt[i]['O_Color1']+ '"><strong>'+ dt[i]['O_CR']+ '</strong></span></span></p></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;height:0px"><td colspan="4" style="font-family:arial;border-top:'+ dt[i]['O_Color1']+ ' 2px solid"></td><td></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;background:'+ dt[i]['O_Color4']+ ';height:35px"><td style="font-family:arial;width:50px" class="style1"><img alt="" src="'+ dt[i]['O_O_s']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px"><span style="font-size:9pt">Overall</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_WR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_WS']+ '</span></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;height:20px;background:'+ dt[i]['T_Color4']+ '"><td style="font-family:arial;width:50px"><img alt="" src="'+ dt[i]['T_Os']+ '" style="font-family:arial;float:right"></td><td style="width:110px"><span style="font-size:9pt">Teaching</span></td><td class="style6" style="width:98px"><span style="font-size:9pt">'+ dt[i]['O_TR']+ '</td><td class="style6" style="width:98px"><span style="font-size:9pt">'+ dt[i]['O_TS']+ '</span></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;background:'+ dt[i]['R_Color4']+ '"><td style="font-family:arial;width:50px;height:22px"><img alt="" src="'+ dt[i]['R_Os']+ '" style="font-family:arial;float:right"></td><td style="width:110px;height:30px"><span style="font-size:9pt">Research</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_RR']+ '</td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_RS']+ '</span></td><td style="font-family:arial;text-align:center;background:#ffffff" rowspan="3"><span style="font-family:arial;font-size:10px"><span style="font-family:arial;color:#999999"><a href="'+ leftur + dt[i]['nm_page']+ '.html?sort=O&year='+ (Number(yr)+2009)+ '&subject='+sv+hs+'" target="_blank">View full university profile</a></span></span></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;height:26px;background:'+ dt[i]['I_Color4']+ '"><td style="font-family:arial;width:50px;height:21px"><img alt="" src="'+ dt[i]['I_Os']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Internationalization</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_IR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_IS']+ '</span></td></tr>';
						dt[i]['info']+='<tr style="font-family:arial;background:'+ dt[i]['F_Color4']+ ';height:26px"><td style="font-family:arial;background:#ffffff"></td><td style="font-family:arial;width:50px;height:9px"><img alt="" src="'+ dt[i]['F_Os']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Finances</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_FR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i]['O_FS']+ '</span></td></tr></tbody></table></div>';
						
						//dt[i]['info']=data[4][i];
						//alert(dt[i]['info']);
                        return dt;      
    }

};

class UnivDataController {
    constructor (udtService) {
        if (!udtService) {
            this.udtService = null;
            throw new Error('[ERR] No udtService!');
        }
        this.udtService = udtService;
        this.promise = null;
    }
    
    setForceFull (forceFull) {
        this.forceFull = forceFull;
        return this.forceFull;
    }
    
    getForceFull () {
        return this.forceFull;
    }
    
    getTphWorld () {
        return this.udtService.getTphWorld();
    }
    
    getDtWorld () {
        return this.udtService.getDtWorld();
    }
    
    getDt () {
        return this.udtService.getDt();
    }
    
    getMrks () {
        return this.udtService.getMrks();
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

if (!window.getWorldRating) {
    window.getWorldRating = function getWorldRating (dt, title, i) {
        if (!dt) {
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