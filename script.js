const header=document.querySelector("[data-header]");
const menuToggle=document.querySelector("[data-menu-toggle]");
const nav=document.querySelector("[data-nav]");
const navLinks=[...nav.querySelectorAll("a[href^='#']")];
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");

function setMenu(open){menuToggle.setAttribute("aria-expanded",String(open));nav.classList.toggle("is-open",open);document.body.classList.toggle("menu-open",open)}
menuToggle.addEventListener("click",()=>setMenu(menuToggle.getAttribute("aria-expanded")!=="true"));
navLinks.forEach(link=>link.addEventListener("click",()=>setMenu(false)));
document.addEventListener("keydown",event=>{if(event.key==="Escape")setMenu(false)});

function syncHeader(){header.classList.toggle("is-scrolled",window.scrollY>24)}
syncHeader();window.addEventListener("scroll",syncHeader,{passive:true});

const revealItems=document.querySelectorAll(".reveal");
if(reducedMotion.matches||!("IntersectionObserver" in window)){revealItems.forEach(item=>item.classList.add("is-visible"))}else{
  const observer=new IntersectionObserver((entries,obs)=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");obs.unobserve(entry.target)}}),{rootMargin:"0px 0px -10%",threshold:.1});
  revealItems.forEach(item=>observer.observe(item));
}

const sections=navLinks.map(link=>document.querySelector(link.getAttribute("href"))).filter(Boolean);
if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>{const current=entries.filter(entry=>entry.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!current)return;navLinks.forEach(link=>link.classList.toggle("is-active",link.getAttribute("href")===`#${current.target.id}`))},{rootMargin:"-20% 0px -60%",threshold:[.01,.2]});sections.forEach(section=>observer.observe(section))}

const trail=document.querySelector("[data-trail]");
const steps=[...document.querySelectorAll(".trail-step")];
function updateTrail(){if(!trail)return;const rect=trail.getBoundingClientRect();const progress=Math.min(1,Math.max(0,(innerHeight*.55-rect.top)/(rect.height+innerHeight*.1)));trail.style.setProperty("--trail-progress",`${progress*100}%`);steps.forEach(step=>step.classList.toggle("is-passed",step.getBoundingClientRect().top<innerHeight*.62))}
updateTrail();window.addEventListener("scroll",updateTrail,{passive:true});window.addEventListener("resize",updateTrail);

const copyButton=document.querySelector("[data-copy]");
const copyStatus=document.querySelector("[data-copy-status]");
const copyLabel=document.querySelector("[data-copy-label]");
async function copyText(text){if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);return}const area=document.createElement("textarea");area.value=text;area.setAttribute("readonly","");area.style.position="fixed";area.style.opacity="0";document.body.appendChild(area);area.select();const copied=document.execCommand("copy");area.remove();if(!copied)throw new Error("copy failed")}
copyButton.addEventListener("click",async()=>{try{await copyText(copyButton.dataset.copy);copyLabel.textContent="已复制";copyStatus.textContent=`微信号 ${copyButton.dataset.copy} 已复制到剪贴板。`}catch{copyStatus.textContent=`请手动复制微信号 ${copyButton.dataset.copy}。`}setTimeout(()=>{copyLabel.textContent="复制微信号";copyStatus.textContent=""},2600)});
document.querySelector("[data-year]").textContent=new Date().getFullYear();
