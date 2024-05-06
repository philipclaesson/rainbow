(()=>{"use strict";const e=new class{audioContext;tracks=[];slowAverage=39;fx1a=null;fx1b=null;constructor(){this.audioContext=new AudioContext}async initAudio(e){if(16!==e.length)throw new Error("Expected 16 audio files.");const t=e.map((e=>this.loadAudioFile(e)));(await Promise.all(t)).forEach((e=>{const t=this.audioContext.createBufferSource(),o=this.audioContext.createGain();t.buffer=e,o.gain.value=0,t.connect(o);const n=this.audioContext.createAnalyser();n.fftSize=2048,o.connect(n),this.fx1a=this.audioContext.createBiquadFilter(),this.fx1a.type="highpass",this.fx1a.frequency.value=1e3,this.fx1a.gain.value=0,o.connect(this.fx1a),this.fx1b=this.audioContext.createDelay(),this.fx1b.delayTime.value=0,this.fx1a.connect(this.fx1b),o.connect(this.audioContext.destination),this.tracks.push({sourceNode:t,gainNode:o,analyserNode:n}),t.loop=!0,t.start(0)}))}async loadAudioFile(e){const t=await fetch(e),o=await t.arrayBuffer();return this.audioContext.decodeAudioData(o)}getFrequencyColor(e){if(0===this.tracks[e].gainNode.gain.value)return`hsl(${this.slowAverage+e}, 100%, 50%)`;const t=this.tracks[e].analyserNode,o=new Uint8Array(t.frequencyBinCount);t.getByteFrequencyData(o);const n=Math.max(...o),s=o.indexOf(n);return this.updateSlowAverage(s),`hsl(${this.slowAverage+e+10*s%240}, 100%, 50%)`}updateSlowAverage(e){this.slowAverage=this.slowAverage+.001*e%240}enableTrack(e,t){if(-1!=e){if(e>=this.tracks.length)throw new Error(`Track ${e} does not exist.`);console.log("Enabling track",e,t),this.tracks[e].gainNode.gain.value=t?.5:0}}muteAll(){for(let e=0;e<this.tracks.length;e++)this.enableTrack(e,!1)}fx1(e,t){if(0!=e&&0!=t&&Math.random()>.1)return;if(!this.fx1a||!this.fx1b)return;console.log("fx1 called with x:",e,"y:",t),console.log("AudioContext state:",this.audioContext.state),console.log("Current time:",this.audioContext.currentTime),console.log("Applying gain:",25*e,"to fx1a");const o=Math.floor(10*e);this.fx1a.gain.setValueAtTime(o,this.audioContext.currentTime),this.fx1b.delayTime.setValueAtTime(t,this.audioContext.currentTime),console.log(this.fx1a,this.fx1b)}},t=16;var o=!1;function n(e,t,o,n){const s=document.createElement(e);return s.classList.add(t),s.id=o,n.appendChild(s),s}function s(e){document.querySelectorAll(".ball").forEach((t=>{t.style.display=e?"block":"none"}))}function i(e){if(!e)return-1;const t=e.split("square-");return t.length<2?-1:parseInt(t[1])}function a(e){if(e)n("div","spinner","spinner",document.body);else{const e=document.getElementById("spinner");e?.remove()}}function r(){if(requestAnimationFrame(r),o)for(let o=0;o<t;o++){const t=document.getElementById(`square-${o}`);t&&(t.style.backgroundColor=e.getFrequencyColor(o))}}document.addEventListener("DOMContentLoaded",(()=>{!function(){const c=document.getElementById("start-button"),l=document.getElementById("info");c?.addEventListener("click",(async()=>{c.remove(),l?.remove(),a(!0),await async function(){o||(await e.initAudio(["stems/4-on-floor.wav","stems/bass.wav","stems/dnb-124.wav","stems/drums.wav","stems/hats.wav","stems/kick-hat.wav","stems/smooth-chords.wav","stems/toms.wav","stems/guitar.wav","stems/bass.wav","stems/dnb-124.wav","stems/drums.wav","stems/hats.wav","stems/kick-hat.wav","stems/smooth-chords.wav","stems/extacy.wav"]),o=!0)}(),a(!1),function(){const e=n("div","matrix","matrix",document.body);for(let o=0;o<t;o++)n("div","square",`square-${o}`,e);const o=n("div","ballhome","ballhome",document.body);for(let e=0;e<4;e++){const t=n("div","ball",`ball-${e}`,o);t.draggable=!0,t.innerText="🌈"}}(),function(){const t=document.querySelectorAll(".ball"),o=(t,o)=>{console.log("Dropped:",t.id,o.id),e.enableTrack(i(o.id),!0),o.appendChild(t)};t.forEach((t=>{t.addEventListener("mousedown",(e=>{const o=t.parentElement;t.setAttribute("origin-square",o.id),t.setAttribute("clicked","true"),console.log("[Mousedown] Picked up",t.id,"from",o.id),e.preventDefault()})),t.addEventListener("mousemove",(e=>{"true"===t.getAttribute("clicked")&&(console.log("[Mousemove] Moving",t.id),e.preventDefault(),t.style.left=e.clientX-25+"px",t.style.top=e.clientY-25+"px")})),t.addEventListener("mouseup",(n=>{if("true"!==t.getAttribute("clicked"))return;const a=t.getAttribute("origin-square");e.enableTrack(i(a),!1),t.setAttribute("clicked","false"),s(!1);const r=document.elementFromPoint(n.clientX,n.clientY);s(!0),o(t,r),console.log("[Mouseup] Dropped",t.id,"from",a)})),t.addEventListener("touchstart",(e=>{const o=t.parentElement;t.setAttribute("origin-square",o.id),console.log("[Touchstart] Lifted",t.id,"from",o.id)})),t.addEventListener("touchmove",(e=>{if(console.log("[Touchmove] Dragging",t.id,e.touches.length),e.preventDefault(),1===e.touches.length){const o=e.touches[0];t.style.left=o.clientX-25+"px",t.style.top=o.clientY-25+"px"}})),t.addEventListener("touchend",(n=>{const a=t.getAttribute("origin-square");e.enableTrack(i(a),!1),s(!1);const r=n.changedTouches[0],c=document.elementFromPoint(r.clientX,r.clientY);s(!0),o(t,c),console.log("[Touchend] Dropped",t.id)}))}))}(),r()}))}()}))})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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RyxJQUd0RVUsRUFBS2UsaUJBQWlCLGFBQWNZLElBSWxDLEdBSEF0RCxRQUFRQyxJQUFJLHVCQUF3QjBCLEVBQUtWLEdBQUlxQyxFQUFFYSxRQUFRbkgsUUFDdkRzRyxFQUFFSSxpQkFFdUIsSUFBckJKLEVBQUVhLFFBQVFuSCxPQUFjLENBQzFCLE1BQU1vSCxFQUFRZCxFQUFFYSxRQUFRLEdBQ3hCeEMsRUFBS0MsTUFBTWdDLEtBQVVRLEVBQU1QLFFBQVUsR0FBbkIsS0FDbEJsQyxFQUFLQyxNQUFNa0MsSUFBU00sRUFBTUwsUUFBVSxHQUFuQixJLEtBSXJCcEMsRUFBS2UsaUJBQWlCLFlBQWFZLElBRWpDLE1BQU1VLEVBQWlCckMsRUFBS2dDLGFBQWEsaUJBQ3pDdEgsRUFBR3dELFlBQVlpQyxFQUFZa0MsSUFBaUIsR0FHNUN4QyxHQUFVLEdBQ1YsTUFBTTRDLEVBQVFkLEVBQUVlLGVBQWUsR0FDekJKLEVBQWdCN0MsU0FBUzhDLGlCQUM3QkUsRUFBTVAsUUFDTk8sRUFBTUwsU0FFUnZDLEdBQVUsR0FFVjRCLEVBQVN6QixFQUFNc0MsR0FDZmpFLFFBQVFDLElBQUkscUJBQXNCMEIsRUFBS1YsR0FBRyxHQUMxQyxHQUVOLENBc0lJcUQsR0FFQWhDLEdBQU0sR0FFVixDQUdFaUMsRUFBbUIsRyIsInNvdXJjZXMiOlsid2VicGFjazovL3NxdWFyZXMvLi9zcmMvbWFpbi50cyIsIndlYnBhY2s6Ly9zcXVhcmVzLy4vc3JjL2F1ZGlvLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF1ZGlvQ29udHJvbGxlciB9IGZyb20gXCIuL2F1ZGlvXCI7XG5cbmNvbnN0IGFjID0gbmV3IEF1ZGlvQ29udHJvbGxlcigpO1xuY29uc3QgblNxdWFyZXMgPSAxNjtcbmNvbnN0IG5CYWxscyA9IDQ7XG52YXIgaXNJbml0aWF0ZWQgPSBmYWxzZTtcbnZhciBtb2JpbGVVc2FnZSA9IGZhbHNlO1xudmFyIGZ4RW5hYmxlID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGNyZWF0ZVVJRWxlbWVudHMoKSB7XG4gIC8vIENyZWF0ZSBGWCB1aVxuICBpZiAoZnhFbmFibGUpIHtcbiAgICBjb25zdCBmeGRpdiA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJmeFwiLCBcImZ4XCIsIGRvY3VtZW50LmJvZHkpO1xuICAgIGZ4ZGl2LnN0eWxlLmRpc3BsYXkgPSBmeEVuYWJsZSA/IFwiYmxvY2tcIiA6IFwibm9uZVwiO1xuICAgIGNvbnN0IGZ4MSA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJmeDFcIiwgXCJmeDFcIiwgZnhkaXYpO1xuICAgIGZ4MS5pbm5lclRleHQgPSBcIvCfjIpcIjtcbiAgICBjb25zdCBmeHNwYWNlciA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJmeHNwYWNlclwiLCBcImZ4c3BhY2VyXCIsIGZ4ZGl2KTtcbiAgICBjb25zdCBmeDIgPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwiZngyXCIsIFwiZngyXCIsIGZ4ZGl2KTtcbiAgICBmeDIuaW5uZXJUZXh0ID0gXCLwn5WlXCI7XG4gIH1cblxuICBjb25zdCBtYXRyaXggPSBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwibWF0cml4XCIsIFwibWF0cml4XCIsIGRvY3VtZW50LmJvZHkpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5TcXVhcmVzOyBpKyspIHtcbiAgICBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwic3F1YXJlXCIsIGBzcXVhcmUtJHtpfWAsIG1hdHJpeCk7XG4gIH1cblxuICBjb25zdCBiYWxsSG9tZSA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJiYWxsaG9tZVwiLCBcImJhbGxob21lXCIsIGRvY3VtZW50LmJvZHkpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5CYWxsczsgaSsrKSB7XG4gICAgY29uc3QgYmFsbCA9IGNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgXCJiYWxsXCIsIGBiYWxsLSR7aX1gLCBiYWxsSG9tZSk7XG4gICAgYmFsbC5kcmFnZ2FibGUgPSB0cnVlO1xuICAgIGJhbGwuaW5uZXJUZXh0ID0gYPCfjIhgO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluaXRVSUxvZ2ljKCkge1xuICBjb25zdCBiYWxsczogTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJhbGxcIik7XG5cbiAgLy8gRHJvcHMgYSBiYWxsIGludG8gYSB0YXJnZXQgZWxlbWVudCBhbmQgbXV0ZXMgdGhlIHRyYWNrIHRoZSBiYWxsIGNhbWUgZnJvbVxuICBjb25zdCBkcm9wQmFsbCA9IChiYWxsOiBIVE1MRWxlbWVudCwgdGFyZ2V0OiBIVE1MRWxlbWVudCkgPT4ge1xuICAgIGNvbnNvbGUubG9nKFwiRHJvcHBlZDpcIiwgYmFsbC5pZCwgdGFyZ2V0LmlkKTtcbiAgICBhYy5lbmFibGVUcmFjayhnZXRTcXVhcmVJZCh0YXJnZXQuaWQpLCB0cnVlKTtcbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoYmFsbCk7XG4gIH07XG5cbiAgYmFsbHMuZm9yRWFjaCgoYmFsbCkgPT4ge1xuICAgIC8vIERlc2t0b3AgY2xpY2sgZXZlbnRzXG4gICAgYmFsbC5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICBtb2JpbGVVc2FnZSA9IGZhbHNlOyAvLyBBc3N1bWluZyB5b3UgdXNlIHRoaXMgdG8gZGlzdGluZ3Vpc2ggYmV0d2VlbiBtb2JpbGUgYW5kIGRlc2t0b3AgdXNhZ2VcbiAgICAgIGNvbnN0IG9yaWdpblNxdWFyZSA9IGJhbGwucGFyZW50RWxlbWVudCBhcyBIVE1MRWxlbWVudDtcbiAgICAgIGJhbGwuc2V0QXR0cmlidXRlKFwib3JpZ2luLXNxdWFyZVwiLCBvcmlnaW5TcXVhcmUuaWQpO1xuICAgICAgYmFsbC5zZXRBdHRyaWJ1dGUoXCJjbGlja2VkXCIsIFwidHJ1ZVwiKVxuICAgICAgY29uc29sZS5sb2coXCJbTW91c2Vkb3duXSBQaWNrZWQgdXBcIiwgYmFsbC5pZCwgXCJmcm9tXCIsIG9yaWdpblNxdWFyZS5pZCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIFRoaXMgcHJldmVudHMgdGhlIGRlZmF1bHQgdGV4dCBzZWxlY3Rpb24gYmVoYXZpb3JcbiAgICB9KTtcblxuICAgIGJhbGwuYWRkRXZlbnRMaXN0ZW5lcihcIm1vdXNlbW92ZVwiLCAoZTogTW91c2VFdmVudCkgPT4ge1xuICAgICAgaWYgKGJhbGwuZ2V0QXR0cmlidXRlKFwiY2xpY2tlZFwiKSAhPT0gXCJ0cnVlXCIpIHJldHVybjtcbiAgICAgIGNvbnNvbGUubG9nKFwiW01vdXNlbW92ZV0gTW92aW5nXCIsIGJhbGwuaWQpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgYmFsbC5zdHlsZS5sZWZ0ID0gYCR7ZS5jbGllbnRYIC0gMjV9cHhgOyAvLyBBZGp1c3QgZm9yIGNlbnRlciBvZiB0aGUgYmFsbFxuICAgICAgYmFsbC5zdHlsZS50b3AgPSBgJHtlLmNsaWVudFkgLSAyNX1weGA7XG4gICAgfSk7XG5cbiAgICBiYWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXVwXCIsIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICBpZiAoYmFsbC5nZXRBdHRyaWJ1dGUoXCJjbGlja2VkXCIpICE9PSBcInRydWVcIikgcmV0dXJuO1xuICAgICAgY29uc3Qgb3JpZ2luU3F1YXJlSWQgPSBiYWxsLmdldEF0dHJpYnV0ZShcIm9yaWdpbi1zcXVhcmVcIik7XG4gICAgICBhYy5lbmFibGVUcmFjayhnZXRTcXVhcmVJZChvcmlnaW5TcXVhcmVJZCksIGZhbHNlKTtcbiAgICAgIGJhbGwuc2V0QXR0cmlidXRlKFwiY2xpY2tlZFwiLCBcImZhbHNlXCIpO1xuICAgICAgc2hvd0JhbGxzKGZhbHNlKTtcbiAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KFxuICAgICAgICBlLmNsaWVudFgsXG4gICAgICAgIGUuY2xpZW50WVxuICAgICAgKSBhcyBIVE1MRWxlbWVudDtcbiAgICAgIHNob3dCYWxscyh0cnVlKTtcblxuICAgICAgZHJvcEJhbGwoYmFsbCwgdGFyZ2V0RWxlbWVudCk7XG4gICAgICBjb25zb2xlLmxvZyhcIltNb3VzZXVwXSBEcm9wcGVkXCIsIGJhbGwuaWQsIFwiZnJvbVwiLCBvcmlnaW5TcXVhcmVJZCk7XG4gICAgfSk7XG5cbiAgICAvLyBNb2JpbGUgdG91Y2ggZXZlbnRzXG4gICAgYmFsbC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hzdGFydFwiLCAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgICAgbW9iaWxlVXNhZ2UgPSB0cnVlO1xuICAgICAgY29uc3Qgb3JpZ2luU3F1YXJlID0gYmFsbC5wYXJlbnRFbGVtZW50IGFzIEhUTUxFbGVtZW50O1xuICAgICAgYmFsbC5zZXRBdHRyaWJ1dGUoXCJvcmlnaW4tc3F1YXJlXCIsIG9yaWdpblNxdWFyZS5pZCk7XG4gICAgICBjb25zb2xlLmxvZyhcIltUb3VjaHN0YXJ0XSBMaWZ0ZWRcIiwgYmFsbC5pZCwgXCJmcm9tXCIsIG9yaWdpblNxdWFyZS5pZCk7XG4gICAgfSk7XG5cbiAgICBiYWxsLmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaG1vdmVcIiwgKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIGNvbnNvbGUubG9nKFwiW1RvdWNobW92ZV0gRHJhZ2dpbmdcIiwgYmFsbC5pZCwgZS50b3VjaGVzLmxlbmd0aCk7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBtb2JpbGVVc2FnZSA9IHRydWU7XG4gICAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcbiAgICAgICAgYmFsbC5zdHlsZS5sZWZ0ID0gYCR7dG91Y2guY2xpZW50WCAtIDI1fXB4YDsgLy8gQWRqdXN0IGZvciBjZW50ZXIgb2YgdGhlIGJhbGxcbiAgICAgICAgYmFsbC5zdHlsZS50b3AgPSBgJHt0b3VjaC5jbGllbnRZIC0gMjV9cHhgO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYmFsbC5hZGRFdmVudExpc3RlbmVyKFwidG91Y2hlbmRcIiwgKGU6IFRvdWNoRXZlbnQpID0+IHtcbiAgICAgIC8vIE11dGUgdGhlIHNxdWFyZSB0aGF0IHRoZSBiYWxsIGNhbWUgZnJvbVxuICAgICAgY29uc3Qgb3JpZ2luU3F1YXJlSWQgPSBiYWxsLmdldEF0dHJpYnV0ZShcIm9yaWdpbi1zcXVhcmVcIik7XG4gICAgICBhYy5lbmFibGVUcmFjayhnZXRTcXVhcmVJZChvcmlnaW5TcXVhcmVJZCksIGZhbHNlKTtcblxuICAgICAgLy8gaGlkZSBiYWxscyB3aGlsZSB3ZSBmaW5kIHRoZSB0YXJnZXQgZWxlbWVudFxuICAgICAgc2hvd0JhbGxzKGZhbHNlKTtcbiAgICAgIGNvbnN0IHRvdWNoID0gZS5jaGFuZ2VkVG91Y2hlc1swXTtcbiAgICAgIGNvbnN0IHRhcmdldEVsZW1lbnQgPSBkb2N1bWVudC5lbGVtZW50RnJvbVBvaW50KFxuICAgICAgICB0b3VjaC5jbGllbnRYLFxuICAgICAgICB0b3VjaC5jbGllbnRZXG4gICAgICApIGFzIEhUTUxFbGVtZW50O1xuICAgICAgc2hvd0JhbGxzKHRydWUpO1xuXG4gICAgICBkcm9wQmFsbChiYWxsLCB0YXJnZXRFbGVtZW50KTtcbiAgICAgIGNvbnNvbGUubG9nKFwiW1RvdWNoZW5kXSBEcm9wcGVkXCIsIGJhbGwuaWQpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gaW5pdEZYVUkoKSB7XG4gIGlmICghZnhFbmFibGUpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZngxID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmeDFcIik7XG4gIGlmICghZngxKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZngxIG5vdCBmb3VuZFwiKTtcbiAgfVxuICBmeDEuZHJhZ2dhYmxlID0gdHJ1ZTtcbiAgY29uc3QgZngyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJmeDJcIik7XG4gIGZ4MT8uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdzdGFydFwiLCAoZTogRHJhZ0V2ZW50KSA9PiB7XG4gICAgY29uc3QgeyB4LCB5IH0gPSBub3JtYWxpemVkWFkoZS54LCBlLnkpO1xuICAgIGFjLmZ4MSh4LCB5KTtcbiAgICBjb25zb2xlLmxvZyhcImRyYWdzdGFydFwiKTtcbiAgfSk7XG4gIGZ4MT8uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdcIiwgKGU6IERyYWdFdmVudCkgPT4ge1xuICAgIGNvbnN0IHsgeCwgeSB9ID0gbm9ybWFsaXplZFhZKGUueCwgZS55KTtcbiAgICBhYy5meDEoeCwgeSk7XG4gICAgY29uc29sZS5sb2coXCJkcmFnbW92ZVwiKTtcbiAgfSk7XG4gIGZ4MT8uYWRkRXZlbnRMaXN0ZW5lcihcImRyYWdlbmRcIiwgKGU6IERyYWdFdmVudCkgPT4ge1xuICAgIGFjLmZ4MSgwLCAwKTtcbiAgICBjb25zb2xlLmxvZyhcImRyYWdlbmRcIik7XG4gIH0pO1xuICBmeDE/LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaHN0YXJ0XCIsIChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgaWYgKGUudG91Y2hlcy5sZW5ndGggIT0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcbiAgICBjb25zdCB7IHgsIHkgfSA9IG5vcm1hbGl6ZWRYWSh0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZKTtcbiAgICBhYy5meDEoeCwgeSk7XG4gICAgY29uc29sZS5sb2coXCJ0b3VjaHN0YXJ0XCIpO1xuICB9KTtcbiAgZngxPy5hZGRFdmVudExpc3RlbmVyKFwidG91Y2htb3ZlXCIsIChlOiBUb3VjaEV2ZW50KSA9PiB7XG4gICAgaWYgKGUudG91Y2hlcy5sZW5ndGggIT0gMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB0b3VjaCA9IGUudG91Y2hlc1swXTtcbiAgICBjb25zdCB7IHgsIHkgfSA9IG5vcm1hbGl6ZWRYWSh0b3VjaC5jbGllbnRYLCB0b3VjaC5jbGllbnRZKTtcbiAgICBhYy5meDEoeCwgeSk7XG4gICAgY29uc29sZS5sb2coXCJ0b3VjaG1vdmVcIik7XG4gIH0pO1xuICBmeDE/LmFkZEV2ZW50TGlzdGVuZXIoXCJ0b3VjaGVuZFwiLCAoZTogVG91Y2hFdmVudCkgPT4ge1xuICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoICE9IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgYWMuZngxKDAsIDApO1xuICAgIGNvbnNvbGUubG9nKFwidG91Y2hlbmRcIik7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50KFxuICB0YWc6IHN0cmluZyxcbiAgY2xzOiBzdHJpbmcsXG4gIGlkOiBzdHJpbmcsXG4gIHBhcmVudDogSFRNTEVsZW1lbnRcbikge1xuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWcpO1xuICBlbGVtZW50LmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgZWxlbWVudC5pZCA9IGlkO1xuICBwYXJlbnQuYXBwZW5kQ2hpbGQoZWxlbWVudCk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5mdW5jdGlvbiBzaG93QmFsbHMoc2hvdzogYm9vbGVhbikge1xuICBjb25zdCBiYWxsczogTm9kZUxpc3RPZjxIVE1MRWxlbWVudD4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmJhbGxcIik7XG4gIGJhbGxzLmZvckVhY2goKGJhbGwpID0+IHtcbiAgICBiYWxsLnN0eWxlLmRpc3BsYXkgPSBzaG93ID8gXCJibG9ja1wiIDogXCJub25lXCI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRTcXVhcmVJZChpZDogc3RyaW5nIHwgbnVsbCk6IG51bWJlciB7XG4gIGlmICghaWQpIHtcbiAgICByZXR1cm4gLTE7XG4gIH1cbiAgY29uc3QgcGFydHMgPSBpZC5zcGxpdChcInNxdWFyZS1cIik7XG4gIGlmIChwYXJ0cy5sZW5ndGggPCAyKSB7XG4gICAgcmV0dXJuIC0xO1xuICB9XG4gIHJldHVybiBwYXJzZUludChwYXJ0c1sxXSk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZWRYWSh4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICBjb25zdCB3aWR0aCA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICBjb25zdCBoZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XG4gIHJldHVybiB7IHg6IHggLyB3aWR0aCwgeTogeSAvIGhlaWdodCB9O1xufVxuXG5hc3luYyBmdW5jdGlvbiBpbml0QXVkaW8oKSB7XG4gIGlmIChpc0luaXRpYXRlZCkge1xuICAgIHJldHVybjtcbiAgfVxuICBhd2FpdCBhYy5pbml0QXVkaW8oW1xuICAgIFwic3RlbXMvNC1vbi1mbG9vci53YXZcIixcbiAgICBcInN0ZW1zL2Jhc3Mud2F2XCIsXG4gICAgXCJzdGVtcy9kbmItMTI0LndhdlwiLFxuICAgIFwic3RlbXMvZHJ1bXMud2F2XCIsXG4gICAgXCJzdGVtcy9oYXRzLndhdlwiLFxuICAgIFwic3RlbXMva2ljay1oYXQud2F2XCIsXG4gICAgXCJzdGVtcy9zbW9vdGgtY2hvcmRzLndhdlwiLFxuICAgIFwic3RlbXMvdG9tcy53YXZcIixcbiAgICBcInN0ZW1zL2d1aXRhci53YXZcIixcbiAgICBcInN0ZW1zL2Jhc3Mud2F2XCIsXG4gICAgXCJzdGVtcy9kbmItMTI0LndhdlwiLFxuICAgIFwic3RlbXMvZHJ1bXMud2F2XCIsXG4gICAgXCJzdGVtcy9oYXRzLndhdlwiLFxuICAgIFwic3RlbXMva2ljay1oYXQud2F2XCIsXG4gICAgXCJzdGVtcy9zbW9vdGgtY2hvcmRzLndhdlwiLFxuICAgIFwic3RlbXMvZXh0YWN5LndhdlwiLFxuICBdKTtcbiAgaXNJbml0aWF0ZWQgPSB0cnVlO1xufVxuXG5mdW5jdGlvbiBzcGlubmVyKHNob3c6IGJvb2xlYW4pIHtcbiAgaWYgKHNob3cpIHtcbiAgICBjcmVhdGVFbGVtZW50KFwiZGl2XCIsIFwic3Bpbm5lclwiLCBcInNwaW5uZXJcIiwgZG9jdW1lbnQuYm9keSk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgc3Bpbm5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3Bpbm5lclwiKTtcbiAgICBzcGlubmVyPy5yZW1vdmUoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdGFydEJ1dHRvbigpIHtcbiAgY29uc3Qgc3RhcnRCdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN0YXJ0LWJ1dHRvblwiKTtcbiAgY29uc3QgaW5mbyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaW5mb1wiKTtcbiAgc3RhcnRCdXR0b24/LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCBhc3luYyAoKSA9PiB7XG4gICAgc3RhcnRCdXR0b24ucmVtb3ZlKCk7XG4gICAgaW5mbz8ucmVtb3ZlKCk7XG4gICAgc3Bpbm5lcih0cnVlKTtcbiAgICBhd2FpdCBpbml0QXVkaW8oKTtcbiAgICBzcGlubmVyKGZhbHNlKTtcbiAgICBjcmVhdGVVSUVsZW1lbnRzKCk7XG4gICAgaW5pdFVJTG9naWMoKTtcbiAgICBpbml0RlhVSSgpO1xuICAgIGRyYXcoKTtcbiAgfSk7XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiAgY3JlYXRlU3RhcnRCdXR0b24oKTtcbn0pO1xuXG5mdW5jdGlvbiBkcmF3KCkge1xuICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZHJhdyk7XG4gIGlmICghaXNJbml0aWF0ZWQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBuU3F1YXJlczsgaSsrKSB7XG4gICAgY29uc3Qgc3F1YXJlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoYHNxdWFyZS0ke2l9YCkgYXMgSFRNTEVsZW1lbnQ7XG4gICAgaWYgKHNxdWFyZSkge1xuICAgICAgc3F1YXJlLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGFjLmdldEZyZXF1ZW5jeUNvbG9yKGkpO1xuICAgIH1cbiAgfVxufVxuIiwiZXhwb3J0IGNsYXNzIEF1ZGlvQ29udHJvbGxlciB7XG4gIHByaXZhdGUgYXVkaW9Db250ZXh0OiBBdWRpb0NvbnRleHQ7XG4gIHByaXZhdGUgdHJhY2tzOiB7XG4gICAgc291cmNlTm9kZTogQXVkaW9CdWZmZXJTb3VyY2VOb2RlO1xuICAgIGdhaW5Ob2RlOiBHYWluTm9kZTtcbiAgICBhbmFseXNlck5vZGU6IEFuYWx5c2VyTm9kZTtcbiAgfVtdID0gW107XG4gIHByaXZhdGUgc2xvd0F2ZXJhZ2U6IG51bWJlciA9IDM5OyAvLyBvcmFuZ2VcbiAgcHJpdmF0ZSBmeDFhOiBCaXF1YWRGaWx0ZXJOb2RlIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZngxYjogRGVsYXlOb2RlIHwgbnVsbCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5hdWRpb0NvbnRleHQgPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gIH1cblxuICBhc3luYyBpbml0QXVkaW8oZmlsZU5hbWVzOiBzdHJpbmdbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgIGlmIChmaWxlTmFtZXMubGVuZ3RoICE9PSAxNikge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRXhwZWN0ZWQgMTYgYXVkaW8gZmlsZXMuXCIpO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGVQcm9taXNlcyA9IGZpbGVOYW1lcy5tYXAoKGZpbGVOYW1lKSA9PlxuICAgICAgdGhpcy5sb2FkQXVkaW9GaWxlKGZpbGVOYW1lKVxuICAgICk7XG5cbiAgICBjb25zdCBhdWRpb0J1ZmZlcnMgPSBhd2FpdCBQcm9taXNlLmFsbChmaWxlUHJvbWlzZXMpO1xuXG4gICAgYXVkaW9CdWZmZXJzLmZvckVhY2goKGJ1ZmZlcikgPT4ge1xuICAgICAgY29uc3Qgc291cmNlTm9kZSA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgY29uc3QgZ2Fpbk5vZGUgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVHYWluKCk7XG5cbiAgICAgIHNvdXJjZU5vZGUuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgZ2Fpbk5vZGUuZ2Fpbi52YWx1ZSA9IDA7IC8vIFN0YXJ0IG11dGVkXG4gICAgICBzb3VyY2VOb2RlLmNvbm5lY3QoZ2Fpbk5vZGUpO1xuXG4gICAgICAvLyBzZXQgdXAgYW4gYW5hbHlzZXIgc28gd2UgY2FuIGRvIGNvb2wgdmlzdWFsc1xuICAgICAgY29uc3QgYW5hbHlzZXJOb2RlID0gdGhpcy5hdWRpb0NvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcbiAgICAgIGFuYWx5c2VyTm9kZS5mZnRTaXplID0gMjA0ODtcbiAgICAgIGdhaW5Ob2RlLmNvbm5lY3QoYW5hbHlzZXJOb2RlKTtcblxuICAgICAgLy8gc2V0IHVwIGZ4IG5vZGVzXG4gICAgICB0aGlzLmZ4MWEgPSB0aGlzLmF1ZGlvQ29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgICAgIHRoaXMuZngxYS50eXBlID0gXCJoaWdocGFzc1wiO1xuICAgICAgdGhpcy5meDFhLmZyZXF1ZW5jeS52YWx1ZSA9IDEwMDA7XG4gICAgICB0aGlzLmZ4MWEuZ2Fpbi52YWx1ZSA9IDA7XG4gICAgICBnYWluTm9kZS5jb25uZWN0KHRoaXMuZngxYSk7XG5cbiAgICAgIHRoaXMuZngxYiA9IHRoaXMuYXVkaW9Db250ZXh0LmNyZWF0ZURlbGF5KCk7XG4gICAgICB0aGlzLmZ4MWIuZGVsYXlUaW1lLnZhbHVlID0gMDsgLy8gcGFzcyB0aHJvdWdoXG4gICAgICB0aGlzLmZ4MWEuY29ubmVjdCh0aGlzLmZ4MWIpO1xuXG4gICAgICAvLyBmb3Igbm93IGp1c3QgYnlwYXNzIHRoZSBGWCBub2RlcyAtIG5vdCBpbXBsZW1lbnRlZCBwcm9wZXJseSB5ZXRcbiAgICAgIC8vICAgdGhpcy5meDFiLmNvbm5lY3QodGhpcy5hdWRpb0NvbnRleHQuZGVzdGluYXRpb24pO1xuICAgICAgZ2Fpbk5vZGUuY29ubmVjdCh0aGlzLmF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG5cbiAgICAgIHRoaXMudHJhY2tzLnB1c2goeyBzb3VyY2VOb2RlLCBnYWluTm9kZSwgYW5hbHlzZXJOb2RlIH0pO1xuXG4gICAgICBzb3VyY2VOb2RlLmxvb3AgPSB0cnVlO1xuICAgICAgc291cmNlTm9kZS5zdGFydCgwKTsgLy8gUGxheSBpbW1lZGlhdGVseSBpbiBzeW5jXG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGFzeW5jIGxvYWRBdWRpb0ZpbGUodXJsOiBzdHJpbmcpOiBQcm9taXNlPEF1ZGlvQnVmZmVyPiB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwpO1xuICAgIGNvbnN0IGFycmF5QnVmZmVyID0gYXdhaXQgcmVzcG9uc2UuYXJyYXlCdWZmZXIoKTtcbiAgICByZXR1cm4gdGhpcy5hdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKGFycmF5QnVmZmVyKTtcbiAgfVxuXG4gIGdldEZyZXF1ZW5jeUNvbG9yKHRyYWNrOiBudW1iZXIpOiBzdHJpbmcge1xuICAgIGNvbnN0IGdhaW5Ob2RlID0gdGhpcy50cmFja3NbdHJhY2tdLmdhaW5Ob2RlO1xuICAgIGlmIChnYWluTm9kZS5nYWluLnZhbHVlID09PSAwKSB7XG4gICAgICByZXR1cm4gYGhzbCgke3RoaXMuc2xvd0F2ZXJhZ2UgKyB0cmFja30sIDEwMCUsIDUwJSlgO1xuICAgIH1cbiAgICBjb25zdCBhbmFseXNlck5vZGUgPSB0aGlzLnRyYWNrc1t0cmFja10uYW5hbHlzZXJOb2RlO1xuICAgIGNvbnN0IGRhdGFBcnJheSA9IG5ldyBVaW50OEFycmF5KGFuYWx5c2VyTm9kZS5mcmVxdWVuY3lCaW5Db3VudCk7XG4gICAgYW5hbHlzZXJOb2RlLmdldEJ5dGVGcmVxdWVuY3lEYXRhKGRhdGFBcnJheSk7XG5cbiAgICAvLyBnZXQgdGhlIGhpZ2hlc3QgZnJlcXVlbmN5XG4gICAgY29uc3QgbWF4ID0gTWF0aC5tYXgoLi4uZGF0YUFycmF5KTtcbiAgICBjb25zdCBtYXhJbmRleCA9IGRhdGFBcnJheS5pbmRleE9mKG1heCk7XG4gICAgdGhpcy51cGRhdGVTbG93QXZlcmFnZShtYXhJbmRleCk7XG5cbiAgICBjb25zdCBodWUgPSB0aGlzLnNsb3dBdmVyYWdlICsgdHJhY2sgKyAoKG1heEluZGV4ICogMTApICUgMjQwKTtcbiAgICByZXR1cm4gYGhzbCgke2h1ZX0sIDEwMCUsIDUwJSlgO1xuICB9XG5cbiAgdXBkYXRlU2xvd0F2ZXJhZ2UodmFsdWU6IG51bWJlcikge1xuICAgIHRoaXMuc2xvd0F2ZXJhZ2UgPSB0aGlzLnNsb3dBdmVyYWdlICsgKCh2YWx1ZSAqIDAuMDAxKSAlIDI0MCk7XG4gIH1cblxuICBlbmFibGVUcmFjayh0cmFja051bWJlcjogbnVtYmVyLCBlbmFibGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICBpZiAodHJhY2tOdW1iZXIgPT0gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHRyYWNrTnVtYmVyID49IHRoaXMudHJhY2tzLmxlbmd0aCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUcmFjayAke3RyYWNrTnVtYmVyfSBkb2VzIG5vdCBleGlzdC5gKTtcbiAgICB9XG4gICAgY29uc29sZS5sb2coXCJFbmFibGluZyB0cmFja1wiLCB0cmFja051bWJlciwgZW5hYmxlKVxuICAgIHRoaXMudHJhY2tzW3RyYWNrTnVtYmVyXS5nYWluTm9kZS5nYWluLnZhbHVlID0gZW5hYmxlID8gMC41IDogMDtcbiAgfVxuXG4gIG11dGVBbGwoKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRyYWNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgdGhpcy5lbmFibGVUcmFjayhpLCBmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgZngxKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgaWYgKHggIT0gMCAmJiB5ICE9IDApIHtcbiAgICAgIGlmIChNYXRoLnJhbmRvbSgpID4gMC4xKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKCF0aGlzLmZ4MWEgfHwgIXRoaXMuZngxYikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhcImZ4MSBjYWxsZWQgd2l0aCB4OlwiLCB4LCBcInk6XCIsIHkpO1xuICAgIGNvbnNvbGUubG9nKFwiQXVkaW9Db250ZXh0IHN0YXRlOlwiLCB0aGlzLmF1ZGlvQ29udGV4dC5zdGF0ZSk7XG4gICAgY29uc29sZS5sb2coXCJDdXJyZW50IHRpbWU6XCIsIHRoaXMuYXVkaW9Db250ZXh0LmN1cnJlbnRUaW1lKTtcblxuICAgIGNvbnNvbGUubG9nKFwiQXBwbHlpbmcgZ2FpbjpcIiwgeCAqIDI1LCBcInRvIGZ4MWFcIik7XG4gICAgY29uc3QgZ2FpbiA9IE1hdGguZmxvb3IoeCAqIDEwKTtcbiAgICB0aGlzLmZ4MWEuZ2Fpbi5zZXRWYWx1ZUF0VGltZShnYWluLCB0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG4gICAgdGhpcy5meDFiLmRlbGF5VGltZS5zZXRWYWx1ZUF0VGltZSh5LCB0aGlzLmF1ZGlvQ29udGV4dC5jdXJyZW50VGltZSk7XG5cbiAgICBjb25zb2xlLmxvZyh0aGlzLmZ4MWEsIHRoaXMuZngxYik7XG4gIH1cbn1cbiJdLCJuYW1lcyI6WyJhYyIsImF1ZGlvQ29udGV4dCIsInRyYWNrcyIsInNsb3dBdmVyYWdlIiwiZngxYSIsImZ4MWIiLCJjb25zdHJ1Y3RvciIsInRoaXMiLCJBdWRpb0NvbnRleHQiLCJpbml0QXVkaW8iLCJmaWxlTmFtZXMiLCJsZW5ndGgiLCJFcnJvciIsImZpbGVQcm9taXNlcyIsIm1hcCIsImZpbGVOYW1lIiwibG9hZEF1ZGlvRmlsZSIsIlByb21pc2UiLCJhbGwiLCJmb3JFYWNoIiwiYnVmZmVyIiwic291cmNlTm9kZSIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsImdhaW5Ob2RlIiwiY3JlYXRlR2FpbiIsImdhaW4iLCJ2YWx1ZSIsImNvbm5lY3QiLCJhbmFseXNlck5vZGUiLCJjcmVhdGVBbmFseXNlciIsImZmdFNpemUiLCJjcmVhdGVCaXF1YWRGaWx0ZXIiLCJ0eXBlIiwiZnJlcXVlbmN5IiwiY3JlYXRlRGVsYXkiLCJkZWxheVRpbWUiLCJkZXN0aW5hdGlvbiIsInB1c2giLCJsb29wIiwic3RhcnQiLCJ1cmwiLCJyZXNwb25zZSIsImZldGNoIiwiYXJyYXlCdWZmZXIiLCJkZWNvZGVBdWRpb0RhdGEiLCJnZXRGcmVxdWVuY3lDb2xvciIsInRyYWNrIiwiZGF0YUFycmF5IiwiVWludDhBcnJheSIsImZyZXF1ZW5jeUJpbkNvdW50IiwiZ2V0Qnl0ZUZyZXF1ZW5jeURhdGEiLCJtYXgiLCJNYXRoIiwibWF4SW5kZXgiLCJpbmRleE9mIiwidXBkYXRlU2xvd0F2ZXJhZ2UiLCJlbmFibGVUcmFjayIsInRyYWNrTnVtYmVyIiwiZW5hYmxlIiwiY29uc29sZSIsImxvZyIsIm11dGVBbGwiLCJpIiwiZngxIiwieCIsInkiLCJyYW5kb20iLCJzdGF0ZSIsImN1cnJlbnRUaW1lIiwiZmxvb3IiLCJzZXRWYWx1ZUF0VGltZSIsIm5TcXVhcmVzIiwiaXNJbml0aWF0ZWQiLCJjcmVhdGVFbGVtZW50IiwidGFnIiwiY2xzIiwiaWQiLCJwYXJlbnQiLCJlbGVtZW50IiwiZG9jdW1lbnQiLCJjbGFzc0xpc3QiLCJhZGQiLCJhcHBlbmRDaGlsZCIsInNob3dCYWxscyIsInNob3ciLCJxdWVyeVNlbGVjdG9yQWxsIiwiYmFsbCIsInN0eWxlIiwiZGlzcGxheSIsImdldFNxdWFyZUlkIiwicGFydHMiLCJzcGxpdCIsInBhcnNlSW50Iiwic3Bpbm5lciIsImJvZHkiLCJnZXRFbGVtZW50QnlJZCIsInJlbW92ZSIsImRyYXciLCJyZXF1ZXN0QW5pbWF0aW9uRnJhbWUiLCJzcXVhcmUiLCJiYWNrZ3JvdW5kQ29sb3IiLCJhZGRFdmVudExpc3RlbmVyIiwic3RhcnRCdXR0b24iLCJpbmZvIiwiYXN5bmMiLCJtYXRyaXgiLCJiYWxsSG9tZSIsImRyYWdnYWJsZSIsImlubmVyVGV4dCIsImNyZWF0ZVVJRWxlbWVudHMiLCJiYWxscyIsImRyb3BCYWxsIiwidGFyZ2V0IiwiZSIsIm9yaWdpblNxdWFyZSIsInBhcmVudEVsZW1lbnQiLCJzZXRBdHRyaWJ1dGUiLCJwcmV2ZW50RGVmYXVsdCIsImdldEF0dHJpYnV0ZSIsImxlZnQiLCJjbGllbnRYIiwidG9wIiwiY2xpZW50WSIsIm9yaWdpblNxdWFyZUlkIiwidGFyZ2V0RWxlbWVudCIsImVsZW1lbnRGcm9tUG9pbnQiLCJ0b3VjaGVzIiwidG91Y2giLCJjaGFuZ2VkVG91Y2hlcyIsImluaXRVSUxvZ2ljIiwiY3JlYXRlU3RhcnRCdXR0b24iXSwic291cmNlUm9vdCI6IiJ9