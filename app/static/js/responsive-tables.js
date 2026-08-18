/* ==========================================================================
 * responsive-tables.js — لایه نمایش ریسپانسیو جدول‌ها (کارت/لیست موبایل)
 * --------------------------------------------------------------------------
 * معماری: داده و منطق فقط یک‌بار و فقط در جدول اصلی (دسکتاپ) زندگی می‌کند.
 * این ماژول در عرض موبایل، از همان ردیف‌های <tbody> جدول، نمای کارت می‌سازد:
 *   - هیچ درخواست API یا منطق تکراری‌ای وجود ندارد.
 *   - اکشن‌های کارت به المان‌های اصلی جدول Forward می‌شوند (onclick همان
 *     المان اصلی اجرا می‌شود، نه نسخه کلون).
 *   - با MutationObserver هر تغییری در tbody (پر شدن از طریق fetch، تغییر
 *     وضعیت و ...) به‌صورت خودکار در کارت‌ها بازتاب می‌یابد.
 *   - در عرض دسکتاپ هیچ DOM اضافه‌ای ساخته نمی‌شود و جدول دست‌نخورده می‌ماند.
 * ========================================================================== */
(function () {
    'use strict';

    // نگاشت متن وضعیت‌ها به کلاس رنگ نشان
    var STATUS_MAP = [
        { keys: ['تایید شده', 'تأیید شده', 'پاسخ داده شده', 'خوانده شده', 'حاضر', 'فعال', 'تکمیل'], cls: 'rt-badge--ok' },
        { keys: ['انتظار', 'در حال پیگیری', 'ارسال شده', 'بررسی', 'معلق', 'pending'], cls: 'rt-badge--warn' },
        { keys: ['رد شده', 'انصراف', 'غایب', 'غیر فعال', 'غیرفعال', 'لغو'], cls: 'rt-badge--bad' },
        { keys: ['تاخیر', 'مرخصی', 'اضافه کاری', 'باز', 'ویرایش'], cls: 'rt-badge--info' }
    ];

    var RT = {
        bp: 768,
        mq: null,
        active: false,
        tables: [],
        observer: null,
        rebuildTimers: new WeakMap(),
        openPopoverEl: null,
        openBackdropEl: null
    };

    /* ------------------------------------------------------------------ */
    /* ابزارها                                                             */
    /* ------------------------------------------------------------------ */

    function isInteractive(el) {
        if (!el || el.nodeType !== 1) return false;
        var tag = el.tagName;
        return tag === 'BUTTON' || tag === 'A' || tag === 'SELECT' || tag === 'INPUT' ||
            el.hasAttribute('onclick') || el.getAttribute('role') === 'button';
    }

    function visibleText(el) {
        if (!el) return '';
        return (el.textContent || '').replace(/\s+/g, ' ').trim();
    }

    function isCellVisible(cell) {
        if (!cell) return false;
        if (cell.style && cell.style.display === 'none') return false;
        return true;
    }

    function statusClassOf(text) {
        var t = (text || '').trim();
        for (var i = 0; i < STATUS_MAP.length; i++) {
            var bucket = STATUS_MAP[i];
            for (var j = 0; j < bucket.keys.length; j++) {
                if (t.indexOf(bucket.keys[j]) !== -1) return bucket.cls;
            }
        }
        return '';
    }

    function stripIds(root) {
        if (root.nodeType === 1 && root.removeAttribute) root.removeAttribute('id');
        var nodes = root.querySelectorAll ? root.querySelectorAll('[id]') : [];
        for (var i = 0; i < nodes.length; i++) nodes[i].removeAttribute('id');
    }

    function ariaLabelOf(el, fallback) {
        var img = el.querySelector && el.querySelector('img[alt]');
        var alt = img ? (img.getAttribute('alt') || '').trim() : '';
        var tooltip = el.querySelector && el.querySelector('[class*="tooltip"]');
        var tip = tooltip ? visibleText(tooltip) : '';
        var txt = visibleText(el);
        var label = alt || tip || txt || fallback || 'عملیات';
        return label;
    }

    /* ------------------------------------------------------------------ */
    /* پاپ‌اور (منوی ⋯ و منوی انتخاب وضعیت)                                */
    /* ------------------------------------------------------------------ */

    function closePopover() {
        if (RT.openPopoverEl) { RT.openPopoverEl.remove(); RT.openPopoverEl = null; }
        if (RT.openBackdropEl) { RT.openBackdropEl.remove(); RT.openBackdropEl = null; }
        document.removeEventListener('keydown', onPopoverKey, true);
    }

    function onPopoverKey(e) {
        if (e.key === 'Escape') closePopover();
    }

    /**
     * entries: [{ label, html, onChoose }]
     */
    function openPopover(anchorEl, entries) {
        closePopover();
        var backdrop = document.createElement('div');
        backdrop.className = 'rt-popover-backdrop';
        backdrop.addEventListener('click', closePopover);
        backdrop.addEventListener('touchend', function (e) { e.preventDefault(); closePopover(); }, { passive: false });

        var pop = document.createElement('div');
        pop.className = 'rt-popover';
        pop.setAttribute('role', 'menu');
        pop.setAttribute('dir', 'rtl');

        entries.forEach(function (entry) {
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'rt-popover-option';
            btn.setAttribute('role', 'menuitem');
            if (entry.html) btn.innerHTML = entry.html;
            else btn.textContent = entry.label;
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                closePopover();
                entry.onChoose();
            });
            pop.appendChild(btn);
        });

        document.body.appendChild(backdrop);
        document.body.appendChild(pop);

        // موقعیت‌دهی آگاه از RTL و محدوده ویوپورت
        var rect = anchorEl.getBoundingClientRect();
        var vw = document.documentElement.clientWidth;
        var vh = document.documentElement.clientHeight;
        pop.style.visibility = 'hidden';
        var pw = pop.offsetWidth, ph = pop.offsetHeight;
        var left = rect.right - pw;
        left = Math.max(8, Math.min(left, vw - pw - 8));
        var top = rect.bottom + 6;
        if (top + ph > vh - 8) top = Math.max(8, rect.top - ph - 6);
        pop.style.left = left + 'px';
        pop.style.top = top + 'px';
        pop.style.visibility = 'visible';

        RT.openPopoverEl = pop;
        RT.openBackdropEl = backdrop;
        document.addEventListener('keydown', onPopoverKey, true);
    }

    /* ------------------------------------------------------------------ */
    /* ساخت اکشن‌ها: کلون + فوروارد به المان اصلی                          */
    /* ------------------------------------------------------------------ */

    function collectInteractives(cell) {
        var filtered = [];
        var all = cell.querySelectorAll('button, a, select, input, [onclick]');
        for (var i = 0; i < all.length; i++) {
            var el = all[i];
            if (el.closest('[id]') && el.closest('[id]').id && el.closest('[id]').id.indexOf('statusDropdown') !== -1) continue;
            if (el.classList.contains('status-dropdown') || el.closest('.status-dropdown')) continue;
            if (el.classList.contains('dropdown') || (el.closest('.dropdown') && !el.classList.contains('status-navbar'))) continue;
            filtered.push(el);
        }
        return filtered.filter(function (el) {
            var p = el.parentElement;
            while (p && p !== cell) {
                if (filtered.indexOf(p) !== -1) return false;
                p = p.parentElement;
            }
            return true;
        });
    }

    function bindForward(cloneEl, originalEl) {
        cloneEl.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            closePopover();
            originalEl.click();
        });
    }

    function buildActions(card, actionsCell) {
        var interactives = collectInteractives(actionsCell);
        if (!interactives.length) return;

        var box = document.createElement('div');
        box.className = 'rt-actions';

        function makeClone(orig, extraCls) {
            var source = (orig.tagName === 'IMG' && orig.closest('button')) ? orig.closest('button') : orig;
            var c = source.cloneNode(true);
            stripIds(c);
            c.removeAttribute('onclick');
            var innerHandlers = c.querySelectorAll('[onclick]');
            for (var k = 0; k < innerHandlers.length; k++) innerHandlers[k].removeAttribute('onclick');
            c.classList.add('rt-cloned-action');
            if (extraCls) extraCls.split(' ').forEach(function (x) { if (x) c.classList.add(x); });
            c.setAttribute('aria-label', ariaLabelOf(orig));
            bindForward(c, orig);
            return c;
        }

        if (interactives.length <= 3) {
            interactives.forEach(function (orig) { box.appendChild(makeClone(orig)); });
        } else {
            var primary = null;
            for (var i = 0; i < interactives.length; i++) {
                var lbl = ariaLabelOf(interactives[i]);
                if (/مشاهده|نمایش/.test(lbl)) { primary = interactives[i]; break; }
            }
            if (!primary) primary = interactives[0];
            box.appendChild(makeClone(primary, 'rt-action-primary'));

            var rest = interactives.filter(function (x) { return x !== primary; });
            var more = document.createElement('button');
            more.type = 'button';
            more.className = 'rt-action-more';
            more.setAttribute('aria-label', 'اقدامات بیشتر');
            more.setAttribute('aria-haspopup', 'menu');
            more.textContent = '⋯';
            more.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                openPopover(more, rest.map(function (orig) {
                    return {
                        label: ariaLabelOf(orig),
                        onChoose: function () { orig.click(); }
                    };
                }));
            });
            box.appendChild(more);
        }

        card.appendChild(box);
    }

    /* ------------------------------------------------------------------ */
    /* نشان وضعیت با منوی وضعیت (در صورت وجود dropdown داخل سلول)          */
    /* ------------------------------------------------------------------ */

    function statusOptionsOf(badgeCell) {
        var menu = badgeCell.querySelector('.status-dropdown');
        if (menu) return Array.prototype.slice.call(menu.querySelectorAll('.status-option'));
        var d = badgeCell.querySelector('.dropdown');
        if (d) return Array.prototype.slice.call(d.children).filter(function (n) { return n.nodeType === 1; });
        return [];
    }

    function buildBadge(card, badgeCell) {
        var statusText = '';
        var navbar = badgeCell.querySelector('.status-navbar, #ticket-status, [id^="ticket-status"]');
        if (navbar) statusText = visibleText(navbar);
        if (!statusText) {
            var clone = badgeCell.cloneNode(true);
            var dd = clone.querySelector('.status-dropdown, .dropdown');
            if (dd) dd.remove();
            statusText = visibleText(clone);
        }
        if (!statusText) return;

        var options = statusOptionsOf(badgeCell);
        var badge = document.createElement(options.length ? 'button' : 'span');
        badge.className = ('rt-badge ' + statusClassOf(statusText)).trim();
        if (options.length) {
            badge.type = 'button';
            badge.setAttribute('aria-haspopup', 'menu');
            badge.setAttribute('aria-label', 'وضعیت: ' + statusText + ' — برای تغییر لمس کنید');
            badge.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                openPopover(badge, options.map(function (opt) {
                    return {
                        label: visibleText(opt),
                        onChoose: function () { opt.click(); }
                    };
                }));
            });
        } else {
            badge.setAttribute('aria-label', 'وضعیت: ' + statusText);
        }
        var txt = document.createElement('span');
        txt.textContent = statusText;
        badge.appendChild(txt);
        return badge;
    }

    /* ------------------------------------------------------------------ */
    /* هسته ساخت کارت‌ها                                                   */
    /* ------------------------------------------------------------------ */

    function rolesOf(table) {
        var roles = [];
        var ths = table.querySelectorAll('thead th');
        for (var i = 0; i < ths.length; i++) {
            var th = ths[i];
            roles.push({
                role: th.getAttribute('data-rt-role') || 'field',
                label: visibleText(th)
            });
        }
        return roles;
    }

    function buildCard(table, row, roles, entity) {
        var cells = row.cells;
        var data = { title: '', notice: '', badgeCell: null, actionsCell: null, fields: [], details: [] };

        var roleCursor = 0;
        for (var i = 0; i < cells.length && roleCursor < roles.length; i++) {
            var cell = cells[i];
            if (!isCellVisible(cell)) continue;

            if (cell.colSpan > 1 && cells.length < roles.length) {
                data.notice = visibleText(cell);
                break;
            }

            var meta = roles[roleCursor++];
            var text = visibleText(cell);

            switch (meta.role) {
                case 'hide':
                    break;
                case 'title':
                    if (text) data.title = text;
                    break;
                case 'badge':
                    data.badgeCell = cell;
                    break;
                case 'actions':
                    data.actionsCell = cell;
                    break;
                case 'detail':
                    if (text) data.details.push({ label: meta.label, value: text });
                    break;
                default:
                    if (text) data.fields.push({ label: meta.label, value: text });
            }
        }

        if (data.notice) {
            var noticeCard = document.createElement('article');
            noticeCard.className = 'rt-card rt-card--notice';
            noticeCard.textContent = data.notice;
            return noticeCard;
        }

        var hasAction = data.actionsCell && collectInteractives(data.actionsCell).length > 0;
        var badgeText = data.badgeCell ? visibleText(data.badgeCell) : '';
        if (!data.title && !data.fields.length && !badgeText && !hasAction) return null;

        if (!data.title) {
            data.title = data.fields.length ? data.fields[0].value : (entity || 'رکورد');
        }

        var card = document.createElement('article');
        card.className = 'rt-card';
        card.setAttribute('aria-label', data.title);

        var head = document.createElement('div');
        head.className = 'rt-card-head';
        var title = document.createElement('h4');
        title.className = 'rt-title';
        title.textContent = data.title;
        head.appendChild(title);
        if (data.badgeCell) {
            var badge = buildBadge(card, data.badgeCell);
            if (badge) head.appendChild(badge);
        }
        card.appendChild(head);

        if (data.fields.length) {
            var fields = document.createElement('div');
            fields.className = 'rt-fields';
            data.fields.forEach(function (f) {
                var rowEl = document.createElement('div');
                rowEl.className = 'rt-field';
                var l = document.createElement('span');
                l.className = 'rt-field-label';
                l.textContent = f.label;
                var v = document.createElement('span');
                v.className = 'rt-field-value';
                v.textContent = f.value;
                v.title = f.value;
                rowEl.appendChild(l);
                rowEl.appendChild(v);
                fields.appendChild(rowEl);
            });
            card.appendChild(fields);
        }

        if (hasAction) buildActions(card, data.actionsCell);

        if (data.details.length) {
            var toggle = document.createElement('button');
            toggle.type = 'button';
            toggle.className = 'rt-details-toggle';
            toggle.setAttribute('aria-expanded', 'false');
            toggle.innerHTML = '<span class="rt-details-toggle-text">جزئیات بیشتر</span><span class="rt-caret">▾</span>';

            var details = document.createElement('div');
            details.className = 'rt-details';
            data.details.forEach(function (f) {
                var rowEl = document.createElement('div');
                rowEl.className = 'rt-field';
                var l = document.createElement('span');
                l.className = 'rt-field-label';
                l.textContent = f.label;
                var v = document.createElement('span');
                v.className = 'rt-field-value';
                v.textContent = f.value;
                rowEl.appendChild(l);
                rowEl.appendChild(v);
                details.appendChild(rowEl);
            });

            toggle.addEventListener('click', function () {
                var open = details.classList.toggle('rt-open');
                toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
                toggle.querySelector('.rt-details-toggle-text').textContent = open ? 'پنهان کردن جزئیات' : 'جزئیات بیشتر';
            });

            card.appendChild(toggle);
            card.appendChild(details);
        }

        return card;
    }

    function renderTable(entry) {
        if (!RT.active) return;
        var table = entry.table;
        var list = entry.list;
        closePopover();

        list.innerHTML = '';
        var roles = rolesOf(table);
        var rows = table.tBodies.length ? table.tBodies[0].rows : [];
        var made = 0;

        for (var i = 0; i < rows.length; i++) {
            var card = buildCard(table, rows[i], roles, entry.entity);
            if (card) { list.appendChild(card); made++; }
        }

        if (!made) {
            var empty = document.createElement('div');
            empty.className = 'rt-empty';
            empty.innerHTML = '<strong>رکوردی یافت نشد</strong><span>هنوز داده‌ای برای نمایش وجود ندارد</span>';
            list.appendChild(empty);
        }
        list.style.display = '';
    }

    function scheduleRender(entry) {
        var t = RT.rebuildTimers.get(entry.table);
        if (t) clearTimeout(t);
        RT.rebuildTimers.set(entry.table, setTimeout(function () {
            renderTable(entry);
        }, 120));
    }

    /* ------------------------------------------------------------------ */
    /* فعال‌سازی / غیرفعال‌سازی                                            */
    /* ------------------------------------------------------------------ */

    function activate() {
        if (RT.active) return;
        RT.active = true;
        document.body.classList.add('rt-responsive-active');

        RT.tables = [];
        var tables = document.querySelectorAll('table[data-rt-pattern]');
        tables.forEach(function (table) {
            var pattern = table.getAttribute('data-rt-pattern');
            if (pattern === 'card') {
                table.setAttribute('data-rt-table', '');
                table.classList.add('rt-table-hidden');

                var list = document.createElement('div');
                list.className = 'rt-cardlist';
                list.setAttribute('data-rt-owner', table.id || table.className);
                table.parentNode.insertBefore(list, table.nextSibling);

                var entry = { table: table, list: list, entity: table.getAttribute('data-rt-label') || 'رکورد' };
                RT.tables.push(entry);
                renderTable(entry);

                var obs = new MutationObserver(function () { scheduleRender(entry); });
                obs.observe(table, {
                    childList: true,
                    subtree: true,
                    characterData: true,
                    attributes: true,
                    attributeFilter: ['style', 'class']
                });
                entry.observer = obs;
            } else if (pattern === 'scroll') {
                var wrap = table.closest('.table-container, .table-scroll, .Jadvale-ticket, .management-box, .hozoorBox, .ezafeBox, .passBox, .hourlyPassBox, div');
                if (wrap && !wrap.querySelector(':scope > .rt-scrollhint')) {
                    var hint = document.createElement('div');
                    hint.className = 'rt-scrollhint';
                    hint.setAttribute('aria-hidden', 'true');
                    hint.textContent = 'برای دیدن ستون‌های بیشتر، جدول را به چپ و راست بکشید ⇄';
                    wrap.insertBefore(hint, wrap.firstChild);
                }
            }
        });
    }

    function deactivate() {
        if (!RT.active) return;
        RT.active = false;
        closePopover();
        document.body.classList.remove('rt-responsive-active');

        RT.tables.forEach(function (entry) {
            if (entry.observer) entry.observer.disconnect();
            entry.table.classList.remove('rt-table-hidden');
            if (entry.list && entry.list.parentNode) entry.list.parentNode.removeChild(entry.list);
        });
        RT.tables = [];

        document.querySelectorAll('.rt-scrollhint').forEach(function (h) { h.remove(); });
    }

    function check() {
        if (RT.mq.matches) activate();
        else deactivate();
    }

    function boot() {
        RT.bp = document.querySelector('.app-shell') ? 860 : 768;
        RT.mq = window.matchMedia('screen and (max-width: ' + RT.bp + 'px)');
        if (RT.mq.addEventListener) RT.mq.addEventListener('change', check);
        else if (RT.mq.addListener) RT.mq.addListener(check);

        if (document.querySelector('table[data-rt-pattern]')) check();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
