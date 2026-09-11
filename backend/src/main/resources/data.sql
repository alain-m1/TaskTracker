-- Seed data so the app isn't empty on first run.
INSERT IGNORE INTO task (id, title, completed, created_at) VALUES
  (1, 'Reply to client emails', false, NOW()),
  (2, 'Prepare notes for Monday standup', false, NOW()),
  (3, 'Submit expense report', true, NOW());
