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
    
Ext.application({
    name: 'OL3EXT6',
    launch: function () {
        var toppanel = Ext.create('Ext.panel.Panel', {
            title: 'Toppanel',
            xtype: 'panel',
            html: '<div id="toppanel" style="height: 100px; width: 100%;"> <select id="stateSelect"></select> </div>',
        });
        
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

                },
                resize: function () {
                    this.map.updateSize();
                }
            }
        });
        
        
        /*Ext.create('Ext.List', {
           fullscreen: true,
           itemTpl: '<div class="contact">{firstName} <strong>{lastName}</strong></div>',
           store: Ext.data.StoreManager.lookup('employeeStore'),
           grouped: true
        });*/
        
        /*
        Ext.create('Ext.data.Store', {
            storeId: 'employeeStore',
            fields: ['firstname', 'lastname', 'seniority', 'dep', 'hired'],
            data: [
                {firstname:"Michael", lastname:"Scott", seniority:7, dep:"Management", hired:"01/10/2004"},
                {firstname:"Dwight", lastname:"Schrute", seniority:2, dep:"Sales", hired:"04/01/2004"},
                {firstname:"Jim", lastname:"Halpert", seniority:3, dep:"Sales", hired:"02/22/2006"},
                {firstname:"Kevin", lastname:"Malone", seniority:4, dep:"Accounting", hired:"06/10/2007"},
                {firstname:"Angela", lastname:"Martin", seniority:5, dep:"Accounting", hired:"10/21/2008"}
            ]
        });        

        var grid = Ext.create('Ext.grid.Grid', {
            title: 'Column Demo',
            store: Ext.data.StoreManager.lookup('employeeStore'),
            columns: [
                {text: 'First Name',  dataIndex:'firstname'},
                {text: 'Last Name',  dataIndex:'lastname'},
                {text: 'Hired Month',  dataIndex:'hired', xtype:'datecolumn', format:'M'},
                {text: 'Department (Yrs)', xtype:'templatecolumn', tpl:'{dep} ({seniority})'}
            ],
            width: 400
        });
        Ext.ViewPort.add(grid);
        */
        
        var programStore = Ext.create('Ext.data.JsonStore', {
            remoteSort: false,
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: '/all/pro/roundranking/data-router.php?key=tk34hdrfv&format=json&encoding=UTF-8',
                actionMethods: {
                    read: 'POST',
                    update: 'POST',
                    create: 'POST'
                },
                reader: {
                    type: 'json',
                    //root: 'root',
                    rootProperty: 'root',
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
                {name: 'Region'},
            ]
        });

        var grid = Ext.create('Ext.grid.Panel', {
            store: programStore, // use variable if not using Ext.define
            //html: '<div id="grid" style="height: 500px; width: 1300px"></div>',
            xtype: 'panel',
            columns: [
                {text: 'id_country', flex: 1, dataIndex: 'id_country', hidden: true},
                {text: 'Country', flex: 1, dataIndex: 'Country'},
                {text: 'Region', flex: 1, dataIndex: 'Region'},
            ],
            //height: 200,
            //width: 400,
            //renderTo: Ext.getBody()
        });
        
        var selectCountry = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Select a country',
            //renderTo: 'selectCountry',
            displayField: 'name',
            width: 500,
            labelWidth: 130,
            store: programStore,
            queryMode: 'local',
            typeAhead: true,
            transform: 'stateSelect', // html select
            forceSelection: true, 
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
                selectCountry, //
            ]
        });
        
        }
});

});

/*Ext.application({
    name: 'OL3EXT5',
    launch: function () {
        var mappanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: 'fit',
            title: 'Map',
            xtype: 'panel',
            listeners:{
                afterrender:function(){

                    var me = this,

                    osmLayer = new ol.layer.Tile({
                      source: new ol.source.OSM()
                    }),

                    city = ol.proj.transform([44.49, 56.18], 'EPSG:4326', 'EPSG:3857'),

                    view = new ol.View({
                      center: city,
                      zoom: 6
                    });

                    this.map = new ol.Map({
                        target: me.body.dom.id,
                        renderer: 'canvas',
                        layers: [osmLayer],
                        view: view
                    });  

                },
                resize: function () {
                    this.map.updateSize();
                }
            }
        });
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                mappanel
            ]
        });
    }
});*/

/*Ext.application({
    name: 'OL3EXT4',
    launch: function () {
        var mappanel = Ext.create('Ext.panel.Panel', {
            title: "Test Map",
            layout: 'fit',
            html: "<div id='test-map'></div>", // The map will be drawn inside
            listeners: {
                afterrender: function () {
                    var osm_source = new ol.source.OSM({
                        url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    });
                    var osmLayer = new ol.layer.Tile({
                        source: osm_source
                    });

                    this.map = new ol.Map({
                        target: 'test-map',
                        renderer: 'canvas',
                        layers: [osmLayer],
                        view: new ol.View2D({
                            center: [-10764594.0, 4523072.0],
                            zoom: 5
                        })
                    });
                },
                // The resize handle is necessary to set the map!
                resize: function () {
                    var size = [document.getElementById(this.id + "-body").offsetWidth, document.getElementById(this.id + "-body").offsetHeight];
                    console.log(size);
                    this.map.setSize(size);
                }
            }
        });
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                mappanel
            ]
        });
    }
});*/
