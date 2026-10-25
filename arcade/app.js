'use strict';
const catalog=[{id:'neon-dodger',title:'Neon Dodger',developer:'Pixel Vault (original)',year:2026,genre:'Arcade',players:1,license:'CC0-1.0',source:'./games/neon-dodger.json',sourceUrl:'https://github.com/NMoon-Whisper/My-First-Site/tree/feat/legal-arcade-section/arcade',attribution:'Original game created for this project.',description:'Dodge falling neon blocks in a fast original canvas arcade game.',system:'Browser Canvas',art:'🟩'}];
const $=id=>document.getElementById(id);
const get=(k,fallback)=>{try{return JSON.parse(localStorage.getItem('pv:'+k))??fallback}catch{return fallback}};
const set=(k,v)=>{try{localStorage.setItem('pv:'+k,JSON.stringify(v))}catch{}};
let listMode=false,filterMode='all';
function render(){
 const q=$('search').value.toLowerCase(),g=$('genre').value,p=$('players').value,y=$('year').value;
 const fav=new Set(get('favorites',[])),recent=get('recent',[]);
 let items=catalog.filter(x=>(x.title+' '+x.developer+' '+x.description).toLowerCase().includes(q)&&(!g||x.genre===g)&&(!p||String(x.players)===p)&&(!y||String(x.year)===y)&& (filterMode!=='favorites'||fav.has(x.id)) && (filterMode!=='recent'||recent.includes(x.id)));
 if(filterMode==='recent')items.sort((a,b)=>recent.indexOf(a.id)-recent.indexOf(b.id));
 const root=$('library');root.className=listMode?'grid list':'grid';root.innerHTML='';
 if(!items.length){root.innerHTML='<div class="empty"><h3>No matching legal arcade titles</h3><p>This catalog intentionally includes only games with documented redistribution rights. Load your own authorized ROM locally below.</p></div>';return}
 for(const game of items){
  const card=document.createElement('article');card.className='card';
  const art=document.createElement('div');art.className='art';art.textContent=game.art;
  const title=document.createElement('h3');title.textContent=game.title;
  const desc=document.createElement('p');desc.textContent=game.description;
  const meta=document.createElement('p');meta.className='muted';meta.textContent=game.system+' · '+game.genre+' · '+game.players+' player · '+game.year;
  const badge=document.createElement('span');badge.className='tag';badge.textContent=game.license+' · license';
  const sourceBadge=document.createElement('span');sourceBadge.className='tag';sourceBadge.textContent='Source documented';const source=document.createElement('a');source.href=game.sourceUrl;source.target='_blank';source.rel='noopener noreferrer';source.textContent=game.sourceUrl;source.style.color='var(--lime)';source.style.display='inline-block';source.style.overflowWrap='anywhere';source.style.margin='6px 0';const attribution=document.createElement('p');attribution.className='muted';attribution.textContent='Attribution: '+game.attribution;
  const favBtn=document.createElement('button');favBtn.textContent=fav.has(game.id)?'★ Favorited':'☆ Favorite';favBtn.setAttribute('aria-pressed',String(fav.has(game.id)));favBtn.onclick=()=>{const f=new Set(get('favorites',[]));f.has(game.id)?f.delete(game.id):f.add(game.id);set('favorites',[...f]);render()};
  const play=document.createElement('button');play.className='primary';play.textContent='Play now';play.onclick=()=>{ $('playingTitle').textContent=game.title;$('playPanel').scrollIntoView({behavior:'smooth'});startGame();set('recent',[game.id,...get('recent',[]).filter(id=>id!==game.id)].slice(0,12));};
  card.append(art,title,desc,meta,badge,sourceBadge,document.createElement('br'),source,attribution,favBtn,play);root.append(card)
 }
}
$('search').addEventListener('input',render);$('genre').addEventListener('change',render);$('players').addEventListener('change',render);$('year').addEventListener('change',render);
$('viewToggle').onclick=()=>{listMode=!listMode;$('viewToggle').textContent=listMode?'Grid view':'List view';render()};
$('showFavorites').onclick=()=>{filterMode=filterMode==='favorites'?'all':'favorites';$('showFavorites').setAttribute('aria-pressed',String(filterMode==='favorites'));render()};
$('showRecent').onclick=()=>{filterMode=filterMode==='recent'?'all':'recent';$('showRecent').setAttribute('aria-pressed',String(filterMode==='recent'));render()};
const canvas=$('game'),ctx=canvas.getContext('2d');let running=false,raf=0,last=0,frames=0,fpsStart=0,fpsValue=0,player={x:230,y:250,w:20,h:20},blocks=[],score=0,keys=new Set(),touch=new Set();
function resetGame(){player={x:230,y:250,w:20,h:20};blocks=[];score=0;last=0;frames=0;fpsStart=performance.now();draw()}
function startGame(){if(running)return;running=true;$('gameStatus').textContent='Playing — avoid the blocks!';raf=requestAnimationFrame(loop)}
function pauseGame(){running=false;cancelAnimationFrame(raf);$('gameStatus').textContent='Paused.'}
function draw(){ctx.fillStyle='#070a15';ctx.fillRect(0,0,480,300);ctx.strokeStyle='#182744';for(let x=0;x<480;x+=24){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,300);ctx.stroke()}ctx.fillStyle='#b9f66a';ctx.fillRect(player.x,player.y,player.w,player.h);ctx.fillStyle='#ff6bcb';blocks.forEach(b=>ctx.fillRect(b.x,b.y,b.w,b.h));ctx.fillStyle='#f3f6ff';ctx.font='bold 14px system-ui';ctx.fillText('SCORE '+score,12,22);if($('fpsToggle').checked)ctx.fillText('FPS '+fpsValue,400,22)}
function loop(now){if(!running)return;const dt=Math.min((now-(last||now))/1000,.04);last=now;
 const pads=navigator.getGamepads?.()||[];for(const pad of pads){if(!pad)continue;if(pad.axes[0]<-.3||pad.buttons[14]?.pressed)keys.add('ArrowLeft');else keys.delete('ArrowLeft');if(pad.axes[0]>.3||pad.buttons[15]?.pressed)keys.add('ArrowRight');else keys.delete('ArrowRight');if(pad.axes[1]<-.3||pad.buttons[12]?.pressed)keys.add('ArrowUp');else keys.delete('ArrowUp');if(pad.axes[1]>.3||pad.buttons[13]?.pressed)keys.add('ArrowDown');else keys.delete('ArrowDown')}
 const speed=230*dt;if(keys.has('ArrowLeft')||keys.has('a')||touch.has('left'))player.x-=speed;if(keys.has('ArrowRight')||keys.has('d')||touch.has('right'))player.x+=speed;if(keys.has('ArrowUp')||keys.has('w')||touch.has('up'))player.y-=speed;if(keys.has('ArrowDown')||keys.has('s')||touch.has('down'))player.y+=speed;player.x=Math.max(0,Math.min(460,player.x));player.y=Math.max(0,Math.min(280,player.y));
 if(Math.random()<Math.min(.05,.012+score/30000))blocks.push({x:Math.random()*460,y:-18,w:12+Math.random()*18,h:12+Math.random()*18,v:85+Math.random()*130});blocks.forEach(b=>b.y+=b.v*dt);blocks=blocks.filter(b=>b.y<320);score+=Math.round(dt*10);
 for(const b of blocks){if(player.x<b.x+b.w&&player.x+player.w>b.x&&player.y<b.y+b.h&&player.y+player.h>b.y){pauseGame();$('gameStatus').textContent='Game over — score '+score+'. Press Restart to try again.';break}}
 frames++;if(now-fpsStart>=500){fpsValue=Math.round(frames*1000/(now-fpsStart));frames=0;fpsStart=now;$('fps').textContent=$('fpsToggle').checked?fpsValue+' FPS':''}draw();if(running)raf=requestAnimationFrame(loop)}
document.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' '].includes(e.key))e.preventDefault();keys.add(e.key);if(e.key===' '&&!running)startGame()});document.addEventListener('keyup',e=>keys.delete(e.key));
document.querySelectorAll('[data-dir]').forEach(b=>{const d=b.dataset.dir;const down=e=>{e.preventDefault();touch.add(d)},up=e=>{e.preventDefault();touch.delete(d)};b.addEventListener('pointerdown',down);['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,up))});
$('start').onclick=startGame;$('pause').onclick=pauseGame;$('reset').onclick=()=>{pauseGame();resetGame();startGame()};$('fullscreen').onclick=()=>{const el=$('screen');if(document.fullscreenElement)document.exitFullscreen?.();else el.requestFullscreen?.()};$('fpsToggle').onchange=draw;
const savedSettings=get('settings',{crt:false});set('settings',savedSettings);resetGame();render();
let emulatorInstance=null;
$('loadRom').onclick=()=>{
 const file=$('romFile').files?.[0];if(!file){$('romStatus').textContent='Choose a local ROM or ZIP first.';return}
 if(file.size>512*1024*1024){$('romStatus').textContent='File exceeds the 512 MiB safety limit.';return}
 if(!/^[\w .()\-\[\]]+$/.test(file.name)){$('romStatus').textContent='Filename contains unsupported characters. Rename it using letters, numbers, spaces, dots, dashes, or underscores.';return}
 if(!/\.(zip|7z|bin|rom|nes|sfc|smc|gba|gb|gbc|md|gen|cue|chd)$/i.test(file.name)){$('romStatus').textContent='Unsupported file extension. Try a core-supported ROM or ZIP.';return}
 pauseGame();if(emulatorInstance?.blobUrl)URL.revokeObjectURL(emulatorInstance.blobUrl);
 const blobUrl=URL.createObjectURL(file);$('romStatus').textContent='Loading emulator runtime and local file… no upload is performed. Arcade-driver and archive support vary.';
 const container=$('emulator');container.replaceChildren();const config=document.createElement('div');config.id='emulatorjs';config.style.minHeight='400px';container.append(config);
 window.EJS_player='#emulatorjs';window.EJS_core='arcade';window.EJS_gameUrl=blobUrl;window.EJS_pathtodata='https://cdn.emulatorjs.org/stable/data/';window.EJS_startOnLoaded=true;window.EJS_gameName=file.name.replace(/\.[^.]+$/,'').slice(0,100);
 window.EJS_ready=()=>{$('romStatus').textContent='Emulator initialized. If the game does not boot, the selected file/driver may not be supported.'};window.EJS_onGameStart=()=>{$('romStatus').textContent='Emulator running. Save states and controls depend on the core/game.'};
 const script=document.createElement('script');script.src='https://cdn.emulatorjs.org/stable/data/loader.js';script.async=true;script.onerror=()=>{$('romStatus').textContent='Could not load EmulatorJS from its CDN. Check your connection; Neon Dodger remains available.';URL.revokeObjectURL(blobUrl)};script.onload=()=>{emulatorInstance={blobUrl,script}};document.head.append(script);
 set('recentFiles',[{name:file.name,size:file.size,at:Date.now()},...get('recentFiles',[])].slice(0,5))
};
$('stopRom').onclick=()=>{if(emulatorInstance?.blobUrl)URL.revokeObjectURL(emulatorInstance.blobUrl);emulatorInstance=null;$('emulator').replaceChildren();$('romStatus').textContent='Emulator stopped. The ROM was not uploaded or saved.'};
window.addEventListener('beforeunload',()=>{if(emulatorInstance?.blobUrl)URL.revokeObjectURL(emulatorInstance.blobUrl)});
