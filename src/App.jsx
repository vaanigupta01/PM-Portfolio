import { useState, useEffect, useRef } from "react";

// ─── IMAGE PATHS — upload originals to /public/images/ in your Cloudflare project ───
// RENAME MAP (your upload filename → clean name for /public/images/):
//  Vaani PM Portfolio.jpg                     → vaani.jpg
//  1781394291519_image.png                    → coll-dash-1.jpg
//  1781394378793_image.png                    → coll-dash-2.jpg
//  1781394792256_image.png                    → coll-dash-3.jpg
//  1781394848235_image.png                    → coll-dash-4.jpg
//  1781393798827_image.png                    → unit-eco-1.jpg
//  1781393866117_image.png                    → unit-eco-2.jpg
//  1781394106974_image.png                    → unit-eco-3.jpg
//  1780790877741_image.png                    → casa-first-screen.jpg
//  Screenshot_20260605_184140_Casa.jpg        → casa-onboard.jpg
//  Screenshot_20260605_184246_Casa.jpg        → casa-events.jpg
//  Screenshot_20260605_184459_Casa.jpg        → casa-ev-detail.jpg
//  Screenshot_20260605_184659_Casa.jpg        → casa-perks.jpg
//  Screenshot_20260605_184721_Casa.jpg        → casa-blog.jpg
//  1780791200578_image.png                    → casa-crm-1.jpg
//  1780791247351_image.png                    → casa-crm-2.jpg
//  1780791291146_image.png                    → casa-crm-3.jpg
//  1780791376251_image.png                    → casa-crm-4.jpg
//  Screenshot_20260604_175515_My_HooLiv.jpg   → parent-home.jpg
//  1780786151063_image.png                    → parent-home2.jpg
//  1780786629551_image.png                    → parent-pay.jpg
//  1780786941118_image.png                    → outpass-tenant.jpg
//  1780790705736_image.png                    → outpass-detail.jpg
//  1780791742803_Screenshot_*_HooLiv_Suite.jpg → lms-dash.jpg
//  1780791762566_Screenshot_*_HooLiv_Suite.jpg → lms-record.jpg
//  1780791778253_Screenshot_*_HooLiv_Suite.jpg → lms-history.jpg
//  1780791787338_Screenshot_*_HooLiv_Suite.jpg → lms-manage.jpg
//  1781364079979_image.png                    → b2b-crm-1.jpg
//  1781364178567_image.png                    → b2b-crm-2.jpg
//  1781384586596_Landing_Page_*.png           → readers-hub.jpg
//  1781385368702_*.jpg                        → upgrad-card.jpg
//  1781385374816_image.png                    → vas-services.jpg
//  1781385473321_Screenshot_*.jpg             → acadza.jpg
//  SmartPrep_Carousel__1_.png                 → smartprep.jpg
//  1777974605769_image.png                    → comp-grid-hooliv.jpg
//  1781871938338_image.png                    → comp-grid-wedding.jpg
//  1781871743724_image.png                    → room-alloc.jpg
// ─── NOTION EMBEDS — ACTION NEEDED FOR LIVE PREVIEWS ──────────────────────────
// Raw notion.site URLs CANNOT be iframed directly (Notion sets X-Frame-Options
// that silently blocks embedding — no error fires, you'd just see a blank box).
// To make each PRD/case-study preview actually render inline, generate a wrapper
// URL using ONE of these (both free):
//   A) Notion's own official embed (recommended, no third party):
//      Open the page in Notion → Share → Publish → "Embed this page" → Copy code
//      → grab the `src="..."` value from the iframe snippet they give you.
//   B) NotionHero (notionhero.io/guides/embeds):
//      Paste your public notion.site URL → it returns a src like
//      https://e.notionhero.io/e1/p/{id} → use that.
// Then pass it as the `embedUrl` prop on the matching <NotionEmbed> call below
// (search for "NotionEmbed" — there are 6 calls, one per PRD/case study).
// Until you do this, each one renders a clean fallback card that links out —
// fully functional, just not an inline live preview.
const SS = {
  vaani:"/images/vaani.jpg", collDash1:"/images/coll-dash-1.jpg", collDash2:"/images/coll-dash-2.jpg",
  collDash3:"/images/coll-dash-3.jpg", collDash4:"/images/coll-dash-4.jpg",
  unitEco1:"/images/unit-eco-1.jpg", unitEco2:"/images/unit-eco-2.jpg", unitEco3:"/images/unit-eco-3.jpg",
  casaFirstScreen:"/images/casa-first-screen.jpg", casaOnboard:"/images/casa-onboard.jpg",
  casaEvents:"/images/casa-events.jpg", casaEvDetail:"/images/casa-ev-detail.jpg",
  casaPerks:"/images/casa-perks.jpg", casaBlog:"/images/casa-blog.jpg",
  casaCrm1:"/images/casa-crm-1.jpg", casaCrm2:"/images/casa-crm-2.jpg",
  casaCrm3:"/images/casa-crm-3.jpg", casaCrm4:"/images/casa-crm-4.jpg",
  parentHome:"/images/parent-home.jpg", parentHome2:"/images/parent-home2.jpg",
  parentPay:"/images/parent-pay.jpg", outpassTenant:"/images/outpass-tenant.jpg",
  outpassDetail:"/images/outpass-detail.jpg",
  lmsDash:"/images/lms-dash.jpg", lmsRecord:"/images/lms-record.jpg",
  lmsHistory:"/images/lms-history.jpg", lmsManage:"/images/lms-manage.jpg",
  b2b1:"/images/b2b-crm-1.jpg", b2b2:"/images/b2b-crm-2.jpg",
  readersHub:"/images/readers-hub.jpg", upgradCard:"/images/upgrad-card.jpg",
  vasServices:"/images/vas-services.jpg", acadza:"/images/acadza.jpg",
  smartprep:"/images/smartprep.jpg",
  compGridHooliv:"/images/comp-grid-hooliv.jpg", compGridWedding:"/images/comp-grid-wedding.jpg",
  roomAlloc:"/images/room-alloc.jpg",
};

// ─── LOGOS ────────────────────────────────────────────────────────────────────
function LogoSVG({tool,size=22}){
  const s=size*.62;
  const w=(svg,bg="#FFF")=><div title={tool} style={{width:size,height:size,borderRadius:size*.26,background:bg,border:"1px solid var(--rule)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,overflow:"hidden"}}>{svg}</div>;
  switch(tool){
    case"ChatGPT":return w(<svg width={s} height={s} viewBox="0 0 24 24" fill="#10A37F"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-4 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.795.795 0 0 0-.785 0L9.409 9.23V6.897a.068.068 0 0 1 .028-.061l4.83-2.787a4.494 4.494 0 0 1 6.68 4.65zm-12.64 4.16l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.494 4.494 0 0 1 7.375-3.453l-.142.08-4.778 2.758a.795.795 0 0 0-.393.681zm1.097-2.365l2.595-1.498 2.6 1.498v2.997l-2.6 1.498-2.595-1.498z"/></svg>);
    case"Claude":return w(<svg width={s} height={s} viewBox="0 0 24 24" fill="#D97757"><path d="M17.304 3.541h-3.672l6.696 16.918H24Zm-10.608 0L0 20.459h3.744l1.37-3.553h7.005l1.369 3.553h3.744L10.536 3.541ZM6.282 13.973l2.298-6.024 2.297 6.024Z"/></svg>);
    case"v0":return w(<svg width={s} height={s} viewBox="0 0 24 24" fill="#000"><path d="M14.066 19.846 21.954 4.04h-3.43l-5.494 11.323L7.605 4.04H3.97l7.93 15.806h2.166ZM0 4.04h3.5l5.184 10.4L0 4.04Z"/></svg>);
    case"Bolt":return w(<svg width={s} height={s} viewBox="0 0 24 24" fill="#7C3AED"><path d="M13 2 3 14h7l-1 8 10-12h-7z"/></svg>);
    case"Replit":return w(<svg width={s} height={s} viewBox="0 0 24 24" fill="#F26207"><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14.5a3.5 3.5 0 1 0 7 0 3.5 3.5 0 0 0-7 0z"/></svg>);
    case"Figma":return w(<svg width={s} height={s} viewBox="0 0 38 57"><path fill="#1ABCFE" d="M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0Z"/><path fill="#0ACF83" d="M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0Z"/><path fill="#FF7262" d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19Z"/><path fill="#F24E1E" d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5Z"/><path fill="#A259FF" d="M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5Z"/></svg>);
    case"Notion":return w(<svg width={s} height={s} viewBox="0 0 24 24" fill="#000"><path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466l1.823 1.447ZM5.34 7.038v13.802c0 .747.373 1.027 1.214.98l14.523-.84c.841-.047.935-.56.935-1.167V6.151c0-.606-.234-.933-.748-.886l-15.177.886c-.56.047-.747.327-.747.887ZM18.857 7.75c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.58-7.19v6.957l1.448.327s0 .84-1.168.84l-3.219.187c-.093-.187 0-.653.327-.747l.84-.233V9.83L7.41 9.689c-.094-.42.14-1.026.793-1.073l3.453-.233 4.766 7.283v-6.443l-1.215-.14c-.093-.514.28-.887.747-.933Z"/></svg>);
    case"Genspark":return w(<svg width={s} height={s} viewBox="0 0 24 24" fill="#3B5BFE"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8" stroke="#fff" strokeWidth="2"/></svg>);
    case"GoogleSheets":return w(<svg width={s} height={s} viewBox="0 0 24 24"><path fill="#0F9D58" d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z"/><path fill="#A0D8B9" d="M14.5 2 20 7.5h-4.5a1 1 0 0 1-1-1V2Z"/><path fill="#fff" d="M8 12h8v1.5H8zm0 3h8v1.5H8zm0-6h8v1.5H8z"/></svg>);
    case"GoogleSlides":return w(<svg width={s} height={s} viewBox="0 0 24 24"><path fill="#F4B400" d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2Z"/><path fill="#FCE8B2" d="M14.5 2 20 7.5h-4.5a1 1 0 0 1-1-1V2Z"/><rect x="7.5" y="10" width="9" height="6" fill="#fff"/></svg>);
    case"GoogleDrive":return w(<svg width={s} height={s} viewBox="0 0 87.3 78"><path fill="#0066DA" d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0a7.9 7.9 0 0 0 1.05 4z"/><path fill="#00AC47" d="M43.65 25 29.9 1.2a8.16 8.16 0 0 0-3.3 3.3L1.05 48.05A7.9 7.9 0 0 0 0 52h27.5z"/><path fill="#EA4335" d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25a7.9 7.9 0 0 0 1.05-4H59.65l5.5 9.5z"/><path fill="#00832D" d="M43.65 25 57.4 1.2C56.05.43 54.5 0 52.9 0H34.4c-1.6 0-3.15.43-4.5 1.2z"/><path fill="#2684FC" d="M59.65 52H27.5L13.75 75.8c1.35.77 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.43 4.5-1.2z"/><path fill="#FFBA00" d="m73.4 26-13.75-23.8a8.16 8.16 0 0 0-3.3-3.3L43.65 25 59.8 52h27.45a7.9 7.9 0 0 0-1.05-4z"/></svg>);
    case"LinkedIn":return w(<svg width={s} height={s} viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>);
    default:return w(<span style={{fontSize:size*.45,fontWeight:700,color:"#888"}}>{tool?.[0]||"?"}</span>);
  }
}
function LogoRow({tools,size=22,gap=7,style={}}){return <div style={{display:"flex",flexWrap:"wrap",gap,alignItems:"center",...style}}>{tools.map(t=><LogoSVG key={t} tool={t} size={size}/>)}</div>;}

// ─── TAGS ─────────────────────────────────────────────────────────────────────
const TC={plum:{bg:"rgba(155,45,94,.09)",fg:"#9B2D5E",bd:"rgba(155,45,94,.28)"},forest:{bg:"rgba(42,92,74,.09)",fg:"#2A5C4A",bd:"rgba(42,92,74,.26)"},coral:{bg:"rgba(216,93,58,.10)",fg:"#C45A32",bd:"rgba(216,93,58,.28)"}};
const TM={"Analytics & Intelligence":"plum","Strategic Discovery":"plum","Discovery-Led":"plum","Consumer App":"forest","CRM":"forest","External Client":"forest","Retention & Trust":"forest","Engagement & VAS":"forest","Operations & Internal Tools":"coral","Operations":"coral","0→1":"coral","Personal Product Work":"coral","Research Stage":"coral"};
function Tag({label}){const c=TC[TM[label]||"coral"];return <span style={{display:"inline-block",fontFamily:"var(--label)",fontSize:10.5,letterSpacing:".8px",textTransform:"uppercase",fontWeight:600,padding:"4px 11px",borderRadius:20,marginRight:6,marginBottom:6,background:c.bg,color:c.fg,border:`1px solid ${c.bd}`}}>{label}</span>;}

// ─── HOOKS ────────────────────────────────────────────────────────────────────
function useParallax(){
  const[y,setY]=useState(0);
  useEffect(()=>{
    let r=null;
    const fn=()=>{if(r)return;r=requestAnimationFrame(()=>{setY(window.scrollY);r=null;});};
    window.addEventListener("scroll",fn,{passive:true});
    return()=>{window.removeEventListener("scroll",fn);if(r)cancelAnimationFrame(r);};
  },[]);
  return y;
}
function ParallaxLayer({speed=0.1,children,style={}}){
  const y=useParallax();
  return <div style={{transform:`translate3d(0,${y*speed}px,0)`,willChange:"transform",...style}}>{children}</div>;
}
function useInView(t=0.12){
  const ref=useRef(null);
  useEffect(()=>{
    const el=ref.current;if(!el)return;
    const obs=new IntersectionObserver(([e])=>{if(e.isIntersecting){el.classList.add("vis");obs.unobserve(el);}},{threshold:t});
    obs.observe(el);return()=>obs.disconnect();
  },[]);
  return ref;
}
function useToast(){const[m,setM]=useState(null);const show=x=>{setM(x);setTimeout(()=>setM(null),2200);};return[m,show];}
function copyEmail(show){navigator.clipboard.writeText("vaanigupta01@gmail.com").then(()=>show("Copied to clipboard ✓")).catch(()=>show("vaanigupta01@gmail.com"));}

function AutoCarousel({images,interval=2600}){
  const[i,setI]=useState(0);
  useEffect(()=>{if(images.length<=1)return;const t=setInterval(()=>setI(x=>(x+1)%images.length),interval);return()=>clearInterval(t);},[images.length,interval]);
  if(!images.length)return null;
  return(
    <div style={{position:"relative",width:"100%",height:"100%",overflow:"hidden"}}>
      {images.map((src,x)=><img key={x} src={src} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",objectPosition:"top",opacity:x===i?1:0,transition:"opacity .7s ease"}}/>)}
      {images.length>1&&<div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",display:"flex",gap:4,zIndex:2}}>{images.map((_,x)=><div key={x} style={{width:x===i?14:5,height:5,borderRadius:3,background:x===i?"white":"rgba(255,255,255,.45)",transition:"width .3s"}}/>)}</div>}
    </div>
  );
}
function Arrow(){return <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M13 6l6 6-6 6"/></svg>;}

// ─── CSS ──────────────────────────────────────────────────────────────────────
const GlobalCSS=()=><style>{`
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Inter:wght@300;400;500;600&family=Space+Grotesk:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{--iv:#FAF7F1;--cream:#F1ECE2;--paper:#FFF;--ink:#221D19;--ink-mid:#52483F;--ink-mu:#8C8073;--rule:#E5DDD0;--plum:#9B2D5E;--plum-d:rgba(155,45,94,.08);--plum-b:rgba(155,45,94,.25);--forest:#2A5C4A;--coral:#C45A32;--gold:#8C6A1E;--h:'Fraunces',Georgia,serif;--l:'Space Grotesk',sans-serif;--b:'Inter',sans-serif;}
html{scroll-behavior:smooth;}body{font-family:var(--b);background:var(--iv);color:var(--ink);line-height:1.65;overflow-x:hidden;}
::-webkit-scrollbar{width:3px;}::-webkit-scrollbar-track{background:var(--cream);}::-webkit-scrollbar-thumb{background:var(--plum);border-radius:2px;}
@keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
@keyframes bF1{0%,100%{transform:translate(0,0)scale(1)}33%{transform:translate(36px,-26px)scale(1.06)}66%{transform:translate(-18px,14px)scale(.95)}}
@keyframes bF2{0%,100%{transform:translate(0,0)}33%{transform:translate(-26px,20px)scale(.96)}66%{transform:translate(20px,-12px)scale(1.04)}}
@keyframes gF{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
@keyframes sUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
@keyframes tIn{from{opacity:0;transform:translate(-50%,12px)}to{opacity:1;transform:translate(-50%,0)}}
@keyframes aN{0%,100%{transform:translateX(0)}50%{transform:translateX(4px)}}
@keyframes fIn{from{opacity:0}to{opacity:1}}
.iv{opacity:0;transform:translateY(18px);transition:opacity .55s ease,transform .55s ease;}.iv.vis{opacity:1;transform:translateY(0);}
nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 56px;display:flex;justify-content:space-between;align-items:center;background:rgba(250,247,241,.78);backdrop-filter:blur(18px);border-bottom:1px solid var(--rule);transition:all .3s;}
nav.sc{background:rgba(250,247,241,.95);padding:12px 56px;}
.nl{font-family:var(--h);font-size:21px;font-weight:600;color:var(--ink);}.nl span{color:var(--plum);font-style:italic;}
.nlinks{display:flex;gap:30px;align-items:center;}
.na{font-family:var(--l);font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:500;color:var(--ink-mu);text-decoration:none;cursor:pointer;transition:color .2s;}.na:hover{color:var(--plum);}
.nc{background:var(--ink);color:var(--iv);padding:9px 20px;border-radius:30px;font-family:var(--l);font-size:12px;letter-spacing:.5px;text-transform:uppercase;font-weight:500;cursor:pointer;border:none;text-decoration:none;transition:all .2s;}.nc:hover{background:var(--plum);}
.toast{position:fixed;bottom:36px;left:50%;background:var(--ink);color:var(--iv);padding:12px 22px;border-radius:30px;font-size:13px;font-weight:500;z-index:300;animation:tIn .25s ease;box-shadow:0 12px 32px rgba(0,0,0,.2);}
.hero{min-height:94vh;display:grid;grid-template-columns:1.05fr .95fr;align-items:center;padding:108px 64px 56px;gap:64px;position:relative;overflow:hidden;}
.blob{position:absolute;border-radius:50%;filter:blur(64px);pointer-events:none;}
.blob1{width:460px;height:460px;background:radial-gradient(circle,rgba(155,45,94,.22)0%,transparent 70%);top:-120px;right:-60px;animation:bF1 16s ease-in-out infinite;}
.blob2{width:380px;height:380px;background:radial-gradient(circle,rgba(42,92,74,.18)0%,transparent 70%);bottom:-100px;left:30px;animation:bF2 20s ease-in-out infinite;}
.blob3{width:260px;height:260px;background:radial-gradient(circle,rgba(196,90,50,.16)0%,transparent 70%);top:40%;left:42%;animation:bF1 24s ease-in-out infinite;animation-delay:-9s;}
.hey{font-family:var(--l);font-size:11.5px;letter-spacing:2.5px;text-transform:uppercase;color:var(--plum);margin-bottom:14px;display:flex;align-items:center;gap:9px;font-weight:600;}.hey::before{content:'';display:block;width:24px;height:1.5px;background:var(--plum);}
.hh{font-family:var(--h);font-size:clamp(34px,4vw,54px);font-weight:600;line-height:1.08;color:var(--ink);margin-bottom:18px;letter-spacing:-1px;}.hh em{font-style:italic;color:var(--plum);font-weight:500;}
.hs{font-size:15px;line-height:1.8;color:var(--ink-mid);margin-bottom:28px;font-weight:300;max-width:480px;}
.hm{display:grid;grid-template-columns:repeat(2,1fr);gap:11px;}
.hmt{background:var(--paper);border:1px solid var(--rule);border-radius:14px;padding:16px 18px;transition:border-color .2s,transform .2s;}.hmt:hover{border-color:var(--plum-b);transform:translateY(-2px);}
.hmn{font-family:var(--h);font-size:30px;font-weight:600;color:var(--plum);line-height:1;margin-bottom:3px;}.hml{font-size:11px;color:var(--ink-mu);font-family:var(--l);letter-spacing:.3px;}
.ph{position:relative;}.ph-fr{position:relative;width:100%;max-width:400px;margin:0 auto;}
.ph-bl{position:absolute;inset:-18px;background:linear-gradient(135deg,rgba(155,45,94,.1),rgba(42,92,74,.07));border-radius:60% 40% 53% 47%/54% 47% 53% 46%;animation:gF 7s ease-in-out infinite;}
.ph-in{position:relative;z-index:1;border-radius:18px;overflow:hidden;aspect-ratio:3/4;box-shadow:0 26px 52px rgba(34,29,25,.16);border:1px solid var(--rule);}
.ph-in img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block;}
.ph-q{position:absolute;bottom:-18px;left:-28px;z-index:2;background:var(--ink);border:1px solid rgba(255,255,255,.08);padding:16px 20px;border-radius:14px;max-width:248px;box-shadow:0 18px 40px rgba(34,29,25,.25);animation:gF 9s ease-in-out infinite;animation-delay:-4s;}
.ph-q p{font-family:var(--h);font-size:13px;font-style:italic;line-height:1.6;color:rgba(250,247,241,.92);font-weight:400;}
.ph-q span{display:block;margin-top:7px;font-size:10px;color:var(--coral);font-family:var(--l);letter-spacing:1.2px;text-transform:uppercase;}
.li-b{position:absolute;top:-14px;right:-14px;z-index:2;width:42px;height:42px;background:#FFF;border-radius:10px;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 22px rgba(34,29,25,.18);text-decoration:none;border:1px solid var(--rule);transition:transform .2s;}.li-b:hover{transform:scale(1.08);}.li-b svg{width:20px;height:20px;fill:#0077B5;}
.ov{font-family:var(--l);font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--plum);margin-bottom:10px;display:flex;align-items:center;gap:9px;font-weight:600;}.ov::after{content:'';width:34px;height:1.5px;background:var(--plum);}
.st{font-family:var(--h);font-size:clamp(28px,3.1vw,42px);font-weight:600;color:var(--ink);line-height:1.1;letter-spacing:-.6px;margin-bottom:36px;}.st em{font-style:italic;color:var(--plum);font-weight:500;}
.csg{display:grid;grid-template-columns:repeat(2,1fr);gap:20px;}
.hgc{position:relative;border-radius:22px;overflow:hidden;cursor:pointer;aspect-ratio:4/5;transition:transform .4s cubic-bezier(.2,.8,.2,1),box-shadow .4s ease;background:#1a1410;}.hgc.feat{grid-column:1/-1;aspect-ratio:21/9;}.hgc:hover{transform:translateY(-6px);box-shadow:0 36px 70px rgba(20,15,12,.32);}
.hgbg{position:absolute;inset:0;z-index:0;overflow:hidden;}.hgbg img{width:100%;height:100%;object-fit:cover;object-position:top;transition:transform .7s cubic-bezier(.2,.8,.2,1);}.hgc:hover .hgbg img{transform:scale(1.08);}
.hgsc{position:absolute;inset:0;z-index:1;pointer-events:none;background:linear-gradient(to top,var(--sc,.9)0%,var(--sm,.55)38%,rgba(20,15,12,.08)64%,transparent 78%);transition:background .45s ease;}
.hgc:hover .hgsc{background:linear-gradient(to top,var(--sch,.97)0%,var(--smh,.82)52%,rgba(20,15,12,.32)76%,rgba(20,15,12,.05)100%);}
.hgpl{position:absolute;top:16px;left:16px;z-index:3;background:rgba(255,255,255,.14);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.22);color:white;padding:6px 14px;border-radius:30px;font-family:var(--l);font-size:11px;font-weight:500;}.hgpl strong{color:#FFD98E;font-weight:700;}
.hgpv{position:absolute;top:16px;right:16px;z-index:3;width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;box-shadow:0 4px 14px rgba(0,0,0,.2);}
.hghi{position:absolute;bottom:18px;right:20px;z-index:3;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.15);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;transition:opacity .3s;}.hgc:hover .hghi{opacity:0;}
.hgcon{position:absolute;left:0;right:0;bottom:0;z-index:2;padding:22px 24px;}
.hgtags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:10px;}
.hgtag{font-family:var(--l);font-size:9.5px;letter-spacing:.8px;text-transform:uppercase;font-weight:600;padding:4px 10px;border-radius:20px;background:rgba(255,255,255,.16);backdrop-filter:blur(8px);color:rgba(255,255,255,.92);border:1px solid rgba(255,255,255,.2);}
.hgti{font-family:var(--h);font-size:26px;font-weight:600;color:white;line-height:1.12;letter-spacing:-.4px;text-shadow:0 2px 16px rgba(0,0,0,.3);}.feat .hgti{font-size:30px;}
.hgrv{max-height:0;opacity:0;overflow:hidden;transition:max-height .45s cubic-bezier(.2,.8,.2,1),opacity .3s ease,margin-top .45s ease;margin-top:0;}.hgc:hover .hgrv{max-height:260px;opacity:1;margin-top:12px;}
.hgde{font-size:12.5px;color:rgba(255,255,255,.82);line-height:1.65;font-weight:300;margin-bottom:12px;}.feat .hgde{font-size:13.5px;max-width:640px;}
.hgch{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px;}
.hgcp{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.85);padding:5px 11px;border-radius:16px;font-size:10.5px;font-family:var(--l);}
.hgft{display:flex;justify-content:space-between;align-items:center;gap:12px;}
.hgct{display:inline-flex;align-items:center;gap:7px;background:white;color:var(--ink);padding:10px 18px;border-radius:30px;font-family:var(--l);font-size:12px;font-weight:600;}.hgct svg{transition:transform .25s;}.hgc:hover .hgct svg{animation:aN .8s ease-in-out infinite;}
.hgtl{display:flex;gap:5px;}.hgto{width:22px;height:22px;border-radius:6px;background:white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.15);}
.mg{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;}
.ag{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.mo{position:fixed;inset:0;z-index:200;background:rgba(34,29,25,.6);backdrop-filter:blur(8px);display:flex;align-items:flex-start;justify-content:center;padding:28px 18px;overflow-y:auto;animation:fIn .2s ease;}
.modal{background:var(--iv);border-radius:22px;width:100%;max-width:840px;position:relative;overflow:hidden;animation:sUp .28s ease;margin:auto;box-shadow:0 40px 90px rgba(0,0,0,.3);}
.mohe{height:230px;overflow:hidden;display:flex;align-items:center;justify-content:center;gap:9px;padding:18px;background:var(--cream);}
.moc{position:fixed;top:40px;right:calc(50% - 452px);width:36px;height:36px;background:var(--paper);border:1px solid var(--rule);border-radius:50%;color:var(--ink);font-size:17px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s;z-index:201;}.moc:hover{background:var(--plum);color:white;border-color:var(--plum);}
.mob{padding:36px 48px 48px;}
.moov{font-family:var(--l);font-size:10.5px;letter-spacing:2px;text-transform:uppercase;color:var(--plum);margin-bottom:8px;font-weight:600;}
.moti{font-family:var(--h);font-size:32px;font-weight:600;color:var(--ink);line-height:1.1;margin-bottom:5px;letter-spacing:-.4px;}
.mosu{font-size:13.5px;color:var(--ink-mu);margin-bottom:24px;padding-bottom:24px;border-bottom:1px solid var(--rule);}
.mose{margin-bottom:28px;}
.mosh{font-family:var(--h);font-size:18px;font-weight:600;color:var(--ink);margin-bottom:11px;display:flex;align-items:center;gap:9px;}.mosh::before{content:'';display:block;width:3px;height:16px;background:var(--plum);border-radius:2px;flex-shrink:0;}
.mot{font-size:14px;color:var(--ink-mid);line-height:1.8;font-weight:300;}.mot p{margin-bottom:12px;}.mot p:last-child{margin-bottom:0;}.mot strong{color:var(--ink);font-weight:600;}.mot em{color:var(--plum);font-style:italic;}
.moli{list-style:none;padding:0;margin:0;}.moli li{font-size:13.5px;color:var(--ink-mid);line-height:1.7;margin-bottom:7px;padding-left:16px;position:relative;font-weight:300;}.moli li::before{content:'';position:absolute;left:0;top:8px;width:5px;height:5px;background:var(--plum);border-radius:50%;}.moli li strong{color:var(--ink);font-weight:600;}
.imp{background:linear-gradient(135deg,rgba(42,92,74,.06),rgba(155,45,94,.04));border:1px solid rgba(42,92,74,.16);border-radius:13px;padding:18px 22px;}.imp p{font-size:14px;color:var(--ink-mid);line-height:1.8;}.imp strong{color:var(--forest);font-weight:600;}
.qual{background:rgba(184,134,46,.06);border:1px solid rgba(184,134,46,.18);border-radius:13px;padding:18px 22px;}.qual p{font-size:13.5px;color:var(--ink-mid);line-height:1.8;font-weight:300;}
.sol{background:rgba(155,45,94,.05);border:1px solid rgba(155,45,94,.16);border-radius:13px;padding:15px 19px;margin-top:6px;}.sol p{font-size:13.5px;color:var(--ink-mid);line-height:1.75;font-weight:300;}
.moss{display:grid;gap:8px;margin-top:10px;}.moss.t2{grid-template-columns:1fr 1fr;}.moss.t3{grid-template-columns:repeat(3,1fr);}
.ssw{border-radius:9px;overflow:hidden;border:1px solid var(--rule);}.ssw img{display:block;width:100%;height:auto;}
.molk{display:flex;flex-wrap:wrap;gap:7px;margin-top:12px;}
.moln{display:inline-flex;align-items:center;gap:6px;padding:6px 14px 6px 6px;border-radius:28px;border:1px solid var(--rule);background:var(--paper);font-size:12px;font-family:var(--l);color:var(--ink-mu);text-decoration:none;transition:all .2s;cursor:pointer;}.moln:hover{border-color:var(--plum-b);color:var(--plum);}
.htbl{width:100%;border-collapse:collapse;font-size:12.5px;}.htbl th{background:var(--cream);color:var(--ink-mu);font-family:var(--l);font-size:9.5px;letter-spacing:1px;text-align:left;padding:7px 11px;border-bottom:1px solid var(--rule);text-transform:uppercase;}.htbl td{padding:8px 11px;color:var(--ink-mid);border-bottom:1px solid var(--rule);line-height:1.5;}
.hb{display:inline-block;padding:2px 8px;border-radius:9px;font-size:9.5px;font-family:var(--l);}.hb.hi{background:rgba(42,92,74,.12);color:var(--forest);}.hb.me{background:rgba(184,134,46,.1);color:var(--gold);}.hb.lo{background:var(--cream);color:var(--ink-mu);}
.ms{font-size:10.5px;font-family:var(--l);color:var(--ink-mu);letter-spacing:.5px;margin-bottom:3px;text-transform:uppercase;font-weight:600;}
.emw{position:relative;border-radius:12px;overflow:hidden;border:1px solid var(--rule);background:var(--cream);}.emf{width:100%;border:none;display:block;}
.eml{position:absolute;top:10px;left:10px;z-index:2;background:rgba(34,29,25,.8);backdrop-filter:blur(6px);color:white;font-size:10px;font-family:var(--l);padding:4px 10px;border-radius:14px;display:flex;align-items:center;gap:6px;}
.emo{position:absolute;top:10px;right:10px;z-index:2;background:var(--paper);border:1px solid var(--rule);color:var(--ink-mu);font-size:10.5px;font-family:var(--l);padding:5px 12px;border-radius:14px;text-decoration:none;display:flex;align-items:center;gap:5px;transition:all .2s;}.emo:hover{border-color:var(--plum-b);color:var(--plum);}
.abg{display:grid;grid-template-columns:1fr 1fr;gap:64px;align-items:center;}
.abph{border-radius:18px;overflow:hidden;border:1px solid var(--rule);aspect-ratio:3/4;box-shadow:0 22px 48px rgba(34,29,25,.13);}.abph img{width:100%;height:100%;object-fit:cover;object-position:center top;display:block;}
.abq{position:absolute;bottom:-16px;right:-20px;background:var(--plum);padding:16px 20px;border-radius:13px;max-width:225px;box-shadow:0 14px 32px rgba(155,45,94,.25);}.abq p{font-size:12.5px;font-style:italic;line-height:1.6;color:rgba(255,255,255,.95);font-family:var(--h);}
.abtg{display:flex;flex-wrap:wrap;gap:7px;margin-top:18px;}
.abt{font-size:11.5px;font-family:var(--l);padding:5px 13px;border-radius:20px;background:var(--paper);border:1px solid var(--rule);color:var(--ink-mu);text-transform:uppercase;letter-spacing:.3px;}.abt.ft{background:var(--plum);color:white;border-color:var(--plum);font-weight:600;}
.abs{font-size:14.5px;color:var(--ink);font-weight:500;background:var(--paper);border-left:3px solid var(--plum);padding:14px 18px;border-radius:0 10px 10px 0;margin-bottom:14px;}
.kc{background:var(--paper);border:1px solid var(--rule);border-radius:18px;overflow:hidden;margin-top:18px;}
.kch{padding:24px 32px 18px;border-bottom:1px solid var(--rule);}
.kct{font-family:var(--h);font-size:19px;font-weight:600;color:var(--ink);margin-bottom:2px;letter-spacing:-.2px;}.kcs{font-size:11.5px;color:var(--ink-mu);font-family:var(--l);text-transform:uppercase;letter-spacing:.4px;}
.kcb{display:grid;grid-template-columns:1fr 1fr 1fr;}
.ks{padding:20px 24px;border-right:1px solid var(--rule);}.ks:last-child{border-right:none;background:var(--plum-d);}
.ksl{font-family:var(--l);font-size:10px;letter-spacing:1.5px;text-transform:uppercase;color:var(--ink-mu);margin-bottom:9px;font-weight:600;}.ks:last-child .ksl{color:var(--plum);}
.kst{font-size:12.5px;color:var(--ink-mid);line-height:1.68;font-weight:300;}
.kli{list-style:none;padding:0;}.kli li{font-size:12px;color:var(--ink-mid);padding-left:13px;margin-bottom:4px;position:relative;line-height:1.5;font-weight:300;}.kli li::before{content:'·';position:absolute;left:0;color:var(--plum);font-size:15px;top:-2px;}
.wc{background:var(--paper);border:1px solid var(--rule);border-radius:18px;overflow:hidden;margin-top:18px;}
.wch{background:linear-gradient(135deg,rgba(155,45,94,.06),rgba(196,90,50,.04));padding:24px 32px 18px;border-bottom:1px solid var(--rule);display:flex;justify-content:space-between;align-items:flex-start;gap:20px;}
.wct{font-family:var(--h);font-size:19px;font-weight:600;color:var(--ink);letter-spacing:-.2px;margin-bottom:3px;}
.wcb{padding:20px 32px 28px;}.wca{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-top:14px;}
.wa{background:var(--cream);border:1px solid var(--rule);border-radius:11px;overflow:hidden;}
.wai{height:130px;overflow:hidden;}.wai img,.wai iframe{width:100%;height:100%;object-fit:cover;object-position:top;display:block;border:none;}
.wab{padding:10px 12px;}.wat{font-family:var(--h);font-size:12.5px;font-weight:600;color:var(--ink);margin-bottom:3px;}.wad{font-size:11px;color:var(--ink-mu);line-height:1.55;font-weight:300;}.wal{font-size:11px;color:var(--plum);font-family:var(--l);text-decoration:none;display:flex;align-items:center;gap:4px;margin-top:5px;}
.iw{background:var(--paper);border:1px solid var(--rule);border-radius:18px;overflow:hidden;}
.iwhd{padding:32px 40px 24px;display:flex;justify-content:space-between;align-items:flex-start;gap:32px;}
.iwti{font-family:var(--h);font-size:24px;font-weight:600;color:var(--ink);line-height:1.2;letter-spacing:-.3px;margin-bottom:10px;}.iwti em{font-style:italic;color:var(--forest);font-weight:500;}
.iwde{font-size:13.5px;color:var(--ink-mid);line-height:1.75;font-weight:300;max-width:460px;}
.iwst{display:flex;gap:22px;flex-wrap:wrap;margin-top:14px;}
.iwsn{font-family:var(--h);font-size:19px;font-weight:600;color:var(--forest);}.iwsl{font-size:10px;color:var(--ink-mu);font-family:var(--l);text-transform:uppercase;letter-spacing:.3px;}
.iweb{font-family:var(--l);font-size:11px;color:var(--plum);cursor:pointer;display:flex;align-items:center;gap:5px;margin-top:12px;border:none;background:none;text-transform:uppercase;letter-spacing:.4px;font-weight:600;}
.iwex{padding:0 40px 32px;border-top:1px solid var(--rule);}
.iwli{list-style:none;padding:0;margin:0 0 14px;}.iwli li{font-size:13px;color:var(--ink-mid);padding-left:15px;margin-bottom:7px;position:relative;line-height:1.65;font-weight:300;}.iwli li::before{content:'→';position:absolute;left:0;color:var(--forest);font-size:11px;top:1px;}
.stb{background:rgba(184,134,46,.05);border:1px solid rgba(184,134,46,.16);border-radius:11px;padding:15px 19px;}.stbl{font-family:var(--l);font-size:10px;letter-spacing:1.5px;color:var(--gold);margin-bottom:6px;text-transform:uppercase;font-weight:600;}
footer{background:var(--ink);color:var(--iv);padding:40px 64px;display:flex;justify-content:space-between;align-items:center;}
.ftn{font-family:var(--h);font-size:24px;font-weight:600;color:white;margin-bottom:3px;}.fts{font-size:13px;color:rgba(250,247,241,.55);font-weight:300;}
.ftl{display:flex;gap:16px;align-items:center;}.fta{font-size:12.5px;color:rgba(250,247,241,.7);text-decoration:none;transition:color .2s;display:flex;align-items:center;gap:6px;cursor:pointer;}.fta:hover{color:var(--coral);}
@media(max-width:1024px){
  .hero,.abg{grid-template-columns:1fr;padding:92px 32px 48px;gap:36px;}
  nav{padding:14px 28px;}.csg,.ag{grid-template-columns:1fr;}.feat{grid-column:1;aspect-ratio:4/5;}
  .mg,.wca{grid-template-columns:1fr 1fr;}.kcb{grid-template-columns:1fr;}
  .ks{border-right:none;border-bottom:1px solid var(--rule);}.ks:last-child{border-bottom:none;}
  footer{flex-direction:column;gap:18px;text-align:center;}
  .hgrv{max-height:none!important;opacity:1!important;margin-top:12px!important;}
}
@media(max-width:640px){nav{padding:12px 18px;}.hero{padding:72px 18px 40px;}.mg,.wca{grid-template-columns:1fr;}.mob{padding:24px 20px 32px;}.moc{right:18px;}}
`}</style>;

// ─── NAV + HERO ───────────────────────────────────────────────────────────────
function Toast({msg}){if(!msg)return null;return <div className="toast">{msg}</div>;}
function Nav(){
  const[sc,setSc]=useState(false);
  useEffect(()=>{const f=()=>setSc(window.scrollY>40);window.addEventListener("scroll",f);return()=>window.removeEventListener("scroll",f);},[]);
  const go=id=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return(<nav className={sc?"sc":""}><div className="nl">Vaani <span>Gupta</span></div><div className="nlinks"><span className="na" onClick={()=>go("work")}>Work</span><span className="na" onClick={()=>go("thinking")}>PM Thinking</span><span className="na" onClick={()=>go("about")}>About</span><a className="nc" href="#" onClick={e=>e.preventDefault()}>View Résumé</a></div></nav>);
}
function Hero(){
  return(
    <div className="hero">
      <ParallaxLayer speed={0.12} style={{position:"absolute",top:0,right:0,zIndex:0,pointerEvents:"none"}}><div className="blob blob1"/></ParallaxLayer>
      <ParallaxLayer speed={-0.08} style={{position:"absolute",bottom:0,left:0,zIndex:0,pointerEvents:"none"}}><div className="blob blob2"/></ParallaxLayer>
      <ParallaxLayer speed={0.06} style={{position:"absolute",top:"35%",left:"38%",zIndex:0,pointerEvents:"none"}}><div className="blob blob3"/></ParallaxLayer>
      <ParallaxLayer speed={0.04} style={{position:"relative",zIndex:1}}>
        <div style={{animation:"fadeUp .6s ease .04s both"}}><div className="hey">Business & Product Manager</div></div>
        <h1 className="hh" style={{animation:"fadeUp .6s ease .1s both"}}>Brewing product systems with an <em>obsessive quality bar</em> — from discovery to users</h1>
        <p className="hs" style={{animation:"fadeUp .6s ease .16s both"}}>10+ products shipped across consumer apps, internal CRMs, operations tooling and analytics platforms in PropTech and community tech — combining structured discovery, cross-functional execution, and a relentless insistence on getting it right to drive engagement, efficiency, and real outcomes.</p>
        <div className="hm" style={{animation:"fadeUp .6s ease .2s both"}}>
          {[["10+","Products Shipped"],["5K+","Users on Consumer App"],["~100%","Internal Adoption"],["2×","Published ML Researcher"]].map(([n,l])=>(
            <div className="hmt" key={n}><div className="hmn">{n}</div><div className="hml">{l}</div></div>
          ))}
        </div>
      </ParallaxLayer>
      <ParallaxLayer speed={0.02} style={{position:"relative",zIndex:1}}>
        <div className="ph" style={{animation:"fadeUp .6s ease .14s both"}}>
          <div className="ph-fr">
            <div className="ph-bl"/>
            <div className="ph-in"><img src={SS.vaani} alt="Vaani Gupta"/></div>
            <div className="ph-q"><p>"I research before I decide, prototype before I build, iterate continuously and lead teams through every build with the same clarity I'd want as a user."</p><span>— Vaani Gupta</span></div>
            <a href="https://linkedin.com/in/vaani-gupta" target="_blank" rel="noreferrer" className="li-b"><svg viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg></a>
          </div>
        </div>
      </ParallaxLayer>
    </div>
  );
}

// ─── EMBED HELPERS ────────────────────────────────────────────────────────────
function LinkCTA({label,url,tool}){return <a href={url} target="_blank" rel="noreferrer" className="moln">{tool&&<LogoSVG tool={tool} size={20}/>}{label}</a>;}
// NotionEmbed: pass `embedUrl` (a NotionHero / Notion-official-embed URL) once you've
// generated one for this page — see comment block above SS for instructions.
// Without embedUrl, this renders the safe fallback card immediately (Notion's raw
// notion.site URLs block iframing via X-Frame-Options, and that failure is SILENT —
// no onError fires — so we don't even attempt a raw iframe; we go straight to the
// reliable fallback until a working embedUrl is supplied).
function NotionEmbed({url,title,embedUrl=null,height=460}){
  if(!embedUrl){
    return(
      <a href={url} target="_blank" rel="noreferrer" className="emw" style={{display:"flex",gap:14,alignItems:"flex-start",padding:"20px 22px",textDecoration:"none"}}>
        <LogoSVG tool="Notion" size={36}/>
        <div>
          <div style={{fontFamily:"var(--h)",fontSize:14.5,fontWeight:600,color:"var(--ink)",marginBottom:4}}>{title}</div>
          <div style={{fontSize:11,color:"var(--ink-mu)",marginBottom:6,lineHeight:1.5}}>Live preview pending — generate an embed URL via NotionHero or Notion's own Share → Publish → Embed this page, then drop it into the `embedUrl` prop.</div>
          <span style={{fontSize:12,color:"var(--plum)",fontFamily:"var(--l)",fontWeight:600}}>Open full document in Notion ↗</span>
        </div>
      </a>
    );
  }
  return(
    <div className="emw" style={{height:height+48}}>
      <div className="eml"><LogoSVG tool="Notion" size={16}/>{title}</div>
      <a href={url} target="_blank" rel="noreferrer" className="emo">Open ↗</a>
      <iframe src={embedUrl} className="emf" style={{height}} title={title} loading="lazy"/>
    </div>
  );
}
function SheetEmbed({url,label="Sheet",height=280}){
  const eu=url.replace(/\/edit.*$/,"/preview")+(url.includes("gid=")?"?"+url.split("?")[1]:"");
  return(<div className="emw"><div className="eml"><LogoSVG tool="GoogleSheets" size={16}/>{label}</div><a href={url} target="_blank" rel="noreferrer" className="emo">Open ↗</a><iframe src={eu} className="emf" style={{height}} title={label} loading="lazy"/></div>);
}
function SlidesEmbed({url,label="Deck",height=280}){
  return(<div className="emw"><div className="eml"><LogoSVG tool="GoogleSlides" size={16}/>{label}</div><a href={url} target="_blank" rel="noreferrer" className="emo">Open ↗</a><iframe src={url.replace(/\/edit.*$/,"/embed")} className="emf" style={{height}} title={label} loading="lazy"/></div>);
}
function VideoEmbed({url,height=300}){
  const id=url.match(/\/d\/([^/]+)/)?.[1];
  return(<div className="emw"><div className="eml"><LogoSVG tool="GoogleDrive" size={16}/>Walkthrough Video</div><a href={url} target="_blank" rel="noreferrer" className="emo">Open ↗</a><iframe src={id?`https://drive.google.com/file/d/${id}/preview`:url} className="emf" style={{height}} title="Video" allow="autoplay" loading="lazy"/></div>);
}
function ProtoEmbed({url,label="Prototype",height=300,tool="v0"}){
  return(<div className="emw"><div className="eml"><LogoSVG tool={tool} size={16}/>{label}</div><a href={url} target="_blank" rel="noreferrer" className="emo">Open ↗</a><iframe src={url} className="emf" style={{height}} title={label} loading="lazy"/><div style={{position:"absolute",bottom:10,right:10,background:"rgba(34,29,25,.72)",color:"white",fontSize:10,fontFamily:"var(--l)",padding:"4px 10px",borderRadius:14,pointerEvents:"none",zIndex:3}}>scroll inside ↕</div></div>);
}

// ─── CASE CARDS ───────────────────────────────────────────────────────────────
const SC={
  dashboards:{"--sc":"rgba(75,28,52,.93)","--sm":"rgba(75,28,52,.5)","--sch":"rgba(75,28,52,.97)","--smh":"rgba(75,28,52,.82)"},
  casa:{"--sc":"rgba(20,48,40,.93)","--sm":"rgba(20,48,40,.5)","--sch":"rgba(20,48,40,.97)","--smh":"rgba(20,48,40,.82)"},
  parentapp:{"--sc":"rgba(24,30,52,.93)","--sm":"rgba(24,30,52,.5)","--sch":"rgba(24,30,52,.97)","--smh":"rgba(24,30,52,.82)"},
  lms:{"--sc":"rgba(56,42,12,.93)","--sm":"rgba(56,42,12,.5)","--sch":"rgba(56,42,12,.97)","--smh":"rgba(56,42,12,.82)"},
  b2b:{"--sc":"rgba(70,32,18,.93)","--sm":"rgba(70,32,18,.5)","--sch":"rgba(70,32,18,.97)","--smh":"rgba(70,32,18,.82)"},
};
const CASES=[
  {id:"dashboards",feat:true,pill:<>Live · <strong>9 cities</strong></>,tags:["Analytics & Intelligence","Strategic Discovery"],title:"Analytics Dashboards Suite",desc:"Built pan-India analytics visibility from scratch — where leadership had data but no synthesis, no graphs, no insight layer.",tools:["ChatGPT","v0","Claude","Replit"],cta:"See the Dashboards",chips:["5 dashboards","4 req. sheets","Replit build"],imgs:[SS.collDash1,SS.collDash3,SS.unitEco1,SS.collDash2]},
  {id:"casa",pill:<><strong>~50</strong> screens</>,tags:["Consumer App","CRM","External Client"],title:"CASA App + CRM",desc:"Complete product suite for a Boston-based grad student membership org — members-only app and full ops CRM, from zero.",tools:["Claude","Replit","Notion"],cta:"Explore the Build",chips:["15 app screens","35 CRM screens","Full PRD"],imgs:[SS.casaFirstScreen,SS.casaOnboard,SS.casaEvents,SS.casaCrm1]},
  {id:"parentapp",pill:<><strong>5,000+</strong> users</>,tags:["Retention & Trust","0→1"],title:"HooLiv Parent App + Outpass",desc:"Turned a trust deficit between families and student accommodation into a unified digital experience.",tools:["ChatGPT","Genspark","Figma"],cta:"Watch the Walkthrough",hasVideo:true,chips:["Walkthrough video","Full PRD","Outpass logic"],imgs:[SS.parentHome,SS.outpassTenant,SS.parentPay]},
  {id:"lms",pill:<><strong>~100%</strong> adoption</>,tags:["Operations & Internal Tools","0→1"],title:"Leave Management System",desc:"Replaced a fully manual leave process with a full-stack LMS, and held the quality line to ship it right.",tools:["ChatGPT","v0","Replit"],cta:"See How I Shipped It",chips:["Mobile + Web","Full PRD","150+ employees"],imgs:[SS.lmsDash,SS.lmsHistory,SS.lmsManage,SS.lmsRecord]},
  {id:"b2b",pill:<><strong>~10 min</strong> saved</>,tags:["Operations & Internal Tools","Discovery-Led"],title:"B2B Customer Invoices Module",desc:"Found a recurring ops process that had never been looked at through a product lens — and fixed it.",tools:["ChatGPT","v0","Bolt"],cta:"See the Fix",chips:["Live KPI view","Full PRD","Credit Notes"],imgs:[SS.b2b1,SS.b2b2]},
];
function CaseCard({cs,onClick}){
  const ref=useInView();
  return(
    <div ref={ref} className={`hgc iv${cs.feat?" feat":""}`} style={SC[cs.id]} onClick={onClick}>
      <div className="hgbg"><AutoCarousel images={cs.imgs}/></div>
      <div className="hgsc"/>
      <div className="hgpl">{cs.pill}</div>
      {cs.hasVideo&&<div className="hgpv"><svg width="14" height="14" viewBox="0 0 24 24" fill="var(--ink)"><path d="M8 5v14l11-7z"/></svg></div>}
      <div className="hghi"><Arrow/></div>
      <div className="hgcon">
        <div className="hgtags">{cs.tags.map(t=><span key={t} className="hgtag">{t}</span>)}</div>
        <div className="hgti">{cs.title}</div>
        <div className="hgrv">
          <p className="hgde">{cs.desc}</p>
          <div className="hgch">{cs.chips.map((c,i)=><span key={i} className="hgcp">{c}</span>)}</div>
          <div className="hgft">
            <div className="hgct">{cs.cta} <Arrow/></div>
            <div className="hgtl">{cs.tools.map(t=><div key={t} className="hgto"><LogoSVG tool={t} size={20}/></div>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MORE WORK ─────────────────────────────────────────────────────────────────
const MORE=[
  {title:"Consumer App Redesign",tags:["Engagement & VAS"],desc:"Identified the need for a visual overhaul and led redesign direction alongside the designer — giving the HooLiv consumer app the fresh, contemporary look it needed.",imgs:[SS.vasServices],tools:["ChatGPT","Figma"],sc:{"--sc":"rgba(40,30,50,.93)","--sm":"rgba(40,30,50,.5)","--sch":"rgba(40,30,50,.97)","--smh":"rgba(40,30,50,.82)"}},
  {title:"Readers' Hub · GenAI · Exam Prep",tags:["Engagement & VAS"],desc:"End-to-end ownership across three VAS integrations — Readers' Hub (BookR library), GenAI Course (upGrad), Exam Prep Studio (Acadza). ~20% lift in service adoption and engagement. SOP created for upGrad integration.",imgs:[SS.readersHub,SS.upgradCard,SS.acadza],tools:["ChatGPT","Figma"],sc:{"--sc":"rgba(20,48,40,.93)","--sm":"rgba(20,48,40,.5)","--sch":"rgba(20,48,40,.97)","--smh":"rgba(20,48,40,.82)"}},
  {title:"Room Allotment Engine",tags:["Operations & Internal Tools"],desc:"Policy-driven allocation replacing manual room assignment — affinity-based auto-allocation using student demographic and interest data, through a unified Occupancy Heat Map interface. PRD and prototype complete.",imgs:[SS.roomAlloc],tools:["ChatGPT","Figma","v0"],prdUrl:"https://vaanig-spring-boa-26a.notion.site/2d900c0515c4801a89bfc34709afbe58",prdEmbedUrl:"https://vaanig-spring-boa-26a.notion.site/ebd//2d900c0515c4801a89bfc34709afbe58",sc:{"--sc":"rgba(56,42,12,.93)","--sm":"rgba(56,42,12,.5)","--sch":"rgba(56,42,12,.97)","--smh":"rgba(56,42,12,.82)"}},
];
function MoreCard({card}){
  const ref=useInView();
  return(
    <div ref={ref} className="hgc iv" style={{...card.sc,aspectRatio:"3/4",borderRadius:18,cursor:"default"}}>
      <div className="hgbg"><AutoCarousel images={card.imgs} interval={2800}/></div>
      <div className="hgsc"/>
      <div className="hgcon">
        <div className="hgtags">{card.tags.map(t=><span key={t} className="hgtag">{t}</span>)}</div>
        <div className="hgti" style={{fontSize:20}}>{card.title}</div>
        <div className="hgrv" style={{maxHeight:"none",opacity:1,marginTop:10}}>
          <p className="hgde" style={{fontSize:12}}>{card.desc}</p>
          <div className="hgft">
            <div className="hgtl">{card.tools.map(t=><div key={t} className="hgto"><LogoSVG tool={t} size={20}/></div>)}</div>
            {card.prdUrl&&<a href={card.prdUrl} target="_blank" rel="noreferrer" className="hgct" style={{padding:"7px 14px",fontSize:11}} onClick={e=>e.stopPropagation()}><LogoSVG tool="Notion" size={16}/>PRD</a>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── WEDDING + KITCHEN ────────────────────────────────────────────────────────
function WeddingCard(){
  const ref=useInView();
  return(
    <div ref={ref} className="wc iv">
      <div className="wch">
        <div><div style={{marginBottom:7}}><Tag label="Personal Product Work"/><Tag label="Research Stage"/></div><div className="wct">Wedding Planning Platform</div><p style={{fontSize:13,color:"var(--ink-mu)",fontWeight:300,marginTop:4,maxWidth:440,lineHeight:1.7}}>Addressing vendor-discovery fragmentation for engaged couples — building a matchmaking-algorithm-driven platform.</p></div>
        <LogoRow tools={["ChatGPT","Figma"]} size={24}/>
      </div>
      <div className="wcb">
        <p style={{fontSize:13.5,color:"var(--ink-mid)",lineHeight:1.78,fontWeight:300,marginBottom:18}}>Couples planning weddings navigate a deeply fragmented experience — vendor discovery scattered across Instagram, WeddingWire, and word of mouth; budgets in Google Sheets; timelines across WhatsApp groups. I ran structured user research across three cohorts and found the same core pain point across all: vendor discovery is fragmented, comparison is near-impossible, and the process is overwhelming by design. I found it frustrating enough to want to fix it myself.</p>
        <div className="wca">
          <div className="wa"><div className="wai"><iframe src="https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/design/zCKKC9UBHqBvPcY0qPW2Kz/Wedding-Planning-%E2%80%94-User-Personas?node-id=1-219" style={{width:"100%",height:"100%",border:"none"}} loading="lazy" title="Personas"/></div><div className="wab"><div className="wat">User Personas (Figma)</div><div className="wad">3 archetypes: detail-obsessed planner, budget-first pragmatist, aesthetics-led dreamer.</div><a href="https://www.figma.com/design/zCKKC9UBHqBvPcY0qPW2Kz/Wedding-Planning-%E2%80%94-User-Personas?node-id=1-219" target="_blank" rel="noreferrer" className="wal"><LogoSVG tool="Figma" size={14}/>Open in Figma →</a></div></div>
          <div className="wa"><div className="wai"><img src={SS.compGridWedding} alt="Competitor Analysis" style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top",display:"block"}}/></div><div className="wab"><div className="wat">Competitor Analysis</div><div className="wad">WeddingBazaar, WedMeGood, WeddingWire. WeddingWire leads on scale & AI; WedMeGood on design. Gap: end-to-end workflow integration.</div></div></div>
          <div className="wa"><div className="wai" style={{background:"var(--paper)",display:"flex",alignItems:"center",justifyContent:"center",padding:10}}><div style={{textAlign:"center"}}>{["Vendor discovery","Matchmaking algorithm","Budget tracker","Timeline/checklist","Package builder","Inspiration layer"].map((f,i)=><div key={i} style={{fontSize:10,color:"var(--ink-mu)",fontFamily:"var(--l)",padding:"2px 0"}}>{f}</div>)}</div></div><div className="wab"><div className="wat">Product Scope</div><div className="wad">AI-simulated interviews across 3 cohorts. Primary metric: shortlist-to-booking conversion rate.</div></div></div>
        </div>
      </div>
    </div>
  );
}
function RoomAllocPRDCard(){
  const ref=useInView();
  const room=MORE.find(m=>m.title==="Room Allotment Engine");
  if(!room?.prdUrl)return null;
  return(
    <div ref={ref} className="kc iv" style={{marginTop:18}}>
      <div className="kch"><div className="kct">Room Allotment Engine — Full PRD</div><div className="kcs">Policy-driven allocation · PRD complete · Engineering deprioritised</div></div>
      <div style={{padding:24}}><NotionEmbed url={room.prdUrl} embedUrl={room.prdEmbedUrl} title="Room Allotment Engine — PRD" height={420}/></div>
    </div>
  );
}
function KitchenCard(){
  const ref=useInView();
  return(
    <div ref={ref} className="kc iv">
      <div className="kch"><div className="kct">Kitchen Consumption & Expenditure Stats Engine</div><div className="kcs">Ops & Data Work · Excel-based · Internal tool</div></div>
      <div className="kcb">
        <div className="ks"><div className="ksl">The Problem</div><div className="kst">Kitchen operations across 2 city kitchens were recording data but no one was using it. The data quality problem was upstream, not analytical.</div></div>
        <div className="ks"><div className="ksl">What I Built</div><ul className="kli"><li>Material-wise consumption and purchase stats</li><li>Purchase vs. consumption variance analysis</li><li>Vegetable-wise contribution breakdown</li><li>Weekly consumption tracking</li></ul><p style={{fontSize:12,color:"var(--ink-mu)",marginTop:7,lineHeight:1.55,fontWeight:300}}>Alongside the engine, I surfaced the systemic issues behind the data quality problem itself — proposing a carryover stock tracking sheet, opening/closing balance framework, meal-wise data capture structure, and unit standardisation guidelines.</p></div>
        <div className="ks"><div className="ksl">Why It's a PM Artefact</div><div className="kst">The product thinking wasn't in the Excel. It was in identifying that the data quality problem upstream was the real root cause, and that solving it required process changes, not just better analysis.</div></div>
      </div>
    </div>
  );
}

// ─── MODALS ───────────────────────────────────────────────────────────────────
function Img({src,alt="",style={}}){return <img src={src} alt={alt} style={{display:"block",...style}} onError={e=>{e.target.style.opacity=".3";}}/>;}
function MockRow({imgs,h=180}){return <div style={{display:"flex",gap:8,height:h,justifyContent:"center",alignItems:"center",padding:"0 8px"}}>{imgs.map(([src,w],i)=><div key={i} style={{width:w,height:"100%",flexShrink:0,borderRadius:8,overflow:"hidden",border:"1px solid rgba(34,29,25,.1)",boxShadow:"0 4px 14px rgba(34,29,25,.1)"}}><Img src={src} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}}/></div>)}</div>;}

function DashModal(){return(<>
  <div className="mohe" style={{background:"linear-gradient(135deg,#0A1A18,#0D2020)"}}><MockRow imgs={[[SS.collDash1,"32%"],[SS.collDash3,"28%"],[SS.unitEco1,"28%"]]} h={185}/></div>
  <div className="mob">
    <div className="moov">Analytics & Intelligence · Stakeholder-Led Strategic Discovery</div>
    <h2 className="moti">Analytics Dashboards Suite</h2>
    <p className="mosu">Collections · Occupancy MIS · Occupancy Heat Map · Occupancy Management · Unit Economics</p>
    <div className="mose"><h3 className="mosh">The Problem</h3><div className="mot"><p>HooLiv operates across thousands of tenants, B2B partners, and multi-layered financial flows spanning 9 cities and 50 properties — but leadership was navigating all of it without a single analytics layer.</p><p>A CRM existed with data tables, but the previous collections MIS within it went largely unused. Analytics, graphs, and actionable insights were completely missing. Occupancy was being checked at an individual city or property level, manually. Unit economics had never been pulled together in one place.</p><p>Founders and region and city heads were making pricing, capacity, and collections decisions without structured data to back them. The gap wasn't a data gap — it was a visibility and synthesis gap.</p></div></div>
    <div className="mose"><h3 className="mosh">My Discovery Process</h3><div className="mot"><p>I structured discovery independently for each dashboard — running stakeholder interviews with the founding team (CEO, CDAIO, CSO, COO) and region and city heads, understanding what decisions each role needed to make and what data would support those decisions. I translated these into dense, structured requirements tables mapping every metric to its calculation logic, data source, visualisation type, and granularity level.</p><p>I then led stakeholder review sessions for every dashboard — presenting the full interactive prototype, walking each stakeholder through every chart and filter, fielding queries, capturing feedback, and aligning on what success looked like before engineering wrote a single line of code. These weren't just sign-offs. They were where assumption mismatches surfaced, operational concepts got refined, and the real decision-making logic got embedded into what I was building.</p></div></div>
    <div className="mose"><h3 className="mosh">What I Built</h3>
      {[{name:"Collections Dashboard",tag:"Live — Phase 1 & 2",desc:"Real-time dues overview — total outstanding, invoiced, collected vs pending, commitment schedules, city-wise breakdown, status distribution, B2B dues by client. Used daily by founders, ops heads, finance, and accounts across 9 cities and 50 properties.",proto:"https://v0-ticket-management-dashboard-seven.vercel.app/",sheet:"https://docs.google.com/spreadsheets/d/1f-xiqVAy6od058FkY0Cfn5u24ev5FsYLHhaW48dWifo/edit"},
        {name:"Occupancy MIS Dashboard",tag:"Strategic layer — Engineering Underway",desc:"Designed for strategic review and planning — occupancy trends, tenant mix, pricing impact, churn patterns, city-level benchmarking, and forecasting. Built for founders and regional leadership.",proto:"https://v0-occupmisdashboard-wireframe.vercel.app/occupancy-mis",sheet:"https://docs.google.com/spreadsheets/d/1f-xiqVAy6od058FkY0Cfn5u24ev5FsYLHhaW48dWifo/edit?gid=1314828671"},
        {name:"Occupancy Heat Map Dashboard",tag:"Granular monitoring — Engineering Underway",desc:"Built for city ops heads who need to act, not just review — property and room-level live monitoring, allocation status, mismatch detection, red-flag alerts, bed-type splits.",proto:"https://v0-occupancy-heatmap-dashboard.vercel.app/",sheet:"https://docs.google.com/spreadsheets/d/1f-xiqVAy6od058FkY0Cfn5u24ev5FsYLHhaW48dWifo/edit?gid=1724728013"},
        {name:"Occupancy Management Dashboard",tag:"Day-to-day ops — Engineering Underway",desc:"Live check-in/checkout tracking, retention signals, daily accountability metrics for on-ground ops teams.",proto:"https://v0-occupancy-management-dashboard.vercel.app/",sheet:"https://docs.google.com/spreadsheets/d/1f-xiqVAy6od058FkY0Cfn5u24ev5FsYLHhaW48dWifo/edit?gid=1752378348"},
        {name:"Unit Economics Dashboard",tag:"Building on Replit",desc:"Building this on Replit — not a prototype, a shippable product. SQLite-backed, trend detection, colour-coded financial flagging, city-level P&L tracking. The foundation of operational and profitability intelligence in the coliving business.",proto:null,sheet:null},
      ].map((b,i)=>(
        <div key={i} style={{marginBottom:12,padding:"14px 18px",background:"var(--cream)",borderRadius:12,border:"1px solid var(--rule)"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,gap:10}}><strong style={{fontFamily:"var(--h)",fontSize:14,color:"var(--ink)"}}>{b.name}</strong><span style={{fontFamily:"var(--l)",fontSize:9.5,color:"var(--ink-mu)",background:"var(--paper)",padding:"3px 9px",borderRadius:18,whiteSpace:"nowrap",border:"1px solid var(--rule)"}}>{b.tag}</span></div>
          <p style={{fontSize:12.5,color:"var(--ink-mu)",lineHeight:1.65,fontWeight:300,marginBottom:b.proto?10:0}}>{b.desc}</p>
          {b.proto&&<div className="molk"><LinkCTA label="Prototype" url={b.proto} tool="v0"/><LinkCTA label="Requirements" url={b.sheet} tool="GoogleSheets"/></div>}
        </div>
      ))}
      <div className="moss t2" style={{marginTop:12}}>{[SS.collDash2,SS.collDash4].map((s,i)=><div key={i} className="ssw"><Img src={s} style={{width:"100%",height:"auto"}}/></div>)}</div>
      <div className="moss t3" style={{marginTop:8}}>{[SS.unitEco1,SS.unitEco2,SS.unitEco3].map((s,i)=><div key={i} className="ssw"><Img src={s} style={{width:"100%",height:"auto"}}/></div>)}</div>
    </div>
    <div className="mose"><h3 className="mosh">How I Led the Build</h3><div className="mot"><p>Throughout every build, I serve as the connective tissue between data, design, and the engineering team — translating requirements into implementation logic, making real-time product decisions as edge cases emerge, and maintaining the intent of what each chart is actually supposed to tell its reader. Some days that means three interesting conversations before lunch.</p><p>I conduct pre-release acceptance testing on every dashboard before it goes live, catching data mapping errors, calculation discrepancies, filter logic issues, and UI inconsistencies. Every dashboard going live goes through the same rigorous pass.</p></div></div>
    <div className="mose"><h3 className="mosh">Impact</h3><div className="imp"><p>The Collections Dashboard — across both phases — is live with real data, used daily across HooLiv's leadership and ops structure. The Unit Economics Dashboard will, for the first time, give HooLiv's founders a real answer to the question that underpins every expansion decision in the coliving business: <strong>are we actually making money per bed?</strong></p></div></div>
    <div className="mose"><h3 className="mosh">Tech Stack</h3><LogoRow tools={["ChatGPT","v0","Claude","Replit","Excel"]} size={26}/></div>
  </div>
</>);}

function CASAModal(){return(<>
  <div className="mohe" style={{background:"linear-gradient(135deg,#071814,#0A2420)"}}>
    <MockRow imgs={[[SS.casaFirstScreen,72],[SS.casaOnboard,72],[SS.casaEvents,72]]} h={180}/>
    <div style={{flex:1,height:180,borderRadius:8,overflow:"hidden",border:"1px solid rgba(255,255,255,.1)"}}><Img src={SS.casaCrm1} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}}/></div>
  </div>
  <div className="mob">
    <div className="moov">Consumer App + CRM · External Client · Boston</div>
    <h2 className="moti">CASA App + CRM</h2>
    <p className="mosu">~50 screens across members-only app and operations CRM · Full product ownership</p>
    <div className="mose"><h3 className="mosh">The Context</h3><div className="mot"><p>CASA — Community as a Service for All — is a Boston-based membership organisation helping graduate students navigate off-campus life: housing, roommate matching, pre-arrival logistics, community connection, and local perks throughout the academic year.</p><p>A first version of the app had been built previously. The client wasn't satisfied — they wanted significant changes and in some areas, a fresh start. The brief I received contained the CASA team's product vision, an app review deck with their direction and critique, a full tech outline, and a comprehensive set of product assets and references. No formal requirements document existed for what they now needed. I wrote it.</p></div></div>
    <div className="mose"><h3 className="mosh">What I Built</h3><div className="mot"><p><em>Member App — 7–8 journeys, ~15 screens.</em> The in-market community layer for active CASA members — graduate students in or arriving in Boston. Covers exclusive local perks and partner discounts, CASA-hosted events (social, cultural, wellness, professional), resources and updates from the CASA team, and support navigation.</p><p><em>CRM — ~35 screens.</em> The operational source of truth for the CASA team — managing members, payments, membership status, events, offers, reminders, and communications across the full member lifecycle. The CRM went through multiple rigorous iterations as I documented issues, flagged backend inconsistencies, and pushed for systematic corrections.</p></div>
      <div className="moss t3" style={{marginTop:12}}>{[SS.casaEvDetail,SS.casaPerks,SS.casaBlog].map((s,i)=><div key={i} className="ssw"><Img src={s} style={{width:"100%",height:"auto"}}/></div>)}</div>
      <div className="moss t2" style={{marginTop:8}}>{[SS.casaCrm2,SS.casaCrm3].map((s,i)=><div key={i} className="ssw"><Img src={s} style={{width:"100%",height:"auto"}}/></div>)}</div>
    </div>
    <div className="mose"><h3 className="mosh">PRD & Prototype</h3>
      <NotionEmbed url="https://vaanig-spring-boa-26a.notion.site/CASA-Community-App-Product-Requirements-Document-32000c0515c4800f869ed93766eed8e9" embedUrl="https://vaanig-spring-boa-26a.notion.site/ebd//32000c0515c4800f869ed93766eed8e9" title="CASA Community App — PRD"/>
      <div style={{marginTop:10}}><ProtoEmbed url="https://claude.ai/public/artifacts/48c8ecd9-1844-4605-83f2-8cf04f5c1c33" label="App Prototype" tool="Claude"/></div>
    </div>
    <div className="mose"><h3 className="mosh">How I Led the Build</h3><div className="mot"><p>Every product decision — how each journey should flow, where to simplify, what to defer — was mine to make. I enforced implementation of UI fixes sprint-wise within days of the initial release rather than delaying launch, ensuring the client received a clean experience from day one.</p><p>I conducted pre-release acceptance testing on both the app and the CRM — raising UI/UX issues, backend inconsistencies, and gaps that had emerged during development. For an external client product, the quality bar was non-negotiable.</p></div></div>
    <div className="mose"><h3 className="mosh">Impact</h3><div className="imp"><p><strong>~50 screens across app and CRM, live and serving CASA members in Boston</strong> — the complete operational and community infrastructure for a graduate student membership organisation, delivered end-to-end.</p></div></div>
    <div className="mose"><h3 className="mosh">Tech Stack</h3><LogoRow tools={["Claude","Replit","Notion"]} size={26}/></div>
  </div>
</>);}

function ParentModal(){return(<>
  <div className="mohe" style={{background:"linear-gradient(135deg,#080820,#101038)"}}>
    <MockRow imgs={[[SS.parentHome,78],[SS.outpassTenant,78],[SS.parentPay,78],[SS.outpassDetail,78]]} h={185}/>
  </div>
  <div className="mob">
    <div className="moov">Retention & Trust · Consumer Product · 5,000+ Users</div>
    <h2 className="moti">HooLiv Parent App + Outpass</h2>
    <p className="mosu">Live and serving 5,000+ tenants and their parents</p>
    <div className="mose"><VideoEmbed url="https://drive.google.com/file/d/1Qznde8tS6Yhmpa9F8zz8CLTp61vQbCtS/view" height={280}/></div>
    <div className="mose"><h3 className="mosh">The Problem</h3><div className="mot"><p>HooLiv houses 5,000+ students across India. Their parents had no digital touchpoint with the accommodation their child was living in — no visibility into payments, no way to receive or act on notices, no connection to the services available. And when a student needed to leave the property for a late outing, a home visit, or an emergency, the approval process was entirely manual — creating accountability gaps and leaving parents with no real peace of mind.</p><p>The problem wasn't just operational or UX friction. It was a trust deficit at scale.</p></div></div>
    <div className="mose"><h3 className="mosh">What I Built</h3>
      <ul className="moli"><li><strong>Outpass Mechanism</strong> — tenants initiate requests; parents approve or reject digitally across outpass types: late outing, home visit, emergency, general. For situations where a parent is unreachable, the warden can coordinate by call and upload a handwritten approval photo as an operational exception path — a specific edge case defined mid-build after a city head flagged a real scenario my original approval flow hadn't accounted for.</li><li><strong>Payment & Dues Tracking</strong> — parents view invoices, balances, and payment history in real time.</li><li><strong>Property Notices</strong> — management pushes hostel, city, or pan-India level updates directly to parents.</li><li><strong>VAS Discovery</strong> — parents can see and explore the services available to their child.</li></ul>
      <div className="moss t3" style={{marginTop:14}}>{[SS.parentHome2,SS.parentPay,SS.outpassDetail].map((s,i)=><div key={i} className="ssw"><Img src={s} style={{width:"100%",height:"auto"}}/></div>)}</div>
    </div>
    <div className="mose"><h3 className="mosh">PRD</h3><NotionEmbed url="https://vaanig-spring-boa-26a.notion.site/Parent-Access-Module-UX-Led-Product-Specification-2cd00c0515c4805fbdf1ef7fbc592c98" embedUrl="https://vaanig-spring-boa-26a.notion.site/ebd//2cd00c0515c4805fbdf1ef7fbc592c98" title="Parent Access Module — UX-Led Product Specification"/></div>
    <div className="mose"><h3 className="mosh">How I Led the Build</h3><div className="mot"><p>The outpass mechanism was the most complex piece — a multi-state flow spanning tenant, parent, warden, and system, with notification logic, fallback paths, and real-world edge cases that only surfaced through close collaboration with ops stakeholders during the build.</p><p>Pre-release acceptance testing is where the real work happened. Development had moved fast, and a significant number of UI/UX issues, incomplete states, and design details had accumulated during the build — dev's oversight on several elements landed squarely on me during testing. I documented and raised every one, getting everything addressed before release. The standard wasn't "does it work." It was "would a parent trust this."</p></div></div>
    <div className="mose"><h3 className="mosh">Impact</h3><div className="imp"><p>Live and serving <strong>5,000+ tenants and their parents</strong> — digitising a previously fragmented, manual trust layer between HooLiv, students, and their families into a single, unified in-app experience.</p></div></div>
    <div className="mose"><h3 className="mosh">Tech Stack</h3><LogoRow tools={["ChatGPT","Genspark","Notion","Figma"]} size={26}/></div>
  </div>
</>);}

function LMSModal(){return(<>
  <div className="mohe" style={{background:"linear-gradient(135deg,#050E0C,#091A14)"}}>
    <MockRow imgs={[[SS.lmsDash,78],[SS.lmsHistory,78],[SS.lmsRecord,78],[SS.lmsManage,78]]} h={185}/>
  </div>
  <div className="mob">
    <div className="moov">Operations & Internal Tools · 0→1</div>
    <h2 className="moti">Leave Management System</h2>
    <p className="mosu">~100% adoption · 150+ employees · First org-wide product launch</p>
    <div className="mose"><h3 className="mosh">The Problem</h3><div className="mot"><p>Leave applications happened over WhatsApp. No approval workflow, no record system, no analytics. I identified this as a solvable ops gap — scoped the solution, defined the requirements, and proposed building a proper system.</p><p>Before writing a single requirement, I collaborated with the COO to understand the HR policies that would govern the new system — and where those policies could be made more practical. One example: medical or death certificate uploads were originally required for sick and bereavement leave regardless of duration. I pushed for a more human-centered rule — certificates required only if the leave exceeded 3 days. That kind of policy-to-product translation was baked into the PRD from the start.</p></div></div>
    <div className="mose"><h3 className="mosh">What I Built</h3>
      <p style={{fontSize:13,color:"var(--ink-mu)",marginBottom:10,fontWeight:300}}>Full-stack LMS across in-ops mobile app and web-based Employee Self-Service Portal, built on Replit:</p>
      <ul className="moli"><li>Multi-type leave calculations and tracking</li><li>Leave application and record management</li><li>Manager approval queues</li><li>Compensatory off mechanics</li><li>Team leave overview</li><li>Attendance regularisation</li><li>Admin analytics panel</li></ul>
    </div>
    <div className="mose"><h3 className="mosh">The Quality Story</h3><div className="qual"><p>The web portal was built in a delivery-first culture, without a formal PRD, using AI tools directly. When I tested it, the issues were extensive — calculation errors, incorrect logic across leave types, poor UI/UX decisions, API inconsistencies that replicated across the mobile app, and one leave type designed entirely wrong from the ground up.</p><p style={{marginTop:10}}>I caught and documented all of it. On the incorrectly designed leave type, I held firm — shipping wrong calculation logic from day one was not a trade-off worth making. That leave type was pulled from launch scope and queued for correction in the next phase.</p></div></div>
    <div className="mose"><h3 className="mosh">The Launch</h3><div className="mot"><p>I led the first org-wide product walkthrough call — 150+ employees. I demonstrated both the app and the web portal live, walked everyone through all leave types, their specific rules, caveats, and practical edge cases. I owned the pending fixes transparently and set expectations for Phase 2. The CEO acknowledged the work publicly on the org WhatsApp group after the call.</p></div></div>
    <div className="mose"><h3 className="mosh">PRD & Prototype</h3>
      <NotionEmbed url="https://vaanig-spring-boa-26a.notion.site/Leave-Management-System-PRD-30b00c0515c480b8b5fefe82d73f739d" embedUrl="https://vaanig-spring-boa-26a.notion.site/ebd//30b00c0515c480b8b5fefe82d73f739d" title="Leave Management System — PRD"/>
      <div style={{marginTop:10}}><ProtoEmbed url="https://v0-leave-management-prototype-sand.vercel.app/" label="LMS Prototype" tool="v0" height={300}/></div>
    </div>
    <div className="mose"><h3 className="mosh">Impact</h3><div className="imp"><p><strong>~100% adoption</strong> with no prior system in place — the only leave management infrastructure the company has.</p></div></div>
    <div className="mose"><h3 className="mosh">Tech Stack</h3><LogoRow tools={["ChatGPT","v0","Replit","Notion"]} size={26}/></div>
  </div>
</>);}

function B2BModal(){return(<>
  <div className="mohe" style={{background:"linear-gradient(135deg,#0E0606,#1C0A0A)"}}>
    <MockRow imgs={[[SS.b2b1,"47%"],[SS.b2b2,"45%"]]} h={190}/>
  </div>
  <div className="mob">
    <div className="moov">Operations & Internal Tools · Discovery-Led</div>
    <h2 className="moti">B2B Customer Invoices Module</h2>
    <p className="mosu">~10 min saved per invoice · Accounts team of 4 · SOP delivered</p>
    <div className="mose"><h3 className="mosh">The Problem</h3><div className="mot"><p>I started with a user interview with the Accounts Head. What I found was a recurring, high-frequency billing process entirely held together by Tally, email, and informal follow-ups — with no transparency, no standardisation, and no structure.</p><p>Region heads raised invoice requests informally. Accounts created invoices manually in Tally and tracked status through a combination of memory and chasing. A business stakeholder interview confirmed the opacity extended upward too — city heads had no invoice visibility, and finance had no B2B billing analytics at all. This was a process that had clearly never been looked at through a product lens.</p></div></div>
    <div className="mose"><h3 className="mosh">The Opportunity</h3><div className="mot"><p>Integrating B2B invoice creation and dispatch into the CRM would centralise both revenue streams under one system of record — enabling analytics, automation, and future extensions (GST pipeline, reminders, reporting) on top of a unified data layer.</p></div></div>
    <div className="mose"><h3 className="mosh">What I Built</h3>
      <ul className="moli"><li><strong>Integrated invoice creation, preview, email dispatch, and tracking</strong> inside the CRM — no Tally dependency.</li><li><strong>Standardised invoice request procedure for region heads</strong> — no more informal back-and-forth.</li><li><strong>Self-serve invoice status visibility for city heads</strong> — no escalation needed.</li><li><strong>Real-time B2B billing analytics for finance and leadership</strong> — a first.</li><li><strong>Comprehensive SOP</strong> — org-wide, covering accounts team workflows and ops staff responsible for city-wise B2B customer invoices.</li></ul>
    </div>
    <div className="mose"><h3 className="mosh">PRD & Prototypes</h3>
      <NotionEmbed url="https://vaanig-spring-boa-26a.notion.site/Invoice-Creation-Email-Dispatch-for-B2B-Customers-PRD-29300c0515c480fba1f9e714d5955d6a" embedUrl="https://vaanig-spring-boa-26a.notion.site/ebd//29300c0515c480fba1f9e714d5955d6a" title="Invoice Creation & Email Dispatch for B2B Customers — PRD"/>
      <div style={{marginTop:10}}><ProtoEmbed url="https://v0-invoice-module-requirements.vercel.app/" label="Invoice Module — Live KPI View" height={260} tool="v0"/></div>
      <div style={{marginTop:8}}><ProtoEmbed url="https://v0-b2-b-customer-record.vercel.app/" label="B2B Customer Record" height={240} tool="v0"/></div>
    </div>
    <div className="mose"><h3 className="mosh">How I Led the Build</h3><div className="mot"><p>A region head during the walkthrough and user testing complimented the product for being intuitive — exactly the signal you want from the user you built it for. Iterations are ongoing: recently collaborated with the CFO and Accounts Head to add a Credit Note feature, expanding the module's billing capabilities.</p></div></div>
    <div className="mose"><h3 className="mosh">Impact</h3><div className="imp"><p><strong>~10 minutes saved per invoice</strong> for a team of 4. Standardised procedure for region heads. Real-time B2B billing analytics for finance and leadership — none of which existed before.</p></div></div>
    <div className="mose"><h3 className="mosh">Tech Stack</h3><LogoRow tools={["ChatGPT","v0","Bolt","Notion","Claude"]} size={26}/></div>
  </div>
</>);}

const MODAL_MAP={dashboards:DashModal,casa:CASAModal,parentapp:ParentModal,lms:LMSModal,b2b:B2BModal};
function CaseModal({id,onClose}){
  const Comp=MODAL_MAP[id];
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow="";};},[]);
  if(!Comp)return null;
  return(<div className="mo" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}><button className="moc" onClick={onClose}>×</button><Comp/></div></div>);
}

// ─── PM THINKING ──────────────────────────────────────────────────────────────
const ANALYSES=[
  {id:"zomato",company:"Zomato",type:"Root Cause Analysis",title:"20% MoM Drop in Average Order Value",
   preview:"Eliminated low-probability causes first. Focused on three high-signal hypotheses including ordering flow bugs and Group Ordering feature interference.",
   sheetUrl:"https://docs.google.com/spreadsheets/d/1KTgmZ0dlZ73ZWdTiEeplUXJLIx4uXu-o/edit",
   sc:{"--sc":"rgba(75,28,52,.93)","--sm":"rgba(75,28,52,.45)","--sch":"rgba(75,28,52,.97)","--smh":"rgba(75,28,52,.82)"},
   content:{scenario:"20% month-over-month drop in Average Order Value with no specific region or segment affected.",eliminated:"Metric logging errors, seasonality (prior month had a holiday-driven surge), demographic shifts, regulatory changes.",hypotheses:[{h:"Competitive pricing pressure",detail:"Competitors offering better per-order deals, nudging users toward smaller Zomato orders.",prob:"Medium"},{h:"Ordering flow bug",detail:"A technical barrier preventing basket increases or showing incorrect availability. Identified Functional, Performance, Availability, and API testing paths to isolate this.",prob:"High"},{h:"Group Ordering feature interference",detail:"Feature released Aug 2024 introduced additional steps into a flow that directly influences cart size. Regression testing + A/B testing recommended.",prob:"High"}],solutions:"Targeted competitive promotions; regression and A/B testing across the ordering flow; UX analysis of Group Ordering's downstream impact on individual order value.",metrics:true,primaryMetric:"Average Order Value (MoM)",supporting:["Session-to-add-to-cart rate","Cart abandonment rate","Basket size distribution"],guardrails:["Revenue per order (avoid cannibalising through heavy discounting)","Group Ordering feature adoption"]}},
  {id:"netflix",company:"Netflix",type:"Root Cause Analysis",title:"20% QoQ Subscription Cancellation Spike",
   preview:"Eliminated strong-moat factors. Assessed 9 possible root causes across competitive pressure, pricing sensitivity, subscription fatigue, content fatigue, and behavioural shifts.",
   sheetUrl:"https://docs.google.com/spreadsheets/d/1KTgmZ0dlZ73ZWdTiEeplUXJLIx4uXu-o/edit?gid=392619316",
   sc:{"--sc":"rgba(70,32,18,.93)","--sm":"rgba(70,32,18,.45)","--sch":"rgba(70,32,18,.97)","--smh":"rgba(70,32,18,.82)"},
   content:{scenario:"20% quarter-over-quarter increase in subscription opt-outs with no specific segment or region driving it.",eliminated:"Strong-moat factors eliminated first — content library quality, UX standards, localisation depth, and brand loyalty scores.",hypotheses:[{h:"Competitor content advantage",detail:"Live sports (IPL, ICC, FIFA) on Amazon Prime and Disney+ Hotstar pulling users who don't find equivalent value in Netflix.",prob:"High"},{h:"Health consciousness / screen time awareness",detail:"Rising awareness of passive screen overconsumption reducing streaming stickiness.",prob:"High"},{h:"Subscription rationalisation",detail:"Users choosing between too many streaming services — Netflix not always winning the kept-vs-cancelled decision.",prob:"Medium"},{h:"Content fatigue",detail:"Users completing the shows they wanted to watch and not finding new compelling reasons to stay.",prob:"Medium"}],solutions:"Deeper regional content investment; broader telecom and DTH partnerships; sustained enforcement of household sharing policy.",metrics:true,primaryMetric:"Subscription Retention Rate (QoQ)",supporting:["D30 reactivation rate","Content engagement depth per subscriber","Churn by content genre"],guardrails:["ARPU (avoid over-discounting to retain)","Content budget ROI","Brand perception scores"]}},
  {id:"multiplayer",company:"Growth PM Case",type:"Product Case Study",title:"Improving Player Retention in a Multiplayer Game",
   preview:"D30 retention declining 28% → 18% over 6 months. Lifecycle analysis, feature decomposition, cohort reasoning, and a prioritised hypothesis framework.",
   link:"https://vaanig-spring-boa-26a.notion.site/Improving-Player-Retention-in-a-Multiplayer-Game-Growth-PM-Case-34100c0515c480bbbe08f80c6446c1ce",
   embedLink:"https://vaanig-spring-boa-26a.notion.site/ebd//34100c0515c480bbbe08f80c6446c1ce",
   linkedinPost:"https://www.linkedin.com/posts/vaani-gupta_productmanagement-productcase-userretention-activity-7450518670012981248-CWJa",
   sc:{"--sc":"rgba(24,30,52,.93)","--sm":"rgba(24,30,52,.45)","--sch":"rgba(24,30,52,.97)","--smh":"rgba(24,30,52,.82)"},
   content:{scenario:"D30 retention declining from 28% → 18% over 6 months. D7 stable at ~42%. Churn concentrated in Week 2–4.",approach:["Lifecycle analysis — narrowed focus to mid-game experience (Week 2–4) as primary drop zone","Feature decomposition — mapped key systems: progression, core gameplay loop, reward systems, social features, live events","Cohort-based reasoning — identified where retention curves diverge across cohorts","Data + qualitative signal triangulation — retention curves, funnel drop-offs, session trends, community feedback clusters"],hypotheses:[{h:"H1: Progression pacing & reward dissatisfaction",detail:"As players move beyond early gameplay, progression slows, rewards feel less meaningful, and effort-per-reward ratio deteriorates.",prob:"High"},{h:"H2: Gameplay frustration — matchmaking / difficulty",detail:"Churn spikes after matches or loss streaks. Skill-based matchmaking improvements as solutions.",prob:"Medium"},{h:"H3: Content fatigue",detail:"Event participation declining — players complete loops but don't return.",prob:"Low"},{h:"H4: Monetisation friction — pay-to-win perception",detail:"Higher churn among non-paying users, fairness complaints in community forums.",prob:"Medium"}],solutions:"Smooth difficulty spikes + catch-up mechanics; increase reward frequency and milestone-based incentives; introduce quests, streaks, challenges; social nudges (guild prompts, co-op incentives).",metrics:true,primaryMetric:"D30 Retention",supporting:["Progression rate (levels gained over time)","Session frequency","Feature engagement (quests, rewards, events)"],guardrails:["Content consumption rate (avoid burnout)","Monetisation balance (avoid over-generosity)","Player fairness perception scores"]}},
  {id:"whatsapp",company:"WhatsApp Business + Shopify",type:"Product Requirements Document",title:"Enhancing WhatsApp Business App for Shopify Merchants",
   preview:"Enabling Shopify merchants to streamline sales, improve engagement, and simplify order fulfilment within WhatsApp Business — addressing cart abandonment, COD fraud, and operational overhead.",
   link:"https://vaanig-spring-boa-26a.notion.site/Improving-WhatsApp-Business-App-for-Shopify-1b300c0515c48089b74ac11e8fdaedc3",
   embedLink:"https://vaanig-spring-boa-26a.notion.site/ebd//1b300c0515c48089b74ac11e8fdaedc3",
   sc:{"--sc":"rgba(20,48,40,.93)","--sm":"rgba(20,48,40,.45)","--sch":"rgba(20,48,40,.97)","--smh":"rgba(20,48,40,.82)"},
   content:{scenario:"Shopify merchants rely on WhatsApp Business as a primary sales channel, but fragmented workflows — manual product syncing, no order tracking integration, limited automation, COD fraud — are creating lost sales and operational overhead.",user:"Sukanya Mehta, 28, Mumbai — solo SME jewelry brand owner (Shingle Creations) using WhatsApp Business + Shopify + Instagram.",features:[{priority:"P1",name:"Smart WhatsApp-Shopify Integration Hub",desc:"Auto-sync product listings, import orders, integrate chats into Shopify CRM"},{priority:"P1",name:"AI-Powered Cart Recovery & Upselling",desc:"Personalised WhatsApp cart reminders, smart upsells/cross-sells"},{priority:"P1",name:"WhatsApp-Based Instant Checkout & Payment Links",desc:"Complete purchases via UPI, Razorpay, Stripe within WhatsApp"},{priority:"P1",name:"COD Verification & Smart RTO Prevention",desc:"Automated confirmation, OTP verification, prepaid nudge"},{priority:"P2",name:"Automated Order Tracking & Proactive Support"},{priority:"P2",name:"Smart WhatsApp CRM"},{priority:"P2",name:"AI-Based Product Discovery & WhatsApp Storefront"},{priority:"P3",name:"WhatsApp Multi-Agent Support for Teams"},{priority:"P3",name:"Marketing Insights & Performance Dashboard"},{priority:"P3",name:"WhatsApp Business API Lite for Small Merchants"}],wireframes:"Wireframes built for: Instant Checkout, Automated Order Tracking, Marketing Insights Dashboard, API Lite interface.",solutions:"Prioritised P1 features address the highest-impact pain points: cart recovery, seamless checkout, COD fraud reduction, real-time order tracking.",metrics:true,primaryMetric:"Abandoned Cart Recovery Rate",supporting:["COD Fraud/RTO% reduction","WhatsApp-to-purchase conversion rate","Merchant adoption rate"],guardrails:["Order status inquiry volume (reduction signal)","Merchant satisfaction score","API Lite adoption vs full API"]}},
];

function AnalysisModal({item,onClose}){
  useEffect(()=>{document.body.style.overflow="hidden";return()=>{document.body.style.overflow="";};},[]);
  const c=item.content;
  return(
    <div className="mo" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <button className="moc" onClick={onClose}>×</button>
        <div className="mohe" style={{flexDirection:"column",alignItems:"center",justifyContent:"center",gap:10,background:"linear-gradient(135deg,#0D0D18,#181828)"}}>
          <span style={{fontFamily:"var(--l)",fontSize:11,letterSpacing:2,textTransform:"uppercase",padding:"5px 14px",borderRadius:20,background:"rgba(155,45,94,.15)",color:"var(--plum)",border:"1px solid var(--plum-b)",fontWeight:700}}>{item.type}</span>
          <div style={{fontFamily:"var(--h)",fontSize:22,fontWeight:600,color:"white",textAlign:"center",letterSpacing:-.3,maxWidth:480,lineHeight:1.25}}>{item.company} — {item.title}</div>
          {item.sheetUrl&&<LinkCTA label="View RCA Spreadsheet" url={item.sheetUrl} tool="GoogleSheets"/>}
        </div>
        <div className="mob">
          <div className="moov">{item.type}</div>
          <h2 className="moti">{item.company}</h2>
          <p className="mosu">{item.title}</p>
          <div className="mose"><h3 className="mosh">Scenario</h3><div className="mot"><p>{c.scenario}</p></div></div>
          {c.eliminated&&<div className="mose"><h3 className="mosh">Causes Eliminated</h3><div className="mot"><p>{c.eliminated}</p></div></div>}
          {c.approach&&<div className="mose"><h3 className="mosh">My Approach</h3><ul className="moli">{c.approach.map((a,i)=><li key={i}>{a}</li>)}</ul></div>}
          {c.hypotheses&&<div className="mose"><h3 className="mosh">Hypothesis Framework</h3>
            {item.id==="multiplayer"?(
              <table className="htbl"><thead><tr><th>Hypothesis</th><th>Confidence</th><th>Priority</th></tr></thead>
              <tbody>{c.hypotheses.map((h,i)=><tr key={i}><td><strong style={{color:"var(--ink)",display:"block",marginBottom:2}}>{h.h}</strong><span style={{fontSize:11.5,color:"var(--ink-mu)"}}>{h.detail}</span></td><td><span className={`hb ${h.prob==="High"?"hi":h.prob==="Medium"?"me":"lo"}`}>{h.prob}</span></td><td><span className={`hb ${i===0?"hi":i===1?"me":"lo"}`}>{i===0?"Primary ⭐":i===1?"Secondary":"Explore"}</span></td></tr>)}</tbody></table>
            ):c.hypotheses.map((h,i)=><div key={i} style={{marginBottom:11,padding:"13px 17px",background:"var(--cream)",borderRadius:10,border:"1px solid var(--rule)"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4,gap:8}}><strong style={{fontSize:13.5}}>{h.h}</strong>{h.prob&&<span className={`hb ${h.prob==="High"?"hi":h.prob==="Medium"?"me":"lo"}`}>{h.prob}</span>}</div><p style={{fontSize:12.5,color:"var(--ink-mu)",lineHeight:1.65,fontWeight:300}}>{h.detail}</p></div>)}
          </div>}
          {c.user&&<div className="mose"><h3 className="mosh">Primary User</h3><div className="mot"><p>{c.user}</p></div></div>}
          {c.features&&<div className="mose"><h3 className="mosh">Proposed Features</h3>
            {c.features.map((f,i)=><div key={i} style={{marginBottom:7,padding:"9px 13px",background:"var(--cream)",borderRadius:8,border:"1px solid var(--rule)",display:"flex",gap:9,alignItems:"flex-start"}}><span style={{fontFamily:"var(--l)",fontSize:9.5,background:f.priority==="P1"?"var(--plum)":f.priority==="P2"?"rgba(42,92,74,.15)":"var(--paper)",color:f.priority==="P1"?"white":f.priority==="P2"?"var(--forest)":"var(--ink-mu)",padding:"2px 7px",borderRadius:4,flexShrink:0,marginTop:2}}>{f.priority}</span><div><strong style={{fontSize:12.5,display:"block",marginBottom:1,color:"var(--ink)"}}>{f.name}</strong>{f.desc&&<p style={{fontSize:11.5,color:"var(--ink-mu)",fontWeight:300}}>{f.desc}</p>}</div></div>)}
            {c.wireframes&&<p style={{fontSize:12,color:"var(--ink-mu)",marginTop:9,fontFamily:"var(--l)",fontStyle:"italic"}}>{c.wireframes}</p>}
          </div>}
          {c.solutions&&<div className="mose"><h3 className="mosh">Recommended Solutions</h3><div className="sol"><p>{c.solutions}</p></div></div>}
          {c.metrics&&<div className="mose"><h3 className="mosh">Success Metrics</h3>
            {c.primaryMetric&&<div style={{marginBottom:14,padding:"12px 16px",background:"rgba(42,92,74,.06)",borderRadius:10,border:"1px solid rgba(42,92,74,.18)"}}><div className="ms" style={{color:"var(--forest)"}}>Primary Metric</div><div style={{fontSize:15,fontWeight:600,color:"var(--forest)"}}>{c.primaryMetric}</div></div>}
            {c.supporting&&<div style={{marginBottom:12}}><div className="ms">Supporting (Leading Indicators)</div><ul className="moli" style={{marginTop:4}}>{c.supporting.map((s,i)=><li key={i}>{s}</li>)}</ul></div>}
            {c.guardrails&&<div style={{padding:"12px 16px",background:"rgba(184,134,46,.06)",borderRadius:10,border:"1px solid rgba(184,134,46,.18)"}}><div className="ms" style={{color:"var(--gold)"}}>Guardrail Metrics</div><ul className="moli" style={{marginTop:4}}>{c.guardrails.map((g,i)=><li key={i}>{g}</li>)}</ul></div>}
          </div>}
          {item.sheetUrl&&<div className="mose"><h3 className="mosh">RCA Spreadsheet</h3><SheetEmbed url={item.sheetUrl} label="Full RCA Workbook" height={300}/></div>}
          {item.id==="multiplayer"&&<div className="mose"><h3 className="mosh">Full Case Study</h3><NotionEmbed url={item.link} embedUrl={item.embedLink} title="Improving Player Retention in a Multiplayer Game — Growth PM Case"/></div>}
          {item.id==="whatsapp"&&<div className="mose"><h3 className="mosh">Full PRD</h3><NotionEmbed url={item.link} embedUrl={item.embedLink} title="Improving WhatsApp Business App for Shopify Merchants — PRD"/></div>}
          {item.linkedinPost&&<div className="molk"><LinkCTA label="LinkedIn Post" url={item.linkedinPost} tool="LinkedIn"/></div>}
        </div>
      </div>
    </div>
  );
}

function AnalysisCard({item,onClick}){
  const ref=useInView();
  return(
    <div ref={ref} className="hgc hg-card-an iv" style={{...item.sc,aspectRatio:"16/10",borderRadius:18}} onClick={onClick}>
      <div className="hgbg">
        {item.sheetUrl?(
          <iframe src={item.sheetUrl.replace(/\/edit.*$/,"/preview")+(item.sheetUrl.includes("gid=")?"?"+item.sheetUrl.split("?")[1]:"")} style={{width:"150%",height:"150%",border:"none",transform:"scale(.68)",transformOrigin:"top left",pointerEvents:"none"}} title="Sheet" loading="lazy"/>
        ):(
          <div style={{width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}><LogoSVG tool="Notion" size={56}/></div>
        )}
      </div>
      <div className="hgsc"/>
      <div className="hgpl" style={{fontFamily:"var(--l)",fontSize:10,letterSpacing:1.5,textTransform:"uppercase"}}>{item.type}</div>
      <div className="hgcon">
        <div className="hgtags"><span className="hgtag">{item.company}</span></div>
        <div className="hgti" style={{fontSize:20,lineHeight:1.2}}>{item.title}</div>
        <div className="hgrv">
          <p className="hgde">{item.preview}</p>
          <div className="hgft">
            <div className="hgct">{item.sheetUrl?"See the Analysis":"Read the Case"} <Arrow/></div>
            <div className="hgtl">
              {item.sheetUrl&&<div className="hgto"><LogoSVG tool="GoogleSheets" size={20}/></div>}
              {item.link&&<div className="hgto"><LogoSVG tool="Notion" size={20}/></div>}
              {item.linkedinPost&&<div className="hgto"><LogoSVG tool="LinkedIn" size={20}/></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MARKET INTEL ─────────────────────────────────────────────────────────────
function IntelSection(){
  const[exp,setExp]=useState(false);
  const ref=useInView();
  return(
    <div ref={ref} className="iw iv">
      <div style={{height:200,overflow:"hidden",borderBottom:"1px solid var(--rule)",position:"relative"}}>
        <div className="eml" style={{position:"absolute"}}>Competitive landscape grid</div>
        <Img src={SS.compGridHooliv} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"top"}}/>
      </div>
      <div className="iwhd">
        <div style={{flex:1}}>
          <div style={{fontFamily:"var(--l)",fontSize:10.5,letterSpacing:2.5,color:"var(--forest)",marginBottom:9,textTransform:"uppercase",fontWeight:600}}>Market & Competitive Intelligence</div>
          <div className="iwti">HooLiv <em>Competitive Landscape</em> Analysis</div>
          <p className="iwde">India's coliving and student housing market — benchmarking 12 players across business model, funding, pricing, VAS, and technology. The company's first structured competitive intelligence exercise, used in investor presentations and internal strategy discussions.</p>
          <div className="iwst">{[["12","Companies benchmarked"],["515%","HooLiv growth rate"],["$445M","Market peak funding (2021)"],["80% vs 97%","HooLiv vs best-in-class occupancy"]].map(([n,l])=><div key={n}><div className="iwsn">{n}</div><div className="iwsl">{l}</div></div>)}</div>
          <button className="iweb" onClick={()=>setExp(!exp)}>{exp?"Show less ↑":"See the full breakdown ↓"}</button>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:7,flexShrink:0}}>
          <LinkCTA label="View Deck" url="https://docs.google.com/presentation/d/1KJW4MiMjfGnHi1_yc1tNKRWu2d3taENu/" tool="GoogleSlides"/>
          <LinkCTA label="Research Data" url="https://docs.google.com/spreadsheets/d/143GPmbdL2iMTBEMTNLzfiVo5NuaknqiU/" tool="GoogleSheets"/>
        </div>
      </div>
      {exp&&(
        <div className="iwex" style={{paddingTop:24}}>
          <div style={{marginBottom:18}}><SlidesEmbed url="https://docs.google.com/presentation/d/1KJW4MiMjfGnHi1_yc1tNKRWu2d3taENu/edit" label="Competitive Analysis Deck" height={300}/></div>
          <ul className="iwli">
            <li>BCG matrix positioning — HooLiv in high-risk/high-reward growth position alongside The Hosteller; ZoloStays in harvest mode with 50K beds across 10 metros</li>
            <li>Funding landscape: $445.6M peak in 2021, 35% decline through 2023; Stanza Living dominant at $230M total funding vs HooLiv's Pre-Series A stage</li>
            <li>Business model analysis — asset-light vs asset-heavy, lease & operate, management contract, BTS models, franchise across 12 players</li>
            <li>Pricing strategy benchmarking — ₹375/night (The Hosteller) to ₹45,000/month (premium players)</li>
            <li>VAS and differentiation analysis — Stanza Springboard, Settl Connect, Your-Space tech safety features</li>
            <li>Technology and geographic reach mapping across all 12 players</li>
          </ul>
          <div style={{marginBottom:16}}><SheetEmbed url="https://docs.google.com/spreadsheets/d/143GPmbdL2iMTBEMTNLzfiVo5NuaknqiU/edit" label="Full Research Dataset" height={280}/></div>
          <div className="stb"><div className="stbl">Strategic Implication Surfaced</div><p style={{fontSize:13,color:"var(--ink-mid)",lineHeight:1.75,fontWeight:300}}>HooLiv's 80% occupancy vs 90–97% for top players points to a retention and discovery problem, not just a supply problem. Competitors using VAS and community programming as primary retention levers consistently outperform on occupancy. That's a product problem worth solving.</p></div>
        </div>
      )}
    </div>
  );
}

// ─── ABOUT + FOOTER ───────────────────────────────────────────────────────────
function About(){
  const ref=useInView();
  return(
    <section id="about" style={{padding:"84px 64px",background:"var(--cream)"}}>
      <div ref={ref} className="abg iv">
        <ParallaxLayer speed={0.025} style={{position:"relative"}}>
          <div className="abph"><Img src={SS.vaani} style={{width:"100%",height:"100%",objectFit:"cover",objectPosition:"center top"}}/></div>
          <div className="abq"><p>"Venture into the overlooked. Question the default. Defy the status quo with the clarity to insist on what is right."</p></div>
        </ParallaxLayer>
        <div>
          <div className="ov" style={{marginBottom:11}}>About</div>
          <h2 style={{fontFamily:"var(--h)",fontSize:32,fontWeight:600,color:"var(--ink)",lineHeight:1.18,letterSpacing:-.4,marginBottom:20}}>Championing users. Catalysing systems. <em style={{fontStyle:"italic",color:"var(--plum)",fontWeight:500}}>Honing the craft.</em></h2>
          <p style={{fontSize:14,color:"var(--ink-mid)",lineHeight:1.85,fontWeight:300,marginBottom:14}}>My work is systematic, detail-obsessed, and design-considered. I bridge stakeholder alignment, prototyping, and engineering sprints — driving rigorous UAT to catch the critical, pre-release bugs that would break the experience, while shaping the strategic narrative for launch.</p>
          <div className="abs">What makes me distinctly good at this: I'm intuitive, a fast learner, a researcher, a strong communicator across both engineering and business stakeholders, and someone who brings genuine product leadership — not just coordination — to every team I work with.</div>
          <div className="abtg"><span className="abt ft">AI-First Workflow</span><span className="abt">B.Tech CSE + MBA</span><span className="abt">2× ML Research Publications</span></div>
        </div>
      </div>
    </section>
  );
}
function Footer({showToast}){
  return(
    <footer>
      <div><div className="ftn">Vaani Gupta</div><div className="fts">Designed and built with intention.</div></div>
      <div className="ftl">
        <span className="fta" onClick={()=>copyEmail(showToast)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,12 2,6"/></svg>vaanigupta01@gmail.com</span>
        <a href="#" onClick={e=>e.preventDefault()} className="fta">View Résumé</a>
        <a href="https://linkedin.com/in/vaani-gupta" target="_blank" rel="noreferrer" className="fta"><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>LinkedIn</a>
      </div>
    </footer>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function Portfolio(){
  const[activeCS,setActiveCS]=useState(null);
  const[activeAnalysis,setActiveAnalysis]=useState(null);
  const[toastMsg,showToast]=useToast();
  return(
    <div>
      <GlobalCSS/>
      <Toast msg={toastMsg}/>
      <Nav/>
      <Hero/>
      <section id="work" style={{padding:"84px 64px"}}>
        <div className="ov">Product Work</div>
        <h2 className="st">Shipped with <em>intent</em></h2>
        <div className="csg">{CASES.map(cs=><CaseCard key={cs.id} cs={cs} onClick={()=>setActiveCS(cs.id)}/>)}</div>
      </section>
      <section style={{padding:"72px 64px",background:"var(--cream)"}}>
        <div className="ov">More Shipped Work</div>
        <h2 className="st">Also <em>live</em></h2>
        <div className="mg">{MORE.map((card,i)=><MoreCard key={i} card={card}/>)}</div>
        <RoomAllocPRDCard/>
        <WeddingCard/>
        <KitchenCard/>
      </section>
      <section id="thinking" style={{padding:"84px 64px"}}>
        <div className="ov">PM Thinking & Analysis</div>
        <h2 className="st">Beyond <em>execution</em></h2>
        <p style={{fontSize:14,color:"var(--ink-mu)",maxWidth:500,marginBottom:36,fontWeight:300,lineHeight:1.75}}>Structured exercises in product diagnosis, root cause analysis, and strategic recommendation — applied to real-world product scenarios.</p>
        <div className="ag">{ANALYSES.map(item=><AnalysisCard key={item.id} item={item} onClick={()=>setActiveAnalysis(item)}/>)}</div>
      </section>
      <section style={{padding:"64px 64px",background:"var(--cream)"}}><IntelSection/></section>
      <About/>
      <Footer showToast={showToast}/>
      {activeCS&&<CaseModal id={activeCS} onClose={()=>setActiveCS(null)}/>}
      {activeAnalysis&&<AnalysisModal item={activeAnalysis} onClose={()=>setActiveAnalysis(null)}/>}
    </div>
  );
}
