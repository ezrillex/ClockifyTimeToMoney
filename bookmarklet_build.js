javascript:(function(){let normalRate,overtimeRate,normalHoursCap,overtimeHoursCap,config=localStorage.getItem(`clockifyTimeToMoney`),valid=!0;if(null!=config?(config=JSON.parse(config),normalRate=config.normalRate,overtimeRate=config.overtimeRate,normalHoursCap=config.normalHoursCap,overtimeHoursCap=config.overtimeHoursCap):(normalRate=parseFloat(prompt(`What is your hourly rate?`)),overtimeRate=parseFloat(prompt(`What is your overtime rate?`)),normalHoursCap=parseFloat(prompt(`What is your normal hours cap?`,40)),overtimeHoursCap=parseInt(prompt(`What is your overtime hours cap?`,10)),isNaN(normalRate)||isNaN(overtimeRate)||isNaN(normalHoursCap)||isNaN(overtimeHoursCap)?(valid=!1,alert(`One of the values is invalid. Please try again, make sure to only use numbers.`)):(valid=!0,localStorage.setItem(`clockifyTimeToMoney`,JSON.stringify({normalRate:normalRate,overtimeRate:overtimeRate,normalHoursCap:normalHoursCap,overtimeHoursCap:overtimeHoursCap})))),valid){let e=[{parent:document.querySelector(`#layout-main > div > tracker2 > div > div > div > div > entry-group:nth-child(1) > approval-header > div.cl-d-flex.cl-align-items-end.cl-mt-2.cl-mt-lg-0.cl-justify-content-lg-end.cl-max-width-85`),clock:document.querySelector(`#layout-main > div > tracker2 > div > div > div > div > entry-group:nth-child(1) > approval-header > div.cl-d-flex.cl-align-items-end.cl-mt-2.cl-mt-lg-0.cl-justify-content-lg-end.cl-max-width-85 > div.cl-h2.cl-mb-0.cl-ml-2.cl-lh-1.ng-star-inserted`)}];document.querySelectorAll(`#layout-main > div > tracker2 > div > div > div > div > entry-group`).forEach(((t,r)=>{e.push({parent:document.querySelector(`#layout-main > div > tracker2 > div > div > div > div > entry-group:nth-child(${r+1}) > div > entry-group-header > div > div:nth-child(2)`),clock:document.querySelector(`#layout-main > div > tracker2 > div > div > div > div > entry-group:nth-child(${r+1}) > div > entry-group-header > div > div:nth-child(2) > div.cl-h2.cl-mb-0.cl-ml-2.cl-lh-1`)})})),e.forEach((e=>{const t=document.createElement(`h2`);t.textContent=convertTime(e.clock.textContent),t.style=`margin: 0; margin-left: 2em;`,e.parent.appendChild(t),e.moneyElementReference=t}));function convertTime(e){const t=e.trim().split(`:`);return parseInt(t[0])+parseInt(t[1])/60+parseInt(t[2])/60/60}function calculateRateWeekly(e){if(e>normalHoursCap){let t=e-normalHoursCap;return t>overtimeHoursCap&&(t=overtimeHoursCap),normalHoursCap*normalRate+t*overtimeRate}return e*normalRate}new MutationObserver((t=>{e.forEach((e=>{e.time=convertTime(e.clock.textContent)}));const r=calculateRateWeekly(e[0].time);e[0].moneyElementReference.textContent=`$${r.toFixed(2)}`;let o=normalHoursCap,a=overtimeHoursCap;for(let t=e.length-1;t>0;t--){let r=e[t].time,i=0;r>o?(i=o*normalRate,r-=o,o=0,r>a&&(r=a),i+=r*overtimeRate,a-=r):(i=r*normalRate,o-=r),e[t].money=i,e[t].moneyElementReference.textContent=`$${i.toFixed(2)}`}})).observe(e[0].clock,{characterData:!0,attributes:!1,childList:!1,subtree:!0})}}());