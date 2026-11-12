/* 學生版課文頁共用（老師 11/11）：
   1) 側欄「課文」列出各課，點了直接換課（不用先回班級網頁）。新增課文時，只要在下面 LESSONS 加一行。
   2) 科別：班級網頁登入後會把班級存在 localStorage stuapp_cls_v1（建一忠、冷一孝…）；
      冷＝冷凍空調科、建＝建築科 → window.STU_DEPT 'cold'／'arch'；沒存到（直接開課文頁）就是 ''，作文教學兩科完整版都列。
   由 build_stu_text.py 產生的每一課頁面在 dist/app.js 之前載入本檔。 */
(function () {
  'use strict';
  var LESSONS = [['03', '第 4 課〈珍珠奶茶〉'], ['04', '第 5 課〈臺灣最美麗的火車線〉'], ['01', '第 6 課〈論語選—侍坐〉']];
  var cls = '';
  /* 11/12：分班版（班名＋課號 → 資料夾）。冷一孝的第 6 課含習作講解 */
  var SPECIAL = { '冷一孝01': '01-85829926' };
  try { cls = localStorage.getItem('stuapp_cls_v1') || ''; } catch (e) {}
  window.STU_DEPT = cls.charAt(0) === '冷' ? 'cold' : cls.charAt(0) === '建' ? 'arch' : '';
  /* 主程式載入後會把側欄的 active 清掉，所以目前這一課另外用 stu-cur 標示 */
  var st = document.createElement('style');
  st.textContent = '#stu-nav .stu-cur{background:#b8362f!important;color:#fff!important;font-weight:700}';
  document.head.appendChild(st);
  function build() {
    var box = document.getElementById('stu-nav'); if (!box) return;
    var m = location.pathname.match(/text\/(\d+)(?:-\w+)?\//), cur = m ? m[1] : '';
    box.innerHTML = LESSONS.map(function (l) {
      return '<button class="wenxue-nav-item' + (l[0] === cur ? ' active stu-cur' : '') + '" onclick="' + (l[0] === cur ? '' : "location.href='../" + (SPECIAL[cls + l[0]] || l[0]) + "/'") + '">' + l[1] + '</button>';
    }).join('');
  }
  if (document.readyState !== 'loading') build(); else document.addEventListener('DOMContentLoaded', build);
  window.addEventListener('load', build);   /* 作文教學外掛改過側欄後，再畫一次確保在 */
})();
