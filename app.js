const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
$$('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}}));
const systemTheme=matchMedia('(prefers-color-scheme: dark)');let chosen='dark';try{chosen=localStorage.getItem('itw-theme')||'dark'}catch{}function applyTheme(mode){if(!['dark','light','system'].includes(mode))mode='dark';chosen=mode;document.documentElement.dataset.theme=mode==='system'?(systemTheme.matches?'dark':'light'):mode;$('.theme-symbol').textContent=mode==='system'?'◐':mode==='dark'?'☾':'☀';$$('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===mode)));try{localStorage.setItem('itw-theme',mode)}catch{}}applyTheme(chosen);systemTheme.addEventListener('change',()=>{if(chosen==='system')applyTheme('system')});$('.theme-toggle').addEventListener('click',()=>{$('.theme-menu').hidden=!$('.theme-menu').hidden;$('.theme-toggle').setAttribute('aria-expanded',String(!$('.theme-menu').hidden))});$$('[data-mode]').forEach(b=>b.addEventListener('click',()=>{applyTheme(b.dataset.mode);$('.theme-menu').hidden=true;$('.theme-toggle').setAttribute('aria-expanded','false')}));document.addEventListener('click',e=>{if(!e.target.closest('.theme-menu,.theme-toggle')){$('.theme-menu').hidden=true;$('.theme-toggle').setAttribute('aria-expanded','false')}});document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('.theme-menu').hidden=true;$('.theme-toggle').setAttribute('aria-expanded','false')}});$('.menu-toggle').addEventListener('click',()=>{const open=$('nav').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',String(open))});$$('nav a').forEach(a=>a.addEventListener('click',()=>{$('nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false')}));
// Disclosure navigation: links navigate; separate buttons expand submenus.
const navigation = $('#main-navigation');
const navigationGroups = $$('.nav-group');
function setSubmenu(group, open) {
  group.classList.toggle('is-open', open);
  group.querySelector('.nav-expand').setAttribute('aria-expanded', String(open));
  group.querySelector('.nav-sub').hidden = !open;
}
function closeSubmenus(except) {
  navigationGroups.forEach(group => { if (group !== except) setSubmenu(group, false); });
}
navigationGroups.forEach(group => {
  setSubmenu(group, false);
  group.querySelector('.nav-expand').addEventListener('click', () => {
    const open = !group.classList.contains('is-open');
    closeSubmenus(group);
    setSubmenu(group, open);
  });
});
navigation.classList.add('nav-ready');
navigation.addEventListener('focusout', event => {
  if (!navigation.contains(event.relatedTarget)) closeSubmenus();
});
document.addEventListener('click', event => {
  if (!event.target.closest('#main-navigation')) closeSubmenus();
});
navigation.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  const group = event.target.closest('.nav-group.is-open');
  if (!group) return;
  event.stopPropagation();
  setSubmenu(group, false);
  group.querySelector('.nav-expand').focus();
});
$('.menu-toggle').addEventListener('click', closeSubmenus);

const reduce=matchMedia('(prefers-reduced-motion: reduce)');let tx=0,ty=0,rx=0,ry=0,raf=0;function animate(){rx+=(tx-rx)*.06;ry+=(ty-ry)*.06;$('#scene').style.transform=`rotateX(${rx}deg) rotateY(${ry}deg) translateY(${Math.min(scrollY,650)*.015}px)`;if(Math.abs(tx-rx)+Math.abs(ty-ry)>.005)raf=requestAnimationFrame(animate);else raf=0}function startMotion(){if(!reduce.matches&&!raf)raf=requestAnimationFrame(animate)}$('.hero').addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=$('.hero').getBoundingClientRect();tx=(.5-(e.clientY-r.top)/r.height)*1.8;ty=((e.clientX-r.left)/r.width-.5)*2.6;startMotion()});$('.hero').addEventListener('pointerleave',()=>{tx=ty=0;startMotion()});addEventListener('scroll',startMotion,{passive:true});reduce.addEventListener('change',()=>{if(reduce.matches){cancelAnimationFrame(raf);raf=0;$('#scene').style.transform='none'}});
const searchEntries=[['Preise','preise','Stundensatz 95 Wartungsvertrag 299 Managed IT'],['FAQ','faq','Häufige Fragen Support Reaktionszeit Fördermittel'],['Handwerk & Digital','handwerk-digital','Digitalisierung Papierkram Zeiterfassung Angebote'],['So entscheiden wir','technologieansatz','Entscheidung Lizenzen Betriebskosten Wechsel Bedarf'],['Projektablauf','prozess','Bedarfsanalyse Angebot Umsetzung Übergabe'],['Technologien','techstack','VMware Hyper-V Cisco Aruba Veeam Checkmk'],['Cloud & Hybrid','cloud-hybrid','Azure AWS Google Cloud M365 Migration'],['IT-Infrastruktur','infrastruktur','Server Proxmox Ceph Netzwerk Speicher Virtualisierung Dokumentation'],['Managed Services & Updates','managed','Monitoring Zabbix Grafana Updates Patch Management Wartung Backup Server Netzwerk Arbeitsplätze Betrieb'],['KI im Unternehmen','ai','KI Ollama Open WebUI Daten'],['IT-Sicherheit','security','Identity Firewall OPNsense Backup Recovery'],['Branchen','branchen','Handwerk Kanzlei Rechtsanwalt Architektur Architekturbüros BIM CAD'],['IT-Check','it-check','Prüfung Analyse Selbsteinschätzung'],['Open Source First','technologieansatz','Über uns unabhängig Haltung offene Lösungen Beratung'],['Wissen','wissen','Backup Wiederherstellung Berechtigungen'],['Kontakt','kontakt','Gespräch']];function search(){const q=$('#search-input').value.toLocaleLowerCase('de').trim();const rows=searchEntries.filter(r=>r.join(' ').toLocaleLowerCase('de').includes(q));$('#search-results').replaceChildren();if(!rows.length){const p=document.createElement('p');p.textContent='Kein passendes Thema gefunden.';$('#search-results').append(p)}for(const r of rows){const a=document.createElement('a');a.href='#'+r[1];a.textContent=r[0];a.addEventListener('click',()=>$('#search-dialog').close());$('#search-results').append(a)}}$('.search-toggle').addEventListener('click',()=>{$('#search-dialog').showModal();search();$('#search-input').focus()});$('#search-input').addEventListener('input',search);
const questions=[{"title": "Könnten Sie wichtige Daten nach einem Ausfall zurückholen?", "description": "Wurde schon praktisch getestet, ob sich wichtige Dateien oder Programme aus Ihrer Sicherung wiederherstellen lassen?", "topic": "Datensicherung", "action": "Eine Wiederherstellung wichtiger Dateien und Programme testen lassen und das Ergebnis festhalten."}, {"title": "Ist geregelt, wer auf Ihre Daten zugreifen darf?", "description": "Jede Person hat einen eigenen Zugang. Wichtige Anmeldungen sind zusätzlich abgesichert; beim Ausscheiden werden Zugänge gesperrt.", "topic": "Zugänge", "action": "Persönliche Zugänge und Berechtigungen prüfen. Wichtige Anmeldungen zusätzlich absichern und das Sperren ausgeschiedener Mitarbeiter regeln."}, {"title": "Kümmert sich jemand um Updates?", "description": "Es ist bekannt, wer Aktualisierungen prüft und einspielt – und was bei Problemen zu tun ist.", "topic": "Wartung", "action": "Verantwortliche für Updates benennen und Zeiten sowie Rückwege bei Problemen vereinbaren."}, {"title": "Wüsste eine Vertretung im Notfall, was zu tun ist?", "description": "Es gibt eine auffindbare Übersicht wichtiger Systeme, Ansprechpartner und Schritte für den Wiederanlauf.", "topic": "Notfallwissen", "action": "Systeme, Ansprechpartner und Schritte für den Notfall dokumentieren und für zuständige Vertretungen zugänglich machen."}, {"title": "Erfährt jemand rechtzeitig von technischen Problemen?", "description": "Wichtige Systeme und Sicherungsmeldungen werden kontrolliert. Eine zuständige Person erhält und bewertet die Hinweise.", "topic": "Überwachung", "action": "Kontrollen für wichtige Systeme und Sicherungen festlegen und klären, wer auf Meldungen reagiert."}];let step=0,answers=[];const labels=['Ja, geregelt und überprüft','Teilweise','Nein','Weiß ich nicht'];const panel=$('#check-panel');function showQuestion(){panel.innerHTML=`<p class="eyebrow">FRAGE ${step+1} VON ${questions.length} · ${questions[step].topic.toUpperCase()}</p><h3 tabindex="-1">${questions[step].title}</h3><p>${questions[step].description}</p><div class="check-options">${labels.map((t,i)=>`<button data-answer="${i}">${t}</button>`).join('')}</div>${step?'<button class="check-back">Vorherige Frage</button>':''}`;panel.querySelector('h3').focus({preventScroll:true});$$('[data-answer]').forEach(b=>b.onclick=()=>{answers[step]=Number(b.dataset.answer);step++;step===questions.length?showResult():showQuestion()});const back=panel.querySelector('.check-back');if(back)back.onclick=()=>{step--;showQuestion()}}function report(){let text='IT·WERKSTATT STUTTGART – IT-CHECK\nSelbsteinschätzung vom '+new Date().toLocaleDateString('de-DE')+'\n\n';questions.forEach((q,i)=>{text+=q.topic+': '+labels[answers[i]]+'\n';if(answers[i]>0)text+='Ansatzpunkt: '+q.action+'\n';text+='\n'});return text+'Die Angaben wurden nicht technisch geprüft. Diese Orientierung ersetzt keine technische Prüfung. Es wurden keine Antworten übermittelt.'}function showResult(){const open=questions.filter((_,i)=>answers[i]>0);panel.innerHTML=`<p class="eyebrow">IHRE ERSTE EINORDNUNG</p><h3 tabindex="-1">${open.length?(open.length===1?'Ein Thema verdient einen genaueren Blick.':open.length+' Themen verdienen einen genaueren Blick.'):'Eine nachvollziehbare Ausgangslage.'}</h3><p>${open.length?'Aus Ihren Antworten ergeben sich diese Ansatzpunkte:':'Sie beschreiben alle fünf Bereiche als geregelt. Der nächste Schritt ist, die Nachweise und die praktische Wirksamkeit gemeinsam zu prüfen.'}</p><p class="result-note">Ihre Selbsteinschätzung ist kein technischer Sicherheitsnachweis. Unbekannte Punkte sind zunächst zu klären.</p><ul class="result-list">${open.map(q=>`<li>${q.action}</li>`).join('')}</ul><div class="result-actions"><a class="button" href="#kontakt">Ergebnis besprechen →</a><button class="button" id="export-result">Ergebnis speichern </button><button class="check-back" id="restart-check">Neu beginnen</button></div>`;panel.querySelector('h3').focus({preventScroll:true});$('#restart-check').onclick=startCheck;$('#export-result').onclick=()=>{const u=URL.createObjectURL(new Blob([report()],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='IT-Werkstatt-IT-Check.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000)}}function startCheck(){step=0;answers=[];showQuestion()}$('#check-start').onclick=startCheck;$('#year').textContent=new Date().getFullYear();


new MutationObserver(()=>$('.theme-toggle').setAttribute('aria-expanded',String(!$('.theme-menu').hidden))).observe($('.theme-menu'),{attributes:true,attributeFilter:['hidden']});

// Keep every internal topic in this document, with an unobscured, focused target.
function closeNavigation(){
  closeSubmenus();
  $('nav').classList.remove('open');
  $('.menu-toggle').setAttribute('aria-expanded','false');
  $('.theme-menu').hidden=true;
  $('.theme-toggle').setAttribute('aria-expanded','false');
  $$('dialog[open]').forEach(dialog=>dialog.close());
}
function markCurrentTopic(){
  $$('#main-navigation a').forEach(a=>{
    if(a.hash===location.hash)a.setAttribute('aria-current','location');
    else a.removeAttribute('aria-current');
  });
}
document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#"]');
  if(!link||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const hash=link.getAttribute('href');
  const target=hash==='#'?$('main'):document.getElementById(hash.slice(1));
  if(!target)return;
  event.preventDefault();
  closeNavigation();
  if(location.hash!==hash)history.pushState(null,'',hash);
  target.setAttribute('tabindex','-1');
  target.focus({preventScroll:true});
  target.scrollIntoView({behavior:reduce.matches?'instant':'smooth',block:'start'});
  markCurrentTopic();
});
function syncHeaderOffset(){document.documentElement.style.setProperty('--anchor-offset',Math.ceil($('header').getBoundingClientRect().height+20)+'px')}
new ResizeObserver(syncHeaderOffset).observe($('header'));
syncHeaderOffset();
addEventListener('popstate',()=>{closeNavigation();markCurrentTopic()});
addEventListener('hashchange',markCurrentTopic);
markCurrentTopic();

document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && $('nav').classList.contains('open')){
    closeNavigation();
    $('.menu-toggle').focus();
  }
});
document.addEventListener('click',event=>{
  if($('nav').classList.contains('open') && !event.target.closest('#main-navigation,.menu-toggle')){
    $('nav').classList.remove('open');
    $('.menu-toggle').setAttribute('aria-expanded','false');
  }
});
