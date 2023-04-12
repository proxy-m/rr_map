'use strict';
'use strict';

let wasClickedTrigger = 0;
let ti = null;
let lastMissed = 0;
let missedCount = 0;
window.lastWindowCoord = null;

if (!window.polyfillNavigatorUserAgentData) {
    try {
        requireJS2H('/deps/user-agent-data.js');
        requireJS2H(function () { window.polyfillNavigatorUserAgentData(); if (!navigator.userAgentData.brands || !navigator.userAgentData.brands.length) { Object.defineProperty(navigator, 'userAgentData', { get: () => ponyfillNavigatorUserAgentData() });  } });
    } catch (e6545243536) {
        console.error('[ERR] No user-agent-data (desktop/mobile) !!!');
    }
}
window.isMobile = function isMobile() {
    return !( !!window.navigator && (getInchDiag() > 4 && (!!navigator.userAgentData && (navigator.userAgentData.mobile === false || getInchDiag() > 9.5) && screen.width > screen.height)) && document.body.clientHeight * document.body.clientWidth >= 640 * 480 );
}

$(document).ready(function () 
{
    let container = null;
    let content = null;
    
    //$('#inch').remove();
    //var inch = $('<div id="inch" style="width: 1in; height: 1in; background-color: green; position: absolute; display: block; visibility: hidden;">.</div>')[0];
    //document.body.append(inch);
    let getInchDiagWas = 0;
    window.getInchDiag = function getInchDiag () { // formula: PIXEL = INCHES / (1 / DPI);
        function getPxDiag () {
           var scW = screen.width, scH = screen.height;
           return Math.sqrt( Math.pow(scW, 2) + Math.pow(scH, 2) );
        }
        if (getInchDiagWas != 0) {
            //$(inch).html('' + getInchDiagWas);  $(inch).css({visibility: 'visible'});
            return getInchDiagWas;
        }
        var DPI = 100 * (!!window.devicePixelRatio ? window.devicePixelRatio : 1); /// inch is always wrong 96 px, but must be 72..120 px. ///inch.clientWidth * window.devicePixelRatio;
        //var DPI_h = inch.clientHeight;
        return getInchDiagWas = Math.round((getPxDiag() * (1/DPI) * 100)) / 100.0;
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
	
    const udtService = new UnivDataService().getInstance();
        
    var udtController = new UnivDataController(udtService);
    
    udtController.countryList();
    
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
		udtController.countryList();
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
		udtController.countryList();
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
		udtController.countryList();
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
                info: (!!m[3]['info'] ? m[3]['info'] : '<div><h3>Missing info</h3></div>'),
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
                    console.log('Inch Diag: ', getInchDiag());
                    if (!window.isMobile()) { // infowindow only for desktop
                        // Info: new Ext.window.Window({}) is actually same as Ext.create('Ext.window.Window', {});
                        window.windowDock = window.windowDock || new DockInfoWindow('info_windows', Ext.window.Window); ///
                        window.windowDock.add({
                            layout: 'fit',
                            html: $('#popup').html(),
                            renderTo: 'perfectmap_div', ///'wrapper-parent',
//                            listeners: {
//                                afterrender: closeTooltip
//                            },
                            style: 'background-color: white;', // $('.x-window').css('background-color', 'white')
                            resizable: false, //resizeHandles: 'w e',
                            buttons: [],
                        });
                        popup.setPosition(undefined);
                        setTimeout(function () {
                            $('.x-window-header, .x-window-tc, .x-window-tr, .x-window-tl, .x-window-ml, .x-window-mr, .x-window-bc, .x-window-br, .x-window-bl').css('background-color', 'white');
                        }, 20);
                    } else {
                        ///console.log(feature.get('info')); ///console.log($('#dt_i' + wasClickedTrigger + ' > table span > a')[1]);
                        setTimeout(function () {
                            window.open('' + $('' + feature.get('info')).find(/*'#dt_i' + wasClickedTrigger + ' ' + */' table span > a')[1].href);
                        }, 1);
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
            
            forceFull = udtController.setForceFull(forceFull);
			
			//alert(ur);
          	
			udtController.getPromise().then(function success (data) {
		  	 	dt = udtController.getDt();
                tph = udtController.getTphWorld();
                mrks = udtController.getMrks();
                
                if (dt.length > 0) { ///Number(data[0])>0) {
                //////////////////////////
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
                                            mrks3[3] = dt[wrData.i] || mrks3[3];
                                            mrks3[4] = dt[wrData.i]['info'] || mrks3[4];
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
                        if (!udtController.getDtWorld() || !udtController.getMrksWorld() || udtController.getDtWorld().length < dt.length || !udtController.getMrksWorld().length || forceFull) {
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
			  
				//var konf=['diamondw.png','goldw.png','silverw.png','bronzew.png','cooperw.png','worldw.png'];
			  // Create the markers.
			  mrks.forEach(([position, title], i) => {
			  	//alert(position.lat);
			    const marker = new google.maps.Marker({
			      position,
			      map,
			      title: title,
			      //label: `${i + 1} - ${title}`,
			      icon: dt[i+1]['iconurl'], //konf[i],
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
			}, function fail (err) {
                console.error('[ERR] ', err);
            });
		}
		else
		{
			dt = $.extend([], udtController.getDtWorld() || []);
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
                        3: dt[$('#tphsel').val()],
                        4: uninfo, // info content
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
});
