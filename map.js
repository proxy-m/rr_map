/* global Ext, ol */
/* jshint browser:true, devel:true, indent: 4 */

Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.form.*',
    'Ext.layout.container.Border'
]);


Ext.onReady(() => {

    let wasClickedTrigger = 0;
    let ti = null;
    let lastMissed = 0;
    let missedCount = 0;
    window.lastWindowCoord = null;

    let container = null;
    let content = null;

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
                        + '<b>' + (`#${i + 1} - `) + (!!m[1] ? m[1] : 'Unnamed') + '</b>' + '<br/>'
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
        

    }

    
Ext.application({
    name: 'OL3EXT6',
    launch: function () {
        var programStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '/all/pro/roundranking/data-router.php?key=tk34hdrfv&format=json&encoding=UTF-8&topic=country&limit=200',
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
                        
                        $.ajax({
                            type: 'POST',
                            url: 'https://theylied.info/all/pro/roundranking/data-router.php?key=tk34hdrfv&format=json&encoding=UTF-8',
                            data: 'topic=univ&where=year=2010&limit=300',
                        }).done(function (data) {
                            console.log(data);
                            var mrks = [];
                            for (let k=0; k<data.length; ++k) {
                                var d = data[k];
                                let cordA = d['cord'].split(',');
                                let pos = [+((''+cordA[1]).trim()), +((''+cordA[0]).trim())];
                                let cord = { lat: pos[1], lng: pos[0] }
                                mrks.push([
                                    cord,
                                    '' + d['id_univ'] + '_ ' + d['Univ name'],
                                    icnsrc, // TODO
                                    '' + d['Web_site'] + ' ' + d['Foundation'],
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
        
                
        Ext.create('Ext.container.Viewport', {
            layout: {
                type: 'vbox',
                align: 'stretch',
            },
            type: 'vbox',
            renderTo: Ext.getBody(),
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
