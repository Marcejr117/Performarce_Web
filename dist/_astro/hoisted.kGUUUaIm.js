import"./hoisted.kzHY-LeB.js";const e=document.getElementById(".imagen"),a=[{url:"/assets/H150-0226.jpg"},{url:"/assets/H350-0432.jpg"},{url:"/assets/H360-0231b.jpg"}];let t=0;function n(){t=(t+1)%a.length;const s=a[t];e.classList.add("animate-fade-in-right"),e.style.backgroundImage=`url(${s.url})`,setTimeout(()=>{e.classList.remove("animate-fade-in-right")},1e3)}setInterval(n,5e3);
