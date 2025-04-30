function c(e,t){n();const a=document.createElement("div");a.id="textcraft-overlay",a.className="textcraft-overlay",a.innerHTML=`
      <div class="textcraft-overlay-header">
        <div class="textcraft-logo">
          <span class="textcraft-icon">✨</span>
          <span class="textcraft-title">TextCraft AI</span>
        </div>
        <button class="textcraft-close-btn">×</button>
      </div>
      <div class="textcraft-overlay-content">
        <div class="textcraft-text-container">
          <div class="textcraft-text-label">Original Text:</div>
          <div class="textcraft-text textcraft-original">${i(e)}</div>
        </div>
        <div class="textcraft-text-container">
          <div class="textcraft-text-label">Transformed Text:</div>
          <div class="textcraft-text textcraft-transformed">${i(t)}</div>
        </div>
        <div class="textcraft-actions">
          <button class="textcraft-btn textcraft-copy-btn">Copy to Clipboard</button>
          <button class="textcraft-btn textcraft-replace-btn">Replace Original</button>
        </div>
      </div>
    `,document.body.appendChild(a),a.querySelector(".textcraft-close-btn").addEventListener("click",n),a.querySelector(".textcraft-copy-btn").addEventListener("click",()=>{navigator.clipboard.writeText(t).then(()=>{alert("Copied to clipboard!")})}),a.querySelector(".textcraft-replace-btn").addEventListener("click",()=>{d(t),n()}),a.addEventListener("click",r=>{r.stopPropagation()}),document.addEventListener("click",s)}function s(e){const t=document.getElementById("textcraft-overlay");t&&!t.contains(e.target)&&n()}function n(){const e=document.getElementById("textcraft-overlay");e&&(e.remove(),document.removeEventListener("click",s))}function d(e){const t=window.getSelection();if(t.rangeCount>0){const a=t.getRangeAt(0);a.deleteContents(),a.insertNode(document.createTextNode(e))}}function i(e){const t=document.createElement("div");return t.textContent=e,t.innerHTML}async function f(e,t){try{const r=(await chrome.runtime.sendMessage({action:"getToken"})).token;if(!r){alert("Please log in to TextCraft AI in the extension popup");return}c(e,"Transforming text...");const o=await fetch("http://localhost:5000/api/transform/text",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({text:e,type:t,audience:"general"})});if(!o.ok)throw new Error(`API request failed with status ${o.status}`);const l=await o.json();c(e,l.data.transformedText)}catch(a){console.error("TextCraft AI transformation error:",a);let r="";switch(t){case"formal":r=e.replace(/can't/gi,"cannot").replace(/won't/gi,"will not").replace(/hey/gi,"Hello").replace(/boss/gi,"Sir/Madam").replace(/lol/gi,"").replace(/hi/gi,"Hello");break;case"casual":r=e.replace(/Hello/gi,"Hey").replace(/Good morning/gi,"Morning").replace(/I regret to inform you/gi,"Just letting you know");break;case"joke":r=e+" 😂 (Imagine a funny version here)";break;case"shakespearean":r="Hark! "+e+" (but in a more Shakespeare-y way, forsooth!)";break;case"emoji":r=e+" 👍 ✨ 🙌";break;case"grammar":r=e.replace(/cant/g,"can't").replace(/wont/g,"won't").replace(/im/g,"I'm");break;case"concise":r=e.replace(/due to the fact that/gi,"because").replace(/in order to/gi,"to");break;default:r=e}c(e,r)}}chrome.runtime.onMessage.addListener((e,t,a)=>{e.action==="transformText"&&(f(e.text,e.transformationType),a({success:!0}))});
