(function(){
  'use strict';

  // Set status bar time
  function setStatusTime(){
    var el = document.getElementById('statusTime');
    if(!el)return;
    var d=new Date();
    var h=d.getHours().toString().padStart(2,'0');
    var m=d.getMinutes().toString().padStart(2,'0');
    el.textContent=h+':'+m;
  }
  setStatusTime();
  setInterval(setStatusTime,30000);

  // Panic hold-to-trigger
  var panicBtn = document.getElementById('panicBtn');
  if(panicBtn){
    var fill = document.getElementById('panicFill');
    var timer = null, startTime = null;
    var DURATION = 4000;

    function triggerPanic(){
      document.body.classList.add('swal-blur');
      Swal.fire({
        icon:'success',
        title:'Alerta de p\u00e1nico enviada',
        text:'Carabineros recibi\u00f3 tu ubicaci\u00f3n',
        background:'#ecfdf5',
        color:'#065f46',
        confirmButtonColor:'#047857',
        confirmButtonText:'Ver estado',
        timer:5000,
        timerProgressBar:true,
        didOpen:function(){document.body.classList.add('swal-blur')},
        willClose:function(){
          document.body.classList.remove('swal-blur');
          window.location.href='screens/seguimiento.html';
        }
      }).then(function(r){
        if(r.isConfirmed) window.location.href='screens/seguimiento.html';
      });
    }

    function startHold(){
      if(timer) return;
      panicBtn.classList.add('holding');
      startTime = Date.now();
      timer = setInterval(function(){
        var pct = Math.min((Date.now()-startTime)/DURATION*100, 100);
        if(fill) fill.style.width = pct+'%';
        if(pct>=100){
          clearInterval(timer); timer=null;
          panicBtn.classList.remove('holding');
          if(fill) fill.style.width = '0%';
          triggerPanic();
        }
      }, 30);
    }

    function cancelHold(){
      if(timer){clearInterval(timer); timer=null;}
      panicBtn.classList.remove('holding');
      if(fill) fill.style.width = '0%';
    }

    panicBtn.addEventListener('mousedown', startHold);
    panicBtn.addEventListener('mouseup', cancelHold);
    panicBtn.addEventListener('mouseleave', cancelHold);
    panicBtn.addEventListener('touchstart', startHold, {passive:true});
    panicBtn.addEventListener('touchend', cancelHold, {passive:true});
    panicBtn.addEventListener('touchcancel', cancelHold, {passive:true});
  }

  // Panic button (large version on panico.html)
  var panicBtnLg = document.getElementById('panicBtnLg');
  if(panicBtnLg){
    var ptimer = null;
    function startP(){
      if(ptimer) return;
      panicBtnLg.classList.add('sending');
      ptimer = setTimeout(function(){
        panicBtnLg.classList.remove('sending');
        document.body.classList.add('swal-blur');
        Swal.fire({
          icon:'success',
          title:'Alerta Enviada',
          text:'Carabineros ha recibido tu ubicaci\u00f3n',
          background:'#ecfdf5',
          color:'#065f46',
          confirmButtonColor:'#047857',
          confirmButtonText:'Ver estado',
          timer:5000,
          timerProgressBar:true,
          didOpen:function(){document.body.classList.add('swal-blur')},
          willClose:function(){
            document.body.classList.remove('swal-blur');
            window.location.href='seguimiento.html';
          }
        }).then(function(r){
          if(r.isConfirmed) window.location.href='seguimiento.html';
        });
        ptimer=null;
      }, 1200);
    }
    function cancelP(){
      if(ptimer){clearTimeout(ptimer); ptimer=null;}
      panicBtnLg.classList.remove('sending');
    }
    panicBtnLg.addEventListener('mousedown', startP);
    panicBtnLg.addEventListener('mouseup', cancelP);
    panicBtnLg.addEventListener('mouseleave', cancelP);
    panicBtnLg.addEventListener('touchstart', startP, {passive:true});
    panicBtnLg.addEventListener('touchend', cancelP, {passive:true});
    panicBtnLg.addEventListener('touchcancel', cancelP, {passive:true});
  }

  // Save button on profile
  var saveBtn = document.getElementById('saveBtn');
  if(saveBtn){
    saveBtn.addEventListener('click', function(){
      var btn=this;
      btn.textContent='Guardado';
      btn.style.opacity='.7';
      setTimeout(function(){
        btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M5 12l5 5L20 7"/></svg> Guardar';
        btn.style.opacity='1';
      }, 1500);
    });
  }

  // Add emergency contact
  var addContactBtn = document.getElementById('addContactBtn');
  if(addContactBtn){
    var contactCount=1;
    addContactBtn.addEventListener('click', function(){
      contactCount++;
      var html='<div class="field" style="animation:fadeIn .3s">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20a8 8 0 0 1 16 0"/></svg>'+
        '<div class="input"><div class="hint">Nombre '+(contactCount+1)+'</div><input type="text" placeholder="Contacto emergencia"></div></div>'+
        '<div class="field" style="animation:fadeIn .3s">'+
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.27 1 .6 2 .95 2.82a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.82.35 1.82.68 2.82.95A2 2 0 0 1 22 16.92z"/></svg>'+
        '<div class="input"><div class="hint">Tel\u00e9fono</div><input type="tel" placeholder="+56 9 XXXX XXXX"></div></div>';
      this.insertAdjacentHTML('beforebegin', html);
      this.style.transform='rotate(45deg)';
      var self=this;
      setTimeout(function(){self.style.transform='rotate(0)';}, 300);
    });
  }

  // Video call mic toggle
  var micBtn = document.getElementById('micBtn');
  if(micBtn){
    micBtn.addEventListener('click', function(){this.classList.toggle('muted');});
  }

  // Video call end
  var endBtn = document.getElementById('endBtn');
  if(endBtn){
    endBtn.addEventListener('click', function(){window.location.href='../index.html';});
  }

})();
