/* global Ext, ol */
/* jshint browser:true, devel:true, indent: 4 */

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.form.*',
    'Ext.layout.container.Border'
]);

let dt = [];
let tph;

Ext.onReady(() => {

    let wasClickedTrigger = 0;
    let ti = null;
    let lastMissed = 0;
    let missedCount = 0;
    window.lastWindowCoord = null;

    let container = null;
    let content = null;
    
    function rgbToHex (r, g, b) {
        return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
    }
    
    function hexToRgb (hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    function addMarkers (mrks, needClickOnFirst) {
        if (!mrks || !mrks.length || mrks.length < 1) {
            console.log('ERR: mrks is not defined');
            return;
        }
        if (!needClickOnFirst) {
            window.needClickOnFirst = false;
            mappanel.map.getLayers().getArray().map((e, i) => {if (i>0) mappanel.map.getLayers().getArray().splice(1) }); // rest only first layer
        } else {
            window.needClickOnFirst = true;
        }
        //console.log('markers: ', mrks); ///
        //console.log(mrks[0]);    
        
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
            //console.log(dt[i+1]);
            
            var iconFeature = new ol.Feature({
                ///geometry: new ol.geom.Point(ol.proj.transform([106.8478695, -6.1568562], 'EPSG:4326', 'EPSG:3857'))
                geometry: new ol.geom.Point(ol.proj.fromLonLat([m[0].lng, m[0].lat])), /// [106.8478695, -6.1568562]))),
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
                    Ext.create('Ext.window.Window', {
                        layout: 'fit',
                        html: $('#popup').html(),
                        renderTo: 'perfectmap_div',
                        listeners: {
                            afterrender: closeTooltip
                        },
                        style: 'background-color: white;', // $('.x-window').css('background-color', 'white')
                        resizable: false, //resizeHandles: 'w e',
                        buttons: [],
                        tools: [{
                            type:'refresh',
                            tooltip: null,
                            handler: function (event, toolEl, panel) {
                            }
                        },
                        ]
                    }).show();
                    popup.setPosition(undefined);
                    setTimeout(function () {
                        $('.x-window-header, .x-window-tc, .x-window-tr, .x-window-tl, .x-window-ml, .x-window-mr, .x-window-bc, .x-window-br, .x-window-bl').css('background-color', 'white');
                    }, 20);
                }, 10);
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
        return dt[i]['O_WR'];
    }

    
Ext.application({
    name: 'OL3EXT6',
    launch: function () {
        var programStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '/all/pro/roundranking/data-router.php?key=tk34hdrfv&format=json&encoding=UTF-8&topic=country', //+'&limit=200',
                //url: 'https://roundranking.com/final/getcntrdata_gmap22.php?year=13&justmap=1&subj=1&reg=0&cntr=0&_dc=1679328036903',
                actionMethods: {
                    read: 'POST',
                    update: 'POST',
                    create: 'POST'
                },
                reader: {
                    type: 'json',
                    rootProperty: 'root[1]', ///rootProperty: 'root',
                    idProperty: 'id_country'
                }
            },
            sorters: [{
               property: 'id',
               direction: 'ASC'
            }],
            fields: [
                {name: 'id_country'},
                {name: 'Country'},
                {name: 'cord'},
                {name: 'scale'},                
                {name: 'cntr_code'},
                {name: 'cntr_iso'},
                {name: 'code_cntr'},
                {name: 'code_reg'},
                {name: 'Region'},
            ]
        });
        
        /*var programStore2 = Ext.create('Ext.data.JsonStore', {
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '/all/pro/roundranking/data-router.php?key=tk34hdrfv&format=json&encoding=UTF-8&field=Country',
                method: 'POST',                
            },
        });*/
        
        var mappanel = Ext.create('Ext.panel.Panel', {
            //region: 'center',
            //layout: 'fit',
            title: 'Map',
            xtype: 'panel',
            html: '<div id="map" style="height: 500px; width: 100%;"></div>',
            listeners:{
                afterrender:function(){
                    let me = this, city;
                    //city = ol.proj.transform([44.49, 56.18], 'EPSG:4326', 'EPSG:3857');
                    city = ol.proj.fromLonLat([-3.696100, 40.410800]); // Madrid, Spain

                    this.map = new ol.Map({
                        target: 'map', // div#map
                        renderer: 'canvas',
                        layers: [new ol.layer.Tile({
                          source: new ol.source.OSM()
                        })],
                        view: new ol.View({
                          center: city,
                          zoom: 12,
                        }),
                    });  
                    
                    if (window.mappanel && window.mappanel.map && window.mappanel.map.setView && window.ol && ol.View) {
                        let pos = [55.751244, 37.618423]; /// JSON.parse('['+record.data['cord']+']');
                        pos = [pos[1], pos[0]];
                        let coord = { lat: pos[1], lng: pos[0] }
                        let city = ol.proj.fromLonLat(pos);
                        let unnm = 'M';
                        let icnsrc = '/favicon.ico';
                        let uninfo = 'Description';
                        
                        window.mappanel.map.setView(new ol.View({
                            center: city,
                            zoom: 10, ///zummap, ///record.data['scale'] ?? 12,
                        }));
                        
                        /*var mrks = [{
                            0: coord, // position coord
                            1: unnm, // title
                            2: icnsrc, // icon
                            3: uninfo, // info content
                        }]; // only one marker
                        addMarkers(mrks, true); // TODO: click on marker if it is only one
                        */
                        
                        leftur = 'https://theylied.info/universities/';  hs = '';
                        yr = '2010';
                        yr = Number(yr);
                        sb = '0';
                        
                        $.ajax({
                            type: 'POST',
                            url: 'https://theylied.info/all/pro/roundranking/data-router.php?key=tk34hdrfv&format=json&encoding=UTF-8',
                            data: 'topic=univ&where=year=' + yr, //+ '&limit=300',
                        }).done(function (data) {
                            console.log(data);
                            
                            switch (Number(sb)) {
                                case 1: sv='SO'; break;
                                case 2: sv='SH'; break;
                                case 3: sv='SL'; break;
                                case 4: sv='SM'; break;
                                case 5: sv='SN'; break;
                                case 6: sv='SS'; break;
                                case 7: sv='SE'; break;
                                default: sv='SO';
                            }
                            
                            var mrks = [];
                            var konf=[];
                            var infwnd=[];
                            
                            if (data.length > 0) {
                                dt = [];
                                tph = '';
                                ///$('#mapsrchvl').typeahead('destroy');
                            }
                            
                            for (let i=0; i<data.length; ++i) {
                                var d = data[i];
                                
                                dt[i+1] = [];
                                dt[i+1]['univ_name'] = $.trim(d['univ_name']);
                                dt[i+1]['country'] = d['country'];
                                dt[i+1]['region'] = d['region'];
                                dt[i+1]['Students'] = d['Students'];
                                dt[i+1]['Faculty'] = d['Faculty'];
                                dt[i+1]['FS'] = d['FS'];
                                dt[i+1]['flag'] = d['flag'];
                                dt[i+1]['logo'] = d['logo'];
                                dt[i+1]['loc'] = d['loc'];
                                dt[i+1]['found'] = d['found'];
                                dt[i+1]['sh_nm'] = d['sh_nm'];
                                dt[i+1]['type'] = d['type'];
                                dt[i+1]['website'] = d['website'];
                                dt[i+1]['id_univ'] = d['id_univ']; ///
                                
                                let cordA = d['cord'].split(',');
                                let pos = [+((''+cordA[1]).trim()), +((''+cordA[0]).trim())];
                                let cord = { lat: pos[1], lng: pos[0] }
                                dt[i+1]['lat'] = cord.lat;
                                dt[i+1]['lng'] = cord.lng;
                                
                                dt[i+1]['nm_page'] = d['nm_page'];
                                dt[i+1]['O_CR'] = d['O_CR'];  dt[i+1]['League'] = d['League'];
                                dt[i+1]['O_WR'] = d['O_WR'];  dt[i+1]['O_WS'] = d['O_WS'];
                                dt[i+1]['O_TR'] = d['O_TR'];  dt[i+1]['O_TS'] = d['O_TS'];
                                dt[i+1]['O_RR'] = d['O_RR'];  dt[i+1]['O_RS'] = d['O_RS'];
                                dt[i+1]['O_IR'] = d['O_IR'];  dt[i+1]['O_IS'] = d['O_IS'];
                                dt[i+1]['O_FR'] = d['O_FR'];  dt[i+1]['O_FS'] = d['O_FS'];
                                
                                dt[i+1]['O_80p'] = d['O_80p'];
                                dt[i+1]['O_O_s'] = d['O_O_s'];  dt[i+1]['O_Color1'] = d['O_Color1'];
                                dt[i+1]['O_Color3'] = d['O_Color3'];  dt[i+1]['O_Color4'] = d['O_Color4'];
                                
                                dt[i+1]['T_Os'] = d['T_Os'];  dt[i+1]['T_Color1'] = d['T_Color1'];
                                dt[i+1]['T_Color3'] = d['T_Color3'];  dt[i+1]['T_Color4'] = d['T_Color4'];
                                
                                dt[i+1]['R_Os'] = d['R_Os'];  dt[i+1]['R_Color1'] = d['R_Color1'];
                                dt[i+1]['R_Color3'] = d['R_Color3'];  dt[i+1]['R_Color3'] = d['R_Color3'];
                                
                                dt[i+1]['I_Os'] = d['I_Os'];  dt[i+1]['I_Color1'] = d['I_Color1'];
                                dt[i+1]['I_Color3'] = d['I_Color3'];  dt[i+1]['I_Color4'] = d['I_Color4'];
                                
                                dt[i+1]['F_Os'] = d['F_Os'];  dt[i+1]['F_Color1'] = d['F_Color1'];
                                dt[i+1]['F_Color3'] = d['F_Color3'];  dt[i+1]['F_Color4'] = d['F_Color4'];
                                
                                switch (dt[i+1]['League']) {
                                    case 'Diamond League': dt[i+1]['icon'] = 'diamond';  dt[i+1]['iconurl'] = '../images_rur/Konf/diamondw.png'; break;
                                    case 'Golden League': dt[i+1]['icon'] = 'gold';  dt[i+1]['iconurl'] = '../images_rur/Konf/goldw.png'; break;
                                    case 'Silver League': dt[i+1]['icon'] = 'silver';  dt[i+1]['iconurl'] = '../images_rur/Konf/silverw.png'; break;
                                    case 'Bronze League': dt[i+1]['icon'] = 'bronze';  dt[i+1]['iconurl'] = '../images_rur/Konf/bronzew.png'; break;
                                    case 'Copper League': dt[i+1]['icon'] = 'cooper'; dt[i+1]['iconurl'] = '../images_rur/Konf/cooperw.png'; break;
                                    case 'World League': dt[i+1]['icon'] = 'world';  dt[i+1]['iconurl'] = '../images_rur/Konf/worldw.png'; break;
                                    default: dt[i+1]['icon'] = 'world';  dt[i+1]['iconurl'] = '../images_rur/Konf/worldw.png';
                                }
                                dt[i+1]['info'] = '';
                                var colorLeagueJS = hexToRgb(dt[i+1]['O_Color1']);
                                dt[i+1]['info']+= '<style type="text/css">/**' + dt[i+1]['League'] +' color*/\n :root { --card_color_' + dt[i+1]['icon'] + ': ' + dt[i+1]['O_Color1'] + '; --card_color_' + dt[i+1]['icon'] + '_rgb: ' + colorLeagueJS.r + ',' + colorLeagueJS.g + ',' + colorLeagueJS.b + '; }</style>';
                                dt[i+1]['info']+='<div style="overflow:auto; font-family:arial; border:2px '+ dt[i+1]['O_Color1']+ ' solid; padding:10px; padding-right:32px; padding-bottom:16px"><table style="font-family:arial;width:560px;height:300px;border-collapse:collapse" class="style5" border="0"><tbody><tr>';
                                dt[i+1]['info']+='<td style="font-family:arial;text-align:center" rowspan="10" colspan="2"><img src="'+ dt[i+1]['logo']+ '" style="vertical-align:top;width: 8em;height: 8em;" ></td><td colspan="4" style="font-family:arial;text-align:left"><span style="font-family:arial;color: '+ dt[i+1]['O_Color1']+ '; font-size:17px"><strong>'+ dt[i+1]['univ_name']+ '</strong></span></td></tr>';
                                dt[i+1]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Foundation year:</b></span></td>';
                                dt[i+1]['info']+='<td style="width:98px"><span style="font-size:9pt">'+ dt[i+1]['found']+ '</span></td>';
                                dt[i+1]['info']+='<td rowspan="9" colspan="2" style="font-family:arial;text-align:center"><img src="'+ dt[i+1]['flag']+ '" style="vertical-align:top" height="80"><br><span style="font-family:arial;font-size:10px"></span><span style="font-family:arial;color: '+ dt[i+1]['O_Color1']+ '"><strong></strong></span></td></tr>';
                                dt[i+1]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Short name:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i+1]['sh_nm']+ '</span></td></tr>';
                                dt[i+1]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Type:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i+1]['type']+ '</span></td></tr>';
                                dt[i+1]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Students:</b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i+1]['Students']+ '</span></td></tr>';
                                dt[i+1]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Faculty:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i+1]['Faculty']+ '</span></td></tr>';
                                dt[i+1]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Web-site:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt"><a href="http://'+ dt[i+1]['website']+ '" target="_blank">'+ dt[i+1]['website']+ '</a></span></td></tr>';
                                dt[i+1]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Region:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i+1]['region']+ '</span></td></tr>';
                                dt[i+1]['info']+='<tr><td style="width:110px"><span style="font-size:9pt"><b>Location:<b></b></b></span></td><td style="width:98px"><span style="font-size:9pt">'+ dt[i+1]['loc']+ '</span></td></tr>';
                                dt[i+1]['info']+='<tr><td colspan="6">&nbsp;</td></tr><tr><td></td><td colspan="4" style="font-family:arial;border-top: '+ dt[i+1]['O_Color1']+ ' 0 solid"></td><td></td></tr>';
                                dt[i+1]['info']+='<tr style="background-color: rgb(var(--card_color_' + dt[i+1]['icon'] + '_rgb), 0.2)"><td style="background-color: white; font-family:arial;width:114px;text-align:center;" rowspan="6"><div style="font-family:arial;height:85px;width:85px"><img src="'+ dt[i+1]['O_80p']+ '" style=";width: 5em;height: 5em;" alt=""><br><div style="font-family:arial;color: #fff; font-size:14pt;font-weight:bold;padding-top:25px">'+ dt[i+1]['O_WR']+ '</div></div>';
                                dt[i+1]['info']+='<div style="font-family:arial;width:80px"><strong><span style="color: '+ dt[i+1]['O_Color1']+ '"><span style="font-size:13pt">'+ dt[i+1]['O_WR']+ '</span></span></strong></div><div style="font-family:arial;width:80px"><strong><span style="color: '+ dt[i+1]['O_Color1']+ '"><span style="font-size:13pt">'+ dt[i+1]['League']+ '</span></span></strong></div></td>';
                                dt[i+1]['info']+='<td style="font-family:arial;width:50px;height:7px"></td><td class="style6" style="width:110px;height:7px"><span style="font-size:9pt"><b>Dimension</b></span></td><td class="style6" style="font-family:arial;width:98px;height:7px"><span style="font-size:9pt"><b>Rank</b></span></td><td style="font-family:arial;width:63px;height:7px" class="style6"><span style="font-size:9pt"><b>Score</b></span></td><td style="background-color: white; font-family:arial;text-align:center" rowspan="4"><p class="style1"><span style="color: '+ dt[i+1]['O_Color1']+ '"><strong>Country rank</strong></span></p><p><span style="font-size:12pt"><span style="color: '+ dt[i+1]['O_Color1']+ '"><strong>'+ dt[i+1]['O_CR']+ '</strong></span></span></p></td></tr>';
                                dt[i+1]['info']+='<tr style="font-family:arial;height:0px"><td colspan="4" style="font-family:arial;border-top: '+ dt[i+1]['O_Color1']+ ' 2px solid"></td><td></td></tr>';
                                dt[i+1]['info']+='<tr style="font-family:arial;background-color: '+ dt[i+1]['O_Color4']+ ';height:35px"><td style="font-family:arial;width:50px" class="style1"><img alt="" src="'+ dt[i+1]['O_O_s']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px"><span style="font-size:9pt">Overall</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i+1]['O_WR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i+1]['O_WS']+ '</span></td></tr>';
                                dt[i+1]['info']+='<tr style="font-family:arial;height:20px;background-color: '+ dt[i+1]['T_Color4']+ '"><td style="font-family:arial;width:50px"><img alt="" src="'+ dt[i+1]['T_Os']+ '" style="font-family:arial;float:right"></td><td style="width:110px"><span style="font-size:9pt">Teaching</span></td><td class="style6" style="width:98px"><span style="font-size:9pt">'+ dt[i+1]['O_TR']+ '</td><td class="style6" style="width:98px"><span style="font-size:9pt">'+ dt[i+1]['O_TS']+ '</span></td></tr>';
                                dt[i+1]['info']+='<tr style="font-family:arial;background-color: '+ dt[i+1]['R_Color4']+ '"><td style="font-family:arial;width:50px;height:22px"><img alt="" src="'+ dt[i+1]['R_Os']+ '" style="font-family:arial;float:right"></td><td style="width:110px;height:30px"><span style="font-size:9pt">Research</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i+1]['O_RR']+ '</td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i+1]['O_RS']+ '</span></td><td style="font-family:arial;text-align:center;background:#ffffff" rowspan="3"><span style="font-family:arial;font-size:10px"><span style="font-family:arial;color: #999999;"><a href="'+ leftur + dt[i+1]['nm_page']+ '.html?sort=O&year='+ (Number(yr)+2009)+ '&subject='+sv+hs+'" target="_blank">View full university profile</a></span></span></td></tr>';
                                dt[i+1]['info']+='<tr style="font-family:arial;height:26px;background-color: '+ dt[i+1]['I_Color4']+ '"><td style="font-family:arial;width:50px;height:21px"><img alt="" src="'+ dt[i+1]['I_Os']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Internationalization</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i+1]['O_IR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i+1]['O_IS']+ '</span></td></tr>';
                                dt[i+1]['info']+='<tr style="font-family:arial;background-color: '+ dt[i+1]['F_Color4']+ ';height:26px"><td style="font-family:arial;background:#ffffff"></td><td style="font-family:arial;width:50px;height:9px"><img alt="" src="'+ dt[i+1]['F_Os']+ '" style="font-family:arial;float:right"></td><td class="style6" style="width:110px;height:30px"><span style="font-size:9pt">Finances</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i+1]['O_FR']+ '</span></td><td class="style6" style="width:98px;height:9px"><span style="font-size:9pt">'+ dt[i+1]['O_FS']+ '</span></td></tr></tbody></table></div>';
                                
                                if (i == 0) {
                                    console.log('i0: ', dt[i+1]);
                                }
                                
                                tph=tph+'{ID:'+i+', Name: "' + dt[i+1]['univ_name'] + ' _' + dt[i+1]['id_univ'] + '"},';
                                ///$('#tphsel').append('<option value="'+i+'">' + dt[i+1]['univ_name'] + ' _' + dt[i+1]['id_univ'] +'</option>');
                                
                                konf[i] = dt[i+1]['iconurl'];
                                infwnd[i] = dt[i+1]['info'];
                                let title = dt[i+1]['univ_name'];
                                
                                mrks.push([
                                    cord, /// {lat: +((''+dt[i+1]['lat']).trim()), lng: +((''+dt[i+1]['lng']).trim())},
                                    `#${getWorldRating(dt, title, i + 1)} - ${title}`, //`#${dt[i + 1]['League']} - ${title}`, ///'' + d['id_univ'] + '_ ' + d['Univ name'],
                                    icnsrc, ///dt[i+1]['iconurl'], // TODO
                                    dt[i+1]['info'], ///'' + d['Web_site'] + ' ' + d['Foundation'],
                                ]);
                            }
                            addMarkers(mrks);
                        });
                    }

                },
                resize: function () {
                    this.map.updateSize();
                }
            }
        });
        window.mappanel = mappanel;
                


        var grid = Ext.create('Ext.grid.Panel', {
            store: programStore, // use variable if not using Ext.define
            //html: '<div id="grid" style="height: 500px; width: 1300px"></div>',
            xtype: 'panel',
            columns: [
                {text: 'id_country', flex: 1, dataIndex: 'id_country', hidden: true},
                {text: 'Country', flex: 1, dataIndex: 'Country'},
                {text: 'cord', dataIndex: 'cord'},
                {text: 'scale', dataIndex: 'scale'},                
                {dataIndex: 'cntr_code'},
                {dataIndex: 'cntr_iso'},
                {dataIndex: 'code_cntr'},
                {dataIndex: 'code_reg'},
                {text: 'Region', flex: 1, dataIndex: 'Region'},
            ],
            //height: 200,
            //width: 400,
            //renderTo: Ext.getBody()
        });
        
                
        var toppanel = Ext.create('Ext.panel.Panel', {
            title: 'Toppanel',
            xtype: 'panel',
            html: '<div id="topPanel" style="height: 100px; width: 100%;"><select id="selectCountry"></select></div>',
            listeners: {
                afterrender: function(){
                    /*var selectCountry = Ext.create('Ext.form.ComboBox',{
                        store:['Moscow', 'Rome', ],

                        listeners:{
                            afterrender:function(box) {
                                box.setValue('ABC123');
                            }
                        },
                        
                        renderTo: 'toppanel',
                    });*/
                    
                    var selectCountry = Ext.create('Ext.form.ComboBox', {
                        renderTo: 'topPanel',
                        autoLoad: true,
                        fieldLabel: 'Select a country',
                        store: programStore,
                        //queryMode: 'local', // 'remote',
                        //typeAhead: true,
                        transform: 'selectCountry', // html select
                        forceSelection: true, 
                        xtype:'combo', 
                        //cls:'combo',                        
                        valueField: 'Country',
                        displayField: 'Country',
                        
                        listeners: {
                            select: function(combo, record, index) {
                                console.log(record.data['Country'], record.data['cord']);
                                let i = grid.store.indexOf(record);
                                grid.getSelectionModel().select(i); ///
                                
                                let pos = JSON.parse('['+record.data['cord']+']');
                                pos = [pos[1], pos[0]];
                                ///city = ol.proj.transform(pos, 'EPSG:4326', 'EPSG:3857');
                                city = ol.proj.fromLonLat(pos);
                                
                                mappanel.map.setView(new ol.View({
                                  center: city,
                                  zoom: record.data['scale'] ?? 12,
                                }));
                                
                                

        

                            }
                        }
                    });
        
                },
            },
        });
        
                
        Ext.create('Ext.container.Viewport', { ///'Ext.panel.Panel', {
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            type: 'vbox',
            renderTo: 'perfectmap_div', //Ext.getBody(),
            items: [
                toppanel,
                mappanel,
                grid, 
                //selectCountry, //
            ]
        });
        
        }
});

});
