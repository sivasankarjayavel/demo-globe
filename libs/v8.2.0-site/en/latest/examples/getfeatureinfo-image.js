"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[4085],{19976:function(e,n,t){var o=t(11802),r=t(39597),s=t(1055),c=t(40824);const i=new r.Z({url:"https://ahocevar.com/geoserver/wms",params:{LAYERS:"ne:ne"},serverType:"geoserver",crossOrigin:"anonymous"}),a=new o.Z({source:i}),u=new c.ZP({center:[0,0],zoom:1}),g=new s.Z({layers:[a],target:"map",view:u});g.on("singleclick",(function(e){document.getElementById("info").innerHTML="";const n=u.getResolution(),t=i.getFeatureInfoUrl(e.coordinate,n,"EPSG:3857",{INFO_FORMAT:"text/html"});t&&fetch(t).then((e=>e.text())).then((e=>{document.getElementById("info").innerHTML=e}))})),g.on("pointermove",(function(e){if(e.dragging)return;const n=a.getData(e.pixel),t=n&&n[3]>0;g.getTargetElement().style.cursor=t?"pointer":""}))}},function(e){var n;n=19976,e(e.s=n)}]);
//# sourceMappingURL=getfeatureinfo-image.js.map