import "./style.css";

// 动效偏好:用户开启"减少动态效果"时全面降级
const reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

// Lenis smooth scroll
let lenis;
try{
  const Lenis = window.Lenis;
  if(Lenis && !reduceMotion){
    lenis = new Lenis({ duration:1.1, easing:(t)=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel:true });
    function raf(time){ lenis.raf(time); requestAnimationFrame(raf) }
    requestAnimationFrame(raf);
    // connect to ScrollTrigger if available
    if(window.gsap && window.ScrollTrigger){
      lenis.on('scroll', window.ScrollTrigger.update);
      window.gsap.ticker.add((time)=>{ lenis.raf(time*1000) });
      window.gsap.ticker.lagSmoothing(0);
    }
  }
}catch(e){}

// GSAP
const gsap = window.gsap;
const ScrollTrigger = window.ScrollTrigger;
if(gsap && ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

// Cursor
const cursor = document.getElementById('cursor');
let mouseX=0, mouseY=0, curX=0, curY=0;
if(!reduceMotion){
  window.addEventListener('mousemove', e=>{ mouseX=e.clientX; mouseY=e.clientY; });
  function animateCursor(){
    curX += (mouseX - curX)*0.15;
    curY += (mouseY - curY)*0.15;
    if(cursor){ cursor.style.left=curX+'px'; cursor.style.top=curY+'px'; }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();
  document.querySelectorAll('a, button, .insta-item, .trans-card').forEach(el=>{
    el.addEventListener('mouseenter',()=>cursor?.classList.add('hover'));
    el.addEventListener('mouseleave',()=>cursor?.classList.remove('hover'));
  });
}

// Progress bar
const progressBar = document.getElementById('progressBar');
function updateProgress(){
  const h = document.documentElement;
  const scrolled = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight - h.clientHeight) || 1);
  if(progressBar) progressBar.style.width = `${scrolled*100}%`;
}
window.addEventListener('scroll', updateProgress, {passive:true});
updateProgress();

// PR playhead animation
const prPlayhead = document.getElementById('prPlayhead');
const prTime = document.getElementById('prTime');
const prPlayBtn = document.getElementById('prPlay');
let prPlaying = !reduceMotion;
let prStart = Date.now();
let prDuration = 47000;
function loopPR(){
  if(!prPlaying) return;
  const elapsed = (Date.now() - prStart) % prDuration;
  const pct = elapsed / prDuration;
  if(prPlayhead){
    // track width: from 12px left to right minus 12px
    const track = document.querySelector('.pr-track');
    if(track){
      const w = track.clientWidth - 24;
      prPlayhead.style.left = (12 + pct*w) + 'px';
    }
  }
  if(prTime){
    const s = Math.floor(elapsed/1000);
    const ss = String(s%60).padStart(2,'0');
    const mm = String(Math.floor(s/60)).padStart(2,'0');
    prTime.textContent = `${mm}:${ss} / 00:47`;
  }
  requestAnimationFrame(loopPR);
}
if(prPlaying) loopPR();
if(prPlayBtn){
  const setPRBtn = ()=>{
    prPlayBtn.textContent = prPlaying ? '❚❚' : '▶';
    prPlayBtn.setAttribute('aria-pressed', String(prPlaying));
    prPlayBtn.setAttribute('aria-label', prPlaying ? '暂停 PR 时间轴' : '播放 PR 时间轴');
  };
  setPRBtn();
  prPlayBtn.addEventListener('click',()=>{
    prPlaying = !prPlaying;
    if(prPlaying){
      // 按播放头当前位置恢复播放,而不是跳回 0
      const track = document.querySelector('.pr-track');
      const w = (track?.clientWidth || 0) - 24;
      const left = parseFloat(prPlayhead?.style.left || '12') || 12;
      const pct = w > 0 ? (left - 12) / w : 0;
      prStart = Date.now() - pct * prDuration;
      loopPR();
    }
    setPRBtn();
  });
}

// Scroll reveals with GSAP / fallback
if(gsap && ScrollTrigger && !reduceMotion){
  gsap.utils.toArray('.shot').forEach((shot, i)=>{
    const img = shot.querySelector('img');
    const text = shot.querySelector('.shot-text');
    gsap.from(img, {
      scale:1.15,
      scrollTrigger:{ trigger:shot, start:"top 85%", end:"top 40%", scrub:1 }
    });
    gsap.from(text, {
      y:40, opacity:0,
      scrollTrigger:{ trigger:shot, start:"top 80%", end:"top 50%", scrub:1 }
    });
    // parallax for shot-media
    gsap.to(shot.querySelector('.shot-media'), {
      yPercent: -4,
      scrollTrigger:{ trigger:shot, start:"top bottom", end:"bottom top", scrub:1 }
    });
  });

  gsap.utils.toArray('.trans-card').forEach((card,i)=>{
    gsap.from(card, {
      y:24, opacity:0, duration:0.7, delay: i*0.04,
      scrollTrigger:{ trigger:card, start:"top 92%" }
    });
  });

  gsap.utils.toArray('.insta-item').forEach((item,i)=>{
    gsap.from(item, {
      scale:0.92, opacity:0, duration:0.6, delay: (i%3)*0.05,
      scrollTrigger:{ trigger:item, start:"top 92%" }
    });
  });

  gsap.from('.concept-main h2', { y:30, opacity:0, duration:0.8, scrollTrigger:{ trigger:'.concept-main', start:"top 85%" } });
  gsap.from('.c-card', { y:20, opacity:0, stagger:0.08, duration:0.6, scrollTrigger:{ trigger:'.concept-cards', start:"top 85%" } });

  // hero parallax
  gsap.to('.hero-bg img', { yPercent: 12, ease:"none", scrollTrigger:{ trigger:'.hero', start:"top top", end:"bottom top", scrub:true } });
  gsap.to('.hero-content', { yPercent: -6, opacity:0.8, ease:"none", scrollTrigger:{ trigger:'.hero', start:"top top", end:"bottom 30%", scrub:true } });

  // film strip scrub
} else {
  // fallback intersection observer
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('in') })
  }, {threshold:0.15});
  document.querySelectorAll('.shot, .trans-card, .insta-item').forEach(el=>{ el.classList.add('reveal'); io.observe(el); });
}

// Transition lab — 8 种转场各自独立的 CSS 动画,时长与文案一致
const layer = document.getElementById('transitionLayer');
const transCards = document.querySelectorAll('.trans-card');
let transitioning = false;
const TRANS_NAMES = {
  dissolve:'DISSOLVE', push:'PUSH', zoom:'ZOOM', wipe:'WIPE', leak:'LIGHT LEAK', glitch:'GLITCH', spin:'SPIN', blinds:'BLINDS'
};
const TRANS_TOTAL = { dissolve:900, push:800, zoom:1000, wipe:650, leak:1200, glitch:500, spin:900, blinds:1150 };

function playTransition(type){
  if(transitioning || !layer) return;
  transitioning = true;
  const t = reduceMotion ? 'dissolve' : type; // 减少动态时退化为温和淡入淡出
  layer.className = 'transition-layer active ' + t;
  const tText = layer.querySelector('.t-text');
  if(tText) tText.textContent = TRANS_NAMES[type] || type.toUpperCase();
  setTimeout(()=>{
    layer.className = 'transition-layer';
    transitioning = false;
  }, reduceMotion ? 500 : (TRANS_TOTAL[type] || 900));
}

transCards.forEach(card=>{
  card.addEventListener('click',()=>{
    const t = card.getAttribute('data-trans');
    playTransition(t);
  });
});

// also hero CTA
document.getElementById('ctaPlay')?.addEventListener('click',()=>{
  // random transition then scroll to timeline
  const types = ['dissolve','push','wipe','leak','glitch','zoom','spin','blinds'];
  const t = types[Math.floor(Math.random()*types.length)];
  playTransition(t);
  setTimeout(()=>{
    const target = document.getElementById('timeline');
    if(lenis){ lenis.scrollTo(target, {offset:-64}); }
    else { target?.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth'}); }
  }, 700);
});

// 导航锚点:接入 Lenis 平滑滚动(避免原生 jump 与 Lenis 状态脱节)
document.querySelectorAll('.nav-links a, .cta a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const href = a.getAttribute('href');
    if(href && href.startsWith('#') && lenis){
      e.preventDefault();
      const el = document.querySelector(href);
      if(el) lenis.scrollTo(el, {offset:-64});
    }
  });
});
// Lightbox for insta(带焦点管理)
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxCap = document.getElementById('lightboxCap');
let lightboxFocus = null;
function openLightbox(src, cap){
  lightboxFocus = document.activeElement;
  lightboxImg.src = src;
  lightboxCap.textContent = cap;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
  lightbox.querySelector('.lightbox-close')?.focus();
}
function closeLightbox(){
  if(!lightbox || !lightbox.classList.contains('open')) return;
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
  lightboxFocus?.focus?.();
}
document.querySelectorAll('.insta-item img').forEach(img=>{
  const item = img.closest('.insta-item');
  if(item.classList.contains('insta-center')) return;
  item.addEventListener('click',()=>{
    const overlay = item.querySelector('.insta-overlay span');
    openLightbox(img.src.replace('w=600','w=1600'), overlay ? overlay.textContent : '');
  });
});
lightbox?.addEventListener('click', e=>{
  if(e.target===lightbox || e.target.classList.contains('lightbox-close') || e.target===lightboxImg){
    closeLightbox();
  }
});
document.addEventListener('keydown', e=>{
  if(e.key==='Escape') closeLightbox();
});

// Deploy visual url copy
document.querySelector('.visual-url .copy')?.addEventListener('click', async(e)=>{
  const url = 'https://xiaoqianran.github.io/web-011/';
  try{ await navigator.clipboard.writeText(url); }catch{}
  e.target.textContent='已复制';
  setTimeout(()=>e.target.textContent='复制', 1200);
});

// Film track pause on hover
const filmTrack = document.getElementById('filmTrack');
filmTrack?.addEventListener('mouseenter',()=>filmTrack.style.animationPlayState='paused');
filmTrack?.addEventListener('mouseleave',()=>filmTrack.style.animationPlayState='running');

// Small easter: Konami
let seq=[];
window.addEventListener('keydown', e=>{
  seq.push(e.key);
  if(seq.join(',').includes('ArrowUp,ArrowUp,ArrowDown,ArrowDown')){
    playTransition('glitch');
    seq=[];
  }
});

// handle base path for Vite: ensure images not broken but external okay
console.log('%c STORYBOARD %c 每一帧都是电影 — PR × AE × INS ','background:#f5f1e8;color:#0a0a0b;padding:6px 10px;border-radius:8px 0 0 8px;font-weight:700','background:#c9a96a;color:#0a0a0b;padding:6px 10px;border-radius:0 8px 8px 0');
