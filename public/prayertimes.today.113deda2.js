parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"k7Dh":[function(require,module,exports) {

},{}],"XUvo":[function(require,module,exports) {
"use strict";require("../styles/prayertimes.today.css"),window.onload=(()=>{const a=new Date,t=a.getDate()+1,n="A".concat(t,":S").concat(t+1),e="true"===window.localStorage.getItem("debug")?console.log:()=>{},s=parseInt(window.localStorage.getItem("frequency")||"12",10),c={hour12:!1,hour:"2-digit",minute:"2-digit"};const r=t=>{const[n,e,s,r,i,o,d,m,h,l,u,g,p,J,w,S,j="",f="",y=""]=t.map((t,n)=>{const[e,s]=t.split(":");if(s){const n=new Date(a);Number(e);n.setHours(e),n.setMinutes(s),t=n.toLocaleTimeString("en-GB",c)}return t});return{date:n,islamicDay:e,day:s,fajarBegins:r,sunrise:o,fajarJamaat:i,dhurBegins:d,dhurJamaat:m,asarBegins:h,asarJamaat:l,maghribBegins:u,maghribJamaat:g,ishaBegins:p,ishaJamaat:J,islamicMonth:["Muharram","Safar","Rabi al-Awwal","Rabi ath-Thani","Jumadi ul-Ula","Jumadi ul-Akhirah","Rajab","Sha‘ban","Ramadhan","Shawwal","Dhul-Qadah","Dhul-Hijjah"][w-1],islamicYear:S,firstJumah:j,secondJumah:f,thirdJumah:y}};function i({data:t,dateString:n},s){e(t,n,s);const i=r(t[0]),o=r(t[1]||t[0]),d=function(t,n=0,e=0){const s=t.replace(/[^ -~]/g,"").split(/[\:\s]/),r=new Date(a);return r.setHours(Number(s[0])+n),r.setMinutes(Number(s[1])+e),r.toLocaleTimeString("en-GB",c).replace(/[^ -~]/g,"")}(i.sunrise,0,15),m="".concat(new Date(s?(new Date).toISOString():n).toLocaleDateString("en-GB",{day:"numeric",year:"numeric",month:"long",hour:"2-digit",minute:"2-digit",second:"2-digit"})),h="".concat(i.islamicDay," ").concat(i.islamicMonth," ").concat(i.islamicYear," Hj"),l=a=>{const[t,n]=a.replace(/[^ -~]/g,"").split(":").map(Number);return 60*t+n},u=(a,t=0,n=0,e)=>{const s=[],r=l((new Date).toLocaleTimeString("en-GB",c).slice(0,5)),i=l(a),o=i-t,d=i+n;return s.push(o<=r&&r<d?"highlight":""),e&&i!==l(e)&&s.push("changing"),s.join(" ")},g=u(i.fajarBegins,30,0),p=u(i.fajarJamaat,30,5,o.fajarJamaat),J=u(i.dhurJamaat,0,10),w=u(i.asarJamaat,0,10,o.asarJamaat),S=u(i.maghribBegins,10,10),j=u(i.ishaJamaat,0,10,o.ishaJamaat),f=[p,w,j].some(a=>a.includes("changing"))?"visible":"",y='\n<div class="date english">'.concat(m,'</div>\n<div class="date islamic">').concat(h,'</div>\n<table class="table">\n  <thead>\n    <tr><th>Salah</th><th>Begins</th><th>Jamaat</th></tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Fajar</td>\n      <td class="').concat(g,'">').concat(i.fajarBegins,'</td>\n      <td class="').concat(p,'">\n        <span class="fajar jamaat">').concat(i.fajarJamaat,'</span>\n        <span class="fajar jamaat tomorrow">').concat(o.fajarJamaat,'</span>\n      </td>\n    </tr>\n    <tr>\n      <td>Sunrise</td>\n      <td colspan=2\n          data-text="').concat(d,'"\n          class="ishraq"\n      >\n        ').concat(i.sunrise,"\n      </td>\n    </tr>\n    <tr>\n      <td>").concat("Fri"===i.day?"Jumah":"Zuhr","</td>\n      <td>").concat(i.dhurBegins,'</td>\n      <td class="dhuhur jamaat ').concat(J,'">').concat("Fri"===i.day?i.firstJumah+" / "+i.secondJumah:i.dhurJamaat,"</td>\n    </tr>\n    <tr>\n      <td>Asar</td>\n      <td>").concat(i.asarBegins,'</td>\n      <td class="asar jamaat ').concat(w,'">\n        <span>').concat(i.asarJamaat,'</span>\n        <span class="tomorrow">').concat(o.asarJamaat,'</span>\n      </td>\n      </tr>\n    <tr>\n      <td>Maghrib</td>\n      <td colspan=2 class="maghrib ').concat(S,'">').concat(i.maghribBegins,"</td>\n    </tr>\n    <tr>\n      <td>Isha</td>\n      <td>").concat(i.ishaBegins,'</td>\n      <td class="isha jamaat ').concat(j,'">\n        <span>').concat(i.ishaJamaat,'</span>\n        <span class="tomorrow">').concat(o.ishaJamaat,'</span>\n      </td>\n      </tr>\n    <tr>\n      <td>Jumah</td>\n      <td class="jumah" colspan=2>\n        ').concat([i.firstJumah,i.secondJumah,i.thirdJumah].filter(Boolean).join(" / "),'\n      </td>\n    </tr>\n  </tbody>\n</table>\n<div class="legend shine ').concat(f,'">• <span>Changing tomorrow</span></div>\n          ');document.getElementById("table_div").innerHTML=y,s&&document.querySelector(".shine").classList.remove("shine")}let o=JSON.parse(window.localStorage.getItem("todays-times"));const d=new URL(document.location).searchParams,m=d.get("id")||"1qS2o3JQ07qFkUXMBvEZVZ3E8Z_mk0jMXXhxJkQ35LR8",h=d.get("name")||"calc-formatted",l=d.get("hue")||"170",u=d.get("key");if(!u)return console.error("Error: No API Key provided in the params");const g="https://sheets.googleapis.com/v4/spreadsheets/".concat(m,"/values/").concat(h,"!").concat(n,"?key=").concat(u);document.documentElement.style.setProperty("--hue",parseInt(l));const p=()=>{const a=(()=>o&&(new Date).toISOString().slice(0,s)===o.dateString.slice(0,s))();o&&o.data&&i(o,a),a||(()=>fetch(g).then(a=>a.json()).then(a=>{e({res:a});const t=a.values,n=(new Date).toISOString();o={data:t,dateString:n},window.localStorage.setItem("todays-times",JSON.stringify(o))}).catch(e))().then(()=>i(o,!0))};p(),window.setInterval(p,1e3)});
},{"../styles/prayertimes.today.css":"k7Dh"}]},{},["XUvo"], null)
//# sourceMappingURL=prayertimes.today.113deda2.js.map