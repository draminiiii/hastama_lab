(() => {
    'use strict';

    const STATUS_LABELS = {
        new: 'جدید', open: 'باز', in_progress: 'در حال بررسی',
        waiting_for_user: 'در انتظار کاربر', waiting_for_support: 'در انتظار پشتیبانی',
        resolved: 'حل‌شده', closed: 'بسته‌شده'
    };
    const PRIORITY_LABELS = { low: 'کم', normal: 'عادی', high: 'زیاد', urgent: 'فوری' };
    const LEGACY_STATUS = {
        'ارسال شده': 'new', 'در حال پیگیری': 'in_progress', 'خوانده شده': 'open',
        'پاسخ داده شده': 'waiting_for_user'
    };
    const state = {
        admin: { page: 1, view: '', search: '', priority: '', sort: 'newest', detail: null, loading: false },
        user: { page: 1, status: '', search: '', priority: '', detail: null, sending: false }
    };

    const fa = new Intl.NumberFormat('fa-IR');
    const $ = (selector, root = document) => root.querySelector(selector);
    const all = (selector, root = document) => Array.from(root.querySelectorAll(selector));
    const text = (value) => String(value ?? '').trim();

    async function api(url, options = {}) {
        const config = { credentials: 'same-origin', ...options, headers: { Accept: 'application/json', ...(options.headers || {}) } };
        if (config.body && typeof config.body !== 'string') {
            config.headers['Content-Type'] = 'application/json';
            config.body = JSON.stringify(config.body);
        }
        const response = await fetch(url, config);
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.detail || payload.error || payload.message || 'درخواست انجام نشد.');
        return payload;
    }

    function node(tag, className, content) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (content !== undefined) element.textContent = content;
        return element;
    }

    function badge(label, kind) {
        return node('span', `ticket-workspace-badge ticket-workspace-badge--${kind || 'neutral'}`, label);
    }

    function ticketStatus(ticket) {
        const value = text(ticket.status || ticket.ticket_status);
        return STATUS_LABELS[value] ? value : (LEGACY_STATUS[value] || 'new');
    }

    function priorityKind(value) { return text(value || 'normal'); }

    function formatDate(value) {
        if (!value) return '—';
        try { return new Intl.DateTimeFormat('fa-IR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); }
        catch (_) { return text(value); }
    }

    function pagination(container, page, pages, callback) {
        if (!container) return;
        container.replaceChildren();
        if (pages <= 1) return;
        const previous = node('button', 'ticket-page-btn', 'قبلی');
        const next = node('button', 'ticket-page-btn', 'بعدی');
        const info = node('span', 'ticket-page-info', `صفحه ${fa.format(page)} از ${fa.format(pages)}`);
        previous.disabled = page <= 1; next.disabled = page >= pages;
        previous.onclick = () => callback(page - 1); next.onclick = () => callback(page + 1);
        container.append(previous, info, next);
    }

    function loading(container) { if (container) container.replaceChildren(node('div', 'ticket-loading-state', 'در حال دریافت تیکت‌ها…')); }
    function errorState(container, message) { if (container) container.replaceChildren(node('div', 'ticket-error-state', message || 'خطا در دریافت تیکت‌ها.')); }
    function emptyState(container, message) { if (container) container.replaceChildren(node('div', 'ticket-empty-state', message || 'تیکتی مطابق فیلترها پیدا نشد.')); }

    function updateAdminCounts(counts) {
        const map = { all: 'adminViewCountAll', new: 'adminViewCountNew', in_progress: 'adminViewCountProgress', waiting_for_user: 'adminViewCountUser', waiting_for_support: 'adminViewCountSupport', resolved: 'adminViewCountResolved', closed: 'adminViewCountClosed' };
        Object.entries(map).forEach(([status, id]) => { const target = document.getElementById(id); if (target) target.textContent = fa.format(status ? Number(counts[status] || 0) : Object.values(counts).reduce((a, b) => a + Number(b || 0), 0)); });
    }

    function renderAdminList(items) {
        const container = $('#adminTicketList');
        if (!container) return;
        container.replaceChildren();
        if (!items.length) { emptyState(container); return; }
        items.forEach(ticket => {
            const status = ticketStatus(ticket), priority = priorityKind(ticket.priority);
            const card = node('article', 'helpdesk-ticket-item'); card.dataset.ticketId = ticket.id; card.tabIndex = 0;
            const head = node('header', 'helpdesk-ticket-item-head');
            const title = node('div', 'helpdesk-ticket-item-title');
            title.append(node('strong', '', ticket.subject || 'بدون موضوع'), node('span', '', ticket.ticket_number || `HT-${ticket.id}`));
            const labels = node('div', 'helpdesk-ticket-item-badges'); labels.append(badge(STATUS_LABELS[status] || status, status), badge(PRIORITY_LABELS[priority] || priority, `priority-${priority}`));
            head.append(title, labels);
            const meta = node('div', 'helpdesk-ticket-item-meta');
            meta.append(node('span', '', `${text(ticket.requester_username) || '—'} ← ${text(ticket.recipient_username) || '—'}`), node('span', '', ticket.category_name || 'عمومی'), node('time', '', formatDate(ticket.updated_at)));
            const preview = node('p', 'helpdesk-ticket-item-preview', ticket.last_message_preview || 'پیامی ثبت نشده است.');
            const footer = node('footer', 'helpdesk-ticket-item-foot');
            const open = node('button', 'ticket-inline-action', 'مشاهده مکالمه'); open.type = 'button'; open.dataset.openTicket = ticket.id;
            footer.append(open);
            card.append(head, meta, preview, footer); container.append(card);
        });
    }

    async function loadAdmin(page = state.admin.page) {
        const container = $('#adminTicketList'); if (!container) return;
        const current = state.admin; current.page = page; current.loading = true; loading(container);
        const params = new URLSearchParams({ page: current.page, page_size: 20, search: current.search, priority: current.priority, sort: current.sort });
        if (current.view) params.set('status', current.view);
        try {
            const data = await api(`/api/tickets?${params}`);
            updateAdminCounts(data.counts || {}); renderAdminList(data.items || []);
            const summary = $('#adminTicketSummary'); if (summary) summary.textContent = `${fa.format(data.total || 0)} تیکت در این نما`;
            pagination($('#adminTicketPagination'), data.page, data.pages, loadAdmin);
        } catch (error) { errorState(container, error.message); }
        finally { current.loading = false; }
    }

    function appendMessage(container, message, isAdmin, attachments = []) {
        const requester = isAdmin ? state.admin.detail?.requester_username : state.user.detail?.requester_username;
        const isAgentMessage = message.author_username !== requester;
        const item = node('article', `ticket-workspace-message ${message.visibility === 'internal' ? 'ticket-workspace-message--internal' : (isAgentMessage ? 'ticket-workspace-message--agent' : 'ticket-workspace-message--user')}`);
        const head = node('header', 'ticket-workspace-message-head');
        head.append(node('strong', '', message.visibility === 'internal' ? 'یادداشت داخلی' : text(message.author_username) || 'کاربر'), node('time', '', formatDate(message.created_at)));
        item.append(head, node('p', 'ticket-workspace-message-body', message.body));
        const related = attachments.filter(attachment => Number(attachment.message_id) === Number(message.id));
        if (related.length) {
            const files = node('div', 'ticket-attachment-list');
            related.forEach(attachment => {
                const link = node('a', 'ticket-attachment-link', attachment.original_name || 'دانلود پیوست');
                link.href = attachment.download_url; link.target = '_blank'; link.rel = 'noopener';
                files.append(link);
            });
            item.append(files);
        }
        if (message.visibility === 'internal') item.setAttribute('data-internal', 'true');
        container.append(item);
    }

    function appendUnlinkedAttachments(container, attachments) {
        const unlinked = attachments.filter(attachment => attachment.message_id == null);
        if (!unlinked.length) return;
        const files = node('div', 'ticket-attachment-list ticket-attachment-list--standalone');
        files.append(node('strong', '', 'پیوست‌های تیکت'));
        unlinked.forEach(attachment => {
            const link = node('a', 'ticket-attachment-link', attachment.original_name || 'دانلود پیوست');
            link.href = attachment.download_url; link.target = '_blank'; link.rel = 'noopener'; files.append(link);
        });
        container.append(files);
    }

    function renderAdminContext(ticket) {
        const container = $('#adminTicketContext'); if (!container) return;
        container.replaceChildren(); state.admin.detail = ticket;
        const head = node('header', 'helpdesk-context-head');
        const heading = node('div'); heading.append(node('span', 'ticket-panel-kicker', ticket.ticket_number), node('h3', '', ticket.subject));
        const close = node('button', 'helpdesk-context-close', '×'); close.type = 'button'; close.setAttribute('aria-label', 'بستن جزئیات'); close.onclick = () => { container.replaceChildren(node('div', 'ticket-context-empty', 'یک تیکت را انتخاب کنید')); state.admin.detail = null; };
        head.append(heading, close); container.append(head);
        const fields = node('div', 'helpdesk-context-fields');
        const status = document.createElement('select'); status.className = 'ticket-context-select'; status.dataset.contextField = 'status';
        Object.entries(STATUS_LABELS).forEach(([value, label]) => { const option = node('option', '', label); option.value = value; option.selected = value === ticket.status; status.append(option); });
        const priority = document.createElement('select'); priority.className = 'ticket-context-select'; priority.dataset.contextField = 'priority';
        Object.entries(PRIORITY_LABELS).forEach(([value, label]) => { const option = node('option', '', label); option.value = value; option.selected = value === ticket.priority; priority.append(option); });
        fields.append(node('label', '', 'وضعیت'), status, node('label', '', 'اولویت'), priority);
        const requester = node('div', 'helpdesk-requester-card'); requester.append(node('strong', '', 'درخواست‌کننده'), node('span', '', ticket.requester_username || '—'), node('small', '', ticket.category_name || 'دسته‌بندی عمومی'));
        container.append(fields, requester);
        const timeline = node('div', 'ticket-workspace-timeline');
        (ticket.messages || []).forEach(message => appendMessage(timeline, message, true, ticket.attachments || []));
        if (!ticket.messages?.length) timeline.append(node('div', 'ticket-empty-state', 'هنوز پیامی ثبت نشده است.'));
        appendUnlinkedAttachments(timeline, ticket.attachments || []);
        container.append(timeline);
        const form = document.createElement('form'); form.className = 'ticket-workspace-composer';
        const visibility = document.createElement('select'); visibility.name = 'visibility'; visibility.innerHTML = '<option value="public">پاسخ عمومی</option><option value="internal">یادداشت داخلی</option>';
        const body = document.createElement('textarea'); body.name = 'body'; body.required = true; body.maxLength = 4000; body.placeholder = 'پاسخ یا یادداشت خود را بنویسید…';
        const submit = node('button', 'ticket-new-btn', 'ارسال پیام'); submit.type = 'submit';
        form.append(visibility, body, submit); container.append(form);
        status.onchange = () => updateAdminTicket(ticket.id, { status: status.value });
        priority.onchange = () => updateAdminTicket(ticket.id, { priority: priority.value });
        form.onsubmit = async event => { event.preventDefault(); submit.disabled = true; try { await api(`/api/tickets/${ticket.id}/messages`, { method: 'POST', body: { body: body.value, visibility: visibility.value } }); await openAdminTicket(ticket.id); await loadAdmin(); } catch (error) { announce(error.message, true); } finally { submit.disabled = false; } };
    }

    async function updateAdminTicket(id, patch) {
        try { await api(`/api/tickets/${id}`, { method: 'PATCH', body: patch }); await loadAdmin(); const detail = await api(`/api/tickets/${id}`); renderAdminContext(detail); }
        catch (error) { announce(error.message, true); }
    }

    async function openAdminTicket(id) {
        try { renderAdminContext(await api(`/api/tickets/${id}`)); }
        catch (error) { errorState($('#adminTicketContext'), error.message); }
    }

    function announce(message, isError) {
        const toast = node('div', `ticket-workspace-toast${isError ? ' is-error' : ''}`, message); toast.setAttribute('role', 'status'); document.body.append(toast); setTimeout(() => toast.remove(), 3500);
    }

    function renderUserList(items) {
        const container = $('#userTicketList'); if (!container) return;
        container.replaceChildren();
        if (!items.length) { emptyState(container, 'هنوز تیکتی برای نمایش وجود ندارد.'); return; }
        items.forEach(ticket => {
            const status = ticketStatus(ticket), priority = priorityKind(ticket.priority);
            const card = node('article', 'ticket-user-item'); card.dataset.ticketId = ticket.id; card.tabIndex = 0;
            const heading = node('div', 'ticket-user-item-head'); heading.append(node('strong', '', ticket.subject || 'بدون موضوع'), badge(STATUS_LABELS[status] || status, status));
            const details = node('div', 'ticket-user-item-details'); details.append(node('span', '', ticket.ticket_number), node('span', '', `مخاطب: ${ticket.recipient_username || '—'}`), node('time', '', formatDate(ticket.updated_at)));
            const preview = node('p', 'ticket-user-item-preview', ticket.last_message_preview || 'برای مشاهده مکالمه انتخاب کنید.');
            const footer = node('footer', 'ticket-user-item-foot'); footer.append(badge(PRIORITY_LABELS[priority] || priority, `priority-${priority}`)); const view = node('button', 'ticket-inline-action', 'مشاهده مکالمه'); view.type = 'button'; view.dataset.openUserTicket = ticket.id; footer.append(view);
            card.append(heading, details, preview, footer); container.append(card);
        });
    }

    async function loadUser(page = state.user.page) {
        const container = $('#userTicketList'); if (!container) return;
        const current = state.user; current.page = page; loading(container);
        const params = new URLSearchParams({ page: current.page, page_size: 12, search: current.search });
        if (current.status) params.set('status', current.status);
        try { const data = await api(`/api/tickets?${params}`); renderUserList(data.items || []); if ($('#userTicketTotal')) $('#userTicketTotal').textContent = fa.format(data.total || 0); if ($('#userTicketPending')) $('#userTicketPending').textContent = fa.format((data.counts?.waiting_for_support || 0) + (data.counts?.waiting_for_user || 0) + (data.counts?.new || 0)); pagination($('#userTicketPagination'), data.page, data.pages, loadUser); }
        catch (error) { errorState(container, error.message); }
    }

    function renderConversation(detail) {
        const overlay = $('#popupMoshahedeoverlay'), dialog = $('#MoshahedePopupbox'), title = $('#ticketConversationTitle'), list = $('#MoshahedePopupbox .kadr-matn');
        if (!overlay || !dialog || !list) return;
        state.user.detail = detail;
        overlay.style.display = 'block'; dialog.style.display = 'block'; document.body.classList.add('ticket-dialog-open');
        if (title) title.textContent = `${detail.ticket_number} · ${detail.subject}`;
        const statusLine = $('.ticket-conversation-head span', dialog); if (statusLine) statusLine.textContent = STATUS_LABELS[detail.status] || 'وضعیت تیکت';
        list.replaceChildren(); (detail.messages || []).forEach(message => appendMessage(list, message, false, detail.attachments || []));
        if (!detail.messages?.length) list.append(node('div', 'ticket-empty-state', 'هنوز پیامی ثبت نشده است.'));
        appendUnlinkedAttachments(list, detail.attachments || []);
        list.scrollTop = list.scrollHeight; window.__ticketingActiveDetail = detail;
    }

    async function openUserTicket(id) { try { renderConversation(await api(`/api/tickets/${id}`)); } catch (error) { announce(error.message, true); } }

    async function sendActiveReply() {
        const detail = window.__ticketingActiveDetail, input = $('#matnErsali');
        if (!detail || !input || state.user.sending || !text(input.value)) return;
        state.user.sending = true;
        try { await api(`/api/tickets/${detail.id}/messages`, { method: 'POST', body: { body: input.value, visibility: 'public' } }); input.value = ''; renderConversation(await api(`/api/tickets/${detail.id}`)); await loadUser(state.user.page); }
        catch (error) { announce(error.message, true); }
        finally { state.user.sending = false; }
    }

    function closeConversation() { const overlay = $('#popupMoshahedeoverlay'), dialog = $('#MoshahedePopupbox'); if (overlay) overlay.style.display = 'none'; if (dialog) dialog.style.display = 'none'; document.body.classList.remove('ticket-dialog-open'); window.__ticketingActiveDetail = null; }

    async function uploadTicketAttachments(ticketId) {
        const input = $('#ticketAttachments');
        if (!input || !input.files.length) return;
        for (const file of Array.from(input.files)) {
            const form = new FormData(); form.append('file', file);
            const response = await fetch(`/api/tickets/${ticketId}/attachments`, {
                method: 'POST', credentials: 'same-origin',
                headers: { 'X-Requested-With': 'XMLHttpRequest' }, body: form
            });
            const payload = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(payload.detail || 'بارگذاری پیوست ناموفق بود.');
        }
        input.value = '';
    }

    async function loadTicketUsers() {
        const select = $('#ticketReceiver');
        if (!select || select.dataset.loaded === 'true') return;
        select.replaceChildren(node('option', '', 'در حال دریافت کاربران…'));
        select.options[0].disabled = true;
        try {
            const data = await api('/api/tickets/users');
            select.replaceChildren();
            const placeholder = node('option', '', 'انتخاب کنید');
            placeholder.value = ''; placeholder.disabled = true; placeholder.selected = true;
            select.append(placeholder);
            (data.items || []).forEach(user => {
                const option = node('option', '', user.name ? `${user.name} (${user.username})` : user.username);
                option.value = user.username;
                select.append(option);
            });
            select.dataset.loaded = 'true';
        } catch (error) {
            select.replaceChildren(node('option', '', 'دریافت کاربران ناموفق بود'));
            announce(error.message, true);
        }
    }

    function openTicketModal() {
        const modal = $('#ticketModal');
        if (!modal) return;
        modal.style.display = 'flex';
        loadTicketUsers();
        loadCategories();
    }

    function closeTicketModal() {
        const modal = $('#ticketModal');
        if (modal) modal.style.display = 'none';
    }

    async function submitTicketForm(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        const submit = form.querySelector('[type="submit"]');
        if (submit?.disabled) return;
        if (submit) submit.disabled = true;
        const category = $('#ticketCategory')?.value || '';
        const payload = {
            recipient_username: $('#ticketReceiver')?.value || '',
            subject: ($('#ticketCreateTitle') || $('#ticketTitleAdmin'))?.value || '',
            body: $('#ticketDescription')?.value || '',
            priority: $('#ticketPriority')?.value || 'normal'
        };
        if (category) payload.category_id = Number(category);
        try {
            const ticket = await api('/api/tickets', { method: 'POST', body: payload });
            let attachmentError = null;
            try { await uploadTicketAttachments(ticket.id); } catch (error) { attachmentError = error; }
            form.reset();
            closeTicketModal();
            announce(attachmentError ? 'تیکت ثبت شد، اما بارگذاری یک پیوست ناموفق بود.' : 'تیکت با موفقیت ثبت شد.', Boolean(attachmentError));
            if ($('#adminTicketList')) await loadAdmin(1);
            if ($('#userTicketList')) await loadUser(1);
        } catch (error) {
            announce(error.message, true);
        } finally {
            if (submit) submit.disabled = false;
        }
    }

    function loadCategories() {
        const select = $('#ticketCategory'); if (!select || select.dataset.loaded) return;
        api('/api/tickets/categories').then(data => { select.replaceChildren(node('option', '', 'عمومی')); select.options[0].value = ''; (data.items || []).forEach(category => { const option = node('option', '', category.name); option.value = category.id; select.append(option); }); select.dataset.loaded = 'true'; }).catch(() => {});
    }

    function setupForms() {
        const form = $('#ticketForm'); if (form) form.addEventListener('submit', submitTicketForm);
        loadCategories();
        const reply = $('.ticket-reply-send'); if (reply) reply.addEventListener('click', sendActiveReply);
        const input = $('#matnErsali'); if (input) input.addEventListener('keydown', event => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); sendActiveReply(); } });
    }

    function setupAdmin() {
        if (!$('#adminTicketList')) return;
        all('[data-ticket-view]').forEach(button => button.addEventListener('click', () => { all('[data-ticket-view]').forEach(item => item.classList.remove('is-active')); button.classList.add('is-active'); state.admin.view = button.dataset.ticketView === 'all' ? '' : button.dataset.ticketView; loadAdmin(1); }));
        const search = $('#adminTicketSearch'); if (search) search.addEventListener('input', () => { state.admin.search = search.value; clearTimeout(state.admin.timer); state.admin.timer = setTimeout(() => loadAdmin(1), 300); });
        const priority = $('#adminTicketPriority'); if (priority) priority.addEventListener('change', () => { state.admin.priority = priority.value; loadAdmin(1); });
        const sort = $('#adminTicketSort'); if (sort) sort.addEventListener('change', () => { state.admin.sort = sort.value; loadAdmin(1); });
        const refresh = $('#refreshTicketRequests'); if (refresh) refresh.addEventListener('click', () => loadAdmin(1));
        const list = $('#adminTicketList'); list.addEventListener('click', event => { const button = event.target.closest('[data-open-ticket]'); if (button) openAdminTicket(button.dataset.openTicket); });
        list.addEventListener('keydown', event => { if (event.key === 'Enter' && event.target.closest('.helpdesk-ticket-item')) openAdminTicket(event.target.closest('.helpdesk-ticket-item').dataset.ticketId); });
        loadAdmin(1);
    }

    function setupUser() {
        if (!$('#userTicketList')) return;
        const search = $('#userTicketSearch'); if (search) search.addEventListener('input', () => { state.user.search = search.value; clearTimeout(state.user.timer); state.user.timer = setTimeout(() => loadUser(1), 300); });
        const filter = $('#userTicketFilter'); if (filter) filter.addEventListener('change', () => { state.user.status = LEGACY_STATUS[filter.value] || (STATUS_LABELS[filter.value] ? filter.value : ''); loadUser(1); });
        const list = $('#userTicketList'); list.addEventListener('click', event => { const button = event.target.closest('[data-open-user-ticket]'); if (button) openUserTicket(button.dataset.openUserTicket); });
        list.addEventListener('keydown', event => { if (event.key === 'Enter' && event.target.closest('.ticket-user-item')) openUserTicket(event.target.closest('.ticket-user-item').dataset.ticketId); });
        loadUser(1);
    }

    document.addEventListener('DOMContentLoaded', () => { setupAdmin(); setupUser(); setupForms(); });
    window.TicketingWorkspace = { loadAdmin, loadUser, openAdminTicket, openUserTicket };
    window.openTicketModal = openTicketModal;
    window.closeTicketModal = closeTicketModal;
    window.uploadTicketAttachments = uploadTicketAttachments;
    window.sendTicketResponse = sendActiveReply;
    window.hideViewDialog = closeConversation;
})();
