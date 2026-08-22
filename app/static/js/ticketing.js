(() => {
    const normalize = (value) => String(value || '').trim().toLocaleLowerCase();

    function statusFromRow(row) {
        const statusNode = row.querySelector('.status-navbar, .vazeiyat-ticket span');
        return normalize(statusNode ? statusNode.textContent : '');
    }

    function setupTable({ tableIds, searchId, filterId, totalId, pendingId }) {
        const tables = tableIds.map((id) => document.getElementById(id)).filter(Boolean);
        const search = document.getElementById(searchId);
        const filter = document.getElementById(filterId);
        if (!tables.length || !search || !filter) return;

        const sourceTable = tables[0];
        const sourceBody = sourceTable.querySelector('tbody');
        if (!sourceBody) return;
        const metric = (id) => document.getElementById(id);

        const statusClasses = {
            'ارسال شده': 'ticket-status-chip--sent',
            'در حال پیگیری': 'ticket-status-chip--following',
            'خوانده شده': 'ticket-status-chip--read',
            'پاسخ داده شده': 'ticket-status-chip--answered'
        };

        function decorateStatus(row) {
            const statusNode = row.querySelector('.ticket-status');
            if (!statusNode) return;
            statusNode.classList.remove(...Object.values(statusClasses));
            const statusClass = statusClasses[statusNode.textContent.trim()];
            if (statusClass) statusNode.classList.add(statusClass);
        }

        function rows() {
            return Array.from(sourceTable.querySelectorAll('tbody tr')).filter(
                (row) => !row.querySelector('.ticket-empty-state')
            );
        }

        function syncMetrics() {
            const allRows = rows();
            allRows.forEach(decorateStatus);
            const pending = allRows.filter((row) => {
                const status = statusFromRow(row);
                return status === 'ارسال شده' || status === 'در حال پیگیری';
            }).length;
            if (metric(totalId)) metric(totalId).textContent = allRows.length.toLocaleString('fa-IR');
            if (metric(pendingId)) metric(pendingId).textContent = pending.toLocaleString('fa-IR');
        }

        function applyFilter() {
            const query = normalize(search.value);
            const selectedStatus = normalize(filter.value === 'all' ? '' : filter.value);
            tables.forEach((table) => {
                table.querySelectorAll('tbody tr').forEach((row) => {
                    if (row.querySelector('.ticket-empty-state')) return;
                    const matchesQuery = !query || normalize(row.textContent).includes(query);
                    const matchesStatus = !selectedStatus || statusFromRow(row) === selectedStatus;
                    row.classList.toggle('ticket-row-hidden', !(matchesQuery && matchesStatus));
                });
            });
            syncMetrics();
        }

        search.addEventListener('input', applyFilter);
        filter.addEventListener('change', applyFilter);
        new MutationObserver(applyFilter).observe(sourceBody, { childList: true });
        applyFilter();
    }

    function setup() {
        setupTable({
            tableIds: ['ticketUsersReportTable'],
            searchId: 'adminTicketSearch',
            filterId: 'adminTicketFilter',
            totalId: 'adminTicketTotal',
            pendingId: 'adminTicketPending'
        });
        setupTable({
            tableIds: ['ticket-status-table', 'ticket-status-table-popup'],
            searchId: 'userTicketSearch',
            filterId: 'userTicketFilter',
            totalId: 'userTicketTotal',
            pendingId: 'userTicketPending'
        });

        const refreshButton = document.getElementById('refreshTicketRequests');
        if (refreshButton && typeof window.loadTicketRequests === 'function') {
            refreshButton.addEventListener('click', () => window.loadTicketRequests());
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setup);
    } else {
        setup();
    }
})();
