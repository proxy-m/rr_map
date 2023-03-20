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
                {name: 'cord'},
                {name: 'scale'},
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
