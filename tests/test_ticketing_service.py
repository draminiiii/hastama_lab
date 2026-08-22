"""Focused tests for the normalized ticketing domain helpers.

These tests deliberately avoid a live SQL Server connection. Database behavior
is covered by the service's parameterized queries and should be exercised in the
integration environment that has the Hastama database available.
"""
from pathlib import Path

import pytest

import app.services.ticketing as ticketing


def test_clean_text_strips_null_bytes_and_whitespace():
    assert ticketing.clean_text("  درخواست\x00 مهم  ", "موضوع", 2, 20) == "درخواست مهم"


def test_clean_text_rejects_empty_and_oversized_values():
    with pytest.raises(ValueError):
        ticketing.clean_text(" ", "متن", 1, 20)
    with pytest.raises(ValueError):
        ticketing.clean_text("x" * 21, "متن", 1, 20)


def test_closed_tickets_can_only_be_reopened():
    assert ticketing.ALLOWED_TRANSITIONS["closed"] == {"open"}
    assert "closed" not in ticketing.ALLOWED_TRANSITIONS["resolved"]


def test_actor_is_read_from_signed_session():
    class Request:
        session = {"username": "alice", "is_admin": True}

    assert ticketing.actor_from_session(Request()) == ("alice", True)


def test_missing_actor_is_rejected():
    class Request:
        session = {}

    with pytest.raises(PermissionError):
        ticketing.actor_from_session(Request())


def test_private_attachment_uses_safe_random_storage_name(tmp_path, monkeypatch):
    monkeypatch.setattr(ticketing, "_PRIVATE_ROOT", Path(tmp_path))

    metadata = ticketing.store_private_attachment(
        "../../گزارش.pdf", "application/pdf", b"pdf-bytes"
    )

    assert metadata["original_name"] == "گزارش.pdf"
    assert metadata["storage_name"].endswith(".pdf")
    assert Path(metadata["path"]).parent == Path(tmp_path)
    assert Path(metadata["path"]).read_bytes() == b"pdf-bytes"


def test_private_attachment_rejects_unsupported_type(tmp_path, monkeypatch):
    monkeypatch.setattr(ticketing, "_PRIVATE_ROOT", Path(tmp_path))

    with pytest.raises(ValueError):
        ticketing.store_private_attachment("payload.exe", "application/octet-stream", b"x")


def test_private_attachment_rejects_oversized_payload(tmp_path, monkeypatch):
    monkeypatch.setattr(ticketing, "_PRIVATE_ROOT", Path(tmp_path))

    with pytest.raises(ValueError):
        ticketing.store_private_attachment("payload.txt", "text/plain", b"x" * (10 * 1024 * 1024 + 1))
