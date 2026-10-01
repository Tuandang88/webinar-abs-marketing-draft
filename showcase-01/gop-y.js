/* Review-only comment layer: click any block on the page, type a note, then copy all notes to paste into chat.
   Notes live in this browser only (localStorage). Remove the <script> tag before the page goes live. */
(function () {
  var KEY = 'gopy-showcase-01';
  var notes = load();
  var on = false;
  var hoverEl = null;

  var css = document.createElement('style');
  css.textContent = [
    '.gy-btn{position:fixed;left:16px;bottom:16px;z-index:50;background:#fff;color:#0B1A2B;border:0;border-radius:999px;padding:11px 18px;font:700 14px Inter,Arial,sans-serif;cursor:pointer;box-shadow:0 6px 24px rgba(0,0,0,.35)}',
    '.gy-btn.on{background:#FF6A1A;color:#fff}',
    '.gy-btn b{display:inline-block;min-width:20px;margin-left:6px;padding:0 6px;border-radius:999px;background:#FF6A1A;color:#fff;font-size:12px}',
    '.gy-btn.on b{background:#fff;color:#FF6A1A}',
    'body.gy-on .wrap *{cursor:crosshair}',
    'body.gy-on iframe{pointer-events:none}',
    '.gy-hover{outline:2px dashed #FF6A1A!important;outline-offset:3px}',
    '.gy-marked{outline:2px solid rgba(255,106,26,.55);outline-offset:3px}',
    '.gy-pin{position:absolute;z-index:40;width:24px;height:24px;border-radius:50%;background:#FF6A1A;color:#fff;font:700 12px/24px Inter,Arial,sans-serif;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.4);pointer-events:none}',
    '.gy-pop{position:absolute;z-index:60;width:300px;max-width:calc(100vw - 32px);background:#fff;color:#111827;border-radius:12px;padding:12px;box-shadow:0 12px 40px rgba(0,0,0,.45);font:14px Inter,Arial,sans-serif}',
    '.gy-pop small{display:block;color:#6B7280;font-size:12px;margin-bottom:6px;line-height:1.4}',
    '.gy-pop textarea{width:100%;box-sizing:border-box;min-height:80px;border:1px solid #D1D5DB;border-radius:8px;padding:8px;font:14px Inter,Arial,sans-serif;color:#111827;background:#fff;resize:vertical}',
    '.gy-pop .row{display:flex;gap:8px;justify-content:flex-end;margin-top:8px}',
    '.gy-pop button,.gy-panel button{border:0;border-radius:8px;padding:8px 12px;font:600 13px Inter,Arial,sans-serif;cursor:pointer}',
    '.gy-ok{background:#FF6A1A;color:#fff}.gy-no{background:#F3F4F6;color:#374151}',
    '.gy-panel{position:fixed;left:16px;bottom:68px;z-index:50;width:340px;max-width:calc(100vw - 32px);max-height:60vh;overflow:auto;background:#fff;color:#111827;border-radius:14px;padding:14px;box-shadow:0 12px 40px rgba(0,0,0,.45);font:14px Inter,Arial,sans-serif}',
    '.gy-panel h4{margin:0 0 4px;font-size:15px}',
    '.gy-panel .hint{margin:0 0 10px;color:#6B7280;font-size:12.5px}',
    '.gy-panel ol{margin:0 0 10px;padding-left:20px;display:grid;gap:8px}',
    '.gy-panel li small{display:block;color:#6B7280;font-size:12px}',
    '.gy-panel li .del{background:none;color:#B91C1C;padding:0;font-size:12px}',
    '.gy-panel .acts{display:flex;gap:8px;flex-wrap:wrap}',
    '.gy-panel .msg{font-size:12.5px;color:#047857;margin-top:6px}',
    '@media (max-width:860px){.gy-btn{bottom:82px}.gy-panel{bottom:134px}}'
  ].join('\n');
  document.head.appendChild(css);

  var btn = document.createElement('button');
  btn.className = 'gy-btn';
  btn.type = 'button';
  document.body.appendChild(btn);

  var panel = document.createElement('div');
  panel.className = 'gy-panel';
  panel.hidden = true;
  document.body.appendChild(panel);

  btn.addEventListener('click', function () { setMode(!on); });

  function setMode(v) {
    on = v;
    document.body.classList.toggle('gy-on', on);
    panel.hidden = !on;
    if (!on) clearHover();
    render();
  }

  function load() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch (e) {}
  }

  // Pick the most meaningful block under the cursor so notes attach to cards/headings, not stray spans
  var BLOCKS = 'h1,h2,h3,h4,p,li,img,.btn,.pill,.stat,.card,.benefit,.sp,.a-item,.prompt,.reel,.shot,.demo-win,.mini-stats,details,form,label';
  function pick(t) {
    if (!t || !t.closest) return null;
    if (t.closest('.gy-btn,.gy-panel,.gy-pop')) return null;
    if (!t.closest('.wrap')) return null;
    return t.closest(BLOCKS) || t.closest('section,.hero,header');
  }

  function sectionName(el) {
    if (el.closest('header.site')) return 'Đầu trang (logo + nút)';
    if (el.closest('.hero')) return 'Hero';
    if (el.closest('.stats')) return 'Dải số liệu';
    var sec = el.closest('section');
    var eb = sec && sec.querySelector('.sec-eyebrow');
    return eb ? eb.textContent.trim() : 'Khối không tên';
  }
  function elName(el) {
    var map = { H1: 'Tiêu đề lớn', H2: 'Tiêu đề khối', H3: 'Tiêu đề thẻ', H4: 'Tên', P: 'Đoạn chữ', LI: 'Dòng liệt kê', IMG: 'Ảnh', LABEL: 'Ô nhập', FORM: 'Form đăng ký', DETAILS: 'Câu hỏi FAQ' };
    var kind = map[el.tagName] || (el.classList.contains('reel') ? 'Video' : el.classList.contains('btn') ? 'Nút' : 'Khung');
    var txt = (el.tagName === 'IMG' ? (el.alt || '') : el.textContent).replace(/\s+/g, ' ').trim();
    if (txt.length > 60) txt = txt.slice(0, 60) + '…';
    return txt ? kind + ' "' + txt + '"' : kind;
  }

  function clearHover() {
    if (hoverEl) hoverEl.classList.remove('gy-hover');
    hoverEl = null;
  }

  document.addEventListener('mouseover', function (e) {
    if (!on) return;
    var el = pick(e.target);
    if (el === hoverEl) return;
    clearHover();
    if (el) { hoverEl = el; el.classList.add('gy-hover'); }
  });

  document.addEventListener('click', function (e) {
    if (!on) return;
    var el = pick(e.target);
    if (!el) return;
    e.preventDefault();
    e.stopPropagation();
    openPop(el);
  }, true);

  var pop = null;
  function closePop() { if (pop) { pop.remove(); pop = null; } }

  function openPop(el) {
    closePop();
    var where = sectionName(el) + ' › ' + elName(el);
    pop = document.createElement('div');
    pop.className = 'gy-pop';
    pop.innerHTML = '<small></small><textarea id="gy-text" placeholder="Ông chủ muốn sửa gì ở đây?"></textarea>' +
      '<div class="row"><button type="button" class="gy-no">Huỷ</button><button type="button" class="gy-ok">Lưu góp ý</button></div>';
    pop.querySelector('small').textContent = where;
    var r = el.getBoundingClientRect();
    pop.style.top = (window.scrollY + r.bottom + 8) + 'px';
    pop.style.left = Math.max(16, Math.min(window.scrollX + r.left, document.documentElement.clientWidth - 316)) + 'px';
    document.body.appendChild(pop);
    var ta = pop.querySelector('textarea');
    ta.focus();
    pop.querySelector('.gy-no').onclick = closePop;
    pop.querySelector('.gy-ok').onclick = function () {
      var t = ta.value.trim();
      if (!t) { ta.focus(); return; }
      el.setAttribute('data-gy', '1');
      notes.push({ where: where, text: t, path: pathOf(el) });
      save();
      closePop();
      render();
    };
  }

  // Store a CSS path so pins survive a reload
  function pathOf(el) {
    var parts = [];
    while (el && el !== document.body) {
      var i = 1, s = el;
      while ((s = s.previousElementSibling)) if (s.tagName === el.tagName) i++;
      parts.unshift(el.tagName.toLowerCase() + ':nth-of-type(' + i + ')');
      el = el.parentElement;
    }
    return 'body > ' + parts.join(' > ');
  }

  function render() {
    btn.innerHTML = on ? 'Tắt góp ý' : '💬 Góp ý';
    if (notes.length) btn.innerHTML += '<b>' + notes.length + '</b>';
    btn.classList.toggle('on', on);

    document.querySelectorAll('.gy-pin').forEach(function (p) { p.remove(); });
    document.querySelectorAll('.gy-marked').forEach(function (m) { m.classList.remove('gy-marked'); });
    notes.forEach(function (n, i) {
      var el = null;
      try { el = document.querySelector(n.path); } catch (e) {}
      if (!el) return;
      el.classList.add('gy-marked');
      var r = el.getBoundingClientRect();
      var pin = document.createElement('span');
      pin.className = 'gy-pin';
      pin.textContent = i + 1;
      pin.style.top = (window.scrollY + r.top - 12) + 'px';
      pin.style.left = (window.scrollX + r.left - 12) + 'px';
      document.body.appendChild(pin);
    });

    panel.innerHTML = '<h4>Góp ý (' + notes.length + ')</h4><p class="hint">Bấm vào chữ, ảnh hoặc khung bất kỳ trên trang để ghi chú. Xong bấm "Copy góp ý" rồi dán vào chat cho Claude.</p>';
    if (notes.length) {
      var ol = document.createElement('ol');
      notes.forEach(function (n, i) {
        var li = document.createElement('li');
        li.innerHTML = '<small></small><span></span> <button type="button" class="del">Xoá</button>';
        li.querySelector('small').textContent = n.where;
        li.querySelector('span').textContent = n.text;
        li.querySelector('.del').onclick = function () { notes.splice(i, 1); save(); render(); };
        ol.appendChild(li);
      });
      panel.appendChild(ol);
    }
    var acts = document.createElement('div');
    acts.className = 'acts';
    acts.innerHTML = '<button type="button" class="gy-ok">Copy góp ý</button><button type="button" class="gy-no">Xoá hết</button>';
    panel.appendChild(acts);
    var msg = document.createElement('p');
    msg.className = 'msg';
    panel.appendChild(msg);

    acts.querySelector('.gy-ok').onclick = function () {
      if (!notes.length) { msg.textContent = 'Chưa có góp ý nào.'; return; }
      var text = 'Góp ý landing Showcase #01:\n' + notes.map(function (n, i) {
        return (i + 1) + '. [' + n.where + '] → ' + n.text;
      }).join('\n');
      copy(text, msg);
    };
    acts.querySelector('.gy-no').onclick = function () {
      if (!notes.length) return;
      notes = []; save(); render();
    };
  }

  function copy(text, msg) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'width:100%;min-height:120px;margin-top:8px';
      msg.textContent = 'Không copy tự động được. Bôi đen đoạn dưới rồi Cmd+C:';
      msg.after(ta);
      ta.select();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        msg.textContent = 'Đã copy ' + notes.length + ' góp ý. Dán vào chat cho Claude.';
      }, fallback);
    } else fallback();
  }

  window.addEventListener('resize', function () { if (notes.length) render(); });
  // Embedded videos and images load late and shift the layout; re-place pins once they settle
  window.addEventListener('load', function () { setTimeout(render, 1500); });
  render();
})();
