"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3013],{26455:function(e,t,l){var o=l(79619),r=l(1055),n=l(40824),a=l(83735),s=l(55117),c=l(4711),i=l(80677),b=l(72893),d=l(1733);const p=(0,l(81625).mi)([-73.98189,40.76805]),g="rgba(120, 120, 120, 1)",u="Columbus Circle";let w=null;const f=(e,t,l,o)=>{e.fillStyle="rgba(255,0,0,1)",e.strokeStyle=o,e.lineWidth=1,e.textAlign="center",e.textBaseline="middle",e.font="bold 30px verdana",e.filter="drop-shadow(7px 7px 2px #e81)",e.fillText(u,t,l),e.strokeText(u,t,l)},x=new o.Z({geometry:new a.Z(p,50)});x.set("label-color",g),x.setStyle(new i.ZP({renderer(e,t){const[[l,o],[r,n]]=e,a=t.context,s=r-l,c=n-o,i=Math.sqrt(s*s+c*c),b=1.4*i,d=a.createRadialGradient(l,o,0,l,o,b);d.addColorStop(0,"rgba(255,0,0,0)"),d.addColorStop(.6,"rgba(255,0,0,0.2)"),d.addColorStop(1,"rgba(255,0,0,0.8)"),a.beginPath(),a.arc(l,o,i,0,2*Math.PI,!0),a.fillStyle=d,a.fill(),a.strokeStyle="rgba(255,0,0,1)",a.stroke(),f(a,l,o,x.get("label-color"))},hitDetectionRenderer(e,t){const[l,o]=e[0],r=t.context;f(r,l,o,x.get("label-color"))}}));const h=new r.Z({layers:[new b.Z({source:new s.Z,visible:!0}),new d.Z({source:new c.Z({features:[x]})})],target:"map",view:new n.ZP({center:p,zoom:19})});h.on("pointermove",(e=>{const t=h.forEachFeatureAtPixel(e.pixel,(e=>(e.set("label-color","rgba(255,255,255,1)"),e)));w&&w!=t&&w.set("label-color",g),w=t}))}},function(e){var t;t=26455,e(e.s=t)}]);
//# sourceMappingURL=custom-hit-detection-renderer.js.map