/* Normalized Hastama ticketing schema for SQL Server.
   This migration is additive: legacy ticket_table data is preserved and copied
   into the new model. It intentionally does not touch notification tables. */
SET XACT_ABORT ON;

IF OBJECT_ID(N'dbo.ticket_categories', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ticket_categories (
        id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ticket_categories PRIMARY KEY,
        name NVARCHAR(120) NOT NULL,
        slug VARCHAR(120) NOT NULL,
        parent_id INT NULL,
        is_active BIT NOT NULL CONSTRAINT DF_ticket_categories_active DEFAULT 1,
        created_at DATETIME2(0) NOT NULL CONSTRAINT DF_ticket_categories_created DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_ticket_categories_slug UNIQUE (slug),
        CONSTRAINT FK_ticket_categories_parent FOREIGN KEY (parent_id) REFERENCES dbo.ticket_categories(id)
    );
END;

IF OBJECT_ID(N'dbo.tickets', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.tickets (
        id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_tickets PRIMARY KEY,
        legacy_parent_id INT NULL,
        requester_username NVARCHAR(255) NOT NULL,
        recipient_username NVARCHAR(255) NOT NULL,
        subject NVARCHAR(180) NOT NULL,
        status VARCHAR(32) NOT NULL CONSTRAINT DF_tickets_status DEFAULT 'new',
        priority VARCHAR(16) NOT NULL CONSTRAINT DF_tickets_priority DEFAULT 'normal',
        category_id INT NULL,
        assigned_to NVARCHAR(255) NULL,
        created_at DATETIME2(0) NOT NULL CONSTRAINT DF_tickets_created DEFAULT SYSUTCDATETIME(),
        updated_at DATETIME2(0) NOT NULL CONSTRAINT DF_tickets_updated DEFAULT SYSUTCDATETIME(),
        last_message_at DATETIME2(0) NOT NULL CONSTRAINT DF_tickets_last_message DEFAULT SYSUTCDATETIME(),
        first_response_at DATETIME2(0) NULL,
        resolved_at DATETIME2(0) NULL,
        closed_at DATETIME2(0) NULL,
        sla_due_at DATETIME2(0) NULL,
        CONSTRAINT CK_tickets_status CHECK (status IN ('new','open','in_progress','waiting_for_user','waiting_for_support','resolved','closed')),
        CONSTRAINT CK_tickets_priority CHECK (priority IN ('low','normal','high','urgent')),
        CONSTRAINT FK_tickets_category FOREIGN KEY (category_id) REFERENCES dbo.ticket_categories(id)
    );
    CREATE UNIQUE INDEX UX_tickets_number ON dbo.tickets(id);
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_tickets_legacy_parent' AND object_id = OBJECT_ID('dbo.tickets'))
    CREATE UNIQUE INDEX UX_tickets_legacy_parent ON dbo.tickets(legacy_parent_id) WHERE legacy_parent_id IS NOT NULL;

IF OBJECT_ID(N'dbo.ticket_messages', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ticket_messages (
        id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ticket_messages PRIMARY KEY,
        ticket_id BIGINT NOT NULL,
        author_username NVARCHAR(255) NOT NULL,
        body NVARCHAR(4000) NOT NULL,
        visibility VARCHAR(16) NOT NULL CONSTRAINT DF_ticket_messages_visibility DEFAULT 'public',
        legacy_message_id INT NULL,
        created_at DATETIME2(0) NOT NULL CONSTRAINT DF_ticket_messages_created DEFAULT SYSUTCDATETIME(),
        edited_at DATETIME2(0) NULL,
        CONSTRAINT CK_ticket_messages_visibility CHECK (visibility IN ('public','internal')),
        CONSTRAINT FK_ticket_messages_ticket FOREIGN KEY (ticket_id) REFERENCES dbo.tickets(id) ON DELETE CASCADE
    );
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'UX_ticket_messages_legacy' AND object_id = OBJECT_ID('dbo.ticket_messages'))
    CREATE UNIQUE INDEX UX_ticket_messages_legacy ON dbo.ticket_messages(legacy_message_id) WHERE legacy_message_id IS NOT NULL;

IF OBJECT_ID(N'dbo.ticket_tags', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ticket_tags (
        id INT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ticket_tags PRIMARY KEY,
        name NVARCHAR(60) NOT NULL,
        slug VARCHAR(60) NOT NULL,
        created_at DATETIME2(0) NOT NULL CONSTRAINT DF_ticket_tags_created DEFAULT SYSUTCDATETIME(),
        CONSTRAINT UQ_ticket_tags_name UNIQUE (name),
        CONSTRAINT UQ_ticket_tags_slug UNIQUE (slug)
    );
END;

IF OBJECT_ID(N'dbo.ticket_tag_relations', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ticket_tag_relations (
        ticket_id BIGINT NOT NULL,
        tag_id INT NOT NULL,
        created_at DATETIME2(0) NOT NULL CONSTRAINT DF_ticket_tag_relations_created DEFAULT SYSUTCDATETIME(),
        CONSTRAINT PK_ticket_tag_relations PRIMARY KEY (ticket_id, tag_id),
        CONSTRAINT FK_ticket_tag_relations_ticket FOREIGN KEY (ticket_id) REFERENCES dbo.tickets(id) ON DELETE CASCADE,
        CONSTRAINT FK_ticket_tag_relations_tag FOREIGN KEY (tag_id) REFERENCES dbo.ticket_tags(id) ON DELETE CASCADE
    );
END;

IF OBJECT_ID(N'dbo.ticket_events', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ticket_events (
        id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ticket_events PRIMARY KEY,
        ticket_id BIGINT NOT NULL,
        actor_username NVARCHAR(255) NOT NULL,
        event_type VARCHAR(40) NOT NULL,
        metadata NVARCHAR(2000) NULL,
        created_at DATETIME2(0) NOT NULL CONSTRAINT DF_ticket_events_created DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_ticket_events_ticket FOREIGN KEY (ticket_id) REFERENCES dbo.tickets(id) ON DELETE CASCADE
    );
END;

IF OBJECT_ID(N'dbo.ticket_attachments', N'U') IS NULL
BEGIN
    CREATE TABLE dbo.ticket_attachments (
        id BIGINT IDENTITY(1,1) NOT NULL CONSTRAINT PK_ticket_attachments PRIMARY KEY,
        ticket_id BIGINT NOT NULL,
        message_id BIGINT NULL,
        uploaded_by NVARCHAR(255) NOT NULL,
        original_name NVARCHAR(255) NOT NULL,
        storage_name VARCHAR(180) NOT NULL,
        content_type VARCHAR(120) NOT NULL,
        size_bytes BIGINT NOT NULL,
        created_at DATETIME2(0) NOT NULL CONSTRAINT DF_ticket_attachments_created DEFAULT SYSUTCDATETIME(),
        CONSTRAINT FK_ticket_attachments_ticket FOREIGN KEY (ticket_id) REFERENCES dbo.tickets(id) ON DELETE CASCADE,
        CONSTRAINT FK_ticket_attachments_message FOREIGN KEY (message_id) REFERENCES dbo.ticket_messages(id),
        CONSTRAINT CK_ticket_attachments_size CHECK (size_bytes > 0)
    );
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_tickets_inbox' AND object_id = OBJECT_ID('dbo.tickets'))
    CREATE INDEX IX_tickets_inbox ON dbo.tickets(status, priority, updated_at DESC) INCLUDE (requester_username, recipient_username, assigned_to, subject);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_tickets_participants' AND object_id = OBJECT_ID('dbo.tickets'))
    CREATE INDEX IX_tickets_participants ON dbo.tickets(requester_username, recipient_username, updated_at DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_tickets_assignment' AND object_id = OBJECT_ID('dbo.tickets'))
    CREATE INDEX IX_tickets_assignment ON dbo.tickets(assigned_to, status, updated_at DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_tickets_category' AND object_id = OBJECT_ID('dbo.tickets'))
    CREATE INDEX IX_tickets_category ON dbo.tickets(category_id, status, updated_at DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ticket_messages_ticket' AND object_id = OBJECT_ID('dbo.ticket_messages'))
    CREATE INDEX IX_ticket_messages_ticket ON dbo.ticket_messages(ticket_id, created_at, id);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ticket_events_ticket' AND object_id = OBJECT_ID('dbo.ticket_events'))
    CREATE INDEX IX_ticket_events_ticket ON dbo.ticket_events(ticket_id, created_at DESC);
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_ticket_attachments_ticket' AND object_id = OBJECT_ID('dbo.ticket_attachments'))
    CREATE INDEX IX_ticket_attachments_ticket ON dbo.ticket_attachments(ticket_id, created_at DESC);

/* Seed only stable, generic categories. */
IF NOT EXISTS (SELECT 1 FROM dbo.ticket_categories WHERE slug = 'general')
    INSERT INTO dbo.ticket_categories (name, slug) VALUES (N'عمومی', 'general');
IF NOT EXISTS (SELECT 1 FROM dbo.ticket_categories WHERE slug = 'account')
    INSERT INTO dbo.ticket_categories (name, slug) VALUES (N'حساب کاربری', 'account');
IF NOT EXISTS (SELECT 1 FROM dbo.ticket_categories WHERE slug = 'attendance')
    INSERT INTO dbo.ticket_categories (name, slug) VALUES (N'حضور و غیاب', 'attendance');
IF NOT EXISTS (SELECT 1 FROM dbo.ticket_categories WHERE slug = 'technical')
    INSERT INTO dbo.ticket_categories (name, slug) VALUES (N'مشکلات فنی', 'technical');

/* Backfill one normalized ticket per legacy conversation. */
IF OBJECT_ID(N'dbo.ticket_table', N'U') IS NOT NULL
BEGIN
    ;WITH ranked AS (
        SELECT
            t.Parent_id AS legacy_parent_id,
            LTRIM(RTRIM(t.username)) AS requester_username,
            LTRIM(RTRIM(t.target_username)) AS recipient_username,
            LTRIM(RTRIM(t.ticketTitle)) AS subject,
            t.ticket_date,
            t.ticket_status,
            ROW_NUMBER() OVER (PARTITION BY t.Parent_id ORDER BY t.ticket_date ASC, t.id ASC) AS first_row,
            ROW_NUMBER() OVER (PARTITION BY t.Parent_id ORDER BY t.ticket_date DESC, t.id DESC) AS last_row
        FROM dbo.ticket_table t
        WHERE t.Parent_id IS NOT NULL
    ), first_rows AS (
        SELECT * FROM ranked WHERE first_row = 1
    ), last_rows AS (
        SELECT * FROM ranked WHERE last_row = 1
    )
    INSERT INTO dbo.tickets
        (legacy_parent_id, requester_username, recipient_username, subject, status, priority,
         created_at, updated_at, last_message_at)
    SELECT
        f.legacy_parent_id,
        COALESCE(NULLIF(f.requester_username, ''), N'unknown'),
        COALESCE(NULLIF(f.recipient_username, ''), N'unknown'),
        COALESCE(NULLIF(f.subject, ''), N'بدون عنوان'),
        CASE LTRIM(RTRIM(l.ticket_status))
            WHEN N'تایید شده' THEN 'resolved'
            WHEN N'بسته' THEN 'closed'
            WHEN N'در حال پیگیری' THEN 'in_progress'
            WHEN N'پاسخ داده شده' THEN 'open'
            ELSE 'new'
        END,
        'normal',
        COALESCE(f.ticket_date, SYSUTCDATETIME()),
        COALESCE(l.ticket_date, f.ticket_date, SYSUTCDATETIME()),
        COALESCE(l.ticket_date, f.ticket_date, SYSUTCDATETIME())
    FROM first_rows f
    JOIN last_rows l ON l.legacy_parent_id = f.legacy_parent_id
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.tickets n WHERE n.legacy_parent_id = f.legacy_parent_id
    );

    INSERT INTO dbo.ticket_messages
        (ticket_id, author_username, body, visibility, legacy_message_id, created_at)
    SELECT
        n.id,
        COALESCE(NULLIF(LTRIM(RTRIM(old.username)), ''), N'unknown'),
        COALESCE(NULLIF(LTRIM(RTRIM(old.ticketDescription)), ''), N'بدون متن'),
        'public',
        old.id,
        COALESCE(old.ticket_date, SYSUTCDATETIME())
    FROM dbo.ticket_table old
    JOIN dbo.tickets n ON n.legacy_parent_id = old.Parent_id
    WHERE NOT EXISTS (
        SELECT 1 FROM dbo.ticket_messages m WHERE m.legacy_message_id = old.id
    );

    INSERT INTO dbo.ticket_events (ticket_id, actor_username, event_type, metadata, created_at)
    SELECT n.id, N'system', 'migrated', N'{"source":"ticket_table"}', n.created_at
    FROM dbo.tickets n
    WHERE n.legacy_parent_id IS NOT NULL
      AND NOT EXISTS (
          SELECT 1 FROM dbo.ticket_events e WHERE e.ticket_id = n.id AND e.event_type = 'migrated'
      );
END;
