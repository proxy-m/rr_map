/* global Ext, ol */
/* jshint browser:true, devel:true, indent: 4 */

Ext.application({
    name: 'OL3EXT6',
    launch: function () {
        var mappanel = Ext.create('Ext.panel.Panel', {
            region: 'center',
            layout: 'fit',
            title: 'Map',
            xtype: 'panel',
            html: '<div id="map" style="height: 500px; width: 1300px"></div>',
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
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
                mappanel
            ]
        });
    }
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
