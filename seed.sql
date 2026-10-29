INSERT INTO companies (name, status, violation_score, expires_at) VALUES
  ('Acme Robotics', 'active', 0, '2099-12-31T23:59:59.000Z'),
  ('Northstar Manufacturing', 'active', 0, '2099-12-31T23:59:59.000Z');

INSERT INTO robots (id, company_id, allowed_commands, state) VALUES
  ('ACME-01', 1, 'move,stop,pickup,scan', 'running'),
  ('ACME-02', 1, 'move,stop,pickup,scan', 'running'),
  ('NORTH-01', 2, 'move,stop,pickup,scan', 'running'),
  ('NORTH-02', 2, 'move,stop,pickup,scan', 'running');
