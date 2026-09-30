const canvas = document.getElementById('sky');
const ctx = canvas.getContext('2d');
let w=0,h=0,dpr=1,stars=[],petals=[],raf=0;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function resize(){
  dpr=Math.min(window.devicePixelRatio||1,1.6);
  w=window.innerWidth; h=window.innerHeight;
  canvas.width=Math.floor(w*dpr); canvas.height=Math.floor(h*dpr);
  canvas.style.width=w+'px'; canvas.style.height=h+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars=Array.from({length:Math.min(95,Math.floor(w*h/8500))},()=>({
    x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.5+.35,
    a:Math.random()*.65+.15,phase:Math.random()*Math.PI*2,speed:.005+Math.random()*.012
  }));
}
function draw(){
  ctx.clearRect(0,0,w,h);
  stars.forEach(s=>{
    s.phase+=s.speed;
    const alpha=s.a*(.55+.45*Math.sin(s.phase));
    ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(255,224,170,${alpha})`;ctx.fill();
  });
  if(!reduced){
    petals.forEach(p=>{
      p.y+=p.vy;p.x+=Math.sin(p.y*.012+p.phase)*.55;
      p.rot+=p.vr;
      ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);
      ctx.globalAlpha=p.alpha;ctx.fillStyle=p.color;
      ctx.beginPath();ctx.ellipse(0,0,p.size*.55,p.size,0,0,Math.PI*2);ctx.fill();ctx.restore();
    });
    petals=petals.filter(p=>p.y<h+30);
    if(petals.length<22 && Math.random()<.16){
      petals.push({x:Math.random()*w,y:-15,size:4+Math.random()*5,vy:.45+Math.random()*.8,
        rot:Math.random()*6,vr:(Math.random()-.5)*.025,phase:Math.random()*6,
        alpha:.35+Math.random()*.5,color:Math.random()>.5?'#ff9fc5':'#ffd98a'});
    }
  }
  raf=requestAnimationFrame(draw);
}
window.addEventListener('resize',resize,{passive:true});
resize(); draw();

const musicButtons=[...document.querySelectorAll('.music-btn')];
const audios=musicButtons.map(btn=>document.getElementById(btn.dataset.audio));
const toast=document.getElementById('toast');
let toastTimer;
function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),3500)}
function resetButtons(){musicButtons.forEach(b=>{b.textContent='▶';b.setAttribute('aria-label',b.dataset.audio==='audio1'?'Play Tenu Sang Rakhna':'Play Tera Yaar Hoon Main')})}
musicButtons.forEach(btn=>{const audio=document.getElementById(btn.dataset.audio);btn.addEventListener('click',async()=>{audios.forEach(other=>{if(other!==audio){other.pause();other.currentTime=0}});resetButtons();if(audio.paused){try{await audio.play();btn.textContent='Ⅱ';btn.setAttribute('aria-label','Pause song')}catch(e){showToast('Audio file not found. Check the MP3 filename and folder.')}}else{audio.pause();btn.textContent='▶'}});audio.addEventListener('ended',()=>{btn.textContent='▶'})});
