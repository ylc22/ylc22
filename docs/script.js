const revealObserver=new IntersectionObserver((entries)=>{entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')})},{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const timeline=document.querySelector('.timeline-shell');const progress=document.getElementById('timelineProgress');function updateTimeline(){if(!timeline||!progress)return;const r=timeline.getBoundingClientRect();const vh=window.innerHeight;const total=r.height+vh*.35;const traveled=Math.min(Math.max(vh*.65-r.top,0),total);progress.style.height=`${Math.min(100,traveled/total*100)}%`}window.addEventListener('scroll',updateTimeline,{passive:true});updateTimeline();

const cities=[
{name:'Hong Kong',years:'Home / early life',coords:[22.3193,114.1694],zoom:10,weight:1.0},
{name:'Seattle',years:'University of Washington · 2020–2024',coords:[47.6062,-122.3321],zoom:10,weight:.95},
{name:'New Haven',years:'Yale University · 2024–2026',coords:[41.3083,-72.9279],zoom:11,weight:.9},
{name:'Washington, DC',years:'Bioinformatics & AI · 2026',coords:[38.9072,-77.0369],zoom:10,weight:.85}
];

const map=L.map('mapCanvas',{zoomControl:false,worldCopyJump:true,minZoom:2}).setView([35,-35],2);L.control.zoom({position:'bottomright'}).addTo(map);
const satellite=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap contributors'}).addTo(map);
const markers=[];cities.forEach((c,i)=>{const marker=L.circleMarker(c.coords,{radius:8,color:'#65d6ff',weight:2,fillColor:'#4da3ff',fillOpacity:.9}).addTo(map).bindPopup(`<strong>${c.name}</strong><br>${c.years}`);markers.push(marker)});
const route=L.polyline(cities.map(c=>c.coords),{color:'#65d6ff',weight:2,opacity:.75,dashArray:'7,10'}).addTo(map);
const heat=L.heatLayer(cities.map(c=>[...c.coords,c.weight]),{radius:42,blur:30,maxZoom:5,gradient:{0.2:'#0d3154',0.45:'#146ea8',0.7:'#32b7d8',1:'#a6f4ff'}});
const cityList=document.getElementById('cityList');cities.forEach((c,i)=>{const b=document.createElement('button');b.className='city-btn';b.innerHTML=`<span>${c.name}</span><small>${c.years}</small>`;b.addEventListener('click',()=>{map.flyTo(c.coords,c.zoom,{duration:1.6});markers[i].openPopup()});cityList.appendChild(b)});
document.querySelectorAll('.map-mode').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.map-mode').forEach(x=>x.classList.remove('active'));btn.classList.add('active');if(btn.dataset.mode==='heat'){if(map.hasLayer(route))map.removeLayer(route);markers.forEach(m=>map.removeLayer(m));heat.addTo(map);map.flyTo([28,-20],2,{duration:1.2})}else{if(map.hasLayer(heat))map.removeLayer(heat);markers.forEach(m=>m.addTo(map));route.addTo(map);map.flyTo([35,-35],2,{duration:1.2})}}));

const satLabels=document.querySelectorAll('.satellite');satLabels.forEach((el,i)=>{el.addEventListener('mouseenter',()=>el.style.boxShadow='0 0 30px rgba(101,214,255,.45)');el.addEventListener('mouseleave',()=>el.style.boxShadow='0 8px 30px rgba(0,0,0,.25)')});