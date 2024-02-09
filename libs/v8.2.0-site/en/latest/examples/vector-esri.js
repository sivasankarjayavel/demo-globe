"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[6856],{43912:function(e,t,n){var r=n(15240),o=n(1055),s=n(4711),i=n(40824),a=n(64469),c=n(80677),l=n(5002),u=n(82776),p=n(1733),d=n(72893),m=n(70658),g=n(81625),y=n(2896);const f={"Lost To Sea Since 1965":[0,0,0,1],"Urban/Built-up":[104,104,104,1],Shacks:[115,76,0,1],Industry:[230,0,0,1],Wasteland:[230,0,0,1],Caravans:[0,112,255,.5],Defence:[230,152,0,.5],Transport:[230,152,0,1],"Open Countryside":[255,255,115,1],Woodland:[38,115,0,1],"Managed Recreation/Sport":[85,255,0,1],"Amenity Water":[0,112,255,1],"Inland Water":[0,38,115,1]},w=new c.ZP({fill:new l.Z,stroke:new u.Z({color:[0,0,0,1],width:.5})}),v=new s.Z({format:new r.Z,url:function(e,t,n){const r=n.getCode().split(/:(?=\d+$)/).pop();return"https://services-eu1.arcgis.com/NPIbx47lsIiu2pqz/ArcGIS/rest/services/Neptune_Coastline_Campaign_Open_Data_Land_Use_2014/FeatureServer/0/query/?f=json&returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry="+encodeURIComponent('{"xmin":'+e[0]+',"ymin":'+e[1]+',"xmax":'+e[2]+',"ymax":'+e[3]+',"spatialReference":{"wkid":'+r+"}}")+"&geometryType=esriGeometryEnvelope&inSR="+r+"&outFields=*&outSR="+r},strategy:(0,y.Gg)((0,m.dl)({tileSize:512})),attributions:'University of Leicester (commissioned by the <a href="https://www.arcgis.com/home/item.html?id=d5f05b1dc3dd4d76906c421bc1727805">National Trust</a>)'}),h=new p.Z({source:v,style:function(e){const t=e.get("LU_2014"),n=f[t]||[0,0,0,0];return w.getFill().setColor(n),w},opacity:.7}),S=new d.Z({source:new a.Z({attributions:'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>',url:"https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"})}),_=new o.Z({layers:[S,h],target:document.getElementById("map"),view:new i.ZP({center:(0,g.mi)([1.72,52.4]),zoom:14})});_.on(["click","pointermove"],(function(e){e.dragging||function(e){const t=_.forEachFeatureAtPixel(e,(function(e){return e}));if(t){const e="2014 Land Use: "+t.get("LU_2014")+"<br>1965 Land Use: "+t.get("LU_1965");document.getElementById("info").innerHTML=e,_.getTarget().style.cursor="pointer"}else document.getElementById("info").innerHTML="&nbsp;<br>&nbsp;",_.getTarget().style.cursor=""}(e.pixel)}))}},function(e){var t;t=43912,e(e.s=t)}]);
//# sourceMappingURL=vector-esri.js.map