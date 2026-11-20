(()=>{'use strict';
const $=(s,root=document)=>root.querySelector(s), $$=(s,root=document)=>[...root.querySelectorAll(s)];
let soundOn=false, introClosed=false, buildCount=0, motionOn=!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches), audioContext;
const intro=$('#intro'), field=$('#cursorField'), stage=$('#heroStage');
const colors=['#e78eb6','#7f68ab','#6ba58c','#d19571','#a2a0c4','#c16092'];
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('show');clearTimeout(toast.timer);toast.timer=setTimeout(()=>e.classList.remove('show'),2700)}
function sound(freq=660){if(!soundOn)return;try{audioContext ||= new (window.AudioContext||window.webkitAudioContext)();if(audioContext.state==='suspended')audioContext.resume();let oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.type='sine';oscillator.frequency.setValueAtTime(freq,audioContext.currentTime);oscillator.frequency.exponentialRampToValueAtTime(freq*.72,audioContext.currentTime+.085);gain.gain.setValueAtTime(.025,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+.095);oscillator.connect(gain).connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+.10)}catch(_){/* Audio is optional. */}}
function closeIntro(skip=false){
  if(introClosed)return;
  introClosed=true;
  const focusWasInside=intro.contains(document.activeElement);
  intro.inert=true;
  intro.classList.add('opening');
  if(focusWasInside)$('#hero-title').focus({preventScroll:true});
  const finish=()=>{intro.hidden=true;if(motionOn)runCursors()};
  if(skip)finish();else setTimeout(finish,1100);
}
if(motionOn&&!location.hash){
  intro.hidden=false;
  setTimeout(closeIntro,2200);
}else{
  introClosed=true;
  if(motionOn)runWhenReady();
}
function runWhenReady(){requestAnimationFrame(runCursors)}
$('#enterStudio').addEventListener('click',()=>closeIntro());
$('#skipIntro').addEventListener('click',()=>closeIntro(true));
document.addEventListener('keydown',event=>{
  if(!introClosed&&(event.key==='Escape'||(event.key==='Tab'&&!intro.contains(document.activeElement))))closeIntro(true);
});
function runCursors(){if(!motionOn||!field||!stage||document.body.classList.contains('recruiter-mode'))return;field.innerHTML='';const build=++buildCount;stage.classList.remove('assembling');void stage.offsetWidth;stage.classList.add('assembling');const r=stage.getBoundingClientRect(),w=r.width,h=r.height;const targets=[[.28,.24],[.59,.17],[.78,.27],[.16,.46],[.26,.55],[.77,.54],[.66,.71],[.19,.77],[.51,.32],[.43,.78],[.84,.8],[.36,.62],[.19,.36],[.64,.4],[.48,.17],[.74,.67],[.31,.69],[.55,.5],[.83,.4],[.43,.47],[.22,.13],[.7,.18],[.45,.9],[.76,.85]];
 const n=w<550?12:24;for(let i=0;i<n;i++){const p=document.createElement('div');p.className='cursor-agent';p.innerHTML=`<svg viewBox="0 0 26 29" role="presentation" aria-hidden="true"><path d="M2 2 L2 24 L8 19 L13 28 L18 25 L13 16 L22 15 Z" fill="${colors[i%colors.length]}" stroke="#483247" stroke-width="1.6" stroke-linejoin="round"/></svg><span class="cursor-index">${({2:'write',5:'plan',8:'connect',11:'measure',15:'research'})[i]||''}</span>`;field.appendChild(p);const side=i%4, sx=side===0?-30:side===1?w+30:(i*59)%w,sy=side===2?-20:side===3?h+20:(i*43)%h;const [tx,ty]=targets[(i+buildCount)%targets.length];p.style.transform=`translate(${sx}px,${sy}px) rotate(${(i%7)*6-20}deg)`;p.style.opacity='0';setTimeout(()=>{if(!p.isConnected)return;p.style.opacity='.92';p.style.transitionDelay=`${i*23}ms`;p.style.transform=`translate(${Math.round(w*tx)}px,${Math.round(h*ty)}px) rotate(${(i%5)*5-10}deg)`},45)}
 setTimeout(()=>{if(build===buildCount) $$('.cursor-agent',field).forEach((p,i)=>{p.style.transitionDelay='0ms';p.style.opacity=i%5===0?'.65':'0'})},2800)}
$('#replayBuild').addEventListener('click',()=>{sound(590);runCursors();toast('Creative desk rebuilt ✳')});
const tilt=$('#photoTilt');if(tilt&&stage){stage.addEventListener('pointermove',e=>{if(!motionOn||e.pointerType==='touch'||document.body.classList.contains('recruiter-mode'))return;const r=stage.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;tilt.style.transform=`rotate(-5deg) perspective(650px) rotateY(${x*8}deg) rotateX(${-y*7}deg)`});stage.addEventListener('pointerleave',()=>{tilt.style.transform='rotate(-5deg)'})}
const name=$('#nameColor');let nameC=0;const palettes=[['#853f68','#634288','#a23f65'],['#a23f59','#925031','#873f80'],['#3e6c5c','#346887','#79498c'],['#7546a0','#9b4060','#6f5e2d']];name.addEventListener('click',()=>{nameC=(nameC+1)%palettes.length;name.style.background=`linear-gradient(95deg,${palettes[nameC].join(',')})`;name.style.webkitBackgroundClip='text';name.style.backgroundClip='text';name.style.color='transparent';sound(650);toast('New colors, same Jhalak ✳')});
const folderData={strategy:{header:'strategy_notes.txt',eyebrow:'THE THINKING BEHIND THE POSTS',title:'Make it<br/><em>mean</em> something.',copy:'I work across content strategy, campaign planning, audience research, editorial calendars, reporting and cross-team execution.',chips:['Audience research','Content calendars','Reporting','Campaign planning'],tag:'strategy / 01',color:'#efdfed'},content:{header:'content_ideas.psd',eyebrow:'CONTENT THAT LOOKS & FEELS HUMAN',title:'Stop the<br/><em>scroll.</em>',copy:'From a creative brief to a reel idea, my process connects tone, audience, production and a consistent brand voice.',chips:['Reel concepts','Creative briefs','Copywriting','Video planning'],tag:'content / 02',color:'#f8d9df'},creators:{header:'creator_collabs.csv',eyebrow:'PEOPLE MAKE THE STORY BIGGER',title:'Make the right<br/><em>connections.</em>',copy:'I bring experience in influencer discovery, outreach, creator coordination, collaboration follow-up and campaign reporting.',chips:['Influencer outreach','Partnerships','Coordination','Reporting'],tag:'creators / 03',color:'#dcebd9'}};
function setFolder(key,focus=false){const data=folderData[key];if(!data)return;$$('.folder').forEach(b=>{const yes=b.dataset.folder===key;b.classList.toggle('active',yes);b.setAttribute('aria-selected',String(yes));b.tabIndex=yes?0:-1});$('#folderPanel').classList.remove('panel-swap');void $('#folderPanel').offsetWidth;$('#folderPanel').classList.add('panel-swap');let selected=$(`.folder[data-folder="${key}"]`);$('#folderPanel').setAttribute('aria-labelledby',selected.id);$('#panelHeader').textContent=data.header;$('#panelEyebrow').textContent=data.eyebrow;$('#panelTitle').innerHTML=data.title;$('#panelCopy').textContent=data.copy;$('#panelChips').replaceChildren(...data.chips.map(s=>{const c=document.createElement('span');c.textContent=s;return c}));$('.art-note').textContent=data.tag;$('#panelArt').style.background=data.color;sound(470);if(focus)$('#folderPanel').focus({preventScroll:true})}
$$('.folder').forEach(b=>b.addEventListener('click',()=>setFolder(b.dataset.folder)));
$$('.folder').forEach((b,i,all)=>b.addEventListener('keydown',e=>{if(['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const j=e.key==='Home'?0:e.key==='End'?all.length-1:e.key==='ArrowRight'||e.key==='ArrowDown'?(i+1)%all.length:(i+all.length-1)%all.length;all[j].focus();setFolder(all[j].dataset.folder)}}));
const recruiterBtn=$('#recruiterBtn');
const recruiter=$('#recruiter');
const recruiterHome=recruiter.previousElementSibling;
recruiterBtn.addEventListener('click',()=>{
  const active=document.body.classList.toggle('recruiter-mode');
  recruiterBtn.setAttribute('aria-pressed',String(active));
  recruiterBtn.textContent=active?'Studio view':'Quick HR view';
  if(active){
    closeIntro(true);
    field.replaceChildren();
    $('#main').prepend(recruiter);
    $('#recruiter-title').focus({preventScroll:true});
    recruiter.scrollIntoView({behavior:'instant',block:'start'});
  }else{
    recruiterHome.after(recruiter);
    $('#hero-title').focus({preventScroll:true});
    window.scrollTo({top:0,behavior:'instant'});
    if(motionOn)runCursors();
  }
});
const soundBtns=[$('#soundBtn'),$('#soundBtnMobile')].filter(Boolean);soundBtns.forEach(btn=>btn.addEventListener('click',()=>{soundOn=!soundOn;soundBtns.forEach((el,i)=>{el.textContent=`Sound: ${soundOn?'on':'off'}${i?' ♫':''}`;el.setAttribute('aria-pressed',String(soundOn))});if(soundOn)sound(720)}));
const menu=$('#menuToggle');menu.addEventListener('click',()=>{const showing=$('#siteNav').classList.toggle('show');menu.setAttribute('aria-expanded',String(showing));menu.textContent=showing?'×':'☰'});$$('#siteNav a').forEach(a=>a.addEventListener('click',()=>{$('#siteNav').classList.remove('show');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
$('#copyEmail').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('workfor.jhalakagrahari@gmail.com');toast('Email copied to clipboard')}catch(_){toast('Email: workfor.jhalakagrahari@gmail.com')}});
window.addEventListener('scroll',()=>{let h=document.documentElement;$('.scroll-line').style.width=`${Math.min(100,window.scrollY/(h.scrollHeight-innerHeight)*100||0)}%`},{passive:true});
if('IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){$('.step-card',e.target).classList.add('active');observer.unobserve(e.target)}})},{threshold:.5});$$('.story-step').forEach(el=>observer.observe(el))}
document.addEventListener('focusin',event=>{
  if(!introClosed&&!intro.contains(event.target))closeIntro(true);
});
window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',event=>{
  motionOn=!event.matches;
  $('#replayBuild').hidden=!motionOn;
  if(!motionOn){closeIntro(true);field.replaceChildren();tilt.style.removeProperty('transform')}
});
$('#replayBuild').hidden=!motionOn;
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){menu.click();menu.focus()}
});
})();
