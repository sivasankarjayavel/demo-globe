"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3094],{74464:function(e,t,r){var n=r(1055),a=r(55117),o=r(72893),s=r(40824);const c=new o.Z({source:new a.Z});new n.Z({layers:[c],target:"map",view:new s.ZP({center:[0,0],zoom:2})});c.on("prerender",(function(e){const t=e.context,r=e.inversePixelTransform,n=Math.sqrt(r[0]*r[0]+r[1]*r[1]),a=-Math.atan2(r[1],r[0]);t.save(),t.translate(t.canvas.width/2,t.canvas.height/2),t.rotate(-a),t.scale(3*n,3*n),t.translate(-75,-80),t.beginPath(),t.moveTo(75,40),t.bezierCurveTo(75,37,70,25,50,25),t.bezierCurveTo(20,25,20,62.5,20,62.5),t.bezierCurveTo(20,80,40,102,75,120),t.bezierCurveTo(110,102,130,80,130,62.5),t.bezierCurveTo(130,62.5,130,25,100,25),t.bezierCurveTo(85,25,75,37,75,40),t.clip(),t.translate(75,80),t.scale(1/3/n,1/3/n),t.rotate(a),t.translate(-t.canvas.width/2,-t.canvas.height/2)})),c.on("postrender",(function(e){e.context.restore()}))}},function(e){var t;t=74464,e(e.s=t)}]);
//# sourceMappingURL=layer-clipping.js.map