/* ════ src/js/021_v49-first-meaning-fix.js ════ */
try {

(function(){
function fix(){
document.querySelectorAll('#tab-wenxue,#wk-fullscreen').forEach(function(root){
if(root.dataset.v49fixed)return;
var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),n;
while(n=w.nextNode()){
var i=n.nodeValue.indexOf('古之學者必有師');
if(i<0)continue;
var f=document.createDocumentFragment();
f.appendChild(document.createTextNode(n.nodeValue.slice(0,i+4)));
var s=document.createElement('span');s.className='v49-first-bi-meaning';s.textContent='必';f.appendChild(s);
f.appendChild(document.createTextNode(n.nodeValue.slice(i+5)));
n.parentNode.replaceChild(f,n);root.dataset.v49fixed='1';break
}
})
}
document.addEventListener('DOMContentLoaded',function(){fix();var o=new MutationObserver(fix);o.observe(document.body,{childList:true,subtree:true});setTimeout(function(){o.disconnect()},5000)})
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/024_v51-lunyu-js.js ════ */
try {

(function(){
  function apply(w){
    var track=w.querySelector('.zy-track'), vp=w.querySelector('.zy-viewport'), img=w.querySelector('.zy-img');
    if(!track||!vp||!img) return;
    var max=parseInt(w.dataset.max||'0',10), st=parseInt(w.dataset.step||'0',10);
    var tw=img.getBoundingClientRect().width;             /* 長圖實際寬（不受 translate 影響） */
    var over=Math.max(0, tw - vp.clientWidth);
    var x = max>0 ? -(over*st/max) : 0;
    track.style.transform='translateX('+x+'px)';
    w.querySelectorAll('.zy-cap-item').forEach(function(el){ el.classList.toggle('on', parseInt(el.dataset.stop,10)===st); });
    w.querySelectorAll('.zy-lbl').forEach(function(el){ el.classList.toggle('on', parseInt(el.dataset.stop,10)===st); });
    var ind=w.querySelector('.zy-ind'); if(ind) ind.textContent='第 '+(st+1)+' / '+(max+1)+' 段';
    var pv=w.querySelector('.zy-prev'), nx=w.querySelector('.zy-next');
    if(pv) pv.disabled=(st<=0); if(nx) nx.disabled=(st>=max);
  }
  window.zyStep=function(btn,dir){
    var w=btn.closest ? btn.closest('.zy-wrap') : null; if(!w) return;
    var max=parseInt(w.dataset.max||'0',10), st=parseInt(w.dataset.step||'0',10);
    st=Math.max(0,Math.min(max,st+dir)); w.dataset.step=st; apply(w);
  };
  window.zyReset=function(btn){ var w=btn.closest ? btn.closest('.zy-wrap') : null; if(w){ w.dataset.step=0; apply(w); } };
  function initAll(){
    document.querySelectorAll('.zy-wrap').forEach(function(w){
      var img=w.querySelector('.zy-img');
      if(img && !img.dataset.bound){
        img.dataset.bound='1';
        if(img.complete) apply(w); else img.addEventListener('load',function(){ apply(w); });
        /* iPad：viewport 內左右拖曳切換停點（僅影響此圖，不動整頁） */
        var vp=w.querySelector('.zy-viewport'), sx=0, sstep=0, drag=false;
        vp.addEventListener('pointerdown',function(e){ drag=true; sx=e.clientX; sstep=parseInt(w.dataset.step||'0',10); });
        window.addEventListener('pointermove',function(e){
          if(!drag) return; var dx=e.clientX-sx;
          if(Math.abs(dx)>50){ var dir=dx<0?1:-1; var max=parseInt(w.dataset.max||'0',10);
            var st=Math.max(0,Math.min(max,sstep+dir)); w.dataset.step=st; apply(w); drag=false; }
        });
        window.addEventListener('pointerup',function(){ drag=false; });
      }
    });
  }
  var mo=new MutationObserver(function(){ initAll(); });
  window.addEventListener('load',function(){
    initAll();
    var a=document.getElementById('wk-slide-area'); if(a) mo.observe(a,{childList:true,subtree:true});
    var b=document.getElementById('wkfs-body'); if(b) mo.observe(b,{childList:true,subtree:true});
  });
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/026_v51-r2-fixes-js.js ════ */
try {

(function(){
  function restore(el){ try{ if(typeof tpRestorePopup==='function') tpRestorePopup(el); }catch(e){} }
  /* 修正：關閉時同時移除 .show 並「還原」detach 到 body 的浮窗（含紫色 .tp-p） */
  window.closeAllBlueFloatingNotes = function(){
    document.querySelectorAll('.tp-g.show, .tp-z.show, .tp-p.show').forEach(function(el){
      el.classList.remove('show'); restore(el);
    });
    document.querySelectorAll('body > .tp-popup-detached').forEach(function(p){
      p.classList.remove('tp-popup-detached'); p.style.display='none'; p.style.visibility='hidden';
    });
  };
  window.tpCloseAllPopups = window.closeAllBlueFloatingNotes;
  /* 浮窗右上角 ✕ 注入已移除：藍色浮窗（字義{g}/通假{z}/補充{p}）改由再次點擊同一入口關閉（tpTogglePop）。 */
  /* ink 啟用時：畫記層移到 body、z 蓋過浮窗(12000)，使 Apple Pencil 可畫在浮窗上；停用時還原 */
  function inkSync(){
    var st=window.wkInkState, layer=document.getElementById('wk-ink-layer');
    if(!layer||!st) return;
    if(st.active){
      if(layer.parentNode!==document.body){ layer._op=layer.parentNode; layer._on=layer.nextSibling; document.body.appendChild(layer); }
      layer.style.position='fixed'; layer.style.inset='0'; layer.style.zIndex='12500';
      document.body.classList.add('ink-on');
      if(typeof wkInkSetupCanvas==='function') wkInkSetupCanvas();
    }else{
      if(layer._op){ try{ layer._op.insertBefore(layer, layer._on); }catch(e){ layer._op.appendChild(layer);} layer._op=null; }
      layer.style.position=''; layer.style.inset=''; layer.style.zIndex='';
      document.body.classList.remove('ink-on');
      if(typeof wkInkSetupCanvas==='function') wkInkSetupCanvas();
    }
  }
  var _t=window.wkInkToggle;
  if(typeof _t==='function'){ window.wkInkToggle=function(){ _t.apply(this,arguments); inkSync(); }; }
  /* ink 工具列加「✕浮框」（ink 模式下也能關閉浮窗；此鈕在畫記層內、位於 canvas 之上） */
  function addInkCloseBtn(){
    var extra=document.getElementById('wk-ink-extra');
    if(extra && !document.getElementById('wk-ink-closepop')){
      var b=document.createElement('button'); b.type='button'; b.id='wk-ink-closepop'; b.className='wk-ink-btn';
      b.textContent='✕浮框'; b.title='關閉所有浮框';
      b.addEventListener('click', function(){ window.closeAllBlueFloatingNotes(); });
      extra.appendChild(b);
    }
  }
  window.addEventListener('load', function(){
    addInkCloseBtn();
  });
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/030_v54-anno-js.js ════ */
try {

(function(){
  var GY="請抄補充講義 P.34", KB="抄在課本上";
  var FGY="本字總整理 ‧ 對應補充講義：<span class=\"ss-ref\">二、字詞義比較　P.34</span>";
  var FKB="";
  var DATA={
    "師":{ zhuyin:"ㄕ", copy:GY, foot:FGY, senses:[
      { num:"①", def:"老師", ex:["古之學者必有「<b>師</b>」","「<b>師</b>」者，所以傳道、受業、解惑也","惑而不從「<b>師</b>」，其為惑也終不解矣","道之所存，「<b>師</b>」之所存也","愛其子，擇「<b>師</b>」而教之"] },
      { given:true, def:"從師問學的", ex:["「<b>師</b>」道之不傳也久矣","「<b>師</b>」道之不復可知矣"] },
      { num:"②", def:"有專門技藝的人", ex:["巫、醫、樂「<b>師</b>」、百工之人","孔子師郯子、萇弘、「<b>師</b>」襄、老聃"] },
      { num:"③", def:"學習", ex:["生乎吾前，其聞道也，固先乎吾，吾從而「<b>師</b>」之","吾「<b>師</b>」道也，夫庸知其年之先後生於吾乎","於其身也則恥「<b>師</b>」焉","巫、醫、樂師、百工之人，不恥相「<b>師</b>」","孔子「<b>師</b>」郯子、萇弘、師襄、老聃"] }
    ]},
    "所以":{ copy:GY, foot:FGY, senses:[
      { given:true, def:"用來（表目的）", ex:["「<b>師</b>」者，「<b>所以</b>」傳道、受業、解惑也"] },
      { given:true, def:"為何（表原因）", ex:["聖人之「<b>所以</b>」為聖，愚人之「<b>所以</b>」為愚"] }
    ]},
    "貽":{ zhuyin:"一ˊ", copy:GY, foot:FGY, senses:[
      { given:true, def:"贈送", ex:["作〈師說〉以「<b>貽</b>」之"] },
      { given:true, def:"遺留", ex:["「<b>貽</b>」笑大方","「<b>貽</b>」害無窮","「<b>貽</b>」人口實"] }
    ]},
    "賤":{ zhuyin:"ㄐㄧㄢˋ", copy:GY, foot:FGY, senses:[
      { given:true, def:"地位低", ex:["是故無貴無「<b>賤</b>」、無長無少","貧「<b>賤</b>」夫妻百事哀"] },
      { given:true, def:"價格低廉", ex:["「<b>賤</b>」價出售"] },
      { given:true, def:"輕視", ex:["貴古「<b>賤</b>」今","貴遠「<b>賤</b>」近"] },
      { given:true, def:"謙稱自己的", ex:["「<b>賤</b>」息"] },
      { given:true, def:"輕佻不自重", ex:["輕「<b>賤</b>」"] }
    ]},
    "不恥不齒":{ title:"不恥／不齒", glyph:"辨", copy:GY, foot:FGY, senses:[
      { term:"不恥", def:"不以……為恥", ex:["「<b>不恥</b>」相師","「<b>不恥</b>」下問"] },
      { term:"不齒", def:"不屑與之並列", ex:["君子「<b>不齒</b>」"] }
    ]},
    "庸":{ zhuyin:"ㄩㄥ", copy:KB, foot:FKB, senses:[
      { given:true, def:"豈、何必", ex:["夫「<b>庸</b>」知其年之先後生於吾乎？"] },
      { given:true, def:"愚笨、拙劣的", ex:["「<b>庸</b>」奴、「<b>庸</b>」醫"] },
      { given:true, def:"平常的、普通的", ex:["平「<b>庸</b>」"] },
      { given:true, def:"需要", ex:["無「<b>庸</b>」置疑"] },
      { given:true, def:"酬謝", ex:["酬「<b>庸</b>」"] }
    ]},
    "之":{ zhuyin:"ㄓ", copy:KB, foot:FKB, senses:[
      { given:true, def:"助詞，的", ex:["古「<b>之</b>」學者","道「<b>之</b>」所存"] },
      { given:true, def:"代詞（指道、業）", ex:["人非生而知「<b>之</b>」者","作〈師說〉以貽「<b>之</b>」"] },
      { given:true, def:"主謂之間，取消句子獨立性", ex:["師道「<b>之</b>」不傳也久矣","句讀「<b>之</b>」不知"] }
    ]},
    "者":{ zhuyin:"ㄓㄜˇ", copy:KB, foot:FKB, senses:[
      { given:true, def:"代詞，……的人", ex:["古之學「<b>者</b>」必有師","人非生而知之「<b>者</b>」"] },
      { given:true, def:"助詞，句中表停頓", ex:["「<b>師者</b>」，所以傳道、受業、解惑也"] }
    ]},
    "於":{ zhuyin:"ㄩˊ", copy:KB, foot:FKB, senses:[
      { given:true, def:"向", ex:["恥學「<b>於</b>」師","請學「<b>於</b>」余"] },
      { given:true, def:"從、由", ex:["其皆出「<b>於</b>」此乎"] },
      { given:true, def:"對於", ex:["「<b>於</b>」其身也，則恥師焉"] },
      { given:true, def:"比（引進比較對象）", ex:["師不必賢「<b>於</b>」弟子"] },
      { given:true, def:"被（表被動）", ex:["不拘「<b>於</b>」時"] }
    ]},
    "其":{ zhuyin:"ㄑㄧˊ", copy:KB, foot:FKB, senses:[
      { given:true, def:"那些（代詞）", ex:["「<b>其</b>」為惑也，終不解矣"] },
      { given:true, def:"大概（推測語氣）", ex:["「<b>其</b>」皆出於此乎"] },
      { given:true, def:"他、他們（代詞）", ex:["余嘉「<b>其</b>」能行古道"] }
    ]},
    "學者":{ glyph:"學者", copy:KB, foot:FKB, senses:[
      { given:true, def:"古義：求學的人", ex:["古之「<b>學者</b>」必有師"] },
      { given:true, def:"今義：學問淵博而有成就的人", ex:["（今用）他是一位「<b>學者</b>」"] }
    ]}
  };
  var CONFIG=[
    { key:"師", anchor:"師不必賢於弟子", beforePhrase:"不必賢" },
    { key:"庸", anchor:"夫庸知其年", ch:"庸" },
    { key:"賤", anchor:"無貴無賤", ch:"賤" },
    { key:"所以", anchor:"愚人之所以為愚", ch:"所以" },
    { key:"者", anchor:"解其惑者也", ch:"者" },
    { key:"不恥不齒", anchor:"君子不齒", ch:"不齒" },
    { key:"於", anchor:"請學於余", ch:"於" },
    { key:"其", anchor:"余嘉其能行古道", ch:"其" },
    { key:"貽", anchor:"以貽", ch:"貽" },
    { key:"之", anchor:"以貽", ch:"之" },
    { key:"學者", anchor:"古之學者", ch:"學者" }
  ];
  var ov=null;
  function build(){
    ov=document.createElement('div'); ov.id='ss-anno-ov';
    ov.innerHTML='<div class="ss-sheet"><div class="ss-head"><svg viewBox="0 0 900 80" preserveAspectRatio="none"><g fill="none" stroke="#C9A227" stroke-width="1"><path d="M-20 60 C 120 26 160 78 300 46 S 520 14 680 52 S 860 34 940 50" opacity=".8"/><path d="M-20 68 C 120 36 160 86 300 54 S 520 24 680 60 S 860 44 940 58" opacity=".5"/></g></svg><div class="ss-hr"><span class="ss-ttl" id="ss-ttl"></span><span class="ss-copy" id="ss-copy"></span><button class="ss-close" id="ss-close">返回課文 ↩</button></div></div><div class="ss-tools"><span style="font-size:12px;color:#8A8368">字級</span><input type="range" id="ss-size" min="15" max="30" step="1" value="19"><span id="ss-sizeout" style="font-size:12px;color:#9A7A12">19px</span></div><div class="ss-body" id="ss-body"></div></div>';
    document.body.appendChild(ov);
    ov.addEventListener('click',function(e){ if(e.target===ov) hide(); });
    ov.querySelector('#ss-close').addEventListener('click',hide);
    var sz=ov.querySelector('#ss-size'), so=ov.querySelector('#ss-sizeout'), body=ov.querySelector('#ss-body');
    sz.addEventListener('input',function(){ body.style.setProperty('--rt',sz.value+'px'); so.textContent=sz.value+'px'; });
  }
  function exList(arr){ return '<ol class="ss-exs">'+arr.map(function(e){ return '<li>'+e+'</li>'; }).join('')+'</ol>'; }
  function render(key){
    var d=DATA[key]; if(!d) return;
    var glyph=d.glyph||key;
    ov.querySelector('#ss-ttl').textContent='〈師說〉字義總整理：'+(d.title||key);
    ov.querySelector('#ss-copy').textContent=d.copy;
    var n=d.senses.length;
    var gcls='ss-glyph'+((glyph.length>1)?' ss-glyph-sm':'');
    var h='<div class="ss-yi"><div class="ss-big"><span class="ss-tri">▲</span><span class="'+gcls+'">'+glyph+'</span>'+(d.zhuyin?'<span class="ss-rv" data-v="'+d.zhuyin+'" style="min-width:56px">音</span>':'')+'</div><div class="ss-tbl">';
    d.senses.forEach(function(s,i){
      var last=(i===n-1)?' ss-last':'';
      var c1=s.num?'<span class="ss-bnum">'+s.num+'</span>':(s.term?'<span class="ss-term">'+s.term+'</span>':'');
      h+='<div class="ss-c ss-c-num'+last+'">'+c1+'</div>';
      h+='<div class="ss-c ss-c-yi'+last+'">'+(s.given&&!s.term?'<span class="ss-given">'+s.def+'</span>':'<span class="ss-rv" data-v="'+s.def+'">義</span>')+'</div>';
      h+='<div class="ss-c ss-c-ex'+last+'">'+exList(s.ex)+'</div>';
    });
    h+='</div></div>'+(d.foot?'<div class="ss-foot">'+d.foot+'</div>':'');
    var body=ov.querySelector('#ss-body'); body.innerHTML=h; body.scrollTop=0;
    body.querySelectorAll('.ss-rv').forEach(function(el){ el.dataset.label=el.textContent; el.addEventListener('click',function(){
      if(el.classList.contains('open')){ el.classList.remove('open'); el.textContent=el.dataset.label; }
      else{ el.classList.add('open'); el.textContent=el.dataset.v; }
    }); });
  }
  function show(key){ if(!ov) build(); render(key); ov.classList.add('show'); }
  function hide(){ if(ov) ov.classList.remove('show'); }
  window.ssOpenAnno=show;
  function makeBox(key){ var b=document.createElement('span'); b.className='ss-zong'; b.setAttribute('data-k',key); b.textContent='總'; b.title=key+' 字義總整理（點開）'; b.addEventListener('click',function(e){ e.stopPropagation(); show(key); }); return b; }
  function visText(l){ var s='', w=document.createTreeWalker(l, NodeFilter.SHOW_TEXT, null), n; while((n=w.nextNode())){ var pe=n.parentElement; if(pe && pe.offsetParent!==null) s+=n.nodeValue; } return s; }
  function injectOne(cfg, area){
    var lines=area.querySelectorAll('.tp-line'); var target=null;
    lines.forEach(function(l){ if(l.offsetParent!==null && visText(l).indexOf(cfg.anchor)>=0) target=l; });
    if(!target) return;
    var existing=target.querySelector('.ss-zong[data-k="'+cfg.key+'"]');
    if(existing){ if(existing.offsetParent!==null) return; existing.remove(); }
    var box=makeBox(cfg.key), placed=false;
    if(cfg.beforePhrase){
      var w=document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null), n;
      while((n=w.nextNode())){ if(n.nodeValue.indexOf(cfg.beforePhrase)<0) continue; var pe=n.parentElement; if(!pe||pe.offsetParent===null) continue; pe.parentNode.insertBefore(box, pe); placed=true; break; }
    } else {
      var w2=document.createTreeWalker(target, NodeFilter.SHOW_TEXT, null), m, lastNode=null, lastIdx=-1;
      while((m=w2.nextNode())){ var pe2=m.parentElement; if(!pe2||pe2.offsetParent===null) continue; var i=m.nodeValue.lastIndexOf(cfg.ch); if(i>=0){ lastNode=m; lastIdx=i; } }
      if(lastNode){ var after=lastNode.splitText(lastIdx+cfg.ch.length); after.parentNode.insertBefore(box, after); placed=true; }
    }
    if(!placed) target.appendChild(box);
  }
  function injectArea(area){ if(!area) return; try{ area.querySelectorAll('.tp-more').forEach(function(m){ m.remove(); }); }catch(e){} CONFIG.forEach(function(cfg){ try{ injectOne(cfg, area); }catch(e){} }); }
  /* 一般檢視與全螢幕投影都注入「總」框（injectOne 具冪等檢查，重入不會重複） */
  function inject(){ try{ injectArea(document.getElementById('wk-slide-area')); injectArea(document.getElementById('wkfs-body')); }catch(e){} }
  function start(){ inject(); ['wk-slide-area','wkfs-body'].forEach(function(id){ try{ var area=document.getElementById(id); if(area){ new MutationObserver(function(){ inject(); }).observe(area,{childList:true,subtree:true}); } }catch(e){} }); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',start); else start();
  window.addEventListener('load',inject);
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/032_v55-popup-connector-js.js ════ */
try {

/* ── 浮框連接（尖角/引線）＋ 多排永不重疊（不改核心；包裝 tpPlacePopup / tpRestorePopup）──
   ‧ 每個開啟的字義/注音/補充浮框，往上下多排找到不重疊的位置（絕不回退成重疊）
   ‧ 貼近字的框畫小尖角、被推遠的框改畫引線，連回它對應的字
   ‧ 換頁/關閉時清乾淨連接層，避免殘影 */
(function(){
  var NS='http://www.w3.org/2000/svg';
  var svg=null, map=new Map(), uid=0;
  var GAP=3, ROWGAP=6, PAD=4, NEAR=26, S=7;

  function ensureSvg(){
    if(svg && svg.isConnected) return svg;
    svg=document.getElementById('tp-conn-svg');
    if(!svg){
      svg=document.createElementNS(NS,'svg');
      svg.id='tp-conn-svg';
      svg.setAttribute('style','position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:11999;overflow:visible');
      document.body.appendChild(svg);
    }
    return svg;
  }
  function keyOf(el){ if(!el._tpConnId) el._tpConnId='c'+(++uid); return el._tpConnId; }
  function getPop(el){ return el._tpPopup || el.querySelector('.tp-gd,.tp-pd,.tp-zd'); }
  function colorOf(el){
    var p=getPop(el);
    if(p){ var c=getComputedStyle(p).borderTopColor; if(c && c!=='rgba(0, 0, 0, 0)' && c!=='transparent') return c; }
    return '#1f6fb2';
  }
  function boundsOf(el){
    try{ if(typeof tpPopupBounds==='function'){ var b=tpPopupBounds(el); if(b && isFinite(b.left)) return b; } }catch(e){}
    return {left:8, right:window.innerWidth-8, top:8, bottom:window.innerHeight-8};
  }
  function openEls(){ return [].slice.call(document.querySelectorAll('.tp-g.show,.tp-p.show,.tp-z.show')); }
  function othersRects(except){
    return openEls().filter(function(x){ return x!==except; })
      .map(function(x){ var p=getPop(x); return p?p.getBoundingClientRect():null; })
      .filter(Boolean);
  }

  /* 多排永不重疊：上0,下0,上1,下1,… 找第一個不撞其他框的位置 */
  function resolve(el){
    var pop=getPop(el); if(!pop) return;
    var a=el.getBoundingClientRect(), pr=pop.getBoundingClientRect();
    var W=pr.width, H=pr.height; if(!W||!H) return;
    var b=boundsOf(el), ax=a.left+a.width/2, others=othersRects(el);
    function clampX(x){ return Math.max(b.left, Math.min(x, b.right - W)); }
    function hit(r){ return others.some(function(o){ return !(r.right<=o.left-PAD||r.left>=o.right+PAD||r.bottom<=o.top-PAD||r.top>=o.bottom+PAD); }); }
    var xs=[ax-W/2, a.left, a.right-W, ax-W/2-22, ax-W/2+22].map(clampX);
    var chosen=null;
    for(var k=0;k<9 && !chosen;k++){
      var bands=[ {y:a.top-GAP-H-k*(H+ROWGAP), below:false}, {y:a.bottom+GAP+k*(H+ROWGAP), below:true} ];
      for(var bi=0; bi<bands.length && !chosen; bi++){
        var Y=bands[bi].y; if(Y<b.top || Y+H>b.bottom) continue;
        for(var xi=0; xi<xs.length; xi++){
          var r={left:xs[xi], right:xs[xi]+W, top:Y, bottom:Y+H};
          if(!hit(r)){ chosen={x:xs[xi], y:Y, below:bands[bi].below}; break; }
        }
      }
    }
    if(!chosen) chosen={x:clampX(ax-W/2), y:Math.min(b.bottom-H, a.bottom+GAP), below:true};
    pop.style.left=Math.round(chosen.x)+'px';
    pop.style.top=Math.round(chosen.y)+'px';
    el.classList.toggle('tp-pop-below', !!chosen.below);
  }

  function draw(el){
    if(!el || !el.isConnected || !el.classList.contains('show')){ remove(el); return; }
    var pop=getPop(el); if(!pop){ remove(el); return; }
    var a=el.getBoundingClientRect(), p=pop.getBoundingClientRect();
    if(!a.width || !p.width){ remove(el); return; }
    var ax=a.left+a.width/2;
    var above=(p.top+p.height/2) < (a.top+a.height/2);
    var edgeY=above ? p.bottom : p.top, tipY=above ? a.top : a.bottom;
    var vgap=above ? (a.top-p.bottom) : (p.top-a.bottom);
    var inSpan=(ax >= p.left+S+2) && (ax <= p.right-S-2);
    var col=(colorOf(el)||'#1f6fb2').trim();
    var g=map.get(keyOf(el));
    if(!g){
      var s=ensureSvg();
      g={el:el};
      g.tri=document.createElementNS(NS,'polygon');
      g.line=document.createElementNS(NS,'line');
      g.dot=document.createElementNS(NS,'circle'); g.dot.setAttribute('r','2.4');
      s.appendChild(g.line); s.appendChild(g.dot); s.appendChild(g.tri);
      map.set(el._tpConnId, g);
    }
    if(inSpan && vgap<=NEAR){
      var apexY=above ? (edgeY+Math.min(9,Math.max(5,tipY-edgeY+4))) : (edgeY-Math.min(9,Math.max(5,edgeY-tipY+4)));
      g.tri.setAttribute('points', (ax-S)+','+edgeY+' '+(ax+S)+','+edgeY+' '+ax+','+apexY);
      g.tri.setAttribute('fill',col); g.tri.setAttribute('stroke','#fff'); g.tri.setAttribute('stroke-width','1');
      g.tri.style.display=''; g.line.style.display='none'; g.dot.style.display='none';
    } else {
      var px=Math.max(p.left+10, Math.min(ax, p.right-10));
      g.line.setAttribute('x1',ax); g.line.setAttribute('y1',tipY); g.line.setAttribute('x2',px); g.line.setAttribute('y2',edgeY);
      g.line.setAttribute('stroke',col); g.line.setAttribute('stroke-width','1.6'); g.line.setAttribute('stroke-opacity','0.75'); g.line.setAttribute('stroke-linecap','round');
      g.dot.setAttribute('cx',ax); g.dot.setAttribute('cy',tipY); g.dot.setAttribute('fill',col);
      g.line.style.display=''; g.dot.style.display=''; g.tri.style.display='none';
    }
  }
  function remove(el){
    if(!el || !el._tpConnId) return;
    var g=map.get(el._tpConnId);
    if(g){ if(g.tri)g.tri.remove(); if(g.line)g.line.remove(); if(g.dot)g.dot.remove(); map.delete(el._tpConnId); }
  }
  /* 清孤兒：字已不在 DOM、或已不再顯示的連接，一律移除（修殘影） */
  function prune(){
    map.forEach(function(g, key){
      var el=g.el;
      if(!el || !el.isConnected || !el.classList.contains('show')){
        if(g.tri)g.tri.remove(); if(g.line)g.line.remove(); if(g.dot)g.dot.remove(); map.delete(key);
      }
    });
  }
  function clearAll(){
    map.forEach(function(g){ if(g.tri)g.tri.remove(); if(g.line)g.line.remove(); if(g.dot)g.dot.remove(); });
    map.clear();
  }
  function relayoutAll(){ prune(); openEls().forEach(function(el){ try{ resolve(el); }catch(e){} }); openEls().forEach(function(el){ try{ draw(el); }catch(e){} }); }
  window.tpConnRelayout=relayoutAll;

  function wrap(){
    if(typeof window.tpPlacePopup==='function' && !window.tpPlacePopup._connWrapped){
      var _p=window.tpPlacePopup;
      window.tpPlacePopup=function(el){ _p(el); try{ resolve(el); draw(el); }catch(e){} };
      window.tpPlacePopup._connWrapped=true;
    }
    if(typeof window.tpRestorePopup==='function' && !window.tpRestorePopup._connWrapped){
      var _r=window.tpRestorePopup;
      window.tpRestorePopup=function(el){ try{ remove(el); }catch(e){} _r(el); setTimeout(prune,0); };
      window.tpRestorePopup._connWrapped=true;
    }
  }
  wrap();
  if(!(window.tpPlacePopup && window.tpPlacePopup._connWrapped)) setTimeout(wrap,300);

  var raf=null;
  function onMove(){ if(raf) return; raf=requestAnimationFrame(function(){ raf=null; prune(); openEls().forEach(draw); }); }
  window.addEventListener('scroll', onMove, true);
  window.addEventListener('resize', onMove);

  /* 清孤兒浮窗：換頁後「字錨」被重建，但先前搬到 body 的浮窗本體（tp-popup-detached，
     display:block!important）會殘留可見。凡是已無「連線中且顯示中的字錨」持有的浮窗，一律收起。 */
  function cleanOrphanPopups(){
    var owned=new Set();
    openEls().forEach(function(el){ if(el._tpPopup) owned.add(el._tpPopup); });
    document.querySelectorAll('body > .tp-popup-detached').forEach(function(pop){
      if(!owned.has(pop)){
        pop.classList.remove('tp-popup-detached');
        pop.style.display='none'; pop.style.visibility='hidden';
      }
    });
  }
  /* 換頁重繪：課文區/全螢幕內容被重建時，對應的字元素被取代 → prune 清孤兒連接、
     cleanOrphanPopups 收孤兒浮窗，避免殘影；切換修辭/句意圖層等不移除字的變動則保留。 */
  var praf=null;
  function onMutate(){ if(praf) return; praf=requestAnimationFrame(function(){ praf=null; cleanOrphanPopups(); prune(); }); }
  function watch(id){ var n=document.getElementById(id); if(n) new MutationObserver(onMutate).observe(n,{childList:true,subtree:true}); }
  function startWatch(){ watch('wk-slide-area'); watch('wkfs-body'); }
  if(document.readyState==='loading') window.addEventListener('load', startWatch); else startWatch();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/033_v56-note-quiz-js.js ════ */
try {

(function(){
  function nqExtractAnnotations(text){
    var out = [];
    var re = /\{n:(\d+)\|/g;
    var m;
    while ((m = re.exec(text)) !== null) {
      var no = parseInt(m[1], 10);
      var i = m.index + m[0].length;
      var depth = 1;
      var raw = '';
      while (i < text.length && depth > 0) {
        var c = text[i];
        if (c === '{') depth++;
        else if (c === '}') { depth--; if (depth === 0) break; }
        raw += c;
        i++;
      }
      out.push({ no: no, rawWord: raw });
      re.lastIndex = i + 1;
    }
    return out;
  }
  function nqCleanNested(raw){
    return raw.replace(/\{[gzpy]:([^|}]*)\|[^}]*\}/g, '$1');
  }
  function nqStripMarkupWhole(text){
    var result = '';
    var i = 0;
    while (i < text.length) {
      if (text[i] === '{') {
        var tagMatch = /^\{([nzgpy]):(\d+\|)?/.exec(text.slice(i));
        if (tagMatch) {
          var tagType = tagMatch[1];
          var colonIdx = text.indexOf(':', i);
          var k = colonIdx + 1;
          var numMatch = /^\d+\|/.exec(text.slice(k));
          if (numMatch) k += numMatch[0].length;
          // 逐字掃描找出這個標記對應的巢狀安全結尾 '}'，同時記錄「最外層（depth 1）」第一個 '|' 的位置，
          // 只有 g/z/p/y 這種「字|釋義」型標記才需要用它切掉後面的釋義；n 標記的內容整段都是字面文字。
          var content = '';
          var depth = 1;
          var p = k;
          var topPipeRel = -1;
          while (p < text.length && depth > 0) {
            var c = text[p];
            if (c === '{') depth++;
            else if (c === '}') { depth--; if (depth === 0) break; }
            else if (c === '|' && depth === 1 && topPipeRel < 0) topPipeRel = content.length;
            content += c;
            p++;
          }
          var literal;
          if (tagType !== 'n' && topPipeRel >= 0) {
            literal = content.slice(0, topPipeRel);
          } else {
            literal = content;
          }
          result += nqStripMarkupWhole(literal);
          i = p + 1;
          continue;
        }
      }
      result += text[i];
      i++;
    }
    return result;
  }
  var NQ_PUNCT_RE = /[、，,。！？「」『』：；\s]/g;
  function nqNorm(s){ return String(s).replace(NQ_PUNCT_RE, ''); }
  function nqStripTags(html){ return String(html).replace(/<[^>]+>/g, ''); }

  function nqResolveAnswer(word, segNotes){
    var normWord = nqNorm(word);
    for (var i=0;i<segNotes.length;i++){
      if (nqNorm(segNotes[i][0]) === normWord) return { answer: segNotes[i][1], how:'exact' };
    }
    var PREFIX_LEN = 4;
    var candidates = segNotes.filter(function(nItem){
      var nk = nqNorm(nItem[0]);
      if (nk.indexOf(normWord) >= 0 || normWord.indexOf(nk) >= 0) return true;
      var plen = Math.min(PREFIX_LEN, nk.length, normWord.length);
      if (plen >= PREFIX_LEN && nk.slice(0, plen) === normWord.slice(0, plen)) return true;
      return false;
    });
    candidates = candidates.sort(function(a,b){ return nqNorm(b[0]).length - nqNorm(a[0]).length; });
    if (candidates.length) {
      var best = candidates[0];
      var plain = nqStripTags(best[1]);
      var escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      var inlineRe = new RegExp(escaped + '[，,：:]([^。]+)。');
      var im = inlineRe.exec(plain);
      if (im) return { answer: word + '，' + im[1] + '。', how:'inline' };
      return { answer: plain, how:'whole' };
    }
    return null;
  }

  var nqBankCache = {};
  function wkBuildNoteBank(lessonKey){
    if (nqBankCache[lessonKey]) return nqBankCache[lessonKey];
    var entry = (typeof TEXTBOOK !== 'undefined') ? TEXTBOOK[lessonKey] : null;
    var bank = [];
    if (entry && Array.isArray(entry.textPages)) {
      entry.textPages.forEach(function(seg){
        var segNotes = Array.isArray(seg.notes) ? seg.notes : [];
        var lines = Array.isArray(seg.lines) ? seg.lines : [];
        lines.forEach(function(line){
          var text = line.text || '';
          var anns = nqExtractAnnotations(text);
          if (!anns.length) return;
          var sentence = nqStripMarkupWhole(text);
          anns.forEach(function(a){
            var word = nqCleanNested(a.rawWord);
            var resolved = nqResolveAnswer(word, segNotes);
            if (resolved) {
              bank.push({ no:a.no, word:word, sentence:sentence, answer:resolved.answer });
            }
          });
        });
      });
    }
    bank.sort(function(a,b){ return a.no - b.no; });
    nqBankCache[lessonKey] = bank;
    return bank;
  }

  /* RayOclass 4b：舊版出題面板（nqStart／nqAll／nqClose／nqToggle）已刪，新版在 036_v56-nq2-js；這裡只留題庫 wkBuildNoteBank */
  window.wkBuildNoteBank = wkBuildNoteBank;
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/036_v56-nq2-js.js ════ */
try {

(function(){
  /* ───────── 題庫：即時從 TEXTBOOK 解析（新課只要有 textPages 就自動出現） ─────────
     基本題目沿用 v55 的 wkBuildNoteBank()（[註號, 目標詞, 原句, 答案]）；
     另外算出：①目標詞在原句中的實際位置（同字多次出現時標對那一個）
               ②「整句＋小字詞」型註釋的出題選項（依註釋原文「詞，解釋。」切出，不改寫內容） */
  var PUN = /[、，,。！？「」『』：；\s]/;
  function norm(s){ return String(s).replace(/[、，,。！？「」『』：；\s]/g, ''); }
  var SPAN_RE = /<span class='(bk|zy)-note'>[\s\S]*?<\/span>/g;
  function spansOf(h){ return (String(h).match(SPAN_RE) || []).join(''); }
  function noSpan(h){ return String(h).replace(SPAN_RE, '').replace(/<[^>]+>/g, ''); }
  // 與 v55 nqStripMarkupWhole 相同邏輯：把 {n:}/{g:}/{z:}/{p:}/{y:} 攤平成純文字
  function strip(text){
    var result = '', i = 0;
    while (i < text.length){
      if (text[i] === '{'){
        var tm = /^\{([nzgpy]):(\d+\|)?/.exec(text.slice(i));
        if (tm){
          var tt = tm[1], k = text.indexOf(':', i) + 1;
          var nm = /^\d+\|/.exec(text.slice(k)); if (nm) k += nm[0].length;
          var content = '', depth = 1, p = k, tp = -1;
          while (p < text.length && depth > 0){
            var c = text[p];
            if (c === '{') depth++;
            else if (c === '}'){ depth--; if (depth === 0) break; }
            else if (c === '|' && depth === 1 && tp < 0) tp = content.length;
            content += c; p++;
          }
          result += strip((tt !== 'n' && tp >= 0) ? content.slice(0, tp) : content);
          i = p + 1; continue;
        }
      }
      result += text[i]; i++;
    }
    return result;
  }
  function clean(raw){ return raw.replace(/\{[gzpy]:([^|}]*)\|[^}]*\}/g, '$1'); }
  // 與 v55 nqResolveAnswer 相同的候選規則，但回傳整條 note
  function findNote(word, notes){
    var nw = norm(word);
    for (var i = 0; i < notes.length; i++) if (norm(notes[i][0]) === nw) return notes[i];
    var c = notes.filter(function(n){
      var nk = norm(n[0]);
      if (nk.indexOf(nw) >= 0 || nw.indexOf(nk) >= 0) return true;
      var pl = Math.min(4, nk.length, nw.length);
      return pl >= 4 && nk.slice(0, pl) === nw.slice(0, pl);
    }).sort(function(a, b){ return norm(b[0]).length - norm(a[0]).length; });
    return c[0] || null;
  }
  // 在原句中找「忽略標點」的片語，回傳 [起, 迄)
  function spanOf(s, phrase, from){
    var np = norm(phrase); if (!np) return null;
    for (var st = from || 0; st < s.length; st++){
      if (PUN.test(s[st])) continue;
      var k = 0, j = st;
      while (j < s.length && k < np.length){
        if (PUN.test(s[j])){ j++; continue; }
        if (s[j] !== np[k]) break;
        j++; k++;
      }
      if (k === np.length) return [st, j];
    }
    return null;
  }
  function isZhuyin(t){ return /^[ㄅ-ㄩˊˇˋ˙\s]+$/.test(t) || /^音/.test(t); }

  function buildVariants(row, L){
    if (!row || !row.note) return null;
    var key = row.note[0], html = row.note[1], s = row.sentence;
    if (norm(key).length < 3) return null;
    var whole = spanOf(s, key);
    if (!whole){ var q = /「(.+?)」/.exec(key); if (q && spanOf(s, q[1])) whole = [row.pos, row.pos + row.word.length]; }
    if (!whole) return null;                        // 註釋詞不在這一句 → 不拆
    var segs = noSpan(html).split(/(?<=[。？！])/).map(function(x){ return x.trim(); }).filter(Boolean);
    var main = [], subs = [];
    segs.forEach(function(sg){
      var body = sg.replace(/[。]$/, '');
      // v58：詞中每個字後可帶注音（如「饑（ㄐㄧ）饉（ㄐㄧㄣˇ），荒年」）；註釋標題為簡寫時，詞出現在原句中也可拆
      var mm = /^((?:[^，。（）「」『』？！、](?:（[^）]*）)?){1,6})，(.+)$/.exec(body);
      var mw = mm ? mm[1].replace(/（[^）]*）/g, '') : '';
      if (mm && (norm(key).indexOf(norm(mw)) >= 0 || norm(s).indexOf(norm(mw)) >= 0) && norm(mw) !== norm(key)){
        subs.push({ w: mw, a: mm[2] + '。' });
      } else if (!subs.length) main.push(sg);
      else subs[subs.length - 1].a += sg;
    });
    var good = subs.filter(function(x){ return !isZhuyin(x.a.replace(/。$/, '')); });
    if (!good.length || !main.length) return null;
    var vs = [[s.slice(whole[0], whole[1]), whole[0], whole[1], main.join('') + spansOf(html), 'whole']];
    good.forEach(function(x){
      // v58：同字多次出現時，依 NQ_SUB_POS 手動指定整句範圍內第幾個（見檔尾 v58-nq-subpos-js）
      var nth = (window.NQ_SUB_POS || {})[L + '|' + row.no + '|' + x.w], sp = null;
      if (nth){ var from = whole[0]; for (var ni = 0; ni < nth; ni++){ sp = spanOf(s, x.w, from); if (!sp) break; from = sp[1]; } }
      if (!sp) sp = spanOf(s, x.w, whole[0]) || spanOf(s, x.w, 0);
      if (sp) vs.push([x.w, sp[0], sp[1], x.a, 'sub']);
    });
    return vs.length >= 2 ? vs : null;
  }

  var bankCache = {};
  function buildLesson(L){
    if (bankCache[L]) return bankCache[L];
    var bank = (typeof wkBuildNoteBank === 'function') ? wkBuildNoteBank(L) : [];
    var rows = [];
    ((TEXTBOOK[L] || {}).textPages || []).forEach(function(seg){
      var notes = seg.notes || [];
      (seg.lines || []).forEach(function(line){
        var t = line.text || '', re = /\{n:(\d+)\|/g, m;
        while ((m = re.exec(t))){
          var i = m.index + m[0].length, d = 1, raw = '';
          while (i < t.length && d > 0){ var c = t[i]; if (c === '{') d++; else if (c === '}'){ d--; if (!d) break; } raw += c; i++; }
          var w = clean(raw);
          rows.push({ no: +m[1], word: w, sentence: strip(t), pos: strip(t.slice(0, m.index)).length, note: findNote(w, notes) });
        }
      });
    });
    rows.sort(function(a, b){ return a.no - b.no; });
    var items = [], pos = [], vars = {}, r = 0;
    bank.forEach(function(b, bi){
      while (r < rows.length && !(rows[r].no === b.no && rows[r].sentence === b.sentence && rows[r].word === b.word)) r++;
      var row = rows[r++];
      items.push([b.no, b.word, b.sentence, b.answer]);
      pos.push(row && row.sentence.substr(row.pos, b.word.length) === b.word ? row.pos : b.sentence.indexOf(b.word));
      var vs = buildVariants(row, L);
      if (vs) vars[bi] = vs;
    });
    // v59：收集本課所有 bk-note（補充）純文字，小考答案顯示時去除
    var bk = [];
    ((TEXTBOOK[L] || {}).textPages || []).forEach(function(seg){ (seg.notes || []).forEach(function(n){
      (String(n[1]).match(/<span class='bk-note'>[\s\S]*?<\/span>/g) || []).forEach(function(h){ bk.push(h.replace(/<[^>]+>/g, '')); });
    }); });
    return (bankCache[L] = { lesson: L, items: items, pos: pos, vars: vars, bk: bk });
  }
  function eligibleLessons(){
    var seen = {}, out = [];
    [].concat(typeof WK_14 !== 'undefined' ? WK_14 : [], typeof WK_EXTRA !== 'undefined' ? WK_EXTRA : [], typeof WK_PROSE !== 'undefined' ? WK_PROSE : [])
      .forEach(function(k){
        if (seen[k]) return; seen[k] = true;
        var e = (typeof TEXTBOOK !== 'undefined') ? TEXTBOOK[k] : null;
        if (e && Array.isArray(e.textPages) && e.textPages.length) out.push(k);
      });
    return out;
  }

  /* ───────── 小工具 ───────── */
  function $(id){ return document.getElementById('nq2-' + id); }
  var LS = {
    get: function(k, d){ try{ var v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); }catch(e){ return d; } },
    set: function(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
  };
  function esc(s){ return String(s).replace(/[&<>"']/g, function(m){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]; }); }
  function shuffle(a){ a = a.slice(); for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function byIdx(a, b){ return a - b; }

  var LESSONS = [], D = null;   // D = 目前課次 buildLesson() 結果
  var sel = [], excl = new Set(), must = new Set(), mode = 'pick';
  // V142：拆題註釋的小字詞標記 vmark[i] = { 選項字詞: 'must'|'ex' }（一條註釋最多一個必考小字詞；至少留一個可考）
  var vmark = {};
  // V143：日曆預排小考帶入的小字詞標記（只用在這一次，不存；同一條註釋以日曆為準）
  var vOver = {};
  function vmOf(i){ return vOver[i] || vmark[i] || {}; }
  function items(){ return D ? D.items : []; }
  function itemKey(it){ return it[0] + '|' + it[1]; }
  function exKey(){ return 'nq-excl:' + D.lesson; }
  function muKey(){ return 'nq-must:' + D.lesson; }
  function vmKey(){ return 'nq-vmark:' + D.lesson; }
  function varCount(i){ return (D.vars[i] || []).length; }
  function chipLabel(i){ return varCount(i) ? D.vars[i][0][0] : items()[i][1]; }
  function vName(v){ return v[4] === 'whole' ? '整句' : v[0]; }
  function vMust(i){ var m = vmOf(i); return (D.vars[i] || []).filter(function(v){ return m[v[0]] === 'must'; })[0] || null; }
  function vOk(i){ var m = vmOf(i); return (D.vars[i] || []).filter(function(v){ return m[v[0]] !== 'ex'; }); }
  function vBadge(i){
    var n = varCount(i); if (!n) return '';
    var mu = vMust(i); if (mu) return '<span class="vc vmu">考「' + esc(vName(mu)) + '」</span>';
    var ok = vOk(i).length;
    return '<span class="vc' + (ok < n ? ' vex' : '') + '">' + ok + '選1' + (ok < n ? '・' + (n - ok) + '不考' : '') + '</span>';
  }

  function loadMarks(){
    var ex = new Set(LS.get(exKey(), [])), mu = new Set(LS.get(muKey(), []));
    excl = new Set(); must = new Set();
    items().forEach(function(it, i){
      if (ex.has(itemKey(it))) excl.add(i);
      else if (mu.has(itemKey(it))) must.add(i);
    });
    var vm = LS.get(vmKey(), {}); vmark = {};
    items().forEach(function(it, i){
      var m = vm[itemKey(it)]; if (!m || !D.vars[i]) return;
      var o = {}, n = 0;
      D.vars[i].forEach(function(v){ if (m[v[0]] === 'must' || m[v[0]] === 'ex'){ o[v[0]] = m[v[0]]; n++; } });
      if (n) vmark[i] = o;
    });
  }
  function saveMarks(){
    LS.set(exKey(), Array.from(excl).map(function(i){ return itemKey(items()[i]); }));
    LS.set(muKey(), Array.from(must).map(function(i){ return itemKey(items()[i]); }));
    var vm = {};
    Object.keys(vmark).forEach(function(i){ if (Object.keys(vmark[i]).length) vm[itemKey(items()[i])] = vmark[i]; });
    LS.set(vmKey(), vm);
  }
  function withMust(arr){ return Array.from(new Set(Array.from(must).concat(arr))).sort(byIdx); }

  /* ───────── 選題畫面 ───────── */
  function setLesson(L){
    D = buildLesson(L);
    loadMarks(); vOver = {};
    sel = Array.from(must).sort(byIdx);
    var nos = items().map(function(it){ return it[0]; });
    $('ra').value = nos.length ? Math.min.apply(null, nos) : 1;
    $('rb').value = nos.length ? Math.max.apply(null, nos) : 1;
    LS.set('nq-lesson', L);
    render();
  }
  var HINTS = {
    pick: '點題目＝選入／取消；也可以用上方「範圍全選」或「隨機抽」。必考題一定會在裡面，排除題一定不會被抽到。',
    must: '必考模式：點題目＝設為必考／取消。隨機抽題時必考題一定抽到，剩下的名額才隨機補。標記會自動記住。',
    ex:   '排除模式：點題目＝排除／恢復（例如已經考過的）。排除紀錄會自動記住，下次打開還在。',
    vr:   '指定小字詞：點有「N選1」的題目，可以把其中一個小字詞（或整句）設為必考，或把幾個設為不考。設必考的那條註釋會一起變成必考題。標記會自動記住。'
  };
  function render(){
    if (!items().length){
      $('grid').innerHTML = '<div class="empty">這一課目前沒有可抽題的註釋資料。</div>';
    } else {
      $('grid').innerHTML = items().map(function(it, i){
        var on = sel.indexOf(i) >= 0, ex = excl.has(i), mu = must.has(i);
        return '<button type="button" class="chip' + (on ? ' on' : '') + (ex ? ' ex' : '') + (mu ? ' must' : '') + '" data-i="' + i + '">' +
          '<span class="no">' + it[0] + '</span><span class="w serif">' + esc(chipLabel(i)) + '</span>' +
          vBadge(i) + '</button>';
      }).join('');
    }
    var nEx = excl.size, nMu = must.size, nV = Object.keys(Object.assign({}, vmark, vOver)).length;
    var tags = [nMu ? '必考 ' + nMu : '', nEx ? '排除 ' + nEx : '', nV ? '指定小字詞 ' + nV : ''].filter(Boolean).join('・');
    $('cnt').textContent = '已選 ' + sel.length + ' 題' + (tags ? '（' + tags + '）' : '');
    $('bGo').disabled = !sel.length;
    $('bGo').style.opacity = sel.length ? 1 : .4;
    $('bUnex').style.display = (nEx || nMu || nV) ? '' : 'none';
    $('hint').textContent = HINTS[mode];
  }
  function setMode(m){
    mode = m;
    $('mPick').className = m === 'pick' ? 'on' : '';
    $('mMust').className = m === 'must' ? 'on mu' : '';
    $('mEx').className = m === 'ex' ? 'on ex' : '';
    $('mVar').className = m === 'vr' ? 'on vr' : '';
    $('grid').classList.toggle('vr-mode', m === 'vr');
    render();
  }
  function rangePool(){
    var a = +$('ra').value || 1, b = +$('rb').value || a;
    var lo = Math.min(a, b), hi = Math.max(a, b);
    return items().map(function(it, i){ return i; }).filter(function(i){ return items()[i][0] >= lo && items()[i][0] <= hi && !excl.has(i); });
  }

  /* ───────── V142：指定小字詞（必考／不考）小視窗 ───────── */
  var vpI = -1;
  function clearVMust(i){
    var m = vmark[i]; if (!m) return;
    Object.keys(m).forEach(function(w){ if (m[w] === 'must') delete m[w]; });
    if (!Object.keys(m).length) delete vmark[i];
  }
  function setV(i, w, st){
    if (vOver[i]){ vmark[i] = Object.assign({}, vOver[i]); delete vOver[i]; }
    var vs = D.vars[i] || [], m = vmark[i] || {};
    if (st === 'ex' && vs.filter(function(v){ return v[0] !== w && m[v[0]] !== 'ex'; }).length === 0){
      alert('至少要留一個可以考的。整條註釋都不考的話，請用「點＝排除」。'); return;
    }
    if (st === 'must'){
      Object.keys(m).forEach(function(k){ if (m[k] === 'must') delete m[k]; });
      m[w] = 'must';
      must.add(i); excl.delete(i); if (sel.indexOf(i) < 0) sel = sel.concat(i);
    } else if (st === 'ex') m[w] = 'ex';
    else delete m[w];
    if (Object.keys(m).length) vmark[i] = m; else delete vmark[i];
    saveMarks(); render(); paintVp();
  }
  function paintVp(){
    var i = vpI, it = items()[i], vs = D.vars[i]; if (!it || !vs) return;
    var m = vmOf(i), s = it[2];
    $('vp').querySelector('.vp-h').innerHTML = '註' + it[0] + (must.has(i) ? '<span class="vp-tag mu">必考題</span>' : '') + (excl.has(i) ? '<span class="vp-tag ex">整條排除中</span>' : '');
    $('vp').querySelector('.vp-rows').innerHTML = vs.map(function(v, j){
      var st = m[v[0]] || 'rnd', x = excerpt(s, v[1], v[2]);
      return '<div class="vp-row ' + st + '"><div class="vp-q serif">' + (x.cutL ? '…' : '') + esc(x.pre) + '<mark>' + esc(x.w) + '</mark>' + esc(x.post) + (x.cutR ? '…' : '') + '</div>' +
        '<div class="vp-a"><b>' + esc(vName(v)) + '：</b>' + noBk(v[3]) + '</div>' +
        '<div class="vp-seg">' + [['rnd', '隨機'], ['must', '必考'], ['ex', '不考']].map(function(o){
          return '<button type="button" data-j="' + j + '" data-st="' + o[0] + '"' + (st === o[0] ? ' class="on ' + o[0] + '"' : '') + '>' + o[1] + '</button>';
        }).join('') + '</div></div>';
    }).join('');
  }
  function openVp(i){
    if (!D.vars[i]){ $('hint').textContent = '註' + items()[i][0] + ' 沒有拆成小字詞，只能整條設必考或排除（用「點＝必考」「點＝排除」）。'; return; }
    vpI = i; paintVp(); $('vp').classList.add('show');
  }
  function closeVp(){ $('vp').classList.remove('show'); vpI = -1; }
  function initVp(){
    var d = document.createElement('div');
    d.id = 'nq2-vp';
    d.innerHTML = '<div class="vp-bx" role="dialog" aria-modal="true" aria-label="指定小字詞"><div class="vp-top"><h3 class="vp-h"></h3>' +
      '<button type="button" class="vp-x">完成</button></div>' +
      '<div class="vp-note">隨機＝可能抽到；必考＝這條註釋一定考這一個（只能指定一個）；不考＝不會抽到。</div><div class="vp-rows"></div></div>';
    document.getElementById('nq2').appendChild(d);
    d.addEventListener('click', function(e){
      if (e.target === d || e.target.closest('.vp-x')){ closeVp(); return; }
      var b = e.target.closest('[data-st]'); if (!b || vpI < 0) return;
      setV(vpI, D.vars[vpI][+b.dataset.j][0], b.dataset.st);
    });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && d.classList.contains('show')){ closeVp(); e.stopPropagation(); } }, true);
  }

  /* ───────── 考卷畫面 ───────── */
  // 句子太長時只顯示目標所在的小句（以。！？；切），前後加「…」；目標跨小句就顯示整句
  function excerpt(s, a, b){
    var full = { pre: s.slice(0, a), w: s.slice(a, b), post: s.slice(b), cutL: false, cutR: false };
    if (a < 0 || s.length <= 30) return full;
    var parts = s.match(/[^。！？；]+[。！？；」』]*/g) || [s];
    if (parts.join('') !== s) return full;
    var acc = 0;
    for (var k = 0; k < parts.length; k++){
      var p = parts[k], end = acc + p.length;
      if (a >= acc && b <= end) return { pre: p.slice(0, a - acc), w: s.slice(a, b), post: p.slice(b - acc), cutL: k > 0, cutR: k < parts.length - 1 };
      acc = end;
    }
    return full;
  }
  // 決定這一題考什麼：有多個選項就等機率隨機挑一個
  // v59：小考答案不顯示補充（bk-note），只留課本正式註釋（注音 zy-note 照舊）
  function noBk(h){
    h = String(h).replace(/<span class='bk-note'>[\s\S]*?<\/span>/g, '');
    (D.bk || []).forEach(function(x){ if (x) h = h.split(x).join(''); });
    return h;
  }
  function pickVariant(i){
    var it = items()[i], vs = D.vars[i];
    if (vs){
      // V142：必考小字詞優先；不考的不抽；其餘依「拆題」設定（v108 nq-varmode）挑，挑不到就從可考的隨機
      var v = vMust(i);
      if (!v){
        var ok = vOk(i), vm = LS.get('nq-varmode', 'mix'), pref = ok;
        if (vm === 'whole') pref = ok.filter(function(x){ return x[4] === 'whole'; });
        else if (vm === 'sub') pref = ok.filter(function(x){ return x[4] === 'sub'; });
        if (!pref.length) pref = ok.length ? ok : vs;
        v = pref[Math.floor(Math.random() * pref.length)];
      }
      return { w: v[0], a: v[1], b: v[2], ans: noBk(v[3]), whole: v[4] === 'whole' };
    }
    var at = D.pos[i];
    return { w: it[1], a: at, b: at < 0 ? -1 : at + it[1].length, ans: noBk(it[3]), whole: false };
  }
  function startQuiz(){
    var q = $('shuffle').checked ? shuffle(sel) : sel.slice().sort(byIdx);
    $('qTitle').innerHTML = '〈' + esc(D.lesson.split('—')[0]) + '〉註釋小考<small>共 ' + q.length + ' 題・點題目看答案</small>';
    $('qlist').innerHTML = q.map(function(i, k){
      var it = items()[i], s = it[2], v = pickVariant(i);
      var x = v.a < 0 ? { pre: s, w: '', post: '', cutL: false, cutR: false } : excerpt(s, v.a, v.b);
      // V142：拆題註釋已在這裡依標記與拆題設定挑好，標上 data-v108 讓 v108 applyVmode 不再改寫
      return '<article class="qc"' + (D.vars[i] ? ' data-v108="' + esc(LS.get('nq-varmode', 'mix')) + '"' : '') + '>' +
        '<div class="qn">' + (k + 1) + '</div>' +
        '<div class="qb">' +
          '<div class="qs serif">' + (x.cutL ? '<span class="el">…</span>' : '') + esc(x.pre) +
            (x.w ? '<mark>' + esc(x.w) + '</mark>' : '') + esc(x.post) + (x.cutR ? '<span class="el">…</span>' : '') +
            '<span class="src">註' + it[0] + '</span></div>' +
          '<div class="qa"><span class="qa-hint">點一下看答案</span>' +
            '<div class="qa-body"><span class="aw">' + (v.whole ? '整句' : esc(v.w)) + '：</span>' + v.ans + '</div></div>' +
        '</div></article>';
    }).join('') + (q.length > 5 ? '<div class="qend">— 共 ' + q.length + ' 題，以上 —</div>' : '');
    syncAllBtn();
    $('quiz').classList.add('show');
    $('qlist').scrollTop = 0;
  }
  function cards(){ return Array.prototype.slice.call(document.querySelectorAll('#nq2 .qc')); }
  function syncAllBtn(){
    var cs = cards();
    $('bAll').textContent = cs.length && cs.every(function(c){ return c.classList.contains('open'); }) ? '全部隱藏答案' : '全部顯示答案';
  }
  var fs = LS.get('nq-fs', 1);
  function applyFs(){ document.getElementById('nq2').style.setProperty('--q-fs', fs); LS.set('nq-fs', fs); }
  function syncDarkBtn(){ $('dark').textContent = document.body.classList.contains('dark-mode') ? '淺色' : '深色'; }

  /* ───────── 開關 ───────── */
  function nq2Open(){
    var old = document.getElementById('note-quiz-panel'); if (old) old.classList.remove('open');
    LESSONS = eligibleLessons();
    $('lesson').innerHTML = LESSONS.map(function(k, i){
      return '<option value="' + i + '">' + esc(k) + '（' + buildLesson(k).items.length + ' 題）</option>';
    }).join('');
    var last = LS.get('nq-lesson', LESSONS[0]);
    var li = Math.max(0, LESSONS.indexOf(last));
    $('lesson').value = li;
    applyFs(); syncDarkBtn();
    $('quiz').classList.remove('show');
    if (LESSONS.length) setLesson(LESSONS[li]);
    document.getElementById('nq2').classList.add('open');
  }
  function nq2Close(){ document.getElementById('nq2').classList.remove('open'); }

  function init(){
    $('grid').addEventListener('click', function(e){
      var b = e.target.closest('.chip'); if (!b) return;
      var i = +b.dataset.i;
      if (mode === 'vr'){ openVp(i); return; }
      if (mode === 'pick'){
        if (excl.has(i) || must.has(i)) return;   // 必考／排除題要到各自模式才能改
        sel = sel.indexOf(i) >= 0 ? sel.filter(function(x){ return x !== i; }) : sel.concat(i);
      } else if (mode === 'must'){
        if (must.has(i)){ must.delete(i); clearVMust(i); sel = sel.filter(function(x){ return x !== i; }); }
        else { must.add(i); excl.delete(i); if (sel.indexOf(i) < 0) sel = sel.concat(i); }
        saveMarks();
      } else {
        if (excl.has(i)) excl.delete(i); else { excl.add(i); must.delete(i); clearVMust(i); sel = sel.filter(function(x){ return x !== i; }); }
        saveMarks();
      }
      render();
    });
    $('mPick').onclick = function(){ setMode('pick'); };
    $('mMust').onclick = function(){ setMode('must'); };
    $('mEx').onclick = function(){ setMode('ex'); };
    $('mVar').onclick = function(){ setMode('vr'); };
    initVp();
    $('bRange').onclick = function(){ sel = withMust(rangePool()); render(); };
    $('bRand').onclick = function(){
      var n = Math.max(1, +$('rn').value || 5);
      var rest = Math.max(0, n - must.size);
      sel = withMust(shuffle(rangePool().filter(function(i){ return !must.has(i); })).slice(0, rest));
      render();
      if (must.size > n) alert('必考題有 ' + must.size + ' 題，超過設定的 ' + n + ' 題，已全部放入。');
    };
    $('bClear').onclick = function(){ sel = Array.from(must).sort(byIdx); render(); };
    $('bUnex').onclick = function(){
      if (confirm('清除這一課所有「必考」和「排除」標記（含指定的小字詞）？')){ excl.clear(); must.clear(); vmark = {}; vOver = {}; saveMarks(); render(); }
    };
    $('lesson').onchange = function(e){ setLesson(LESSONS[+e.target.value]); };
    $('bGo').onclick = function(){ if (sel.length) startQuiz(); };
    $('bBack').onclick = function(){ $('quiz').classList.remove('show'); };
    $('qlist').addEventListener('click', function(e){
      var c = e.target.closest('.qc'); if (!c) return;
      c.classList.toggle('open'); syncAllBtn();
    });
    $('bAll').onclick = function(){
      var cs = cards(), openAll = !cs.every(function(c){ return c.classList.contains('open'); });
      cs.forEach(function(c){ c.classList.toggle('open', openAll); });
      syncAllBtn();
    };
    $('bSm').onclick = function(){ fs = Math.max(.7, +(fs - .1).toFixed(2)); applyFs(); };
    $('bLg').onclick = function(){ fs = Math.min(1.6, +(fs + .1).toFixed(2)); applyFs(); };
    $('dark').onclick = function(){ if (typeof toggleDarkMode === 'function') toggleDarkMode(); syncDarkBtn(); };
    $('close').onclick = nq2Close;

    // 右側「註釋小考」邊籤改開新版（舊 onclick="nqToggle()" 抽屜面板不再使用）
    var tab = document.getElementById('note-quiz-tab');
    if (tab){ tab.removeAttribute('onclick'); tab.onclick = nq2Open; }
  }

  /* ───────── 面板打開時隱藏右側邊籤 ───────── */
  function initSideTabHide(){
    var ids = ['cls-panel', 'display-panel', 'note-quiz-panel'];
    var panels = ids.map(function(id){ return document.getElementById(id); }).filter(Boolean);
    function sync(){
      var any = panels.some(function(p){ return p.classList.contains('open'); });
      document.body.classList.toggle('v56-panel-open', any);
    }
    var mo = new MutationObserver(sync);
    panels.forEach(function(p){ mo.observe(p, { attributes: true, attributeFilter: ['class'] }); });
    sync();
    // 投影模式開關 → body.v56-proj-open（投影時「註釋小考」邊籤移到第 5 格，避開「畫筆」）
    var fs = document.getElementById('wk-fullscreen');
    if (fs){
      // wkOpenProj()/wkCloseProj() 直接改 fs.style.display，所以看實際是否顯示，class 與 style 都監聽
      var syncProj = function(){ document.body.classList.toggle('v56-proj-open', getComputedStyle(fs).display !== 'none'); };
      new MutationObserver(syncProj).observe(fs, { attributes: true, attributeFilter: ['class', 'style'] });
      syncProj();
    }
  }

  /* ───────── 投影畫筆：改名「畫筆」、工具列移到下方換頁列、橡皮擦 ───────── */
  function initInk(){
    var tab = document.getElementById('wk-ink-tab');
    if (tab){ tab.textContent = '畫筆'; tab.setAttribute('aria-label', '開啟或關閉畫筆'); }

    // 工具列開關文字由 wkInkToggle()/wkCloseProj() 寫入「✎ 畫記／✎ 關閉畫記」，統一改成「畫筆」
    var toggle = document.getElementById('wk-ink-toggle');
    if (toggle){
      var fixText = function(){ if (toggle.textContent.indexOf('畫記') >= 0) toggle.textContent = toggle.textContent.replace(/畫記/g, '畫筆'); };
      new MutationObserver(fixText).observe(toggle, { childList: true, characterData: true, subtree: true });
      fixText();
    }

    var layer = document.getElementById('wk-ink-layer');
    var tb = document.getElementById('wk-ink-toolbar');
    var extra = document.getElementById('wk-ink-extra');
    var canvas = document.getElementById('wk-ink-canvas');
    var fs = document.getElementById('wk-fullscreen');
    var st = window.wkInkState;
    if (!layer || !tb || !extra || !toggle || !canvas || !fs || !st) return;

    // 左組：關閉畫筆／撤銷／清除本頁／橡皮擦；右組（原 #wk-ink-extra）：顏色、螢光筆、細、中
    var left = document.createElement('div'); left.id = 'wk-ink-grp-l';
    tb.insertBefore(left, tb.firstChild);
    left.appendChild(toggle);
    Array.prototype.slice.call(extra.querySelectorAll('.wk-ink-btn')).forEach(function(b){
      if (/撤銷|清除本頁/.test(b.textContent)) left.appendChild(b);
    });
    var er = document.createElement('button');
    er.type = 'button'; er.id = 'wk-ink-eraser'; er.className = 'wk-ink-btn'; er.textContent = '橡皮擦';
    left.appendChild(er);

    // 畫布只涵蓋投影內容區（標題列下緣 ～ 換頁列上緣），換頁列留給工具列與 ←→
    function fitInk(){
      var on = layer.classList.contains('active') && getComputedStyle(fs).display !== 'none';
      var head = fs.querySelector('.wkfs-header'), foot = fs.querySelector('.wkfs-footer');
      if (on && head && foot){
        var top = head.getBoundingClientRect().bottom, f = foot.getBoundingClientRect().top;
        canvas.style.top = top + 'px'; canvas.style.bottom = 'auto';
        canvas.style.height = Math.max(1, f - top) + 'px';
        layer.style.setProperty('--v56-foot-h', Math.max(44, Math.round(window.innerHeight - f)) + 'px');
      } else {
        canvas.style.top = ''; canvas.style.bottom = ''; canvas.style.height = '';
      }
      if (typeof wkInkSetupCanvas === 'function') wkInkSetupCanvas();
    }
    new MutationObserver(function(){ fitInk(); if (!layer.classList.contains('active')) setEraser(false); })
      .observe(layer, { attributes: true, attributeFilter: ['class'] });
    window.addEventListener('resize', function(){ if (layer.classList.contains('active')) fitInk(); });

    // 橡皮擦：畫筆色設成透明當「擦除軌跡」，軌跡掃過的筆畫整筆刪除；放開後移除擦除軌跡本身
    var ERASE = 'rgba(0,0,0,0)', saved = null;
    function setEraser(on){
      if (on){
        if (!saved) saved = { color: st.color, size: st.size };
        st.color = ERASE; st.size = 1;
        er.classList.add('on');
        document.querySelectorAll('.wk-ink-color').forEach(function(x){ x.classList.remove('on'); });
      } else if (saved){
        if (st.color === ERASE){           // 從橡皮擦改按「細／中」→ 恢復原本的顏色
          st.color = saved.color;
          document.querySelectorAll('.wk-ink-color').forEach(function(x){ x.classList.toggle('on', x.dataset.color === st.color); });
        }
        if (st.size === 1) st.size = saved.size; // 從橡皮擦改按顏色 → 恢復原本的粗細
        saved = null;
        er.classList.remove('on');
      }
    }
    er.addEventListener('click', function(){ setEraser(!er.classList.contains('on')); });
    ['wkInkColor', 'wkInkHighlighter', 'wkInkSetSize'].forEach(function(name){
      var orig = window[name];
      if (typeof orig === 'function') window[name] = function(){ var r = orig.apply(this, arguments); setEraser(false); return r; };
    });

    function segDist(px, py, ax, ay, bx, by){
      var dx = bx - ax, dy = by - ay, L = dx * dx + dy * dy;
      var t = L ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / L)) : 0;
      var x = ax + t * dx - px, y = ay + t * dy - py;
      return Math.sqrt(x * x + y * y);
    }
    // 擦除：檢查「上一點 → 這一點」整段路徑（每 6px 取一點），手指／筆快速滑過也不會漏擦
    var lastPt = null;
    function eraseAt(e){
      var r = canvas.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      var probes = [[px, py]];
      if (lastPt){
        var dx = px - lastPt[0], dy = py - lastPt[1], n = Math.ceil(Math.sqrt(dx * dx + dy * dy) / 6);
        for (var m = 1; m < n; m++) probes.push([lastPt[0] + dx * m / n, lastPt[1] + dy * m / n]);
      }
      lastPt = [px, py];
      var arr = wkInkCurrentStrokes(), hit = false;
      for (var k = arr.length - 1; k >= 0; k--){
        var s0 = arr[k];
        if (!s0 || s0.color === ERASE || !s0.points) continue;
        var R = 16 + (s0.size || 3) / 2, pts = s0.points, gone = false;
        for (var q = 0; q < pts.length && !gone; q++){
          var a = pts[q], b = pts[q + 1] || a;
          for (var z = 0; z < probes.length; z++){
            if (segDist(probes[z][0], probes[z][1], a.x * r.width, a.y * r.height, b.x * r.width, b.y * r.height) <= R){ gone = true; break; }
          }
        }
        if (gone){ arr.splice(k, 1); hit = true; }
      }
      if (hit) wkInkRedraw();
    }
    function erasing(){ return st.active && st.color === ERASE; }
    canvas.addEventListener('pointerdown', function(e){ lastPt = null; if (erasing()) eraseAt(e); });
    canvas.addEventListener('pointermove', function(e){ if (erasing() && (e.buttons || st.drawing)) eraseAt(e); });
    var cleanup = function(){
      lastPt = null;
      setTimeout(function(){
        var arr = wkInkCurrentStrokes();
        for (var k = arr.length - 1; k >= 0; k--) if (arr[k] && arr[k].color === ERASE) arr.splice(k, 1);
        wkInkRedraw();
      }, 0);
    };
    canvas.addEventListener('pointerup', cleanup);
    canvas.addEventListener('pointercancel', cleanup);
  }

  window.nq2Open = nq2Open;
  window.nq2Close = nq2Close;
  window.nqToggle = nq2Open;          // 覆蓋 v55 的 nqToggle（實際生效版本＝本段）
  window.nq2BuildLesson = buildLesson;
  // V143：日曆「開始小考」用。map = { "註號|詞": { 選項字詞: "must"|"ex" } }，套在目前課次，直到換課或重開
  window.nq2SetVOverlay = function(map){
    vOver = {};
    if (D && map) items().forEach(function(it, i){
      var m = map[itemKey(it)]; if (!m || !D.vars[i]) return;
      var o = {}, n = 0;
      D.vars[i].forEach(function(v){ if (m[v[0]] === 'must' || m[v[0]] === 'ex'){ o[v[0]] = m[v[0]]; n++; } });
      if (n) vOver[i] = o;
    });
    if (D) render();
  };

  function boot(){ init(); initSideTabHide(); initInk(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/037_v58-nq-subpos-js.js ════ */
try {

/* 註釋小考：小字詞在整句中出現多次時，手動指定要標第幾個（從該註釋整句範圍的開頭數起，1 起算）。
   格式：'課名|註號|字詞': 第幾個。沒列在這裡的，照舊標第一個。新增一課跑 scripts/nq_split_check.js 看到警告時，經老師確認後加在這裡。 */
window.NQ_SUB_POS = {
  '師說|22|不': 3   // 句讀之不知，惑之不解，或師焉，或「不」焉：不，通「否」
};
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/039_v59-popup-fit-js.js ════ */
try {

/* v59：浮框不超出視窗、不蓋住右側邊籤（班級進度／顯示設定／註釋小考／投影時的畫筆等）。
   只包裝既有函式：tpPopupBounds（右界再扣掉邊籤）、tpPlacePopup（定位前先設定最大寬度）。不改原本定位邏輯。 */
(function(){
  function tabsLeft(){
    var lim = window.innerWidth - 8;
    document.querySelectorAll('[id$="-tab"]').forEach(function(t){
      var cs = getComputedStyle(t);
      if (cs.position !== 'fixed' || cs.display === 'none' || cs.visibility === 'hidden') return;
      var b = t.getBoundingClientRect();
      if (b.width > 0 && b.width < 80 && b.height > 40 && b.left > window.innerWidth * 0.6) lim = Math.min(lim, b.left - 6);
    });
    return lim;
  }
  function wrap(){
    if (typeof window.tpPopupBounds === 'function' && !window.tpPopupBounds._v59fit){
      var _b = window.tpPopupBounds;
      window.tpPopupBounds = function(el){
        var b = _b(el);
        if (b) { var r = tabsLeft(); if (r > b.left + 120 && r < b.right) b.right = r; }
        return b;
      };
      window.tpPopupBounds._v59fit = true;
    }
    if (typeof window.tpPlacePopup === 'function' && !window.tpPlacePopup._v59fit){
      var _p = window.tpPlacePopup;
      window.tpPlacePopup = function(el){
        try {
          var pop = (typeof tpPopNode === 'function') ? tpPopNode(el) : null;
          var b = window.tpPopupBounds(el);
          if (pop && b) pop.style.setProperty('--v59-pop-maxw', Math.max(120, Math.floor(b.right - b.left)) + 'px');
        } catch(e){}
        return _p.apply(this, arguments);
      };
      window.tpPlacePopup._v59fit = true;
    }
  }
  wrap();
  window.addEventListener('load', wrap);
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/041_v60-bkcard-js.js ════ */
try {

/* v60：補充卡。
   ①所有 .tp-note（註釋面板，一般畫面與投影都有）：把 bk-note 移進隱藏容器 .v60-bk-store，註釋下方加「補充」按鈕。
     適用所有課；沒有 bk-note 的註釋不加按鈕。以 MutationObserver 處理換頁／重新渲染。
   ②點「補充」→ 置中卡片＋遮罩；✕、點遮罩、Esc 關閉。換頁、關閉投影時自動關閉。
   ③投影時卡片放在 #wk-fullscreen 內、畫筆圖層下方，沿用現有畫筆（不新增 Canvas）。
     包裝 wkInkKey：卡片開著時筆跡存到「本頁::v60bk:課名#註號」，關卡後回到課文頁原本的筆跡，互不混在一起。
   包裝的既有函式（實際生效版本＝本段包在原版外層）：wkInkKey、wkRenderCurrent、wkCloseProj。 */
(function(){
  var ov = null, xb = null, cur = null;

  function enhance(){
    var ns = document.querySelectorAll('.tp-note:not([data-v60bk])');
    for (var i = 0; i < ns.length; i++){
      var n = ns[i];
      n.setAttribute('data-v60bk', '1');
      var bks = n.querySelectorAll(':scope > .bk-note');
      if (!bks.length) continue;
      var store = document.createElement('div');
      store.className = 'v60-bk-store';
      for (var k = 0; k < bks.length; k++) store.appendChild(bks[k]);
      n.appendChild(store);
      var w = document.createElement('span');
      w.className = 'v60-bk-btn-wrap';
      w.innerHTML = '<button type="button" class="v60-bk-btn">補充</button>';
      n.appendChild(w);
    }
  }
  var pend = false;
  // 用 setTimeout 而非 requestAnimationFrame：分頁在背景時 rAF 會暫停，按鈕就不會出現
  function schedule(){ if (pend) return; pend = true; setTimeout(function(){ pend = false; enhance(); }, 0); }

  function build(){
    if (ov) return;
    ov = document.createElement('div');
    ov.id = 'v60-bk-ov';
    ov.innerHTML = '<div class="v60-bk-card" role="dialog" aria-modal="true" aria-label="補充資料">' +
      '<div class="v60-bk-head"><span class="v60-bk-tag">補充</span><span class="v60-bk-ttl"></span></div>' +
      '<div class="v60-bk-body"></div></div>';
    ov.addEventListener('click', function(e){ if (e.target === ov) close(); });
    xb = document.createElement('button');
    xb.type = 'button'; xb.id = 'v60-bk-x'; xb.textContent = '✕ 關閉'; xb.setAttribute('aria-label', '關閉補充');
    xb.addEventListener('click', function(e){ e.stopPropagation(); close(); });
  }
  function fsShown(){ var fs = document.getElementById('wk-fullscreen'); return fs && getComputedStyle(fs).display !== 'none' ? fs : null; }
  function redrawInk(){ try { if (typeof wkInkRedraw === 'function') wkInkRedraw(); } catch(e){} }

  // 投影時卡片只蓋內容區（標題列下緣～換頁列上緣），標題列與換頁列（畫筆工具列、←→）照常可按
  function layout(){
    if (!ov || !cur) return;
    if (cur.fs){
      var head = cur.fs.querySelector('.wkfs-header'), foot = cur.fs.querySelector('.wkfs-footer');
      var top = head ? head.getBoundingClientRect().bottom : 0;
      var bot = foot ? window.innerHeight - foot.getBoundingClientRect().top : 0;
      ov.style.top = top + 'px'; ov.style.bottom = bot + 'px'; ov.style.left = '0'; ov.style.right = '0';
    } else {
      ov.style.top = ov.style.bottom = ov.style.left = ov.style.right = '';
    }
    var r = ov.querySelector('.v60-bk-card').getBoundingClientRect();
    xb.style.top = (r.top + 10) + 'px';
    xb.style.left = (r.right - xb.offsetWidth - 12) + 'px';
  }

  // 畫筆開啟時 #wk-ink-layer 會變成 position:fixed、z12500（v59 實測），蓋過整個 #wk-fullscreen（z9550）。
  // 因此關閉鈕一律掛在 body、position:fixed，z-index 設成比畫筆圖層高一層，畫筆開著也按得到。
  function fixZ(){
    if (!xb) return;
    var inkZ = 0;
    try { inkZ = parseInt(getComputedStyle(document.getElementById('wk-ink-layer')).zIndex, 10) || 0; } catch(e){}
    xb.style.zIndex = String(Math.max(11001, inkZ + 1));
  }

  function open(btn){
    var note = btn.closest('.tp-note'); if (!note) return;
    var store = note.querySelector('.v60-bk-store'); if (!store) return;
    build();
    var nn = note.querySelector('.tp-nn'), term = note.querySelector(':scope > b');
    var no = nn ? nn.textContent.trim() : '';
    var ttl = (no ? no + ' ' : '') + (term ? term.textContent.trim() : '');
    ov.querySelector('.v60-bk-ttl').textContent = ttl;
    ov.querySelector('.v60-bk-body').innerHTML = Array.prototype.map.call(store.children, function(s){
      return '<div class="v60-bk-item">' + s.innerHTML + '</div>';
    }).join('');
    var fs = note.closest('#wk-fullscreen') ? fsShown() : null;
    var host = fs || document.body;
    ov.classList.toggle('in-fs', !!fs);
    host.appendChild(ov); document.body.appendChild(xb);
    fixZ();
    cur = { id: (typeof wkKey !== 'undefined' ? String(wkKey) : '') + '#' + (note.id || ttl), fs: fs };
    ov.classList.add('show'); xb.classList.add('show');
    ov.querySelector('.v60-bk-body').scrollTop = 0;
    layout();
    redrawInk();
  }
  function close(){
    if (!cur) return;
    cur = null;
    if (ov){ ov.classList.remove('show'); xb.classList.remove('show'); }
    redrawInk();
  }

  // 補充卡開著時，畫筆筆跡另存一組（關卡後課文頁的筆跡不受影響）
  function wrapInk(){
    if (typeof window.wkInkKey === 'function' && !window.wkInkKey._v60){
      var _k = window.wkInkKey;
      window.wkInkKey = function(){ var k = _k.apply(this, arguments); return cur && cur.fs ? k + '::v60bk:' + cur.id : k; };
      window.wkInkKey._v60 = true;
    }
    ['wkRenderCurrent', 'wkCloseProj'].forEach(function(name){
      var f = window[name];
      if (typeof f === 'function' && !f._v60){
        window[name] = function(){ close(); return f.apply(this, arguments); };
        window[name]._v60 = true;
      }
    });
  }

  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.v60-bk-btn');
    if (!b) return;
    e.stopPropagation(); e.preventDefault();
    open(b);
  }, true);
  document.addEventListener('keydown', function(e){ if (cur && e.key === 'Escape'){ e.stopPropagation(); close(); } }, true);
  window.addEventListener('resize', function(){ if (cur) layout(); });

  function boot(){
    wrapInk();
    enhance();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    var layer = document.getElementById('wk-ink-layer');
    if (layer) new MutationObserver(fixZ).observe(layer, { attributes: true, attributeFilter: ['class', 'style'] });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.addEventListener('load', wrapInk);
  window.v60BkClose = close;
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/045_v60-noteclose-js.js ════ */
try {

/* v60：「✕ 收合」＝與再按一次「注釋 ▸」相同的結果：
   收起 .tp-wrap.side-on、取消「注釋 ▸」按鈕的 on、取消課文中已點開的註號（.tp-n.on）與註釋高亮（.tp-note.hi）。
   一般畫面與投影都適用；以 MutationObserver 處理換頁。不改 tpNotes()/tpTog()。 */
(function(){
  var fb = null, fbSide = null;

  function enhance(){
    var hs = document.querySelectorAll('.tp-side-h:not([data-v60x])');
    for (var i = 0; i < hs.length; i++){
      hs[i].setAttribute('data-v60x', '1');
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'v60-side-x'; b.textContent = '✕ 收合'; b.setAttribute('aria-label', '收合注釋欄');
      hs[i].appendChild(b);
    }
  }
  function closeSide(slide){
    if (!slide) return;
    var wrap = slide.querySelector('.tp-wrap'); if (wrap) wrap.classList.remove('side-on');
    slide.querySelectorAll('.tp-b-note.on, .tp-n.on').forEach(function(x){ x.classList.remove('on'); });
    slide.querySelectorAll('.tp-note.hi').forEach(function(x){ x.classList.remove('hi'); });
    sync();
  }

  // 目前畫面上開著的注釋欄（投影開著時看投影，否則看一般畫面）
  function openSide(){
    var fs = document.getElementById('wk-fullscreen');
    var root = (fs && getComputedStyle(fs).display !== 'none') ? fs : document.getElementById('wk-slide-area');
    return root ? root.querySelector('.tp-wrap.side-on .tp-side') : null;
  }
  function sync(){
    if (!fb) return;
    var side = openSide(), show = false;
    if (side){
      var h = side.querySelector('.tp-side-h');
      var sr = side.getBoundingClientRect(), hr = h ? h.getBoundingClientRect() : sr;
      var fs = side.closest('#wk-fullscreen'), topLim = 0;
      if (fs){ var head = fs.querySelector('.wkfs-header'); if (head) topLim = head.getBoundingClientRect().bottom; }
      // 標題列被捲出畫面（或被投影標題列蓋住），但注釋欄本身還在畫面上 → 浮出按鈕
      if (hr.top < topLim && sr.bottom > topLim + 80 && sr.width > 40) show = true;
    }
    fbSide = show ? side : null;
    fb.classList.toggle('show', show);
    if (show){
      var top = (topLim + 10) + 'px', left = Math.round(Math.max(8, sr.left + (sr.width - fb.offsetWidth) / 2)) + 'px';
      if (fb.style.top !== top) fb.style.top = top;
      if (fb.style.left !== left) fb.style.left = left;
    }
  }

  document.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('.v60-side-x');
    if (!b) return;
    e.stopPropagation(); e.preventDefault();
    closeSide(b.closest('.wk-slide'));
  }, true);

  var pend = false;
  function schedule(){ if (pend) return; pend = true; setTimeout(function(){ pend = false; enhance(); sync(); }, 0); }
  function boot(){
    fb = document.createElement('button');
    fb.type = 'button'; fb.id = 'v60-side-float'; fb.textContent = '✕ 收合註釋'; fb.setAttribute('aria-label', '收合注釋欄');
    fb.addEventListener('click', function(e){ e.stopPropagation(); if (fbSide) closeSide(fbSide.closest('.wk-slide')); });
    document.body.appendChild(fb);
    enhance();
    // 浮動按鈕自己的 class/style 變動不觸發，避免自我循環
    new MutationObserver(function(recs){
      for (var i = 0; i < recs.length; i++) if (recs[i].target !== fb){ schedule(); return; }
    }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
    document.addEventListener('scroll', schedule, { capture: true, passive: true });
    window.addEventListener('resize', schedule);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/047_v61-notefs-js.js ════ */
try {

/* v61：共用字級滑桿。
   - 註釋欄標題列（.tp-side-h）、補充卡標題列（#v60-bk-ov .v60-bk-head）各加一個滑桿；以 MutationObserver 處理換頁／卡片建立。
   - 「總」字卡（v54，#ss-anno-ov）原有滑桿 #ss-size 改為 26～46 並接到共用字級（不改 v54 程式；其 inline --rt 由 CSS !important 蓋過）。
   - 字級存 localStorage['v61-note-fs']，所有滑桿同步。 */
(function(){
  var KEY = 'v61-note-fs', MIN = 26, MAX = 46, DEF = 30;
  var cur = DEF;
  try { var s = parseInt(localStorage.getItem(KEY), 10); if (s >= MIN && s <= MAX) cur = s; } catch(e){}

  function apply(v, save){
    v = Math.max(MIN, Math.min(MAX, parseInt(v, 10) || DEF));
    cur = v;
    document.documentElement.style.setProperty('--v61-nfs', v + 'px');
    var rs = document.querySelectorAll('input.v61-fs-r, #ss-size');
    for (var i = 0; i < rs.length; i++) if (String(rs[i].value) !== String(v)) rs[i].value = v;
    var os = document.querySelectorAll('.v61-fs-v, #ss-sizeout');
    for (var j = 0; j < os.length; j++) os[j].textContent = v + 'px';
    if (save){ try { localStorage.setItem(KEY, String(v)); } catch(e){} }
  }

  function makeSlider(){
    var w = document.createElement('span');
    w.className = 'v61-fs';
    w.innerHTML = '<span>字級</span><input type="range" class="v61-fs-r" min="' + MIN + '" max="' + MAX + '" step="1" value="' + cur + '" aria-label="註釋字級"><span class="v61-fs-v">' + cur + 'px</span>';
    // 不讓點擊／拖曳冒泡到註釋欄或卡片（避免觸發其他點擊行為）
    ['click', 'pointerdown', 'mousedown', 'touchstart'].forEach(function(t){
      w.addEventListener(t, function(e){ e.stopPropagation(); }, { passive: true });
    });
    guardKeys(w);
    return w;
  }
  // 滑桿上按方向鍵是調字級；不要讓它冒泡到 document 的「←→ 換頁」（Esc 照常往上傳，可關卡片／投影）
  function guardKeys(el){
    el.addEventListener('keydown', function(e){ if (e.key !== 'Escape') e.stopPropagation(); });
  }

  function enhance(){
    var hs = document.querySelectorAll('.tp-side-h:not([data-v61fs])');
    for (var i = 0; i < hs.length; i++){
      hs[i].setAttribute('data-v61fs', '1');
      hs[i].appendChild(makeSlider());
    }
    var bh = document.querySelector('#v60-bk-ov .v60-bk-head:not([data-v61fs])');
    if (bh){ bh.setAttribute('data-v61fs', '1'); bh.appendChild(makeSlider()); }
    var ss = document.getElementById('ss-size');
    if (ss && !ss.hasAttribute('data-v61fs')){
      ss.setAttribute('data-v61fs', '1');
      ss.min = MIN; ss.max = MAX; ss.value = cur;
      guardKeys(ss);
      var so = document.getElementById('ss-sizeout'); if (so) so.textContent = cur + 'px';
    }
  }

  document.addEventListener('input', function(e){
    var t = e.target;
    if (t && (t.classList && t.classList.contains('v61-fs-r') || t.id === 'ss-size')) apply(t.value, true);
  }, true);

  var pend = false;
  function schedule(){ if (pend) return; pend = true; setTimeout(function(){ pend = false; enhance(); }, 0); }
  function boot(){
    apply(cur, false);
    enhance();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.v61NoteFs = function(v){ if (v != null) apply(v, true); return cur; };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/050_v64-order-cover-js.js ════ */
try {

(function () {
  /* ── 側欄三類依課次排序（依據：翰林 115 版技高國文六冊選文表；第 3～6 冊為暫訂）──
     表內沒有的課放在最後，維持原本相對順序。 */
  function reorder(arr, order) {
    var head = order.filter(function (k) { return arr.indexOf(k) >= 0; });
    var rest = arr.filter(function (k) { return order.indexOf(k) < 0; });
    arr.splice.apply(arr, [0, arr.length].concat(head, rest));
  }
  reorder(WK_14, ['師說', '桃花源記', '岳陽樓記', '郁離子選', '種樹郭橐駝傳', '夢溪筆談選', '燭之武退秦師',
    '紅樓夢', '赤壁賦', '天工開物', '蘭亭集序', '臺煤減稅片', '清代臺灣鐵路', '庖丁解牛']);
  reorder(WK_EXTRA, ['世說新語選', '論語選—子路曾皙冉有公西華侍坐', '詩經', '漁父', '晚由六橋待月記',
    '大同與小康', '鴻門宴', '勞山道士']);   /* 醉翁亭記、始得西山宴遊記、出師表：115 版選文表未收，排最後 */
  reorder(WK_PROSE, ['身為魚販', '散戲']); /* 散戲：115 版選文表未收 */

  /* ── 白話文封面 ── */
  var PROSE_NO = { '身為魚販': '第一冊　第 1 課' };
  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var _v64orig = wkRenderSlideHTML;
  wkRenderSlideHTML = function (slide) {
    if (slide && slide.type === 'cover' && (WK_PROSE.indexOf(slide.key) >= 0 || (slide.data && slide.data.type === 'prose'))) {
      var a = (slide.data && slide.data.author) || {};
      var name = (a.name || '').split('，')[0];
      var no = PROSE_NO[slide.key] || '';
      return '<div class="wk-slide wks-pcover">' +
        '<div class="pc-deco"><span class="pc-q pc-q1">「</span><span class="pc-q pc-q2">」</span></div>' +
        '<div class="pc-top"><span class="pc-cat">白話文選讀</span>' + (no ? '<span class="pc-no">' + no + '</span>' : '') + '</div>' +
        '<div class="pc-body"><h1 class="pc-title">' + esc(slide.key) + '</h1><div class="pc-rule"></div>' +
        '<div class="pc-author"><span class="pc-by">文／</span>' + esc(name) +
        (a.dynasty ? '<span class="pc-era">' + esc(String(a.dynasty).split('（')[0]) + '</span>' : '') + '</div></div>' +
        '<div class="pc-foot">瑞媛的國文教學</div>' +
        '</div>';
    }
    return _v64orig.apply(this, arguments);
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/051_v65-prose-list-js.js ════ */
try {

(function () {
  /* 加入白話文清單，並依課次重排（第一冊 L01 身為魚販、L04 珍珠奶茶、L05 臺灣最美麗的火車線；散戲 115 版選文表未收，排最後） */
  ['臺灣最美麗的火車線'].forEach(function (k) { if (WK_PROSE.indexOf(k) < 0) WK_PROSE.push(k); });
  var order = ['身為魚販', '珍珠奶茶', '臺灣最美麗的火車線', '散戲'];
  var head = order.filter(function (k) { return WK_PROSE.indexOf(k) >= 0; });
  var rest = WK_PROSE.filter(function (k) { return order.indexOf(k) < 0; });
  WK_PROSE.splice.apply(WK_PROSE, [0, WK_PROSE.length].concat(head, rest));

  /* 白話文封面補冊次課次：v64 的 PROSE_NO 在閉包內，這裡在其輸出後補上（已有 pc-no 就不動） */
  var NO = { '珍珠奶茶': '第一冊　第 4 課', '臺灣最美麗的火車線': '第一冊　第 5 課' };
  var _v65prev = wkRenderSlideHTML;
  wkRenderSlideHTML = function (slide) {
    var h = _v65prev.apply(this, arguments);
    if (slide && slide.type === 'cover' && NO[slide.key] && h.indexOf('wks-pcover') >= 0 && h.indexOf('pc-no') < 0) {
      h = h.replace('<span class="pc-cat">白話文選讀</span>', '<span class="pc-cat">白話文選讀</span><span class="pc-no">' + NO[slide.key] + '</span>');
    }
    return h;
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/054_v68-wk-js.js ════ */
try {

(function () {
  /* ① （RayOclass 4b：v68 版〈師說〉習作Ａ資料已刪，實際生效的是 056_v69 的 V69_SHISHUO_WB） */

  /* ② 答案總覽：加「全部隱藏／一鍵全開」，預設隱藏 */
  var _v68prev = wkRenderSlideHTML;
  /* 原總覽只認「答案／字音／字形…」表頭；師說習作「還原語句順序」欄也是答案欄，僅在總覽渲染用的複本中改認，不動資料 */
  var AO_COL_ALIAS = { '還原語句順序': '答案' };
  function aoSlideCopy(slide) {
    var W = slide.workbook || {};
    var hit = (W.sections || []).some(function (s) { return (s.cols || []).some(function (c) { return AO_COL_ALIAS[c]; }); });
    if (!hit) return slide;
    var W2 = Object.assign({}, W, { sections: W.sections.map(function (s) {
      return Object.assign({}, s, { cols: (s.cols || []).map(function (c) { return AO_COL_ALIAS[c] || c; }) });
    }) });
    return Object.assign({}, slide, { workbook: W2 });
  }
  wkRenderSlideHTML = function (slide) {
    var h = (slide && slide.type === 'work_answers') ? _v68prev.call(this, aoSlideCopy(slide)) : _v68prev.apply(this, arguments);
    if (slide && slide.type === 'work_answers' && h.indexOf('wk-ao-page') >= 0) {
      h = h.replace('wks-workanswers wk-ao-page', 'wks-workanswers wk-ao-page v68-ao-hidden');
      h = h.replace('填空類直接列答案；選擇題點題號可跳回該題檢討，答案不必再點一次。',
        '答案預設隱藏：點一格顯示該題答案；選擇題顯示答案後再點一次，可跳回該題檢討。');
      h = h.replace(/(<div class="wk-ao-desc">[\s\S]*?<\/div>)/,
        '$1<div class="v68-ao-bar"><button type="button" onclick="v68AoAll(this,false)">全部隱藏</button>' +
        '<button type="button" onclick="v68AoAll(this,true)">一鍵全開</button></div>');
    }
    return h;
  };
  window.v68AoAll = function (btn, show) {
    var sl = btn.closest('.wk-slide');
    if (!sl) return;
    sl.querySelectorAll('.wk-ao-chip, .wk-ao-choice').forEach(function (el) { el.classList.toggle('v68-show', show); });
  };
  /* 捕獲階段攔截：未顯示的格子先顯示答案，不觸發選擇題原本的跳題 */
  document.addEventListener('click', function (e) {
    var t = e.target && e.target.closest ? e.target.closest('.v68-ao-hidden .wk-ao-chip, .v68-ao-hidden .wk-ao-choice') : null;
    if (!t) return;
    if (t.classList.contains('wk-ao-chip')) { t.classList.toggle('v68-show'); return; }
    if (!t.classList.contains('v68-show')) { t.classList.add('v68-show'); e.stopPropagation(); e.preventDefault(); }
  }, true);

  /* ③ 課文頁下方列出本頁出現的「字·X」 */
  function plainText(s) {
    var t = String(s || ''), prev;
    do { prev = t; t = t.replace(/\{[gzpy]:([^|{}]*)\|[^{}]*\}/g, '$1'); } while (t !== prev);
    do { prev = t; t = t.replace(/\{n:\d+\|([^{}]*)\}/g, '$1'); } while (t !== prev);
    return t.replace(/<[^>]+>/g, '');
  }
  function pageCharBian(page) {
    if (!page || !wkSlides) return [];
    var txt = (page.lines || []).map(function (L) { return plainText(L.text); }).join('');
    var out = [];
    wkSlides.forEach(function (s, i) {
      if (s.type !== 'charbian' || !s.first) return;
      var base = wkBaseName(s.name);
      var hit = base.split(/[／\/]/).some(function (v) { return v && txt.indexOf(v) >= 0; });
      if (hit) out.push({ name: s.name, idx: i });
    });
    return out;
  }
  window.v68CbJump = function (ev, idx) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    window.wkReturnTo = { idx: wkIdx, li: null };
    wkGoto(idx);
  };
  function injectCbBar() {
    var s = wkSlides && wkSlides[wkIdx];
    if (!s || s.type !== 'textpage') return;
    var list = pageCharBian(s.page);
    if (!list.length) return;
    var html = '<span class="v68-cbbar-h">本頁字詞辨析</span>' + list.map(function (c) {
      return '<button type="button" onclick="v68CbJump(event,' + c.idx + ')">字·' + c.name + '</button>';
    }).join('');
    document.querySelectorAll('#wk-slide-area .wks-textpage .tp-main, #wkfs-body .wks-textpage .tp-main').forEach(function (m) {
      if (m.querySelector('.v68-cbbar')) return;
      var d = document.createElement('div');
      d.className = 'v68-cbbar';
      d.innerHTML = html;
      m.appendChild(d);
    });
  }

  /* ④ 導覽列（一般＋全螢幕）字·X 收成「字詞辨析 ▾」 */
  function collapseNav(boxId, btnCls) {
    var box = document.getElementById(boxId);
    if (!box || box.querySelector('.v68-cb-toggle')) return;
    var btns = Array.prototype.filter.call(box.querySelectorAll('button.' + btnCls), function (b) {
      return (b.textContent || '').indexOf('字·') === 0;
    });
    if (btns.length < 2) return;
    var tog = document.createElement('button');
    tog.type = 'button';
    tog.className = btnCls + ' v68-cb-toggle';
    tog.textContent = '字詞辨析 ▾';
    var grp = document.createElement('span');
    grp.className = 'v68-cb-group';
    tog.onclick = function (e) {
      e.stopPropagation();
      var open = grp.classList.toggle('open');
      tog.textContent = open ? '字詞辨析 ▴' : '字詞辨析 ▾';
    };
    box.insertBefore(tog, btns[0]);
    box.insertBefore(grp, btns[0]);
    btns.forEach(function (b) { grp.appendChild(b); });
  }
  function markToggle() {
    [['wk-sections', 'wk-sec-active'], ['wkfs-sections', 'active']].forEach(function (p) {
      var box = document.getElementById(p[0]);
      var tog = box && box.querySelector('.v68-cb-toggle');
      if (!tog) return;
      tog.classList.toggle(p[1], !!box.querySelector('.v68-cb-group .' + p[1]));
    });
  }

  var _v68render = wkRenderCurrent;
  wkRenderCurrent = function () {
    var r = _v68render.apply(this, arguments);
    try { injectCbBar(); } catch (e) {}
    try { markToggle(); } catch (e) {}
    return r;
  };
  var _v68show = showWenxue;
  showWenxue = function () {
    var r = _v68show.apply(this, arguments);
    collapseNav('wk-sections', 'wk-sec-btn'); markToggle();
    return r;
  };
  var _v68proj = wkOpenProj;
  wkOpenProj = function () {
    var r = _v68proj.apply(this, arguments);
    collapseNav('wkfs-sections', 'wkfs-sec-btn'); markToggle();
    return r;
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/056_v69-answer-color-js.js ════ */
try {

(function () {
  /* 〈師說〉：資料行不動（AGENTS §2），執行期覆寫習作（v68 版補原卷圖）與 A卷（依原卷校正，詳見 docs/交接_V69*.md） */
  var V69_SHISHUO_WB = null;   /* 學生版拿掉 */
  var V69_SHISHUO_AQ = null;   /* 學生版拿掉 */
  if (TEXTBOOK['師說']) {
    if (V69_SHISHUO_WB) TEXTBOOK['師說'].workbook = V69_SHISHUO_WB;
    if (V69_SHISHUO_AQ) TEXTBOOK['師說'].aQuiz = V69_SHISHUO_AQ;
  }

  /* 習作頁：直接顯示答案（綠色）。表格依表頭找答案欄；「（n <b>…</b>）」的 b 也算答案。 */
  var ACOL = /^(答案|字音|字形|詞義|注音|國字|還原語句順序)$/;
  function markWork(sl) {
    if (!sl.querySelector('.wk-top')) return;          // A卷手寫頁（.as-top）不處理
    sl.classList.add('v69-wk');
    sl.querySelectorAll('.wq-item').forEach(function (it) {
      var ans = it.getAttribute('data-ans') || '';
      it.classList.add('ans-on');
      it.querySelectorAll('.wq-opt').forEach(function (o) { if (ans.indexOf(o.getAttribute('data-k')) >= 0) o.classList.add('right'); });
    });
    sl.querySelectorAll('table.wk-table').forEach(function (tb) {
      var rows = tb.querySelectorAll('tr');
      if (!rows.length) return;
      var idx = [];
      Array.prototype.forEach.call(rows[0].children, function (c, i) { if (ACOL.test((c.textContent || '').replace(/\s/g, ''))) idx.push(i); });
      Array.prototype.forEach.call(rows, function (r, ri) {
        if (ri === 0) return;
        idx.forEach(function (i) { var c = r.children[i]; if (c && c.tagName === 'TD') c.classList.add('v69-acol'); });
      });
    });
    sl.querySelectorAll('td b').forEach(function (b) {
      var p = b.previousSibling, t = p && p.nodeType === 3 ? p.nodeValue : '';
      if (/[（(]\s*\d+\s*$/.test(t)) b.classList.add('v69-a');
    });
  }
  var _v69render = wkRenderCurrent;
  wkRenderCurrent = function () {
    var r = _v69render.apply(this, arguments);
    try {
      document.querySelectorAll('#wk-slide-area .wks-work, #wkfs-body .wks-work').forEach(markWork);
    } catch (e) {}
    return r;
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/058_v70-adv-js.js ════ */
try {

(function () {
  /* 〈師說〉資料行不動（AGENTS §2），進階練習於執行期掛上 */
  var V70_SHISHUO_ADV = null;   /* 學生版拿掉〈師說〉進階練習 */
  if (V70_SHISHUO_ADV && TEXTBOOK['師說']) TEXTBOOK['師說'].advQ = V70_SHISHUO_ADV;

  /* 投影片：進階練習接在基礎練習之後；沒有基礎練習就放在習作答案總覽之前 */
  var _v70parse = wkParseSlides;
  wkParseSlides = function (key) {
    var slides = _v70parse.apply(this, arguments);
    var d = TEXTBOOK[key];
    if (!d || !d.advQ || !d.advQ.length) return slides;
    var at = -1;
    slides.forEach(function (s, i) { if (s.type === 'iquiz') at = i + 1; });
    if (at < 0) { at = slides.findIndex(function (s) { return s.type === 'work_answers'; }); }
    if (at < 0) at = slides.length;
    var add = d.advQ.map(function (sec, i) { return { type: 'iadv', sec: sec, first: i === 0 }; });
    slides.splice.apply(slides, [at, 0].concat(add));
    /* 習作答案總覽記錄的是投影片索引，插入後要跟著位移 */
    slides.forEach(function (s) {
      if (s.type === 'work_answers') (s.targets || []).forEach(function (t) { if (t.slideIdx >= at) t.slideIdx += add.length; });
    });
    return slides;
  };

  var _v70render = wkRenderSlideHTML;
  wkRenderSlideHTML = function (slide) {
    if (slide && slide.type === 'iadv') {
      var h = _v70render.call(this, { type: 'work', sec: slide.sec, first: slide.first, title: '' });
      return h.replace('wk-slide wks-work', 'wk-slide wks-work wks-iadv')
              .replace('<span class="wk-tag">習作Ａ</span>', '<span class="wk-tag">應用練習</span>');
    }
    return _v70render.apply(this, arguments);
  };

  var _v70sec = wkBuildSections;
  wkBuildSections = function (slides) {
    var map = _v70sec.apply(this, arguments);
    slides.forEach(function (s, i) { if (s.type === 'iadv' && s.first) map.push({ label: '✐進階練習', idx: i }); });
    map.sort(function (a, b) { return a.idx - b.idx; });
    return map;
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/060_v73-rhet-js.js ════ */
try {

(function () {
  /* 動畫內容：原句一律逐字取自〈師說〉課文（textPages）；說明文字取自既有 keyRhetoric 資料，不自行編寫 */
  var V73_ANIMS = {
    '師說': {
      '回文': { cap: '「弟子」與「師」前後位置互換，循環相對。', ex: [
        { k: 'swap', src: '弟子不必不如師，師不必賢於弟子。',
          r1: [['A', '弟子'], ['', '不必不如'], ['B', '師'], ['', '，']],
          r2: [['B', '師'], ['', '不必賢於'], ['A', '弟子'], ['', '。']] } ] },
      '頂針': { cap: '前一句的末字（詞），作為後一句的首字（詞），上遞下接、蟬聯而下，稱為「頂針」。', ex: [
        { k: 'chain', src: '弟子不必不如師，師不必賢於弟子。', a: '弟子不必不如', t: '師', p: '，', b: '不必賢於弟子。' },
        { k: 'chain', src: '請學於余，余嘉其能行古道，作〈師說〉以貽之。', a: '請學於', t: '余', p: '，', b: '嘉其能行古道' } ] },
      '類疊': { cap: '同一個字、詞、語、句，接二連三反覆使用，稱為「類疊」。作用：加強語勢、凸顯對比、使文氣充沛。', ex: [
        { k: 'stack', src: '是故無貴無賤、無長無少，道之所存，師之所存也。', note: '「無……無……」反覆', rows: [['無貴無賤'], ['無長無少']] },
        { k: 'stack', src: '是故聖益聖，愚益愚。', note: '句式相疊', rows: [['聖益聖'], ['愚益愚']] },
        { k: 'stack', src: '生乎吾前，其聞道也，固先乎吾，吾從而師之；生乎吾後，其聞道也，亦先乎吾，吾從而師之。', note: '句型反覆',
          rows: [['生乎吾前', '其聞道也', '固先乎吾', '吾從而師之'], ['生乎吾後', '其聞道也', '亦先乎吾', '吾從而師之']] } ] },
      '映襯': { cap: '把兩種不同的、特別是相反的觀念或事實對列起來兩相比較，使語氣增強、意義更為明顯，稱為「映襯」。', ex: [
        { k: 'vs', src: '古之聖人，其出人也遠矣，猶且從師而問焉；今之眾人，其下聖人也亦遠矣，而恥學於師。',
          pairs: [['古之聖人', '今之眾人'], ['其出人也遠矣', '其下聖人也亦遠矣'], ['猶且從師而問焉', '而恥學於師']] },
        { k: 'vs', src: '巫、醫、樂師、百工之人，不恥相師。士大夫之族，曰師、曰弟子云者，則群聚而笑之。',
          pairs: [['巫、醫、樂師、百工之人', '士大夫之族'], ['不恥相師', '曰師、曰弟子云者，則群聚而笑之']] },
        { k: 'vs', src: '愛其子，擇師而教之，於其身也，則恥師焉，惑矣！',
          pairs: [['愛其子', '於其身也'], ['擇師而教之', '則恥師焉']] } ] }
    }
  };
  window.V73_ANIMS = V73_ANIMS;
  var STEPS = { swap: 3, chain: 2, stack: 2 };
  function nSteps(e) { return e.k === 'vs' ? e.pairs.length : STEPS[e.k]; }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function exHTML(e) {
    var h = '';
    if (e.k === 'swap') {
      var row = function (r, c) { return '<div class="row ' + c + '">' + r.map(function (t) {
        return t[0] ? '<span class="k k' + t[0] + '" data-k="' + t[0] + '">' + esc(t[1]) + '</span>' : '<span class="' + (t[1].length > 1 ? 'mid' : '') + '">' + esc(t[1]) + '</span>';
      }).join('') + '</div>'; };
      h = '<div class="v73-hw">' + row(e.r1, 'r1') + row(e.r2, 'r2') + '</div>';
    } else if (e.k === 'chain') {
      h = '<div class="v73-ch">' + esc(e.a) + '<span class="k tail">' + esc(e.t) + '</span>' + esc(e.p) +
          '<span class="k head">' + esc(e.t) + '</span>' + esc(e.b) + '</div>';
    } else if (e.k === 'stack') {
      var cols = e.rows[0].length;
      h = '<div class="v73-st" style="grid-template-columns:repeat(' + cols + ',max-content)">';
      e.rows.forEach(function (r, ri) {
        r.forEach(function (cell, ci) {
          var other = e.rows[1 - ri][ci] || '';
          var chs = Array.from(cell).map(function (c, i) {
            return '<span class="ch ' + (Array.from(other)[i] === c ? 'same' : 'diff') + '">' + esc(c) + '</span>';
          }).join('');
          h += '<span class="cell r' + (ri + 1) + '">' + chs + '</span>';
        });
      });
      h += '</div><div class="v73-note">' + esc(e.note) + '</div>';
    } else if (e.k === 'vs') {
      h = '<div class="v73-vs">' + e.pairs.map(function (p, i) {
        return '<span class="L" data-i="' + i + '">' + esc(p[0]) + '</span><span class="M" data-i="' + i + '">⟷</span><span class="R" data-i="' + i + '">' + esc(p[1]) + '</span>';
      }).join('') + '</div>';
    }
    return '<div class="v73-src">' + esc(e.src) + '</div><div class="v73-stage">' + h + '<svg class="v73-svg"></svg></div>';
  }

  function slideHTML(key, name) {
    var A = V73_ANIMS[key][name];
    var tabs = A.ex.length > 1 ? '<div class="v73-tabs">' + A.ex.map(function (e, i) {
      return '<button class="v73-tab' + (i ? '' : ' on') + '" onclick="v73Show(this,' + i + ')">例' + '一二三四五'[i] + '</button>'; }).join('') + '</div>' : '';
    var exs = A.ex.map(function (e, i) {
      return '<div class="v73-ex' + (i ? '' : ' cur') + '" data-k="' + e.k + '" data-n="' + nSteps(e) + '">' + exHTML(e) + '</div>'; }).join('');
    return '<div class="wk-slide wks-keyrhet v73-kr v73-anim-slide">' +
      '<div class="wks-kr-head"><span class="wks-kr-name">' + esc(name) + '</span><span class="wks-kr-sub">結構動畫〈' + esc(key) + '〉</span></div>' +
      '<div class="v73a" data-ex="0" data-st="0">' + tabs + exs +
      '<div class="v73-cap">' + esc(A.cap) + '</div>' +
      '<div class="v73-ctrl"><button class="v73-btn" onclick="v73Step(this)">▶ 下一步</button>' +
      '<button class="v73-btn rst" onclick="v73Reset(this)">↻ 重來</button><span class="v73-tip"></span></div></div></div>';
  }

  /* ── 動畫控制 ── */
  /* 以版面位置計算（不受移動中的 transform 影響），stage 為 position:relative */
  function rel(el, base) { var x = 0, y = 0, n = el;
    while (n && n !== base) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x: x, y: y, w: el.offsetWidth, h: el.offsetHeight }; }
  function drawPath(svg, d, color, marker) {
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d); p.setAttribute('stroke', color);
    svg.appendChild(p);
    var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
    void p.getBoundingClientRect(); p.classList.add('v73-draw');
    if (marker) { var c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      var pt = p.getPointAtLength(L); c.setAttribute('cx', pt.x); c.setAttribute('cy', pt.y); c.setAttribute('r', 5); c.setAttribute('fill', color);
      c.style.opacity = 0; c.style.transition = 'opacity .3s .8s'; svg.appendChild(c); requestAnimationFrame(function () { c.style.opacity = 1; }); }
  }
  var TIPS = {
    swap: ['① 找出關鍵詞：「弟子」與「師」', '② 下句把兩個詞的位置對調', '③ 位置互換、循環相對'],
    chain: ['① 前一句的末字', '② 接成後一句的首字'],
    stack: ['① 上下兩句對齊排列', '② 相同的字反覆出現']
  };
  function apply(ex, st) {
    var k = ex.dataset.k, stage = ex.querySelector('.v73-stage'), svg = ex.querySelector('.v73-svg');
    ex.classList.add('s' + st);
    if (k === 'swap') {
      if (st === 1) ex.querySelectorAll('.r1 .k').forEach(function (x) { x.classList.add('lit'); });
      if (st === 2) {
        ex.querySelectorAll('.r2 .k').forEach(function (t) {
          var src = ex.querySelector('.r1 .k[data-k="' + t.dataset.k + '"]');
          var a = src.getBoundingClientRect(), b = t.getBoundingClientRect();
          t.classList.add('lit');
          t.style.transition = 'none'; t.style.transform = 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px)';
          void t.offsetWidth;
          t.style.transition = 'transform 1s cubic-bezier(.5,0,.3,1), background .4s, color .4s'; t.style.transform = '';
        });
      }
      if (st === 3) ['A', 'B'].forEach(function (key) {
        var p = rel(ex.querySelector('.r1 .k[data-k="' + key + '"]'), stage), q = rel(ex.querySelector('.r2 .k[data-k="' + key + '"]'), stage);
        drawPath(svg, 'M' + (p.x + p.w / 2) + ' ' + (p.y + p.h) + ' L' + (q.x + q.w / 2) + ' ' + q.y, key === 'A' ? '#1f5fa8' : '#c0392b', true);
      });
    } else if (k === 'chain') {
      if (st === 1) ex.querySelector('.tail').classList.add('lit');
      if (st === 2) {
        var p = rel(ex.querySelector('.tail'), stage), q = rel(ex.querySelector('.head'), stage);
        var x1 = p.x + p.w / 2, x2 = q.x + q.w / 2, y = p.y + 4, lift = Math.max(30, p.h * .9);
        drawPath(svg, 'M' + x1 + ' ' + y + ' C' + x1 + ' ' + (y - lift) + ' ' + x2 + ' ' + (y - lift) + ' ' + x2 + ' ' + y, '#d4a017', true);
        setTimeout(function () { ex.querySelector('.head').classList.add('lit'); }, 700);
      }
    } else if (k === 'stack') {
      if (st === 2) ex.querySelector('.v73-note').classList.add('show');
    } else if (k === 'vs') {
      ex.querySelectorAll('.v73-vs [data-i="' + (st - 1) + '"]').forEach(function (x) { x.classList.add('on'); });
    }
  }
  function tipFor(ex, st) { var t = TIPS[ex.dataset.k]; return t ? (t[st - 1] || '') : ('第 ' + st + ' 組對照'); }
  function syncBtn(box) {
    var exs = box.querySelectorAll('.v73-ex'), ei = +box.dataset.ex, st = +box.dataset.st, n = +exs[ei].dataset.n;
    var btn = box.querySelector('.v73-btn:not(.rst)');
    btn.disabled = false;
    btn.textContent = st < n ? '▶ 下一步' : (ei + 1 < exs.length ? '▶ 下一例' : '▶ 總結');
    if (box.querySelector('.v73-cap.show')) { btn.disabled = true; btn.textContent = '✓ 完成'; }
  }
  function show(box, i) {
    var exs = box.querySelectorAll('.v73-ex');
    exs.forEach(function (e, j) { e.classList.toggle('cur', j === i); });
    box.querySelectorAll('.v73-tab').forEach(function (t, j) { t.classList.toggle('on', j === i); });
    resetEx(exs[i]);
    box.dataset.ex = i; box.dataset.st = 0;
    box.querySelector('.v73-cap').classList.remove('show');
    box.querySelector('.v73-tip').textContent = '';
    syncBtn(box);
  }
  function resetEx(ex) {
    ex.className = 'v73-ex cur';
    ex.querySelectorAll('.lit,.on,.show').forEach(function (x) { x.classList.remove('lit', 'on', 'show'); });
    ex.querySelectorAll('.k').forEach(function (x) { x.style.transform = ''; x.style.transition = ''; });
    var svg = ex.querySelector('.v73-svg'); if (svg) svg.innerHTML = '';
  }
  window.v73Show = function (el, i) { if (event) event.stopPropagation(); show(el.closest('.v73a'), i); };
  window.v73Step = function (btn) {
    if (window.event) window.event.stopPropagation();
    var box = btn.closest('.v73a'), exs = box.querySelectorAll('.v73-ex');
    var ei = +box.dataset.ex, st = +box.dataset.st, ex = exs[ei], n = +ex.dataset.n;
    if (st >= n) {
      if (ei + 1 < exs.length) { show(box, ei + 1); return; }
      box.querySelector('.v73-cap').classList.add('show');
      box.querySelector('.v73-tip').textContent = '';
      syncBtn(box); return;
    }
    st++; box.dataset.st = st; apply(ex, st);
    box.querySelector('.v73-tip').textContent = tipFor(ex, st);
    syncBtn(box);
  };
  window.v73Reset = function (btn) { if (window.event) window.event.stopPropagation(); show(btn.closest('.v73a'), 0); };

  /* ── 投影片：動畫頁接在該修辭最後一張專頁之後 ── */
  var _v73parse = wkParseSlides;
  wkParseSlides = function (key) {
    var slides = _v73parse.apply(this, arguments);
    var A = V73_ANIMS[key]; if (!A) return slides;
    Object.keys(A).forEach(function (name) {
      var at = -1;
      slides.forEach(function (s, i) { if (s.type === 'keyrhet' && s.name === name) at = i + 1; });
      if (at < 0) return;
      slides.splice(at, 0, { type: 'v73anim', key: key, name: name });
      slides.forEach(function (s) {
        if (s.type === 'work_answers') (s.targets || []).forEach(function (t) { if (t.slideIdx >= at) t.slideIdx += 1; });
      });
    });
    return slides;
  };

  /* ── 修辭專頁／文法修辭總表：定義收合、【本課】改徽章、套卡片版面 ── */
  var _v73render = wkRenderSlideHTML;
  wkRenderSlideHTML = function (slide) {
    if (slide && slide.type === 'v73anim') return slideHTML(slide.key, slide.name);
    var h = _v73render.apply(this, arguments);
    if (slide && (slide.type === 'keyrhet' || slide.type === 'rhet_table') && typeof h === 'string') {
      if (h.indexOf('jy-table') >= 0) {
        h = h.replace(/<div class="rt-def">([\s\S]*?)<\/div>/, function (m, body) {
          return '<div class="v73-def" onclick="this.classList.toggle(\'open\')"><span class="v73-def-tag">定義</span><div class="v73-def-body">' + body + '</div></div>';
        });
      }
      h = h.replace(/【本課】/g, '<span class="v73-own">本課</span>');
      h = h.replace('wk-slide wks-keyrhet', 'wk-slide wks-keyrhet v73-kr').replace('wk-slide wks-rhet-table', 'wk-slide wks-rhet-table v73-rt');
    }
    return h;
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/063_v74-fix-js.js ════ */
try {

(function () {
  /* ── ④ 答案總覽：趣味文學／挑戰加分站等只用 <span class='wk-a'> 標答案、表頭又不是「答案」的表格，
        原擷取程式抓不到（〈火車線〉）。只在總覽渲染用的複本中把 wk-a 轉成 wk-tans 標記，資料不改。 ── */
  var AO_HEAD = /^(答案|字音|字形|詞義|詞義\/解釋|注音|國字|還原語句順序)$/;
  function needWkA(s) {
    if (s.kind !== 'table') return false;
    if ((s.cols || []).some(function (c) { return AO_HEAD.test(String(c == null ? '' : c).replace(/<[^>]+>/g, '').trim()); })) return false;
    var raw = JSON.stringify(s.rows || []);
    if (/wk-tans|jy-blank|[（(]\s*\d+\s*<b/.test(raw)) return false;
    return /class=['"]wk-a['"]/.test(raw);
  }
  function wkA2tans(c) {
    return String(c == null ? '' : c).replace(/<span class=['"]wk-a['"]>([\s\S]*?)<\/span>/g,
      '<span class="wk-tans"><span class="wk-tval">$1</span></span>');
  }
  var _v74prev = wkRenderSlideHTML;
  wkRenderSlideHTML = function (slide) {
    if (slide && slide.type === 'work_answers' && slide.workbook && (slide.workbook.sections || []).some(needWkA)) {
      var W = slide.workbook;
      var W2 = Object.assign({}, W, { sections: W.sections.map(function (s) {
        return needWkA(s) ? Object.assign({}, s, { rows: s.rows.map(function (r) { return r.map(wkA2tans); }) }) : s;
      }) });
      return _v74prev.call(this, Object.assign({}, slide, { workbook: W2 }));
    }
    if (slide && slide.type === 'work' && slide.sec && typeof wkKey !== 'undefined' && wkKey === '師說' &&
        /^四、國學常識解碼/.test(slide.sec.head || '')) {
      var h = _v74prev.apply(this, arguments);
      return h.replace(/<div class="wk-tblwrap">[\s\S]*<\/table><\/div>/, function () { return gxTable(slide.sec); });
    }
    return _v74prev.apply(this, arguments);
  };

  /* ── ② 〈師說〉國學常識解碼：依原卷版面（標題列、社會問題分析跨欄、①～⑥、1. 2. 條列）。文字全取自既有資料。 ── */
  var CN = ['', '①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨'];
  function blanks(t) {
    return t.replace(/（\s*(\d)\s*<b>([\s\S]*?)<\/b>\s*）/g, function (m, n, a) {
      return '（<span class="v74-cn">' + CN[+n] + '</span><b class="v69-a">' + a + '</b>　）';
    }).replace(/先秦、兩漢散文（語言樸實、形式自由）/,
      '<span class="v74-box"><span>先秦、兩漢散文</span><small>語言樸實、形式自由</small></span>');
  }
  function list(t) {
    var items = String(t).split(/<br\s*\/?>/).map(function (x) { return x.replace(/^\s*\d+\s+/, ''); }).filter(function (x) { return x.trim(); });
    return '<ol>' + items.map(function (x) { return '<li>' + blanks(x) + '</li>'; }).join('') + '</ol>';
  }
  function gxTable(S) {
    var cap = S.cols[0], rows = S.rows;
    var out = '<tr><th class="jy-th v74-gx-cap" colspan="3">' + cap + '</th></tr>';
    rows.forEach(function (r, i) {
      if (i === 0) {
        out += '<tr><th class="jy-th">' + r[0] + '</th><td colspan="2">' + blanks(r[1]) + '</td></tr>' +
               '<tr><th class="jy-th" colspan="2">' + S.cols[1] + '</th><th class="jy-th">' + S.cols[2] + '</th></tr>';
      } else {
        out += '<tr><th class="jy-th">' + r[0] + '</th><td>' + blanks(r[1]) + '</td><td>' + list(r[2]) + '</td></tr>';
      }
    });
    return '<div class="wk-tblwrap"><table class="jy-table wk-table v74-gx"><colgroup><col class="c1"><col class="c2"><col class="c3"></colgroup>' + out + '</table></div>';
  }

  /* ── ① 字詞義欄：逐行點選顯示；③ 語譯／解析欄：綠色 ── */
  function fixWork(sl) {
    if (!sl.querySelector('.wk-top')) return;
    sl.querySelectorAll('table.wk-table').forEach(function (tb) {
      if (tb.getAttribute('data-v74')) return;
      tb.setAttribute('data-v74', '1');
      var rows = tb.querySelectorAll('tr');
      if (!rows.length) return;
      var mean = -1, trans = -1;
      Array.prototype.forEach.call(rows[0].children, function (c, i) {
        var t = (c.textContent || '').replace(/\s/g, '');
        if (t === '字詞義') mean = i;
        if (t === '語譯／解析') trans = i;
      });
      Array.prototype.forEach.call(rows, function (r, ri) {
        if (ri === 0) return;
        if (trans >= 0 && r.children[trans]) r.children[trans].classList.add('v69-acol');
        var c = mean >= 0 && r.children[mean];
        if (!c || c.tagName !== 'TD') return;
        c.innerHTML = c.innerHTML.split(/<br\s*\/?>/).map(function (x) {
          var m = x.match(/^(\s*[（(]\d[）)])([\s\S]*)$/);
          return m ? m[1] + '<span class="v74-rv" onclick="this.classList.toggle(\'on\')">' + m[2] + '</span>'
                   : '<span class="v74-rv" onclick="this.classList.toggle(\'on\')">' + x + '</span>';
        }).join('<br>');
      });
      if (mean >= 0) {
        var bar = document.createElement('div');
        bar.className = 'v74-rvbar';
        bar.innerHTML = '<button type="button" class="all">全部顯示</button><button type="button">全部隱藏</button>';
        bar.children[0].onclick = function () { tb.querySelectorAll('.v74-rv').forEach(function (e) { e.classList.add('on'); }); };
        bar.children[1].onclick = function () { tb.querySelectorAll('.v74-rv').forEach(function (e) { e.classList.remove('on'); }); };
        var wrap = tb.closest('.wk-tblwrap') || tb;
        wrap.parentNode.insertBefore(bar, wrap);
      }
    });
  }
  var _v74render = wkRenderCurrent;
  wkRenderCurrent = function () {
    var r = _v74render.apply(this, arguments);
    try { document.querySelectorAll('#wk-slide-area .wks-work, #wkfs-body .wks-work').forEach(fixWork); } catch (e) {}
    return r;
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/065_v75-charbian-js.js ════ */
try {

(function () {
  if (!TEXTBOOK['師說']) return;

  /* ── ① 字詞辨析頁：內容逐字取自 RAY PPT（暫存資料/04.第四課 師說 RAY1.pptx 義辨／形辨頁）；
        「之」依老師指定格式、分類經備課用書語譯與夾注核對；
        與備課用書不同處依備課用書（見 docs/交接_V75*.md）。 ── */
  var CB = [
    { name:'之', pages:[{ sub:'義辨', groups:[{ x:'之', rows:[
      ['（助）的', ['古之學者必有師。','道之所存，師之所存也。','古之聖人／今之眾人。','彼童子之師。','巫、醫、樂師、百工之人。','士大夫之族。']],
      ['（助）無義', ['師道之不傳也久矣。','欲人之無惑也難矣。','夫庸知其年之先後生於吾乎？','聖人之所以為聖，愚人之所以為愚。','師道之不復可知矣。']],
      ['（助）表倒裝', ['句讀之不知，惑之不解。']],
      ['代名詞', ['人非生而知之者。','吾從而師之。','擇師而教之。','授之書。','則群聚而笑之。','問之。','六藝經傳，皆通習之。','作〈師說〉以貽之。']],
      ['往、到', ['吾欲之南海。（彭端淑〈為學一首示子姪〉）']]
    ]}]}]},
    { name:'學者', pages:[{ sub:'義辨', groups:[{ x:'學者', rows:[
      ['學習的人', ['古之學者必有師。']],
      ['學問淵博而有所成就的人', ['生物學者。']]
    ]}]}]},
    { name:'者', pages:[{ sub:'義辨', groups:[{ x:'者', rows:[
      ['代名詞，……的人', ['學者、記者、作者。','人非生而知之者。']],
      ['助詞，用於句中，表示停頓', ['師者，所以傳道、受業、解惑也。','法者，天子所與天下公共也。（司馬遷〈張釋之執法〉）']],
      ['助詞，用於句末，表示語氣結束', ['蓮，花之君子者也。（周敦頤〈愛蓮說〉）']]
    ]}]}]},
    { name:'庸', pages:[{ sub:'義辨', groups:[{ x:'庸', rows:[
      ['豈', ['夫庸知其年之先後生於吾乎？']],
      ['愚笨、拙劣的', ['庸奴、庸醫。']],
      ['平常的、普通的', ['平庸。']],
      ['需要', ['無庸置疑。']],
      ['酬謝', ['酬庸。']]
    ]}]}]},
    { name:'所以', pages:[{ sub:'義辨', groups:[{ x:'所以', rows:[
      ['用來', ['師者，所以傳道、受業、解惑也。','不患無位，患所以立。（《論語．里仁》）']],
      ['為何，表原因', ['聖人之所以為聖，愚人之所以為愚，其皆出於此乎？','親賢臣，遠小人，此先漢所以興隆也。（諸葛亮〈出師表〉）']],
      ['因此、因而。常與「因為」連用，表示因果關係。', ['因為人太多，所以說的什麼話都聽不清楚。（《老殘遊記》第二回）']]
    ]}]}]},
    { name:'其', pages:[
      { sub:'義辨', groups:[{ x:'其', rows:[
        ['那些', ['其為惑也，終不解矣。']],
        ['大概，表示推測語氣', ['愚人之所以為愚，其皆出於此乎？']],
        ['他', ['余嘉其能行古道。']]
      ]}]},
      { sub:'義辨（延伸）', groups:[{ x:'其', rows:[
        ['通「豈」（反詰語氣）', ['則天下其有不亂，國家其有不亡者乎？（顧炎武〈廉恥〉）','不可為常者，其聖人之法乎？（歐陽脩〈縱囚論〉）']],
        ['假如（假設語氣）', ['蘭槐之根是為芷，其漸之滫，君子不近，庶人不服。（荀子〈勸學〉）','彼其能有所忍也，然後可以就大事。（蘇軾〈留侯論〉）']],
        ['希望（期望語氣）', ['聊布往懷，君其詳之。（丘遲〈與陳伯之書〉）']]
      ]}]}
    ]},
    { name:'不齒／不恥', pages:[{ sub:'義辨', groups:[
      { x:'不齒', rows:[['不屑與之並列', ['君子不齒。']]] },
      { x:'不恥', rows:[['不以……為恥', ['不恥相師。']]] }
    ]}]},
    { name:'師', pages:[
      { sub:'義辨', groups:[{ x:'師', rows:[
        ['老師', ['古之學者必有師。','師者，所以傳道、受業、解惑也。','惑而不從師。','道之所存，師之所存也。','從師而問焉。','恥學於師。','擇師而教之。','彼童子之師。','士大夫之族，曰師、曰弟子云者。','聖人無常師。','三人行，則必有我師。','弟子不必不如師，師不必賢於弟子。']],
        ['具有專門技藝的人', ['樂師。','師襄。']],
        ['學習、請教', ['吾從而師之。','吾師道也。','於其身也，則恥師焉。','或師焉，或不焉。','不恥相師。','孔子師郯子。']],
        ['從師問學的', ['師道之不傳也久矣。','師道之不復可知矣。']]
      ]}]},
      { sub:'義辨（延伸）', groups:[{ x:'師', rows:[
        ['對道士或僧尼的尊稱', ['法師、禪師。']],
        ['軍隊', ['出師、會師、興師問罪。']],
        ['都邑、都城', ['京師。']],
        ['榜樣、借鏡', ['前事不忘，後事之師。']]
      ]}]}
    ]},
    { name:'於', pages:[{ sub:'義辨', groups:[{ x:'於', rows:[
      ['向，表示趨向', ['恥學於師。','請學於余。']],
      ['從、由，表示所從', ['愚人之所以為愚，其皆出於此乎？']],
      ['對於，表示動作行為的對象', ['於其身也，則恥師焉。']],
      ['比，引進比較對象', ['師不必賢於弟子。']],
      ['被，置於動詞之後，表示被動', ['不拘於時。']]
    ]}]}]},
    { name:'貽', pages:[{ sub:'形辨', yin:true, groups:[
      { x:'貽', yin:'ㄧˊ', rows:[['贈送', ['作〈師說〉以貽之。']], ['遺留', ['貽笑大方。']]] },
      { x:'怡', yin:'ㄧˊ', rows:[['和悅、愉快', ['怡然自得、心曠神怡。']]] },
      { x:'飴', yin:'ㄧˊ', rows:[['用米或麥製成的糖漿或軟糖', ['甘之如飴、含飴弄孫。']]] }
    ]}]}
  ];

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function hi(ex, x) { return esc(ex).split(esc(x)).join('<b>' + esc(x) + '</b>'); }
  function exList(arr, x) {
    if (arr.length === 1) return hi(arr[0], x);
    var items = arr.map(function (e, i) { return (i + 1) + '. ' + hi(e, x); });
    return arr.length > 4 ? '<div class="v75-ex2">' + items.map(function (t) { return '<div>' + t + '</div>'; }).join('') + '</div>' : items.join('<br>');
  }
  function tableHTML(pg) {
    var h = '<table class="v75-yb"><tr><th>形</th>' + (pg.yin ? '<th>音</th>' : '') + '<th>義</th><th>例</th></tr>';
    pg.groups.forEach(function (g) {
      g.rows.forEach(function (r, ri) {
        h += '<tr>';
        if (ri === 0) {
          h += '<td class="v75-x" rowspan="' + g.rows.length + '">' + esc(g.x) + '</td>';
          if (pg.yin) h += '<td class="v75-yin" rowspan="' + g.rows.length + '">' + esc(g.yin) + '</td>';
        }
        h += '<td class="v75-y"><span class="v75-rv" onclick="this.classList.toggle(\'on\')">' + esc(r[0]) + '</span></td>' +
             '<td class="v75-e">' + exList(r[1], g.x) + '</td></tr>';
      });
    });
    return h + '</table>';
  }
  TEXTBOOK['師說'].charBian = CB.map(function (c) {
    return { name: c.name, pages: c.pages.map(function (pg) {
      return { sub: pg.sub, body: '<div class="v75-yb-wrap" data-kind="' + esc(pg.sub) + '">' + tableHTML(pg) + '</div>' };
    }) };
  });

  var _v75prev = wkRenderSlideHTML;
  wkRenderSlideHTML = function (slide) {
    if (slide && slide.type === 'charbian' && String(slide.body || '').indexOf('v75-yb-wrap') >= 0) {
      var kind = String(slide.sub || '義辨'), base = kind.replace(/（.*）/, ''), ext = kind.indexOf('延伸') >= 0;
      return '<div class="wk-slide wks-charbian v75-cb"><div class="v75-top">' +
        '<span class="v75-kind">' + base + '：' + slide.name + '</span>' + (ext ? '<span class="v75-tag">延伸</span>' : '') +
        '<span class="v75-bar"><button type="button" class="all" onclick="v75All(this,true)">全部顯示</button>' +
        '<button type="button" onclick="v75All(this,false)">全部隱藏</button></span></div>' +
        '<div class="jy-scroll">' + slide.body + '</div></div>';
    }
    return _v75prev.apply(this, arguments);
  };
  window.v75All = function (btn, on) {
    var sl = btn.closest('.wk-slide');
    if (sl) sl.querySelectorAll('.v75-rv').forEach(function (e) { e.classList.toggle('on', on); });
  };

  /* ── ② 課文浮框：依備課用書（夾注 P3-17～3-22、語譯）修正「之」「者」。逐一精確替換，次數不符就不替換並警告。 ── */
  var FIX = [
    [0, 2, '知{n:3|之}{g:者|表語氣停頓，無義}', '知{n:3|之}{g:者|代名詞，……的人}'],
    [1, 1, '{n:11|庸知其年之先後生於吾乎}', '{n:11|庸知其年{g:之|（助）無義}先後生於吾乎}'],
    [2, 0, '{n:13|師道}{g:之|的}', '{n:13|師道}{g:之|（助）無義}'],
    [2, 0, '欲人{g:之|的}', '欲人{g:之|（助）無義}'],
    [2, 1, '；今之眾人，', '；今{g:之|的}眾人，'],
    [3, 1, '授之{g:書|', '授{g:之|代名詞，他們}{g:書|'],
    [4, 0, '{n:26|百工}之人', '{n:26|百工}{g:之|的}人'],
    [4, 1, '則群聚而笑之。', '則群聚而笑{g:之|代名詞，他們}。'],
    [4, 2, '問之，則曰', '問{g:之|代名詞，他們}，則曰'],
    [4, 3, '百工之人，君子', '百工{g:之|的}人，君子'],
    [5, 1, '郯子{g:之|主謂之間，不譯}', '郯子之']
  ];
  var tp = TEXTBOOK['師說'].textPages;
  FIX.forEach(function (f) {
    try {
      var L = tp[f[0]].lines[f[1]];
      var n = L.text.split(f[2]).length - 1;
      if (n !== 1) { console.warn('[v75] 浮框替換次數不符，略過：', f[2], n); return; }
      L.text = L.text.replace(f[2], function () { return f[3]; });
    } catch (e) { console.warn('[v75] 浮框替換失敗：', f[2], e); }
  });

  /* ── ③ 課文「總」字卡「之」（v54-anno-js，DATA 在閉包內）：開卡後改寫本字卡表格，與辨析頁一致 ── */
  var ZHI = [
    ['（助）的', ['古「<b>之</b>」學者', '道「<b>之</b>」所存']],
    ['（助）無義', ['師道「<b>之</b>」不傳也久矣', '欲人「<b>之</b>」無惑也難矣']],
    ['（助）表倒裝', ['句讀「<b>之</b>」不知']],
    ['代名詞', ['人非生而知「<b>之</b>」者（指道、業）', '作〈師說〉以貽「<b>之</b>」（指李蟠）']]
  ];
  function patchZhi() {
    var ov = document.getElementById('ss-anno-ov'), ttl = document.getElementById('ss-ttl');
    if (!ov || !ttl || !/：之$/.test(ttl.textContent)) return;
    var tbl = ov.querySelector('#ss-body .ss-tbl');
    if (!tbl) return;
    tbl.innerHTML = ZHI.map(function (s, i) {
      var last = i === ZHI.length - 1 ? ' ss-last' : '';
      return '<div class="ss-c ss-c-num' + last + '"></div>' +
        '<div class="ss-c ss-c-yi' + last + '"><span class="ss-given">' + s[0] + '</span></div>' +
        '<div class="ss-c ss-c-ex' + last + '"><ol class="ss-exs">' + s[1].map(function (e) { return '<li>' + e + '</li>'; }).join('') + '</ol></div>';
    }).join('');
  }
  document.addEventListener('click', function (e) {
    var z = e.target.closest && e.target.closest('.ss-zong[data-k="之"]');
    if (z) setTimeout(patchZhi, 0);
  }, true);
  if (typeof window.ssOpenAnno === 'function') {
    var _open = window.ssOpenAnno;
    window.ssOpenAnno = function (key) { var r = _open.apply(this, arguments); if (key === '之') patchZhi(); return r; };
  }
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/067_v76-fix-js.js ════ */
try {

(function () {
  var T = TEXTBOOK['師說'];
  if (!T) return;

  /* ── ①② 浮框依備課用書再修；③ 補 RAY PPT 第 110、163 張的課文補充（逐一精確替換，次數不符就略過並警告） ── */
  var FIX = [
    [3, 1, '{g:書|寫字}', '{g:書|書本}'],                                   /* 備課用書疑難辨析：本課採「誦讀書本」 */
    [3, 0, '教{g:之|他，指士大夫之子}', '教{g:之|代名詞，他們}'],           /* 備課用書語譯「教育他們」 */
    [3, 0, '則{p:恥|', '{g:則|卻}{p:恥|'],                                  /* PPT 第 110 張：則＝卻 */
    [6, 1, '{n:45|不拘{g:於|', '{n:45|不{g:拘|限制}{g:於|'],               /* PPT 第 163 張：拘＝限制 */
    [6, 1, '{g:作|寫作}', '{g:作|創作}']                                    /* PPT 第 163 張：作＝創作 */
  ];
  FIX.forEach(function (f) {
    try {
      var L = T.textPages[f[0]].lines[f[1]];
      var n = L.text.split(f[2]).length - 1;
      if (n !== 1) { console.warn('[v76] 浮框替換次數不符，略過：', f[2], n); return; }
      L.text = L.text.replace(f[2], function () { return f[3]; });
    } catch (e) { console.warn('[v76] 浮框替換失敗：', f[2], e); }
  });
  /* PPT 第 131 張：第五段「彼與彼年相若也……官盛則近諛」加第二條句意（原文照錄） */
  try {
    var L5 = T.textPages[4].lines[2];
    if (L5.cite2 == null && L5.text.indexOf('彼與彼年相若也，道相似也') >= 0) {
      L5.cite2 = '彼與彼年相若也，道相似也。」位卑則足羞，官盛則近諛';
      L5.mean2 = '從年紀、地位兩方面來說明士大夫的求學心態。可對照第二段「無貴無賤，無長無少」';
    } else console.warn('[v76] 第五段句意未加（已有 cite2 或找不到原句）');
  } catch (e) { console.warn('[v76] 第五段句意失敗', e); }

  /* ── 辨析頁「庸」：依備課用書注⑪「豈、何必」 ── */
  (T.charBian || []).forEach(function (c) {
    if (c.name !== '庸') return;
    c.pages.forEach(function (p) {
      var n = p.body.split('>豈</span>').length - 1;
      if (n === 1) p.body = p.body.replace('>豈</span>', '>豈、何必</span>');
      else console.warn('[v76] 庸 辨析頁替換次數不符', n);
    });
  });

  /* ── ④ 總字卡（v54-anno-js）字義措辭與辨析頁統一：開卡後改寫顯示文字（例句、編號不動） ── */
  var MAP = {
    '師': { '有專門技藝的人':'具有專門技藝的人', '學習':'學習、請教' },
    '所以': { '用來（表目的）':'用來', '為何（表原因）':'為何，表原因' },
    '者': { '代詞，……的人':'代名詞，……的人', '助詞，句中表停頓':'助詞，用於句中，表示停頓' },
    '於': { '向':'向，表示趨向', '從、由':'從、由，表示所從', '對於':'對於，表示動作行為的對象',
            '比（引進比較對象）':'比，引進比較對象', '被（表被動）':'被，置於動詞之後，表示被動' },
    '其': { '那些（代詞）':'那些', '大概（推測語氣）':'大概，表示推測語氣', '他、他們（代詞）':'他' },
    '學者': { '古義：求學的人':'古義：學習的人', '今義：學問淵博而有成就的人':'今義：學問淵博而有所成就的人' }
  };
  var ZY = /[˙ㄅ-ㄯㆠ-ㆿ]+[ˊˇˋ]?/g;
  function wrapZhuyin(root) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, list = [];
    while ((n = w.nextNode())) {
      if (n.parentElement && n.parentElement.closest('.v76-zy, rt, .tp-z, .zy-note')) continue;
      ZY.lastIndex = 0;
      if (ZY.test(n.nodeValue)) list.push(n);
    }
    list.forEach(function (t) {
      var frag = document.createDocumentFragment(), s = t.nodeValue, last = 0, m;
      ZY.lastIndex = 0;
      while ((m = ZY.exec(s))) {
        if (m.index > last) frag.appendChild(document.createTextNode(s.slice(last, m.index)));
        var sp = document.createElement('span'); sp.className = 'v76-zy'; sp.textContent = m[0]; frag.appendChild(sp);
        last = m.index + m[0].length;
      }
      if (last < s.length) frag.appendChild(document.createTextNode(s.slice(last)));
      t.parentNode.replaceChild(frag, t);
    });
  }
  function patchCard() {
    var ttl = document.getElementById('ss-ttl'), body = document.querySelector('#ss-anno-ov #ss-body');
    if (!ttl || !body) return;
    var key = (ttl.textContent.split('：')[1] || '').trim(), mp = MAP[key];
    if (mp) {
      body.querySelectorAll('.ss-given').forEach(function (e) { if (mp[e.textContent]) e.textContent = mp[e.textContent]; });
      body.querySelectorAll('.ss-c-yi .ss-rv').forEach(function (e) {
        var v = e.getAttribute('data-v');
        if (mp[v]) { e.setAttribute('data-v', mp[v]); if (e.classList.contains('open')) e.textContent = mp[v]; }
      });
    }
  }
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('.ss-zong')) setTimeout(patchCard, 0);
  }, true);
  if (typeof window.ssOpenAnno === 'function') {
    var _open = window.ssOpenAnno;
    window.ssOpenAnno = function () { var r = _open.apply(this, arguments); patchCard(); return r; };
  }

  /* ── ⑤ 形音義內容（辨析頁、形音義互動卡、課文浮框字義）注音包成不換行 ── */
  var _v76render = wkRenderCurrent;
  wkRenderCurrent = function () {
    var r = _v76render.apply(this, arguments);
    try {
      document.querySelectorAll('#wk-slide-area .wks-charbian, #wkfs-body .wks-charbian, #wk-slide-area .wks-charquiz, #wkfs-body .wks-charquiz, #wk-slide-area .tp-gd, #wkfs-body .tp-gd').forEach(wrapZhuyin);
    } catch (e) {}
    return r;
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/069_v77-bian-js.js ════ */
try {

(function () {
  var T = TEXTBOOK['師說'];
  if (!T) return;

  /* ── ① 浮框（老師指示；PPT 第 110 張） ── */
  var FIX = [
    [3, 1, '{g:書|書本}', '{g:書|誦讀書本}'],
    [3, 1, '授{g:之|代名詞，他們}', '授{g:之|代名詞，他們，指童子}'],
    [3, 0, '}師焉，{n:20|', '}師{g:焉|（助）無義}，{n:20|']
  ];
  FIX.forEach(function (f) {
    try {
      var L = T.textPages[f[0]].lines[f[1]];
      var n = L.text.split(f[2]).length - 1;
      if (n !== 1) { console.warn('[v77] 浮框替換次數不符，略過：', f[2], n); return; }
      L.text = L.text.replace(f[2], function () { return f[3]; });
    } catch (e) { console.warn('[v77] 浮框替換失敗：', f[2], e); }
  });

  /* ── ② 「辨」連結：位置逐一對照 RAY PPT 第 66、79、97、136、149、163 張課文頁上的「辨」標記 ── */
  var BIAN = [
    { k:'學者', a:'古之學者必有師', w:'古之學者' },           /* 66 */
    { k:'者', a:'師者，所以', w:'師者' },                     /* 66 */
    { k:'庸', a:'夫庸知其年', w:'夫庸' },                     /* 79 */
    { k:'所以', a:'聖人之所以為聖', w:'聖人之所以' },         /* 97 */
    { k:'其', a:'其皆出於此乎', w:'其' },                     /* 97 */
    { k:'不齒／不恥', a:'君子不齒', w:'君子不齒' },           /* 136 */
    { k:'師', a:'弟子不必不如師，師不必', w:'弟子不必不如師' }, /* 149 */
    { k:'於', a:'請學於余', w:'請學於' },                     /* 163 */
    { k:'其', a:'余嘉其能行', w:'余嘉其' },                   /* 163 */
    { k:'貽', a:'以貽之', w:'以貽' }                          /* 163 */
  ];
  var SKIP = '.tp-gd, .tp-num, sup, .ss-zong, .v77-bian, rt';
  var ZYONLY = /^[\sˊˇˋ˙ㄅ-ㄯ]+$/;
  function textMap(line) {
    var w = document.createTreeWalker(line, NodeFilter.SHOW_TEXT, null), n, s = '', map = [];
    while ((n = w.nextNode())) {
      var pe = n.parentElement;
      if (!pe || pe.offsetParent === null || pe.closest(SKIP) || ZYONLY.test(n.nodeValue)) continue;
      for (var i = 0; i < n.nodeValue.length; i++) map.push([n, i]);
      s += n.nodeValue;
    }
    return { s: s, map: map };
  }
  function jumpIdx(k) {
    for (var i = 0; i < wkSlides.length; i++) if (wkSlides[i].type === 'charbian' && wkSlides[i].first && wkSlides[i].name === k) return i;
    return -1;
  }
  function inject(area) {
    if (!area || typeof wkKey === 'undefined' || wkKey !== '師說') return;
    var lines = area.querySelectorAll('.wks-textpage .tp-line');
    if (!lines.length) return;
    BIAN.forEach(function (c) {
      var idx = jumpIdx(c.k);
      if (idx < 0) return;
      lines.forEach(function (line) {
        if (line.querySelector('.v77-bian[data-a="' + c.a + '"]')) return;
        var tm = textMap(line), at = tm.s.indexOf(c.a);
        if (at < 0) return;
        var wi = c.a.indexOf(c.w);
        if (wi < 0) return;
        var end = tm.map[at + wi + c.w.length - 1];
        if (!end) return;
        var node = end[0], off = end[1] + 1;
        var b = document.createElement('span');
        b.className = 'v77-bian'; b.setAttribute('data-a', c.a); b.setAttribute('data-k', c.k);
        b.title = '字詞辨析：' + c.k;
        b.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); v68CbJump(e, idx); });
        /* 字在可點的字義／注釋元素末端時，連結放在該元素之後（不塞進浮框元素裡） */
        var host = node.parentElement.closest('.tp-g, .tp-n, .tp-p');
        var hostEnd = false;
        if (host) {
          var rest = off < node.nodeValue.length ? node.nodeValue.slice(off) : '';
          if (!rest.trim()) {
            var hm = textMap(host).map, last = hm[hm.length - 1];
            hostEnd = last && last[0] === node && last[1] === off - 1;
          }
        }
        if (host && hostEnd) host.parentNode.insertBefore(b, host.nextSibling);
        else {
          var after = off < node.nodeValue.length ? node.splitText(off) : node.nextSibling;
          node.parentNode.insertBefore(b, after);
        }
      });
    });
  }
  function run() { try { inject(document.getElementById('wk-slide-area')); inject(document.getElementById('wkfs-body')); } catch (e) {} }
  var _v77render = wkRenderCurrent;
  wkRenderCurrent = function () { var r = _v77render.apply(this, arguments); run(); setTimeout(run, 0); return r; };
  ['wk-slide-area', 'wkfs-body'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) new MutationObserver(function () { run(); }).observe(el, { childList: true, subtree: true });
  });
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/071_v78-zong-js.js ════ */
try {

(function () {
  var T = TEXTBOOK['師說'];
  if (!T) return;

  /* 課文「總」框位置：RAY PPT「辨」標記的 10 處（v77 已逐張對照）＋原有「總」框（賤、之、第四段「者」由 v54 照舊放）。
     同一句若 v54 已有同字的「總」框，移到 PPT 位置，避免一句兩個。 */
  var POS = [
    { k:'學者', a:'古之學者必有師', w:'古之學者' },
    { k:'者', a:'師者，所以', w:'師者' },
    { k:'庸', a:'夫庸知其年', w:'夫庸' },
    { k:'所以', a:'聖人之所以為聖', w:'聖人之所以' },
    { k:'其', a:'其皆出於此乎', w:'其' },
    { k:'不恥不齒', a:'君子不齒', w:'君子不齒' },
    { k:'師', a:'弟子不必不如師，師不必', w:'弟子不必不如師' },
    { k:'於', a:'請學於余', w:'請學於' },
    { k:'其', a:'余嘉其能行', w:'余嘉其' },
    { k:'貽', a:'以貽之', w:'以貽' }
  ];
  var CBNAME = { '不恥不齒':'不齒／不恥' };   /* v54 的鍵 → 辨析頁名稱 */

  /* ── 課文注入「總」框 ── */
  var SKIP = '.tp-gd, .tp-num, sup, .ss-zong, .v77-bian, rt';
  var ZYONLY = /^[\sˊˇˋ˙ㄅ-ㄯ]+$/;
  function textMap(el) {
    var w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null), n, s = '', map = [];
    while ((n = w.nextNode())) {
      var pe = n.parentElement;
      if (!pe || pe.offsetParent === null || pe.closest(SKIP) || ZYONLY.test(n.nodeValue)) continue;
      for (var i = 0; i < n.nodeValue.length; i++) map.push([n, i]);
      s += n.nodeValue;
    }
    return { s: s, map: map };
  }
  function makeBox(k, a) {
    var b = document.createElement('span');
    b.className = 'ss-zong v78-z'; b.setAttribute('data-k', k); b.setAttribute('data-a', a);
    b.textContent = '總'; b.title = k + ' 字義總整理（點開）';
    return b;
  }
  function inject(area) {
    if (!area || typeof wkKey === 'undefined' || wkKey !== '師說') return;
    var lines = area.querySelectorAll('.wks-textpage .tp-line');
    POS.forEach(function (c) {
      lines.forEach(function (line) {
        if (line.querySelector('.v78-z[data-a="' + c.a + '"]')) return;
        var tm = textMap(line), at = tm.s.indexOf(c.a);
        if (at < 0) return;
        var end = tm.map[at + c.a.indexOf(c.w) + c.w.length - 1];
        if (!end) return;
        /* 同一句 v54 已放的同字「總」框先拿掉（v54 的冪等檢查看到本框就不會再放） */
        line.querySelectorAll('.ss-zong:not(.v78-z)[data-k="' + c.k + '"]').forEach(function (z) { z.remove(); });
        var node = end[0], off = end[1] + 1, b = makeBox(c.k, c.a);
        var host = node.parentElement.closest('.tp-g, .tp-n, .tp-p'), hostEnd = false;
        if (host && !(off < node.nodeValue.length && node.nodeValue.slice(off).trim())) {
          var hm = textMap(host).map, last = hm[hm.length - 1];
          hostEnd = last && last[0] === node && last[1] === off - 1;
        }
        if (host && hostEnd) host.parentNode.insertBefore(b, host.nextSibling);
        else node.parentNode.insertBefore(b, off < node.nodeValue.length ? node.splitText(off) : node.nextSibling);
      });
    });
  }
  function run() { try { inject(document.getElementById('wk-slide-area')); inject(document.getElementById('wkfs-body')); } catch (e) {} }
  var _v78render = wkRenderCurrent;
  wkRenderCurrent = function () { var r = _v78render.apply(this, arguments); run(); setTimeout(run, 0); return r; };
  ['wk-slide-area', 'wkfs-body'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) new MutationObserver(function () { run(); }).observe(el, { childList: true, subtree: true });
  });

  /* ── 「總」字卡內容改取字詞辨析頁（v75 產生的表格；含延伸頁）；沒有辨析頁的字（賤）照舊 ── */
  function rowsOf(name) {
    var cb = (T.charBian || []).filter(function (c) { return c.name === name; })[0];
    if (!cb) return null;
    var rows = [];
    cb.pages.forEach(function (pg) {
      var ext = /延伸/.test(pg.sub || '');
      var box = document.createElement('div'); box.innerHTML = pg.body;
      var x = '', yin = '';
      box.querySelectorAll('table.v75-yb tr').forEach(function (tr) {
        var cx = tr.querySelector('.v75-x'), cy = tr.querySelector('.v75-yin'), yi = tr.querySelector('.v75-rv'), ex = tr.querySelector('.v75-e');
        if (!yi || !ex) return;
        if (cx) x = cx.textContent;
        if (cy) yin = cy.textContent;
        var exs = [];
        var parts = ex.querySelector('.v75-ex2') ? Array.prototype.map.call(ex.querySelectorAll('.v75-ex2 > div'), function (d) { return d.innerHTML; })
                                                 : ex.innerHTML.split(/<br\s*\/?>/);
        parts.forEach(function (h) { h = h.replace(/^\s*\d+\.\s*/, '').trim(); if (h) exs.push(h); });
        rows.push({ x: x, yin: pg.sub === '形辨' ? yin : '', def: yi.textContent, ex: exs, ext: ext });
      });
    });
    return rows;
  }
  function openRv(el) {
    if (el.classList.contains('open')) { el.classList.remove('open'); el.textContent = el.dataset.label; }
    else { el.classList.add('open'); el.textContent = el.dataset.v; }
  }
  function render(key) {
    var ov = document.getElementById('ss-anno-ov');
    if (!ov) return;
    var rows = rowsOf(CBNAME[key] || key);
    ov.classList.toggle('v78-card', !!rows);
    var tools = ov.querySelector('.ss-tools'), bar = tools && tools.querySelector('.v78-bar');
    if (tools && !bar) {
      bar = document.createElement('span'); bar.className = 'v78-bar';
      bar.innerHTML = '<button type="button" class="all">全部顯示</button><button type="button">全部隱藏</button>';
      bar.children[0].onclick = function () { ov.querySelectorAll('#ss-body .ss-rv:not(.open)').forEach(openRv); };
      bar.children[1].onclick = function () { ov.querySelectorAll('#ss-body .ss-rv.open').forEach(openRv); };
      tools.appendChild(bar);
    }
    if (!rows) {
      /* 沒有辨析頁的字（賤）：義也改成點選顯示，與其他字卡一致 */
      ov.querySelectorAll('#ss-body .ss-c-yi .ss-given').forEach(function (g) {
        var sp = document.createElement('span'); sp.className = 'ss-rv'; sp.dataset.label = '義'; sp.dataset.v = g.textContent; sp.textContent = '義';
        sp.addEventListener('click', function () { openRv(sp); });
        g.parentNode.replaceChild(sp, g);
      });
      return;
    }
    var tbl = ov.querySelector('#ss-body .ss-tbl');
    if (!tbl) return;
    var multi = rows.some(function (r) { return r.x !== rows[0].x; });
    tbl.innerHTML = rows.map(function (r, i) {
      var last = i === rows.length - 1 ? ' ss-last' : '';
      var first = i === 0 || rows[i - 1].x !== r.x;
      var num = '';
      if (multi && first) num = '<span class="v78-term"><span class="ss-term">' + r.x + '</span>' + (r.yin ? '<span class="ss-term">' + r.yin + '</span>' : '') + '</span>';
      if (r.ext && (i === 0 || !rows[i - 1].ext)) num += '<span class="v78-ext">延伸</span>';
      var exHtml = r.ex.map(function (e) { return '<li>' + e + '</li>'; }).join('');
      return '<div class="ss-c ss-c-num' + last + '">' + num + '</div>' +
        '<div class="ss-c ss-c-yi' + last + '"><span class="ss-rv" data-label="義" data-v="' + r.def.replace(/"/g, '&quot;') + '">義</span></div>' +
        '<div class="ss-c ss-c-ex' + last + '"><ol class="ss-exs' + (r.ex.length > 4 ? ' v78-2col' : '') + '">' + exHtml + '</ol></div>';
    }).join('');
    tbl.querySelectorAll('.ss-rv').forEach(function (el) { el.addEventListener('click', function () { openRv(el); }); });
    ov.querySelectorAll('#ss-body .ss-big .ss-rv').forEach(function (el) {
      if (!el.dataset.label) el.dataset.label = el.textContent;
      /* v54 資料「貽」的注音誤用國字「一」，改為注音符號「ㄧ」 */
      if (el.dataset.v && el.dataset.v.indexOf('一') >= 0) { el.dataset.v = el.dataset.v.replace(/一/g, 'ㄧ'); if (el.classList.contains('open')) el.textContent = el.dataset.v; }
    });
  }
  /* 點任何「總」框（含 v54 原有的）：開卡後在其他補丁之後改寫內容 */
  document.addEventListener('click', function (e) {
    var z = e.target.closest && e.target.closest('.ss-zong');
    if (!z) return;
    var key = z.getAttribute('data-k');
    if (z.classList.contains('v78-z')) { e.stopPropagation(); e.preventDefault(); window.ssOpenAnno(key); }
    setTimeout(function () { render(key); }, 0);
  }, true);
  if (typeof window.ssOpenAnno === 'function') {
    var _open = window.ssOpenAnno;
    window.ssOpenAnno = function (key) { var r = _open.apply(this, arguments); setTimeout(function () { render(key); }, 0); return r; };
  }
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/073_v79-fix-js.js ════ */
try {

(function () {
  var T = TEXTBOOK['師說'];
  if (!T) return;

  /* ── ① 「於」辨析簡化（老師：太複雜）：只留用法 ── */
  var YU = [
    ['向，表示趨向', '向'],
    ['從、由，表示所從', '從、由'],
    ['對於，表示動作行為的對象', '對於'],
    ['比，引進比較對象', '比'],
    ['被，置於動詞之後，表示被動', '被']
  ];
  (T.charBian || []).forEach(function (c) {
    if (c.name !== '於') return;
    c.pages.forEach(function (p) {
      YU.forEach(function (r) {
        var a = '>' + r[0] + '</span>', n = p.body.split(a).length - 1;
        if (n === 1) p.body = p.body.replace(a, '>' + r[1] + '</span>');
        else console.warn('[v79] 於 辨析替換次數不符', r[0], n);
      });
    });
  });

  /* ── ② 「總」字卡：左欄字形跨列合併（同一字形的義列共用一格），底線只畫在字形群組結尾 ── */
  function spanTerms() {
    var tbl = document.querySelector('#ss-anno-ov.v78-card #ss-body .ss-tbl');
    /* 表格會被重畫（v78 開卡時畫兩次），以儲存格本身是否已處理判斷，不在 tbl 上做記號 */
    if (!tbl || !tbl.querySelector('.ss-c-num:not(.v79-span) .v78-term')) return;
    var cells = Array.prototype.slice.call(tbl.children), rows = [];
    for (var i = 0; i + 2 < cells.length; i += 3) rows.push(cells.slice(i, i + 3));
    var g = null;
    rows.forEach(function (r) {
      var num = r[0];
      if (num.querySelector('.v78-term')) { g = { cell: num, n: 1 }; num.classList.add('v79-span'); }
      else if (g && !num.textContent.trim()) { g.n++; num.remove(); }
      else g = null;
      if (g) {
        g.cell.style.gridRow = 'span ' + g.n;
        g.cell.classList.toggle('ss-last', r[1].classList.contains('ss-last'));
      }
    });
  }
  function watch() {
    var ov = document.getElementById('ss-anno-ov');
    if (!ov) return false;
    new MutationObserver(spanTerms).observe(ov, { childList: true, subtree: true });
    return true;
  }
  if (!watch()) {
    var t = new MutationObserver(function () { if (watch()) t.disconnect(); });
    t.observe(document.body, { childList: true });
  }
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/075_v80-rhet-js.js ════ */
try {

(function () {
  var T = TEXTBOOK['師說'];
  if (!T) return;
  var K = T.keyRhetoric || [];
  var CUO = K.filter(function (r) { return r.name === '錯綜'; })[0];
  var HUI = K.filter(function (r) { return r.name === '回文'; })[0];
  if (!CUO || !HUI) return;

  /* ── 例句（全部取自既有 keyRhetoric 資料與 RAY PPT 第 115～120、150～151 張；說明句取自各類定義） ── */
  var TYPES = [
    { no:'(一)', name:'抽換詞面', def:'以同義的詞語取代形式整齊句子中的某些詞語。', cls:'v80-sm', ex:[
      { k:'syn', src:'惠王用張儀之計，拔三川之地，西并巴、蜀，北收上郡，南取漢中，包九夷，制鄢、郢，東據成皋之險，割膏腴之壤。（李斯〈諫逐客書〉）',
        toks:['惠王用張儀之計，',['拔'],'三川之地，西',['并'],'巴、蜀，北',['收'],'上郡，南',['取'],'漢中，',['包'],'九夷，',['制'],'鄢、郢，東',['據'],'成皋之險，',['割'],'膏腴之壤。'],
        res:'取得', note:'拔、并、收、取、包、制、據、割皆為「取得」之同義詞。' } ] },
    { no:'(二)', name:'交錯語次', def:'上下兩句語詞的次序，故意弄得參差不齊。', cls:'v80-mid', ex:[
      { k:'ro', src:'句讀之不知，惑之不解，或師焉，或不焉。（韓愈〈師說〉）', ck:[[1,'句讀之不知'],[3,'惑之不解'],[2,'或師焉'],[4,'或不焉']],
        note:'「句讀之不知」配「或師焉」（1‧2）；「惑之不解」配「或不焉」（3‧4）。作者刻意交錯成 1‧3‧2‧4，使語勢參差、避免呆板，這就是交蹉語次。' },
      { k:'ro', src:'惟江上之清風，與山間之明月，耳得之而為聲，目遇之而成色。（蘇軾〈赤壁賦〉）', ck:[[1,'惟江上之清風'],[3,'與山間之明月'],[2,'耳得之而為聲'],[4,'目遇之而成色']],
        note:'「江上之清風」配「耳得之而為聲」（1‧2，聽覺）；「山間之明月」配「目遇之而成色」（3‧4，視覺）。交錯成 1‧3‧2‧4，使句式錯落有致。' } ] },
    { no:'(三)', name:'伸縮文身', def:'把字數相等的句子，故意布置成字數不等，使長句短句交相錯雜。', cls:'v80-mid', ex:[
      { k:'len', src:'野芳發而幽香，佳木秀而繁陰，風霜高潔，水落而石出者，山間之四時也。（歐陽脩〈醉翁亭記〉）',
        rows:['野芳發而幽香','佳木秀而繁陰','風霜高潔','水落而石出者'], hi:[2], tail:'山間之四時也。' },
      { k:'len', src:'春天像一篇巨製的駢儷文，而夏天像一首絕句。（簡媜〈夏之絕句〉）',
        rows:['春天像一篇巨製的駢儷文','而夏天像一首絕句'], hi:[1], tail:'' } ] },
    { no:'(四)', name:'變化句式', def:'將肯定句與否定句、直述句與疑問句，穿插寫入。', cls:'v80-mid', ex:[
      { k:'pn', src:'婚後生活不是磚，不是石，不是泥，不是沙，而是容忍，是體貼，是寬恕，是犧牲。',
        segs:['婚後生活',['n','不是磚'],'，',['n','不是石'],'，',['n','不是泥'],'，',['n','不是沙'],'，',['p','而是容忍'],'，',['p','是體貼'],'，',['p','是寬恕'],'，',['p','是犧牲'],'。'] },
      { k:'pn', src:'那榆蔭下的一潭，不是清泉，是天上虹。（徐志摩〈再別康橋〉）',
        segs:['那榆蔭下的一潭，',['n','不是清泉'],'，',['p','是天上虹'],'。'] } ] }
  ];
  var POEM = '潮隨暗浪雪山傾，遠浦漁舟釣月明。橋對寺門松徑小，檻當泉眼石波清。迢迢綠樹江天曉，靄靄紅霞晚日晴。遙望四邊雲接水，雪峰千點數鷗輕。';
  var HUI_EX = [
    { k:'swap', src:'弟子不必不如師，師不必賢於弟子。（韓愈〈師說〉）', r1:[['A','弟子'],['','不必不如'],['B','師'],['','，']], r2:[['B','師'],['','不必賢於'],['A','弟子'],['','。']] },
    { k:'swap', src:'開車不喝酒，喝酒不開車', r1:[['A','開車'],['','不'],['B','喝酒'],['','，']], r2:[['B','喝酒'],['','不'],['A','開車']] },
    { k:'swap', src:'讀書不忘救國，救國不忘讀書', r1:[['A','讀書'],['','不忘'],['B','救國'],['','，']], r2:[['B','救國'],['','不忘'],['A','讀書']] },
    { k:'swap', src:'文章是案頭之山水，山水是地上之文章', r1:[['A','文章'],['','是案頭之'],['B','山水'],['','，']], r2:[['B','山水'],['','是地上之'],['A','文章']] },
    { k:'poem', src:'蘇軾〈題金山寺迴文本〉', text:POEM, cls:'v80-sm' }
  ];

  /* ── 資料：錯綜只留「定義＋四類名稱」頁；回文只留定義頁；v73 的回文動畫頁改由本版取代 ── */
  var cuoDef = (CUO.pages[0].body.match(/<div class="rt-def">[\s\S]*?<\/div>/) || [''])[0];
  CUO.pages = [{ sub:'定義與四種類型', body: cuoDef + '<div class="v80-types">' + TYPES.map(function (t, i) {
    return '<div class="v80-type" onclick="v80GoType(event,' + i + ')">' + t.no + ' ' + t.name + '</div>'; }).join('') + '</div>' }];
  HUI.pages = [HUI.pages[0]];
  try { if (window.V73_ANIMS && V73_ANIMS['師說']) delete V73_ANIMS['師說']['回文']; } catch (e) {}

  /* ── 投影片：錯綜定義頁後插四類頁；回文定義頁後插動畫頁（位移習作答案總覽的跳題索引） ── */
  function insertAfter(slides, name, add) {
    var at = -1;
    slides.forEach(function (s, i) { if (s.type === 'keyrhet' && s.name === name) at = i + 1; });
    if (at < 0) return;
    Array.prototype.splice.apply(slides, [at, 0].concat(add));
    slides.forEach(function (s) {
      if (s.type === 'work_answers') (s.targets || []).forEach(function (t) { if (t.slideIdx >= at) t.slideIdx += add.length; });
    });
  }
  var _v80parse = wkParseSlides;
  wkParseSlides = function (key) {
    var slides = _v80parse.apply(this, arguments);
    if (key !== '師說') return slides;
    insertAfter(slides, '錯綜', TYPES.map(function (t, i) { return { type:'v80rx', name:'錯綜', ti:i }; }));
    insertAfter(slides, '回文', [{ type:'v80rx', name:'回文', ti:-1 }]);
    return slides;
  };
  window.v80GoType = function (ev, i) {
    if (ev) ev.stopPropagation();
    for (var j = 0; j < wkSlides.length; j++) if (wkSlides[j].type === 'v80rx' && wkSlides[j].name === '錯綜' && wkSlides[j].ti === i) { wkGoto(j); return; }
  };

  /* ── 渲染 ── */
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  var NSTEP = { syn:2, ro:3, len:2, pn:3, swap:3, poem:2 };
  function exHTML(e) {
    var h = '';
    if (e.k === 'syn') {
      h = '<div class="v80-sy">' + e.toks.map(function (t) { return Array.isArray(t) ? '<span class="k kS">' + esc(t[0]) + '</span>' : esc(t); }).join('') + '</div>' +
        '<div class="v80-syn">' + e.toks.filter(Array.isArray).map(function (t) { return '<span class="chip">' + esc(t[0]) + '</span>'; }).join('') +
        '<span class="eq">＝</span><span class="res">' + esc(e.res) + '</span></div>';
    } else if (e.k === 'ro') {
      h = '<div class="v80-ro">' + e.ck.map(function (c) {
        return '<span class="ck g' + (c[0] <= 2 ? 1 : 2) + '" data-n="' + c[0] + '">' + esc(c[1]) + '<i>' + c[0] + '</i></span>'; }).join('') + '</div>';
    } else if (e.k === 'len') {
      h = '<div class="v80-len">' + e.rows.map(function (r, i) {
        return '<div class="ln' + (e.hi.indexOf(i) >= 0 ? ' hi' : '') + '">' + Array.from(r).map(function (c) { return '<span class="c">' + esc(c) + '</span>'; }).join('') +
          '<span class="cnt">' + Array.from(r).length + ' 字</span></div>'; }).join('') +
        (e.tail ? '<div class="ln tail">' + esc(e.tail) + '</div>' : '') + '</div>';
    } else if (e.k === 'pn') {
      h = '<div class="v80-pn">' + e.segs.map(function (s) {
        return Array.isArray(s) ? '<span class="seg ' + (s[0] === 'n' ? 'neg' : 'pos') + '">' + esc(s[1]) + '</span>' : esc(s); }).join('') + '</div>' +
        '<div class="v80-leg"><span class="ln">否定句</span><span class="lp">肯定句</span></div>';
    } else if (e.k === 'swap') {
      var row = function (r, c) { return '<div class="row ' + c + '">' + r.map(function (t) {
        return t[0] ? '<span class="k k' + t[0] + '" data-k="' + t[0] + '">' + esc(t[1]) + '</span>' : '<span class="' + (t[1].length > 1 ? 'mid' : '') + '">' + esc(t[1]) + '</span>';
      }).join('') + '</div>'; };
      h = '<div class="v73-hw">' + row(e.r1, 'r1') + row(e.r2, 'r2') + '</div>';
    } else if (e.k === 'poem') {
      var chars = Array.from(e.text.replace(/[，。]/g, ''));
      var lines = function (arr) { var out = []; for (var i = 0; i < arr.length; i += 7) out.push(arr.slice(i, i + 7).join('') + (i / 7 % 2 ? '。' : '，')); return out; };
      var fwd = lines(chars), rev = lines(chars.slice().reverse());
      var mark = function (L, first) { return L.map(function (l, i) {
        var s = esc(l);
        if (i === 0 && first) s = '<span class="ends">' + s.charAt(0) + '</span>' + s.slice(1);
        if (i === L.length - 1 && !first) s = s.slice(0, -2) + '<span class="ends">' + s.slice(-2, -1) + '</span>' + s.slice(-1);
        return s; }).join('<br>'); };
      h = '<div class="v80-poem"><div class="pc"><div class="h">順讀</div>' + mark(fwd, false) + '</div>' +
        '<div class="pc rev"><div class="h">由末字倒讀</div><div class="pc-t">' + mark(rev, true) + '</div></div></div>';
    }
    return '<div class="v73-src">' + esc(e.src) + '</div><div class="v73-stage">' + h + '<svg class="v73-svg"></svg></div>' +
      (e.note ? '<div class="v73-note">' + esc(e.note) + '</div>' : '');
  }
  function tabName(e, i) { return '例' + '一二三四五六'[i]; }
  function boxHTML(exs, cap, cls) {
    var tabs = exs.length > 1 ? '<div class="v73-tabs">' + exs.map(function (e, i) {
      return '<button class="v73-tab' + (i ? '' : ' on') + '" onclick="v80Show(this,' + i + ')">' + tabName(e, i) + '</button>'; }).join('') + '</div>' : '';
    /* 控制列放在上方（與例句分頁同一列），全螢幕時不會被下方換頁列遮住 */
    return '<div class="v73a ' + (cls || '') + '" data-ex="0" data-st="0"><div class="v80-top">' + tabs +
      '<div class="v73-ctrl"><button class="v73-btn" onclick="v80Step(this)">▶ 下一步</button>' +
      '<button class="v73-btn rst" onclick="v80Reset(this)">↻ 重來</button><span class="v73-tip"></span></div></div>' +
      exs.map(function (e, i) {
      return '<div class="v73-ex' + (i ? '' : ' cur') + ' ' + (e.cls || '') + '" data-k="' + e.k + '" data-n="' + NSTEP[e.k] + '">' + exHTML(e) + '</div>'; }).join('') +
      '<div class="v73-cap">' + esc(cap) + '</div></div>';
  }
  function slideHTML(s) {
    var name, sub, def, box;
    if (s.name === '錯綜') {
      var t = TYPES[s.ti];
      sub = t.no + ' ' + t.name; def = t.def;
      box = boxHTML(t.ex, '錯綜' + t.no + t.name + '：' + t.def, t.cls);
    } else {
      sub = '動畫（' + HUI_EX.length + ' 例）'; def = '上下兩句，詞彙大多相同，而詞序恰好相反（或循環往復）。';
      box = boxHTML(HUI_EX, '回文：上下兩句，詞彙大多相同，而詞序恰好相反（或循環往復），形成往復迴環的趣味。', 'v80-mid');
    }
    return '<div class="wk-slide wks-keyrhet v73-kr v73-anim-slide v80-rx">' +
      '<div class="wks-kr-head"><span class="wks-kr-name">' + esc(s.name) + '</span><span class="wks-kr-sub">' + esc(sub) + '</span></div>' +
      '<div class="v80-tdef">' + esc(def) + '</div>' + box + '</div>';
  }
  var _v80render = wkRenderSlideHTML;
  wkRenderSlideHTML = function (slide) {
    if (slide && slide.type === 'v80rx') return slideHTML(slide);
    return _v80render.apply(this, arguments);
  };

  /* ── 動畫控制 ── */
  function rel(el, base) { var x = 0, y = 0, n = el; while (n && n !== base) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x:x, y:y, w:el.offsetWidth, h:el.offsetHeight }; }
  function drawPath(svg, d, color) {
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d); p.setAttribute('stroke', color); svg.appendChild(p);
    var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; void p.getBoundingClientRect(); p.classList.add('v73-draw');
  }
  function words(ex) { return Array.prototype.map.call(ex.querySelectorAll('.r1 .k'), function (k) { return '「' + k.textContent + '」'; }).join('與'); }
  var TIPS = {
    syn: function (ex, st) { return ['① 找出換用的字', '② 意思相同，都是「' + ex.querySelector('.res').textContent + '」'][st - 1]; },
    ro: function (ex, st) { return ['① 標出原本的配對順序', '② 還原成整齊的配對：1‧2／3‧4', '③ 作者刻意交錯成 1‧3‧2‧4'][st - 1]; },
    len: function (ex, st) { return ['① 逐字排列', '② 字數不等，長短交錯'][st - 1]; },
    pn: function (ex, st) { return ['① 否定句', '② 肯定句', '③ 肯定句與否定句穿插寫入'][st - 1]; },
    swap: function (ex, st) { return ['① 找出關鍵詞：' + words(ex), '② 下句把兩個詞的位置對調', '③ 位置互換、循環相對'][st - 1]; },
    poem: function (ex, st) { return ['① 順讀全詩', '② 從最後一字倒著讀，也成一首詩'][st - 1]; }
  };
  function apply(ex, st) {
    var k = ex.dataset.k, stage = ex.querySelector('.v73-stage'), svg = ex.querySelector('.v73-svg');
    ex.classList.add('s' + st);
    if (k === 'syn') {
      if (st === 1) ex.querySelectorAll('.kS').forEach(function (x, i) { setTimeout(function () { x.classList.add('lit'); }, i * 220); });
      if (st === 2) { ex.querySelector('.v80-syn').classList.add('show'); var n = ex.querySelector('.v73-note'); if (n) n.classList.add('show'); }
    } else if (k === 'ro') {
      var ro = ex.querySelector('.v80-ro');
      if (st === 1) ro.classList.add('num');
      if (st === 2) {
        var cks = Array.prototype.slice.call(ro.querySelectorAll('.ck')), first = cks.map(function (c) { return c.getBoundingClientRect(); });
        cks.slice().sort(function (a, b) { return a.dataset.n - b.dataset.n; }).forEach(function (c, i) {
          ro.appendChild(c);
          if (i === 1) { var sp = document.createElement('span'); sp.className = 'sep'; sp.textContent = '／'; ro.appendChild(sp); }
        });
        cks.forEach(function (c, i) {
          var a = first[i], b = c.getBoundingClientRect();
          c.style.transition = 'none'; c.style.transform = 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px)';
          void c.offsetWidth; c.style.transition = 'transform .9s cubic-bezier(.5,0,.3,1)'; c.style.transform = '';
        });
        ro.classList.add('grp');
      }
      if (st === 3) { var nt = ex.querySelector('.v73-note'); if (nt) nt.classList.add('show'); }
    } else if (k === 'len') {
      var ln = ex.querySelector('.v80-len');
      if (st === 1) ln.classList.add('box');
      if (st === 2) ln.classList.add('cnt-on');
    } else if (k === 'pn') {
      var pn = ex.querySelector('.v80-pn');
      if (st === 1) pn.classList.add('s-neg');
      if (st === 2) pn.classList.add('s-pos');
    } else if (k === 'swap') {
      if (st === 1) ex.querySelectorAll('.r1 .k').forEach(function (x) { x.classList.add('lit'); });
      if (st === 2) ex.querySelectorAll('.r2 .k').forEach(function (t) {
        var src = ex.querySelector('.r1 .k[data-k="' + t.dataset.k + '"]'), a = src.getBoundingClientRect(), b = t.getBoundingClientRect();
        t.classList.add('lit'); t.style.transition = 'none'; t.style.transform = 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px)';
        void t.offsetWidth; t.style.transition = 'transform 1s cubic-bezier(.5,0,.3,1), background .4s, color .4s'; t.style.transform = '';
      });
      if (st === 3) ['A', 'B'].forEach(function (key) {
        var p = rel(ex.querySelector('.r1 .k[data-k="' + key + '"]'), stage), q = rel(ex.querySelector('.r2 .k[data-k="' + key + '"]'), stage);
        drawPath(svg, 'M' + (p.x + p.w / 2) + ' ' + (p.y + p.h) + ' L' + (q.x + q.w / 2) + ' ' + q.y, key === 'A' ? '#1f5fa8' : '#c0392b');
      });
    } else if (k === 'poem') {
      if (st === 2) ex.querySelector('.v80-poem').classList.add('show');
    }
  }
  function syncBtn(box) {
    var exs = box.querySelectorAll('.v73-ex'), ei = +box.dataset.ex, st = +box.dataset.st, n = +exs[ei].dataset.n, btn = box.querySelector('.v73-btn:not(.rst)');
    btn.disabled = false;
    btn.textContent = st < n ? '▶ 下一步' : (ei + 1 < exs.length ? '▶ 下一例' : '▶ 總結');
    if (box.querySelector('.v73-cap.show')) { btn.disabled = true; btn.textContent = '✓ 完成'; }
  }
  var SRC = {};
  function resetEx(ex) {
    var id = ex.dataset.rid; if (!id) { id = ex.dataset.rid = 'r' + Math.random().toString(36).slice(2); }
    if (!SRC[id]) SRC[id] = ex.innerHTML; else ex.innerHTML = SRC[id];
    ex.className = ex.className.replace(/\bs\d\b/g, '').replace(/\s+/g, ' ').trim();
    if (!/\bcur\b/.test(ex.className)) ex.className += ' cur';
  }
  function show(box, i) {
    box.querySelectorAll('.v73-ex').forEach(function (e, j) { e.classList.toggle('cur', j === i); });
    box.querySelectorAll('.v73-tab').forEach(function (t, j) { t.classList.toggle('on', j === i); });
    resetEx(box.querySelectorAll('.v73-ex')[i]);
    box.dataset.ex = i; box.dataset.st = 0;
    box.querySelector('.v73-cap').classList.remove('show'); box.querySelector('.v73-tip').textContent = '';
    syncBtn(box);
  }
  window.v80Show = function (el, i) { if (window.event) window.event.stopPropagation(); show(el.closest('.v73a'), i); };
  window.v80Reset = function (btn) { if (window.event) window.event.stopPropagation(); show(btn.closest('.v73a'), +btn.closest('.v73a').dataset.ex); };
  window.v80Step = function (btn) {
    if (window.event) window.event.stopPropagation();
    var box = btn.closest('.v73a'), exs = box.querySelectorAll('.v73-ex'), ei = +box.dataset.ex, st = +box.dataset.st, ex = exs[ei], n = +ex.dataset.n;
    if (!ex.dataset.rid) resetEx(ex);
    if (st >= n) {
      if (ei + 1 < exs.length) { show(box, ei + 1); return; }
      box.querySelector('.v73-cap').classList.add('show'); box.querySelector('.v73-tip').textContent = ''; syncBtn(box); return;
    }
    st++; box.dataset.st = st; apply(ex, st);
    box.querySelector('.v73-tip').textContent = TIPS[ex.dataset.k](ex, st) || '';
    syncBtn(box);
  };

  /* ── 導覽列：映襯、設問、轉品、頂針、類疊、引用 收成「修辭 ▾」（一般＋全螢幕） ── */
  var FOLD = ['映襯', '設問', '轉品', '頂針', '類疊', '引用'];
  function fold(boxId, btnCls, activeCls) {
    var box = document.getElementById(boxId);
    if (!box || typeof wkKey === 'undefined' || wkKey !== '師說' || box.querySelector('.v80-rh-toggle')) return;
    var btns = Array.prototype.filter.call(box.querySelectorAll('button.' + btnCls), function (b) {
      return FOLD.indexOf((b.textContent || '').replace(/^◆/, '').trim()) >= 0; });
    if (btns.length < 2) return;
    var tog = document.createElement('button'); tog.type = 'button'; tog.className = btnCls + ' v80-rh-toggle'; tog.textContent = '◆修辭 ▾';
    var grp = document.createElement('span'); grp.className = 'v80-rh-group';
    tog.onclick = function (e) { e.stopPropagation(); var o = grp.classList.toggle('open'); tog.textContent = o ? '◆修辭 ▴' : '◆修辭 ▾'; };
    box.insertBefore(tog, btns[0]); box.insertBefore(grp, btns[0]);
    btns.forEach(function (b) { grp.appendChild(b); });
  }
  function mark() {
    [['wk-sections', 'wk-sec-active'], ['wkfs-sections', 'active']].forEach(function (p) {
      var box = document.getElementById(p[0]), tog = box && box.querySelector('.v80-rh-toggle');
      if (tog) tog.classList.toggle(p[1], !!box.querySelector('.v80-rh-group .' + p[1]));
    });
  }
  var _v80show = showWenxue;
  showWenxue = function () { var r = _v80show.apply(this, arguments); fold('wk-sections', 'wk-sec-btn'); mark(); return r; };
  var _v80proj = wkOpenProj;
  wkOpenProj = function () { var r = _v80proj.apply(this, arguments); fold('wkfs-sections', 'wkfs-sec-btn'); mark(); return r; };
  var _v80cur = wkRenderCurrent;
  wkRenderCurrent = function () { var r = _v80cur.apply(this, arguments); try { mark(); } catch (e) {} return r; };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/076_v81-fold-js.js ════ */
try {

(function () {
  function foldYidong(boxId) {
    var box = document.getElementById(boxId);
    if (!box || typeof wkKey === 'undefined' || wkKey !== '師說') return;
    var grp = box.querySelector('.v80-rh-group');
    if (!grp) return;
    Array.prototype.forEach.call(box.querySelectorAll('button'), function (b) {
      if ((b.textContent || '').replace(/^◆/, '').trim() === '意動用法' && b.parentNode !== grp) grp.insertBefore(b, grp.firstChild);
    });
  }
  var _v81show = showWenxue;
  showWenxue = function () { var r = _v81show.apply(this, arguments); foldYidong('wk-sections'); return r; };
  var _v81proj = wkOpenProj;
  wkOpenProj = function () { var r = _v81proj.apply(this, arguments); foldYidong('wkfs-sections'); return r; };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/081_v87-shishuo-tr-js.js ════ */
try {

/* v87：《師說》第四段「擇師而教之」語譯 教他 → 教他們（浮框 v76 已為「代名詞，他們」；老師 9/30 指示）。資料行不動，執行期精確替換，次數不符就略過並警告 */
(function () {
  var T = (typeof TEXTBOOK !== 'undefined') && TEXTBOOK['師說'];
  if (!T) return;
  var OLD = '就選擇老師來教他；', NEW = '就選擇老師來教他們；';
  try {
    var P = T.textPages[3], L = P.lines[0];
    [[L, 'tr'], [P, 'fan']].forEach(function (x) {
      var s = x[0][x[1]], n = s.split(OLD).length - 1;
      if (n !== 1) { console.warn('[v87] 語譯替換次數不符，略過：', x[1], n); return; }
      x[0][x[1]] = s.replace(OLD, NEW);
    });
  } catch (e) { console.warn('[v87] 語譯替換失敗', e); }
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/083_v88-js.js ════ */
try {

(function () {
  /* ── ① 版號：之後每一版只改這一行 ── */
  window.APP_VERSION = 'V88';
  function badge() {
    if (document.getElementById('v88-ver')) return;
    var d = document.createElement('div'); d.id = 'v88-ver'; d.textContent = window.APP_VERSION; document.body.appendChild(d);
  }
  if (document.body) badge(); else document.addEventListener('DOMContentLoaded', badge);

  /* ── ② ③ 師說錯綜／回文 ── */
  var T = (typeof TEXTBOOK !== 'undefined') && TEXTBOOK['師說'];
  if (!T || typeof wkRenderSlideHTML !== 'function') return;

  /* 例句與 v80 相同（取自既有 keyRhetoric 資料＝RAY PPT）；交錯語次改依原句順序編號，配對 1‧3／2‧4，說明為老師 9/30 指定措辭 */
  var RO_HEAD = '原句的順序是①②③④，解釋時要改成①③、②④兩兩配對來讀；這種故意把語序錯開的寫法，就是「交錯語次」。';
  var TYPES = [
    { no:'(一)', name:'抽換詞面', def:'以同義的詞語取代形式整齊句子中的某些詞語。', cls:'v80-sm', ex:[
      { k:'syn', src:'惠王用張儀之計，拔三川之地，西并巴、蜀，北收上郡，南取漢中，包九夷，制鄢、郢，東據成皋之險，割膏腴之壤。（李斯〈諫逐客書〉）',
        toks:['惠王用張儀之計，',['拔'],'三川之地，西',['并'],'巴、蜀，北',['收'],'上郡，南',['取'],'漢中，',['包'],'九夷，',['制'],'鄢、郢，東',['據'],'成皋之險，',['割'],'膏腴之壤。'],
        res:'取得', note:['拔、并、收、取、包、制、據、割皆為「取得」之同義詞。'] } ] },
    { no:'(二)', name:'交錯語次', def:'上下兩句語詞的次序，故意弄得參差不齊。', cls:'v80-mid', ex:[
      { k:'ro', src:'句讀之不知，惑之不解，或師焉，或不焉。（韓愈〈師說〉）', ck:[[1,'句讀之不知'],[2,'惑之不解'],[3,'或師焉'],[4,'或不焉']],
        note:[RO_HEAD, '①句讀之不知，③或師焉：不懂句讀，有的人（指士大夫之子）會從師請教；', '②惑之不解，④或不焉：有疑惑解不開，有的人（指士大夫自身）卻不肯從師問學。'] },
      { k:'ro', src:'惟江上之清風，與山間之明月，耳得之而為聲，目遇之而成色。（蘇軾〈赤壁賦〉）', ck:[[1,'惟江上之清風'],[2,'與山間之明月'],[3,'耳得之而為聲'],[4,'目遇之而成色']],
        note:[RO_HEAD, '①惟江上之清風，③耳得之而為聲：耳朵聽到的（聽覺）；', '②與山間之明月，④目遇之而成色：眼睛看到的（視覺）。'] } ] },
    { no:'(三)', name:'伸縮文身', def:'把字數相等的句子，故意布置成字數不等，使長句短句交相錯雜。', cls:'v80-mid', ex:[
      { k:'len', src:'野芳發而幽香，佳木秀而繁陰，風霜高潔，水落而石出者，山間之四時也。（歐陽脩〈醉翁亭記〉）',
        rows:['野芳發而幽香','佳木秀而繁陰','風霜高潔','水落而石出者'], hi:[2], tail:'山間之四時也' },
      { k:'len', src:'春天像一篇巨製的駢儷文，而夏天像一首絕句。（簡媜〈夏之絕句〉）',
        rows:['春天像一篇巨製的駢儷文','而夏天像一首絕句'], hi:[1], tail:'' } ] },
    { no:'(四)', name:'變化句式', def:'將肯定句與否定句、直述句與疑問句，穿插寫入。', cls:'v80-mid', ex:[
      { k:'pn', src:'婚後生活不是磚，不是石，不是泥，不是沙，而是容忍，是體貼，是寬恕，是犧牲。',
        segs:['婚後生活',['n','不是磚'],'，',['n','不是石'],'，',['n','不是泥'],'，',['n','不是沙'],'，',['p','而是容忍'],'，',['p','是體貼'],'，',['p','是寬恕'],'，',['p','是犧牲'],'。'] },
      { k:'pn', src:'那榆蔭下的一潭，不是清泉，是天上虹。（徐志摩〈再別康橋〉）',
        segs:['那榆蔭下的一潭，',['n','不是清泉'],'，',['p','是天上虹'],'。'] } ] }
  ];
  var POEM = '潮隨暗浪雪山傾，遠浦漁舟釣月明。橋對寺門松徑小，檻當泉眼石波清。迢迢綠樹江天曉，靄靄紅霞晚日晴。遙望四邊雲接水，雪峰千點數鷗輕。';
  var HUI_EX = [
    { k:'swap', src:'弟子不必不如師，師不必賢於弟子。（韓愈〈師說〉）', r1:[['A','弟子'],['','不必不如'],['B','師'],['','，']], r2:[['B','師'],['','不必賢於'],['A','弟子'],['','。']] },
    { k:'swap', src:'開車不喝酒，喝酒不開車', r1:[['A','開車'],['','不'],['B','喝酒'],['','，']], r2:[['B','喝酒'],['','不'],['A','開車']] },
    { k:'swap', src:'讀書不忘救國，救國不忘讀書', r1:[['A','讀書'],['','不忘'],['B','救國'],['','，']], r2:[['B','救國'],['','不忘'],['A','讀書']] },
    { k:'swap', src:'文章是案頭之山水，山水是地上之文章', r1:[['A','文章'],['','是案頭之'],['B','山水'],['','，']], r2:[['B','山水'],['','是地上之'],['A','文章']] },
    { k:'poem', src:'蘇軾〈題金山寺迴文本〉', text:POEM, cls:'v80-sm' }
  ];

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  /* 出處：src 末尾「（作者〈篇名〉）」 */
  function by(src) { var m = src.match(/（([^（）]*〈[^〉]*〉)）$/); return m ? m[1] : ''; }
  function body(src) { return src.replace(/（[^（）]*〈[^〉]*〉）$/, ''); }
  /* 依序在句中找出各段，中間的標點另成 .pu；對不上就回傳 null（改用 v80 原版） */
  function cut(text, parts) {
    var out = [], at = 0;
    for (var i = 0; i < parts.length; i++) {
      var j = text.indexOf(parts[i], at); if (j < 0) return null;
      if (j > at) out.push(['pu', text.slice(at, j)]);
      out.push(['pc', parts[i], i]); at = j + parts[i].length;
    }
    if (at < text.length) out.push(['pu', text.slice(at)]);
    return out;
  }
  function chars(s, cls) { return Array.from(s).map(function (c) { return '<span class="' + cls + '">' + esc(c) + '</span>'; }).join(''); }

  var NSTEP = { syn:2, ro:3, len:2, pn:3, swap:3, poem:2 };
  function exHTML(e) {
    var h = '', b = by(e.src), txt = body(e.src), byInline = '';
    var byBlock = b ? '<div class="v88-byline"><span class="v88-by" style="margin-left:0">（' + esc(b) + '）</span></div>' : '';
    var srcRow = '';
    if (e.k === 'syn') {
      h = '<div class="v80-sy">' + e.toks.map(function (t) { return Array.isArray(t) ? '<span class="k kS">' + esc(t[0]) + '</span>' : esc(t); }).join('') + byInline + '</div>' +
        '<div class="v80-syn">' + e.toks.filter(Array.isArray).map(function (t) { return '<span class="chip">' + esc(t[0]) + '</span>'; }).join('') +
        '<span class="eq">＝</span><span class="res">' + esc(e.res) + '</span></div>';
    } else if (e.k === 'ro') {
      var sg = cut(txt, e.ck.map(function (c) { return c[1]; })); if (!sg) return null;
      h = '<div class="v80-ro v88-inl">' + sg.map(function (s) {
        if (s[0] === 'pu') return '<span class="pu">' + esc(s[1]) + '</span>';
        var n = e.ck[s[2]][0];
        return '<span class="ck pc g' + (n % 2 ? 1 : 2) + '" data-n="' + n + '">' + esc(s[1]) + '<i>' + n + '</i></span>';
      }).join('') + '</div>';
    } else if (e.k === 'len') {
      var parts = e.rows.concat(e.tail ? [e.tail] : []), sl = cut(txt, parts); if (!sl) return null;
      h = '<div class="v80-len v88-inl">' + sl.map(function (s) {
        if (s[0] === 'pu') return '<span class="pu">' + esc(s[1]) + '</span>';
        var i = s[2];
        if (i >= e.rows.length) return '<div class="ln tail">' + chars(s[1], 'tc') + '</div>';
        return '<div class="ln' + (e.hi.indexOf(i) >= 0 ? ' hi' : '') + '">' + chars(s[1], 'c') + '<span class="cnt">' + Array.from(s[1]).length + ' 字</span></div>';
      }).join('') + '</div>';
    } else if (e.k === 'pn') {
      h = '<div class="v80-pn">' + e.segs.map(function (s) {
        return Array.isArray(s) ? '<span class="seg ' + (s[0] === 'n' ? 'neg' : 'pos') + '">' + esc(s[1]) + '</span>' : esc(s); }).join('') + byInline + '</div>' +
        '<div class="v80-leg"><span class="ln">否定句</span><span class="lp">肯定句</span></div>';
    } else if (e.k === 'swap') {
      var row = function (r, c) { return '<div class="row ' + c + '">' + r.map(function (t) {
        return t[0] ? '<span class="k k' + t[0] + '" data-k="' + t[0] + '">' + esc(t[1]) + '</span>' : '<span class="' + (t[1].length > 1 ? 'mid' : 'pm') + '">' + esc(t[1]) + '</span>';
      }).join('') + '</div>'; };
      h = '<div class="v73-hw v88-inl">' + row(e.r1, 'r1') + row(e.r2, 'r2') + '</div>';
    } else if (e.k === 'poem') {
      srcRow = '<div class="v73-src">' + esc(e.src) + '</div>';
      var cs = Array.from(e.text.replace(/[，。]/g, ''));
      var lines = function (arr) { var out = []; for (var i = 0; i < arr.length; i += 7) out.push(arr.slice(i, i + 7).join('') + (i / 7 % 2 ? '。' : '，')); return out; };
      var fwd = lines(cs), rev = lines(cs.slice().reverse());
      var mark = function (L, first) { return L.map(function (l, i) {
        var s = esc(l);
        if (i === 0 && first) s = '<span class="ends">' + s.charAt(0) + '</span>' + s.slice(1);
        if (i === L.length - 1 && !first) s = s.slice(0, -2) + '<span class="ends">' + s.slice(-2, -1) + '</span>' + s.slice(-1);
        return s; }).join('<br>'); };
      h = '<div class="v80-poem"><div class="pc"><div class="h">順讀</div>' + mark(fwd, false) + '</div>' +
        '<div class="pc rev"><div class="h">由末字倒讀</div><div class="pc-t">' + mark(rev, true) + '</div></div></div>';
    }
    return srcRow + byBlock + '<div class="v73-stage">' + h + '<svg class="v73-svg"></svg></div>' +
      (e.note ? '<div class="v73-note">' + e.note.map(esc).join('<br>') + '</div>' : '');
  }
  function tabName(e, i) { return '例' + '一二三四五六'[i]; }
  function boxHTML(exs, cap, cls) {
    var parts = exs.map(exHTML);
    if (parts.some(function (p) { return p === null; })) return null;
    var tabs = exs.length > 1 ? '<div class="v73-tabs">' + exs.map(function (e, i) {
      return '<button class="v73-tab' + (i ? '' : ' on') + '" onclick="v88Show(this,' + i + ')">' + tabName(e, i) + '</button>'; }).join('') + '</div>' : '';
    return '<div class="v73a v88 ' + (cls || '') + '" data-ex="0" data-st="0"><div class="v80-top">' + tabs +
      '<div class="v73-ctrl"><button class="v73-btn" onclick="v88Step(this)">▶ 下一步</button>' +
      '<button class="v73-btn rst" onclick="v88Reset(this)">↻ 重來</button><span class="v73-tip"></span></div></div>' +
      exs.map(function (e, i) {
        return '<div class="v73-ex' + (i ? '' : ' cur') + ' ' + (e.cls || '') + '" data-k="' + e.k + '" data-n="' + NSTEP[e.k] + '">' + parts[i] + '</div>'; }).join('') +
      '<div class="v73-cap">' + esc(cap) + '</div></div>';
  }
  function slideHTML(s) {
    var sub, def, box;
    if (s.name === '錯綜') {
      var t = TYPES[s.ti]; if (!t) return null;
      sub = t.no + ' ' + t.name; def = t.def;
      box = boxHTML(t.ex, '錯綜' + t.no + t.name + '：' + t.def, t.cls);
    } else {
      sub = '動畫（' + HUI_EX.length + ' 例）'; def = '上下兩句，詞彙大多相同，而詞序恰好相反（或循環往復）。';
      box = boxHTML(HUI_EX, '回文：上下兩句，詞彙大多相同，而詞序恰好相反（或循環往復），形成往復迴環的趣味。', 'v80-mid');
    }
    if (box === null) return null;
    return '<div class="wk-slide wks-keyrhet v73-kr v73-anim-slide v80-rx v88-rx">' +
      '<div class="wks-kr-head"><span class="wks-kr-name">' + esc(s.name) + '</span><span class="wks-kr-sub">' + esc(sub) + '</span></div>' +
      '<div class="v80-tdef">' + esc(def) + '</div>' + box + '</div>';
  }
  var _v88render = wkRenderSlideHTML;
  wkRenderSlideHTML = function (slide) {
    if (slide && slide.type === 'v80rx') {
      try { var h = slideHTML(slide); if (h) return h; } catch (e) { console.warn('[v88] 錯綜／回文改版失敗，改用 v80', e); }
    }
    return _v88render.apply(this, arguments);
  };

  /* ── 動畫 ── */
  function rel(el, base) { var x = 0, y = 0, n = el; while (n && n !== base) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return { x:x, y:y, w:el.offsetWidth, h:el.offsetHeight }; }
  function drawPath(svg, d, color) {
    var p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    p.setAttribute('d', d); p.setAttribute('stroke', color); svg.appendChild(p);
    var L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L; void p.getBoundingClientRect(); p.classList.add('v73-draw');
  }
  /* FLIP：els 從舊位置飛到新位置（change() 負責改版面） */
  function fly(els, change, dur) {
    els = Array.prototype.slice.call(els);
    var first = els.map(function (c) { return c.getBoundingClientRect(); });
    change();
    els.forEach(function (c, i) {
      var a = first[i], b = c.getBoundingClientRect();
      c.style.transition = 'none'; c.style.transform = 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px)';
    });
    void document.body.offsetWidth;
    els.forEach(function (c, i) {
      c.style.transition = 'transform ' + (dur || .9) + 's cubic-bezier(.5,0,.3,1) ' + (i * Math.min(0.02, 0.3 / els.length)) + 's'; c.style.transform = '';
    });
  }
  function words(ex) { return Array.prototype.map.call(ex.querySelectorAll('.r1 .k'), function (k) { return '「' + k.textContent + '」'; }).join('與'); }
  var TIPS = {
    syn: function (ex, st) { return ['① 找出換用的字', '② 意思相同，都是「' + ex.querySelector('.res').textContent + '」'][st - 1]; },
    ro: function (ex, st) { return ['① 原句依序標上 ①②③④', '② 依意思兩兩配對：①③／②④', '③ 原句寫成 ①②③④，要照 ①③、②④ 解釋——這就是交錯語次'][st - 1]; },
    len: function (ex, st) { return ['① 把句子拆開，逐字排列', '② 字數不等，長短交錯'][st - 1]; },
    pn: function (ex, st) { return ['① 否定句', '② 肯定句', '③ 肯定句與否定句穿插寫入'][st - 1]; },
    swap: function (ex, st) { return ['① 拆成上下兩句，找出關鍵詞：' + words(ex), '② 下句把兩個詞的位置對調', '③ 位置互換、循環相對'][st - 1]; },
    poem: function (ex, st) { return ['① 順讀全詩', '② 從最後一字倒著讀，也成一首詩'][st - 1]; }
  };
  function apply(ex, st) {
    var k = ex.dataset.k, stage = ex.querySelector('.v73-stage'), svg = ex.querySelector('.v73-svg');
    ex.classList.add('s' + st);
    if (k === 'syn') {
      if (st === 1) ex.querySelectorAll('.kS').forEach(function (x, i) { setTimeout(function () { x.classList.add('lit'); }, i * 220); });
      if (st === 2) { ex.querySelector('.v80-syn').classList.add('show'); var n = ex.querySelector('.v73-note'); if (n) n.classList.add('show'); }
    } else if (k === 'ro') {
      var ro = ex.querySelector('.v80-ro');
      if (st === 1) { fly(ro.querySelectorAll('.ck'), function () { ro.classList.remove('v88-inl'); }); setTimeout(function () { ro.classList.add('num'); }, 500); }
      if (st === 2) {
        var cks = Array.prototype.slice.call(ro.querySelectorAll('.ck'));
        fly(cks, function () {
          var ord = [1, 3, 2, 4];
          ord.forEach(function (n, i) {
            var c = cks.filter(function (x) { return +x.dataset.n === n; })[0]; ro.appendChild(c);
            if (i === 1) { var sp = document.createElement('span'); sp.className = 'sep'; sp.textContent = '／'; ro.appendChild(sp); }
          });
        });
        ro.classList.add('grp');
      }
      if (st === 3) { var nt = ex.querySelector('.v73-note'); if (nt) nt.classList.add('show'); }
    } else if (k === 'len') {
      var ln = ex.querySelector('.v80-len');
      if (st === 1) fly(ln.querySelectorAll('.c, .tc'), function () { ln.classList.remove('v88-inl'); ln.classList.add('box'); }, .8);
      if (st === 2) ln.classList.add('cnt-on');
    } else if (k === 'pn') {
      var pn = ex.querySelector('.v80-pn');
      if (st === 1) pn.classList.add('s-neg');
      if (st === 2) pn.classList.add('s-pos');
    } else if (k === 'swap') {
      var hw = ex.querySelector('.v73-hw');
      if (st === 1) {
        fly(hw.querySelectorAll('.row > span'), function () { hw.classList.remove('v88-inl'); }, .8);
        setTimeout(function () { ex.querySelectorAll('.r1 .k').forEach(function (x) { x.classList.add('lit'); }); }, 700);
      }
      if (st === 2) ex.querySelectorAll('.r2 .k').forEach(function (t) {
        var src = ex.querySelector('.r1 .k[data-k="' + t.dataset.k + '"]'), a = src.getBoundingClientRect(), b = t.getBoundingClientRect();
        t.classList.add('lit'); t.style.transition = 'none'; t.style.transform = 'translate(' + (a.left - b.left) + 'px,' + (a.top - b.top) + 'px)';
        void t.offsetWidth; t.style.transition = 'transform 1s cubic-bezier(.5,0,.3,1), background .4s, color .4s'; t.style.transform = '';
      });
      if (st === 3) ['A', 'B'].forEach(function (key) {
        var p = rel(ex.querySelector('.r1 .k[data-k="' + key + '"]'), stage), q = rel(ex.querySelector('.r2 .k[data-k="' + key + '"]'), stage);
        drawPath(svg, 'M' + (p.x + p.w / 2) + ' ' + (p.y + p.h) + ' L' + (q.x + q.w / 2) + ' ' + q.y, key === 'A' ? '#1f5fa8' : '#c0392b');
      });
    } else if (k === 'poem') {
      if (st === 2) ex.querySelector('.v80-poem').classList.add('show');
    }
  }
  function syncBtn(box) {
    var exs = box.querySelectorAll('.v73-ex'), ei = +box.dataset.ex, st = +box.dataset.st, n = +exs[ei].dataset.n, btn = box.querySelector('.v73-btn:not(.rst)');
    btn.disabled = false;
    btn.textContent = st < n ? '▶ 下一步' : (ei + 1 < exs.length ? '▶ 下一例' : '▶ 總結');
    if (box.querySelector('.v73-cap.show')) { btn.disabled = true; btn.textContent = '✓ 完成'; }
  }
  var SRC = {};
  function resetEx(ex) {
    var id = ex.dataset.rid; if (!id) { id = ex.dataset.rid = 'r' + Math.random().toString(36).slice(2); }
    if (!SRC[id]) SRC[id] = ex.innerHTML; else ex.innerHTML = SRC[id];
    ex.className = ex.className.replace(/\bs\d\b/g, '').replace(/\s+/g, ' ').trim();
    if (!/\bcur\b/.test(ex.className)) ex.className += ' cur';
  }
  function show(box, i) {
    box.querySelectorAll('.v73-ex').forEach(function (e, j) { e.classList.toggle('cur', j === i); });
    box.querySelectorAll('.v73-tab').forEach(function (t, j) { t.classList.toggle('on', j === i); });
    resetEx(box.querySelectorAll('.v73-ex')[i]);
    box.dataset.ex = i; box.dataset.st = 0;
    box.querySelector('.v73-cap').classList.remove('show'); box.querySelector('.v73-tip').textContent = '';
    syncBtn(box);
  }
  window.v88Show = function (el, i) { if (window.event) window.event.stopPropagation(); show(el.closest('.v73a'), i); };
  window.v88Reset = function (btn) { if (window.event) window.event.stopPropagation(); show(btn.closest('.v73a'), +btn.closest('.v73a').dataset.ex); };
  window.v88Step = function (btn) {
    if (window.event) window.event.stopPropagation();
    var box = btn.closest('.v73a'), exs = box.querySelectorAll('.v73-ex'), ei = +box.dataset.ex, st = +box.dataset.st, ex = exs[ei], n = +ex.dataset.n;
    if (!ex.dataset.rid) resetEx(ex);
    if (st >= n) {
      if (ei + 1 < exs.length) { show(box, ei + 1); return; }
      box.querySelector('.v73-cap').classList.add('show'); box.querySelector('.v73-tip').textContent = ''; syncBtn(box); return;
    }
    st++; box.dataset.st = st; apply(ex, st);
    box.querySelector('.v73-tip').textContent = TIPS[ex.dataset.k](ex, st) || '';
    syncBtn(box);
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/086_v90-img-js.js ════ */
try {

/* v90：課文頁補充圖片。只在畫面上插入圖片元素，不動 TEXTBOOK 資料。
   圖片：data/115-1/高職/第一冊/<課>/img/補圖_*.jpg（由 scripts/v90_build.py 以 base64 嵌入 V90_IMG）。
   PLAN[課名][seg] = { banner:{i,c}, after:{ 句序li: [ {i,c,big} ] 或 {t:組名, items:[{i,c}]} } } */
(function () {
  window.APP_VERSION = 'V90';
  function setVer() { var d = document.getElementById('v88-ver'); if (d) d.textContent = window.APP_VERSION; }
  setVer(); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setVer);

  var IMG = (function () { var B = /整理版_v\d+\.html$/.test(decodeURIComponent(location.pathname)) ? '上傳/' : ''; var P = {"九芎": "img/火車線/九芎.jpg", "光復糖廠": "img/火車線/光復糖廠.jpg", "冬候鳥群": "img/火車線/冬候鳥群.jpg", "吉安壽豐車票": "img/火車線/吉安壽豐車票.jpg", "吉安稻田": "img/火車線/吉安稻田.jpg", "吉安車站": "img/火車線/吉安車站.jpg", "四色牌": "img/火車線/四色牌.jpg", "夜鷹": "img/火車線/夜鷹.jpg", "太陽麻": "img/火車線/太陽麻.jpg", "木瓜溪橋火車": "img/火車線/木瓜溪橋火車.jpg", "棕背伯勞": "img/火車線/棕背伯勞.jpg", "永保安康車票": "img/火車線/永保安康車票.jpg", "泛舟": "img/火車線/泛舟.jpg", "烏頭翁": "img/火車線/烏頭翁.jpg", "環頸雉": "img/火車線/環頸雉.jpg", "甘蔗田": "img/火車線/甘蔗田.jpg", "田菁": "img/火車線/田菁.jpg", "白頭錦鴝": "img/火車線/白頭錦鴝.jpg", "臺灣野兔": "img/火車線/臺灣野兔.jpg", "苦楝": "img/火車線/苦楝.jpg", "虎爪豆": "img/火車線/虎爪豆.jpg", "賞鯨": "img/火車線/賞鯨.jpg", "路線圖_花蓮壽豐": "img/火車線/路線圖_花蓮壽豐.jpg", "軋日機": "img/火車線/軋日機.jpg", "金針花海": "img/火車線/金針花海.jpg"}; for (var k in P) P[k] = B + P[k]; return P; })();
  var PLAN = {
    '臺灣最美麗的火車線': {
      /* V157：課文改成照課本一段一頁，鍵改成新段名、句序改成段內句序（舊：第1部分=一＋二段、第2部分=三＋四段、第6部分=八＋九段） */
      '第二段': {
        after: {
          1: { natural: true, items: [{ i: '軋日機', c: '軋日機' }, { i: '永保安康車票', c: '永康→保安 硬紙車票' }, { i: '四色牌', c: '四色牌' }] }
        }
      },
      '第三段': {
        after: {
          2: [{ i: '路線圖_花蓮壽豐', c: '花東線：花蓮—吉安—志學—平和—壽豐' }]
        }
      },
      '第四段': {
        after: {
          1: { natural: true, items: [{ i: '吉安壽豐車票', c: '吉安→壽豐（15 元）' }, { i: '永保安康車票', c: '永康→保安' }] }
        }
      },
      '第五段': {
        after: {
          0: [{ i: '吉安車站', c: '吉安車站' }],
          1: { banner: { i: '吉安稻田', c: '吉安的稻田', pos: 'center 52%' } }
        }
      },
      '第七段': {
        after: {
          0: { t: '一般遊客的花蓮', items: [{ i: '賞鯨', c: '賞鯨' }, { i: '光復糖廠', c: '光復糖廠' }, { i: '泛舟', c: '秀姑巒溪泛舟' }] },
          1: { t: '作者的花蓮', items: [{ i: '苦楝', c: '苦楝' }, { i: '九芎', c: '九芎' }] }
        }
      },
      '第八段': {
        after: {
          0: { contain: true, items: [{ i: '環頸雉', c: '環頸雉' }, { i: '白頭錦鴝', c: '白頭錦鴝' }, { i: '棕背伯勞', c: '棕背伯勞' }, { i: '夜鷹', c: '夜鷹' }, { i: '烏頭翁', c: '烏頭翁' }] },
          1: [{ i: '臺灣野兔', c: '臺灣野兔' }],
          2: [{ i: '冬候鳥群', c: '成群的冬候鳥', big: true }]
        }
      },
      '第六段': {
        banner: { i: '金針花海', c: '金針花海' },
        after: {
          1: [{ i: '甘蔗田', c: '甘蔗田' }],
          2: { t: '肥料植物', items: [{ i: '虎爪豆', c: '虎爪豆' }, { i: '太陽麻', c: '太陽麻' }, { i: '田菁', c: '田菁' }] },
          3: [{ i: '木瓜溪橋火車', c: '火車過木瓜溪', big: true }]
        }
      }
    }
  };

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function imgTag(it) { return '<img class="v90-zoom" src="' + IMG[it.i] + '" alt="' + esc(it.c) + '" data-cap="' + esc(it.c) + '">'; }
  function banner(it) {
    var b = document.createElement('div');
    b.className = 'v90-banner v90-zoom';
    b.style.backgroundImage = 'url(' + IMG[it.i] + ')';
    if (it.pos) b.style.backgroundPosition = it.pos;
    b.setAttribute('data-src', IMG[it.i]);
    b.setAttribute('data-cap', it.c);
    b.title = it.c;
    return b;
  }
  function build(spec) {
    var d = document.createElement('div');
    if (spec.banner) {
      d.className = 'v90-block';
      if (IMG[spec.banner.i]) d.appendChild(banner(spec.banner));
    } else if (Array.isArray(spec)) {
      d.className = 'v90-block';
      d.innerHTML = spec.filter(function (it) { return IMG[it.i]; }).map(function (it) {
        return '<div class="v90-fig' + (it.big ? ' v90-big' : '') + '">' + imgTag(it) + '<div class="v90-cap">' + esc(it.c) + '</div></div>';
      }).join('');
    } else {
      d.className = 'v90-block v90-group' + (spec.contain ? ' v90-contain' : '') + (spec.natural ? ' v90-natural' : '');
      d.innerHTML = (spec.t ? '<div class="v90-gtitle">' + esc(spec.t) + '</div>' : '') + '<div class="v90-grow">' +
        spec.items.filter(function (it) { return IMG[it.i]; }).map(function (it) {
          return '<figure>' + imgTag(it) + '<div class="v90-cap">' + esc(it.c) + '</div></figure>';
        }).join('') + '</div>';
    }
    return d;
  }
  function inject(area) {
    if (!area || typeof wkKey === 'undefined' || !PLAN[wkKey]) return;
    var s = wkSlides && wkSlides[wkIdx];
    if (!s || s.type !== 'textpage' || !s.page) return;
    var plan = PLAN[wkKey][s.page.seg];
    if (!plan) return;
    var body = area.querySelector('.wks-textpage .tp-body');
    if (!body || body.getAttribute('data-v90')) return;
    body.setAttribute('data-v90', s.page.seg);
    if (plan.banner && IMG[plan.banner.i]) body.insertBefore(banner(plan.banner), body.firstChild);
    Object.keys(plan.after || {}).forEach(function (li) {
      var line = body.querySelector('.tp-line[data-li="' + li + '"]');
      if (line) line.insertAdjacentElement('afterend', build(plan.after[li]));
    });
  }
  function run() { try { inject(document.getElementById('wk-slide-area')); inject(document.getElementById('wkfs-body')); } catch (e) {} }

  /* 點圖放大（燈箱掛在 body，z-index 高於全螢幕投影 9550） */
  function closeLb() { var lb = document.getElementById('v90-lb'); if (lb) lb.remove(); }
  document.addEventListener('click', function (e) {
    var z = e.target.closest && e.target.closest('.v90-zoom');
    if (!z) return;
    e.stopPropagation();
    closeLb();
    var lb = document.createElement('div');
    lb.id = 'v90-lb';
    var src = z.getAttribute('data-src') || z.getAttribute('src');
    lb.innerHTML = '<img src="' + src + '" alt=""><div>' + esc(z.getAttribute('data-cap') || '') + '</div>';
    lb.addEventListener('click', function (ev) { ev.stopPropagation(); closeLb(); });
    document.body.appendChild(lb);
  }, true);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && document.getElementById('v90-lb')) { e.stopPropagation(); closeLb(); }
  }, true);

  var _v90render = wkRenderCurrent;
  wkRenderCurrent = function () { closeLb(); var r = _v90render.apply(this, arguments); run(); setTimeout(run, 0); return r; };
  ['wk-slide-area', 'wkfs-body'].forEach(function (id) {
    var el = document.getElementById(id);
    if (el) new MutationObserver(function () { run(); }).observe(el, { childList: true, subtree: true });
  });
  run();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/088_v91-rhet-js.js ════ */
try {

/* v91：修辭呈現改版（說明見 v91-rhet-css）
   - 只加不刪：不改課文資料行、不改主程式函式本體；包一層 tpRecolor／tpLayerToggle，
     原函式照常執行後再做 v91 的處理（兩者定義在主程式，檔內無其他覆寫；本 addon 為目前實際生效的外層）。
   - 框線比對仍靠 tp-rq 引句資料，所以 B 只是把引句「藏起來」，資料不動。
   - 先只套用 V91_RHET_KEYS 內的課（老師：先做《師說》），確認後再加其他課。 */
(function () {
  window.APP_VERSION = 'V91';
  function setVer() { var d = document.getElementById('v88-ver'); if (d) d.textContent = window.APP_VERSION; }
  setVer(); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setVer);

  window.V91_RHET_KEYS = ['師說'];
  function enabled() {
    return typeof wkKey !== 'undefined' && window.V91_RHET_KEYS.indexOf(wkKey) >= 0;
  }

  /* ── 資料修正（執行期精確搬移，比照 v87；資料行不動）──
     《師說》第五段「轉品：不恥相師」原掛在 lines[1]，但引句在 lines[0]，因此從未框到 → 移到 lines[0] */
  (function fixShishuo() {
    try {
      if (typeof TEXTBOOK === 'undefined' || !TEXTBOOK['師說']) return;
      var P = (TEXTBOOK['師說'].textPages || [])[4];
      if (!P || !P.lines || P.lines.length < 2) { console.warn('v91: 師說第五段結構不符，略過'); return; }
      var from = P.lines[1].rhet || [], to = P.lines[0];
      var hit = [];
      from.forEach(function (r, i) { if (r[0] === '轉品' && /不恥相<b class='rq-hi'>師<\/b>/.test(r[1])) hit.push(i); });
      var already = (to.rhet || []).some(function (r) { return r[0] === '轉品' && /不恥相/.test(r[1]); });
      if (hit.length !== 1 || already || String(to.text || JSON.stringify(to)).indexOf('不恥相') < 0) {
        console.warn('v91: 不恥相師 搬移條件不符（hit=' + hit.length + '），略過'); return;
      }
      to.rhet = (to.rhet || []).concat([from[hit[0]]]);
      from.splice(hit[0], 1);
    } catch (e) { console.warn('v91: fixShishuo', e); }
  })();

  /* B：藏引句與其後的「──」 */
  function stripQuote(item) {
    if (item.getAttribute('data-v91')) return;
    item.setAttribute('data-v91', '1');
    var rq = item.querySelector(':scope > .tp-rq');
    if (!rq) return;
    rq.classList.add('v91-rq-hide');
    var n = rq.nextSibling;
    if (n && n.nodeType === 3 && n.nodeValue.indexOf('──') === 0) n.nodeValue = n.nodeValue.slice(2);
  }

  /* 標籤文字：修辭名稱；轉品另從說明取出詞性變化，如「轉品（名→動）」 */
  function labelText(item) {
    var b = item.querySelector(':scope > b');
    var name = b ? b.textContent.trim() : '';
    if (/^轉品$/.test(name)) {
      var m = item.textContent.match(/[（(]\s*([^（()）→]{1,2})\s*[）)][^→]*→\s*[（(]\s*([^（()）→]{1,2})\s*[）)]/);
      if (m) return name + '（' + m[1] + '→' + m[2] + '）';
    }
    return name;
  }

  function segsOf(text, id) {
    return Array.prototype.filter.call(text.querySelectorAll('.tp-seg[data-layers]'), function (s) {
      return s.getAttribute('data-layers').split(' ').indexOf(id) >= 0;
    });
  }

  /* 同頁相鄰行的「同一條修辭」（如第五段映襯掛在兩行）：記為雙胞胎，開關連動、下方框只列一次 */
  function markTwins(slide) {
    var seen = {};
    slide.querySelectorAll('.tp-line').forEach(function (line) {
      var items = line.querySelectorAll('.tp-box-r .tp-rhet[data-lid]');
      var twins = 0;
      items.forEach(function (it) {
        var key = it.textContent;
        if (seen[key]) { it.classList.add('v91-twin'); it.setAttribute('data-v91-of', seen[key]); twins++; }
        else seen[key] = it.getAttribute('data-lid');
      });
      line.classList.toggle('v91-twin-only', items.length > 0 && twins === items.length);
    });
  }
  function isTwinGroup(slide, id) {
    return !!slide.querySelector('.tp-rhet[data-v91-of="' + id + '"]') ||
           !!slide.querySelector('.tp-rhet.v91-twin[data-lid="' + id + '"]');
  }

  /* 藍色字義：同頁依出現順序深（v91-ga）淺（v91-gb）交錯；浮框可能已移到 body（_tpPopup），
     所以類別直接加在浮框元素上；連接線顏色由主程式讀浮框框線色，會自動跟著 */
  function glossAlt(slide) {
    var k = 0;
    slide.querySelectorAll('.tp-text .tp-g, .tp-text .tp-z:not(.tp-z-inline), .tp-text .tp-p.tp-p-blue').forEach(function (g) {
      var pop = g._tpPopup || g.querySelector(':scope > .tp-gd, :scope > .tp-zd, :scope > .tp-pd');
      if (!pop) return;
      var c = (k++ % 2) ? 'v91-gb' : 'v91-ga';
      [g, pop].forEach(function (e) {
        if (!e.classList.contains(c)) { e.classList.remove('v91-ga', 'v91-gb'); e.classList.add(c); }
      });
    });
  }

  function clearText(text) {
    text.querySelectorAll(':scope > .v91-lab, :scope > .v91-frame').forEach(function (e) { e.remove(); });
    text.classList.remove('v91-lab-on', 'v91-rel');
  }

  function syncSlide(slide) {
    var on = enabled();
    var order = window.tpLayerOrder || [];
    slide.querySelectorAll('.tp-seg.v91-wseg').forEach(function (s) { s.classList.remove('v91-wseg'); });
    slide.querySelectorAll('.tp-line').forEach(function (line) {
      var text = line.querySelector(':scope > .tp-text');
      if (text) clearText(text);
    });
    if (!on) return;
    glossAlt(slide);
    slide.querySelectorAll('.tp-box-r .tp-rhet').forEach(stripQuote);
    markTwins(slide);

    /* 整句型：引句沒有標重點字（錯綜、回文、設問…），或跨行的同一條修辭 */
    var whole = {};
    slide.querySelectorAll('.tp-box-r .tp-rhet[data-lid]').forEach(function (it) {
      var id = it.getAttribute('data-lid');
      var rq = it.querySelector(':scope > .tp-rq');
      if ((rq && !rq.querySelector('.rq-hi')) || isTwinGroup(slide, id)) whole[id] = 1;
    });

    /* 整句型勝出的片段不再各自畫框，改由外框統一畫 */
    slide.querySelectorAll('.tp-seg.tp-seg-rhet[data-layers]').forEach(function (s) {
      var ids = s.getAttribute('data-layers').split(' '), win = null, rank = -1;
      ids.forEach(function (id) { var k = order.indexOf(id); if (k > rank) { rank = k; win = id; } });
      if (win && whole[win]) s.classList.add('v91-wseg');
    });

    slide.querySelectorAll('.tp-line').forEach(function (line) {
      var text = line.querySelector(':scope > .tp-text');
      if (!text) return;
      var labs = [], frames = [], ents = [];
      line.querySelectorAll('.tp-box-r .tp-rhet[data-lid]').forEach(function (it) {
        var id = it.getAttribute('data-lid');
        if (order.indexOf(id) < 0) return;
        var segs = segsOf(text, id);
        if (segs.length) ents.push({ it: it, id: id, segs: segs });
      });
      if (!ents.length) return;
      /* 先把行高設好（有標籤才拉高），再量位置，否則外框會停在拉高前的位置 */
      text.classList.add('v91-rel');
      if (ents.some(function (e) { return !e.it.classList.contains('v91-twin'); })) text.classList.add('v91-lab-on');
      var base = text.getBoundingClientRect();
      ents.forEach(function (e) {
        var it = e.it, id = e.id, segs = e.segs;
        if (!it.classList.contains('v91-twin')) labs.push({ seg: segs[0], txt: labelText(it) });
        if (whole[id]) {
          /* 每一橫列取所有片段的聯集，畫一個外框 */
          var rows = {};
          segs.forEach(function (s) {
            Array.prototype.forEach.call(s.getClientRects(), function (r) {
              if (!r.width) return;
              var k = Math.round(r.top);
              var o = rows[k] || (rows[k] = { l: r.left, r: r.right, t: r.top, b: r.bottom });
              o.l = Math.min(o.l, r.left); o.r = Math.max(o.r, r.right);
              o.t = Math.min(o.t, r.top); o.b = Math.max(o.b, r.bottom);
            });
          });
          Object.keys(rows).forEach(function (k) { frames.push(rows[k]); });
        }
      });
      /* 外框：被其他外框包在裡面的較貼字，外層的往外多撐一些 */
      function inside(g, f) {
        return g !== f && Math.abs(g.t - f.t) < 4 && g.l >= f.l - 1 && g.r <= f.r + 1 && (g.r - g.l) < (f.r - f.l);
      }
      frames.forEach(function (f) {
        var depth = 0, outer = 0;
        frames.forEach(function (g) {
          if (inside(g, f)) depth++;
          if (inside(f, g)) outer++;
        });
        var pad = 3 + 4 * depth;
        var el = document.createElement('div');
        el.className = 'v91-frame' + (outer % 2 ? ' v91-light' : '');
        el.style.left = (f.l - base.left - pad) + 'px';
        el.style.top = (f.t - base.top - pad) + 'px';
        el.style.width = (f.r - f.l + pad * 2) + 'px';
        el.style.height = (f.b - f.t + pad * 2) + 'px';
        text.appendChild(el);
      });
      if (!labs.length) return;
      labs.forEach(function (l) {
        var r = l.seg.getClientRects()[0] || l.seg.getBoundingClientRect();
        var el = document.createElement('span');
        el.className = 'v91-lab';
        el.textContent = l.txt;
        el.style.top = (r.top - base.top - 9) + 'px';
        text.appendChild(el);
        l.el = el; l.x = r.left - base.left; l.row = Math.round(r.top); l.w = el.getBoundingClientRect().width;
      });
      /* 同一行的標籤不重疊：依序往右推；超出右緣則往左收 */
      labs.sort(function (a, b) { return a.row - b.row || a.x - b.x; });
      var prevRow = null, prevRight = -1e9;
      labs.forEach(function (l) {
        if (l.row !== prevRow) { prevRow = l.row; prevRight = -1e9; }
        var x = Math.max(l.x, prevRight + 6);
        if (x + l.w > base.width) x = Math.max(0, base.width - l.w);
        l.el.style.left = x + 'px';
        prevRight = x + l.w;
      });
    });
  }

  var pending = false;
  function schedule() {
    if (pending) return;
    pending = true;
    setTimeout(function () {
      pending = false;
      document.querySelectorAll('#wk-slide-area, #wkfs-body').forEach(function (area) {
        if (area.querySelector('.tp-line')) syncSlide(area);
        area.querySelectorAll('.tp-text').forEach(function (t) {
          if (!t.__v91ro && ro) { t.__v91ro = 1; ro.observe(t); }
        });
      });
    }, 30);
  }
  var ro = window.ResizeObserver ? new ResizeObserver(schedule) : null;

  if (typeof tpRecolor === 'function') {
    var _tpRecolor = tpRecolor;
    tpRecolor = function () { var r = _tpRecolor.apply(this, arguments); schedule(); return r; };
  }
  /* 雙胞胎連動：切換其中一條，同頁另一條跟著同步開／關 */
  if (typeof tpLayerToggle === 'function') {
    var _tpLayerToggle = tpLayerToggle, syncing = false;
    tpLayerToggle = function (id, btn) {
      var r = _tpLayerToggle.apply(this, arguments);
      if (syncing || !enabled() || !btn || !btn.closest) return r;
      var slide = btn.closest('#wk-slide-area, #wkfs-body');
      if (!slide) return r;
      var nowOn = (window.tpLayerOrder || []).indexOf(id) >= 0;
      var main = btn.getAttribute('data-v91-of') || id;
      var group = slide.querySelectorAll('.tp-rhet[data-lid="' + main + '"], .tp-rhet[data-v91-of="' + main + '"]');
      syncing = true;
      try {
        group.forEach(function (it) {
          var lid = it.getAttribute('data-lid');
          if (lid === id) return;
          var isOn = (window.tpLayerOrder || []).indexOf(lid) >= 0;
          if (isOn !== nowOn) _tpLayerToggle(lid, it);
        });
      } finally { syncing = false; }
      return r;
    };
  }

  function onlyOurs(list) {
    for (var i = 0; i < list.length; i++) {
      var n = list[i];
      if (!(n.nodeType === 1 && (n.classList.contains('v91-lab') || n.classList.contains('v91-frame')))) return false;
    }
    return true;
  }
  new MutationObserver(function (muts) {
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'childList' && onlyOurs(m.addedNodes) && onlyOurs(m.removedNodes)) continue;
      schedule();
      return;
    }
  }).observe(document.body, { childList: true, subtree: true });
  window.addEventListener('resize', schedule);
  schedule();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/090_v92-ver-js.js ════ */
try {

/* v92：版號；〈身為魚販〉套用 v91 修辭呈現；自學流程（引導／原文／提問穿插）。
   ・V91_RHET_KEYS 定義在 v91-rhet-js（本 addon 之前），只 push 不覆寫。
   ・包一層 wkParseSlides（目前第 4 層，實際生效的最外層）：魚販拿掉第 1、2 節獨立教案頁（2-7 移到課文後），
     並依移除位移 work_answers.targets 的 slideIdx。其他課不動。
   ・教案內容用原本的 wkRenderSlideHTML({type:'lesson'}) 產生，保留老師教案原文與格式。 */
(function () {
  window.APP_VERSION = 'V92';
  function setVer() { var d = document.getElementById('v88-ver'); if (d) d.textContent = window.APP_VERSION; }
  setVer(); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setVer);
  if (window.V91_RHET_KEYS && window.V91_RHET_KEYS.indexOf('身為魚販') < 0) window.V91_RHET_KEYS.push('身為魚販');

  var KEY = '身為魚販', PREFIX = 'v92f|' + KEY + '|';
  /* 流程表：段（0 起）→ before[行]＝該行之前的「讀之前」；after[行]＝該行之後的「想一想」
     L:教案頁號　Q:備課用書教學問題引導題號（1～15）　PA:老師 V50 頁層級提問（舊第 i 部分） */
  var FLOW = [
    { before: { 0: ['L1-2', 'L1-1', 'L1-3'] },
      after:  { 1: ['L1-4', 'Q1', 'Q2'], 3: ['Q3', 'Q4'], 6: ['Q5', 'Q6'] } },
    { before: {},
      after:  { 1: ['Q7'], 7: ['Q8'], 8: ['L1-7'] } },
    { before: { 0: ['L1-5'] },
      after:  { 2: ['Q9'], 4: ['Q10'], 11: ['Q11', 'L1-6'] } },
    { before: { 0: ['L2-1', 'L2-2'] },
      after:  { 1: ['Q12'], 7: ['Q13'] } },
    { before: { 0: ['PA4'] },
      after:  { 2: ['Q14', 'Q15'], 6: ['L2-3', 'L2-4', 'L2-5', 'L2-6'] } },
  ];
  var DROP = /^[12]-\d+$/, KEEP_AFTER = '2-7';

  function lsGet(k) { try { return localStorage.getItem(PREFIX + k) || ''; } catch (e) { return ''; } }
  function lsSet(k, v) { try { if (v) localStorage.setItem(PREFIX + k, v); else localStorage.removeItem(PREFIX + k); } catch (e) {} }
  function strip(h) { var d = document.createElement('div'); d.innerHTML = h; return d.textContent.trim(); }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  function ta(id) {
    return '<textarea class="v92-ta" data-v92="' + esc(id) + '" placeholder="寫下你的想法……">' + esc(lsGet(id)) + '</textarea>';
  }

  /* ── 投影片：拿掉獨立教案頁 ── */
  if (typeof wkParseSlides === 'function') {
    var _parse = wkParseSlides;
    wkParseSlides = function (key) {
      var slides = _parse.apply(this, arguments);
      if (key !== KEY) return slides;
      var keep = [], map = {}, bridge = null;
      slides.forEach(function (s, i) {
        if (s.type === 'lesson' && s.L && DROP.test(s.L.no)) {
          if (s.L.no === KEEP_AFTER) bridge = s;
          return;
        }
        map[i] = keep.length; keep.push(s);
      });
      if (bridge) {   // 「課文到這裡結束」接在最後一段課文之後
        var last = -1;
        keep.forEach(function (s, i) { if (s.type === 'textpage') last = i; });
        if (last >= 0) {
          keep.splice(last + 1, 0, bridge);
          Object.keys(map).forEach(function (k) { if (map[k] > last) map[k]++; });
        }
      }
      keep.forEach(function (s) {
        (s.targets || []).forEach(function (t) { if (typeof t.slideIdx === 'number' && t.slideIdx in map) t.slideIdx = map[t.slideIdx]; });
      });
      return keep;
    };
  }

  /* ── 題目區塊 ── */
  /* 自學版用語（老師 10/1「改掉」課堂用語）：只在流程顯示時替換，教案資料不動；原文不符就不換並 console.warn */
  var WORDING = {
    '1-2': { title: ['今天的閱讀任務', '閱讀任務'] },
    '1-6': { hint: ['請寫在課本空白處，不用另外抄。', '請寫在下面的表格裡。'] },
    '1-7': { title: ['下課前，口頭回答兩句', '讀到這裡，回答兩句'],
             lines0: ['今天我從課文中看見魚販工作的一個<b>具體細節</b>：＿＿＿＿', '我從課文中看見魚販工作的一個<b>具體細節</b>：＿＿＿＿'] },
    '2-1': { hint: ['翻出上節的註記，找出你寫的其中一個因素。', '回頭看你前面寫的答案，找出其中一個因素。'] },
    '2-4': { title: ['小組整理：作者的情感變化', '整理：作者的情感變化'],
             hint: ['如果組員理解不同，可以先把不同答案都寫下來，再回到文本討論哪一種更有根據。', '如果你有不同的理解，可以都寫下來，再回到課文找哪一種更有根據。'] },
  };
  function reword(L) {
    var w = WORDING[L.no];
    if (!w) return L;
    L = JSON.parse(JSON.stringify(L));
    Object.keys(w).forEach(function (k) {
      var from = w[k][0], to = w[k][1];
      if (k === 'lines0') { if (L.lines && L.lines[0] === from) L.lines[0] = to; else console.warn('v92 wording 不符', L.no, k); }
      else if (L[k] === from) L[k] = to; else console.warn('v92 wording 不符', L.no, k);
    });
    return L;
  }
  function lessonItem(no) {
    var L = (TEXTBOOK[KEY].lesson || []).filter(function (x) { return x.no === no; })[0];
    if (!L) return '';
    L = reword(L);
    var tmp = document.createElement('div');
    tmp.innerHTML = wkRenderSlideHTML({ type: 'lesson', L: L });
    var body = tmp.querySelector('.ls-body');
    if (!body) return '';
    var teach = body.querySelector('.ls-teach');
    // 作答：子題逐一給格；表格空格直接可填／只有提示列則加三列
    var subs = L.points || L.ask || L.task || L.lines || null;
    var tbl = body.querySelector('table.ls-tbl');
    if (tbl && L.cols) {
      var rows = L.rows || [];
      var empty = rows.every(function (r) { return r.slice(1).every(function (c) { return !c; }); });
      if (empty) {
        tbl.querySelectorAll('tr').forEach(function (tr, ri) {
          if (!ri) return;
          tr.querySelectorAll('td').forEach(function (td, ci) { td.className = 'v92-cell'; td.innerHTML = ta(no + '|r' + ri + 'c' + ci); });
        });
      } else {
        for (var r = 1; r <= 3; r++) {
          var tr = document.createElement('tr');
          L.cols.forEach(function (c, ci) { var td = document.createElement('td'); td.className = 'v92-cell'; td.innerHTML = ta(no + '|a' + r + 'c' + ci); tr.appendChild(td); });
          tbl.appendChild(tr);
        }
      }
    } else if (L.kind !== 'key3' && L.kind !== 'board') {
      var box = document.createElement('div');
      var qs = subs && subs.length ? subs : [''];
      box.innerHTML = qs.map(function (q, i) {
        return (qs.length > 1 ? '<div class="v92-sq">' + (i + 1) + '. ' + esc(strip(q)) + '</div>' : '') + ta(no + '|' + i);
      }).join('');
      if (teach) body.insertBefore(box, teach); else body.appendChild(box);
    }
    var tb = teach ? '<button class="v92-tbtn" onclick="v92Teach(this)" title="教師引導">師</button>' : '';
    return '<div class="v92-it">' + tb + body.innerHTML + '</div>';
  }
  function qaItem(n) {
    var tp = TEXTBOOK[KEY].textPages, k = n;
    for (var s = 0; s < tp.length; s++) {
      var qa = tp[s].qa || [];
      if (k <= qa.length) {
        var q = qa[k - 1];
        return '<div class="v92-it"><div class="v92-q"><span class="v92-qn">' + n + '</span>' + q[0] + '</div>' + ta('Q' + n) +
          '<div class="tp-abox" onclick="this.classList.toggle(\'show\')"><div class="tp-acov">寫完後，點此看參考答案</div>' +
          '<div class="tp-a"><span class="tp-ak">答</span><div class="tp-atext">' + q[1] + '</div></div></div></div>';
      }
      k -= qa.length;
    }
    return '';
  }
  function pageAsk(i) {
    var P = (TEXTBOOK[KEY].textPages || [])[i];
    if (!P || !P.ask || !P.ask.length) return '';
    var t = P.askT ? '<button class="v92-tbtn" onclick="v92Teach(this)" title="教師引導">師</button>' : '';
    return '<div class="v92-it">' + t + '<ul class="ls-ask">' + P.ask.map(function (q) { return '<li>' + q + '</li>'; }).join('') + '</ul>' +
      P.ask.map(function (q, j) { return ta('PA' + i + '|' + j); }).join('') +
      (P.askT ? '<div class="ls-teach"><div class="ls-th">教師引導</div>' + P.askT + '</div>' : '') + '</div>';
  }
  window.v92Teach = function (btn) {
    var t = btn.parentNode.querySelector('.ls-teach'); if (!t) return;
    t.classList.toggle('show'); btn.classList.toggle('on');
  };
  function block(items, pre) {
    var html = items.map(function (x) {
      if (x[0] === 'L') return lessonItem(x.slice(1));
      if (x[0] === 'Q') return qaItem(+x.slice(1));
      if (x.slice(0, 2) === 'PA') return pageAsk(+x.slice(2));
      return '';
    }).join('');
    if (!html) return null;
    var d = document.createElement('div');
    d.className = 'v92-blk' + (pre ? ' v92-pre' : '');
    d.innerHTML = '<span class="v92-tag">' + (pre ? '讀之前' : '想一想') + '</span><span class="v92-save">作答自動存在這台裝置</span>' + html;
    return d;
  }

  /* 頁層級提問 PA4 是舊第 5 部分的 ask；v92 資料已隨內容搬到新第五段 → 取新段 4 的 ask */
  function enhance(area) {
    var slide = area.querySelector('.wks-textpage');
    if (!slide || slide.getAttribute('data-v92f')) return;
    var cur = wkSlides[wkIdx];
    if (!cur || cur.type !== 'textpage' || cur.bookKey !== KEY) return;
    var si = (TEXTBOOK[KEY].textPages || []).indexOf(cur.page);
    var F = FLOW[si];
    if (!F) return;
    slide.setAttribute('data-v92f', '1');
    slide.classList.add('v92-flow');
    Object.keys(F.before).forEach(function (li) {
      var line = slide.querySelector('.tp-body > .tp-line[data-li="' + li + '"]');
      var b = line && block(F.before[li], true);
      if (b) line.parentNode.insertBefore(b, line);
    });
    Object.keys(F.after).forEach(function (li) {
      var line = slide.querySelector('.tp-body > .tp-line[data-li="' + li + '"]');
      var b = line && block(F.after[li], false);
      if (b) line.parentNode.insertBefore(b, line.nextSibling);
    });
  }

  var tmr = {};
  document.addEventListener('input', function (e) {
    var t = e.target;
    if (!t || !t.classList || !t.classList.contains('v92-ta')) return;
    var id = t.getAttribute('data-v92');
    document.querySelectorAll('.v92-ta').forEach(function (o) { if (o !== t && o.getAttribute('data-v92') === id) o.value = t.value; });
    clearTimeout(tmr[id]);
    tmr[id] = setTimeout(function () { lsSet(id, t.value); }, 400);
  });

  function scan() {
    if (typeof wkKey === 'undefined' || wkKey !== KEY) return;
    document.querySelectorAll('#wk-slide-area, #wkfs-body').forEach(enhance);
  }
  var p = false;
  new MutationObserver(function () { if (p) return; p = true; setTimeout(function () { p = false; scan(); }, 30); })
    .observe(document.body, { childList: true, subtree: true });
  scan();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/091_v93-imgpath-js.js ════ */
try {

/* v93：版號；圖片改為外部檔（img/…，部署時與 index.html 同層）。
   從根目錄工作檔（…整理版_vNN.html）開啟時，圖片實際在 上傳/img/ → 把 <img src="img/…"> 補上前綴。
   v90 補充圖片的 IMG 路徑已在其定義處依同一規則補前綴（見 v93_build.py）。部署版（上傳/index.html、GitHub）不做任何改寫。 */
(function () {
  window.APP_VERSION = 'V93';
  function setVer() { var d = document.getElementById('v88-ver'); if (d) d.textContent = window.APP_VERSION; }
  setVer(); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setVer);

  var ROOTFILE = /整理版_v\d+\.html$/.test(decodeURIComponent(location.pathname));
  if (!ROOTFILE) return;
  function fix(root) {
    (root.querySelectorAll ? root.querySelectorAll('img[src^="img/"]') : []).forEach(function (im) {
      im.setAttribute('src', '上傳/' + im.getAttribute('src'));
    });
  }
  new MutationObserver(function (ms) {
    ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) { if (n.matches && n.matches('img[src^="img/"]')) fix(n.parentNode); else fix(n); } }); });
  }).observe(document.documentElement, { childList: true, subtree: true });
  fix(document);
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/095_v95-credit-js.js ════ */
try {

/* v95：版號；在指定圖片下方（橫幅則右下角）加作者／授權小字。以檔名比對，不改 v90 addon。 */
(function () {
  window.APP_VERSION = 'V95';
  function setVer() { var d = document.getElementById('v88-ver'); if (d) d.textContent = window.APP_VERSION; }
  setVer(); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setVer);

  var CREDIT = {
    '金針花海.jpg': '攝影：rita2253419／CC BY-SA 4.0／Wikimedia Commons',
    '吉安稻田.jpg': '攝影：Fred Hsu／CC BY-SA 3.0／Wikimedia Commons',
    '木瓜溪橋火車.jpg': '攝影：Irvin Chen／CC BY 2.0／Wikimedia Commons',
    '苦楝.jpg': '攝影：Foxy Who／CC BY-SA 3.0／Wikimedia Commons'
  };
  function nameOf(u) { try { u = decodeURIComponent(u || ''); } catch (e) {} return u.split('/').pop().replace(/["')]+$/, ''); }
  function tag(t) { var d = document.createElement('div'); d.className = 'v95-credit'; d.textContent = t; return d; }
  function scan() {
    document.querySelectorAll('.v90-banner:not([data-v95])').forEach(function (b) {
      b.setAttribute('data-v95', '1');
      var t = CREDIT[nameOf(b.getAttribute('data-src') || b.style.backgroundImage)];
      if (t) b.appendChild(tag(t));
    });
    document.querySelectorAll('img.v90-zoom:not([data-v95])').forEach(function (im) {
      im.setAttribute('data-v95', '1');
      var t = CREDIT[nameOf(im.getAttribute('src'))];
      if (!t) return;
      var cap = im.parentNode.querySelector('.v90-cap');
      if (cap) cap.parentNode.insertBefore(tag(t), cap.nextSibling); else im.parentNode.insertBefore(tag(t), im.nextSibling);
    });
  }
  var p = false;
  new MutationObserver(function () { if (p) return; p = true; setTimeout(function () { p = false; scan(); }, 40); })
    .observe(document.body, { childList: true, subtree: true });
  scan();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/096_v96-imgrev-js.js ════ */
try {

/* v96：圖片快取破除（老師 10/1：換成高解析後自己電腦仍顯示舊的糊圖 → 瀏覽器快取了同檔名的舊圖）。
   同檔名替換過的圖片，在網址後加 ?v=版本，瀏覽器視為新檔重新下載；沒換過的圖照常使用快取。
   以後替換圖片時，在 REV 加一筆（檔名：版本）即可。只改元素上的網址，不改 v90／v93 addon。 */
(function () {
  window.APP_VERSION = 'V96';
  function setVer() { var d = document.getElementById('v88-ver'); if (d) d.textContent = window.APP_VERSION; }
  setVer(); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setVer);

  var REV = {
    '火車線/金針花海.jpg': 95, '火車線/吉安稻田.jpg': 95, '火車線/木瓜溪橋火車.jpg': 95, '火車線/苦楝.jpg': 95,
    '火車線/九芎.jpg': 95, '火車線/冬候鳥群.jpg': 95, '火車線/路線圖_花蓮壽豐.jpg': 95
  };
  window.V96_IMG_REV = REV;
  function bust(u) {
    if (!u || u.indexOf('?') >= 0) return u;
    var dec; try { dec = decodeURIComponent(u); } catch (e) { dec = u; }
    for (var k in REV) if (dec.slice(-k.length - 1) === '/' + k) return u + '?v=' + REV[k];
    return u;
  }
  function fixEl(el) {
    if (el.tagName === 'IMG') {
      var s = el.getAttribute('src'), s2 = bust(s);
      if (s2 !== s) el.setAttribute('src', s2);
    }
    var ds = el.getAttribute && el.getAttribute('data-src');
    if (ds) { var d2 = bust(ds); if (d2 !== ds) el.setAttribute('data-src', d2); }
    var bg = el.style && el.style.backgroundImage;
    if (bg && bg.indexOf('img/') >= 0 && bg.indexOf('?') < 0) {
      var m = bg.match(/url\(["']?([^"')]+)["']?\)/);
      if (m) { var b2 = bust(m[1]); if (b2 !== m[1]) el.style.backgroundImage = 'url("' + b2 + '")'; }
    }
  }
  function scan(root) {
    if (root.nodeType !== 1) return;
    fixEl(root);
    root.querySelectorAll('img[src*="img/"], [data-src*="img/"], [style*="img/"]').forEach(fixEl);
  }
  new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      if (m.type === 'attributes') fixEl(m.target);
      else m.addedNodes.forEach(scan);
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src', 'style', 'data-src'] });
  scan(document.documentElement);
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/115_v104-keepscroll-js.js ════ */
try {

/* v104：日曆點題目／按鈕時不要跳回頂部（老師 10/1）。
   原因：v98 每次點擊都整個重畫 .v98-box，右側面板與題目格的捲動位置被重設。
   做法：記住各捲動區的位置，重畫後（MutationObserver，畫面更新前）放回；換日期時編輯區才回頂部。 */
(function () {
  var SEL = ['.v98-ed', '.v102-qgrid', '.v98-up', '.v98-main', '.v98-grid'];
  var pos = {}, lastDate = null;
  function selDate() { var c = document.querySelector('#v98-cal .v98-d.sel'); return c ? c.getAttribute('data-v98') : ''; }
  function hook() {
    var m = document.getElementById('v98-cal'); if (!m || m.__v104) return; m.__v104 = 1;
    m.addEventListener('scroll', function (e) {
      var t = e.target; if (!t || !t.matches) return;
      SEL.forEach(function (s) { if (t.matches('#v98-cal ' + s)) pos[s] = t.scrollTop; });
    }, true);
    new MutationObserver(function () {
      var d = selDate();
      if (d !== lastDate) { lastDate = d; pos['.v98-ed'] = 0; pos['.v102-qgrid'] = 0; return; }
      SEL.forEach(function (s) { var el = m.querySelector(s); if (el && pos[s] && el.scrollTop !== pos[s]) el.scrollTop = pos[s]; });
    }).observe(m, { childList: true, subtree: true });
  }
  if (window.V98CAL) { var _o = V98CAL.open; V98CAL.open = function () { var r = _o.apply(this, arguments); hook(); return r; }; }
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/140_textmark-js.js ════ */
try {
/* V115 課文修辭／句意新標示（老師 10/6 試作定案，先只用於〈論語選〉；其他課照舊）
   - 修辭：拿掉「修辭」按鈕；每個修辭在第一個字正上方一個〔修〕框，點開說明以浮動框顯示在上方（課文不動）。
     三種標法：句子型（倒裝、省略、回文、激問…）＝括號式底線，巢狀時外層較低；
              跨句單詞型（頂真、映襯）＝關鍵詞底色；單字單詞型（轉品、借代）＝圈字。
     未點開：淡色細線標出範圍；點開：課文字變色（胭脂／緋紅）並加粗（描邊，不改字寬）。
   - 句意：拿掉「句意」按鈕；範圍以淡綠括號（佔位、左右對稱）標出，〔句意〕框在第一個字正下方，點開說明浮在下方、切齊第一個字，課文變綠加粗。
   - 翻譯、注釋（右欄）、字義（藍字，點開上方泡泡）、課本注音：照舊（字義改成只用顏色、注釋虛線變淡）。
   - 範圍直接讀既有渲染結果：.tp-seg[data-layers] 的 r_／m_ 開頭編號＝修辭／句意定位（含跨行），說明讀 .tp-box-r / .tp-box-m。
   - 一般畫面（#wk-slide-area）與全螢幕（#wkfs-body）各自處理；字級／視窗改變時重新排版。 */
(function () {
  'use strict';
  var ENABLED = ['論語選—子路曾皙冉有公西華侍坐', '珍珠奶茶', '臺灣最美麗的火車線'];  /* V128 加〈珍珠奶茶〉；V136 加〈火車線〉 */
  var B_TYPES = ['頂真', '映襯'];                 /* 跨句單詞型 */
  var C_TYPES = ['轉品', '借代'];                 /* 單字單詞型 */
  var GENERIC = ['回文', '頂真'];                 /* 說明只是基本概念 → 只顯示名稱 */
  var SKIP = 'sup,.tp-gd,.tp-pd,.tp-zd,.tp-ruby,.tm-par,.tm-layer,[aria-hidden="true"]';
  var OPEN = {};                                  /* 開關狀態：課名|頁|id */

  function on() { return typeof wkKey !== 'undefined' && ENABLED.indexOf(wkKey) >= 0; }
  function sk(id) { return wkKey + '|' + wkIdx + '|' + id; }
  function isOpen(id) { return !!OPEN[sk(id)]; }

  /* ── 字元模型：.tp-text 內可見文字（不含圈號、注音、浮窗內容） ── */
  function chars(root) {
    var out = [];
    root.querySelectorAll('.tp-text').forEach(function (t) {
      var w = document.createTreeWalker(t, NodeFilter.SHOW_TEXT), n;
      while ((n = w.nextNode())) {
        if (n.parentElement.closest(SKIP)) continue;
        for (var k = 0; k < n.length; k++) out.push({ n: n, k: k, ch: n.data.charAt(k) });
      }
    });
    return out;
  }
  function rectOf(c) { var r = document.createRange(); r.setStart(c.n, c.k); r.setEnd(c.n, c.k + 1); return r.getBoundingClientRect(); }
  function idsOf(seg) { return (seg.getAttribute('data-layers') || '').split(' ').filter(Boolean); }
  function charsById(slide, cs, id) {
    var segs = [].filter.call(slide.querySelectorAll('.tp-seg[data-layers]'), function (s) { return idsOf(s).indexOf(id) >= 0; });
    return cs.filter(function (c) { return segs.some(function (s) { return s.contains(c.n); }); });
  }
  function plain(html) { var d = document.createElement('div'); d.innerHTML = html; return d.textContent; }

  /* ── 讀說明 ── */
  function readRhet(div) {
    var c = div.cloneNode(true);
    c.querySelectorAll('.tp-rt,.tp-more').forEach(function (x) { x.remove(); });
    var b = c.querySelector('b'), name = b ? b.textContent.trim() : '';
    var hi = [].map.call(c.querySelectorAll('.rq-hi'), function (x) { return x.textContent; });
    if (b) b.remove();
    var html = c.innerHTML, cut = html.indexOf('──');
    var exp = cut >= 0 ? html.slice(cut + 2) : '';
    exp = exp.replace(/▸[^<]*$/, '').trim();
    var type = B_TYPES.indexOf(name) >= 0 ? 'B' : (C_TYPES.indexOf(name) >= 0 ? 'C' : 'A');
    return { id: div.getAttribute('data-lid'), name: name, exp: exp, hi: hi, type: type };
  }
  function readMean(div) {
    var c = div.cloneNode(true);
    c.querySelectorAll('.tp-mk,.tp-citetxt').forEach(function (x) { x.remove(); });
    var html = c.innerHTML.replace(/^──/, '').trim();
    return { id: div.getAttribute('data-lid'), exp: html };
  }
  /* 跨句單詞／單字型的關鍵字：資料有 rq-hi 就用；否則從說明裡『』「」引號中，找出現在範圍內的詞 */
  function keywords(it, text) {
    if (it.hi.length) return it.hi;
    var out = [], re = /[『「]([^』」（(]{1,6})[（(』」]/g, m, src = plain(it.exp);
    while ((m = re.exec(src))) if (text.indexOf(m[1]) >= 0 && out.indexOf(m[1]) < 0) out.push(m[1]);
    return out.length ? out : [text];
  }

  /* ── 包字：把一串字元（可能跨多個文字節點）各段包進 span ── */
  function wrapRun(run, mk) {
    var groups = [];
    run.forEach(function (c) { var g = groups[groups.length - 1]; if (g && g.n === c.n && g.e === c.k) g.e++; else groups.push({ n: c.n, s: c.k, e: c.k + 1 }); });
    for (var i = groups.length - 1; i >= 0; i--) {
      var g = groups[i], r = document.createRange(); r.setStart(g.n, g.s); r.setEnd(g.n, g.e);
      var sp = mk(); r.surroundContents(sp);
    }
  }
  /* 插入點往外提（不把別的標記切成兩半） */
  function hoistBefore(c, stop) {
    if (c.k > 0) return { n: c.n, k: c.k };
    var el = c.n;
    while (el.parentNode && el.parentNode !== stop && !el.previousSibling && !el.parentNode.classList.contains('tp-text')) el = el.parentNode;
    return { el: el, before: true };
  }
  function hoistAfter(c) {
    if (c.k < c.n.length - 1) return { n: c.n, k: c.k + 1 };
    var el = c.n;
    for (;;) {
      var nx = el.nextSibling;
      while (nx && nx.nodeType === 1 && nx.tagName === 'SUP') { el = nx; nx = el.nextSibling; }
      if (!nx && el.parentNode && !el.parentNode.classList.contains('tp-text')) { el = el.parentNode; continue; }
      break;
    }
    return { el: el, before: false };
  }
  function insertAt(pt, node) {
    var r = document.createRange();
    if (pt.el) { if (pt.before) r.setStartBefore(pt.el); else r.setStartAfter(pt.el); } else r.setStart(pt.n, pt.k);
    r.collapse(true); r.insertNode(node);
  }

  /* 短版：資料欄位 rhetShort（與 rhet 同順序；編號 r{句}_{序} 的序號不含「開門見山／筆法」類）、meanShort、mean2Short */
  function attachShort(rh, mn) {
    var pg = (typeof wkSlides !== 'undefined' && wkSlides[wkIdx] && wkSlides[wkIdx].page) || null; if (!pg) return;
    var isStyle = function (r) { return /開門見山/.test(String(r[0] || '')) || /文章筆法|寫作手法/.test(String(r[0] || '')); };
    rh.forEach(function (it) {
      var m = /^r(\d+)_(\d+)$/.exec(it.id || ''); if (!m) return;
      var L = (pg.lines || [])[+m[1]]; if (!L || !L.rhetShort) return;
      var k = -1, n = -1; (L.rhet || []).forEach(function (r, i) { if (!isStyle(r)) { n++; if (n === +m[2]) k = i; } });
      if (k >= 0 && L.rhetShort[k]) it.short = L.rhetShort[k];
    });
    mn.forEach(function (it) {
      var m = /^m(\d+)_(\d+)$/.exec(it.id || ''); if (!m) return;
      var L = (pg.lines || [])[+m[1]]; if (!L) return;
      var v = m[2] === '0' ? L.meanShort : L.mean2Short; if (v) it.short = v;
    });
  }

  /* ── 準備：每次換頁（新 DOM）做一次 ── */
  function prepare(slide) {
    if (slide.__tm) return slide.__tm;
    slide.classList.add('tm-on');
    var rh = [].map.call(slide.querySelectorAll('.tp-box-r .tp-rhet[data-lid]'), readRhet);
    var mn = [].map.call(slide.querySelectorAll('.tp-box-m .tp-mean[data-lid]'), readMean);
    var cs = chars(slide);
    rh.forEach(function (it) {
      var rc = charsById(slide, cs, it.id); it.ok = rc.length > 0;
      if (!it.ok || it.type === 'A') return;
      var text = rc.map(function (c) { return c.ch; }).join('');
      keywords(it, text).forEach(function (kw) {
        var from = 0, p;
        while ((p = text.indexOf(kw, from)) >= 0) {
          wrapRun(rc.slice(p, p + kw.length), function () { var s = document.createElement('span'); s.className = 'tm-kw tm-' + it.type.toLowerCase(); s.setAttribute('data-r', it.id); return s; });
          from = p + kw.length;
          rc = charsById(slide, chars(slide), it.id);   /* V126：包過一段後文字節點已被切開，要重新取字元位置（同一修辭有兩個以上關鍵詞時原本會出錯） */
        }
      });
      cs = chars(slide);
    });
    mn.forEach(function (it) {
      var mc = charsById(slide, cs, it.id); it.ok = mc.length > 0; if (!it.ok) return;
      var l = document.createElement('span'); l.className = 'tm-par tm-pl'; l.setAttribute('data-m', it.id); l.textContent = '(';
      var r = document.createElement('span'); r.className = 'tm-par tm-pr'; r.setAttribute('data-m', it.id); r.textContent = ')';
      insertAt(hoistAfter(mc[mc.length - 1]), r);
      insertAt(hoistBefore(mc[0]), l);
      cs = chars(slide);
    });
    attachShort(rh, mn);
    slide.__tm = { rh: rh, mn: mn };
    return slide.__tm;
  }

  /* ── 排版：狀態上色＋〔修〕〔句意〕框＋括號線＋浮動說明框 ── */
  function layout(container) {
    var slide = container && container.querySelector('.wk-slide');
    if (!slide) return;
    var old = slide.querySelector(':scope > .tm-layer'); if (old) old.remove();
    if (!on() || !slide.querySelector('.tp-line')) { slide.classList.remove('tm-on'); return; }
    var st = prepare(slide);
    if (window.__tmRO && !slide.__tmObs) { slide.__tmObs = 1; window.__tmRO.observe(slide); var t0 = slide.querySelector('.tp-text'); if (t0) window.__tmRO.observe(t0); }
    var cs = chars(slide);
    if (getComputedStyle(slide).position === 'static') slide.style.position = 'relative';
    var base = slide.getBoundingClientRect();
    var layer = document.createElement('div'); layer.className = 'tm-layer'; slide.appendChild(layer);
    var W = slide.clientWidth; layer.style.width = W + 'px';   /* 疊加層要與課文頁同寬，說明框才排得開 */
    var txt0 = slide.querySelector('.tp-text'), fsz = parseFloat(getComputedStyle(txt0).fontSize);
    var sx = slide.scrollLeft - slide.clientLeft, sy = slide.scrollTop - slide.clientTop;
    /* 說明框的左右邊界＝課文文字區（不是整個課文頁），避免伸進右側按鈕底下 */
    var TL = Infinity, TR = 0;
    var kx0 = slide.offsetWidth ? base.width / slide.offsetWidth : 1;
    slide.querySelectorAll('.tp-text').forEach(function (t) { var r = t.getBoundingClientRect(); TL = Math.min(TL, (r.left - base.left) / kx0 + sx); TR = Math.max(TR, (r.right - base.left) / kx0 + sx); });
    /* 課文頁本身會捲動：座標要加上已捲動的距離（疊加層跟著內容一起捲） */
    /* 換頁淡入動畫會縮放課文頁（scale 0.99）：把縮放比例算回去，動畫中量也準 */
    var kx = slide.offsetWidth ? base.width / slide.offsetWidth : 1, ky = slide.offsetHeight ? base.height / slide.offsetHeight : 1;
    var rel = function (r) { return { l: (r.left - base.left) / kx + sx, r: (r.right - base.left) / kx + sx, t: (r.top - base.top) / ky + sy, b: (r.bottom - base.top) / ky + sy }; };

    /* 狀態上色 */
    var openR = st.rh.filter(function (it) { return it.ok && isOpen(it.id); });
    var openM = st.mn.filter(function (it) { return it.ok && isOpen(it.id); });
    slide.querySelectorAll('.tp-seg[data-layers]').forEach(function (s) {
      var ids = idsOf(s);
      var r = openR.filter(function (it) { return it.type === 'A' && ids.indexOf(it.id) >= 0; })[0];
      var m = openM.filter(function (it) { return ids.indexOf(it.id) >= 0; })[0];
      s.classList.toggle('tm-r-on', !!r); s.classList.toggle('tm-m-on', !r && !!m);
      if (r) s.style.setProperty('--tmc', r.col || 'var(--tm-r1)');
    });
    slide.querySelectorAll('.tm-kw').forEach(function (k) { k.classList.toggle('on', isOpen(k.getAttribute('data-r'))); });
    slide.querySelectorAll('.tm-par').forEach(function (p) { p.classList.toggle('on', isOpen(p.getAttribute('data-m'))); });

    /* 句子型：巢狀層級（外層較低）與顏色 */
    var A = st.rh.filter(function (it) { return it.ok && it.type === 'A'; });
    A.forEach(function (it) { it.cs = charsById(slide, cs, it.id); });
    A.forEach(function (it) {
      var inner = A.filter(function (o) { return o !== it && o.cs.length < it.cs.length && o.cs.every(function (c) { return it.cs.indexOf(c) >= 0; }); });
      it.lv = inner.length ? 1 : 0; it.col = it.lv ? 'var(--tm-r2)' : 'var(--tm-r1)';
    });
    slide.querySelectorAll('.tp-seg.tm-r-on').forEach(function (s) {
      var ids = idsOf(s), r = openR.filter(function (it) { return it.type === 'A' && ids.indexOf(it.id) >= 0; }).sort(function (a, b) { return a.lv - b.lv; })[0];
      if (r) s.style.setProperty('--tmc', r.col);
    });
    A.forEach(function (it) {
      var lines = [];
      it.cs.forEach(function (c) { var r = rel(rectOf(c)); var L = lines[lines.length - 1]; if (L && Math.abs(L.t - r.t) < fsz * 0.5) { L.r = Math.max(L.r, r.r); L.b = Math.max(L.b, r.b); } else lines.push({ l: r.l, r: r.r, t: r.t, b: r.b }); });
      var op = isOpen(it.id), th = op ? Math.max(1.5, fsz * 0.07) : Math.max(1, fsz * 0.045), col = op ? it.col : 'var(--tm-faint)';
      var off = fsz * (0.12 + it.lv * 0.36), tick = fsz * 0.28;
      lines.forEach(function (L, i) {
        var y = L.b + off;
        add(layer, 'tm-line', { left: L.l, top: y, width: L.r - L.l, height: th, background: col });
        if (i === 0) add(layer, 'tm-line', { left: L.l, top: y - tick + th, width: th, height: tick, background: col });
        if (i === lines.length - 1) add(layer, 'tm-line', { left: L.r - th, top: y - tick + th, width: th, height: tick, background: col });
      });
    });

    /* 〔修〕〔句意〕框 */
    var chipsUp = {}, chipsDn = {}, placed = [];
    function firstChar(id) { var x = charsById(slide, cs, id); return x[0]; }
    function lineStart(div) { var ln = div.closest('.tp-line'); var t = ln && ln.querySelector('.tp-text'); var c = t && chars(t.parentNode).filter(function (z) { return t.contains(z.n); })[0]; return c; }
    st.rh.forEach(function (it) {
      var c = it.ok ? (it.type === 'A' ? firstChar(it.id) : (slide.querySelector('.tm-kw[data-r="' + it.id + '"]') ? chars(slide).filter(function (z) { return slide.querySelector('.tm-kw[data-r="' + it.id + '"]').contains(z.n); })[0] : firstChar(it.id))) : null;
      if (!c) { var d = slide.querySelector('.tp-box-r .tp-rhet[data-lid="' + it.id + '"]'); c = d && lineStart(d); }
      if (!c) return;
      var r = rel(rectOf(c)), key = Math.round(r.l) + ',' + Math.round(r.t);
      var n = (chipsUp[key] = (chipsUp[key] || 0) + 1) - 1;
      it.chip = chip(layer, '修', it.id, 'r', r.l + n * fsz * 0.62, r.t, true, fsz, it.lv ? 'var(--tm-r2)' : 'var(--tm-r1)');
      it.anchor = r;
    });
    st.mn.forEach(function (it) {
      var c = it.ok ? firstChar(it.id) : null; if (!c) return;
      var r = rel(rectOf(c)), key = Math.round(r.l) + ',' + Math.round(r.b);
      var n = (chipsDn[key] = (chipsDn[key] || 0) + 1) - 1;
      it.chip = chip(layer, '句意', it.id, 'm', r.l + n * fsz * 1.1, r.b, false, fsz, 'var(--tm-g)');
      it.anchor = r;
    });

    /* 障礙物：打開中的〔修〕〔句意〕框（說明框之間也互相避讓） */
    st.rh.concat(st.mn).forEach(function (it) { if (it.chip && isOpen(it.id)) placed.push(rel(it.chip.getBoundingClientRect())); });
    /* 不避開翻譯／提問按鈕（老師 10/6：避開會把說明框擠得離字太遠；按鈕被蓋住時收起說明即可） */

    /* 浮動說明框 */
    function box(it, up, html, cls) {
      var bx = document.createElement('div'); bx.className = 'tm-box ' + cls; bx.innerHTML = html;
      bx.style.fontSize = fsz + 'px'; bx.style.fontFamily = getComputedStyle(txt0).fontFamily;   /* 說明與課文同字級、同字型 */
      bx.addEventListener('click', function (e) {
        e.stopPropagation();
        var mo = e.target.closest && e.target.closest('.tm-more');
        if (mo) { var k = sk(mo.getAttribute('data-full') + '#full'); OPEN[k] = !OPEN[k]; }   /* 「詳／短」切換長版 */
        else OPEN[sk(it.id)] = false;
        relayoutAll();
      });
      layer.appendChild(bx);
      var x = it.anchor.l, minW = Math.min(10 * fsz, TR - TL); if (TR - x < minW) x = Math.max(TL, TR - minW);
      bx.style.left = x + 'px'; bx.style.maxWidth = (TR - x) + 'px';
      var h = bx.offsetHeight, w = bx.offsetWidth, ch = it.chip.getBoundingClientRect(), cr = rel(ch);
      var t = up ? cr.t - h - fsz * 0.12 : Math.max(cr.b, it.lastB || 0) + fsz * 0.12;   /* 句意：在整句最後一行之下，不蓋住自己的原文 */
      var rc = { l: x, r: x + w, t: t, b: t + h };
      /* V152：撞到別的說明框時，先試同一排往左右挪（貼著對方），放得下就不往上疊（老師 10/20：稻浪、稻香同時開，稻香跑到稻浪上面） */
      var hitOf = function (z) { return placed.filter(function (p) { return z.l < p.r && p.l < z.r && z.t < p.b && p.t < z.b; })[0]; };
      var q0 = hitOf(rc);
      if (q0) {
        var ok = [q0.r + 4, q0.l - 4 - w, TR - w].some(function (nx) {
          if (nx < TL - 0.5 || nx + w > TR + 0.5) return false;
          var z = { l: nx, r: nx + w, t: t, b: t + h };
          if (hitOf(z)) return false;
          rc = z; bx.style.left = nx + 'px'; bx.style.maxWidth = (w + 1) + 'px'; return true;   /* 寬度不變（放寬會重新排版變寬，又撞到別人） */
        });
        /* 挪不開（框太寬）→ 縮窄放進對方左邊或右邊的空位（至少 7 個字寬） */
        if (!ok) ok = [[TL, q0.l - 4], [q0.r + 4, TR]].some(function (R) {
          var rw = R[1] - R[0]; if (rw < 7 * fsz) return false;
          bx.style.maxWidth = rw + 'px'; bx.style.left = R[0] + 'px';
          var w2 = bx.offsetWidth, h2 = bx.offsetHeight;
          var nx = Math.max(R[0], Math.min(it.anchor.l, R[1] - w2));
          var t2 = up ? cr.t - h2 - fsz * 0.12 : t;
          var z = { l: nx, r: nx + w2, t: t2, b: t2 + h2 };
          if (hitOf(z)) return false;
          rc = z; h = h2; w = w2; bx.style.left = nx + 'px'; return true;
        });
        if (!ok) { bx.style.left = x + 'px'; bx.style.maxWidth = (TR - x) + 'px'; }   /* 都不行：恢復原寬，照舊往上疊 */
      }
      for (var g = 0; g < 14; g++) {
        var q = placed.filter(function (p) { return rc.l < p.r && p.l < rc.r && rc.t < p.b && p.t < rc.b; })[0];
        if (!q) break;
        var nt = up ? q.t - h - 4 : q.b + 4; rc = { l: x, r: x + w, t: nt, b: nt + h };
      }
      bx.style.top = rc.t + 'px'; placed.push(rc);
    }
    function body(it, rhet) {
      var full = isOpen(it.id + '#full'), txt = (it.short && !full) ? it.short : it.exp;
      var h = rhet ? '<b>' + it.name + '</b>' + (txt && (GENERIC.indexOf(it.name) < 0 || full) ? '（' + String(txt).replace(/[。]$/, '') + '）' : '') : txt;
      if (it.short && it.exp) h += '<span class="tm-more" data-full="' + it.id + '">' + (full ? '短' : '詳') + '</span>';
      return h;
    }
    /* V152：修辭說明框都往上放 → 從下面的句子先擺（同一行從右邊先擺），上面的句子讓位時才是往自己的上方讓，不會跳過別人的框 */
    openR.filter(function (it) { return it.chip; }).sort(function (a, b) {
      return Math.abs(a.anchor.t - b.anchor.t) > fsz * 0.5 ? b.anchor.t - a.anchor.t : b.anchor.l - a.anchor.l;
    }).forEach(function (it) { box(it, true, body(it, true), 'tm-box-r'); });
    openM.forEach(function (it) {
      if (!it.chip) return;
      var mc = charsById(slide, cs, it.id); it.lastB = 0;
      mc.forEach(function (c) { it.lastB = Math.max(it.lastB, rel(rectOf(c)).b); });
      box(it, false, body(it, false), 'tm-box-m');
    });
  }
  function add(layer, cls, s) {
    var d = document.createElement('div'); d.className = cls;
    d.style.left = s.left + 'px'; d.style.top = s.top + 'px'; d.style.width = s.width + 'px'; d.style.height = s.height + 'px'; d.style.background = s.background;
    layer.appendChild(d); return d;
  }
  function chip(layer, label, id, kind, x, y, up, fsz, col) {
    var c = document.createElement('span'); c.className = 'tm-chip tm-chip-' + kind + (isOpen(id) ? ' on' : ''); c.textContent = label;
    c.style.fontSize = (fsz * 0.5) + 'px'; c.style.setProperty('--cc', col);
    c.style.left = x + 'px'; c.style.top = y + 'px'; c.style.transform = up ? 'translateY(calc(-100% - ' + (fsz * 0.1) + 'px))' : 'translateY(' + (fsz * 0.14) + 'px)';
    c.addEventListener('click', function (e) { e.stopPropagation(); OPEN[sk(id)] = !OPEN[sk(id)]; relayoutAll(); });
    layer.appendChild(c); return c;
  }

  function relayoutAll() {
    try { layout(document.getElementById('wk-slide-area')); } catch (e) { setTimeout(function () { throw e; }); }
    try { layout(document.getElementById('wkfs-body')); } catch (e) { setTimeout(function () { throw e; }); }
  }
  var pend = 0;
  /* 換頁有 0.55 秒淡入動畫（縮放 0.99→1）：動畫中量到的位置會偏 → 等動畫結束再排一次 */
  function settle() {
    var anims = [];
    ['wk-slide-area', 'wkfs-body'].forEach(function (id) {
      var sl = document.querySelector('#' + id + ' .wk-slide');
      if (sl && sl.getAnimations) sl.getAnimations().forEach(function (a) { if (a.playState === 'running') anims.push(a.finished.catch(function () {})); });
    });
    relayoutAll();
    if (anims.length) Promise.all(anims).then(function () { relayoutAll(); });
  }
  function soon() { clearTimeout(pend); pend = setTimeout(settle, 90); }

  /* 換頁後（等其他外掛跑完）再排；字級／視窗改變時重排 */
  /* V136：換到別頁（上一頁／下一頁／跳頁）時，句意、修辭全部收起恢復原樣（老師 10/18）；同一頁重畫（字級、視窗）不收 */
  var lastPage = null;
  function resetOnPageChange() {
    var cur = (typeof wkKey !== 'undefined' ? wkKey : '') + '|' + (typeof wkIdx !== 'undefined' ? wkIdx : '');
    if (lastPage !== null && cur !== lastPage) Object.keys(OPEN).forEach(function (k) { delete OPEN[k]; });
    lastPage = cur;
  }
  if (typeof wkRenderCurrent === 'function') {
    var _r = wkRenderCurrent;
    wkRenderCurrent = function () { resetOnPageChange(); var r = _r.apply(this, arguments); soon(); return r; };
  }
  window.addEventListener('resize', soon);
  /* 保險：課文頁內任何點擊（開關注釋欄等）或版面動畫結束後再排一次（不只靠 ResizeObserver） */
  var late = 0;
  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest || t.closest('.tm-chip, .tm-box')) return;
    if (!t.closest('#wk-slide-area, #wkfs-body, #wk-fullscreen')) return;
    clearTimeout(late); late = setTimeout(settle, 350);
  }, true);
  ['transitionend', 'animationend'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (e.target && e.target.closest && e.target.closest('#wk-slide-area, #wkfs-body')) soon(); }, true);
  });
  if (window.ResizeObserver) {
    var ro = new ResizeObserver(soon);
    ['wk-slide-area', 'wkfs-body'].forEach(function (id) { var el = document.getElementById(id); if (el) ro.observe(el); });
    window.__tmRO = ro;   /* 每次排版時也觀察該頁的 .wk-slide、第一個 .tp-text（注釋欄打開會讓課文區變窄、重新換行） */
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(soon);
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', soon);   /* 第一次用到粗體時字型才下載，下載完重排 */

  window.V115TM = { relayout: relayoutAll, enabled: ENABLED, state: OPEN };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/141_popsize-js.js ════ */
try {
/* V119：字義／字音／字形泡泡字級改為跟著課文字級（課文的 0.8 倍，最小 16px）。
   原因：018 的 tpPlacePopup 本來就把泡泡設成課文字級，但 025（v51 R2）用
   `.tp-popup-detached{font-size:var(--student-read-size) !important}` 固定成 2 倍基本字級（30px），
   一般畫面課文才 21px，泡泡反而比課文大。這裡不改舊規則，只在泡泡元素上覆寫 --student-read-size。 */
(function () {
  var RATIO = 0.8, MIN = 16;
  function wrap() {
    var orig = window.tpPlacePopup;
    if (typeof orig !== 'function' || orig._v119size) return;
    var w = function (el) {
      try {
        var pop = typeof tpPopNode === 'function' ? tpPopNode(el) : null;
        if (pop && el) {
          var fs = parseFloat(getComputedStyle(el).fontSize);
          if (fs) pop.style.setProperty('--student-read-size', Math.max(MIN, Math.round(fs * RATIO * 10) / 10) + 'px');
        }
      } catch (e) {}
      return orig.apply(this, arguments);
    };
    w._v119size = true;
    for (var k in orig) if (Object.prototype.hasOwnProperty.call(orig, k)) w[k] = orig[k];
    window.tpPlacePopup = w;
  }
  wrap();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wrap);
  window.addEventListener('load', wrap);
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/142_thirteen-js.js ════ */
try {
/* V120：〈論語選〉「十三經的演變」動畫頁（接在「題解·補充｜《論語》詳表」之後）。
   內容依據：教學系統專案 docs/課文盤點/十三經演變_資料整理.md（課本作品地位欄＋中山大學周春健文＋臺北市孔廟＋維基）。
   課本有寫的（唐文宗時十二經、南宋光宗時十三經）照課本；《孟子》入經時間各家不一，採課本說法。 */
(function () {
  var LESSON = '論語選—子路曾皙冉有公西華侍坐';
  var AFTER = /《論語》詳表/;
  /* 每部經一個方塊；順序固定，方便看出「拆開／加入」 */
  var BOOKS = [
    { id: '易', t: '易' }, { id: '書', t: '書' }, { id: '詩', t: '詩' },
    { id: '禮', t: '禮' }, { id: '周禮', t: '周禮' }, { id: '儀禮', t: '儀禮' }, { id: '禮記', t: '禮記' },
    { id: '樂', t: '樂' },
    { id: '春秋', t: '春秋' }, { id: '左傳', t: '左傳' }, { id: '公羊傳', t: '公羊傳' }, { id: '穀梁傳', t: '穀梁傳' },
    { id: '論語', t: '論語' }, { id: '孝經', t: '孝經' }, { id: '爾雅', t: '爾雅' }, { id: '孟子', t: '孟子' }
  ];
  /* show：該階段出現的書；add：本階段新加入（亮色）；gone：本階段消失（打叉後淡出）；split：拆開的來源 */
  var STEPS = [
    { era: '先秦', name: '六經', show: ['易', '書', '詩', '禮', '樂', '春秋'],
      cap: '《莊子．天運》最早出現「六經」之名：《詩》《書》《禮》《樂》《易》《春秋》。' },
    { era: '西漢', name: '五經', show: ['易', '書', '詩', '禮', '春秋'], gone: ['樂'],
      cap: '《樂經》亡佚，只剩五經。漢武帝立「五經博士」（前 136 年），儒學成為官學；此時《禮》指《儀禮》。',
      note: '東漢另有「七經」的說法：五經＋《論語》《孝經》。' },
    { era: '唐代', name: '九經', show: ['易', '書', '詩', '周禮', '儀禮', '禮記', '左傳', '公羊傳', '穀梁傳'],
      split: { '禮': ['周禮', '儀禮', '禮記'], '春秋': ['左傳', '公羊傳', '穀梁傳'] },
      cap: '《禮》分成「三禮」：《周禮》《儀禮》《禮記》；《春秋》分成「三傳」：《左傳》《公羊傳》《穀梁傳》。',
      note: '易＋書＋詩＋三禮＋三傳＝1＋1＋1＋3＋3＝9' },
    { era: '唐文宗．開成石經', name: '十二經', show: ['易', '書', '詩', '周禮', '儀禮', '禮記', '左傳', '公羊傳', '穀梁傳', '論語', '孝經', '爾雅'],
      add: ['論語', '孝經', '爾雅'],
      cap: '開成年間在國子學刻石（開成石經），九經之外加上《論語》《孝經》《爾雅》。',
      note: '課本：《論語》「唐文宗時，列為十二經之一」。' },
    { era: '南宋光宗', name: '十三經', show: ['易', '書', '詩', '周禮', '儀禮', '禮記', '左傳', '公羊傳', '穀梁傳', '論語', '孝經', '爾雅', '孟子'],
      add: ['孟子'],
      cap: '《孟子》由「子」書升格為「經」，十二經加《孟子》，成為流傳至今的「十三經」。',
      note: '課本：「南宋光宗時，列為十三經之一」。明代欽定《十三經注疏》，十三經之名完全確立。' }
  ];
  var SUMMARY = '六經 →（《樂》亡佚）五經 →（禮分三禮、春秋分三傳）九經 →（＋論語、孝經、爾雅）十二經 →（＋孟子）十三經';
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function slideHTML() {
    var tl = STEPS.map(function (s, i) {
      return '<button class="t13-dot" data-i="' + i + '" onclick="t13Go(this,' + i + ')"><b>' + esc(s.name) + '</b><span>' + esc(s.era) + '</span></button>';
    }).join('<span class="t13-arrow">→</span>');
    var books = BOOKS.map(function (b) {
      return '<span class="t13-b" data-id="' + esc(b.id) + '">' + esc(b.t) + '</span>';
    }).join('');
    return '<div class="wk-slide wks-keyrhet v73-kr t13-slide">' +
      '<div class="wks-kr-head"><span class="wks-kr-name">十三經的演變</span><span class="wks-kr-sub">從六經到十三經〈論語選〉</span></div>' +
      '<div class="t13" data-st="0">' +
        '<div class="t13-tl">' + tl + '</div>' +
        '<div class="t13-head"><span class="t13-era"></span><span class="t13-name"></span><span class="t13-count"></span></div>' +
        '<div class="t13-stage">' + books + '</div>' +
        '<div class="t13-cap"></div><div class="t13-note"></div>' +
        '<div class="t13-sum">' + esc(SUMMARY) + '</div>' +
        '<div class="v73-ctrl"><button class="v73-btn t13-next" onclick="t13Step(this)">▶ 下一步</button>' +
        '<button class="v73-btn rst" onclick="t13Reset(this)">↻ 重來</button></div>' +
      '</div></div>';
  }

  /* FLIP：先記下舊位置，改版面後從舊位置滑到新位置 */
  function rects(box) { var m = {}; box.querySelectorAll('.t13-b').forEach(function (b) { if (b.classList.contains('on')) m[b.dataset.id] = b.getBoundingClientRect(); }); return m; }
  function render(box, i, animate) {
    var S = STEPS[i], stage = box.querySelector('.t13-stage');
    var before = animate ? rects(box) : {};
    var prev = i > 0 ? STEPS[i - 1] : null;
    box.dataset.st = i;
    box.querySelectorAll('.t13-dot').forEach(function (d, j) { d.classList.toggle('cur', j === i); d.classList.toggle('done', j < i); });
    box.querySelector('.t13-era').textContent = S.era;
    box.querySelector('.t13-name').textContent = S.name;
    box.querySelector('.t13-count').textContent = '共 ' + S.show.length + ' 部';
    box.querySelector('.t13-cap').textContent = S.cap;
    var note = box.querySelector('.t13-note'); note.textContent = S.note || ''; note.style.display = S.note ? '' : 'none';
    box.querySelector('.t13-sum').classList.toggle('show', i === STEPS.length - 1);
    var nx = box.querySelector('.t13-next'); nx.disabled = i === STEPS.length - 1; nx.textContent = i === STEPS.length - 1 ? '✓ 完成' : '▶ 下一步';
    var splitFrom = {};
    if (animate && S.split) Object.keys(S.split).forEach(function (src) { S.split[src].forEach(function (c) { splitFrom[c] = src; }); });
    stage.querySelectorAll('.t13-b').forEach(function (b) {
      var id = b.dataset.id, on = S.show.indexOf(id) >= 0;
      var gone = animate && S.gone && S.gone.indexOf(id) >= 0;
      b.classList.remove('add', 'split', 'gone');
      b.style.transition = 'none'; b.style.transform = ''; b.style.opacity = '';
      if (gone) { b.classList.add('on', 'gone'); return; }   /* 先留在原位打叉，再淡出 */
      b.classList.toggle('on', on);
      if (on && S.add && S.add.indexOf(id) >= 0) b.classList.add('add');
      if (on && S.split && splitFrom[id] !== undefined) b.classList.add('split');
      if (on && !animate && S.split && Object.keys(S.split).some(function (k) { return S.split[k].indexOf(id) >= 0; })) b.classList.add('split');
    });
    if (!animate) return;
    void stage.offsetWidth;
    stage.querySelectorAll('.t13-b.on').forEach(function (b) {
      var id = b.dataset.id, a = before[id] || (splitFrom[id] && before[splitFrom[id]]), r = b.getBoundingClientRect();
      if (b.classList.contains('gone')) {
        setTimeout(function () { b.style.transition = 'opacity .6s, transform .6s'; b.style.opacity = '0'; b.style.transform = 'scale(.6)'; }, 900);
        setTimeout(function () { b.classList.remove('on', 'gone'); b.style.transition = 'none'; b.style.opacity = ''; b.style.transform = ''; render(box, i, false); }, 1600);
        return;
      }
      if (a) {
        b.style.transform = 'translate(' + (a.left - r.left) + 'px,' + (a.top - r.top) + 'px)';
        void b.offsetWidth;
        b.style.transition = 'transform .9s cubic-bezier(.5,0,.3,1), background .4s, color .4s';
        b.style.transform = '';
      } else {
        b.style.opacity = '0'; b.style.transform = 'translateY(-1.2em) scale(.7)';
        void b.offsetWidth;
        b.style.transition = 'transform .7s cubic-bezier(.3,1.4,.5,1) .5s, opacity .5s .5s';
        b.style.opacity = '1'; b.style.transform = '';
      }
    });
  }
  function boxOf(el) { return el.closest('.t13'); }
  window.t13Step = function (btn) { if (window.event) window.event.stopPropagation(); var box = boxOf(btn), i = +box.dataset.st; if (i < STEPS.length - 1) render(box, i + 1, true); };
  window.t13Go = function (btn, i) { if (window.event) window.event.stopPropagation(); var box = boxOf(btn), cur = +box.dataset.st; render(box, i, i === cur + 1); };
  window.t13Reset = function (btn) { if (window.event) window.event.stopPropagation(); render(boxOf(btn), 0, false); };
  function initAll() { document.querySelectorAll('.t13:not([data-init])').forEach(function (box) { box.dataset.init = '1'; render(box, 0, false); }); }
  new MutationObserver(initAll).observe(document.documentElement, { childList: true, subtree: true });

  /* ── 投影片：插在《論語》詳表之後 ── */
  var _parse = wkParseSlides;
  wkParseSlides = function (key) {
    var slides = _parse.apply(this, arguments);
    if (key !== LESSON) return slides;
    var at = -1;
    slides.forEach(function (s, i) { if (at < 0 && s.type === 'info' && AFTER.test(String(s.label || ''))) at = i + 1; });
    if (at < 0) return slides;
    slides.splice(at, 0, { type: 't13anim' });
    slides.forEach(function (s) {
      if (s.type === 'work_answers') (s.targets || []).forEach(function (t) { if (t.slideIdx >= at) t.slideIdx += 1; });
    });
    return slides;
  };
  var _render = wkRenderSlideHTML;
  wkRenderSlideHTML = function (slide) {
    if (slide && slide.type === 't13anim') return slideHTML();
    return _render.apply(this, arguments);
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/148_guide-js.js ════ */
try {
/* V126 追問引導：配合 149_guide-css。資料（課文 ask 陣列的 HTML）裡的 onclick 呼叫這兩個函式。
   gdTap：點追問 → 顯示答案、出現下一個追問（最後一個問完 → 出現小結論）；點小結論 → 顯示內容並出現板書；點板書 → 顯示板書。再點一次收起答案。
   gdAll：全部展開（老師備課用）；再按一次全部收回到只剩第一問。
   V151：主問題可點的（〈火車線〉）改成一步一步：點題目 → 出現答案；再點 → 出現下一個追問（老師 10/20）。
         主問題的答案在 .gd-q 裡的 .gd-qa；沒有 .gd-qa 的主問題，點一下直接出現第一個追問。〈論語選〉不變。 */
(function () {
  'use strict';
  function isNext(n) { return n && (n.classList.contains('gd-s') || n.classList.contains('gd-end') || n.classList.contains('gd-board')); }
  window.gdTap = function (el) {
    var n = el.nextElementSibling, box = el.closest('.gd'), q = box && box.querySelector('.gd-q');
    var step = q && q.hasAttribute('onclick');   /* V151：主問題可點 → 一步一步 */
    if (!step) {
      if (!el.classList.contains('show')) {
        el.classList.add('show');
        if (isNext(n)) n.classList.add('vis');
      } else {
        el.classList.remove('show');
      }
      return;
    }
    var hasAns = !el.classList.contains('gd-q') || !!el.querySelector('.gd-qa');
    if (hasAns && !el.classList.contains('show')) { el.classList.add('show'); return; }   /* 第一下：出現答案 */
    if (isNext(n) && !n.classList.contains('vis')) { n.classList.add('vis'); if (!hasAns) el.classList.add('show'); return; }   /* 第二下：出現下一題 */
    if (hasAns) el.classList.remove('show');   /* 都出現了再點：收起答案 */
  };
  window.gdAll = function (btn) {
    var box = btn.closest('.gd'); if (!box) return;
    var open = !box.classList.contains('gd-open');
    box.classList.toggle('gd-open', open);
    var q = box.querySelector('.gd-q'), qTap = q && q.hasAttribute('onclick');   /* V136：主問題可點的（〈火車線〉），收起時連第一問也收 */
    if (qTap) q.classList.toggle('show', open);
    box.querySelectorAll('.gd-s, .gd-end, .gd-board').forEach(function (x, i) {
      x.classList.toggle('vis', open || (i === 0 && !qTap));
      x.classList.toggle('show', open);
    });
    btn.textContent = open ? '收起' : '全部展開';
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/150_after-js.js ════ */
try {
/* V126 課後引導（151_after-css）：資料是補充頁 body 的 HTML，onclick 呼叫下面幾個函式。
   ahNext：同一頁裡「下一步」——依序顯示下一個 .ah-step（追問、小結）；全部顯示後按鈕隱藏。
   wcPlay：文字雲動畫——讀 .wc 的 data-w（「詞:權重|詞:權重」，權重 1～3＝字的大小），打亂順序後一個一個跳出來。
   wcAdd：在文字雲加上同學的回答（輸入框按 Enter）；不存檔，換頁就消失。
   mmTap：心智圖節點——點開／收起它的下一層。 */
(function () {
  'use strict';
  var COLORS = ['#7c4da0', '#2c5f73', '#8a3a1c', '#4f8a78', '#b07a12', '#6b5a42', '#a0522d'];
  function word(t, w, i) {
    var s = document.createElement('span');
    s.className = 'wc-w wc-' + (w || 1);
    s.textContent = t;
    s.style.color = COLORS[i % COLORS.length];
    s.style.setProperty('--rot', ((i * 37) % 3 === 0 ? (i % 2 ? -6 : 6) : 0) + 'deg');
    return s;
  }
  window.wcPlay = function (btn) {
    var box = btn.closest('.ah-step') || btn.parentNode, wc = box.querySelector('.wc'); if (!wc) return;
    var items = String(wc.getAttribute('data-w') || '').split('|').filter(Boolean).map(function (x) {
      var p = x.split(':'); return { t: p[0], w: +p[1] || 1 }; });
    for (var i = items.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), k = items[i]; items[i] = items[j]; items[j] = k; }
    wc.innerHTML = ''; wc.classList.add('on');
    items.forEach(function (it, i) {
      var s = word(it.t, it.w, i); s.style.animationDelay = (i * 0.22) + 's'; wc.appendChild(s);
    });
    btn.style.display = 'none';
    var add = box.querySelector('.wc-add'); if (add) add.style.display = '';
  };
  window.wcAdd = function (inp, ev) {
    if (ev && (ev.key !== 'Enter' || ev.isComposing)) return;   /* 注音選字時的 Enter 不算 */
    var t = inp.value.trim(); if (!t) return;
    var wc = inp.closest('.ah-step').querySelector('.wc');
    var s = word(t, 2, wc.children.length + 3); s.classList.add('wc-mine'); wc.appendChild(s);
    inp.value = '';
  };
  window.ahNext = function (btn) {
    var box = btn.closest('.ah'); if (!box) return;
    var next = box.querySelector('.ah-step:not(.on)');
    if (next) { next.classList.add('on'); next.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    if (!box.querySelector('.ah-step:not(.on)')) btn.style.display = 'none';
  };
  window.mmTap = function (node, ev) {
    if (ev) ev.stopPropagation();
    var li = node.closest('.mm-n'); if (li) li.classList.toggle('open');
  };
})();
/* V126 跳到補充講義某一頁（依標題關鍵字找 hd2 頁），並在那頁加「⤺ 回原頁」；回去沿用 015_main 的 wkReturnToText。 */
(function () {
  'use strict';
  function addBack() {
    if (!window.wkReturnTo) return;
    document.querySelectorAll('#wk-slide-area .wk-slide, #wkfs-body .wk-slide').forEach(function (sl) {
      if (sl.querySelector('.ah-back')) return;
      var b = document.createElement('button'); b.className = 'ah-back'; b.textContent = '⤺ 回原頁';
      b.onclick = function (e) { e.stopPropagation(); if (typeof wkReturnToText === 'function') wkReturnToText(); };
      sl.insertBefore(b, sl.firstChild);
    });
  }
  window.wkGoHandout = function (ev, key) {
    if (ev && ev.stopPropagation) ev.stopPropagation();
    if (typeof wkSlides === 'undefined') return;
    var idx = -1;
    wkSlides.forEach(function (s, i) { if (idx < 0 && s.type === 'hd2' && s.page && String(s.page.title || '').indexOf(key) >= 0) idx = i; });
    if (idx < 0) return;
    window.wkReturnTo = { idx: wkIdx, li: null };
    wkGoto(idx);
    setTimeout(addBack, 60);
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/160_popfx-js.js ════ */
try {
/* 按鈕爆粒子（2026-10-08 老師）：點下去按鈕 1→0.8→1.2→1 回彈（帶回彈曲線），中心炸出 8 顆古典色小圓點向外飛散淡出，共 600ms。
   套用範圍（老師同意的建議）：
     ① 看答案類按鈕（全部顯示答案、直接顯示答案、一鍵全開…）→ 回彈＋粒子；只在「顯示」時爆，按「隱藏」不爆
     ② 成績、同步的主要按鈕（.gr-btn.pri、.sy-btn.pri：登入、儲存、匯入、立即同步…）→ 回彈＋粒子
     ③ 點遮罩看答案（點此顯示答案與解析、點一下揭曉、點一下看答案、表格裡的點此顯示答案）→ 遮罩消失時只炸粒子（遮罩會不見，不做回彈）
   翻頁、畫筆、關閉、字級、深色模式這些常按的不爆。系統設定「減少動態效果」就不播。
   做法：document 捕獲階段先記下按下前的狀態（按鈕文字、遮罩是否可見、位置），等原本的 onclick 跑完（setTimeout 0）再判斷要不要爆；
   不改任何既有模組。同一份程式也放在班級網站（教學系統專案 scripts/stu_class_addon.html），兩邊改要一起改。 */
(function () {
  if (window.popFx) return;
  var COLORS = ['#c23a2b', '#d9a420', '#3f8f6b', '#2b6c9e', '#9d2933', '#c8a046', '#6aa3b8', '#9b5b2b'];   // 朱砂、藤黃、石綠、石青、胭脂、泥金、天青、赭石
  var DUR = 600, BOUNCE = 'cubic-bezier(.34,1.56,.64,1)';
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var st = document.createElement('style'); st.id = 'popfx-css';
  st.textContent = '.pop-fx-layer{position:fixed;left:0;top:0;width:0;height:0;overflow:visible;pointer-events:none;z-index:2147483647}' +
    '.pop-fx-dot{position:absolute;left:0;top:0;border-radius:50%;pointer-events:none;will-change:transform,opacity}';
  document.head.appendChild(st);

  var layer = null;
  function getLayer() {
    if (!layer || !layer.isConnected) { layer = document.createElement('div'); layer.className = 'pop-fx-layer'; document.body.appendChild(layer); }
    return layer;
  }
  /* btn：要回彈的元素（可為 null）；r：炸粒子的位置（視窗座標，沒給就用 btn 現在的位置） */
  function popFx(btn, r) {
    if (reduce || !document.body.animate) return;
    if (btn) {
      var base = getComputedStyle(btn).transform; base = base && base !== 'none' ? base + ' ' : '';   // 原本有 transform 的按鈕（置中定位等）不能被蓋掉
      var rb = btn.getBoundingClientRect(), room = Math.min(rb.left, document.documentElement.clientWidth - rb.right);
      var hi = rb.width ? Math.min(1.2, Math.max(1.03, 1 + 2 * room / rb.width)) : 1.2;   // 滿版寬的按鈕放大幅度自動縮小，不會超出螢幕（手機才不會左右晃）
      btn.animate([
        { transform: base + 'scale(1)', easing: 'cubic-bezier(.3,0,.6,1)' },
        { transform: base + 'scale(0.8)', offset: 0.22, easing: BOUNCE },
        { transform: base + 'scale(' + hi + ')', offset: 0.6, easing: BOUNCE },
        { transform: base + 'scale(1)' }
      ], { duration: DUR });
      r = btn.getBoundingClientRect();
    }
    if (!r || !r.width) return;
    var cx = r.left + r.width / 2, cy = r.top + r.height / 2, L = getLayer();
    var s0 = Math.min(Math.max(r.width, r.height) / 2 * 0.6, 60), a0 = Math.random() * Math.PI * 2;   // 大遮罩起點最多離中心 60px
    for (var i = 0; i < 8; i++) {
      var a = a0 + i * Math.PI / 4 + (Math.random() - 0.5) * 0.35, dist = s0 + 16 + Math.random() * 10, sz = 3 + Math.random() * 1.5;
      var sx = cx + Math.cos(a) * s0, sy = cy + Math.sin(a) * s0, ex = cx + Math.cos(a) * dist, ey = cy + Math.sin(a) * dist;
      var dot = document.createElement('div'); dot.className = 'pop-fx-dot';
      dot.style.cssText = 'width:' + sz + 'px;height:' + sz + 'px;margin:' + (-sz / 2) + 'px 0 0 ' + (-sz / 2) + 'px;background:' + COLORS[i];
      L.appendChild(dot);
      var P = (function (sx, sy, ex, ey) { return function (k) { return 'translate(' + (sx + (ex - sx) * k) + 'px,' + (sy + (ey - sy) * k) + 'px)'; }; })(sx, sy, ex, ey);
      dot.animate([
        { transform: P(0) + ' scale(.4)', opacity: 0, easing: 'ease-out' },
        { transform: P(0.3) + ' scale(1.2)', opacity: 1, offset: 0.15, easing: 'cubic-bezier(.2,.8,.3,1)' },
        { transform: P(0.9) + ' scale(1)', opacity: 1, offset: 0.7, easing: 'ease-in' },
        { transform: P(1) + ' scale(.4)', opacity: 0 }
      ], { duration: DUR }).onfinish = (function (el) { return function () { el.remove(); }; })(dot);
    }
  }
  window.popFx = popFx;

  var REVEAL_BTN = '.wq-reveal-btn,.jy-toggle-all,.iq-all,.as-all,button.all,#bAll,button[onclick^="v68AoAll"],#stu-sp-all';   // #stu-sp-all：班級網站衝刺區「👀 本頁答案全開」
  var CONFIRM_BTN = '.gr-btn.pri,.sy-btn.pri';
  var BOX = '.wks-q-ansbox,.wks-exam-ansbox,.wks-selfq-box,.wks-cq-card,.ah-a,#nq2 .qc';
  var COVER = '.wks-q-cover,.wks-cq-cover,.ah-cov,.qa-hint';
  function shown(el) { return !!(el && el.isConnected && el.getClientRects().length); }
  function keyOf(b) { return b.getAttribute('data-g') || b.getAttribute('data-s') || b.id || ''; }

  document.addEventListener('click', function (e) {
    var t = e.target; if (!t || !t.closest) return;
    var b = t.closest(CONFIRM_BTN + ',' + REVEAL_BTN);
    if (b) {
      if (b.disabled) return;
      var txt = b.textContent || '';
      if (!b.matches(CONFIRM_BTN) && (/隱藏|遮|藏起來/.test(txt) || !/顯示|全開|揭曉|答案/.test(txt))) return;   // 看答案類：只在「顯示」時爆
      var r = b.getBoundingClientRect(), k = keyOf(b), par = b.parentNode;
      setTimeout(function () {
        if (b.isConnected) { popFx(b); return; }
        var nb = k && document.querySelector('[data-g="' + k + '"],[data-s="' + k + '"]');   // 按完整塊重畫：找新的同一顆
        if (nb && shown(nb)) popFx(nb); else popFx(null, r);
      }, 0);
      return;
    }
    var wa = document.body.classList.contains('stu-sprint-on') && t.closest('.wk-a');   // 班級網站衝刺區的「點我」（遮罩是 ::before，點一下切換 stu-show）
    if (wa) { var r1 = wa.getBoundingClientRect(); setTimeout(function () { if (wa.classList.contains('stu-show')) popFx(null, r1); }, 0); return; }
    var box = t.closest(BOX), cov = box && box.querySelector(COVER);
    if (!shown(cov)) return;   // 已經打開了（這下是要收起來）→ 不爆
    var r2 = cov.getBoundingClientRect();
    setTimeout(function () { if (!shown(cov)) popFx(null, r2); }, 0);
  }, true);
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/162_spot-js.js ════ */
try {
/* 聚光燈（2026-10-09 老師）：畫面變暗，只留手指／滑鼠所在處一個圓形亮區，當雷射筆用。
   - 開關：畫面上浮動的朱紅圓鈕（手電筒圖；老師說像 iPad 小白點會搞混 → 改半透明火炬圓鈕）——點一下開／關；按住拖曳可移到任何地方放著（位置記在這台裝置）。
     一般畫面、全螢幕都在；手機不顯示（手機用不到）。鍵盤 L 也可開關。
   - 開著時：手指拖曳／滑鼠移動，亮圈跟著走；手放開亮圈停原處。Esc 只關聚光燈、不關全螢幕。換頁鍵 ←／→ 照常。
     開著時畫面上其他按鈕暫時按不到（同畫筆），小圓點仍在最上層可按。
   - 試做頁另有雷射點、大小、暗度選項，老師 10/9 說雷射不需要 → 只做聚光燈，大小、暗度用試做頁的「中」。
     原本放在工具列的「🔦」按鈕太小難按 → 改成浮動圓點（同日）。
   自帶 <style id="spot-css">，不改任何既有模組。 */
(function () {
  if (window.spotToggle) return;
  var R = 120, DIM = 0.62, SIZE = 52, POS_KEY = 'spot_dot_pos_v1';

  var st = document.createElement('style'); st.id = 'spot-css';
  st.textContent =
    '#spot-layer{position:fixed;inset:0;z-index:2147483000;display:none;cursor:none;touch-action:none;' +
      '--x:50vw;--y:50vh;--r:' + R + 'px;' +
      'background:radial-gradient(circle at var(--x) var(--y),transparent 0,transparent var(--r),rgba(0,0,0,' + DIM + ') calc(var(--r) + 18px))}' +
    '#spot-layer.on{display:block}' +
    '#spot-layer.idle{background:rgba(0,0,0,.18)}' +
    '#spot-ring{position:fixed;left:0;top:0;width:' + 2 * R + 'px;height:' + 2 * R + 'px;margin:' + -R + 'px 0 0 ' + -R + 'px;border-radius:50%;pointer-events:none;' +
      'box-shadow:0 0 0 2px rgba(255,236,170,.55),0 0 24px 6px rgba(255,236,170,.25)}' +
    '#spot-layer.idle #spot-ring{display:none}' +
    '#spot-hint{position:fixed;left:50%;bottom:18px;transform:translateX(-50%);background:rgba(0,0,0,.65);color:#fff;font-size:14px;' +
      'padding:6px 14px;border-radius:20px;pointer-events:none;white-space:nowrap;transition:opacity .6s}' +
    /* 浮動圓鈕：半透明暗朱紅底、泥金細邊、火炬圖（刻意不像 iPad 的灰白小白點） */
    '#spot-dot{position:fixed;left:0;top:0;width:' + SIZE + 'px;height:' + SIZE + 'px;border-radius:50%;z-index:2147483001;touch-action:none;cursor:pointer;' +
      'display:flex;align-items:center;justify-content:center;box-sizing:border-box;' +
      'background:rgba(120,32,24,.42);border:1.5px solid rgba(212,173,90,.6);' +
      'box-shadow:0 2px 8px rgba(0,0,0,.18);opacity:.6;transition:opacity .25s,box-shadow .25s,background .25s,scale .15s;' +
      '-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent}' +
    '#spot-dot svg{width:32px;height:32px;pointer-events:none}' +
    '#spot-dot:hover,#spot-dot.drag{opacity:.95}' +
    '#spot-dot.drag{scale:1.12}' +
    '#spot-dot.on{opacity:.9;background:rgba(150,40,28,.55);border-color:rgba(255,226,140,.85);box-shadow:0 0 16px 6px rgba(255,170,60,.45)}' +
    '#spot-dot.on .fl{animation:spot-flk .5s ease-in-out infinite alternate;transform-origin:16px 14px}' +
    '@keyframes spot-flk{from{transform:scale(1,1)}to{transform:scale(.92,1.08)}}' +
    '@media (max-width:600px){#spot-dot{display:none !important}}';
  document.head.appendChild(st);

  var L = document.createElement('div'); L.id = 'spot-layer'; L.className = 'idle';
  L.innerHTML = '<div id="spot-ring"></div><div id="spot-hint">手指拖曳／滑鼠移動　·　再點小圓點或 Esc 關閉</div>';
  var ring = L.firstChild, hint = L.lastChild, hintT = 0;
  var dot = document.createElement('div'); dot.id = 'spot-dot'; dot.setAttribute('role', 'button');
  dot.setAttribute('aria-label', '聚光燈開關（按住可拖曳移動）');
  /* 火炬：上面火焰、中間金色火炬碗、下面木柄 */
  dot.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true">' +
    '<g class="fl"><path d="M16 2 C19 6 22 8 21 12.5 C20.5 15 18.5 16 16 16 C13.5 16 11.5 15 11 12.5 C10.5 9.5 13 8 13.5 5.5 C14.5 7.5 15.5 8 15.5 8 C16.5 6 16.5 4 16 2 Z" fill="#f08a24"/>' +
    '<path d="M16 7.5 C17.8 10 19 11.5 18.4 13.4 C18 14.7 17 15.2 16 15.2 C15 15.2 14 14.7 13.6 13.4 C13.2 12 14.6 11 15 9.5 C15.6 10.6 16.2 10.6 16 7.5 Z" fill="#ffe27a"/></g>' +
    '<path d="M10 16 H22 L20.5 19.5 H11.5 Z" fill="#d4ad5a"/>' +
    '<path d="M12.5 19.5 H19.5 L17.6 30 H14.4 Z" fill="#8a5a32"/>' +
    '<path d="M13.2 22.5 H18.8" stroke="#d4ad5a" stroke-width="1"/></svg>'; dot.title = '聚光燈：點一下開關，按住拖曳移動（鍵盤 L）';

  function isOn() { return L.classList.contains('on'); }
  function move(x, y) {
    L.classList.remove('idle');
    L.style.setProperty('--x', x + 'px'); L.style.setProperty('--y', y + 'px');
    ring.style.transform = 'translate(' + x + 'px,' + y + 'px)';
  }
  function toggle(on) {
    on = on === undefined ? !isOn() : !!on;
    L.classList.toggle('on', on); L.classList.add('idle'); dot.classList.toggle('on', on);
    if (on) { hint.style.opacity = 1; clearTimeout(hintT); hintT = setTimeout(function () { hint.style.opacity = 0; }, 2500); }
  }
  window.spotToggle = toggle;

  L.addEventListener('pointerdown', function (e) { move(e.clientX, e.clientY); e.preventDefault(); });
  L.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || e.buttons) move(e.clientX, e.clientY); });
  L.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); });

  /* ── 小圓點：點一下開關；拖曳（或按住後拖曳）移動 ── */
  var pos = null;
  try { pos = JSON.parse(localStorage.getItem(POS_KEY) || 'null'); } catch (e) { }
  function clampPos() {
    var W = document.documentElement.clientWidth, H = innerHeight;
    var p = pos || { rx: 1, y: H - SIZE - 140 };                    /* 預設：右下（側邊分頁下方、換頁列上方） */
    var x = p.rx !== undefined ? p.rx * (W - SIZE) : p.x;              /* 水平存比例，換螢幕寬度還在同一側 */
    x = Math.max(4, Math.min(W - SIZE - 4, x));
    var y = Math.max(4, Math.min(H - SIZE - 4, p.y));
    dot.style.transform = 'translate(' + x + 'px,' + y + 'px)';
    dot.dataset.x = x; dot.dataset.y = y;
  }
  var dr = null;
  dot.addEventListener('pointerdown', function (e) {
    e.preventDefault(); e.stopPropagation();
    try { dot.setPointerCapture(e.pointerId); } catch (er) { }
    dr = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x0: +dot.dataset.x, y0: +dot.dataset.y, moving: false,
           hold: setTimeout(function () { if (dr) { dr.moving = true; dot.classList.add('drag'); } }, 350) };
  });
  dot.addEventListener('pointermove', function (e) {
    if (!dr || e.pointerId !== dr.id) return;
    var dx = e.clientX - dr.sx, dy = e.clientY - dr.sy;
    if (!dr.moving && Math.abs(dx) + Math.abs(dy) > 8) { dr.moving = true; dot.classList.add('drag'); }
    if (dr.moving) {
      var W = document.documentElement.clientWidth, H = innerHeight;
      var x = Math.max(4, Math.min(W - SIZE - 4, dr.x0 + dx)), y = Math.max(4, Math.min(H - SIZE - 4, dr.y0 + dy));
      dot.style.transform = 'translate(' + x + 'px,' + y + 'px)'; dot.dataset.x = x; dot.dataset.y = y;
    }
    e.preventDefault(); e.stopPropagation();
  });
  function endDrag(e, cancel) {
    if (!dr || e.pointerId !== dr.id) return;
    clearTimeout(dr.hold);
    var moved = dr.moving; dr = null; dot.classList.remove('drag');
    if (moved) {
      var W = document.documentElement.clientWidth;
      pos = { rx: +dot.dataset.x / Math.max(1, W - SIZE), y: +dot.dataset.y };
      try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch (er) { }
    } else if (!cancel) toggle();
    e.preventDefault(); e.stopPropagation();
  }
  dot.addEventListener('pointerup', function (e) { endDrag(e, false); });
  dot.addEventListener('pointercancel', function (e) { endDrag(e, true); });
  dot.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); });
  addEventListener('resize', clampPos);

  document.addEventListener('keydown', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('input,textarea,select,[contenteditable="true"]')) return;
    if (e.key === 'Escape' && isOn()) { toggle(false); e.preventDefault(); e.stopImmediatePropagation(); return; }
    if ((e.key === 'l' || e.key === 'L') && !e.ctrlKey && !e.metaKey && !e.altKey) { toggle(); e.preventDefault(); }
  }, true);

  function boot() { document.body.appendChild(L); document.body.appendChild(dot); clampPos(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/163_inkthin-js.js ════ */
try {
/* 投影畫筆只留細筆（2026-10-09 老師；同日再拿掉「清除本頁」——關掉畫筆本來就會全部清除）：紅藍綠紫只要「細」，拿掉「中」（「粗」v56 已藏）；螢光筆只留黃色一支（本來就只有一支）。
   - 細／中按鈕都藏起來（不刪 DOM），從螢光筆換回顏色時粗細一律回到細（3）。
   - 包裝 wkInkColor（實際生效版本＝本段包在 v56 036_v56-nq2-js.js 包裝版的外層）。 */
(function () {
  var st = document.createElement('style'); st.id = 'inkthin-css';
  st.textContent = '#wk-ink-toolbar .wk-ink-size,#wk-ink-toolbar button[onclick="wkInkClear()"]{display:none !important}';   /* 「清除本頁」也藏：關掉畫筆就會清除 */
  document.head.appendChild(st);
  function wrap() {
    var orig = window.wkInkColor;
    if (typeof orig !== 'function' || orig._thin) return;
    window.wkInkColor = function () {
      var r = orig.apply(this, arguments);
      if (window.wkInkState && wkInkState.color !== 'rgba(0,0,0,0)') wkInkState.size = 3;
      return r;
    };
    window.wkInkColor._thin = true;
  }
  /* v56 的包裝在 DOMContentLoaded 才做，要包在它外層 */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(wrap, 0); });
  else wrap();
  if (window.wkInkState) wkInkState.size = 3;
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/164_hlmark-js.js ════ */
try {
/* 標記筆（2026-10-09 試做；需求見教學系統專案 docs/待辦/待辦_RayOclass新功能_20261005.md 第 3 項）
   - 跟投影「畫筆」分開：畫筆是隨手畫、不存；標記筆劃過文字會自動對齊到字，永久保留。
   - 開關：一般畫面「🖥 投影全螢幕」旁的「🖍 標記筆」；全螢幕上方那排的「🖍」。開著時下方出現色盤：紅、黃、藍、綠、本頁清除、完成。
   - 用法：開著時在課文上劃過去就標起來；點一下已標的字 → 跳出小框可換色或刪除。開著時畫面上的點字泡泡等暫時不會被觸發。
   - 存法：不存筆跡，存「課名＋第幾頁＋這頁的識別＋被標的文字＋前後各 8 字＋在本頁文字中的位置」；
     換字級、換螢幕、一般畫面／全螢幕都重新對齊。找不到原文的標記不亂標（之後可列成「失效標記」）。
   - 四班共用一套。【試做】暫存在本機 localStorage「hlmark_trial_v1」，還沒加入雲端同步（正式鍵名定案前先問老師）。
   - 畫面上用 <span class="hm-m"> 包住被標的字（只加背景、不改字寬與位置，不影響修辭框線等定位）。
   自帶 <style id="hlmark-css">，不改任何既有模組。 */
(function () {
  if (window.hmToggle) return;
  var KEY = 'hlmark_trial_v1';
  var COLORS = { r: '#e8746a', y: '#f5d533', b: '#6fa8e8', g: '#6cc48a' };
  var NAMES = { r: '紅', y: '黃', b: '藍', g: '綠' };
  var SKIP = 'rt,rp,sup,script,style,button,[role="button"],.hm-ui,[aria-hidden="true"],.tm-layer,.tm-par';   /* 按鈕文字（句意、翻譯…）不算 */
  var CTX = 8;
  var on = false, color = 'y', applying = false;

  /* ── 樣式 ── */
  var css = '.hm-m{border-radius:2px;-webkit-box-decoration-break:clone;box-decoration-break:clone}';
  Object.keys(COLORS).forEach(function (k) {
    var c = COLORS[k];
    css += '.hm-m[data-c="' + k + '"]{background:linear-gradient(transparent 38%,' + hexA(c, .55) + ' 38%,' + hexA(c, .55) + ' 92%,transparent 92%)}' +
      'body.dark-mode .hm-m[data-c="' + k + '"]{background:linear-gradient(transparent 38%,' + hexA(c, .38) + ' 38%,' + hexA(c, .38) + ' 92%,transparent 92%)}';
  });
  css +=
    'body.hm-on #wk-slide-area .wk-slide,body.hm-on #wkfs-body .wk-slide{touch-action:none;-webkit-user-select:none;user-select:none;cursor:text}' +
    '#hm-bar{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:9800;display:none;align-items:center;gap:8px;' +
      'padding:8px 12px;border-radius:28px;background:rgba(32,24,18,.88);box-shadow:0 4px 16px rgba(0,0,0,.3)}' +
    'body.hm-on #hm-bar{display:flex}' +
    'body.hm-on.v56-proj-open #hm-bar{bottom:96px}' +
    '#hm-bar .hm-sw,#hm-pop .hm-sw{width:34px;height:34px;border-radius:50%;border:3px solid transparent;cursor:pointer;padding:0}' +
    '#hm-bar .hm-sw.on{border-color:#fff;box-shadow:0 0 0 2px rgba(0,0,0,.4)}' +
    '#hm-bar .hm-tx,#hm-pop .hm-tx{font:inherit;font-size:14px;color:#fff;background:rgba(255,255,255,.14);border:0;border-radius:18px;padding:8px 12px;cursor:pointer;min-height:36px}' +
    '#hm-pv{position:fixed;inset:0;pointer-events:none;z-index:9790}' +
    '#hm-pv div{position:fixed;border-radius:2px;mix-blend-mode:multiply}' +
    'body.dark-mode #hm-pv div{mix-blend-mode:screen}' +
    '#hm-pop{position:fixed;z-index:9810;display:none;align-items:center;gap:6px;padding:6px 8px;border-radius:22px;background:rgba(32,24,18,.92);box-shadow:0 4px 14px rgba(0,0,0,.3)}' +
    '#hm-pop .hm-sw{width:28px;height:28px}' +
    '.hm-btn.on{background:#c0392b !important;color:#fff !important;border-color:#c0392b !important}';
  var stEl = document.createElement('style'); stEl.id = 'hlmark-css'; stEl.textContent = css;
  document.head.appendChild(stEl);
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }

  /* ── 資料 ── */
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]') || []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) { } }
  function curLesson() { return typeof wkKey !== 'undefined' ? String(wkKey || '') : ''; }
  function curIdx() { return typeof wkIdx !== 'undefined' ? wkIdx : -1; }
  function curSig() {
    try { var s = wkSlides[wkIdx] || {}; return String(s.type || '') + '|' + String(s.title || s.label || '').slice(0, 30); } catch (e) { return ''; }
  }
  function marksHere() {
    var L = curLesson(), i = curIdx(), sg = curSig();
    return load().filter(function (m) { return m.lesson === L && m.idx === i && m.sig === sg; });
  }

  /* ── 本頁文字模型：.wk-slide 內可見文字節點（不含注音、圈號、本模組介面） ── */
  function model(slide) {
    var nodes = [], s = '', w = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) {
      var p = n.parentElement;
      if (!p || p.closest(SKIP)) continue;
      if (!vis(p)) continue;                 /* 藏起來的翻譯、未展開的說明等不算 */
      nodes.push({ n: n, a: s.length }); s += n.data;
    }
    return { nodes: nodes, s: s };
  }
  function vis(el) {
    if (el.checkVisibility) return el.checkVisibility({ visibilityProperty: true, opacityProperty: false });
    return el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  }
  function locate(md, m) {
    var s = md.s, best = -1, bs = -1, bd = 1e9, i = s.indexOf(m.text);
    while (i >= 0) {
      var sc = 0, pre = s.slice(Math.max(0, i - CTX), i), post = s.slice(i + m.text.length, i + m.text.length + CTX);
      for (var k = 1; k <= pre.length && k <= m.pre.length && pre.charAt(pre.length - k) === m.pre.charAt(m.pre.length - k); k++) sc++;
      for (k = 0; k < post.length && k < m.post.length && post.charAt(k) === m.post.charAt(k); k++) sc++;
      var d = Math.abs(i - m.off);
      if (sc > bs || (sc === bs && d < bd)) { best = i; bs = sc; bd = d; }
      i = s.indexOf(m.text, i + 1);
    }
    /* 前後文都對不上、而且很短（一兩個字）→ 寧可不標 */
    if (best >= 0 && bs === 0 && m.text.length <= 2 && (m.pre || m.post)) return -1;
    return best;
  }
  function wrapRange(md, a, b, m) {
    md.nodes.forEach(function (x) {
      var s0 = Math.max(a, x.a), e0 = Math.min(b, x.a + x.n.data.length);
      if (s0 >= e0) return;
      var node = x.n;
      if (e0 - x.a < node.data.length) node.splitText(e0 - x.a);
      if (s0 - x.a > 0) node = node.splitText(s0 - x.a);
      var sp = document.createElement('span'); sp.className = 'hm-m'; sp.dataset.id = m.id; sp.dataset.c = m.c;
      node.parentNode.insertBefore(sp, node); sp.appendChild(node);
    });
  }
  function slides() {
    return ['wk-slide-area', 'wkfs-body'].map(function (id) {
      var c = document.getElementById(id); return c && c.querySelector('.wk-slide');
    }).filter(Boolean);
  }
  function unwrapAll(slide, id) {
    slide.querySelectorAll(id ? '.hm-m[data-id="' + id + '"]' : '.hm-m').forEach(function (sp) {
      var p = sp.parentNode; while (sp.firstChild) p.insertBefore(sp.firstChild, sp); p.removeChild(sp); p.normalize();
    });
  }
  function applySlide(slide) {
    applying = true;
    try {
      unwrapAll(slide);
      marksHere().forEach(function (m) {
        var md = model(slide), a = locate(md, m);
        if (a >= 0) wrapRange(md, a, a + m.text.length, m);
      });
      slide.dataset.hmDone = '1';
    } finally { setTimeout(function () { applying = false; }, 0); }
  }
  function applyAll() { slides().forEach(applySlide); }

  /* 換頁、全螢幕重畫（很多外掛會晚一點再改內容）→ 等安靜下來再套 */
  var tmr = 0;
  function schedule() { clearTimeout(tmr); tmr = setTimeout(function () { slides().forEach(function (sl) { if (!sl.dataset.hmDone || !sl.querySelector('.hm-m') && marksHere().length) applySlide(sl); }); }, 120); }
  function watch() {
    ['wk-slide-area', 'wkfs-body'].forEach(function (id) {
      var c = document.getElementById(id); if (!c) return;
      new MutationObserver(function (list) {
        if (applying) return;
        for (var i = 0; i < list.length; i++) {
          var t = list[i].target;
          if (list[i].type === 'childList' && !(t.closest && t.closest('.hm-m'))) { schedule(); return; }
        }
      }).observe(c, { childList: true, subtree: true });
    });
  }

  /* ── 劃過去標記 ── */
  function activeSlideAt(el) {
    var sl = el && el.closest && el.closest('#wk-slide-area .wk-slide,#wkfs-body .wk-slide');
    return sl || null;
  }
  var drag = null, pv = null;
  function pvLayer() { if (!pv || !pv.isConnected) { pv = document.createElement('div'); pv.id = 'hm-pv'; pv.className = 'hm-ui'; document.body.appendChild(pv); } return pv; }
  function clearPv() { if (pv) pv.innerHTML = ''; }
  /* 逐字量位置（按下時量一次；劃線中版面不動）。不用瀏覽器的游標落點：有些課圈號、說明框會疊在字上，會抓錯字 */
  function measure(md) {
    var out = [], r = document.createRange();
    md.nodes.forEach(function (x) {
      for (var k = 0; k < x.n.data.length; k++) {
        if (/\s/.test(x.n.data.charAt(k))) continue;
        r.setStart(x.n, k); r.setEnd(x.n, k + 1);
        var q = r.getBoundingClientRect();
        if (q.width > 0 && q.height > 0) out.push({ i: x.a + k, l: q.left, r: q.right, t: q.top, b: q.bottom });
      }
    });
    return out;
  }
  /* 手指底下的字；沒有正好壓到字 → 同一行最近的字；都沒有 → -1 */
  function hit(cs, x, y) {
    var best = -1, bd = 1e9;
    for (var k = 0; k < cs.length; k++) {
      var c = cs[k];
      if (y < c.t || y > c.b) continue;
      var d = x < c.l ? c.l - x : x > c.r ? x - c.r : 0;
      if (d === 0) d = -1 / (1 + Math.abs(y - (c.t + c.b) / 2));     /* 疊在一起時取垂直中心最近的 */
      if (d < bd) { bd = d; best = c.i; }
    }
    return bd <= 40 ? best : -1;
  }
  function spanOf(md, i0, i1) {
    if (i0 < 0 || i1 < 0) return null;
    var a = Math.min(i0, i1), b = Math.max(i0, i1) + 1;
    while (a < b && /\s/.test(md.s.charAt(a))) a++;
    while (b > a && /\s/.test(md.s.charAt(b - 1))) b--;
    return b > a ? { md: md, a: a, b: b } : null;
  }
  function rangeOf(md, a, b) {
    var r = document.createRange(), sN = null, eN = null;
    md.nodes.forEach(function (x) {
      var L = x.n.data.length;
      if (!sN && a < x.a + L) { r.setStart(x.n, a - x.a); sN = 1; }
      if (!eN && b <= x.a + L) { r.setEnd(x.n, b - x.a); eN = 1; }
    });
    return sN && eN ? r : null;
  }
  function showPv(sp) {
    var L = pvLayer(); L.innerHTML = '';
    var r = sp && rangeOf(sp.md, sp.a, sp.b); if (!r) return;
    [].forEach.call(r.getClientRects(), function (q) {
      if (q.width < 1) return;
      var d = document.createElement('div');
      d.style.cssText = 'left:' + q.left + 'px;top:' + (q.top + q.height * .38) + 'px;width:' + q.width + 'px;height:' + (q.height * .54) + 'px;background:' + hexA(COLORS[color], .55);
      L.appendChild(d);
    });
  }

  function onDown(e) {
    if (!on || e.button > 0) return;
    if (e.target.closest && e.target.closest('.hm-ui,#hm-bar,#hm-pop')) return;
    var sl = activeSlideAt(e.target); if (!sl) return;
    hidePop();
    var md = model(sl), cs = measure(md);
    drag = { sl: sl, md: md, cs: cs, x: e.clientX, y: e.clientY, i0: hit(cs, e.clientX, e.clientY), moved: false, sp: null, tgt: e.target };
    e.preventDefault(); e.stopPropagation();
  }
  function onMove(e) {
    if (!drag) return;
    if (Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y) > 6) drag.moved = true;
    if (drag.moved) {
      if (drag.i0 < 0) drag.i0 = hit(drag.cs, e.clientX, e.clientY);    /* 從空白處開始劃 → 碰到第一個字當起點 */
      var i1 = hit(drag.cs, e.clientX, e.clientY);
      if (i1 >= 0) { drag.sp = spanOf(drag.md, drag.i0, i1); showPv(drag.sp); }
    }
    e.preventDefault(); e.stopPropagation();
  }
  function onUp(e) {
    if (!drag) return;
    var d = drag; drag = null; clearPv();
    e.preventDefault(); e.stopPropagation();
    if (!d.moved) {
      var hm = d.tgt.closest && d.tgt.closest('.hm-m');
      if (!hm && d.i0 >= 0) {                          /* 字上疊了別的東西 → 用量到的字找標記 */
        var at = d.md.nodes.filter(function (x) { return d.i0 >= x.a && d.i0 < x.a + x.n.data.length; })[0];
        hm = at && at.n.parentElement && at.n.parentElement.closest('.hm-m');
      }
      if (hm) showPop(hm.dataset.id, e.clientX, e.clientY);
      return;
    }
    var sp = d.sp; if (!sp) return;
    var m = {
      id: 'm' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      lesson: curLesson(), idx: curIdx(), sig: curSig(), c: color,
      text: sp.md.s.slice(sp.a, sp.b), pre: sp.md.s.slice(Math.max(0, sp.a - CTX), sp.a), post: sp.md.s.slice(sp.b, sp.b + CTX),
      off: sp.a, t: new Date().toISOString()
    };
    var all = load(); all.push(m); save(all);
    applyAll();
  }
  function swallow(e) {
    if (!on) return;
    if (e.target.closest && e.target.closest('.hm-ui,#hm-bar,#hm-pop')) return;
    if (activeSlideAt(e.target)) { e.preventDefault(); e.stopPropagation(); }
  }

  /* ── 點已標的字：換色／刪除 ── */
  var pop = null, popId = null;
  function hidePop() { if (pop) pop.style.display = 'none'; popId = null; }
  function showPop(id, x, y) {
    if (!pop) {
      pop = document.createElement('div'); pop.id = 'hm-pop'; pop.className = 'hm-ui';
      pop.innerHTML = Object.keys(COLORS).map(function (k) {
        return '<button type="button" class="hm-sw" data-k="' + k + '" style="background:' + COLORS[k] + '" aria-label="改成' + NAMES[k] + '色"></button>';
      }).join('') + '<button type="button" class="hm-tx" data-del="1">🗑 刪除</button>';
      pop.addEventListener('click', function (e) {
        var b = e.target.closest('button'); if (!b || !popId) return;
        var all = load(), m = all.filter(function (x) { return x.id === popId; })[0];
        if (b.dataset.del) all = all.filter(function (x) { return x.id !== popId; });
        else if (m) m.c = b.dataset.k;
        save(all); hidePop(); applyAll();
      });
      document.body.appendChild(pop);
    }
    popId = id; pop.style.display = 'flex';
    var w = pop.offsetWidth, h = pop.offsetHeight;
    pop.style.left = Math.max(8, Math.min(innerWidth - w - 8, x - w / 2)) + 'px';
    pop.style.top = (y - h - 16 < 8 ? y + 20 : y - h - 16) + 'px';
  }

  /* ── 色盤列 ── */
  var bar = document.createElement('div'); bar.id = 'hm-bar'; bar.className = 'hm-ui'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', '標記筆');
  bar.innerHTML = Object.keys(COLORS).map(function (k) {
    return '<button type="button" class="hm-sw' + (k === color ? ' on' : '') + '" data-k="' + k + '" style="background:' + COLORS[k] + '" aria-label="' + NAMES[k] + '色"></button>';
  }).join('') + '<button type="button" class="hm-tx" data-a="clear">本頁清除</button><button type="button" class="hm-tx" data-a="done">✓ 完成</button>';
  bar.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.dataset.k) { color = b.dataset.k; bar.querySelectorAll('.hm-sw').forEach(function (x) { x.classList.toggle('on', x === b); }); }
    else if (b.dataset.a === 'done') toggle(false);
    else if (b.dataset.a === 'clear') {
      var here = marksHere(); if (!here.length) return;
      if (!confirm('清除這一頁的 ' + here.length + ' 個標記？（四班共用，清掉就沒有了）')) return;
      var ids = here.map(function (m) { return m.id; });
      save(load().filter(function (m) { return ids.indexOf(m.id) < 0; })); applyAll();
    }
  });

  function toggle(v) {
    on = v === undefined ? !on : !!v;
    document.body.classList.toggle('hm-on', on);
    document.querySelectorAll('.hm-btn').forEach(function (b) { b.classList.toggle('on', on); });
    if (!on) { drag = null; clearPv(); hidePop(); }
  }
  window.hmToggle = toggle;
  window.hmReapply = applyAll;

  function addBtns() {
    var pj = document.querySelector('.wk-proj-btn:not(.spot-btn)');
    if (pj && !document.getElementById('hm-btn-n')) {
      var b = document.createElement('button'); b.type = 'button'; b.id = 'hm-btn-n';
      b.className = 'wk-proj-btn hm-btn'; b.textContent = '🖍 標記筆'; b.title = '標記筆（劃過文字永久保留）';
      b.onclick = function () { toggle(); };
      var after = document.getElementById('spot-btn-n') || pj;
      after.parentNode.insertBefore(b, after.nextSibling);
    }
    var cb = document.querySelector('#wk-fullscreen .wkfs-ctrl-btns');
    if (cb && !document.getElementById('hm-btn-f')) {
      var f = document.createElement('button'); f.type = 'button'; f.id = 'hm-btn-f';
      f.className = 'wkfs-ctrl-btn hm-btn'; f.textContent = '🖍'; f.title = '標記筆';
      f.onclick = function () { toggle(); };
      cb.appendChild(f);
    }
  }
  function boot() {
    document.body.appendChild(bar);
    addBtns(); watch(); schedule();
    document.addEventListener('pointerdown', onDown, true);
    document.addEventListener('pointermove', onMove, true);
    document.addEventListener('pointerup', onUp, true);
    document.addEventListener('pointercancel', function () { drag = null; clearPv(); }, true);
    ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend', 'contextmenu'].forEach(function (t) { document.addEventListener(t, swallow, { capture: true, passive: false }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && on) { toggle(false); e.preventDefault(); e.stopImmediatePropagation(); } }, true);
    document.addEventListener('pointerdown', function (e) { if (pop && popId && !(e.target.closest && e.target.closest('#hm-pop'))) { if (!on || !activeSlideAt(e.target)) hidePop(); } }, true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/165_layoutfix-js.js ════ */
try {
/* 版面小修（2026-10-09 老師）
   ① 頁碼浮框（.tp-page「課本 P.44」）一般畫面捲到最上面時壓到右上「高職／高中」切換鍵：
      標題列還看得到、而且跟頁碼同高時 → 寬畫面移到切換鍵左邊；窄畫面（≤820）移到標題列下方。全螢幕不動。
   ② 左下角版本號（#v88-ver，fixed）在手機壓到投影框 → 改放標題列副標後面的小字（不再浮動）。
   ③ 側欄課次（部定14篇／選讀古文／白話文）字級固定小字，不跟著 A−／A+ 變（不用給學生看）。
   ④ 手機（寬 ≤600）：投影框內的寬表格把整頁撐寬（例：〈師說〉辨字頁 429px）→ 手機瀏覽器整頁縮小、
      固定位置的面板跟著變大、關閉鍵跑到螢幕外拉不到 → 讓課文欄與投影框不超過畫面寬；還是比畫面寬的內容改成可左右滑動；
      面板高度不超過螢幕、可捲動。
   ⑤ 手機不提供字級調整（A−／A+、顯示設定的字體大小、全螢幕 A−／A+ 都藏），字級固定 15px；平板、電腦照舊。
   自帶 <style id="layoutfix-css">，不改任何既有模組。 */
(function () {
  var PHONE = '(max-width:600px)';
  var st = document.createElement('style'); st.id = 'layoutfix-css';
  st.textContent =
    /* ① */
    '#tab-wenxue .tp-page,#tab-wenxue .wks-book-page{top:var(--lf-tp-top,58px) !important;right:var(--lf-tp-right,24px) !important}' +
    '@media (max-width:820px){#tab-wenxue .tp-page,#tab-wenxue .wks-book-page{top:var(--lf-tp-top,52px) !important;right:var(--lf-tp-right,12px) !important}}' +
    /* ② */
    '#v88-ver.lf-inline{position:static !important;display:inline-block !important;margin-left:10px;font-size:11px !important;opacity:.6;' +
      'left:auto !important;bottom:auto !important;background:none !important;border:0 !important;padding:0 !important;box-shadow:none !important;color:inherit !important}' +
    /* ③ */
    '.wenxue-sidebar .wenxue-nav-item{font-size:13px !important}' +
    '.wenxue-sidebar .wenxue-sidebar-title{font-size:10px !important}' +
    /* ④ */
    '@media ' + PHONE + '{' +
      '.wenxue-layout>*,#wk-slide-area,#wk-slide-area>.wk-slide{min-width:0 !important;max-width:100% !important;box-sizing:border-box}' +
      '#wk-slide-area>.wk-slide{flex:1 1 auto}' +
      /* 還是比畫面寬的內容（義辨表、結構表、動畫頁、答案頁…）→ 可左右滑動看完，不再被切掉 */
      '#wk-slide-area>.wk-slide,#wk-slide-area .jy-scroll,#wk-slide-area .v75-rv,#wk-slide-area .v74-rv{overflow-x:auto !important;-webkit-overflow-scrolling:touch}' +
      '#cls-panel,#display-panel,#nq2{max-width:100vw !important;max-height:100dvh !important;overflow-y:auto !important;box-sizing:border-box}' +
    '}' +
    /* ⑤ */
    '@media ' + PHONE + '{' +
      ':root{--base-size:15px !important;--slider-base-size:15px !important}' +
      '.site-font-ctrl,#wk-fullscreen .wkfs-ctrl-btn[onclick^="wkFont"],#display-panel .lf-font-row{display:none !important}' +
    '}';
  document.head.appendChild(st);

  /* ① 頁碼避開標題列 */
  var raf = 0;
  function placePage() {
    raf = 0;
    var root = document.documentElement, ctl = document.querySelector('.site-controls'), hd = document.querySelector('.site-header');
    var top = '', right = '';
    if (ctl && hd) {
      var narrow = innerWidth <= 820, pTop = narrow ? 52 : 58, pH = 30;
      var c = ctl.getBoundingClientRect(), h = hd.getBoundingClientRect();
      if (c.bottom > pTop - 4 && c.top < pTop + pH) {                 /* 標題列的按鈕還在頁碼那一帶 */
        if (narrow) top = Math.round(h.bottom + 6) + 'px';
        else right = Math.round(innerWidth - c.left + 10) + 'px';
      }
    }
    root.style.setProperty('--lf-tp-top', top || (innerWidth <= 820 ? '52px' : '58px'));
    root.style.setProperty('--lf-tp-right', right || (innerWidth <= 820 ? '12px' : '24px'));
  }
  function sched() { if (!raf) raf = requestAnimationFrame(placePage); }
  addEventListener('scroll', sched, { passive: true });
  addEventListener('resize', sched);

  /* ② 版本號移到標題列 */
  function moveVer() {
    var v = document.getElementById('v88-ver'), sub = document.querySelector('.site-header .site-sub');
    if (v && sub && v.parentNode !== sub) { sub.appendChild(v); v.classList.add('lf-inline'); }
  }
  /* ⑤ 顯示設定裡「字體大小」那一列加記號（手機藏起來） */
  function markFontRow() {
    document.querySelectorAll('#display-panel .display-setting').forEach(function (d) {
      if (/字體大小/.test(d.textContent)) d.classList.add('lf-font-row');
    });
  }
  function boot() {
    moveVer(); markFontRow(); placePage();
    setTimeout(moveVer, 500); setTimeout(moveVer, 2000);   /* 版本號是別的外掛晚一點才建的 */
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/166_notefs-scale-js.js ════ */
try {
/* V129：注釋側欄字級跟著課文等比例縮放。
   原因：047（v61）的注釋字級滑桿是固定 px（預設 30px），當初為全螢幕投影設計（全螢幕課文也是 30px）；
   一般畫面課文只有約 21px，打開注釋欄字反而比課文大很多（老師 10/15 回報）。
   做法：不改 047／046，滑桿數字仍代表「課文 30px 時的注釋字級」；
   一般畫面（#wk-slide-area）與全螢幕（#wkfs-body）各自量課文字級，寫入 --v129-nfs（＝滑桿值 × 課文字級 ÷ 30）。
   補充卡、「總」字卡不在這兩個容器內，照舊用滑桿原值。 */
(function () {
  var REF = 30, MIN = 14;
  function slider() {
    var v = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--v61-nfs'));
    return v || REF;
  }
  function textSize(box) {
    var t = box.querySelector('.tp-text');
    return t ? parseFloat(getComputedStyle(t).fontSize) : 0;
  }
  function apply() {
    var s = slider();
    ['wk-slide-area', 'wkfs-body'].forEach(function (id) {
      var box = document.getElementById(id); if (!box) return;
      var ts = textSize(box); if (!ts) return;
      var v = Math.max(MIN, Math.round(s * ts / REF * 10) / 10) + 'px';
      if (box.style.getPropertyValue('--v129-nfs') !== v) box.style.setProperty('--v129-nfs', v);
    });
  }
  var pend = 0;
  function soon() { clearTimeout(pend); pend = setTimeout(apply, 60); }
  /* 換頁、開關全螢幕、A−／A+、拖滑桿、視窗大小改變都重算 */
  document.addEventListener('input', soon, true);
  document.addEventListener('click', soon, true);
  window.addEventListener('resize', soon);
  if (window.MutationObserver) {
    var mo = new MutationObserver(soon);
    var watch = function () {
      ['wk-slide-area', 'wkfs-body'].forEach(function (id) { var el = document.getElementById(id); if (el && !el.__v129) { el.__v129 = 1; mo.observe(el, { childList: true }); } });
      mo.observe(document.documentElement, { attributes: true, attributeFilter: ['style', 'class'] });
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { watch(); soon(); }); else { watch(); soon(); }
  }
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/167_galaxy-ui-js.js ════ */
try {
/* V130：介面零件動畫的觸發（樣式見 155_galaxy-ui-css.css）。只加 class／插裝飾用的點點，不讀寫任何資料。
   ④ 作業完成格：080 點一下會整張表重畫，所以先記下點的是哪一格（data-v84），重畫後替那格加 .v130-just 播一次動畫。
   ⑤ 同步中：122 只改「同步中…」的文字，這裡看到這幾個字就在旁邊插墨點，不是同步中就拿掉。 */
(function () {
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('#v84-hw button.v84-c[data-v84]');
    if (!b) return;
    var key = b.getAttribute('data-v84');
    setTimeout(function () {
      var nb = document.querySelector('#v84-hw button.v84-c[data-v84="' + (window.CSS && CSS.escape ? CSS.escape(key) : key) + '"]');
      if (!nb || nb === b) return;   /* 沒重畫（例如取消時按了「取消」）就不播 */
      nb.classList.add('v130-just');
      setTimeout(function () { nb.classList.remove('v130-just'); }, 600);
    }, 0);
  }, true);

  /* ② 段落頁籤水波＋③ 大按鈕下陷：pointerdown 加 .v130-press，放開／取消／滑出就拿掉。手指、滑鼠、Apple Pencil 都會觸發。 */
  var PRESS = '.wk-sec-btn, .wk-control-bar .wk-proj-btn';
  document.addEventListener('pointerdown', function (e) {
    var b = e.target.closest && e.target.closest(PRESS);
    if (!b) return;
    b.classList.add('v130-press');
    if (b.classList.contains('wk-sec-btn')) {
      var r = b.getBoundingClientRect(), w = document.createElement('span');
      w.className = 'v130-wave'; w.style.left = (e.clientX - r.left) + 'px'; w.style.top = (e.clientY - r.top) + 'px';
      b.appendChild(w); setTimeout(function () { if (w.parentNode) w.parentNode.removeChild(w); }, 600);
    }
    var up = function () {
      setTimeout(function () { b.classList.remove('v130-press'); }, 60);
      ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) { b.removeEventListener(t, up); });
    };
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (t) { b.addEventListener(t, up); });
  }, true);

  var SEL = '.v107-st, .sy-row > b', queued = false;
  function ink() {
    queued = false;
    var els = document.querySelectorAll(SEL);
    for (var i = 0; i < els.length; i++) {
      var el = els[i], busy = /^同步中/.test(el.textContent || ''), nx = el.nextElementSibling;
      var has = nx && nx.classList.contains('v130-ink');
      if (busy && !has) {
        var s = document.createElement('span');
        s.className = 'v130-ink'; s.setAttribute('aria-hidden', 'true');
        s.innerHTML = '<i></i><i></i><i></i><i></i>';
        el.parentNode.insertBefore(s, el.nextSibling);
      } else if (!busy && has) nx.parentNode.removeChild(nx);
    }
  }
  function soon() { if (!queued) { queued = true; setTimeout(ink, 30); } }
  function start() {
    new MutationObserver(soon).observe(document.body, { childList: true, subtree: true, characterData: true });
    soon();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/168_v136-read-js.js ════ */
try {
/* V136 閱讀測驗「原文全螢幕」（老師 10/18：文言文閱讀測驗要有只顯示題目原文的全螢幕頁，專心講解文章）。
   ・對象：習作／A卷題組的 .aq-psg（內文 .aq-psgb）、補充講義左右版的 .hd-split-psg。
   ・只在「文言文」題幹加按鈕：文言虛詞比例高、白話常用字（的、了、們…）比例低。判斷時語譯（補充講義 .hd-note、習作／A卷的「語譯」展開區 details）不算。
   ・按鈕不改投影片順序（不新增頁），點了蓋一層全螢幕只顯示原文；✕ 或 Esc 關閉，A−／A+ 調字級。 */
(function () {
  'use strict';
  var WY = /[之乎者也矣焉哉曰其而於以則乃亦豈蓋夫兮爾吾汝矣邪耶]/g;
  var BH = /[的了們這那嗎呢很都沒]/g;
  /* 自動判斷不準的個別題幹（比對去標點後的開頭文字）：10/18 全課 80 頁題組逐一核對後指定 */
  var FORCE_ON = ['龍焙今年絕品'];                  /* 〈珍奶〉補充講義：蘇軾、黃庭堅茶詞（詞裡有「減了」） */
  var FORCE_OFF = ['統測試題精選作者', '主旨修正連鎖飲料'];   /* 〈論語選〉統測表格、〈珍奶〉習作公文 */
  function plain(el) {
    var c = el.cloneNode(true);
    c.querySelectorAll('.hd-note,details,.rd-fsbtn,.aq-psgh,.tp-gd,figcaption,.aq-imgtip').forEach(function (x) { x.remove(); });
    return (c.textContent || '').replace(/[\s　，。、；：「」『』！？（）()…—─,.\d]/g, '');
  }
  function isClassical(t) {
    if (t.length < 20) return false;
    var wy = (t.match(WY) || []).length, bh = (t.match(BH) || []).length;
    return bh / t.length < 0.012 && (wy / t.length >= 0.03 || bh === 0);   /* 詩詞虛詞少：完全沒有白話常用字也算 */
  }
  var scale = 1;
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  /* V136 二改（老師 10/18）：
     ① 標題＝題號＋頁碼：A卷「A卷 第 N 題」（同一篇題組「第 a～b 題」）、習作「習作 ＋小標」、補充講義「補充講義 ＋標題＋頁碼」。
     ② 一句一句排：原文一句、下面接該句語譯（不同顏色），語譯預設收起，點句子才顯示；上方「全部語譯」一次開關。
        語譯只用教材原有的：習作／A卷題幹內的「語譯」展開區、A卷的語譯欄（aQuiz.trans）、補充講義的「語譯：」說明。沒有語譯就只逐句列原文。
        原文與語譯句數不同時，依字數比例自動把相鄰句子合併對齊（1:1、2:1、1:2）。 */
  function curSlide() { return (typeof wkSlides !== 'undefined' && typeof wkIdx !== 'undefined') ? wkSlides[wkIdx] : null; }
  function label(src) {
    var sl = src.closest('.wk-slide'), sd = curSlide();
    if (sl && sl.classList.contains('wks-aq')) {
      if (sd && sd.type === 'aq' && sd.q) {
        var ns = [], i = wkIdx;
        while (i > 0 && wkSlides[i - 1].type === 'aq' && wkSlides[i - 1].q.psg === sd.q.psg) i--;
        for (; i < wkSlides.length && wkSlides[i].type === 'aq' && wkSlides[i].q.psg === sd.q.psg; i++) ns.push(wkSlides[i].q.n);
        return 'A卷　第 ' + (ns.length > 1 ? ns[0] + '～' + ns[ns.length - 1] : ns[0]) + ' 題';
      }
      var no = sl.querySelector('.aq-no'); return 'A卷　' + (no ? no.textContent.replace(/\s*\/.*$/, '') : '');
    }
    if (sl && sl.classList.contains('wks-work')) {
      var h = sl.querySelector('.wk-head'), ht = h ? h.textContent.replace(/[（(]每[題格][^）)]*[）)]/g, '').replace(/\s+/g, ' ').trim() : '';
      var m = /閱讀測驗.*$/.exec(ht); return '習作　' + (m ? m[0].replace(/\s+/g, '') : ht);
    }
    if (sl && sl.classList.contains('wks-hd2')) {
      var t = sl.querySelector('.hd-title'), pg = sl.querySelector('.hd-page');
      return '補充講義　' + (t ? t.textContent.replace(/[\s　]+/g, ' ').trim() : '') + (pg ? '　' + pg.textContent.replace(/^補充講義\s*/, '') : '');
    }
    return '原　文';
  }
  function transOf(src) {
    var d = src.querySelector('details');
    if (d) { var c = d.cloneNode(true); var s = c.querySelector('summary'); if (s) s.remove(); return c.textContent; }
    var sd = curSlide();
    if (sd && sd.type === 'aq' && sd.q && sd.q.trans && src.closest('.wks-aq')) return String(sd.q.trans).replace(/<br\s*\/?>/g, '\n').replace(/<[^>]+>/g, '');
    var sl = src.closest('.wk-slide'), hn = sl ? [].filter.call(sl.querySelectorAll('.hd-note'), function (x) { return /^\s*語譯/.test(x.textContent); }) : [];
    if (hn.length) return hn.map(function (x) { return x.textContent.replace(/^\s*語譯：?/, ''); }).join('');
    return '';
  }
  function sentences(t) {
    var out = [], buf = '', q = 0;
    t = String(t).replace(/[ \t\r\n　]+/g, '');
    for (var i = 0; i < t.length; i++) {
      var ch = t[i]; buf += ch;
      if (ch === '「' || ch === '『') q++; else if ((ch === '」' || ch === '』') && q > 0) q--;
      var end = /[。！？?!]/.test(ch) && !/[。！？?!」』）)]/.test(t[i + 1] || '');   /* 半形 ?! 也算句尾（〈世說〉A卷有半形問號） */
      if (/[」』）)]/.test(ch) && /[。！？?!]/.test(t[i - 1] || '') && !/[」』）)]/.test(t[i + 1] || '')) end = true;
      if (end) { out.push(buf); buf = ''; }
    }
    if (buf.replace(/[「」『』（）()…—]/g, '').length) out.push(buf);
    return out;
  }
  /* 依字數比例對齊（Gale–Church 簡化版）：回傳 [[原文句…], [語譯句…]] 的配對 */
  function align(A, B) {
    var la = A.map(function (s) { return s.length; }), lb = B.map(function (s) { return s.length; });
    var r = (lb.reduce(function (a, b) { return a + b; }, 0) || 1) / (la.reduce(function (a, b) { return a + b; }, 0) || 1);
    var n = A.length, m = B.length, INF = 1e9, D = [], P = [], i, j;
    for (i = 0; i <= n; i++) { D.push([]); P.push([]); for (j = 0; j <= m; j++) { D[i].push(INF); P[i].push(null); } }
    D[0][0] = 0;
    var moves = [[1, 1, 0], [2, 1, 0.35], [1, 2, 0.35], [1, 0, 1.2], [0, 1, 1.2]];   /* 1:0／0:1＝題幹後附的說明、選項等對不到語譯的句子，單獨列出不硬配 */
    for (i = 0; i <= n; i++) for (j = 0; j <= m; j++) {
      if (D[i][j] >= INF) continue;
      moves.forEach(function (mv) {
        var a = i + mv[0], b = j + mv[1]; if (a > n || b > m) return;
        var x = 0, y = 0, k; for (k = i; k < a; k++) x += la[k]; for (k = j; k < b; k++) y += lb[k];
        var c = D[i][j] + Math.abs(y - r * x) / (y + r * x + 1) + mv[2];
        if (c < D[a][b]) { D[a][b] = c; P[a][b] = [i, j]; }
      });
    }
    if (D[n][m] >= INF) return null;
    var pairs = []; i = n; j = m;
    while (i > 0 || j > 0) { var p = P[i][j]; pairs.unshift([A.slice(p[0], i), B.slice(p[1], j)]); i = p[0]; j = p[1]; }
    return pairs;
  }
  function open(src) {
    close();
    var box = document.createElement('div'); box.id = 'rd-fs';
    box.innerHTML = '<div class="rd-bar"><span class="rd-tt"></span><span class="rd-sp"></span>' +
      '<button type="button" data-a="t" class="rd-tall">全部語譯</button>' +
      '<button type="button" data-a="-">A−</button><button type="button" data-a="+">A+</button>' +
      '<button type="button" data-a="x">✕ 關閉</button></div><div class="rd-body"><div class="rd-txt"></div></div>';
    box.querySelector('.rd-tt').textContent = label(src);
    var txt = box.querySelector('.rd-txt');
    var c = src.cloneNode(true);
    c.querySelectorAll('.hd-note,details,.rd-fsbtn,.aq-psgh,.aq-imgtip,.tp-gd').forEach(function (x) { x.remove(); });
    var notes = [].map.call(c.querySelectorAll('.aq-src'), function (x) { x.remove(); return x.outerHTML; }).join('');
    c.querySelectorAll('br').forEach(function (x) { x.replaceWith('\n'); });
    /* 出處「（〈篇名〉）」「（《書名》）」之後的文字（選項說明、補充）不是原文：移到最下面附註，不拿去配語譯 */
    var raw = c.textContent, cut = raw.search(/[（(][〈《][^）)]{1,30}[〉》][^）)]{0,20}[）)]/), tail = '';
    if (cut > 20) {   /* 只有出處後面已經沒有文字、或接的是①②說明時才切；(甲)(乙)兩篇中間的出處不切 */
      var after = raw.slice(cut).replace(/^[（(][^）)]*[）)]/, '').replace(/^[\s　]+/, '');
      if (!after || /^[①-⑳]/.test(after)) { tail = raw.slice(cut); raw = raw.slice(0, cut); }
    }
    if (tail) notes = '<div class="aq-src">' + esc(tail.replace(/[ \t\r\n　]+/g, '')) + '</div>' + notes;
    raw = raw.replace(/^[\s　]*[^。！？]{0,40}下文[^。！？：]{0,30}：/, '');   /* 開頭的題目說明（如「小陳在閱讀完下文後……請選出正確的選項：」）不算原文 */
    var A = sentences(raw), tr = transOf(src), B = tr ? sentences(tr) : [];
    var pairs = (A.length && B.length) ? align(A, B) : null;
    if (!pairs) pairs = A.map(function (s) { return [[s], []]; });
    txt.innerHTML = pairs.map(function (p) {
      var t = p[1].join('');
      return '<div class="rd-pair' + (t ? ' has-t' : '') + '"><div class="rd-o">' + esc(p[0].join('')) + '</div>' +
        (t ? '<div class="rd-t">' + esc(t) + '</div>' : '') + '</div>';
    }).join('') + (notes ? '<div class="rd-notes">' + notes + '</div>' : '') +
      (B.length ? '' : '<div class="rd-none">（本篇教材沒有語譯）</div>');
    if (!B.length) box.querySelector('.rd-tall').style.display = 'none';
    box.style.setProperty('--rd-scale', scale);
    box.addEventListener('click', function (e) {
      var pr = e.target.closest && e.target.closest('.rd-pair.has-t');
      if (pr) { pr.classList.toggle('show'); return; }
      var a = e.target.getAttribute && e.target.getAttribute('data-a'); if (!a) return;
      if (a === 'x') return close();
      if (a === 't') {
        var all = box.querySelectorAll('.rd-pair.has-t'), on = [].some.call(all, function (x) { return !x.classList.contains('show'); });
        all.forEach(function (x) { x.classList.toggle('show', on); }); e.target.textContent = on ? '收起語譯' : '全部語譯'; return;
      }
      scale = Math.max(0.6, Math.min(1.8, scale + (a === '+' ? 0.1 : -0.1)));
      box.style.setProperty('--rd-scale', scale);
    });
    document.body.appendChild(box);
  }
  function close() { var b = document.getElementById('rd-fs'); if (b) b.remove(); }
  /* Esc 只關原文（捕獲階段先攔，不讓投影全螢幕跟著關）；方向鍵在原文頁不換投影片 */
  document.addEventListener('keydown', function (e) {
    if (!document.getElementById('rd-fs')) return;
    if (e.key === 'Escape') { close(); e.stopImmediatePropagation(); e.preventDefault(); }
    else if (/^Arrow(Left|Right)$|^PageUp$|^PageDown$/.test(e.key)) { e.stopImmediatePropagation(); }
  }, true);

  function mark(root) {
    if (!root) return;
    root.querySelectorAll('.aq-psg, .hd-split-psg').forEach(function (p) {
      if (p.getAttribute('data-rd') != null) return;
      var body = p.classList.contains('aq-psg') ? p.querySelector('.aq-psgb') : p;
      var t = body ? plain(body) : '', head = t.slice(0, 30);
      var ok = !!body && (FORCE_ON.some(function (k) { return head.indexOf(k) >= 0; }) ||
        (isClassical(t) && !FORCE_OFF.some(function (k) { return head.indexOf(k) >= 0; })));
      p.setAttribute('data-rd', ok ? '1' : '0');
      if (!ok) return;
      var b = document.createElement('button'); b.type = 'button'; b.className = 'rd-fsbtn'; b.textContent = '⛶ 原文全螢幕';
      b.addEventListener('click', function (e) { e.stopPropagation(); open(body); });
      var h = p.querySelector('.aq-psgh');
      if (h) h.insertAdjacentElement('afterend', b); else p.insertBefore(b, p.firstChild);
    });
    /* V136（老師 10/18）：A卷題號像頁碼一樣浮在左上角，往下捲也看得到第幾題 */
    root.querySelectorAll('.wks-aq').forEach(function (sl) {
      if (sl.querySelector(':scope > .aq-float')) return;
      var no = sl.querySelector('.aq-no'); if (!no) return;
      var f = document.createElement('div'); f.className = 'aq-float';
      f.textContent = 'A卷　' + no.textContent.replace(/\s*\/.*$/, '').trim();
      sl.insertBefore(f, sl.firstChild);
      dragable(f);
    });
    placeFloat(); updFloat();
  }
  /* 老師 10/18：題號浮框可以拖到任何位置；一般畫面、全螢幕各記一個位置（只存在這台瀏覽器，鍵名 v136_aqf_pos） */
  function posKey(f) { return f.closest('#wkfs-body') ? 'fs' : 'n'; }
  function loadPos() { try { return JSON.parse(localStorage.getItem('v136_aqf_pos') || '{}') || {}; } catch (e) { return {}; } }
  function savePos(o) { try { localStorage.setItem('v136_aqf_pos', JSON.stringify(o)); } catch (e) {} }
  function applyPos(f) {
    var p = loadPos()[posKey(f)]; if (!p) return;
    f.style.left = Math.max(0, Math.min(innerWidth - 60, p.x)) + 'px'; f.style.top = Math.max(0, Math.min(innerHeight - 30, p.y)) + 'px';
  }
  function dragable(f) {
    applyPos(f);
    var sx, sy, ox, oy, on = false;
    f.addEventListener('pointerdown', function (e) {
      on = true; f.classList.add('drag'); f.setPointerCapture(e.pointerId);
      var r = f.getBoundingClientRect(); sx = e.clientX; sy = e.clientY; ox = r.left; oy = r.top; e.preventDefault(); e.stopPropagation();
    });
    f.addEventListener('pointermove', function (e) {
      if (!on) return;
      f.style.left = Math.max(0, Math.min(innerWidth - f.offsetWidth, ox + e.clientX - sx)) + 'px';
      f.style.top = Math.max(0, Math.min(innerHeight - f.offsetHeight, oy + e.clientY - sy)) + 'px';
    });
    function end(e) {
      if (!on) return; on = false; f.classList.remove('drag');
      var o = loadPos(); o[posKey(f)] = { x: parseFloat(f.style.left) || 0, y: parseFloat(f.style.top) || 0 }; savePos(o);
      document.querySelectorAll('.aq-float').forEach(function (g) { if (g !== f) applyPos(g); });
    }
    f.addEventListener('pointerup', end); f.addEventListener('pointercancel', end);
    f.addEventListener('click', function (e) { e.stopPropagation(); });
  }
  /* 一般畫面：浮框對齊投影框左緣（側欄寬度會變）；全螢幕固定左上 */
  function placeFloat() {
    var a = document.getElementById('wk-slide-area'); if (!a) return;
    var r = a.getBoundingClientRect(); document.documentElement.style.setProperty('--aqf-left', Math.max(8, Math.round(r.left) + 8) + 'px');
  }
  window.addEventListener('resize', placeFloat);
  /* 題目本身的標題列（「A卷 第 N 題 / 共 M 題」）還看得到時不顯示浮框，捲出畫面後才出現（避免重複、也不壓到網站標題列） */
  function updFloat() {
    document.querySelectorAll('.aq-float').forEach(function (f) {
      var sl = f.parentElement, top = sl && sl.querySelector('.as-top'); if (!top) return;
      var fs = sl.closest('#wkfs-body'), lim = fs ? fs.getBoundingClientRect().top : 0;
      f.classList.toggle('on', top.getBoundingClientRect().bottom < lim + 4);
    });
  }
  document.addEventListener('scroll', function () { requestAnimationFrame(updFloat); }, true);
  function scan() { mark(document.getElementById('wk-slide-area')); mark(document.getElementById('wkfs-body')); }
  if (window.MutationObserver) {
    var mo = new MutationObserver(function () { clearTimeout(mo.t); mo.t = setTimeout(scan, 60); });
    ['wk-slide-area', 'wkfs-body'].forEach(function (id) { var el = document.getElementById(id); if (el) mo.observe(el, { childList: true, subtree: true }); });
  }
  scan();
  window.V136READ = { isClassical: function (el) { return isClassical(plain(el)); }, open: open, close: close };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/169_v136-ui-js.js ════ */
try {
/* V136 介面調整（老師 10/18）
   ① 基礎練習、進階練習移到「賞析」後面（包一層 wkParseSlides，本檔載入最晚＝實際生效的最外層）。
      只搬 iquiz／iadv 這一段，搬完把「習作答案總覽」的 slideIdx 依新位置重新對應（不然點答案會跳錯頁）。
   ② 右側「註釋小考」邊籤收進「班級進度」面板（面板標題列多一個「📝 註釋小考」鈕，功能同原邊籤）。
   ③ 全螢幕「關閉浮框」從右側邊籤移到下方左右換頁列；換頁列變矮（樣式在 159_v136-ui-css）。
   ④ 〈論語選〉課名的破折號只顯示成「——」（佔兩格）。課名本身是資料的鑰匙（班級進度、日曆、小考紀錄都用它存），一個字都不改，只改畫面上的字。 */
(function () {
  'use strict';
  /* ① */
  if (typeof wkParseSlides === 'function') {
    var _parse = wkParseSlides;
    wkParseSlides = function (key) {
      var slides = _parse.apply(this, arguments);
      var ex = slides.map(function (s, i) { return (s.type === 'iquiz' || s.type === 'iadv') ? i : -1; }).filter(function (i) { return i >= 0; });
      var app = -1; slides.forEach(function (s, i) { if (s.type === 'info' && s.kind === 'appreciation') app = i; });
      if (!ex.length || app < 0 || ex[0] < app) return slides;
      for (var k = 1; k < ex.length; k++) if (ex[k] !== ex[k - 1] + 1) return slides;   /* 不連續就不動（保險） */
      var order = slides.map(function (s, i) { return i; }).filter(function (i) { return ex.indexOf(i) < 0; });
      var at = order.indexOf(app) + 1;
      order = order.slice(0, at).concat(ex, order.slice(at));
      var pos = {}; order.forEach(function (oldI, newI) { pos[oldI] = newI; });
      var out = order.map(function (i) { return slides[i]; });
      out.forEach(function (s) { if (s.type === 'work_answers') (s.targets || []).forEach(function (t) { if (t.slideIdx != null && pos[t.slideIdx] != null) t.slideIdx = pos[t.slideIdx]; }); });
      return out;
    };
  }

  /* ② */
  function nqInPanel() {
    var head = document.querySelector('#cls-panel .cls-head'), x = head && head.querySelector('.cls-x');
    if (!head || head.querySelector('.v136-nq')) return;
    var b = document.createElement('button'); b.type = 'button'; b.className = 'v136-nq'; b.textContent = '📝 註釋小考';
    b.onclick = function () {
      if (typeof clsToggle === 'function' && document.getElementById('cls-panel').classList.contains('open')) clsToggle();
      var t = document.getElementById('note-quiz-tab');
      if (t && typeof t.onclick === 'function') t.onclick(); else if (typeof nqToggle === 'function') nqToggle();
    };
    head.insertBefore(b, x);
  }

  /* ③ */
  function blueToFooter() {
    var b = document.getElementById('tp-close-blue-tab'), f = document.querySelector('#wk-fullscreen .wkfs-footer');
    if (!b || !f || b.parentNode === f) return;
    b.textContent = '✕ 浮框';
    f.appendChild(b);
  }

  /* ④ */
  var KEY_DASH = /(論語選)—(子路)/g;
  function fixDash(root) {
    if (!root) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, hit = [];
    while ((n = w.nextNode())) if (n.data.indexOf('選—子') >= 0 && !(n.parentElement && n.parentElement.closest('textarea,script,style,[contenteditable]'))) hit.push(n);
    hit.forEach(function (t) { t.data = t.data.replace(KEY_DASH, '$1——$2'); });
    root.querySelectorAll && root.querySelectorAll('option').forEach(function (o) { if (o.text.indexOf('選—子') >= 0) o.text = o.text.replace(KEY_DASH, '$1——$2'); });
  }
  function fixAll() { fixDash(document.body); }

  function init() { nqInPanel(); blueToFooter(); fixAll(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
  if (window.MutationObserver) {
    var t = 0, mo = new MutationObserver(function () { clearTimeout(t); t = setTimeout(fixAll, 80); });
    mo.observe(document.body, { childList: true, subtree: true, characterData: false });
  }
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/170_v137-ink-js.js ════ */
try {
/* V137 投影畫筆改版（老師 10/18）
   ① 全螢幕時畫筆工具列一直固定在下方換頁列（不用先點右側「畫筆」邊籤）。
   ② 新增「觸控筆」模式＝可以點頁面上的互動按鈕（畫布不攔觸控）；一進全螢幕預設就是觸控筆。
   ③ 直接點下方顏色（或螢光筆、橡皮擦）就進入畫筆模式，顏色預設「細」（163 已把顏色筆固定細＝3）。
      切回觸控筆時筆跡保留（舊版關閉畫筆會清除本頁，改由「清除」鈕清除）。
   ④ 筆跡跟著頁面捲動：點的座標改記「頁面內容座標」（加上投影片目前的捲動量），重畫時扣回捲動量；
      往下滑時筆跡貼著原本的文字往上移，移出畫面就看不到（畫布本身只蓋投影內容區）。
      舊格式的點（只有 x、y 比例）照舊畫在固定位置。字級改變後版面重排，筆跡位置不會跟著重排。
   實作：以 window.* 重新指定 015_main 的 wkInkPoint／wkInkRedraw（實際生效版本＝本檔），
        包 wkInkColor／wkInkHighlighter（在 036、163 的包裝外層），不改舊檔。 */
(function () {
  'use strict';
  var st = window.wkInkState; if (!st) return;
  function $(id) { return document.getElementById(id); }
  function fsOpen() { var f = $('wk-fullscreen'); return !!f && getComputedStyle(f).display !== 'none'; }
  function scrollers() { return [document.querySelector('#wkfs-body .wk-slide'), $('wkfs-body')].filter(Boolean); }
  function scrollXY() { var x = 0, y = 0; scrollers().forEach(function (s) { x += s.scrollLeft || 0; y += s.scrollTop || 0; }); return { x: x, y: y }; }

  /* ④ 座標：內容座標 cx、cy（像素）；同時給 x、y 比例（相容 015 去重與 036 橡皮擦，重畫時會更新成目前位置） */
  window.wkInkPoint = function (e) {
    var r = st.canvas.getBoundingClientRect(), s = scrollXY();
    var px = e.clientX - r.left, py = e.clientY - r.top;
    return { cx: px + s.x, cy: py + s.y, x: px / Math.max(1, r.width), y: py / Math.max(1, r.height) };
  };
  window.wkInkRedraw = function () {
    var c = st.canvas, ctx = st.ctx; if (!c || !ctx) return;
    var r = c.getBoundingClientRect(), s = scrollXY();
    ctx.clearRect(0, 0, r.width, r.height);
    (wkInkCurrentStrokes() || []).forEach(function (k) {
      var P = k.points; if (!P || P.length < 2) return;
      ctx.beginPath(); ctx.strokeStyle = k.color || '#c0392b'; ctx.lineWidth = k.size || 3;
      P.forEach(function (p, i) {
        var X, Y;
        if (p.cx != null) { X = p.cx - s.x; Y = p.cy - s.y; p.x = X / Math.max(1, r.width); p.y = Y / Math.max(1, r.height); }
        else { X = p.x * r.width; Y = p.y * r.height; }
        if (i) ctx.lineTo(X, Y); else ctx.moveTo(X, Y);
      });
      ctx.stroke();
    });
  };
  document.addEventListener('scroll', function (e) {
    if (!fsOpen() || !e.target || !e.target.closest || !e.target.closest('#wkfs-body')) return;
    window.wkInkRedraw();   /* 直接重畫（捲動事件本來就跟畫面更新同步；requestAnimationFrame 在背景分頁不會跑） */
  }, true);

  /* ②③ 模式：pen＝畫（畫布攔觸控）；不是 pen＝觸控筆（可點按鈕）。不呼叫 wkInkToggle（它關閉時會清除本頁） */
  function setPen(on) {
    var layer = $('wk-ink-layer'); if (!layer) return;
    st.active = !!on; if (!on) st.drawing = false;
    layer.classList.toggle('active', !!on);
    var tb = $('v137-touch'); if (tb) tb.classList.toggle('on', !on);
    if (!on) document.querySelectorAll('.wk-ink-color').forEach(function (x) { x.classList.remove('on'); });
    if (!on) { var er = $('wk-ink-eraser'); if (er && er.classList.contains('on')) er.click(); }
    fit();
  }
  /* 全螢幕時畫記層放到 body 最上層（蓋過浮框，觸控筆模式畫布不攔觸控），畫布只蓋標題列～換頁列之間 */
  function place(open) {
    var layer = $('wk-ink-layer'); if (!layer) return;
    if (open) {
      if (layer.parentNode !== document.body) { layer._v137p = layer.parentNode; layer._v137n = layer.nextSibling; document.body.appendChild(layer); }
      layer.style.position = 'fixed'; layer.style.inset = '0'; layer.style.zIndex = '12500';
      document.body.classList.add('v137-fs');
    } else {
      if (layer._v137p) { try { layer._v137p.insertBefore(layer, layer._v137n); } catch (e) { layer._v137p.appendChild(layer); } layer._v137p = null; }
      layer.style.position = ''; layer.style.inset = ''; layer.style.zIndex = '';
      document.body.classList.remove('v137-fs');
    }
  }
  function fit() {
    var fs = $('wk-fullscreen'), canvas = $('wk-ink-canvas'), layer = $('wk-ink-layer'); if (!fs || !canvas || !layer) return;
    if (fsOpen()) {
      var head = fs.querySelector('.wkfs-header'), foot = fs.querySelector('.wkfs-footer');
      var top = head ? head.getBoundingClientRect().bottom : 0, f = foot ? foot.getBoundingClientRect().top : innerHeight;
      canvas.style.top = top + 'px'; canvas.style.bottom = 'auto'; canvas.style.height = Math.max(1, f - top) + 'px';
      layer.style.setProperty('--v56-foot-h', Math.max(32, Math.round(innerHeight - f)) + 'px');
    }
    if (typeof wkInkSetupCanvas === 'function') wkInkSetupCanvas();
  }

  function initBar() {
    var left = $('wk-ink-grp-l'); if (!left || $('v137-touch')) return;
    var t = document.createElement('button'); t.type = 'button'; t.id = 'v137-touch'; t.className = 'wk-ink-btn on'; t.textContent = '👆 觸控筆';
    t.title = '觸控筆：可以點頁面上的按鈕；點右邊顏色就能畫';
    t.addEventListener('click', function () { setPen(false); });
    left.insertBefore(t, left.firstChild);
    var c = document.createElement('button'); c.type = 'button'; c.id = 'v137-clear'; c.className = 'wk-ink-btn'; c.textContent = '清除';
    c.title = '清除本頁筆跡'; c.addEventListener('click', function () { if (typeof wkInkClear === 'function') wkInkClear(); });
    left.appendChild(c);
    var er = $('wk-ink-eraser'); if (er) er.addEventListener('click', function () { if (er.classList.contains('on') && !st.active) setPen(true); });
  }
  function wrapColors() {
    ['wkInkColor', 'wkInkHighlighter'].forEach(function (n) {
      var f = window[n]; if (typeof f !== 'function' || f._v137) return;
      window[n] = function () { if (!st.active) setPen(true); return f.apply(this, arguments); };
      window[n]._v137 = true;
    });
  }

  /* 進出全螢幕：用 #wk-fullscreen 的 style 變化偵測（wkOpenProj／wkCloseProj 都改 display） */
  var wasOpen = false;
  function sync() {
    var open = fsOpen();
    if (open === wasOpen) return; wasOpen = open;
    place(open);
    setPen(false);              /* 進全螢幕預設觸控筆；離開時也回觸控筆 */
    setTimeout(fit, 60);
  }
  function boot() {
    initBar(); wrapColors();
    var f = $('wk-fullscreen');
    if (f && window.MutationObserver) new MutationObserver(sync).observe(f, { attributes: true, attributeFilter: ['style', 'class'] });
    window.addEventListener('resize', function () { if (fsOpen()) fit(); });
    /* 換頁後重畫（筆跡依頁分開存，捲動量歸零） */
    if (typeof wkRenderCurrent === 'function' && !wkRenderCurrent._v137) {
      var r0 = wkRenderCurrent;
      wkRenderCurrent = function () { var v = r0.apply(this, arguments); setTimeout(function () { if (fsOpen()) window.wkInkRedraw(); }, 80); return v; };
      wkRenderCurrent._v137 = true;
    }
    sync();
  }
  /* 036 的工具列重組、163 的包裝都在 DOMContentLoaded 之後，要排在它們後面 */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 30); });
  else setTimeout(boot, 30);
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/171_v155-b1l7-10-js.js ════ */
try {
(function () {
  /* V155：第一冊 L07～L10 上架（資料在 data/lessons/30～32.js；〈桃花源記〉07.js 補技高版課文）
     - 選讀古文：〈樂府詩選—長干行〉排在〈論語選〉後面（第一冊 L07）。
     - 白話文：〈茫茫人海中的一名女孩〉（L08）、〈極短篇小說選〉（L10）排在〈火車線〉後面；封面補「第一冊 第 N 課」。 */
  function after(arr, prev, keys) {
    keys.forEach(function (k) { var i = arr.indexOf(k); if (i >= 0) arr.splice(i, 1); });
    var at = arr.indexOf(prev);
    arr.splice.apply(arr, [at < 0 ? arr.length : at + 1, 0].concat(keys));
  }
  after(WK_EXTRA, '論語選—子路曾皙冉有公西華侍坐', ['樂府詩選—長干行']);
  after(WK_PROSE, '臺灣最美麗的火車線', ['茫茫人海中的一名女孩', '極短篇小說選']);

  var NO = { '茫茫人海中的一名女孩': '第一冊　第 8 課', '極短篇小說選': '第一冊　第 10 課' };
  var _prev = wkRenderSlideHTML;
  wkRenderSlideHTML = function (slide) {
    var h = _prev.apply(this, arguments);
    if (slide && slide.type === 'cover' && NO[slide.key] && h.indexOf('wks-pcover') >= 0 && h.indexOf('pc-no') < 0) {
      h = h.replace('<span class="pc-cat">白話文選讀</span>', '<span class="pc-cat">白話文選讀</span><span class="pc-no">' + NO[slide.key] + '</span>');
    }
    return h;
  };
})();
} catch (e) { setTimeout(function () { throw e; }); }
/* ════ src/js/136_v113-ver-js.js ════ */
try {

(function () {
  window.APP_VERSION = 'V157';
  function setVer() { var d = document.getElementById('v88-ver'); if (d) d.textContent = window.APP_VERSION; }
  setVer(); if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', setVer);
})();
} catch (e) { setTimeout(function () { throw e; }); }
