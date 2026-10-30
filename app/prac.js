/* 新班級網頁「練習」分頁的兩個練習區（2026-10-20 老師）：
 *   刷個題牲龍活虎：⚡ 快速刷題（零碎時間，一題一題馬上對答案）／⏱ 練點速度（仿 A 卷 20 題 15 分鐘，交卷才對答案）／修復舊傷（錯過的題目）
 *   考注釋牲淚俱下：背書模式（先背）→ 刷題模式（抽考，看答案自己判對錯）→ 考完自動進訂正模式（錯的重考到全對）
 * 題庫：data/drill.js（瑞媛國文教學系統 scripts/stu_app_drill_build.js 產生；選擇題只收該班已開放的）。
 * 錯題記到後台（gr-15 meDrillPut）：錯過的題目連續答對 2 次才算修好；老師預覽模式只看不記。
 *   送出前先排進 localStorage stuapp_drill_q_v1，網路斷了下次打開再補送。
 * 依賴 index.html 的 window.STUAPP（app、api、token、data、esc、md、me）。 */
(function () {
  var S = window.STUAPP, esc = S.esc;
  var VER = '20261020', PASS = 2, QK = 'stuapp_drill_q_v1', MEM = 'stuapp_drill_mem_v1';
  var SPEED_N = 20, SPEED_SEC = 15 * 60;
  var MODE = { quick: '快速刷題', speed: '練點速度', fix: '修復舊傷', nquiz: '注釋刷題', nfix: '注釋訂正' };
  function lsJ(k, d) { try { var v = JSON.parse(localStorage.getItem(k) || 'null'); return v == null ? d : v; } catch (e) { return d; } }
  function lsP(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function mmss(s) { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + ('0' + s % 60).slice(-2); }
  function plain(h) { return String(h || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
  function DD() { return window.STUAPP_DRILL; }

  /* ── 題庫載入（第一次進練習才下載，約 100 KB） ── */
  var loading = null;
  function need(cb) {
    if (DD()) return cb();
    if (!loading) {
      loading = [];
      var s = document.createElement('script');
      s.src = 'data/drill.js?v=' + VER;
      s.onload = function () { var l = loading; loading = null; l.forEach(function (f) { f(); }); };
      s.onerror = function () { loading = null; S.app.toast.create({ text: '題庫下載失敗，請檢查網路再試一次', closeTimeout: 3000 }).open(); };
      document.head.appendChild(s);
    }
    loading.push(cb);
  }
  function lno(les) { var l = (DD().les || []).filter(function (x) { return x[0] === les; })[0]; return l ? l[1] : ''; }
  function myBank() {
    var me = S.me(), O = DD().open || {};
    return DD().bank.filter(function (b) { return O[b.les] && (O[b.les][b.src] || []).indexOf(me.cls) >= 0; });
  }
  function noteLessons() { return (DD().les || []).filter(function (l) { return (DD().notes[l[0]] || []).length; }); }

  /* ── 錯題本（後台 drill；送出前先在本機套用同樣規則，畫面馬上更新） ── */
  function book() { var d = S.data(); if (d && !d.drill) d.drill = {}; return (d && d.drill) || {}; }
  function apply(bk, res) {
    var now = Date.now();
    res.forEach(function (x) {
      var e = bk[x.id];
      if (x.ok) { if (e) { e.r = (e.r || 0) + 1; e.s = (e.s || 0) + 1; e.t = now; if (e.s >= PASS) e.f = 1; } }
      else { e = bk[x.id] = e || { w: 0, r: 0, s: 0 }; e.w = (e.w || 0) + 1; e.s = 0; e.f = 0; e.t = now; }
    });
  }
  function openIds(kind) { var bk = book(); return Object.keys(bk).filter(function (id) { return id.indexOf(kind + ':') === 0 && !bk[id].f; }); }
  var queue = lsJ(QK, []), busy = false;
  function record(mode, les, sec, res, done) {
    if (!res.length) return;
    if (S.me().preview) return;   /* 老師預覽：只看不記 */
    apply(book(), res);
    queue.push({ mode: mode, les: les, sec: Math.round(sec || 0), res: res, done: done ? 1 : 0 });
    lsP(QK, queue); flush();
  }
  function flush() {
    if (busy || !queue.length || !S.token() || S.me().preview) return;
    busy = true;
    var j = queue[0];
    fetch(S.api(), { method: 'POST', body: JSON.stringify({ action: 'meDrillPut', t: S.token(), mode: j.mode, les: j.les, sec: j.sec, res: j.res, done: j.done }), redirect: 'follow' })
      .then(function (r) { return r.json(); }).then(function (r) {
        busy = false;
        if (r.ok) {
          queue.shift(); lsP(QK, queue);
          var d = S.data(); if (d) { d.drill = r.drill || {}; queue.forEach(function (q) { apply(d.drill, q.res); }); }
          refreshCards(); flush();
        } else if (r.auth === false) { /* 登入過期：留著，重新登入後再送 */ }
        else { queue.shift(); lsP(QK, queue); flush(); }   /* 後台拒收（例如格式不對）：丟掉這筆，不要卡住後面的 */
      }).catch(function () { busy = false; });
  }

  /* ── 練習頁上的兩張卡片 ── */
  function cards() {
    var nq = openIds('q').length, pv = S.me().preview;
    return '<div class="sec"><h2>刷個題牲龍活虎</h2><span>A卷・課本後習題・習作</span></div><div class="cd fade pk">' +
      '<a class="pkb" data-pk="quick"><i class="ti ti-bolt"></i><b>快速刷題</b><span>零碎時間，10 題馬上對答案</span></a>' +
      '<a class="pkb" data-pk="speed"><i class="ti ti-stopwatch"></i><b>練點速度</b><span>仿 A 卷 ' + SPEED_N + ' 題 ' + (SPEED_SEC / 60) + ' 分鐘</span></a>' +
      '<a class="pkb" data-pk="fix"><i class="ti ti-bandage"></i><b>修復舊傷' + (nq ? '<em>' + nq + '</em>' : '') + '</b><span>' + (nq ? '錯過的 ' + nq + ' 題，連對 ' + PASS + ' 次就修好' : '目前沒有舊傷') + '</span></a></div>' +
      '<div class="sec"><h2>考注釋牲淚俱下</h2><span>課本注釋</span></div><div class="cd fade pk pk2">' +
      '<a class="pkb" data-pk="nmem"><i class="ti ti-book"></i><b>背書模式</b><span>先背，點一下看解釋</span></a>' +
      '<a class="pkb" data-pk="nquiz"><i class="ti ti-pencil-question"></i><b>刷題模式</b><span>抽考，考完自動訂正</span></a></div>' +
      (pv ? '<p class="note">老師預覽：可以試做，但練習結果不會記錄。</p>' : '<p class="note">答錯的題目會記下來（老師看得到），之後連續答對 ' + PASS + ' 次就算修好。</p>');
  }
  var host = null;
  function bind(el) {
    host = el;
    flush();
    if (el.__pk) return; el.__pk = 1;   /* #prac 每次重新整理都會重畫，監聽只掛一次 */
    el.addEventListener('click', function (e) {
      var b = e.target.closest('[data-pk]'); if (!b) return;
      var k = b.getAttribute('data-pk');
      need(function () {
        if (k === 'quick' || k === 'speed') qSetup(k);
        else if (k === 'fix') qFix();
        else if (k === 'nmem' || k === 'nquiz') nSetup(k);
      });
    });
  }
  function refreshCards() { var c = host && host.querySelector('#pk-cards'); if (c) c.innerHTML = cards(); }

  /* ── 全螢幕練習視窗 ── */
  var ov = null, onAct = null, timer = null;
  function open(title, body, act, opt) {
    if (!ov) {
      ov = document.createElement('div'); ov.id = 'dr';
      ov.addEventListener('click', function (e) {
        var b = e.target.closest('[data-a]'); if (!b || b.hasAttribute('disabled')) return;
        var a = b.getAttribute('data-a');
        if (a === 'close') return askClose();
        if (a === 'g') return b.classList.toggle('show');   /* A卷文章裡的字詞解釋 */
        if (onAct) onAct(a, b);
      });
      document.body.appendChild(ov);
    }
    onAct = act;
    var keep = opt && opt.keep && document.getElementById('dr-bd'), y = keep ? keep.scrollTop : 0;   /* keep：重畫同一頁時不要跳回最上面 */
    ov.innerHTML = '<div class="dr-hd"><a data-a="close" class="dr-x" aria-label="關閉"><i class="ti ti-x"></i></a><b>' + title + '</b><span id="dr-hr">' + ((opt && opt.right) || '') + '</span></div>' +
      '<div class="dr-bd" id="dr-bd">' + body + '</div>' + (opt && opt.foot ? '<div class="dr-ft">' + opt.foot + '</div>' : '');
    ov.classList.add('on'); document.documentElement.classList.add('dr-lock');
    var bd = document.getElementById('dr-bd'); if (bd) bd.scrollTop = y;
  }
  var quitFn = null;   /* 做到一半關掉時要做什麼（送出已作答的錯題） */
  function askClose() {
    if (!quitFn || S.me().preview) return close();   /* 老師預覽本來就不記，直接關 */
    S.app.dialog.confirm('還沒做完，確定要離開嗎？已經作答的題目會記下來。', '離開練習', function () { var f = quitFn; quitFn = null; f(); close(); });
  }
  function close() { stopTimer(); quitFn = null; if (ov) ov.classList.remove('on'); document.documentElement.classList.remove('dr-lock'); refreshCards(); }
  function stopTimer() { if (timer) { clearInterval(timer); timer = null; } }
  function chips(name, list, sel, multi) {
    return '<div class="dr-chips">' + list.map(function (x) {
      return '<a class="dr-chip' + (sel[x[0]] ? ' on' : '') + (x[2] ? ' off' : '') + '" data-a="' + name + '|' + x[0] + '"' + (x[2] ? ' disabled' : '') + '>' + esc(x[1]) + '</a>';
    }).join('') + '</div>';
  }

  /* ════════ 刷個題牲龍活虎 ════════ */
  var qsel = { les: null, src: null, d: null };
  var DIFF = [['易', '易'], ['中', '中'], ['難', '難']];   /* 10/30 難易度：出版社標記＋Claude 補標 */
  function qSetup(mode) {
    var B = myBank();
    if (!B.length) { open(mode === 'speed' ? '⏱ 練點速度' : '⚡ 快速刷題', '<div class="empty"><i class="ti ti-lock"></i>老師還沒開放這班的題目</div>', function () {}); return; }
    var L = (DD().les || []).filter(function (l) { return B.some(function (b) { return b.les === l[0]; }); });
    var R = (DD().src || []).filter(function (s) { return B.some(function (b) { return b.src === s[0]; }); });
    if (!qsel.les) { qsel.les = {}; L.forEach(function (l) { qsel.les[l[0]] = 1; }); }
    if (!qsel.src) { qsel.src = {}; R.forEach(function (s) { qsel.src[s[0]] = 1; }); }
    if (!qsel.d) qsel.d = { 易: 1, 中: 1, 難: 1 };
    var hasD = B.some(function (b) { return b.d; });
    function pool() { return B.filter(function (b) { return qsel.les[b.les] && qsel.src[b.src] && (!b.d || qsel.d[b.d]); }); }
    function draw() {
      var n = pool().length, N = mode === 'speed' ? Math.min(SPEED_N, n) : Math.min(10, n);
      var sec = mode === 'speed' ? Math.round(SPEED_SEC * N / SPEED_N) : 0;
      open(mode === 'speed' ? '⏱ 練點速度' : '⚡ 快速刷題',
        '<div class="dr-lab">範圍</div>' + chips('les', L.map(function (l) { return [l[0], l[1] + ' ' + l[0]]; }), qsel.les) +
        '<div class="dr-lab">題目來源</div>' + chips('src', R.map(function (s) { return [s[0], s[1]]; }), qsel.src) +
        (hasD ? '<div class="dr-lab">難易度</div>' + chips('d', DIFF, qsel.d) : '') +
        '<p class="dr-mut">目前範圍共 ' + n + ' 題。' + (mode === 'speed' ? '抽 ' + N + ' 題、限時 ' + mmss(sec) + '，可以前後翻、改答案，交卷才對答案；時間到自動交卷。' : '抽 ' + N + ' 題，每答一題馬上看對錯和解析。') + '</p>',
        function (a) {
          var p = a.split('|');
          if (p[0] === 'les' || p[0] === 'src' || p[0] === 'd') { var m = qsel[p[0]]; if (m[p[1]]) delete m[p[1]]; else m[p[1]] = 1; draw(); }
          else if (a === 'go') {
            var list = shuffle(pool().slice()).slice(0, N);
            if (mode === 'speed') speedStart(list, sec, Object.keys(qsel.les).join('、'));
            else quickStart('quick', list, Object.keys(qsel.les).join('、'));
          }
        },
        { foot: '<a class="dr-btn" data-a="go"' + (N ? '' : ' disabled') + '>' + (mode === 'speed' ? '開始計時' : '開始') + '</a>' });
    }
    draw();
  }
  function gloss(t) { return String(t || '').replace(/\{g:([^|]*)\|([^}]*)\}/g, '<span class="dr-g" data-a="g">$1<span>$2</span></span>'); }
  function qMeta(it) { var e = book()['q:' + it.id]; return lno(it.les) + ' ' + it.les + '・' + it.sn + ' 第 ' + it.n + ' 題' + (it.d ? '・' + it.d : '') + (e && !e.f ? '<span class="dr-tag">錯過 ' + e.w + ' 次</span>' : ''); }
  /* 10/29 刪去法（同舊學霸網 10/12）：選項右邊「刪去／復原」，刪掉的變淡、不能直接作答；第一題題目下方提示；對完答案後刪過的淡一點 */
  var EL_TIP = '<p class="dr-tip">💡 不確定的選項可以先按「刪去」，刪錯了按「復原」</p>';
  function elTap(el, a, b) {   /* 點到刪去鈕／被刪的選項：回傳 true＝已處理（不算作答） */
    var p = a.split('|');
    if (p[0] === 'el') { if (el[p[1]]) delete el[p[1]]; else el[p[1]] = 1; return true; }
    if (p[0] === 'pick' && el[p[1]]) { b.classList.remove('shake'); void b.offsetWidth; b.classList.add('shake'); return true; }
    return false;
  }
  function qBody(it, pick, show, el, tip) {   /* pick＝選了哪個；show＝顯示對錯與解析；el＝刪去的選項 {A:1}；tip＝顯示刪去提示 */
    var h = '<div class="dr-meta">' + qMeta(it) + '</div>';
    if (it.psg) h += '<details class="dr-psg" open><summary>' + (/^(\s*<img[^>]*>\s*)+$/.test(it.psg) ? '題組圖文（同上一題）' : '閱讀文章') + '</summary><div>' + gloss(it.psg) + '</div></details>';
    h += '<div class="dr-q">' + it.stem + '</div>';
    if (tip && !show) h += EL_TIP;
    if (it.extra) h += '<div class="dr-extra">' + it.extra + '</div>';
    if (it.imgs) h += it.imgs.map(function (g) { return '<figure class="dr-fig"><img src="' + esc(g[1]) + '" alt="">' + (g[0] ? '<figcaption>（' + esc(g[0]) + '）</figcaption>' : '') + '</figure>'; }).join('');
    h += it.opts.map(function (o) {
      var c = show ? (o[0] === it.ans ? ' ok' : o[0] === pick ? ' ng' : '') : (o[0] === pick ? ' sel' : ''), x = el && el[o[0]];
      var op = '<a class="dr-op' + c + (x ? (show ? ' x2' : ' x') : '') + '" data-a="pick|' + esc(o[0]) + '"' + (show ? ' disabled' : '') + '><b>' + esc(o[0]) + '</b><span>' + o[1] + '</span></a>';
      if (show || !el) return op;
      return '<div class="dr-orow">' + op + '<a class="dr-el' + (x ? ' on' : '') + '" data-a="el|' + esc(o[0]) + '">' + (x ? '復原' : '刪去') + '</a></div>';
    }).join('');
    if (show) {
      var ex = '';
      if (it.exp) ex += '<div>' + it.exp + '</div>';
      if (it.trans) ex += '<div>' + it.trans + '</div>';
      if (!it.exp) it.opts.forEach(function (o) { if (o[2]) ex += '<div>' + (/^\s*[（(][A-D][)）]/.test(plain(o[2])) ? '' : '<b>(' + esc(o[0]) + ')</b> ') + o[2] + '</div>'; });
      if (ex) h += '<div class="dr-exp"><b>解析</b>' + ex + '</div>';
    }
    return h;
  }

  /* ⚡ 快速刷題／修復舊傷：一題一題，作答馬上對答案 */
  function quickStart(mode, list, les) {
    var run = { i: 0, res: [], t0: Date.now(), pick: '', el: {} }, sent = 0;
    function flushPart(done) { var r = run.res.slice(sent); sent = run.res.length; record(mode, les, (Date.now() - run.t0) / 1000, r, done); }
    quitFn = function () { flushPart(false); };
    function show(keep) {
      var it = list[run.i], ans = run.pick, done = !!ans, ok = ans === it.ans, msg = '';
      if (done && mode === 'fix') {   /* 整輪結束才送出；同一輪每題只出現一次，所以用目前的連對次數＋1 推算 */
        var e = book()['q:' + it.id], s1 = ((e && e.s) || 0) + 1;
        msg = !ok ? '又錯了，連對次數歸零' : s1 >= PASS ? '🎉 修好了！這題移出修復舊傷' : '再答對 ' + (PASS - s1) + ' 次就修好';
      }
      var rs = done ? '<div class="dr-res ' + (ok ? 'ok' : 'ng') + '">' + (ok ? '⭕ 答對了！' : '❌ 正確答案是 (' + esc(it.ans) + ')') + (msg ? '<small>' + msg + '</small>' : '') + '</div>' : '';
      var body = qBody(it, ans, done, run.el, run.i === 0);   /* 對錯放在選項下面、解析上面 */
      body = body.indexOf('<div class="dr-exp">') >= 0 ? body.replace('<div class="dr-exp">', rs + '<div class="dr-exp">') : body + rs;
      open(mode === 'fix' ? '修復舊傷' : '⚡ 快速刷題', body,
        function (a, b) {
          var p = a.split('|');
          if (!run.pick && elTap(run.el, a, b)) { if (p[0] === 'el') show(true); return; }
          if (p[0] === 'pick' && !run.pick) {
            run.pick = p[1]; run.res.push({ id: 'q:' + it.id, ok: p[1] === it.ans ? 1 : 0 });
            show();
            var r = document.querySelector('#dr .dr-res'); if (r && r.scrollIntoView) r.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
          } else if (a === 'next') { run.i++; run.pick = ''; run.el = {}; if (run.i < list.length) show(); else end(); }
        },
        { keep: keep, right: (run.i + 1) + ' / ' + list.length, foot: done ? '<a class="dr-btn" data-a="next">' + (run.i + 1 < list.length ? '下一題 →' : '看結果') + '</a>' : '' });
    }
    function end() {
      quitFn = null;
      flushPart(true);
      var right = run.res.filter(function (x) { return x.ok; }).length, wrong = list.filter(function (it, i) { return !run.res[i].ok; });
      open(mode === 'fix' ? '修復舊傷' : '⚡ 快速刷題', '<div class="dr-big">' + right + '<small> / ' + list.length + '</small></div><p class="dr-mut c">用時 ' + mmss((Date.now() - run.t0) / 1000) + '</p>' +
        (wrong.length ? '<div class="dr-lab">這次錯的（已記進修復舊傷）</div><ul class="dr-wl">' + wrong.map(function (it) { return '<li>' + esc(lno(it.les) + ' ' + it.sn + ' 第 ' + it.n + ' 題') + '：' + esc(plain(it.stem).slice(0, 36)) + '…</li>'; }).join('') + '</ul>' : '<p class="dr-mut c">全對！太強了 👏</p>'),
        function (a) {
          if (a === 'again') { if (mode === 'fix') qFix(); else quickStart(mode, shuffle(myBank().filter(function (b) { return qsel.les[b.les] && qsel.src[b.src]; })).slice(0, 10), les); }
          else if (a === 'fix') qFix();
          else close();
        },
        { foot: '<a class="dr-btn" data-a="again">' + (mode === 'fix' ? '繼續修' : '再刷 10 題') + '</a>' + (mode !== 'fix' && openIds('q').length ? '<a class="dr-btn ghost" data-a="fix">修復舊傷</a>' : '') + '<a class="dr-btn ghost" data-a="home">回練習</a>' });
    }
    show();
  }
  function qFix() {
    var ids = openIds('q'), B = myBank(), list = shuffle(B.filter(function (b) { return ids.indexOf('q:' + b.id) >= 0; })).slice(0, 20);
    if (!list.length) { open('修復舊傷', '<div class="empty"><i class="ti ti-heart-check"></i>目前沒有舊傷，先去刷題吧！</div>', function () { close(); }, { foot: '<a class="dr-btn" data-a="home">回練習</a>' }); return; }
    quickStart('fix', list, '錯題');
  }

  /* ⏱ 練點速度：仿 A 卷，計時，交卷才對答案 */
  function speedStart(list, limit, les) {
    var run = { i: 0, ans: {}, t0: Date.now(), grid: false, el: {} };   /* el[題序]＝這題刪去的選項 */
    quitFn = function () { submit(true, true); };
    function left() { return limit - (Date.now() - run.t0) / 1000; }
    function tick() {
      var el = document.getElementById('dr-hr'), l = left();
      if (el) { el.textContent = '⏱ ' + mmss(l); el.className = l < 60 ? 'warn' : ''; }
      if (l <= 0) { stopTimer(); submit(true); }
    }
    function show(keep) {
      var it = list[run.i], n = Object.keys(run.ans).length, el = run.el[run.i] = run.el[run.i] || {};
      var grid = run.grid ? '<div class="dr-grid">' + list.map(function (x, k) { return '<a data-a="go|' + k + '" class="' + (run.ans[k] ? 'on' : '') + (k === run.i ? ' cur' : '') + '">' + (k + 1) + '</a>'; }).join('') + '</div>' : '';
      open('⏱ 練點速度', '<div class="dr-meta">第 ' + (run.i + 1) + ' / ' + list.length + ' 題・已作答 ' + n + ' 題</div>' + grid + qBody(it, run.ans[run.i], false, el, run.i === 0),
        function (a, b) {
          var p = a.split('|');
          if (elTap(el, a, b)) { if (p[0] === 'el') { if (el[p[1]] && run.ans[run.i] === p[1]) delete run.ans[run.i]; show(true); } return; }   /* 刪掉已選的那個＝取消作答 */
          if (p[0] === 'pick') { run.ans[run.i] = p[1]; if (run.i < list.length - 1) { run.i++; } show(); }
          else if (a === 'prev' && run.i > 0) { run.i--; show(); }
          else if (a === 'next' && run.i < list.length - 1) { run.i++; show(); }
          else if (p[0] === 'go') { run.i = +p[1]; run.grid = false; show(); }
          else if (a === 'grid') { run.grid = !run.grid; show(); }
          else if (a === 'submit') {
            var miss = list.length - Object.keys(run.ans).length;
            if (miss) S.app.dialog.confirm('還有 ' + miss + ' 題沒作答（沒作答算錯），確定交卷？', '交卷', function () { submit(false); });
            else submit(false);
          }
        },
        { keep: keep, right: '⏱ ' + mmss(left()), foot: '<a class="dr-btn ghost sm" data-a="prev"' + (run.i ? '' : ' disabled') + '><i class="ti ti-chevron-left"></i></a><a class="dr-btn ghost sm" data-a="grid"><i class="ti ti-layout-grid"></i></a><a class="dr-btn ghost sm" data-a="next"' + (run.i < list.length - 1 ? '' : ' disabled') + '><i class="ti ti-chevron-right"></i></a><a class="dr-btn" data-a="submit">交卷</a>' });
      tick();
    }
    function submit(auto, quiet) {
      stopTimer(); quitFn = null;
      var used = Math.min(limit, (Date.now() - run.t0) / 1000);
      var res = list.map(function (it, k) { return { id: 'q:' + it.id, ok: run.ans[k] === it.ans ? 1 : 0 }; });
      if (quiet) { record('speed', les, used, res.filter(function (r, k) { return run.ans[k]; }), false); return; }   /* 中途離開：只記有作答的 */
      record('speed', les, used, res, true);
      var right = res.filter(function (x) { return x.ok; }).length, done = Object.keys(run.ans).length;
      function result(openK) {
        open('⏱ 練點速度・成績', '<div class="dr-big">' + Math.round(right / list.length * 100) + '<small> 分</small></div>' +
          '<div class="dr-stat"><div><b>' + right + '/' + list.length + '</b>答對</div><div><b>' + mmss(used) + '</b>用時' + (auto ? '（時間到）' : '') + '</div><div><b>' + (done ? Math.round(used / done) : '—') + '</b>秒／題</div></div>' +
          '<p class="dr-mut c">A卷一題大約 45 秒（20 題 15 分鐘）' + (done && used / done > 45 ? '，再快一點！' : done ? '，速度 OK 👍' : '') + '</p>' +
          '<div class="dr-lab">逐題檢討（點題號看題目和解析）</div><div class="dr-rv">' + list.map(function (it, k) {
            var ok = run.ans[k] === it.ans;
            return '<div class="dr-rvi' + (openK === k ? ' open' : '') + '"><a data-a="rv|' + k + '" class="' + (ok ? 'ok' : 'ng') + '"><b>' + (k + 1) + '</b>' + (ok ? '⭕' : '❌') + '<span>你選 ' + (run.ans[k] ? '(' + esc(run.ans[k]) + ')' : '—') + '・答案 (' + esc(it.ans) + ')</span><i class="ti ti-chevron-down"></i></a>' +
              (openK === k ? '<div class="dr-rvb">' + qBody(it, run.ans[k] || '', true, run.el[k]) + '</div>' : '') + '</div>';
          }).join('') + '</div>',
          function (a) {
            var p = a.split('|');
            if (p[0] === 'rv') result(openK === +p[1] ? -1 : +p[1]);
            else if (a === 'again') qSetup('speed');
            else close();
          },
          { keep: openK !== -2, foot: '<a class="dr-btn" data-a="again">再一份</a><a class="dr-btn ghost" data-a="home">回練習</a>' });
      }
      result(-2);   /* -2＝剛交卷（從最上面開始看），之後展開／收合都保持捲動位置 */
    }
    show();
    timer = setInterval(tick, 1000);
  }

  /* ════════ 考注釋牲淚俱下 ════════ */
  var nsel = { les: '', a: 0, b: 0, n: 10 };
  /* 10/22 老師：從「下次小考」進來＝照老師日曆的標記背書／抽考。nq＝{ must:{'註號|詞':1}（必考＋選題）, ex:{…}（不考）, vm:{'註號|詞':{小字詞:'must'|'ex'}}, n }；自己選範圍時 nq＝null */
  var nq = null;
  function nKey(it) { return it.no + '|' + it.w; }
  function vOf(it) {   /* N選1 拆題：照老師的小字詞標記，必考的只留那個、不考的拿掉（至少留一個） */
    var v = it.v, m = nq && nq.vm[nKey(it)]; if (!v || !m) return v;
    var mu = v.filter(function (c) { return m[c[0]] === 'must'; }); if (mu.length) return mu;
    var r = v.filter(function (c) { return m[c[0]] !== 'ex'; }); return r.length ? r : v;
  }
  function nItems(les) { return (DD().notes[les] || []).map(function (it, i) { return { les: les, i: i, it: it }; }); }
  function nos(les) { var s = {}; (DD().notes[les] || []).forEach(function (it) { s[it.no] = 1; }); return Object.keys(s).map(Number).sort(function (x, y) { return x - y; }); }
  /* 一題＝一個要考的字詞：有「N選1」拆題的註釋，從整句／各小字詞隨機抽一個（同老師的注釋小考） */
  function nCard(x, pickV) {
    var it = x.it, v = vOf(it);
    if (v && pickV) { var c = v[Math.floor(Math.random() * v.length)]; return { id: 'n:' + x.les + '|' + it.no + '|' + c[0], les: x.les, no: it.no, s: it.s, w: c[0], a: c[1], b: c[2], ans: c[3] }; }
    var at = it.p >= 0 && it.s.substr(it.p, it.w.length) === it.w ? it.p : it.s.indexOf(it.w);
    return { id: 'n:' + x.les + '|' + it.no + '|' + it.w, les: x.les, no: it.no, s: it.s, w: it.w, a: at, b: at < 0 ? -1 : at + it.w.length, ans: it.a };
  }
  function cardById(id) {
    var m = /^n:(.*)\|(\d+)\|(.*)$/.exec(id); if (!m) return null;
    var list = DD().notes[m[1]] || [];
    for (var i = 0; i < list.length; i++) {
      var it = list[i]; if (it.no !== +m[2]) continue;
      if (it.w === m[3] && !it.v) return nCard({ les: m[1], it: it }, false);
      var c = (it.v || []).filter(function (v) { return v[0] === m[3]; })[0];
      if (c) return { id: id, les: m[1], no: it.no, s: it.s, w: c[0], a: c[1], b: c[2], ans: c[3] };
      if (it.w === m[3]) return nCard({ les: m[1], it: it }, false);
    }
    return null;
  }
  function sent(c) {   /* 原句，考的字詞畫底色 */
    var s = c.s, a = c.a, b = c.b;
    if (a < 0 || b <= a) return esc(s);
    return esc(s.slice(0, a)) + '<mark>' + esc(s.slice(a, b)) + '</mark>' + esc(s.slice(b));
  }
  function nSetup(mode) {
    nq = null;
    var L = noteLessons();
    if (!nsel.les || !DD().notes[nsel.les]) nsel.les = L[L.length - 1][0];
    function draw() {
      var ns = nos(nsel.les);
      if (ns.indexOf(nsel.a) < 0) nsel.a = ns[0];
      if (ns.indexOf(nsel.b) < 0 || nsel.b < nsel.a) nsel.b = ns[ns.length - 1];
      var cnt = nItems(nsel.les).filter(function (x) { return x.it.no >= nsel.a && x.it.no <= nsel.b; }).length;
      var opt = function (v) { return ns.map(function (n) { return '<option' + (n === v ? ' selected' : '') + '>' + n + '</option>'; }).join(''); };
      open(mode === 'nmem' ? '背書模式' : '刷題模式',
        '<div class="dr-lab">哪一課</div>' + chips('les', L.map(function (l) { return [l[0], l[1] + ' ' + l[0]]; }), (function () { var o = {}; o[nsel.les] = 1; return o; })()) +
        '<div class="dr-lab">注釋範圍</div><div class="dr-rng">註 <select id="dr-a">' + opt(nsel.a) + '</select> ～ 註 <select id="dr-b">' + opt(nsel.b) + '</select><span>共 ' + cnt + ' 條</span></div>' +
        (mode === 'nquiz' ? '<div class="dr-lab">抽幾題</div>' + chips('n', [[5, '5 題'], [10, '10 題'], [20, '20 題'], [999, '全部']], (function () { var o = {}; o[nsel.n] = 1; return o; })()) : '') +
        '<p class="dr-mut">' + (mode === 'nmem' ? '先背：每條注釋的解釋先遮起來，點一下看答案；背好了直接按下面「開始抽考」。' : '抽考：看到畫底色的字詞，先在心裡（或紙上）寫出解釋，再按「看答案」自己判對錯。考完錯的會自動進訂正模式。') + '</p>',
        function (a, el) {
          var p = a.split('|');
          if (p[0] === 'les') { nsel.les = p[1]; nsel.a = nsel.b = 0; draw(); }
          else if (p[0] === 'n') { nsel.n = +p[1]; draw(); }
          else if (a === 'mem') nMem();
          else if (a === 'quiz') nQuiz();
        },
        { foot: mode === 'nmem' ? '<a class="dr-btn" data-a="mem">開始背書</a><a class="dr-btn ghost" data-a="quiz">直接抽考</a>' : '<a class="dr-btn" data-a="quiz">開始抽考</a><a class="dr-btn ghost" data-a="mem">先背一下</a>' });
      var A = document.getElementById('dr-a'), B = document.getElementById('dr-b');
      A.onchange = function () { nsel.a = +A.value; if (nsel.b < nsel.a) nsel.b = nsel.a; draw(); };
      B.onchange = function () { nsel.b = +B.value; if (nsel.a > nsel.b) nsel.a = nsel.b; draw(); };
    }
    draw();
  }
  function rangeLabel() { return nsel.les + ' 註' + nsel.a + '～' + nsel.b; }
  function inRange() { return nItems(nsel.les).filter(function (x) { return x.it.no >= nsel.a && x.it.no <= nsel.b && !(nq && nq.ex[nKey(x.it)]); }); }   /* 老師點「不考」的不列 */

  /* 背書模式 */
  function nMem(must, title) {   /* must＝{'註號|詞':1} 必考（同老師日曆 quiz.must）（從「下次小考」進來時標出）；title＝那次小考名稱 */
    must = must || {};
    var list = inRange(), mem = lsJ(MEM, {}), all = false, shown = {};
    if (nq) list = list.filter(function (x) { return must[nKey(x.it)]; }).concat(list.filter(function (x) { return !must[nKey(x.it)]; }));   /* 必考排前面 */
    function draw() {
      var got = list.filter(function (x) { return mem[x.les + '|' + x.i]; }).length;
      open('背書模式', '<div class="dr-meta">' + esc((title ? title + '・' : '') + rangeLabel()) + '・記住 ' + got + ' / ' + list.length + ' 條</div>' +
        '<div class="dr-tools"><a class="dr-chip' + (all ? ' on' : '') + '" data-a="all">' + (all ? '全部遮起來' : '全部顯示') + '</a></div>' +
        list.map(function (x, k) {
          var c = nCard(x, false), it = x.it, op = all || shown[k], key = x.les + '|' + x.i;
          var vv = vOf(it), ans = vv ? vv.map(function (v) { return '<div><b>' + esc(v[0]) + '</b>：' + v[3] + '</div>'; }).join('') : '<div><b>' + esc(it.w) + '</b>：' + it.a + '</div>';
          if (vv) { var wh = vv.filter(function (v) { return v[4]; })[0]; if (wh) c = { s: it.s, a: wh[1], b: wh[2] }; }
          return '<div class="dr-card' + (mem[key] ? ' got' : '') + '"><div class="dr-no">註' + it.no + (must[it.no + '|' + it.w] ? '<span class="dr-tag">必考</span>' : '') + (vv && vv.length > 1 ? '<span class="dr-tag">' + vv.length + ' 選 1</span>' : '') + '<a class="dr-got" data-a="got|' + k + '">' + (mem[key] ? '<i class="ti ti-circle-check-filled"></i> 記住了' : '<i class="ti ti-circle"></i> 記住了') + '</a></div>' +
            '<div class="dr-s">' + sent(c) + '</div>' +
            (op ? '<div class="dr-ans" data-a="tog|' + k + '">' + ans + '</div>' : '<a class="dr-peek" data-a="tog|' + k + '">點一下看解釋</a>') + '</div>';
        }).join(''),
        function (a) {
          var p = a.split('|');
          if (a === 'all') { all = !all; shown = {}; draw(); }
          else if (p[0] === 'tog') { shown[+p[1]] = !shown[+p[1]]; redraw(); }
          else if (p[0] === 'got') { var x = list[+p[1]], key = x.les + '|' + x.i; if (mem[key]) delete mem[key]; else mem[key] = 1; lsP(MEM, mem); redraw(); }
          else if (a === 'quiz') nQuiz();
        },
        { foot: '<a class="dr-btn" data-a="quiz">背好了，開始抽考 →</a>' });
    }
    function redraw() { var bd = document.getElementById('dr-bd'), y = bd ? bd.scrollTop : 0; draw(); bd = document.getElementById('dr-bd'); if (bd) bd.scrollTop = y; }
    draw();
  }

  /* 刷題模式（抽考）→ 考完自動進訂正模式 */
  function nQuiz() {
    var pool = shuffle(inRange().slice()), n = nq ? nq.n : nsel.n;
    if (nq) pool = pool.filter(function (x) { return nq.must[nKey(x.it)]; }).concat(pool.filter(function (x) { return !nq.must[nKey(x.it)]; }));   /* 必考一定抽到，剩下名額隨機 */
    var list = shuffle(pool.slice(0, n)).map(function (x) { return nCard(x, true); });
    nRun('nquiz', list, rangeLabel(), function (wrong) { if (wrong.length) nFix(wrong, rangeLabel(), true); });
  }
  /* 一輪抽考：看題 → 看答案 → 自己判對錯 */
  function nRun(mode, list, les, after) {
    var run = { i: 0, res: [], t0: Date.now(), open: false }, sentN = 0;
    quitFn = function () { record(mode, les, (Date.now() - run.t0) / 1000, run.res.slice(sentN), false); };
    function show() {
      var c = list[run.i];
      open(mode === 'nfix' ? '訂正模式・重考' : '刷題模式',
        '<div class="dr-meta">' + esc(lno(c.les) + ' ' + c.les + '・註' + c.no) + (book()[c.id] && !book()[c.id].f ? '<span class="dr-tag">錯過 ' + book()[c.id].w + ' 次</span>' : '') + '</div>' +
        '<div class="dr-card big"><div class="dr-s">' + sent(c) + '</div><div class="dr-ask">「' + esc(c.w) + '」是什麼意思？</div>' +
        (run.open ? '<div class="dr-ans">' + c.ans + '</div>' : '') + '</div>' +
        (run.open ? '<p class="dr-mut c">跟答案的意思一樣就算對（字不用一模一樣）</p>' : '<p class="dr-mut c">先在心裡或紙上寫出來，再看答案</p>'),
        function (a) {
          if (a === 'show') { run.open = true; show(); }
          else if (a === 'o' || a === 'x') {
            run.res.push({ id: c.id, ok: a === 'o' ? 1 : 0 }); run.open = false; run.i++;
            if (run.i < list.length) show(); else end();
          }
        },
        { right: (run.i + 1) + ' / ' + list.length, foot: run.open ? '<a class="dr-btn ok" data-a="o">⭕ 我答對了</a><a class="dr-btn ng" data-a="x">❌ 我答錯了</a>' : '<a class="dr-btn" data-a="show">看答案</a>' });
    }
    function end() {
      quitFn = null;
      record(mode, les, (Date.now() - run.t0) / 1000, run.res.slice(sentN), true);
      var wrong = list.filter(function (c, k) { return !run.res[k].ok; });
      after(wrong, run);
      if (!wrong.length && mode === 'nquiz') {
        open('刷題模式', '<div class="dr-big">' + list.length + '<small> / ' + list.length + '</small></div><p class="dr-mut c">全對！不用訂正 👏</p>', function (a) { if (a === 'again') nQuiz(); else close(); },
          { foot: '<a class="dr-btn" data-a="again">再抽一次</a><a class="dr-btn ghost" data-a="home">回練習</a>' });
      }
    }
    show();
  }
  /* 訂正模式：先看錯的（答案都攤開）→ 重考錯的 → 還有錯就再訂正，直到全對 */
  function nFix(list, les, fromQuiz, round) {
    round = round || 1;
    open('訂正模式', (fromQuiz && round === 1 ? '<div class="dr-res ng">這次錯了 ' + list.length + ' 條，進入訂正模式</div>' : round > 1 ? '<div class="dr-res ng">還有 ' + list.length + ' 條沒答對，再看一次</div>' : '') +
      '<p class="dr-mut">把解釋看熟（可以抄一遍），好了就按「重考錯的」。全部答對才算訂正完成。</p>' +
      list.map(function (c) {
        return '<div class="dr-card"><div class="dr-no">' + esc(lno(c.les) + ' ' + c.les + '・註' + c.no) + '</div><div class="dr-s">' + sent(c) + '</div><div class="dr-ans"><b>' + esc(c.w) + '</b>：' + c.ans + '</div></div>';
      }).join(''),
      function (a) {
        if (a === 'retest') nRun('nfix', shuffle(list.slice()), les, function (wrong) {
          if (wrong.length) nFix(wrong, les, fromQuiz, round + 1);
          else open('訂正模式', '<div class="dr-big">🎉</div><p class="dr-mut c">' + (function () {
              var left = list.filter(function (c) { var e = book()[c.id]; return e && !e.f; }).length;
              return left ? '訂正完成！其中 ' + left + ' 條之後再答對一次（連對 ' + PASS + ' 次）就算修好。' : '訂正完成，全部修好了！';
            })() + '</p>', function (b) { if (b === 'again') nSetup('nquiz'); else close(); },
            { foot: '<a class="dr-btn" data-a="again">再抽一次</a><a class="dr-btn ghost" data-a="home">回練習</a>' });
        });
      },
      { right: list.length + ' 條', foot: '<a class="dr-btn" data-a="retest">重考錯的 →</a>' });
  }

  /* ════════ 老師：全班練習狀況（預覽模式選人畫面） ════════ */
  var allData = null;
  function teacher(el, cls) {
    if (!el) return;
    el.innerHTML = '<div class="sec"><h2>練習狀況</h2><span>' + esc(cls) + '</span></div><div class="cd"><div class="empty"><i class="ti ti-loader"></i>讀取中</div></div>';
    function draw() {
      if (!allData) return;
      if (!allData.ok) { el.innerHTML = '<div class="sec"><h2>練習狀況</h2></div><div class="cd"><div class="empty">讀不到練習資料：' + esc(allData.error || '') + '（後台要更新到 gr-15）</div></div>'; return; }
      var st = allData.students.filter(function (s) { return s.cls === cls; }), it = allData.items.filter(function (x) { return x.cls === cls; }).slice(0, 10);
      var act = st.filter(function (s) { return s.ses; }).length;
      el.innerHTML = '<div class="sec"><h2>練習狀況</h2><span>' + esc(cls) + '・' + act + ' / ' + st.length + ' 人練過</span></div>' +
        '<div class="cd tp"><table><thead><tr><th>座號</th><th>姓名</th><th>待修</th><th>已修</th><th>輪數</th><th>答對率</th><th>最後練習</th></tr></thead><tbody>' + st.map(function (s) {
          return '<tr class="' + (s.ses ? '' : 'dim') + '"><td>' + s.seat + '</td><td>' + esc(s.name) + '</td><td class="' + (s.open ? 'r' : '') + '">' + (s.open || '') + '</td><td>' + (s.fixed || '') + '</td><td>' + (s.ses || '') + '</td><td>' + (s.q ? Math.round(s.right / s.q * 100) + '%' : '') + '</td><td>' + (s.last ? S.md(s.last.slice(0, 10)).replace(/（.）/, '') : '') + '</td></tr>';
        }).join('') + '</tbody></table></div>' +
        '<div class="sec"><h2>這班錯最多</h2><span>待修人數／曾錯人數</span></div><div class="cd">' + (it.length ? it.map(function (x) {
          return '<div class="it"><div class="ic r"><b>' + x.open + '</b></div><div class="tx"><b>' + esc(qName(x.id)) + '</b><span>' + esc(qText(x.id)) + '</span></div><span class="pill n">曾錯 ' + x.ever + ' 人</span></div>';
        }).join('') : '<div class="empty"><i class="ti ti-mood-smile"></i>這班還沒有錯題紀錄</div>') + '</div>' +
        '<p class="note">待修＝錯過、還沒連續答對 ' + allData.pass + ' 次。老師也可以到成績試算表「練習場次」分頁看每一輪的紀錄。</p>';
    }
    if (allData) return need(draw);
    fetch(S.api(), { method: 'POST', body: JSON.stringify({ action: 'meDrillAll', t: S.token() }), redirect: 'follow' }).then(function (r) { return r.json(); })
      .then(function (d) { allData = d; need(draw); }).catch(function () { allData = { ok: false, error: '連不上' }; draw(); allData = null; });
  }
  function qName(id) {
    var m = /^q:(.*?)\|(.*?)\|(.*)$/.exec(id);
    if (m) { var b = DD().bank.filter(function (x) { return 'q:' + x.id === id; })[0]; return lno(m[1]) + ' ' + m[1] + '・' + (b ? b.sn : m[2]) + ' 第 ' + m[3] + ' 題'; }
    var c = cardById(id); return c ? lno(c.les) + ' ' + c.les + '・註' + c.no + '「' + c.w + '」' : id;
  }
  function qText(id) {
    if (/^q:/.test(id)) { var b = DD().bank.filter(function (x) { return 'q:' + x.id === id; })[0]; return b ? plain(b.stem).slice(0, 50) : ''; }
    var c = cardById(id); return c ? plain(c.ans).slice(0, 50) : '';
  }

  /* ════════ 接到真的注釋小考（10/21 老師：小考考前先背書，考完那筆小考紀錄就是訂正） ════════ */
  function lesKey(n) { var l = (DD().les || [])[+n - 1]; return l && (DD().notes[l[0]] || []).length ? l[0] : ''; }
  /* 「下次小考」→ 背這次範圍：n＝第幾課，a～b＝註號範圍，must＝必考註號 */
  function memRange(n, a, b, q, title) {   /* q＝日曆小考 { must, ex, pick, vm, n }（後台 gr-16；舊後台只有數量，就只照範圍） */
    need(function () {
      var k = lesKey(n);
      if (!k) { S.app.toast.create({ text: '這一課的注釋還沒放進來', closeTimeout: 3000 }).open(); return; }
      nsel.les = k; nsel.a = +a; nsel.b = +b;
      q = Array.isArray(q) ? { must: q } : (q || {});
      var m = {}, ex = {}; (q.must || []).concat(q.pick || []).forEach(function (x) { m[String(x)] = 1; }); (q.ex || []).forEach(function (x) { ex[String(x)] = 1; });
      var np = (q.pick || []).length;
      nq = { must: m, ex: ex, vm: q.vm || {}, n: np ? np + (q.must || []).length : (+q.n || nsel.n) };
      nMem(m, title);
    });
  }
  /* 小考紀錄 → 訂正重考：只考這次考卷上的題目，錯的進訂正，重考到全對 */
  function quizFix(r) {
    need(function () {
      var les = String(r.lesson || '').split('—')[0], name = '〈' + les + '〉' + (r.code ? r.code + ' ' : '') + '註' + r.a + '～' + r.b;
      var list = (r.qs || []).filter(function (q) { return q.w && q.a; }).map(function (q) {
        var s = q.x || q.s || '', at = s.indexOf(q.w);
        return { id: 'n:' + les + '|' + q.no + '|' + q.w, les: les, no: q.no, s: s, w: q.w, a: at, b: at < 0 ? -1 : at + q.w.length, ans: esc(q.a) };
      });
      if (!list.length) { S.app.toast.create({ text: '這次小考老師還沒補上答案', closeTimeout: 3000 }).open(); return; }
      nRun('nfix', shuffle(list.slice()), name, function (wrong) {
        if (wrong.length) nFix(wrong, name, true);
        else open('訂正重考', '<div class="dr-big">' + list.length + '<small> / ' + list.length + '</small></div><p class="dr-mut c">全對！這次小考訂正完成 👏</p>', function () { close(); }, { foot: '<a class="dr-btn" data-a="home">回練習</a>' });
      });
    });
  }

  window.STUPRAC = { cards: cards, bind: bind, teacher: teacher, flush: flush, memRange: memRange, quizFix: quizFix };
})();
