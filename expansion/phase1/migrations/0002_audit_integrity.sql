-- Supplementary defense against accidental/ordinary audit-event mutation.
-- This does NOT prevent a privileged DB operator from deleting rows or dropping triggers.
-- Use independent exported audit digests for stronger tamper evidence.
CREATE TRIGGER IF NOT EXISTS audit_events_no_update
BEFORE UPDATE ON audit_events
BEGIN
 SELECT RAISE(ABORT,'audit_events are append-only');
END;
CREATE TRIGGER IF NOT EXISTS audit_events_no_delete
BEFORE DELETE ON audit_events
BEGIN
 SELECT RAISE(ABORT,'audit_events are append-only');
END;
