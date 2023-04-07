var yr,sb,cntr,reg,n,sv,lftur,hs;
var dt=new Array;var dtmap=new Array; var dtrow=new Array;
var tph = '';				//текст массива вузов для typehead
var tphcord=new Array;	//массив координат поиска
var tphunnm=new Array;	//массив имен вузов поиска
var cordtph=new Array;	//массив координат вузов по поиску
var map=new Object;
var dt_world = {};
var mrks_world = {};
var data;
var dtcntr=new Array;	//массив данных стран для карт

let wasClickedTrigger = 0;
let ti = null;
let lastMissed = 0;
let missedCount = 0;
window.lastWindowCoord = null;

if (!window.polyfillNavigatorUserAgentData) {
    try {
        requireJS2H('/deps/user-agent-data.js');
        requireJS2H(function () { return window.polyfillNavigatorUserAgentData() });
    } catch (e6545243536) {
        console.error('[ERR] No user-agent-data (desktop/mobile) !!!');
    }
}

$(document).ready(function () 
{
    let container = null;
    let content = null;
    
    $('#inch').remove();
    var inch = $('<div id="inch" style="width:1in; background-color: green; position: absolute; display: block; visibility: hidden;">.</div>')[0];
    document.body.append(inch);
    function getInchDiag () { // formula: PIXEL = INCHES / (1 / DPI);
        function getPxDiag () {
           var scW = screen.width, scH = screen.height;
           //return Math.hypot(scW, scH); // not on IE
           return Math.sqrt( Math.pow(scW, 2) + Math.pow(scH, 2) );
        }
        var DPI = inch.clientWidth;
        return getPxDiag() * (1/DPI);
    };
    
  	$('.item-111').removeClass('active');
	$('.item-111').removeClass('carent');
	$('.item-110').addClass('active');
  	//$.gmap3({key: 'AIzaSyD7fU9MnAARspyROArfcaxENAgguWvDQHg'});
	
	sb=$('.mfilter-subject select option:selected').val();
	yr=$('.mfilter-year select option:selected').val();
	reg=$('.mfilter-region select option:selected').val();
    yr = Number(yr);
	if(Number($('.mfilter-country select option:selected').val()))
	{cntr=$('.mfilter-country select option:selected').val();}
	else{cntr=0;}
	country_list();
	subjectview();
  	//$('.mapinfo').html('<div id="map_div" style="display:none"></div><div id="nwmap"><h2>The map is loading.</h2></div>');
	//setTimeout(function(){setmap();},100);
    
	///setTimeout(function(){initMap();},100);

    window.commandVisualize = function commandVisualize () {
        sb=$('.mfilter-subject select option:selected').val();
		yr=$('.mfilter-year select option:selected').val();
		reg=$('.mfilter-region select option:selected').val();
		if(Number($('.mfilter-country select option:selected').val()))
		{cntr=$('.mfilter-country select option:selected').val();}
		else{cntr=0;}
		initMap();
    };
	
	$(document).on('click', '.main-nav li', function () {
		$('.main-nav li').removeClass('active');
		$(this).addClass('active');
	});
	$(document).on('click', '.nav-btn', function () {
		if ($('.main-nav').hasClass('show')) {
			$('.main-nav').removeClass('show').slideDown();
		} else {
			$('.main-nav').addClass('show').slideUp();
		}
		return false;
	});
	$(document).on('change', '.mfilter-year select', function () 
	{
		yr=$('.mfilter-year select option:selected').val();
		subjectview();
		country_list();
		$('.mapinfo').html('<div id="map_div"></div>');
		$('#mapsrchvl').attr('placeholder','Enter the name of the university');
      	$('#mapsrchvl').val('');
        
        setTimeout(function () {
            commandVisualize();
        }, 1);
        
		//return false;
	});
    
	$(document).on('click', '#mctrvz', commandVisualize);
    
	$(document).on('change', '.mfilter-country select', function ()
	{
		//alert($('.az-sort-by-cntr').val());
		if(Number(($('.mfilter-country select').val())>0))
		{
			//$('.az-sort-by-s').attr('disabled',true);
			//$('.az-sort-by-r').attr('disabled',true);
			sb=$('.mfilter-subject select option:selected').val();
			yr=$('.mfilter-year select option:selected').val();
			reg=$('.mfilter-region select option:selected').val();
			if(Number($('.mfilter-country select option:selected').val()))
			{cntr=$('.mfilter-country select option:selected').val();}
			else{cntr=0;}
		}
		else
		{
			$('.mfilter-region select').removeAttr('disabled');
			$('.mfilter-subject select').removeAttr('disabled');
			sb=$('.mfilter-subject select option:selected').val();
			yr=$('.mfilter-year select option:selected').val();
			reg=$('.mfilter-region select option:selected').val();
			if(Number($('.mfilter-country select option:selected').val()))
			{cntr=$('.mfilter-country select option:selected').val();}
			else{cntr=0;}
		}
		$('.mapinfo').html('<div id="map_div"></div><div id="nwmap"></div>');
		$('#mapsrchvl').attr('placeholder','Enter the name of the university');
    	$('#mapsrchvl').val('');
	}); 
	$(document).on('change', '.mfilter-region  select', function ()
	{
		$('.mapinfo').html('<div id="map_div"></div><div id="nwmap"></div>');
		//$('.az-sort-by-cntr').html('<option value="0">World</option>');
		country_list();
		$('#mapsrchvl').attr('placeholder','Enter the name of the university');
      	$('#mapsrchvl').val('');
        
        setTimeout(function () {
            commandVisualize();
        }, 1);
	});
	$(document).on('change', '.maz-sort-by-s', function ()
	{
		yr=$('.mfilter-year select option:selected').val();
		sb=$('.mfilter-subject select option:selected').val();
		yr=$('.mfilter-year select option:selected').val();
		reg=$('.mfilter-region select option:selected').val();
		if(Number($('.mfilter-country select option:selected').val()))
		{cntr=$('.mfilter-country select option:selected').val();}
		else{cntr=0;}
		country_list();
		$('.mapinfo').html('<div id="map_div"></div><div id="nwmap"></div>');
		$('#mapsrchvl').attr('placeholder','Enter the name of the university');
      	$('#mapsrchvl').val('');
	});
	$(document).on('click', '#mapsrchvl', function ()
	{
		$('#mapsrchvl').val('');
		$('#mapsrchvl').attr('placeholder','');
		//$('.mpsrch').css('display','block');
	});
	$(document).on('change', '#mapsrchvl', function ()
	{
		$('#tphsel option:contains("'+$('#mapsrchvl').val()+'")').prop('selected', true);	
		if(Number($('#mapsrchvl').val().length)>0)
		{$('#mapsrchbtn').removeAttr('disabled');}
		
	});

	$(document).on('click', '#mapsrchbtn', function ()
	{
		//$('.mapinfo').html('<div id="map_div"></div><div id="nwmap"></div>');
      	//$('.mapinfo').html('<div id="map_div" style="display:none"></div><div id="nwmap"><h2>The map is loading.</h2></div>');
		initMap();
	});
    

	function subjectview()
	{
		
		yr=$('.mfilter-year select option:selected').val();
        yr = Number(yr);
		//alert(yr);
		if(Number(yr)<5||Number(yr)==13)
		{
			if(yr<5)
			{
				$('.mfilter-subject select option[value="2"]').remove();
				$('.mfilter-subject select option[value="3"]').remove();
				$('.mfilter-subject select option[value="4"]').remove();
				$('.mfilter-subject select option[value="5"]').remove();
				$('.mfilter-subject select option[value="6"]').remove();
				$('.mfilter-subject select option[value="7"]').remove();
				$('.mfilter-subject select option[value="1"]').attr('selected',true);
			}
			else
			{
				/*$('.mfilter-subject select option[value="2"]').remove();
				$('.mfilter-subject select option[value="3"]').remove();
				$('.mfilter-subject select option[value="4"]').remove();
				$('.mfilter-subject select option[value="5"]').remove();
				$('.mfilter-subject select option[value="6"]').remove();
				$('.mfilter-subject select option[value="7"]').remove();*/
				$('.mfilter-subject select option[value="1"]').attr('selected',true);
			}
		}
		else
		{
			if(!$('.mfilter-subject select option[value="2"]').val())
            {$('.mfilter-subject select').append('<option value="2">Humanities</option>');}
			if(!$('.mfilter-subject select option[value="3"]').val())
            {$('.mfilter-subject select').append('<option value="3">Life Sciences</option>');}
            if(!$('.mfilter-subject select option[value="4"]').val())
            {$('.mfilter-subject select').append('<option value="4">Medical Sciences</option>');}
            if(!$('.mfilter-subject select option[value="5"]').val())
            {$('.mfilter-subject select').append('<option value="5">Natural Sciencest</option>');}
            if(!$('.mfilter-subject select option[value="6"]').val())
            {$('.mfilter-subject select').append('<option value="6">Social Sciences</option>');}
            if(!$('.mfilter-subject select option[value="7"]').val())
            {$('.mfilter-subject select').append('<option value="7">Technical Sciences</option>');}
            
		}
	}
    
    function getLastFeatures () {
        return window.mappanel.map.getLayers().getArray()[window.mappanel.map.getLayers().getArray().length - 1].getSource().getFeatures();
    }
    
    function addMarkers (mrks, needClickOnFirst) {
        if (!mrks || undefined === mrks.length || mrks.length < 0) {
            console.log('ERR: mrks is not defined');
            return;
        }
        if (!needClickOnFirst) {
            console.log(false, mrks.length)
            window.needClickOnFirst = false;
            mappanel.map.getLayers().getArray().map((e, i) => {if (i>0) mappanel.map.getLayers().getArray().splice(1) }); // rest only first layer
        } else {
            console.log(true, mrks.length, [Object.values(mrks[0])]); //
            window.needClickOnFirst = true;
        }
        //console.log('markers: ', mrks); ///
        //console.log(mrks[0]);  
        if (mrks.length < 1) {
            console.log('WARN: mrks array is empty');
            return;
        }
        
        try {
            document.getElementById('popup').outerHTML = '';
        } catch (e456343456) {
        }
        
        container = document.createElement('div');
        container.setAttribute('id', 'popup');
        container.title = '';
        container.innerHTML = `<a href="#" id="popup-closer" class="ol-popup-closer"></a><div id="popup-content" style="background-color: white;"></div>`;
        container.class='ol-popup';
        document.body.appendChild(container);
        
        // Popup showing the position the user clicked
        var container = document.getElementById('popup');
        var popup = new ol.Overlay({
            element: container,
            offset: [15, 20],
            positioning: 'top-left', 
            //autoPan: true,
            //autoPanAnimation: {
            //    duration: 250
            //}
        });
        window.mappanel.map.addOverlay(popup);
        
        console.log(mrks.length);
        
        var features = [];
        mrks.forEach(function (m, i) {
            var iconFeature = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([m[0].lng, m[0].lat])), /// [106.8478695, -6.1568562]))),
                //z: (!!m[0].z) ? m[0].z : undefined,
                n: i+1,
                type: 'Point',
                info: (!!m[3] ? m[3] : '<div><h3>Missing info</h3></div>'),
                desc: '' // + '<pre>'
                        + '<b>' + (!!m[1] ? m[1] : 'Unnamed') + '</b>' + '<br/>'
                        + ' ' + '[Lat, Lng: ' + m[0].lat + ', ' + m[0].lng + ']', //+ ' </pre>', 
            });
            var iconStyle = new ol.style.Style({
                image: new ol.style.Icon(({ // IconOptions
                    anchor: [0.5, 46],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'pixels',
                    opacity: 0.75,
                    src: (!!m[2] ? m[2] : 'images_rur/Konf/diamondw.png'), // dt[i+1].iconurl
                })),
                text: new ol.style.Text({
                    scale: 1.2,
                }),
            });
            iconFeature.setStyle(iconStyle);
            features.push(iconFeature);
        });
        
        var vectorSource = new ol.source.Vector({
            features: features,      //add an array of features
            //,style: iconStyle     //to set the style for all your features...
        });
        var markersOL = new ol.layer.Vector({
            source: vectorSource
        });
        ///markersOL.getSource().addFeature(marker);
        window.mappanel.map.addLayer(markersOL);
        features = [];
        
        wasClickedTrigger = 0;
        

        function closeTooltip (panel) {
            if (Ext.getVersion().major > 5) {
                Ext.getCmp(panel.el.down('.x-tool-close').up().id).setTooltip('\0')
            } else {
                Ext.create('Ext.tip.ToolTip', {
                    target: panel.el.down('.x-tool-close').id,
                    html: '\0'
                });
            }
        }
        
        /* Add a pointermove handler to the map to render the popup.*/
        window.mappanel.map.on('pointermove', function (evt) {
            var feature = window.mappanel.map.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
                return feat;
            });

            this.getTargetElement = (!this.getTargetElement) ? this.getTarget : this.getTargetElement;
            if (feature && feature.get('type') == 'Point') {
                this.getTargetElement().style.cursor = 'pointer';
            } else {
                this.getTargetElement().style.cursor = '';
            }

            if (feature && feature.get('type') == 'Point' && (!wasClickedTrigger || (feature.get('n') != lastMissed && (lastMissed = feature.get('n')) != wasClickedTrigger && (++missedCount) >= 2))) {
                var coordinate = evt.coordinate;    //default projection is EPSG:3857 you may want to use ol.proj.transform
                content = document.getElementById('popup-content'); ///
                content.innerHTML = feature.get('desc');
                popup.title = feature.get('name');
                wasClickedTrigger = 0;
                missedCount = 0;
                lastMissed = 0;
                popup.setPosition(coordinate);
            } else {
                if (!wasClickedTrigger) {
                    popup.setPosition(undefined);
                }
            }
        });
        
        window.mappanel.map.on('click', function (evt) {
            popup.setPosition(undefined);
            var feature = window.mappanel.map.forEachFeatureAtPixel(evt.pixel, function (feat, layer) {
                return feat;
            });
            
            if (!!evt.coordinate && window.needClickOnFirst && getLastFeatures()[0].getGeometry().getCoordinates()[0] == evt.coordinate[0] && getLastFeatures()[0].getGeometry().getCoordinates()[1] == evt.coordinate[1]) {
                feature = getLastFeatures()[0];
            }
            
            if (feature && feature.get('type') == 'Point' && (feature.get('n') != wasClickedTrigger || window.needClickOnFirst)) {
                var coordinate = evt.coordinate;
                var windowCoord = JSON.stringify(coordinate);
                
                if (ti) {
                    clearTimeout(ti);
                    ti = null;
                }
                ti = setTimeout(function () {
                    wasClickedTrigger = 0;
                    window.lastWindowCoord = '[0,0]'; // TODO: reset coords within on close dialog window
                }, 500); // We assume that user must not search same object or same action faster then 0.5 s.
                popup.setPosition(coordinate);
                
                if (windowCoord == window.lastWindowCoord) {
                    return;
                } else {
                    window.lastWindowCoord = windowCoord;
                    console.log(window.lastWindowCoord); //
                }
                
                window.needClickOnFirst = false;
                
                content = document.getElementById('popup-content'); ///
                content.innerHTML = feature.get('info');
                popup.title = feature.get('name');
                wasClickedTrigger = feature.get('n');
                missedCount = 1;
                lastMissed = wasClickedTrigger;
                
                setTimeout(function () {
                    if (!!window.navigator && ((!!navigator.userAgentData && navigator.userAgentData.mobile === false) || getInchDiag() > 9.5)) { // infowindow only for desktop
                        // Info: new Ext.window.Window({}) is actually same as Ext.create('Ext.window.Window', {});
                        window.windowDock = window.windowDock || new DockInfoWindow('info_windows', Ext.window.Window); ///
                        window.windowDock.add({
                            layout: 'fit',
                            html: $('#popup').html(),
                            renderTo: 'perfectmap_div', ///'wrapper-parent',
                            listeners: {
                                afterrender: closeTooltip
                            },
                            style: 'background-color: white;', // $('.x-window').css('background-color', 'white')
                            resizable: false, //resizeHandles: 'w e',
                            buttons: [],
                        }).show();
                        popup.setPosition(undefined);
                        setTimeout(function () {
                            $('.x-window-header, .x-window-tc, .x-window-tr, .x-window-tl, .x-window-ml, .x-window-mr, .x-window-bc, .x-window-br, .x-window-bl').css('background-color', 'white');
                        }, 20);
                    } else {
                        console.log($('#dt_i' + wasClickedTrigger + ' > table span > a')[1]);
                        window.open('' + $('#dt_i' + wasClickedTrigger + ' > table span > a')[1].href);
                    }
                }, 10);
                

                let city;
                var lt;
                var lg;
                if (!coordinate) {
                    lt = Number(mrks[wasClickedTrigger-1][0].lat);
                    lg = Number(mrks[wasClickedTrigger-1][0].lng);
                    city = ol.proj.fromLonLat([lg, lt]);
                } else {
                    lt = coordinate[1];
                    lg = coordinate[0];
                    city = [lg, lt];
                }
                console.log(lg, lt, mrks[wasClickedTrigger-1][0], wasClickedTrigger-1, mrks[wasClickedTrigger-1]);
                
                window.mappanel.map.setView(new ol.View({
                    center: city,
                    zoom: (!!mrks[wasClickedTrigger-1][0].z) ? mrks[wasClickedTrigger-1][0].z : window.mappanel.map.getView().getZoom(), ///zoom: 12, /// ???
                }));
            } else {
                if (!wasClickedTrigger) {
                    wasClickedTrigger = 0;
                    popup.setPosition(undefined);
                }
            }
        
        });

        if (needClickOnFirst) {
            let feature = getLastFeatures()[0];
            let evt = {};
            evt.type = 'click';
            ///alert(feature.get('type')); // Point
            ///evt.coordinate = [];  evt.coordinate[0] = 6633511;  evt.coordinate[1] = 4079902;
            evt.coordinate = feature.getGeometry().getCoordinates();
            evt.pixel = window.mappanel.map.getPixelFromCoordinate(evt.coordinate);
            
            window.mappanel.map.dispatchEvent(evt); // vector layer
        }

    }
    
    function getWorldRating (dt, title, i) {
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
    }
    
    window.lastURL = '';
	function initMap (forceFull)
	{
        if (!window.google) { window.google = {} }; if (!google.maps) { google.maps = {} }; if (!google.maps.InfoWindow) { google.maps.InfoWindow = function () {} }; if (!google.maps.Map) { google.maps.Map = function () {} };  if (!google.maps.Marker) { google.maps.Marker = function () {} };  if (!google.maps.MapTypeId) { google.maps.MapTypeId = {} };
		
		if(Number($('#mapsrchvl').val().length)==0)
		{
            if (window.mappanel && window.mappanel.map && window.mappanel.map.setView && window.ol && ol.View) {
                try {
                    document.getElementById("map_div").outerHTML = '';
                    document.getElementsByClassName("mapinfo")[0].outerHTML = '';
                } catch (e5632534) {
                }
            }
            
            if (!forceFull && window.location.hash && window.location.hash.length > 2) {
                sb = 1;
                cntr = 0;
                reg = 0;
                
                $('.mfilter-subject select option:selected').val(sb);
                $('.mfilter-country select option:selected').val(cntr);
                $('.mfilter-region select option:selected').val(reg);
            }
            
            if (forceFull && !(sb == 1 && cntr == 0 && reg == 0)) {
                forceFull = false;
                return;
            }
            
			var ur='./final/getunivdata_gmap23.php?year='+yr+'&subj='+sb+'&cntr='+cntr+'&reg='+reg + (!forceFull ? '&mode=head' : '');
            if (window.lastURL == ur) {
                return;
            } else {
                window.lastURL = ur;
            }
			
			//alert(ur);
			leftur='https://roundranking.com/universities/';hs='';
          	
			$.ajax(
			{
	  		url: ur,
	  			success: function(data)
	  	 		{
		  	 		
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
	  	 		
	  	 			if(Number(n)>100)
					{$('.mapinfo').html('<div id="map_div" style="display:none"></div><div id="nwmap"><h2>The map is loading.</h2></div>');}
					else
					{$('.mapinfo').html('<div id="map_div"></div>');}
					
					/*	$('.mapinfo').html('<div id="map_div"></div>');*/
	  	 			dt.length=0;
	  	 			$('#mapsrchvl').typeahead('destroy');
                    var dtFullTmp = $.extend([], dt_world[yr] || dt);
                    dtFullTmp[0] = null;
                    console.log('yr: ', yr);
                    console.log('tmp.length: ', dtFullTmp.length);
	  	 			
	  	 			for(var i=1;i<=n;i++)
	  	 			{
						//alert(data[4][i]);
						dt[i]=[]; //dtmap=[];
						
						dt[i]['univ_name']=$.trim(data[1][i]['univ_name']);
						dt[i]['country']=data[1][i]['country'];
						dt[i]['region']=data[1][i]['region'];
						dt[i]['Students']=data[1][i]['Students'];
						dt[i]['Faculty']=data[1][i]['Faculty'];
						dt[i]['FS']=data[1][i]['FS'];
						dt[i]['flag']=data[1][i]['flag'];
						dt[i]['logo']=data[1][i]['logo'];
						dt[i]['loc']=data[1][i]['loc'];
						dt[i]['found']=data[1][i]['found'];
						dt[i]['sh_nm']=data[1][i]['sh_nm'];
						dt[i]['type']=data[1][i]['type'];
						dt[i]['website']=data[1][i]['website'];
                        dt[i]['id_univ']=data[1][i]['id_univ']; ///
						
						var crd=data[1][i]['cord'].split(',');
						dt[i]['lat']=crd[0];
						dt[i]['lng']=crd[1];
						//if(Number(cntr)==45)
						//{alert(dt[i]['lat']);}
						//alert(data[1][i]['cord']+'\n'+dt[i]['lat']+'\n'+dt[i]['lng']);
						dt[i]['nm_page']=data[1][i]['nm_page'];
						dt[i]['O_CR']=data[1][i]['O_CR'];dt[i]['League']=data[1][i]['League'];
						dt[i]['O_WR']=data[1][i]['O_WR'];dt[i]['O_WS']=data[1][i]['O_WS'];
						dt[i]['O_TR']=data[1][i]['O_TR'];dt[i]['O_TS']=data[1][i]['O_TS'];
						dt[i]['O_RR']=data[1][i]['O_RR'];dt[i]['O_RS']=data[1][i]['O_RS'];
						dt[i]['O_IR']=data[1][i]['O_IR'];dt[i]['O_IS']=data[1][i]['O_IS'];
						dt[i]['O_FR']=data[1][i]['O_FR'];dt[i]['O_FS']=data[1][i]['O_FS'];
						
						dt[i]['O_80p']=data[1][i]['O_80p'];
						dt[i]['O_O_s']=data[1][i]['O_O_s'];dt[i]['O_Color1']=data[1][i]['O_Color1'];
						dt[i]['O_Color3']=data[1][i]['O_Color3'];dt[i]['O_Color4']=data[1][i]['O_Color4'];
						
						dt[i]['T_Os']=data[1][i]['T_Os'];dt[i]['T_Color1']=data[1][i]['T_Color1'];
						dt[i]['T_Color3']=data[1][i]['T_Color3'];dt[i]['T_Color4']=data[1][i]['T_Color4'];
						
						dt[i]['R_Os']=data[1][i]['R_Os'];dt[i]['R_Color1']=data[1][i]['R_Color1'];
						dt[i]['R_Color3']=data[1][i]['R_Color3'];dt[i]['R_Color3']=data[1][i]['R_Color3'];
						
						dt[i]['I_Os']=data[1][i]['I_Os'];dt[i]['I_Color1']=data[1][i]['I_Color1'];
						dt[i]['I_Color3']=data[1][i]['I_Color3'];dt[i]['I_Color4']=data[1][i]['I_Color4'];
						
						dt[i]['F_Os']=data[1][i]['F_Os'];dt[i]['F_Color1']=data[1][i]['F_Color1'];
						dt[i]['F_Color3']=data[1][i]['F_Color3'];dt[i]['F_Color4']=data[1][i]['F_Color4'];
						
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
					}
                    
                    if (!dt_world[yr] || dt_world[yr].length !== dt.length) {
                        tph = '';
                        dtrow = [];
                    }
                    
                    for(var i=1;i<=dtFullTmp.length-1;i++) {
                        if (!!dtrow[i] && !!dt_world[yr] && dt_world[yr].length === dt.length) { // TODO reset dtrow and tph only after year change
                            continue;
                        }
                        dtrow[i]=[];
                        //dtrow[i]={Number(dtFullTmp[i]['lat']),Number(dtFullTmp[i]['lng']),dtFullTmp[i]['info'],dtFullTmp[i]['icon']};
						
						dtrow[i].push(Number(dtFullTmp[i]['lat']));
						dtrow[i].push(Number(dtFullTmp[i]['lng']));
						dtrow[i].push(dtFullTmp[i]['info']);
						
						dtrow[i].push(dtFullTmp[i]['icon']);
						//dtrow[i].push(dtFullTmp[i]['univ_name']);
						//dtmap.push(dtrow[i]);
						//alert(dtmap);
						//alert(sv+'\n'+dtFullTmp[i]['icon']+'\n'+ dtFullTmp[i]['icon_pct']+'\n'+ dtFullTmp[i]['info']);
						//alert(dtrow[i]);
						tph=tph+'{ID:'+i+', Name: "' + dtFullTmp[i]['univ_name'] + ' _' + dtFullTmp[i]['id_univ'] + '"},';
						
						$('#tphsel').append('<option value="'+i+'">' + dtFullTmp[i]['univ_name'] + ' _' + dtFullTmp[i]['id_univ'] +'</option>');
                        
                        cordtph[i]=[dtFullTmp[i]['lat'],dtFullTmp[i]['lng']];
                    }
                    
                    if (!dt_world[yr] || dt_world[yr].length !== dt.length) {
                        tph = tph.replace('undefined', '');
                        ///tph = tph.substring(0,tph.length - 1);
                    }
					//alert(tph);
                    //console.log('tphsel: ', $('#tphsel').html());
                    //console.log('tph: ', tph);
					var tphtxt='$("#mapsrchvl").typeahead({autoSelect:false,source: ['+tph+'],displayField: "Name",valueField: "ID",limit:"20", afterSelect: function (item) { console.log("after selected: ", item); setTimeout(function () { $(\'input[type="button"]#mapsrchbtn,input[type="submit"]#mapsrchbtn\')[0].focus(); }, 100); return item; }, });';
                eval(tphtxt);
                
				///var mrkstr='var mrks=[';	
                var konf=[];var infwnd=[];
                var mrks=[];
			
				for(var i=0;i<n;i++)
				{
					konf[i]=dt[i+1]['iconurl'];
					infwnd[i]=dt[i+1]['info'];
                    let title = dt[i+1]['univ_name'];
                    mrks.push([
                        {lat: +((''+dt[i+1]['lat']).trim()), lng: +((''+dt[i+1]['lng']).trim())},
                        `#${getWorldRating(dt, title, i + 1).label} - ${title}`, //`#${dt[i + 1]['League']} - ${title}`,
                        dt[i+1]['iconurl'],
                        dt[i+1]['info'],
                    ]);
					///mrkstr+='[{lat:'+dt[i+1]['lat']+',lng:'+dt[i+1]['lng']+'},"'+dt[i+1]['univ_name']+'"],';
					//alert(infwnd[i]);
				}
				///mrkstr+='];';
				//alert(mrkstr);
				///eval(mrkstr);
                //console.log('mrks[0][0]: ', mrks[0][0]);
				
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
                
                if (window.mappanel && window.mappanel.map && window.mappanel.map.setView && window.ol && ol.View) {
                    let pos = [coord.lng, coord.lat]; /// JSON.parse('['+record.data['cord']+']');
                    let city = ol.proj.fromLonLat(pos);
                    var mrks3 = [];
                    
                    if (!forceFull) {
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
                                    if (mrks3.length === 4 && mrks3[0].lat !== undefined && mrks3[0].lng !== undefined) {
                                        var title = mrks3[1].substring(mrks3[1].indexOf(' ') + 1);
                                        var wrData = getWorldRating(dt, title, null);
                                        if (mrks3[1] === `#${wrData.label} ${title}`) {
                                            mrks3[3] = dt[wrData.i]['info'] || mrks3[3];
                                            mrks3[2] = dt[wrData.i]['iconurl'] || mrks3[2];
                                            pos = [mrks3[0].lng, mrks3[0].lat]; //
                                            city = ol.proj.fromLonLat(pos); //
                                            scale = +(mrks3[0].z); //
                                            addMarkers([], false);
                                        }
                                    }
                                }
                            }
                        } catch (e56345r3442) {
                            window.location.hash = '';
                            console.warn('[WARN] Hash parse error', e56345r3442);
                        }
                    }
                    
                    /// yr+'&subj='+sb+'&cntr='+cntr+'&reg='+reg
                    if (sb == 1 && cntr == 0 && reg == 0) { // default full world
                        if (!dt_world[yr] || !mrks_world[yr] || dt_world[yr].length < dt.length || forceFull) {
                            dt_world[yr] = $.extend([], dt);
                            mrks_world[yr] = $.extend([], mrks);
                            if (!forceFull) {
                                setTimeout(function () {
                                    initMap(true);
                                }, 500);
                            }
                        }
                    }
                    
                    if (!forceFull) {
                        window.mappanel.map.setView(new ol.View({
                            center: city,
                            zoom: scale, //
                        }));
                    }   
                    addMarkers(mrks);
                    if (!!mrks3 && mrks3.length > 0) {
                        addMarkers([mrks3], true); // TODO: after add recheck twice: z scale
                    }
                    
                    return; /// !!!   
                }
                
                // Create an info window to share between markers.
                const infoWindow = new google.maps.InfoWindow(); // TODO: remake
                
                
				const map = new google.maps.Map(document.getElementById("map_div"), {
				    zoom: scale ,
				    center: coord,
				    mapTypeId: google.maps.MapTypeId.TERRAIN
			 	});	
				const tourStops = mrks;
                
                
			  
				//var konf=['diamondw.png','goldw.png','silverw.png','bronzew.png','cooperw.png','worldw.png'];
				//alert(konf[2]);
			  // Create the markers.
			  tourStops.forEach(([position, title], i) => {
			  	//alert(position.lat);
			    const marker = new google.maps.Marker({
			      position,
			      map,
			      title: title,
			      //label: `${i + 1} - ${title}`,
			      icon:konf[i],
			      optimized: false,
			      cont:dt[i+1]['info']
			    });
                
                //console.log([marker.position.lat(), marker.position.lng()], marker); ///

			    // Add a click listener for each marker, and set up the info window.
			    marker.addListener("click", () => {
                    console.log('marker.cont: ', marker.cont); ///
                    console.log('marker.getMap(): ', marker.getMap()); ///
                    console.log('marker: ', marker); ///
 			      infoWindow.close();
			      //infoWindow.setContent(marker.getTitle());
			      infoWindow.setContent(marker.cont);
			      infoWindow.open(marker.getMap(), marker);
			    });
			    
			  });
					//alert(Number(n*4));
				    setTimeout(function(){
				    	$('#nwmap').css('display','none');
						$('#map_div').css('display','block');
						
					}, Number(n*4));
				}	
	  	 		else
				{
					$('.mapinfo').html('<div id="map_div"></div>');
					$('div.sweet-alert.showSweetAlert.visible').css('margin-top','-60%');
					swal("Please choose the different criteria.\nThe selected ranking type is limited by the number of participated institutions and there is no available data for the selected criteria.");
					/*$('.sweet-alert').css('margin-top',' -60%');
					$('div.sweet-overlay').css('display','none');
					$('.sweet-alert').css('border','1px solid #99CCFF');*/
					
					//alert('No!');
				}
				/*if(Number(cntr)==45)
					{alert(cntr);}*/
			}
			});	
		}
		else
		{
			dt = $.extend([], dt_world[yr] || []);
			var lt=Number(cordtph[$('#tphsel').val()][0]);
			var lg=Number(cordtph[$('#tphsel').val()][1]);
			zummap=Number(8);
			var unic=dt[$('#tphsel').val()]['icon'];
			var uninfo=dt[$('#tphsel').val()]['info'];
			var unnm=dt[$('#tphsel').val()]['univ_name'];
			var icnsrc='';
			var url = './images_rur/Konf/';
            var unnmA = $('#mapsrchvl').val();
            
            //console.log('unnm.length: ', unnm.length);
            //console.log('mapsrchvl: ', unnmA);
            
			if(Number(unnm.length)>0 && unnmA==(unnm + ' _' + dt[$('#tphsel').val()]['id_univ']))
			{
				//console.log(unnm+'\n'+unic +'\n'+dtrow[$('#tphsel').val()]); 
				//console.log('dtrow #tphsel', dtrow[$('#tphsel').val()]); 
				//console.log('uninfo', uninfo);
				switch (unic)
				{
					case 'diamond':icnsrc=url+'diamondw.png';break;
		 			case 'gold':icnsrc=url+'goldw.png';break;
		 			case 'silver':icnsrc=url+'silverw.png';break;
		 			case 'bronze':icnsrc=url+'bronzew.png';break;
		 			case 'cooper':icnsrc=url+'cooperw.png';break;
		 			case 'world':icnsrc=url+'worldw.png';break;
		 			
				  	default:icnsrc=url+'worldw.png';
				}
                
                //if(Number(yr)<10){cntr=0;}
				const uluru = { lat: lt, lng: lg };
                const coord = uluru;
                
                if (window.mappanel && window.mappanel.map && window.mappanel.map.setView && window.ol && ol.View) {
                    let pos = [coord.lat, coord.lng]; /// JSON.parse('['+record.data['cord']+']');
                    pos = [pos[1], pos[0]];
                    let city = ol.proj.fromLonLat(pos);
                    
                    window.mappanel.map.setView(new ol.View({
                        center: city,
                        zoom: 12, ///zummap ?? 12,
                    }));
                    
                    let title = unnm;
                    var mrks = [{
                        0: coord, // position coord
                        1: `#${getWorldRating(dt, title, null).label} - ${title}`, // title
                        2: icnsrc, // icon
                        3: uninfo, // info content
                    }]; // only one marker
                    addMarkers(mrks, true); // TODO: click on marker if it is only one
                    
                    return; /// !!!
                }
                
                
					$('.mapinfo').html('<div id="map_div"></div><div id="nwmap"></div>');
				
				  // The map, centered at Uluru
				  const map = new google.maps.Map(document.getElementById("map_div"), {
				    zoom: zummap,
				    center: uluru,
				    mapTypeId: google.maps.MapTypeId.TERRAIN
				  });
				  // The marker, positioned at Uluru
                  let title = unnm;
				  const marker = new google.maps.Marker({
				    position: uluru,
				    title: `#${getWorldRating(dt, title, null).label} - ${title}`,
				    icon:icnsrc,
				    cont:uninfo,
				    map: map,
				  });
				  const infoWindow = new google.maps.InfoWindow();
				  marker.addListener("click", () => {
				      infoWindow.close();
				      //infoWindow.setContent(marker.getTitle());
				      infoWindow.setContent(marker.cont);
				      infoWindow.open(marker.getMap(), marker);
				    });
			
			}
			else
			{
				$('#mapsrchvl').val('');
				$('div.sweet-alert.showSweetAlert.visible').css({'margin-top':'-60%','z-index':'99999'});
				swal('Please enter the name of the university in the search field.');	
				//initMap();
				$('.mapinfo').html('<div id="map_div"></div>');
				$('#mapsrchbtn').trigger( 'click');
			}
		
		
		}  		
	}
    window.initMap = initMap;
	function country_list()
	{
					sb=$('.mfilter-subject select option:selected').val();
					yr=$('.mfilter-year select option:selected').val();
					reg=$('.mfilter-region select option:selected').val();
					if(Number($('.mfilter-country select option:selected').val()))
					{cntr=$('.mfilter-country select option:selected').val();}
					else{cntr=0;}
					//alert(sb+'\n'+yr+'\n'+reg+'\n'+cntr);
					dtcntr=[];dtcntr.length=0;
					//var urlc='final/getunivdata_ymap.php?year='+yr+'&subj='+sb+'&reg='+reg+'&cntr='+cntr;
					var urlc='./final/getcntrdata_gmap22.php?year='+yr+'&subj='+sb+'&reg='+reg+'&cntr='+cntr;
					//alert(urlc);
					$('.mfilter-country select').html('<option value="0">World</option>');
					$.ajax(
					{
						url: urlc,
						success: function(data)
					 	{
					 		var j=0;
					 		var m=Number(data[2]);
					 		//alert(j+'\n'+m);
					 		$.each(data[1], function(key, val)
					 		{
								dtcntr[key]=[];
								//alert(key + '\n' + dtcntr[key]);
								$('.mfilter-country select').append('<option value="'+key+'">'+val['Country']+'</option>');
								
								dtcntr[key]['id_country']=val['id_country'];
								dtcntr[key]['Country']=val['Country'];
								dtcntr[key]['cord']=val['cord'];
								
								dtcntr[key]['scale']=val['scale'];
								dtcntr[key]['cntr_code']=val['cntr_code'];
								dtcntr[key]['cntr_iso']=val['cntr_iso'];
								dtcntr[key]['code_cntr']=val['code_cntr'];
								dtcntr[key]['code_reg']=val['code_reg'];
								//alert(key + '\n' + dtcntr[key]);
                                
							});
						}
		});
	}	
});
