
(function(){
const $=s=>document.querySelector(s), $$=s=>Array.from(document.querySelectorAll(s));
const get=(k,f)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(f))}catch(e){return f}};
const set=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const today=()=>new Date().toISOString().slice(0,10);
const monthKey=()=>new Date().toISOString().slice(0,7);
const bd=n=>(Number(n)||0).toFixed(3)+' BD';
const dur=ms=>{let m=Math.round(ms/60000);return m<60?m+'m':Math.floor(m/60)+'h '+(m%60)+'m'};
const clock=ms=>{let s=Math.floor(ms/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60);s%=60;return[h,m,s].map(x=>String(x).padStart(2,'0')).join(':')};
const labels={gym:'🏋️ Gym',horse:'🐎 Horse',cycling:'🚴 Cycling',diving:'🤿 Diving',work:'💼 Work'};
let active=get('almeel_active',null), timer=null, muscle='all';

function openPage(id){$$('.page').forEach(p=>p.classList.remove('active'));$$('.nav').forEach(n=>n.classList.remove('active'));$('#'+id)?.classList.add('active');$(`.nav[data-page="${id}"]`)?.classList.add('active');renderAll()}
function runTimer(){clearInterval(timer);if(!active){$('#activeBox')?.classList.add('hidden');return}$('#activeBox')?.classList.remove('hidden');$('#activeType').textContent=labels[active.type]||active.type;const up=()=>$('#activeTimer').textContent=clock(Date.now()-active.start);up();timer=setInterval(up,1000)}
function startActivity(type){active={id:Date.now(),type,start:Date.now()};set('almeel_active',active);openPage('quick');runTimer()}
function finishActivity(){if(!active)return;const end=Date.now(),a=get('almeel_activities',[]);a.unshift({id:active.id,type:active.type,start:active.start,end,duration:end-active.start,date:today()});set('almeel_activities',a);localStorage.removeItem('almeel_active');active=null;alert('Saved ✅');openPage('activities')}

window.deleteActivity=id=>{if(confirm('Delete activity?')){set('almeel_activities',get('almeel_activities',[]).filter(x=>String(x.id)!==String(id)));renderAll()}};
window.editActivity=id=>{let a=get('almeel_activities',[]),x=a.find(v=>String(v.id)===String(id));if(!x)return;let v=prompt('Duration minutes:',Math.round(x.duration/60000));if(v===null)return;x.duration=Number(v)*60000;x.end=x.start+x.duration;set('almeel_activities',a);renderAll()};
window.deleteEvent=id=>{if(confirm('Delete event?')){set('almeel_events',get('almeel_events',[]).filter(x=>String(x.id)!==String(id)));renderAll()}};
window.doneEvent=id=>{let a=get('almeel_events',[]),x=a.find(v=>String(v.id)===String(id));if(!x)return;x.done=!x.done;set('almeel_events',a);renderAll()};
window.editEvent=id=>{let a=get('almeel_events',[]),x=a.find(v=>String(v.id)===String(id));if(!x)return;let title=prompt('Title:',x.title);if(title===null)return;let date=prompt('Date YYYY-MM-DD:',x.date);if(date===null)return;let time=prompt('Time HH:MM:',x.time||'');if(time===null)return;let notes=prompt('Notes:',x.notes||'');if(notes===null)return;Object.assign(x,{title,date,time,notes});set('almeel_events',a);renderAll()};
window.deleteExpense=id=>{if(confirm('Delete expense?')){set('almeel_expenses',get('almeel_expenses',[]).filter(x=>String(x.id)!==String(id)));renderAll()}};
window.editExpense=id=>{let a=get('almeel_expenses',[]),x=a.find(v=>String(v.id)===String(id));if(!x)return;let v=prompt('Amount:',x.amount);if(v===null)return;x.amount=Number(v);set('almeel_expenses',a);renderAll()};
window.deleteJournal=id=>{if(confirm('Delete note?')){set('almeel_journal',get('almeel_journal',[]).filter(x=>String(x.id)!==String(id)));renderAll()}};
window.editJournal=id=>{let a=get('almeel_journal',[]),x=a.find(v=>String(v.id)===String(id));if(!x)return;let v=prompt('Edit note:',x.text);if(v===null)return;x.text=v;set('almeel_journal',a);renderAll()};

function renderEvents(){let a=get('almeel_events',[]).sort((x,y)=>(x.date+(x.time||'')).localeCompare(y.date+(y.time||'')));$('#eventList').innerHTML=a.map(x=>`<div class="entry ${x.done?'done':''}"><div class="row"><b>${x.done?'✅':x.type||'📅'} ${x.title}</b><span class="badge">${x.date} ${x.time||''}</span></div><p>${x.notes||''}</p><div class="actions"><button class="mini" onclick="doneEvent('${x.id}')">${x.done?'Undo':'✅ Done'}</button><button class="mini" onclick="editEvent('${x.id}')">✏️ Edit</button><button class="mini danger" onclick="deleteEvent('${x.id}')">🗑 Delete</button></div></div>`).join('')||'<p>No events yet.</p>'}
function renderActivities(){let a=get('almeel_activities',[]);$('#activityList').innerHTML=a.map(x=>`<div class="entry"><div class="row"><b>${labels[x.type]||x.type}</b><span class="badge">${dur(x.duration)}</span></div><p>${new Date(x.start).toLocaleString()}</p><div class="actions"><button class="mini" onclick="editActivity('${x.id}')">✏️ Edit</button><button class="mini danger" onclick="deleteActivity('${x.id}')">🗑 Delete</button></div></div>`).join('')||'<p>No activities yet.</p>'}
function renderExpenses(){let a=get('almeel_expenses',[]);$('#expenseList').innerHTML=a.map(x=>`<div class="entry"><div class="row"><b>${x.category} ${x.title}</b><span class="badge">${bd(x.amount)}</span></div><p>${x.date}</p><div class="actions"><button class="mini" onclick="editExpense('${x.id}')">✏️ Edit</button><button class="mini danger" onclick="deleteExpense('${x.id}')">🗑 Delete</button></div></div>`).join('')||'<p>No expenses yet.</p>'}
function renderJournal(){let a=get('almeel_journal',[]);$('#journalList').innerHTML=a.map(x=>`<div class="entry"><div class="row"><b>📝 Note</b><span class="badge">${x.date}</span></div><p>${x.text}</p><div class="actions"><button class="mini" onclick="editJournal('${x.id}')">✏️ Edit</button><button class="mini danger" onclick="deleteJournal('${x.id}')">🗑 Delete</button></div></div>`).join('')||'<p>No notes yet.</p>'}
function openExercise(i){const x=(window.ALMEEL_EXERCISES||[])[i];if(!x)return;$('#exerciseDetailBox').innerHTML=`<div class="card"><div class="exercise-icon">${x.icon}</div><h2>${x.name}</h2><p><b>Muscle:</b> ${x.muscle}</p><p><b>Sets:</b> ${x.sets}</p><p><b>How:</b> ${x.tip}</p><button class="primary startBtn" data-type="gym">Start Gym</button></div>`;openPage('exerciseDetail');setTimeout(()=>$('#exerciseDetail .startBtn').onclick=()=>startActivity('gym'),20)}
function renderExercises(){let q=($('#exerciseSearch')?.value||'').toLowerCase(), list=(window.ALMEEL_EXERCISES||[]).filter(x=>(muscle==='all'||x.muscle===muscle)&&(x.name.toLowerCase().includes(q)||x.muscle.toLowerCase().includes(q)));$('#exerciseList').innerHTML=list.map(x=>{let i=(window.ALMEEL_EXERCISES||[]).indexOf(x);return `<div class="exercise-card"><div class="exercise-icon">${x.icon}</div><b>${x.name}</b><small>${x.muscle}</small><p>${x.sets}</p><button class="primary" onclick="window.openExercise(${i})">Open</button></div>`}).join('')||'<p>No exercises found.</p>'}
window.openExercise=openExercise;
function renderToday(){let e=get('almeel_events',[]).filter(x=>x.date===today()&&!x.done), a=get('almeel_activities',[]).filter(x=>x.date===today()), ex=get('almeel_expenses',[]).filter(x=>x.date===today());$('#todayList').innerHTML=[...e.map(x=>`<div class="entry"><b>${x.type||'📅'} ${x.title}</b><p>${x.time||''} ${x.notes||''}</p></div>`),...a.map(x=>`<div class="entry"><b>${labels[x.type]}</b><p>${dur(x.duration)}</p></div>`),...ex.map(x=>`<div class="entry"><b>💰 ${x.title}</b><p>${bd(x.amount)}</p></div>`)].join('')||'<p>No events today.</p>'}
function renderStats(){let acts=get('almeel_activities',[]).filter(x=>x.date===today()), exps=get('almeel_expenses',[]), todaySpent=exps.filter(x=>x.date===today()).reduce((s,x)=>s+Number(x.amount),0), monthSpent=exps.filter(x=>x.date&&x.date.startsWith(monthKey())).reduce((s,x)=>s+Number(x.amount),0), salary=Number(localStorage.getItem('almeel_salary')||0), water=Number(localStorage.getItem('almeel_water')||0);$('#activeToday').textContent=dur(acts.reduce((s,x)=>s+x.duration,0));$('#spentToday').textContent=bd(todaySpent);$('#remainingSalary').textContent=salary?bd(salary-monthSpent):'—';$('#salaryView').textContent=salary?bd(salary):'Set salary';$('#remainingView').textContent=salary?bd(salary-monthSpent):'—';$('#monthSpentView').textContent=bd(monthSpent);$('#waterCount').textContent=water+'/14';$('#waterBig').textContent=water+' / 14';$('#salaryInput').value=salary||''}
function renderAll(){renderEvents();renderActivities();renderExpenses();renderJournal();renderExercises();renderToday();renderStats();runTimer()}

document.addEventListener('DOMContentLoaded',()=>{
setTimeout(()=>$('#splash')?.classList.add('hide'),1000);
$$('.nav').forEach(b=>b.onclick=()=>openPage(b.dataset.page));
$$('.openBtn').forEach(b=>b.onclick=()=>openPage(b.dataset.target));
$$('.startBtn').forEach(b=>b.onclick=()=>startActivity(b.dataset.type));
$$('.muscleTab').forEach(b=>b.onclick=()=>{$$('.muscleTab').forEach(x=>x.classList.remove('active'));b.classList.add('active');muscle=b.dataset.muscle;renderExercises()});
$('#exerciseSearch')?.addEventListener('input',renderExercises);
$('#finishActivity').onclick=finishActivity;
$('#saveEvent').onclick=()=>{let title=$('#eventTitle').value.trim();if(!title){alert('اكتب العنوان');return}let a=get('almeel_events',[]);a.unshift({id:Date.now(),title,date:$('#eventDate').value||today(),time:$('#eventTime').value,type:$('#eventType').value,notes:$('#eventNotes').value,done:false});set('almeel_events',a);$('#eventTitle').value='';$('#eventTime').value='';$('#eventNotes').value='';renderAll();alert('Event Saved ✅')};
$('#saveSalary').onclick=()=>{localStorage.setItem('almeel_salary',Number($('#salaryInput').value||0));renderAll()};
$('#saveExpense').onclick=()=>{let title=$('#expenseTitle').value.trim(), amount=Number($('#expenseAmount').value);if(!title||!amount){alert('اكتب المصروف والمبلغ');return}let a=get('almeel_expenses',[]);a.unshift({id:Date.now(),title,amount,category:$('#expenseCategory').value,date:today()});set('almeel_expenses',a);$('#expenseTitle').value='';$('#expenseAmount').value='';renderAll()};
$('#saveJournal').onclick=()=>{let text=$('#journalText').value.trim();if(!text){alert('اكتب النوت');return}let a=get('almeel_journal',[]);a.unshift({id:Date.now(),text,date:new Date().toLocaleString()});set('almeel_journal',a);$('#journalText').value='';renderAll()};
$('#plusWater').onclick=()=>{localStorage.setItem('almeel_water',Math.min(14,Number(localStorage.getItem('almeel_water')||0)+1));renderAll()};
$('#minusWater').onclick=()=>{localStorage.setItem('almeel_water',Math.max(0,Number(localStorage.getItem('almeel_water')||0)-1));renderAll()};
$('#installBtn').onclick=()=>alert('On iPhone: Share → Add to Home Screen');
$('#eventDate').value=today();
if('serviceWorker'in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
renderAll();
});
})();
