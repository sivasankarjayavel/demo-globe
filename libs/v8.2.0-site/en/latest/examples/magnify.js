"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[3633],{52673:function(t,e,n){var r=n(1055),a=n(72893),o=n(40824),s=n(64469),i=n(81625),u=n(91027);const c=new a.Z({source:new s.Z({attributions:'<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',url:"https://api.maptiler.com/tiles/satellite/{z}/{x}/{y}.jpg?key=get_your_own_D6rA4zTHduk6KOKTXzGB",maxZoom:20,crossOrigin:""})}),l=document.getElementById("map"),p=new r.Z({layers:[c],target:l,view:new o.ZP({center:(0,i.mi)([-109,46.5]),zoom:6})});let d=75;document.addEventListener("keydown",(function(t){"ArrowUp"===t.key?(d=Math.min(d+5,150),p.render(),t.preventDefault()):"ArrowDown"===t.key&&(d=Math.max(d-5,25),p.render(),t.preventDefault())}));let h=null;l.addEventListener("mousemove",(function(t){h=p.getEventPixel(t),p.render()})),l.addEventListener("mouseout",(function(){h=null,p.render()})),c.on("postrender",(function(t){if(h){const e=(0,u.CR)(t,h),n=(0,u.CR)(t,[h[0]+d,h[1]]),r=Math.sqrt(Math.pow(n[0]-e[0],2)+Math.pow(n[1]-e[1],2)),a=t.context,o=e[0],s=e[1],i=o-r,c=s-r,l=Math.round(2*r+1),p=a.getImageData(i,c,l,l).data,m=a.createImageData(l,l),w=m.data;for(let t=0;t<l;++t)for(let e=0;e<l;++e){const n=e-r,a=t-r;let o=e,s=t;Math.sqrt(n*n+a*a)<r&&(o=Math.round(r+n/2),s=Math.round(r+a/2));const i=4*(t*l+e),u=4*(s*l+o);w[i]=p[u],w[i+1]=p[u+1],w[i+2]=p[u+2],w[i+3]=p[u+3]}a.beginPath(),a.arc(o,s,r,0,2*Math.PI),a.lineWidth=3*r/d,a.strokeStyle="rgba(255,255,255,0.5)",a.putImageData(m,i,c),a.stroke(),a.restore()}}))}},function(t){var e;e=52673,t(t.s=e)}]);
//# sourceMappingURL=magnify.js.map