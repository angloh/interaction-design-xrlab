
let SESSION=null, CURRENT_TRIAL=null, START_TIME=0;
function nowMs(){ return performance.now(); }
function renderStim(stim){
  const screen=document.getElementById('screen');
  if (stim.sequence){ screen.textContent='Memorize:\n'+stim.sequence.join(' '); }
  else if (typeof stim.digit!=='undefined'){ screen.textContent=String(stim.digit); }
  else if (stim.word && stim.ink_color){
    const span=document.createElement('span'); span.textContent=stim.word; span.style.fontSize='64px'; span.style.fontWeight='bold'; span.style.color=stim.ink_color;
    screen.innerHTML=''; screen.appendChild(span);
  } else { screen.textContent=JSON.stringify(stim,null,2); }
}
async function start(){
  const r=await fetch(`/api/${window.EXP_TYPE}/start`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({config:{}})});
  const data=await r.json(); SESSION=data.session_id; nextTrial();
}
async function nextTrial(){
  const r=await fetch(`/api/${window.EXP_TYPE}/next`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({session_id: SESSION})});
  const data=await r.json(); const screen=document.getElementById('screen');
  if (data.complete || !data.trial){ screen.textContent='Complete.\n'+JSON.stringify(data.results||{},null,2); window.removeEventListener('keydown', onKey); return; }
  CURRENT_TRIAL=data.trial; renderStim(CURRENT_TRIAL.stimulus_data||{}); START_TIME=nowMs();
}
async function sendResponse(val){
  if (!CURRENT_TRIAL) return;
  const rt=Math.max(0, nowMs()-START_TIME);
  const payload={ session_id: SESSION, response: { trial_number: CURRENT_TRIAL.trial_number||0, response_value: String(val), response_time_ms: rt, correct_response: CURRENT_TRIAL.correct_response, metadata: CURRENT_TRIAL.metadata||{} } };
  await fetch(`/api/${window.EXP_TYPE}/record`, {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload)});
  CURRENT_TRIAL=null; nextTrial();
}
function onKey(e){
  const stim=(CURRENT_TRIAL && CURRENT_TRIAL.stimulus_data)||{};
  if (stim.sequence){
    if (!window._typed) window._typed='';
    if (/[0-9]/.test(e.key)) { window._typed += e.key; }
    if (e.key==='Backspace'){ window._typed = (window._typed||'').slice(0,-1); }
    if (e.key==='Enter'){ const val=window._typed; window._typed=''; sendResponse(val); }
    else { document.getElementById('screen').textContent='Type sequence then Enter:\n'+(window._typed||''); }
    return;
  }
  if (typeof stim.digit!=='undefined'){ if (e.code==='Space'){ sendResponse('space'); } return; }
  if (stim.word && stim.ink_color){ if (['r','g','b','y'].includes(e.key.toLowerCase())){ sendResponse(e.key.toLowerCase()); } return; }
}
async function openHelp(){
  const r = await fetch(`/api/${window.EXP_TYPE}/help`);
  const data = await r.json();
  document.getElementById('helpText').textContent = data.help_text || 'No help text.';
  document.getElementById('modal').classList.remove('hidden');
}
function closeHelp(){ document.getElementById('modal').classList.add('hidden'); }
window.addEventListener('DOMContentLoaded', ()=>{
  document.getElementById('start').addEventListener('click', start);
  const hb=document.getElementById('helpBtn'); if(hb){ hb.addEventListener('click', openHelp); }
  const ch=document.getElementById('closeHelp'); if(ch){ ch.addEventListener('click', closeHelp); }
  window.addEventListener('keydown', onKey);
});
