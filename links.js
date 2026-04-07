const views = {
  home:         { id: 'view-home',         label: null },
  admin:        { id: 'view-admin',        label: 'شيت الإدارة' },
  technicians:  { id: 'view-technicians',  label: 'الفنيين' },
  reports:      { id: 'view-reports',      label: 'تسليم التقارير اليومية' },
};

let current = 'home';

function goTo(name) {
  // hide all
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  // show target
  document.getElementById(views[name].id).classList.add('active');
  current = name;

  // breadcrumb
  const bc = document.getElementById('breadcrumb');
  if (name === 'home') {
    bc.classList.remove('show');
  } else {
    bc.classList.add('show');
    document.getElementById('bc-text').textContent = views[name].label;
  }

  // clear search
  document.getElementById('search').value = '';
  document.getElementById('empty').classList.remove('show');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goHome() { goTo('home'); }

function filterCards() {
  const q = document.getElementById('search').value.trim().toLowerCase();
  const activeView = document.querySelector('.view.active');
  const cards = activeView.querySelectorAll('.card');
  let any = false;
  cards.forEach(card => {
    const txt = card.innerText.toLowerCase();
    const match = !q || txt.includes(q);
    card.style.display = match ? '' : 'none';
    if (match) any = true;
  });
  document.getElementById('empty').classList.toggle('show', !any && !!q);
}

function openTech() {
  document.getElementById('tech-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
}
function closeTech() {
  document.getElementById('tech-modal').style.display = 'none';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ closeCalc(); closeTech(); } });

function openCalc() {
  document.getElementById('calc-modal').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  document.getElementById('c-price').value = '';
  document.getElementById('c-months').value = '';
  document.getElementById('c-rate').value = '';
  document.getElementById('c-down').value = '25';
  document.getElementById('c-err').style.display = 'none';
  document.getElementById('c-res').style.display = 'none';
}
function closeCalc() {
  document.getElementById('calc-modal').style.display = 'none';
  document.body.style.overflow = '';
}
function calcRun() {
  var price   = parseFloat(document.getElementById('c-price').value);
  var months  = parseInt(document.getElementById('c-months').value);
  var rate    = parseFloat(document.getElementById('c-rate').value);
  var downpct = parseFloat(document.getElementById('c-down').value);
  var err = document.getElementById('c-err');
  var res = document.getElementById('c-res');
  err.style.display = 'none';
  res.style.display = 'none';
  if (isNaN(price)  || price  <= 0)            { err.textContent='⚠️ من فضلك أدخل سعر الجهاز'; err.style.display='block'; return; }
  if (isNaN(months) || months<1 || months>36)  { err.textContent='⚠️ عدد الأشهر بين 1 و 36'; err.style.display='block'; return; }
  if (isNaN(downpct)|| downpct<0||downpct>=100){ err.textContent='⚠️ نسبة المقدم بين 0 و 99'; err.style.display='block'; return; }
  if (isNaN(rate)   || rate < 0)               { err.textContent='⚠️ من فضلك أدخل نسبة الفائدة'; err.style.display='block'; return; }
  var down = price * (downpct / 100);
  var rem  = price - down;
  var mr   = (rate / 100 / 12) * months;
  var mo   = (rem * (1 + mr)) / months;
  function fmt(n){ return n.toLocaleString('ar-EG',{minimumFractionDigits:2,maximumFractionDigits:2})+' ج'; }
  document.getElementById('c-downpct-lbl').textContent = downpct;
  document.getElementById('c-r-down').textContent = fmt(down);
  document.getElementById('c-r-mo').textContent   = fmt(mo);
  res.style.display = 'block';
}
var cMethod = 1;

function cSwitchMethod(m) {
  cMethod = m;

  var btn1 = document.getElementById('c-mt1');
  var btn2 = document.getElementById('c-mt2');

  var activeStyle = 'padding:9px 8px;font-family:\'Segoe UI\',Tahoma,Arial,sans-serif;font-size:12px;font-weight:700;border-radius:10px;cursor:pointer;transition:all .2s;background:#3a9ab8;border:1.5px solid #3a9ab8;color:#fff;';
  var inactiveStyle = 'padding:9px 8px;font-family:\'Segoe UI\',Tahoma,Arial,sans-serif;font-size:12px;font-weight:700;border-radius:10px;cursor:pointer;transition:all .2s;background:rgba(234,246,251,0.7);border:1.5px solid rgba(91,184,212,0.55);color:#3a9ab8;';

  btn1.style.cssText = m === 1 ? activeStyle : inactiveStyle;
  btn2.style.cssText = m === 2 ? activeStyle : inactiveStyle;

  document.getElementById('c-field-pct').style.display = m === 1 ? '' : 'none';
  document.getElementById('c-field-amt').style.display = m === 2 ? '' : 'none';

  document.getElementById('c-err').style.display = 'none';
  document.getElementById('c-res').style.display = 'none';
}

/* 🔥 تحويل Live من مبلغ → نسبة */
function cLivePreview() {
  var price = parseFloat(document.getElementById('c-price').value);
  var amt   = parseFloat(document.getElementById('c-down-amt').value);
  var preview = document.getElementById('c-pct-preview');

  if (!isNaN(price) && price > 0 && !isNaN(amt) && amt > 0) {
    var pct = (amt / price) * 100;
    document.getElementById('c-pct-val').textContent = pct.toFixed(1) + '%';

    // 🔥 يملأ حقل النسبة تلقائي
    document.getElementById('c-down').value = pct.toFixed(1);

    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
}

/* 🔥 تحويل Live من نسبة → مبلغ */
function cLiveFromPercent() {
  var price = parseFloat(document.getElementById('c-price').value);
  var pct   = parseFloat(document.getElementById('c-down').value);

  if (!isNaN(price) && price > 0 && !isNaN(pct)) {
    var amt = price * (pct / 100);

    // 🔥 يملأ حقل المبلغ تلقائي
    document.getElementById('c-down-amt').value = amt.toFixed(0);
  }
}

function openCalc() {
  cMethod = 1;

  var m = document.getElementById('calc-modal');
  m.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  document.getElementById('c-price').value = '';
  document.getElementById('c-months').value = '';
  document.getElementById('c-rate').value = '';
  document.getElementById('c-down').value = '25';
  document.getElementById('c-down-amt').value = '';

  document.getElementById('c-pct-preview').style.display = 'none';
  document.getElementById('c-err').style.display = 'none';
  document.getElementById('c-res').style.display = 'none';

  cSwitchMethod(1);
}

function closeCalc() {
  document.getElementById('calc-modal').style.display = 'none';
  document.body.style.overflow = '';
}

function calcRun() {
  var price  = parseFloat(document.getElementById('c-price').value);
  var months = parseInt(document.getElementById('c-months').value);
  var rate   = parseFloat(document.getElementById('c-rate').value);

  var err = document.getElementById('c-err');
  var res = document.getElementById('c-res');

  err.style.display = 'none';
  res.style.display = 'none';

  if (isNaN(price)  || price  <= 0)           { err.textContent='⚠️ من فضلك أدخل سعر الجهاز'; err.style.display='block'; return; }
  if (isNaN(months) || months<1||months>36)   { err.textContent='⚠️ عدد الأشهر بين 1 و 36';  err.style.display='block'; return; }
  if (isNaN(rate)   || rate < 0)              { err.textContent='⚠️ من فضلك أدخل نسبة الفائدة'; err.style.display='block'; return; }

  var down, downpct;

  if (cMethod === 1) {
    downpct = parseFloat(document.getElementById('c-down').value);
    if (isNaN(downpct) || downpct < 0 || downpct >= 100) {
      err.textContent='⚠️ نسبة المقدم بين 0 و 99';
      err.style.display='block';
      return;
    }
    down = price * (downpct / 100);
  } else {
    down = parseFloat(document.getElementById('c-down-amt').value);
    if (isNaN(down) || down < 0 || down >= price) {
      err.textContent='⚠️ المبلغ يجب أن يكون أقل من سعر الجهاز';
      err.style.display='block';
      return;
    }
    downpct = (down / price) * 100;
  }

  var rem = price - down;
  var mr  = (rate / 100 / 12) * months;
  var mo  = (rem * (1 + mr)) / months;

  function fmt(n){
    return n.toLocaleString('ar-EG',{
      minimumFractionDigits:2,
      maximumFractionDigits:2
    })+' ج';
  }

  document.getElementById('c-downpct-lbl').textContent = downpct.toFixed(1);
  document.getElementById('c-r-down').textContent = fmt(down);
  document.getElementById('c-r-mo').textContent   = fmt(mo);

  res.style.display = 'block';
}

/* 🔥 ربط الـ live events */
document.getElementById('c-down-amt').addEventListener('input', cLivePreview);
document.getElementById('c-down').addEventListener('input', cLiveFromPercent);
