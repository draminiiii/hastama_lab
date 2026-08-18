/* Runtime test harness for responsive-tables.js using jsdom.
   Simulates mobile/desktop widths and verifies: card generation, adoption of
   interactive controls, action menu + details sheet, empty/skeleton states,
   mutation re-render, desktop restore, scroll wrapper + sticky classes. */
const { JSDOM } = require('jsdom');
const fs = require('fs');

const JS_SOURCE = fs.readFileSync(require('path').resolve(__dirname, '..', '..', 'app', 'static', 'js', 'responsive-tables.js'), 'utf8');

let pass = 0, fail = 0;
function check(name, cond) {
  if (cond) { pass++; console.log('  ✓ ' + name); }
  else { fail++; console.log('  ✗ FAIL: ' + name); }
}

const HTML = `<!DOCTYPE html><html lang="fa"><body>
<div id="vacationRequestBox" class="management-box">
  <h2>مدیریت درخواست‌های مرخصی</h2>
  <table class="request-table" id="leaveRequestsTable">
    <thead><tr>
      <th class="krbr-morkhc-drkhst">ثبت تغییرات</th>
      <th class="aztrkh-morkhc-drkhst">وضعیت درخواست</th>
      <th class="tatrkh-morkhc-drkhst">جانشین</th>
      <th class="rooz-morkhc-drkhst">تعداد روزها</th>
      <th class="jnshn-morkhc-drkhst">تا تاریخ</th>
      <th class="vaziat-morkhc-drkhst">از تاریخ</th>
      <th class="sabt-morkhc-drkhst">نام کاربر</th>
    </tr></thead>
    <tbody>
      <tr id="row_7">
        <td class="krbr"><button class="update-button" onclick="window.__clickedUpdate=7">تایید تغییرات</button></td>
        <td class="aztrkh"><div class="status-container">
          <div class="status-navbar" id="statusNavbar_7" onclick="window.__toggled=7">انتظار تایید</div>
          <div class="status-dropdown" id="statusDropdown_7" style="display:none">
            <div class="status-option approved" onclick="window.__statusChanged='تایید شده'">تایید شده</div>
          </div>
        </div></td>
        <td>رضایی</td><td>۲</td><td>۱۴۰۳/۰۵/۱۰</td><td>۱۴۰۳/۰۵/۰۸</td><td>علی احمدی</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="management-box" id="userInfoBox">
  <table id="userTable">
    <thead><tr>
      <th class="taghirat">تغییرات</th><th class="janeshin">جانشین</th>
      <th class="saat-kari">ساعت‌های کاری</th><th class="dapart">بخش فعالیت</th>
      <th class="nam-karbr">نام کاربر</th><th class="radif">ردیف</th>
    </tr></thead>
    <tbody>
      <tr>
        <td>
          <form method="POST" class="trash-icon-form" id="form-ali">
            <input type="hidden" name="username" value="علی احمدی">
            <button type="button" class="trash-icon" onclick="window.__deleteClicked=1">
              <img src="/static/images/trash.png" alt="حذف"><span class="tooltip-text-table-del">حذف</span>
            </button>
          </form>
          <button class="edit-btn" onclick="window.__editClicked=1">
            <img src="/static/images/writing.png" alt="ویرایش"><span class="tooltip-text-table">ویرایش</span>
          </button>
        </td>
        <td>محمدی</td><td>۰۸:۰۰ تا ۱۶:۰۰</td><td>امور مالی</td><td>علی احمدی</td><td>۱</td>
      </tr>
    </tbody>
  </table>
</div>

<div class="management-box" id="shiftsBox">
  <table class="request-table" id="shiftsTable">
    <thead><tr><th>تغییرات</th><th>عنوان</th><th>جمعه</th><th>پنج‌شنبه</th><th>چهارشنبه</th><th>سه‌شنبه</th><th>دوشنبه</th><th>یکشنبه</th><th>شنبه</th><th>تا روز</th><th>از روز</th></tr></thead>
    <tbody id="shiftsTableBody">
      <tr><td><button class="edit-btn" onclick="x(1)"><img alt="ویرایش"></button></td><td>شیفت صبح</td><td>تعطیل</td><td>۰۸:۰۰-۱۴:۰۰</td><td>۰۸:۰۰-۱۴:۰۰</td><td>۰۸:۰۰-۱۴:۰۰</td><td>۰۸:۰۰-۱۴:۰۰</td><td>۰۸:۰۰-۱۴:۰۰</td><td>۰۸:۰۰-۱۴:۰۰</td><td>۲۰</td><td>۱</td></tr>
    </tbody>
  </table>
</div>

<div class="management-box" id="hozoorbox">
  <table class="hozoorUsersReport-table" id="hozoorUsersReportTable">
    <thead><tr><th>مجموع زمان حضور</th><th>اضافه کاری</th><th>خروج زود هنگام</th><th>شروع زود هنگام</th><th>تاخیر</th><th>خروج دوم</th><th>ورود دوم</th><th>زمان خروج</th><th>زمان ورود</th><th>روز هفته</th><th>تاریخ ثبت</th></tr></thead>
    <tbody><tr><td>۸:۰۰</td><td>۰</td><td>۰</td><td>۰</td><td>۱۲</td><td>—</td><td>—</td><td>۱۶:۳۵</td><td>۰۸:۱۲</td><td>شنبه</td><td>۱۴۰۳/۰۵/۰۱</td></tr></tbody>
  </table>
</div>

<div class="management-box" id="vacationBox">
  <table class="vacation-table">
    <thead><tr><th>کل مرخصی‌های باقی‌مانده</th><th>کل مرخصی‌های استفاده شده</th><th>نام کاربر</th></tr></thead>
    <tbody><tr><td>۱۲</td><td>۴</td><td>علی احمدی</td></tr></tbody>
  </table>
</div>

<div class="app-shell">
  <div class="panel-card">
    <div class="Jadvale-ticket">
      <table id="ticket-status-table">
        <thead><tr><th class="radif-ticket">ردیف</th><th class="noe-ticket">عنوان درخواست</th><th class="tarikh-ticket">تاریخ درخواست</th><th class="daryaft-ticket">دریافت کننده</th><th class="vazeiyat-ticket">وضعیت</th><th class="tozihat-ticket">توضیحات</th><th class="virayesh-ticket">ویرایش</th></tr></thead>
        <tbody>
          <tr>
            <td class="radif-ticket">۱</td>
            <td class="noe-ticket">مشکل در ورود به سامانه که حل نمی‌شود</td>
            <td class="tarikh-ticket">۱۴۰۳/۰۵/۰۱</td>
            <td class="daryaft-ticket">مدیر آزمایشگاه</td>
            <td class="vazeiyat-ticket" onclick="window.__tdClicked=1">
              <span id="ticket-status">در حال پیگیری</span>
              <div class="dropdown"><div class="goz1" onclick="window.__goz=1">خوانده شده</div></div>
            </td>
            <td class="tozihat-ticket">متن توضیحات طولانی تیکت برای تست clamp</td>
            <td class="virayesh-ticket">
              <button class="trash-btn" onclick="window.__trash=1"><img src="/static/images/trash.png" alt="حذف"><span class="tooltip-text-table-del">حذف</span></button>
              <button class="edit-btn" onclick="window.__edit=1" data-id="5"><img src="/static/images/writing.png" alt="ویرایش"><span class="tooltip-text-table-edit">ویرایش</span></button>
              <button class="check-btn"><img src="/static/images/check-mark.png"><span class="tooltip-text-table-chk">تایید</span></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <div class="report-hour-box"><h2>مشروح گزارش</h2>
    <table id="leaveTable">
      <thead><tr><th class="vazeiyat-morkhc">وضعیت درخواست</th><th class="tedadrooz-morkhc">تعداد روز</th><th class="taTarikh-morkhc">تا تاریخ</th><th class="azTarikh-morkhc">از تاریخ</th><th class="radif-morkhc">ردیف</th></tr></thead>
      <tbody><tr><td class="vazeiyat-morkhc">تایید شده</td><td class="tedadrooz-morkhc">۱</td><td class="taTarikh-morkhc">۱۴۰۳/۰۵/۱۰</td><td class="azTarikh-morkhc">۱۴۰۳/۰۵/۰۹</td><td class="radif-morkhc">۱</td></tr></tbody>
    </table>
  </div>
  <div class="report-hour-box">
    <table class="passsaatiReport-table" id="passsaatiReportTable">
      <thead><tr><th>وضعیت درخواست</th><th>مدت زمان پاس</th><th>عنوان پاس</th><th>تاریخ درخواست</th></tr></thead>
      <tbody></tbody>
    </table>
  </div>
  <div class="popupHozoor-overlay">
    <table id="HozoorTableReport">
      <thead><tr><th class="vazeiyat-hozoorTime">وضعیت</th><th class="zmnkhrj-hozoorTime">زمان خروج</th><th class="zmnvrd-hozoorTime">زمان ورود</th><th class="trkhsbt-hozoorTime">تاریخ ثبت</th><th class="radif-hozoorTime">ردیف</th></tr></thead>
      <tbody><tr><td class="vazeiyat-hozoorTime">حاضر</td><td class="zmnkhrj-hozoorTime">۱۶:۳۵</td><td class="zmnvrd-hozoorTime">۰۸:۱۲</td><td class="trkhsbt-hozoorTime">۱۴۰۳/۰۵/۰۱</td><td class="radif-hozoorTime">۱</td></tr></tbody>
    </table>
  </div>
</div>

<div class="print-page">
  <table class="individual-report-table">
    <thead><tr><th>جانشین</th><th>تعداد روز</th><th>تا تاریخ</th><th>از تاریخ</th><th>ردیف</th></tr></thead>
    <tbody id="reportTableBody"></tbody>
  </table>
  <table class="individual-report-table" id="PasseSaatiReportTable">
    <thead><tr><th>مدت زمان پاس</th><th>عنوان پاس</th><th>تاریخ درخواست</th><th>ردیف</th></tr></thead>
    <tbody><tr><td>۴۵ دقیقه</td><td>امور اداری</td><td>۱۴۰۳/۰۵/۰۲</td><td>۱</td></tr></tbody>
  </table>
</div>
</body></html>`;

/* ---- media query stub with controllable width ---- */
function makeDom() {
  const dom = new JSDOM(HTML.replace('</body></html>', ''), {
    pretendToBeVisual: true,
    url: 'https://lab.test/panel',
    runScripts: 'dangerously'
  });
  const w = dom.window;
  let width = 1200;
  const listeners = new Set();
  w.matchMedia = function (q) {
    const mq = {
      media: q,
      addEventListener: (t, fn) => { if (t === 'change') listeners.add({ q, fn }); },
      removeEventListener: () => {},
      addListener: (fn) => listeners.add({ q, fn }),
      removeListener: () => {}
    };
    Object.defineProperty(mq, 'matches', {
      get: () => { const digits = String(q).replace(/[^0-9]/g, ''); return digits ? width <= Number(digits) : false; }
    });
    return mq;
  };
  w.__setWidth = (nw) => {
    const prev = width; width = nw;
    if (prev === nw) return;
    listeners.forEach(({ q, fn }) => fn({ matches: w.matchMedia(q).matches }));
  };
  const s = w.document.createElement('script');
  s.textContent = JS_SOURCE;
  w.document.body.appendChild(s);
  return dom;
}

(async () => {
  console.log('— Desktop first (1200px)');
  const dom = makeDom();
  const w = dom.window, d = w.document;
  await new Promise(r => setTimeout(r, 30));
  check('no mobile view on desktop', !d.querySelector('.rt-view:not([hidden])'));
  check('scroll wrapper created even on desktop (harmless)', !!d.querySelector('#shiftsTable') && d.querySelector('#shiftsTable').closest('.rt-scroll') !== null);
  check('source tables visible on desktop', d.querySelector('#leaveRequestsTable').offsetParent !== null || !d.querySelector('#leaveRequestsTable').classList.contains('rt-source-hidden'));
  check('keep table untouched (no cards)', !d.querySelector('.vacation-table').classList.contains('rt-source-hidden'));

  console.log('— Switch to mobile (390px)');
  w.__setWidth(390);
  await new Promise(r => setTimeout(r, 60));

  /* --- cards: leave requests (admin) --- */
  const leaveView = d.querySelector('#leaveRequestsTable').nextElementSibling;
  check('leaveRequestsTable: view created & shown', leaveView && leaveView.classList.contains('rt-view') && !leaveView.hasAttribute('hidden'));
  check('leaveRequestsTable: source table hidden', d.querySelector('#leaveRequestsTable').classList.contains('rt-source-hidden'));
  const card = leaveView.querySelector('.rt-card');
  check('card rendered', !!card);
  check('card title = employee name', card && card.querySelector('.rt-card__title').textContent === 'علی احمدی');
  check('interactive status control adopted into head', card && !!card.querySelector('.rt-card__head .status-container'));
  check('status navbar still has id + onclick handler', card && card.querySelector('#statusNavbar_7') && card.querySelector('#statusNavbar_7').getAttribute('onclick') !== null);
  const statusCell = d.querySelector('#leaveRequestsTable tbody tr td.aztrkh');
  check('status cell emptied in source (moved not copied)', statusCell && statusCell.textContent.trim() === '');

  /* interactive handlers still work */
  card.querySelector('#statusNavbar_7').click();
  check('adopted status onclick handler fires', w.__toggled === 7);

  /* primary action */
  const primaryBtn = card.querySelector('.rt-actions .rt-btn--primary');
  check('primary action (تایید تغییرات) present', primaryBtn && /تایید تغییرات/.test(primaryBtn.textContent));
  primaryBtn.click();
  check('primary action handler fires', w.__clickedUpdate === 7);

  /* all 4 data fields are on the card -> no details button needed for this table */
  check('card shows 4 visible fields (incl جانشین)', card.querySelectorAll('.rt-card__fields .rt-field').length === 4);
  check('no details button when nothing is hidden', !card.querySelector('.rt-card__details'));
  /* details flow verified via ticket card below (توضیحات is secondary there) */

  /* --- list pattern: userTable --- */
  const userView = d.querySelector('#userTable').nextElementSibling;
  const listRow = userView && userView.querySelector('.rt-list__row');
  check('userTable: compact list row', !!listRow);
  check('userTable: title', listRow && listRow.querySelector('.rt-list__title').textContent === 'علی احمدی');
  check('userTable: meta line has department', listRow && /امور مالی/.test(listRow.querySelector('.rt-list__meta').textContent));
  check('userTable: edit primary action', listRow && !!listRow.querySelector('.rt-actions .edit-btn'));
  listRow.querySelector('.rt-actions .edit-btn').click();
  check('userTable: edit handler fires', w.__editClicked === 1);
  const menuBtn = listRow.querySelector('.rt-actions-menu-btn');
  check('userTable: more-actions (⋮) button', !!menuBtn);
  menuBtn.click();
  await new Promise(r => setTimeout(r, 30));
  check('menu sheet opened with delete form', !!d.querySelector('.rt-sheet .rt-menu .trash-icon-form'));
  /* delete via menu */
  d.querySelector('.rt-sheet .rt-menu .trash-icon').click();
  check('menu delete handler fires', w.__deleteClicked === 1);
  d.querySelector('.rt-sheet .rt-sheet__close').click();
  await new Promise(r => setTimeout(r, 250));
  check('menu closed, delete form rescued back into card pool', !!userView.querySelector('.rt-actions-pool .trash-icon-form'));

  /* --- scroll patterns --- */
  const shifts = d.querySelector('#shiftsTable');
  check('shiftsTable wrapped in .rt-scroll', shifts.closest('.rt-scroll') !== null);
  check('shiftsTable first column sticky (actions)', shifts.querySelector('thead th').classList.contains('rt-sticky--s1'));
  const hozoorAdmin = d.querySelector('#hozoorbox #hozoorUsersReportTable');
  check('admin hozoor: last column sticky (date)', hozoorAdmin.querySelector('tbody td:last-child').classList.contains('rt-sticky--e1'));
  check('vacation-table (keep) NOT hidden', !d.querySelector('.vacation-table').classList.contains('rt-source-hidden'));

  /* --- user panel cards (bp 860) --- */
  const ticketTable = d.querySelector('#ticket-status-table');
  const ticketView = ticketTable.nextElementSibling;
  check('ticket table: view hidden at 390? (bp=860 → active)', ticketView && !ticketView.hasAttribute('hidden'));
  const tcard = ticketView.querySelector('.rt-card');
  check('ticket card title = subject', tcard && /ورود به سامانه/.test(tcard.querySelector('.rt-card__title').textContent));
  check('ticket card: adopted status chip with dropdown', tcard && !!tcard.querySelector('.rt-card__status .dropdown'));
  check('ticket card: adopted wrapper carries td class for closest()', tcard && !!tcard.querySelector('.rt-adopted.vazeiyat-ticket'));
  /* clicking chip wrapper should trigger the copied td onclick */
  tcard.querySelector('.rt-card__status').click();
  check('ticket status chip onclick (copied from td) fires', w.__tdClicked === 1);
  /* primary + more menu with trash & check */
  check('ticket card: edit is primary', tcard && !!tcard.querySelector('.rt-actions .edit-btn.rt-btn--primary'));
  const tmenu = tcard.querySelector('.rt-actions-menu-btn');
  tmenu.click();
  await new Promise(r => setTimeout(r, 30));
  check('ticket menu contains trash + check', d.querySelectorAll('.rt-sheet .rt-menu .rt-menu__item').length >= 2);
  d.querySelector('.rt-sheet .rt-menu .trash-btn').click();
  check('ticket menu trash handler fires', w.__trash === 1);
  d.querySelector('.rt-sheet .rt-sheet__close').click();
  await new Promise(r => setTimeout(r, 250));
  /* ticket details sheet contains توضیحات */
  tcard.querySelector('.rt-card__details').click();
  await new Promise(r => setTimeout(r, 30));
  check('ticket details shows توضیحات field', Array.from(d.querySelectorAll('.rt-sheet .rt-field__label')).some(x => x.textContent === 'توضیحات'));
  d.querySelector('.rt-sheet .rt-sheet__close').click();
  await new Promise(r => setTimeout(r, 250));

  /* badge for static status */
  const leavePView = d.querySelector('#leaveTable').nextElementSibling;
  const badge = leavePView.querySelector('.rt-card .rt-badge');
  check('leaveTable: badge rendered with text', badge && badge.textContent.trim() === 'تایید شده');
  check('leaveTable: badge has icon svg + approved class', badge && badge.classList.contains('rt-badge--approved') && !!badge.querySelector('svg'));

  const hozoorView = d.querySelector('#HozoorTableReport').nextElementSibling;
  const hbadge = hozoorView.querySelector('.rt-card .rt-badge');
  check('HozoorTableReport: حاضر → approved badge', hbadge && hbadge.classList.contains('rt-badge--approved'));

  /* empty state */
  const passView = d.querySelector('#passsaatiReportTable').nextElementSibling;
  check('empty state shown for empty table', passView && !!passView.querySelector('.rt-empty'));

  /* report page table via tbody selector */
  const repTable = d.querySelector('#reportTableBody').closest('table');
  check('report table (#reportTableBody) got view', repTable.nextElementSibling && repTable.nextElementSibling.classList.contains('rt-view'));
  check('report table shows empty state', !!repTable.nextElementSibling.querySelector('.rt-empty'));

  /* --- mutation-driven re-render (same data source) --- */
  const tr = d.createElement('tr');
  tr.innerHTML = '<td>در انتظار</td><td>۳۰ دقیقه</td><td>امور اداری</td><td>۱۴۰۳/۰۵/۰۳</td>';
  d.querySelector('#passsaatiReportTable tbody').appendChild(tr);
  await new Promise(r => setTimeout(r, 80));
  check('mutation: card appears after row added', !!passView.querySelector('.rt-card') && !passView.querySelector('.rt-empty'));

  /* --- skeleton via fetch interceptor --- */
  w.fetch = function () { return Promise.resolve({ json: () => Promise.resolve([]) }); };
  const origFetch = w.fetch;
  w.fetch = undefined; // re-hook: our lib wrapped already-loaded fetch; simulate via RT API instead
  w.RT.setLoading('#passsaatiReportTable', true);
  await new Promise(r => setTimeout(r, 50));
  d.querySelector('#passsaatiReportTable tbody').innerHTML = '';
  await new Promise(r => setTimeout(r, 50));
  check('skeleton shown while loading with empty data', !!passView.querySelector('.rt-skeleton-card'));
  w.RT.setLoading('#passsaatiReportTable', false);
  await new Promise(r => setTimeout(r, 50));
  check('after loading=false → empty state returns', !!passView.querySelector('.rt-empty'));

  /* --- back to desktop: restore --- */
  console.log('— Back to desktop (1200px)');
  w.__setWidth(1200);
  await new Promise(r => setTimeout(r, 60));
  check('view hidden on desktop', leaveView.hasAttribute('hidden'));
  check('source table visible again', !d.querySelector('#leaveRequestsTable').classList.contains('rt-source-hidden'));
  const restoredStatus = d.querySelector('#leaveRequestsTable tbody tr td.aztrkh .status-container');
  check('status control restored into its cell', !!restoredStatus);
  check('restore removed mobile-injected classes from primary button', !d.querySelector('#leaveRequestsTable .update-button.rt-btn'));
  const restoredEdit = d.querySelector('#userTable .edit-btn');
  check('userTable edit button restored', !!restoredEdit && !!restoredEdit.closest('td'));
  check('delete form restored inside userTable', !!d.querySelector('#userTable .trash-icon-form'));


  /* ---------- Extra: breakpoints, tablet, clamp, show-more ---------- */
  console.log('- Extra: breakpoints / tablet / clamp / chunking');
  w.__setWidth(390);
  await new Promise(r => setTimeout(r, 60));

  /* show-more chunking: add 45 more rows to leaveRequestsTable */
  const lb = d.querySelector('#leaveRequestsTable tbody');
  for (let i = 0; i < 45; i++) {
    const tr2 = d.createElement('tr');
    tr2.innerHTML = '<td><button class="update-button">تایید</button></td><td>تایید شده</td><td>—</td><td>۱</td><td>۱۴۰۳/۰۶/۰۱</td><td>۱۴۰۳/۰۵/۳۰</td><td>کاربر ' + i + '</td>';
    lb.appendChild(tr2);
  }
  await new Promise(r => setTimeout(r, 100));
  check('chunking: only first 40 cards rendered', leaveView.querySelectorAll('.rt-card').length === 40);
  const moreBtn2 = leaveView.querySelector('.rt-more');
  check('chunking: show-more button exists', !!moreBtn2);
  if (moreBtn2) { moreBtn2.click(); await new Promise(r => setTimeout(r, 60)); }
  check('chunking: after click all 46 cards rendered', leaveView.querySelectorAll('.rt-card').length === 46);

  /* long text clamp */
  const tr3 = d.createElement('tr');
  tr3.innerHTML = '<td><button class="update-button">ت</button></td><td>در انتظار</td><td>متن توضیحات بسیار طولانی برای آزمایش محدودسازی متن در کارت موبایل که باید فقط دو خط نمایش داده شود و بقیه در جزئیات دیده شود</td><td>۱</td><td>۱</td><td>۱</td><td>کاربر بلند</td>';
  lb.appendChild(tr3);
  await new Promise(r => setTimeout(r, 80));
  check('long text gets clamp treatment', !!leaveView.querySelector('.rt-field__value.rt-clamp'));

  /* tablet 800px: admin cards off (bp 768), user panel cards on (bp 860) */
  w.__setWidth(800);
  await new Promise(r => setTimeout(r, 60));
  check('tablet 800px: admin cards inactive (view hidden)', leaveView.hasAttribute('hidden'));
  check('tablet 800px: admin table visible', !d.querySelector('#leaveRequestsTable').classList.contains('rt-source-hidden'));
  const ticketView2 = d.querySelector('#ticket-status-table').nextElementSibling;
  check('tablet 800px: user-panel cards still active (bp 860)', !ticketView2.hasAttribute('hidden'));

  /* 861px: user panel back to desktop table */
  w.__setWidth(861);
  await new Promise(r => setTimeout(r, 60));
  check('861px: user-panel cards inactive', ticketView2.hasAttribute('hidden'));
  check('861px: user-panel table restored with dropdown back in td', !!d.querySelector('#ticket-status-table .vazeiyat-ticket .dropdown'));

  w.__setWidth(390);
  await new Promise(r => setTimeout(r, 60));

  console.log('\\n' + pass + ' passed, ' + fail + ' failed');
  process.exit(fail ? 1 : 0);
})().catch(e => { console.error('HARNESS ERROR', e); process.exit(2); });
