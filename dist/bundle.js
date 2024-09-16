(()=>{"use strict";const e=new class{audioContext;tracks=[];slowAverage=39;fx1a=null;fx1b=null;loadedFiles=0;constructor(){this.audioContext=new AudioContext}async initAudio(e){if(16!==e.length)throw new Error("Expected 16 audio files.");const t=e.map((e=>this.loadAudioFile(e)));(await Promise.all(t)).forEach((e=>{const t=this.audioContext.createBufferSource(),n=this.audioContext.createGain();t.buffer=e,n.gain.value=0,t.connect(n);const o=this.audioContext.createAnalyser();o.fftSize=2048,n.connect(o),this.fx1a=this.audioContext.createBiquadFilter(),this.fx1a.type="highpass",this.fx1a.frequency.value=1e3,this.fx1a.gain.value=0,n.connect(this.fx1a),this.fx1b=this.audioContext.createDelay(),this.fx1b.delayTime.value=0,this.fx1a.connect(this.fx1b),n.connect(this.audioContext.destination),this.tracks.push({sourceNode:t,gainNode:n,analyserNode:o}),t.loop=!0,t.start(0)}))}async loadAudioFile(e){const t=await fetch(e),n=await t.arrayBuffer();return this.loadedFiles++,console.log(`Loaded ${this.loadedFiles} files.`),this.audioContext.decodeAudioData(n)}getFrequencyColor(e){if(0===this.tracks[e].gainNode.gain.value)return`hsl(${this.slowAverage+e}, 100%, 50%)`;const t=this.tracks[e].analyserNode,n=new Uint8Array(t.frequencyBinCount);t.getByteFrequencyData(n);const o=Math.max(...n),s=n.indexOf(o);return this.updateSlowAverage(s),`hsl(${this.slowAverage+e+10*s%240}, 100%, 50%)`}updateSlowAverage(e){this.slowAverage=this.slowAverage+.001*e%240}enableTrack(e,t){if(-1!=e){if(e>=this.tracks.length)throw new Error(`Track ${e} does not exist.`);this.tracks[e].gainNode.gain.value=t?.5:0}}muteAll(){for(let e=0;e<this.tracks.length;e++)this.enableTrack(e,!1)}fx1(e,t){if(0!=e&&0!=t&&Math.random()>.1)return;if(!this.fx1a||!this.fx1b)return;console.log("fx1 called with x:",e,"y:",t),console.log("AudioContext state:",this.audioContext.state),console.log("Current time:",this.audioContext.currentTime),console.log("Applying gain:",25*e,"to fx1a");const n=Math.floor(10*e);this.fx1a.gain.setValueAtTime(n,this.audioContext.currentTime),this.fx1b.delayTime.setValueAtTime(t,this.audioContext.currentTime),console.log(this.fx1a,this.fx1b)}},t=16;var n=!1,o=null,s={width:0,height:0};function i(e){if("undefined"!=typeof TouchEvent&&e instanceof TouchEvent&&(e.touches||e.changedTouches)){const t=e.touches.length>0?e.touches:e.changedTouches;return{x:t[0].clientX,y:t[0].clientY}}if(e instanceof MouseEvent)return{x:e.clientX,y:e.clientY};throw new Error("Unsupported event type")}function a(e,t,n,o){const s=document.createElement(e);return s.classList.add(t),s.id=n,o.appendChild(s),s}function r(e){document.querySelectorAll(".ball").forEach((t=>{t.style.display=e?"block":"none"}))}function c(e){if(!e)return-1;const t=e.split("square-");return t.length<2?-1:parseInt(t[1])}function l(e){if(e)a("div","spinner","spinner",document.body),o=a("progress","progress","progress",document.body),setTimeout(d,100);else{const e=document.getElementById("spinner");e?.remove(),o?.remove()}}function d(){if(!o)return;const t=e.loadedFiles/16;console.log("Progress:",t),o.setAttribute("value",t.toString()),1!=t&&setTimeout(d,100)}function u(){const o=document.getElementById("start-button"),d=document.getElementById("info-1"),u=document.getElementById("info-2");o?.addEventListener("click",(async()=>{o.remove(),d?.remove(),u?.remove(),l(!0),await async function(){n||(await e.initAudio(["stems/pack2/4-floor-badam.wav","stems/pack2/groovy-drums.wav","stems/pack2/drums-pstju.wav","stems/pack2/drums-tikitiki.wav","stems/pack2/drums-with-laser.wav","stems/pack2/fat-bass.wav","stems/pack2/bass.wav","stems/pack2/house-bass.wav","stems/pack2/groovy-synth.wav","stems/pack2/pluck-synth.wav","stems/pack2/house-chords.wav","stems/pack2/spacy-chords.wav","stems/pack2/surr.wav","stems/pack2/hehehe.wav","stems/pack2/thats-all.wav","stems/pack2/all-that-i-can-do.wav"]),n=!0)}(),l(!1),function(){const e=a("div","matrix","matrix",document.body);for(let n=0;n<t;n++)a("div","square",`square-${n}`,e);const n=a("div","ballhome","ballhome",document.body);for(let e=0;e<4;e++){const t=a("div","ball",`ball-${e}`,n);t.draggable=!0,t.innerText="🌈"}}(),function(){const t=document.querySelectorAll(".ball");var n=!1;t.forEach((t=>{function n(e){e.preventDefault();const n=t.parentElement;t.setAttribute("origin-square",n.id),t.setAttribute("clicked","true"),console.log(`[${e.type}] Lifted`,t.id,"from",n.id)}function o(e){if(e.preventDefault(),"true"!==t.getAttribute("clicked"))return;const n=i(e);t.style.left=n.x-50+"px",t.style.top=n.y-50+"px"}function s(n){if("true"!==t.getAttribute("clicked"))return;const o=i(n),s=t.getAttribute("origin-square");e.enableTrack(c(s),!1),t.setAttribute("clicked","false"),r(!1);const a=document.elementFromPoint(o.x,o.y);r(!0),((t,n)=>{console.log("Dropped:",t.id,n.id),e.enableTrack(c(n.id),!0),n.appendChild(t)})(t,a),console.log(`[${n.type}] Dropped`,t.id,"from",s)}t.addEventListener("mousedown",n),t.addEventListener("mousemove",o),t.addEventListener("mouseup",s),t.addEventListener("touchstart",n),t.addEventListener("touchmove",o),t.addEventListener("touchend",s)})),document.addEventListener("mouseup",(e=>{n=!1})),document.addEventListener("mousedown",(e=>{n=!0})),document.addEventListener("mousemove",(e=>{if(!n)return;const o=i(e);var s=t[0];for(let e=0;e<t.length;e++)"true"===t[e].getAttribute("clicked")&&(s=t[e]);s&&0!=function(e,t,n){const o=e.getBoundingClientRect(),s=o.left+o.width/2,i=o.top+o.height/2;return Math.sqrt((s-t)**2+(i-n)**2)}(s,e.clientX,e.clientY)&&(s.style.left=o.x-50+"px",s.style.top=o.y-50+"px")})),s.width=window.innerWidth,s.height=window.innerHeight,window.addEventListener("resize",(()=>{const e=s.height,n=s.width;s.width=window.innerWidth,s.height=window.innerHeight,t.forEach((t=>{t.style.left=parseFloat(t.style.left)/n*s.width+"px",t.style.top=parseFloat(t.style.top)/e*s.height+"px"}))}))}(),h()}))}function h(){if(requestAnimationFrame(h),n)for(let n=0;n<t;n++){const t=document.getElementById(`square-${n}`);t&&(t.style.backgroundColor=e.getFrequencyColor(n))}}document.addEventListener("DOMContentLoaded",(()=>{u()}))})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Li9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9zcXVhcmVzLy4vc3JjL2F1ZGlvLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF1ZGlvQ29udHJvbGxlciB9IGZyb20gXCIuL2F1ZGlvXCI7XG5cbmNvbnN0IGFjID0gbmV3IEF1ZGlvQ29udHJvbGxlcigpO1xuY29uc3QgblNxdWFyZXMgPSAxNjtcbmNvbnN0IG5CYWxscyA9IDQ7XG52YXIgaXNJbml0aWF0ZWQgPSBmYWxzZTtcbnZhciBmeEVuYWJsZSA9IGZhbHNlO1xudmFyIHByb2dyZXNzQmFyOiBIVE1MRWxlbWVudCB8IG51bGwgPSBudWxsO1xudmFyIHdpbmRvd1NpemUgPSB7IHdpZHRoOiAwLCBoZWlnaHQ6IDAgfTtcblxuZnVuY3Rpb24gY3JlYXRlVUlFbGVtZW50cygpIHtcbiAgLy8gQ3JlYXRlIEZYIHVpXG4gIGlmIChmeEVuYWJsZSkge1xuICAgIGNvbnN0IGZ4ZGl2ID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZ4XCIsIFwiZnhcIiwgZG9jdW1lbnQuYm9keSk7XG4gICAgZnhkaXYuc3R5bGUuZGlzcGxheSA9IGZ4RW5hYmxlID8gXCJibG9ja1wiIDogXCJub25lXCI7XG4gICAgY29uc3QgZngxID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZ4MVwiLCBcImZ4MVwiLCBmeGRpdik7XG4gICAgZngxLmlubmVyVGV4dCA9IFwi8J+MilwiO1xuICAgIGNvbnN0IGZ4c3BhY2VyID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImZ4c3BhY2VyXCIsIFwiZnhzcGFjZXJcIiwgZnhkaXYpO1xuICAgIGNvbnN0IGZ4MiA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJmeDJcIiwgXCJmeDJcIiwgZnhkaXYpO1xuICAgIGZ4Mi5pbm5lclRleHQgPSBcIvCflaVcIjtcbiAgfVxuXG4gIGNvbnN0IG1hdHJpeCA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJtYXRyaXhcIiwgXCJtYXRyaXhcIiwgZG9jdW1lbnQuYm9keSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgblNxdWFyZXM7IGkrKykge1xuICAgIGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJzcXVhcmVcIiwgYHNxdWFyZS0ke2l9YCwgbWF0cml4KTtcbiAgfVxuXG4gIGNvbnN0IGJhbGxIb21lID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImJhbGxob21lXCIsIFwiYmFsbGhvbWVcIiwgZG9jdW1lbnQuYm9keSk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbkJhbGxzOyBpKyspIHtcbiAgICBjb25zdCBiYWxsID0gY3JlYXRlRWxlbWVudChcImRpdlwiLCBcImJhbGxcIiwgYGJhbGwtJHtpfWAsIGJhbGxIb21lKTtcbiAgICBiYWxsLmRyYWdnYWJsZSA9IHRydWU7XG4gICAgYmFsbC5pbm5lclRleHQgPSBg8J+MiGA7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdFVJTG9naWMoKSB7XG4gIGNvbnN0IGJhbGxzOiBOb2RlTGlzdE9mPEhUTUxFbGVtZW50PiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmFsbFwiKTtcbiAgdmFyIG1vdXNlRG93biA9IGZhbHNlO1xuICAvLyBEcm9wcyBhIGJhbGwgaW50byBhIHRhcmdldCBlbGVtZW50IGFuZCBtdXRlcyB0aGUgdHJhY2sgdGhlIGJhbGwgY2FtZSBmcm9tXG4gIGNvbnN0IGRyb3BCYWxsID0gKGJhbGw6IEhUTUxFbGVtZW50LCB0YXJnZXQ6IEhUTUxFbGVtZW50KSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJEcm9wcGVkOlwiLCBiYWxsLmlkLCB0YXJnZXQuaWQpO1xuICAgIGFjLmVuYWJsZVRyYWNrKGdldFNxdWFyZUlkKHRhcmdldC5pZCksIHRydWUpO1xuICAgIHRhcmdldC5hcHBlbmRDaGlsZChiYWxsKTtcbiAgfTtcblxuICBiYWxscy5mb3JFYWNoKChiYWxsKSA9PiB7XG4gICAgLy8gQ29tbW9uIGZ1bmN0aW9uIGZvciBzdGFydGluZyB0aGUgZHJhZ1xuICAgIGZ1bmN0aW9uIHN0YXJ0RHJhZyhlOiBNb3VzZUV2ZW50IHwgVG91Y2hFdmVudCkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgY29uc3Qgb3JpZ2luU3F1YXJlID0gYmFsbC5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgYmFsbC5zZXRBdHRyaWJ1dGUoXCJvcmlnaW4tc3F1YXJlXCIsIG9yaWdpblNxdWFyZS5pZCk7XG4gICAgICBiYWxsLnNldEF0dHJpYnV0ZShcImNsaWNrZWRcIiwgXCJ0cnVlXCIpO1xuICAgICAgY29uc29sZS5sb2coYFske2UudHlwZX1dIExpZnRlZGAsIGJhbGwuaWQsIFwiZnJvbVwiLCBvcmlnaW5TcXVhcmUuaWQpO1xuICAgIH1cblxuICAgIC8vIENvbW1vbiBmdW5jdGlvbiBmb3IgZHJhZ2dpbmdcbiAgICBmdW5jdGlvbiBkb0RyYWcoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmIChiYWxsLmdldEF0dHJpYnV0ZShcImNsaWNrZWRcIikgIT09IFwidHJ1ZVwiKSByZXR1cm47XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGdldFBvc2l0aW9uRnJvbUV2ZW50KGUpO1xuICAgICAgYmFsbC5zdHlsZS5sZWZ0ID0gYCR7cG9zaXRpb24ueCAtIDUwfXB4YDtcbiAgICAgIGJhbGwuc3R5bGUudG9wID0gYCR7cG9zaXRpb24ueSAtIDUwfXB4YDtcbiAgICAgIC8vIGNvbnNvbGUubG9nKGBbJHtlLnR5cGV9XSBNb3ZpbmcvRHJhZ2dpbmdgLCBiYWxsLmlkKTtcbiAgICB9XG5cbiAgICAvLyBDb21tb24gZnVuY3Rpb24gZm9yIGVuZGluZyB0aGUgZHJhZ1xuICAgIGZ1bmN0aW9uIGVuZERyYWcoZTogTW91c2VFdmVudCB8IFRvdWNoRXZlbnQpIHtcbiAgICAgIGlmIChiYWxsLmdldEF0dHJpYnV0ZShcImNsaWNrZWRcIikgIT09IFwidHJ1ZVwiKSByZXR1cm47XG4gICAgICBjb25zdCBwb3NpdGlvbiA9IGdldFBvc2l0aW9uRnJvbUV2ZW50KGUpO1xuICAgICAgY29uc3Qgb3JpZ2luU3F1YXJlSWQgPSBiYWxsLmdldEF0dHJpYnV0ZShcIm9yaWdpbi1zcXVhcmVcIik7XG4gICAgICBhYy5lbmFibGVUcmFjayhnZXRTcXVhcmVJZChvcmlnaW5TcXVhcmVJZCksIGZhbHNlKTtcbiAgICAgIGJhbGwuc2V0QXR0cmlidXRlKFwiY2xpY2tlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgc2hvd0JhbGxzKGZhbHNlKTtcbiAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KFxuICAgICAgICBwb3NpdGlvbi54LFxuICAgICAgICBwb3NpdGlvbi55XG4gICAgICApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgc2hvd0JhbGxzKHRydWUpO1xuICAgICAgZHJvcEJhbGwoYmFsbCwgdGFyZ2V0RWxlbWVudCk7XG4gICAgICBjb25zb2xlLmxvZyhgWyR7ZS50eXBlfV0gRHJvcHBlZGAsIGJhbGwuaWQsIFwiZnJvbVwiLCBvcmlnaW5TcXVhcmVJZCk7XG4gICAgfVxuXG4gICAgLy8gQWRkIGV2ZW50IGxpc3RlbmVyc1xuICAgIGJhbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlZG93blwiLCBzdGFydERyYWcpO1xuICAgIGJhbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCBkb0RyYWcpO1xuICAgIGJhbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgZW5kRHJhZyk7XG4gICAgYmFsbC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCBzdGFydERyYWcpO1xuICAgIGJhbGwuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNobW92ZVwiLCBkb0RyYWcpO1xuICAgIGJhbGwuYWRkRXZlbnRMaXN0ZW5lcihcInRvdWNoZW5kXCIsIGVuZERyYWcpO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNldXBcIiwgKGUpID0+IHtcbiAgICBtb3VzZURvd24gPSBmYWxzZTtcbiAgfSk7XG4gIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZWRvd25cIiwgKGUpID0+IHtcbiAgICBtb3VzZURvd24gPSB0cnVlO1xuICB9KTtcbiAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZSkgPT4ge1xuICAgIGlmICghbW91c2VEb3duKSByZXR1cm47XG4gICAgY29uc3QgcG9zaXRpb24gPSBnZXRQb3NpdGlvbkZyb21FdmVudChlKTtcbiAgICB2YXIgY2xpY2tlZEJhbGw6IEhUTUxFbGVtZW50IHwgbnVsbCA9IGJhbGxzWzBdO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBiYWxscy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGJhbGxzW2ldLmdldEF0dHJpYnV0ZShcImNsaWNrZWRcIikgPT09IFwidHJ1ZVwiKXtcbiAgICAgICAgY2xpY2tlZEJhbGwgPSBiYWxsc1tpXTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCFjbGlja2VkQmFsbCkgcmV0dXJuO1xuICAgIGlmIChkaXN0YW5jZUZyb21CYWxsKGNsaWNrZWRCYWxsLCBlLmNsaWVudFgsIGUuY2xpZW50WSkgPT0gMCkgcmV0dXJuO1xuICAgIGNsaWNrZWRCYWxsLnN0eWxlLmxlZnQgPSBgJHtwb3NpdGlvbi54IC0gNTB9cHhgO1xuICAgIGNsaWNrZWRCYWxsLnN0eWxlLnRvcCA9IGAke3Bvc2l0aW9uLnkgLSA1MH1weGA7XG4gIH0pO1xuXG4gIHdpbmRvd1NpemUud2lkdGggPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgd2luZG93U2l6ZS5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwicmVzaXplXCIsICgpID0+IHtcbiAgICBjb25zdCBvbGRIZWlnaHQgPSB3aW5kb3dTaXplLmhlaWdodDtcbiAgICBjb25zdCBvbGRXaWR0aCA9IHdpbmRvd1NpemUud2lkdGg7XG4gICAgd2luZG93U2l6ZS53aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgIHdpbmRvd1NpemUuaGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgIGJhbGxzLmZvckVhY2goKGJhbGwpID0+IHtcbiAgICAgIGJhbGwuc3R5bGUubGVmdCA9IGAkeyhwYXJzZUZsb2F0KGJhbGwuc3R5bGUubGVmdCkgLyBvbGRXaWR0aCkgKiB3aW5kb3dTaXplLndpZHRofXB4YDtcbiAgICAgIGJhbGwuc3R5bGUudG9wID0gYCR7KHBhcnNlRmxvYXQoYmFsbC5zdHlsZS50b3ApIC8gb2xkSGVpZ2h0KSAqIHdpbmRvd1NpemUuaGVpZ2h0fXB4YDtcbiAgICB9KTtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc3RhbmNlRnJvbUJhbGwoYmFsbDogSFRNTEVsZW1lbnQsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gIGNvbnN0IHJlY3QgPSBiYWxsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICBjb25zdCBiYWxsWCA9IHJlY3QubGVmdCArIHJlY3Qud2lkdGggLyAyO1xuICBjb25zdCBiYWxsWSA9IHJlY3QudG9wICsgcmVjdC5oZWlnaHQgLyAyO1xuICByZXR1cm4gTWF0aC5zcXJ0KChiYWxsWCAtIHgpICoqIDIgKyAoYmFsbFkgLSB5KSAqKiAyKTtcbn1cblxuLy8gSGVscGVyIHRvIGV4dHJhY3QgcG9zaXRpb24gZnJvbSBldmVudFxuZnVuY3Rpb24gZ2V0UG9zaXRpb25Gcm9tRXZlbnQoZTogYW55KSB7XG4gIGlmIChcbiAgICB0eXBlb2YgVG91Y2hFdmVudCAhPT0gXCJ1bmRlZmluZWRcIiAmJlxuICAgIGUgaW5zdGFuY2VvZiBUb3VjaEV2ZW50ICYmXG4gICAgKGUudG91Y2hlcyB8fCBlLmNoYW5nZWRUb3VjaGVzKVxuICApIHtcbiAgICBjb25zdCB0b3VjaGVzID0gZS50b3VjaGVzLmxlbmd0aCA+IDAgPyBlLnRvdWNoZXMgOiBlLmNoYW5nZWRUb3VjaGVzO1xuICAgIHJldHVybiB7IHg6IHRvdWNoZXNbMF0uY2xpZW50WCwgeTogdG91Y2hlc1swXS5jbGllbnRZIH07XG4gIH0gZWxzZSBpZiAoZSBpbnN0YW5jZW9mIE1vdXNlRXZlbnQpIHtcbiAgICByZXR1cm4geyB4OiBlLmNsaWVudFgsIHk6IGUuY2xpZW50WSB9O1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGV2ZW50IHR5cGVcIik7XG4gIH1cbn1cblxuZnVuY3Rpb24gaW5pdEZYVUkoKSB7XG4gIGlmICghZnhFbmFibGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZngxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmeDFcIik7XG4gIGlmICghZngxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZngxIG5vdCBmb3VuZFwiKTtcbiAgfVxuICBmeDEuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgY29uc3QgZngyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmeDJcIik7XG4gIGZ4MT8uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCAoZTogRHJhZ0V2ZW50KSA9PiB7XG4gICAgY29uc3QgeyB4LCB5IH0gPSBub3JtYWxpemVkWFkoZS54LCBlLnkpO1xuICAgIGFjLmZ4MSh4LCB5KTtcbiAgICBjb25zb2xlLmxvZyhcImRyYWdzdGFydFwiKTtcbiAgfSk7XG4gIGZ4MT8uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdcIiwgKGU6IERyYWdFdmVudCkgPT4ge1xuICAgIGNvbnN0IHsgeCwgeSB9ID0gbm9ybWFsaXplZFhZKGUueCwgZS55KTtcbiAgICBhYy5meDEoeCwgeSk7XG4gICAgY29uc29sZS5sb2coXCJkcmFnbW92ZVwiKTtcbiAgfSk7XG4gIGZ4MT8uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbmRcIiwgKGU6IERyYWdFdmVudCkgPT4ge1xuICAgIGFjLmZ4MSgwLCAwKTtcbiAgICBjb25zb2xlLmxvZyhcImRyYWdlbmRcIik7XG4gIH0pO1xuICBmeDE/LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgaWYgKGUudG91Y2hlcy5sZW5ndGggIT0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcbiAgICBjb25zdCB7IHgsIHkgfSA9IG5vcm1hbGl6ZWRYWSh0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZKTtcbiAgICBhYy5meDEoeCwgeSk7XG4gICAgY29uc29sZS5sb2coXCJ0b3VjaHN0YXJ0XCIpO1xuICB9KTtcbiAgZngxPy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgaWYgKGUudG91Y2hlcy5sZW5ndGggIT0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcbiAgICBjb25zdCB7IHgsIHkgfSA9IG5vcm1hbGl6ZWRYWSh0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZKTtcbiAgICBhYy5meDEoeCwgeSk7XG4gICAgY29uc29sZS5sb2coXCJ0b3VjaG1vdmVcIik7XG4gIH0pO1xuICBmeDE/LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoICE9IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYWMuZngxKDAsIDApO1xuICAgIGNvbnNvbGUubG9nKFwidG91Y2hlbmRcIik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KFxuICB0YWc6IHN0cmluZyxcbiAgY2xzOiBzdHJpbmcsXG4gIGlkOiBzdHJpbmcsXG4gIHBhcmVudDogSFRNTEVsZW1lbnRcbikge1xuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgZWxlbWVudC5pZCA9IGlkO1xuICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBzaG93QmFsbHMoc2hvdzogYm9vbGVhbikge1xuICBjb25zdCBiYWxsczogTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJhbGxcIik7XG4gIGJhbGxzLmZvckVhY2goKGJhbGwpID0+IHtcbiAgICBiYWxsLnN0eWxlLmRpc3BsYXkgPSBzaG93ID8gXCJibG9ja1wiIDogXCJub25lXCI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRTcXVhcmVJZChpZDogc3RyaW5nIHwgbnVsbCk6IG51bWJlciB7XG4gIGlmICghaWQpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgY29uc3QgcGFydHMgPSBpZC5zcGxpdChcInNxdWFyZS1cIik7XG4gIGlmIChwYXJ0cy5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHJldHVybiBwYXJzZUludChwYXJ0c1sxXSk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZWRYWSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICBjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICBjb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIHJldHVybiB7IHg6IHggLyB3aWR0aCwgeTogeSAvIGhlaWdodCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0QXVkaW8oKSB7XG4gIGlmIChpc0luaXRpYXRlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBwYWNrMSA9IFtcbiAgICBcInN0ZW1zL3BhY2sxLzQtb24tZmxvb3Iud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMS9kbmItMTI0LndhdlwiLFxuICAgIFwic3RlbXMvcGFjazEvZHJ1bXMud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMS9oYXRzLndhdlwiLFxuICAgIFwic3RlbXMvcGFjazEva2ljay1oYXQud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMS90b21zLndhdlwiLFxuICAgIFwic3RlbXMvcGFjazEvc21vb3RoLWNob3Jkcy53YXZcIixcbiAgICBcInN0ZW1zL3BhY2sxL2Jhc3Mud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMS9ienp6LndhdlwiLFxuICAgIFwic3RlbXMvcGFjazEvZ3VpdGFyLndhdlwiLFxuICAgIFwic3RlbXMvcGFjazEvZG5iLTEyNC53YXZcIixcbiAgICBcInN0ZW1zL3BhY2sxL2RydW1zLndhdlwiLFxuICAgIFwic3RlbXMvcGFjazEvaGF0cy53YXZcIixcbiAgICBcInN0ZW1zL3BhY2sxL2tlZXAtb24ud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMS93aGF0LXUtZG9pbi10by1tZS53YXZcIixcbiAgICBcInN0ZW1zL3BhY2sxL2V4dGFjeS53YXZcIixcbiAgXTtcblxuICBjb25zdCBwYWNrMiA9IFtcbiAgICBcInN0ZW1zL3BhY2syLzQtZmxvb3ItYmFkYW0ud2F2XCIsXG4gICAgLy8gXCJzdGVtcy9wYWNrMi80LWZsb29yLW1vcmUud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMi9ncm9vdnktZHJ1bXMud2F2XCIsXG4gICAgLy8gXCJzdGVtcy9wYWNrMi9kcnVtLXRoaW5nLndhdlwiLFxuICAgIFwic3RlbXMvcGFjazIvZHJ1bXMtcHN0anUud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMi9kcnVtcy10aWtpdGlraS53YXZcIixcbiAgICBcInN0ZW1zL3BhY2syL2RydW1zLXdpdGgtbGFzZXIud2F2XCIsXG4gICAgLy8gXCJzdGVtcy9wYWNrMi9zbmFyZS1oYXQtYmxpcHAud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMi9mYXQtYmFzcy53YXZcIixcbiAgICBcInN0ZW1zL3BhY2syL2Jhc3Mud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMi9ob3VzZS1iYXNzLndhdlwiLFxuICAgIFwic3RlbXMvcGFjazIvZ3Jvb3Z5LXN5bnRoLndhdlwiLFxuICAgIFwic3RlbXMvcGFjazIvcGx1Y2stc3ludGgud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMi9ob3VzZS1jaG9yZHMud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMi9zcGFjeS1jaG9yZHMud2F2XCIsXG4gICAgXCJzdGVtcy9wYWNrMi9zdXJyLndhdlwiLFxuICAgIFwic3RlbXMvcGFjazIvaGVoZWhlLndhdlwiLFxuICAgIFwic3RlbXMvcGFjazIvdGhhdHMtYWxsLndhdlwiLFxuICAgIFwic3RlbXMvcGFjazIvYWxsLXRoYXQtaS1jYW4tZG8ud2F2XCIsXG4gIF07XG4gIGF3YWl0IGFjLmluaXRBdWRpbyhwYWNrMik7XG4gIGlzSW5pdGlhdGVkID0gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gc3Bpbm5lcihzaG93OiBib29sZWFuKSB7XG4gIGlmIChzaG93KSB7XG4gICAgY3JlYXRlRWxlbWVudChcImRpdlwiLCBcInNwaW5uZXJcIiwgXCJzcGlubmVyXCIsIGRvY3VtZW50LmJvZHkpO1xuICAgIHByb2dyZXNzQmFyID0gY3JlYXRlRWxlbWVudChcbiAgICAgIFwicHJvZ3Jlc3NcIixcbiAgICAgIFwicHJvZ3Jlc3NcIixcbiAgICAgIFwicHJvZ3Jlc3NcIixcbiAgICAgIGRvY3VtZW50LmJvZHlcbiAgICApO1xuICAgIHNldFRpbWVvdXQoc2V0UHJvZ3Jlc3MsIDEwMCk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgc3Bpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3Bpbm5lclwiKTtcbiAgICBzcGlubmVyPy5yZW1vdmUoKTtcbiAgICBwcm9ncmVzc0Jhcj8ucmVtb3ZlKCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0UHJvZ3Jlc3MoKSB7XG4gIGlmICghcHJvZ3Jlc3NCYXIpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgcCA9IGFjLmxvYWRlZEZpbGVzIC8gMTY7XG4gIGNvbnNvbGUubG9nKFwiUHJvZ3Jlc3M6XCIsIHApO1xuICBwcm9ncmVzc0Jhci5zZXRBdHRyaWJ1dGUoXCJ2YWx1ZVwiLCBwLnRvU3RyaW5nKCkpO1xuICBpZiAocCAhPSAxKSB7XG4gICAgc2V0VGltZW91dChzZXRQcm9ncmVzcywgMTAwKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdGFydEJ1dHRvbigpIHtcbiAgY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWJ1dHRvblwiKTtcbiAgY29uc3QgaW5mbzEgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tMVwiKTtcbiAgY29uc3QgaW5mbzIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm8tMlwiKTtcbiAgc3RhcnRCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gICAgc3RhcnRCdXR0b24ucmVtb3ZlKCk7XG4gICAgaW5mbzE/LnJlbW92ZSgpO1xuICAgIGluZm8yPy5yZW1vdmUoKTtcbiAgICBzcGlubmVyKHRydWUpO1xuICAgIGF3YWl0IGluaXRBdWRpbygpO1xuICAgIHNwaW5uZXIoZmFsc2UpO1xuICAgIGNyZWF0ZVVJRWxlbWVudHMoKTtcbiAgICBpbml0VUlMb2dpYygpO1xuICAgIGluaXRGWFVJKCk7XG4gICAgZHJhdygpO1xuICB9KTtcbn1cblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuICBjcmVhdGVTdGFydEJ1dHRvbigpO1xufSk7XG5cbmZ1bmN0aW9uIGRyYXcoKSB7XG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbiAgaWYgKCFpc0luaXRpYXRlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBmb3IgKGxldCBpID0gMDsgaSA8IG5TcXVhcmVzOyBpKyspIHtcbiAgICBjb25zdCBzcXVhcmUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChgc3F1YXJlLSR7aX1gKSBhcyBIVE1MRWxlbWVudDtcbiAgICBpZiAoc3F1YXJlKSB7XG4gICAgICBzcXVhcmUuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYWMuZ2V0RnJlcXVlbmN5Q29sb3IoaSk7XG4gICAgfVxuICB9XG59XG4iLCJleHBvcnQgY2xhc3MgQXVkaW9Db250cm9sbGVyIHtcbiAgcHJpdmF0ZSBhdWRpb0NvbnRleHQ6IEF1ZGlvQ29udGV4dDtcbiAgcHJpdmF0ZSB0cmFja3M6IHtcbiAgICBzb3VyY2VOb2RlOiBBdWRpb0J1ZmZlclNvdXJjZU5vZGU7XG4gICAgZ2Fpbk5vZGU6IEdhaW5Ob2RlO1xuICAgIGFuYWx5c2VyTm9kZTogQW5hbHlzZXJOb2RlO1xuICB9W10gPSBbXTtcbiAgcHJpdmF0ZSBzbG93QXZlcmFnZTogbnVtYmVyID0gMzk7IC8vIG9yYW5nZVxuICBwcml2YXRlIGZ4MWE6IEJpcXVhZEZpbHRlck5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBmeDFiOiBEZWxheU5vZGUgfCBudWxsID0gbnVsbDtcbiAgcHVibGljIGxvYWRlZEZpbGVzOiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuYXVkaW9Db250ZXh0ID0gbmV3IEF1ZGlvQ29udGV4dCgpO1xuICB9XG5cbiAgYXN5bmMgaW5pdEF1ZGlvKGZpbGVOYW1lczogc3RyaW5nW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICBpZiAoZmlsZU5hbWVzLmxlbmd0aCAhPT0gMTYpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkV4cGVjdGVkIDE2IGF1ZGlvIGZpbGVzLlwiKTtcbiAgICB9XG5cbiAgICBjb25zdCBmaWxlUHJvbWlzZXMgPSBmaWxlTmFtZXMubWFwKChmaWxlTmFtZSkgPT5cbiAgICAgIHRoaXMubG9hZEF1ZGlvRmlsZShmaWxlTmFtZSlcbiAgICApO1xuXG4gICAgY29uc3QgYXVkaW9CdWZmZXJzID0gYXdhaXQgUHJvbWlzZS5hbGwoZmlsZVByb21pc2VzKTtcblxuICAgIGF1ZGlvQnVmZmVycy5mb3JFYWNoKChidWZmZXIpID0+IHtcbiAgICAgIGNvbnN0IHNvdXJjZU5vZGUgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgIGNvbnN0IGdhaW5Ob2RlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlR2FpbigpO1xuXG4gICAgICBzb3VyY2VOb2RlLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgIGdhaW5Ob2RlLmdhaW4udmFsdWUgPSAwOyAvLyBTdGFydCBtdXRlZFxuICAgICAgc291cmNlTm9kZS5jb25uZWN0KGdhaW5Ob2RlKTtcblxuICAgICAgLy8gc2V0IHVwIGFuIGFuYWx5c2VyIHNvIHdlIGNhbiBkbyBjb29sIHZpc3VhbHNcbiAgICAgIGNvbnN0IGFuYWx5c2VyTm9kZSA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUFuYWx5c2VyKCk7XG4gICAgICBhbmFseXNlck5vZGUuZmZ0U2l6ZSA9IDIwNDg7XG4gICAgICBnYWluTm9kZS5jb25uZWN0KGFuYWx5c2VyTm9kZSk7XG5cbiAgICAgIC8vIHNldCB1cCBmeCBub2Rlc1xuICAgICAgdGhpcy5meDFhID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gICAgICB0aGlzLmZ4MWEudHlwZSA9IFwiaGlnaHBhc3NcIjtcbiAgICAgIHRoaXMuZngxYS5mcmVxdWVuY3kudmFsdWUgPSAxMDAwO1xuICAgICAgdGhpcy5meDFhLmdhaW4udmFsdWUgPSAwO1xuICAgICAgZ2Fpbk5vZGUuY29ubmVjdCh0aGlzLmZ4MWEpO1xuXG4gICAgICB0aGlzLmZ4MWIgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVEZWxheSgpO1xuICAgICAgdGhpcy5meDFiLmRlbGF5VGltZS52YWx1ZSA9IDA7IC8vIHBhc3MgdGhyb3VnaFxuICAgICAgdGhpcy5meDFhLmNvbm5lY3QodGhpcy5meDFiKTtcblxuICAgICAgLy8gZm9yIG5vdyBqdXN0IGJ5cGFzcyB0aGUgRlggbm9kZXMgLSBub3QgaW1wbGVtZW50ZWQgcHJvcGVybHkgeWV0XG4gICAgICAvLyAgIHRoaXMuZngxYi5jb25uZWN0KHRoaXMuYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgIGdhaW5Ob2RlLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuXG4gICAgICB0aGlzLnRyYWNrcy5wdXNoKHsgc291cmNlTm9kZSwgZ2Fpbk5vZGUsIGFuYWx5c2VyTm9kZSB9KTtcblxuICAgICAgc291cmNlTm9kZS5sb29wID0gdHJ1ZTtcbiAgICAgIHNvdXJjZU5vZGUuc3RhcnQoMCk7IC8vIFBsYXkgaW1tZWRpYXRlbHkgaW4gc3luY1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBhc3luYyBsb2FkQXVkaW9GaWxlKHVybDogc3RyaW5nKTogUHJvbWlzZTxBdWRpb0J1ZmZlcj4ge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgICBjb25zdCBhcnJheUJ1ZmZlciA9IGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XG4gICAgdGhpcy5sb2FkZWRGaWxlcysrO1xuICAgIGNvbnNvbGUubG9nKGBMb2FkZWQgJHt0aGlzLmxvYWRlZEZpbGVzfSBmaWxlcy5gKVxuICAgIHJldHVybiB0aGlzLmF1ZGlvQ29udGV4dC5kZWNvZGVBdWRpb0RhdGEoYXJyYXlCdWZmZXIpO1xuICB9XG5cbiAgZ2V0RnJlcXVlbmN5Q29sb3IodHJhY2s6IG51bWJlcik6IHN0cmluZyB7XG4gICAgY29uc3QgZ2Fpbk5vZGUgPSB0aGlzLnRyYWNrc1t0cmFja10uZ2Fpbk5vZGU7XG4gICAgaWYgKGdhaW5Ob2RlLmdhaW4udmFsdWUgPT09IDApIHtcbiAgICAgIHJldHVybiBgaHNsKCR7dGhpcy5zbG93QXZlcmFnZSArIHRyYWNrfSwgMTAwJSwgNTAlKWA7XG4gICAgfVxuICAgIGNvbnN0IGFuYWx5c2VyTm9kZSA9IHRoaXMudHJhY2tzW3RyYWNrXS5hbmFseXNlck5vZGU7XG4gICAgY29uc3QgZGF0YUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoYW5hbHlzZXJOb2RlLmZyZXF1ZW5jeUJpbkNvdW50KTtcbiAgICBhbmFseXNlck5vZGUuZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEoZGF0YUFycmF5KTtcblxuICAgIC8vIGdldCB0aGUgaGlnaGVzdCBmcmVxdWVuY3lcbiAgICBjb25zdCBtYXggPSBNYXRoLm1heCguLi5kYXRhQXJyYXkpO1xuICAgIGNvbnN0IG1heEluZGV4ID0gZGF0YUFycmF5LmluZGV4T2YobWF4KTtcbiAgICB0aGlzLnVwZGF0ZVNsb3dBdmVyYWdlKG1heEluZGV4KTtcblxuICAgIGNvbnN0IGh1ZSA9IHRoaXMuc2xvd0F2ZXJhZ2UgKyB0cmFjayArICgobWF4SW5kZXggKiAxMCkgJSAyNDApO1xuICAgIHJldHVybiBgaHNsKCR7aHVlfSwgMTAwJSwgNTAlKWA7XG4gIH1cblxuICB1cGRhdGVTbG93QXZlcmFnZSh2YWx1ZTogbnVtYmVyKSB7XG4gICAgdGhpcy5zbG93QXZlcmFnZSA9IHRoaXMuc2xvd0F2ZXJhZ2UgKyAoKHZhbHVlICogMC4wMDEpICUgMjQwKTtcbiAgfVxuXG4gIGVuYWJsZVRyYWNrKHRyYWNrTnVtYmVyOiBudW1iZXIsIGVuYWJsZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0cmFja051bWJlciA9PSAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodHJhY2tOdW1iZXIgPj0gdGhpcy50cmFja3MubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRyYWNrICR7dHJhY2tOdW1iZXJ9IGRvZXMgbm90IGV4aXN0LmApO1xuICAgIH1cbiAgICB0aGlzLnRyYWNrc1t0cmFja051bWJlcl0uZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IGVuYWJsZSA/IDAuNSA6IDA7XG4gIH1cblxuICBtdXRlQWxsKCk6IHZvaWQge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50cmFja3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRoaXMuZW5hYmxlVHJhY2soaSwgZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIGZ4MSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgIGlmICh4ICE9IDAgJiYgeSAhPSAwKSB7XG4gICAgICBpZiAoTWF0aC5yYW5kb20oKSA+IDAuMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICAgIGlmICghdGhpcy5meDFhIHx8ICF0aGlzLmZ4MWIpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJmeDEgY2FsbGVkIHdpdGggeDpcIiwgeCwgXCJ5OlwiLCB5KTtcbiAgICBjb25zb2xlLmxvZyhcIkF1ZGlvQ29udGV4dCBzdGF0ZTpcIiwgdGhpcy5hdWRpb0NvbnRleHQuc3RhdGUpO1xuICAgIGNvbnNvbGUubG9nKFwiQ3VycmVudCB0aW1lOlwiLCB0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG5cbiAgICBjb25zb2xlLmxvZyhcIkFwcGx5aW5nIGdhaW46XCIsIHggKiAyNSwgXCJ0byBmeDFhXCIpO1xuICAgIGNvbnN0IGdhaW4gPSBNYXRoLmZsb29yKHggKiAxMCk7XG4gICAgdGhpcy5meDFhLmdhaW4uc2V0VmFsdWVBdFRpbWUoZ2FpbiwgdGhpcy5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuICAgIHRoaXMuZngxYi5kZWxheVRpbWUuc2V0VmFsdWVBdFRpbWUoeSwgdGhpcy5hdWRpb0NvbnRleHQuY3VycmVudFRpbWUpO1xuXG4gICAgY29uc29sZS5sb2codGhpcy5meDFhLCB0aGlzLmZ4MWIpO1xuICB9XG59XG4iXSwibmFtZXMiOlsiYWMiLCJhdWRpb0NvbnRleHQiLCJ0cmFja3MiLCJzbG93QXZlcmFnZSIsImZ4MWEiLCJmeDFiIiwibG9hZGVkRmlsZXMiLCJjb25zdHJ1Y3RvciIsInRoaXMiLCJBdWRpb0NvbnRleHQiLCJpbml0QXVkaW8iLCJmaWxlTmFtZXMiLCJsZW5ndGgiLCJFcnJvciIsImZpbGVQcm9taXNlcyIsIm1hcCIsImZpbGVOYW1lIiwibG9hZEF1ZGlvRmlsZSIsIlByb21pc2UiLCJhbGwiLCJmb3JFYWNoIiwiYnVmZmVyIiwic291cmNlTm9kZSIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsImdhaW5Ob2RlIiwiY3JlYXRlR2FpbiIsImdhaW4iLCJ2YWx1ZSIsImNvbm5lY3QiLCJhbmFseXNlck5vZGUiLCJjcmVhdGVBbmFseXNlciIsImZmdFNpemUiLCJjcmVhdGVCaXF1YWRGaWx0ZXIiLCJ0eXBlIiwiZnJlcXVlbmN5IiwiY3JlYXRlRGVsYXkiLCJkZWxheVRpbWUiLCJkZXN0aW5hdGlvbiIsInB1c2giLCJsb29wIiwic3RhcnQiLCJ1cmwiLCJyZXNwb25zZSIsImZldGNoIiwiYXJyYXlCdWZmZXIiLCJjb25zb2xlIiwibG9nIiwiZGVjb2RlQXVkaW9EYXRhIiwiZ2V0RnJlcXVlbmN5Q29sb3IiLCJ0cmFjayIsImRhdGFBcnJheSIsIlVpbnQ4QXJyYXkiLCJmcmVxdWVuY3lCaW5Db3VudCIsImdldEJ5dGVGcmVxdWVuY3lEYXRhIiwibWF4IiwiTWF0aCIsIm1heEluZGV4IiwiaW5kZXhPZiIsInVwZGF0ZVNsb3dBdmVyYWdlIiwiZW5hYmxlVHJhY2siLCJ0cmFja051bWJlciIsImVuYWJsZSIsIm11dGVBbGwiLCJpIiwiZngxIiwieCIsInkiLCJyYW5kb20iLCJzdGF0ZSIsImN1cnJlbnRUaW1lIiwiZmxvb3IiLCJzZXRWYWx1ZUF0VGltZSIsIm5TcXVhcmVzIiwiaXNJbml0aWF0ZWQiLCJwcm9ncmVzc0JhciIsIndpbmRvd1NpemUiLCJ3aWR0aCIsImhlaWdodCIsImdldFBvc2l0aW9uRnJvbUV2ZW50IiwiZSIsIlRvdWNoRXZlbnQiLCJ0b3VjaGVzIiwiY2hhbmdlZFRvdWNoZXMiLCJjbGllbnRYIiwiY2xpZW50WSIsIk1vdXNlRXZlbnQiLCJjcmVhdGVFbGVtZW50IiwidGFnIiwiY2xzIiwiaWQiLCJwYXJlbnQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJhcHBlbmRDaGlsZCIsInNob3dCYWxscyIsInNob3ciLCJxdWVyeVNlbGVjdG9yQWxsIiwiYmFsbCIsInN0eWxlIiwiZGlzcGxheSIsImdldFNxdWFyZUlkIiwicGFydHMiLCJzcGxpdCIsInBhcnNlSW50Iiwic3Bpbm5lciIsImJvZHkiLCJzZXRUaW1lb3V0Iiwic2V0UHJvZ3Jlc3MiLCJnZXRFbGVtZW50QnlJZCIsInJlbW92ZSIsInAiLCJzZXRBdHRyaWJ1dGUiLCJ0b1N0cmluZyIsImNyZWF0ZVN0YXJ0QnV0dG9uIiwic3RhcnRCdXR0b24iLCJpbmZvMSIsImluZm8yIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFzeW5jIiwibWF0cml4IiwiYmFsbEhvbWUiLCJkcmFnZ2FibGUiLCJpbm5lclRleHQiLCJjcmVhdGVVSUVsZW1lbnRzIiwiYmFsbHMiLCJtb3VzZURvd24iLCJzdGFydERyYWciLCJwcmV2ZW50RGVmYXVsdCIsIm9yaWdpblNxdWFyZSIsInBhcmVudEVsZW1lbnQiLCJkb0RyYWciLCJnZXRBdHRyaWJ1dGUiLCJwb3NpdGlvbiIsImxlZnQiLCJ0b3AiLCJlbmREcmFnIiwib3JpZ2luU3F1YXJlSWQiLCJ0YXJnZXRFbGVtZW50IiwiZWxlbWVudEZyb21Qb2ludCIsInRhcmdldCIsImRyb3BCYWxsIiwiY2xpY2tlZEJhbGwiLCJyZWN0IiwiZ2V0Qm91bmRpbmdDbGllbnRSZWN0IiwiYmFsbFgiLCJiYWxsWSIsInNxcnQiLCJkaXN0YW5jZUZyb21CYWxsIiwid2luZG93IiwiaW5uZXJXaWR0aCIsImlubmVySGVpZ2h0Iiwib2xkSGVpZ2h0Iiwib2xkV2lkdGgiLCJwYXJzZUZsb2F0IiwiaW5pdFVJTG9naWMiLCJkcmF3IiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwic3F1YXJlIiwiYmFja2dyb3VuZENvbG9yIl0sInNvdXJjZVJvb3QiOiIifQ==