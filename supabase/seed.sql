-- OpsFlow demo data for Sunrise Traders
-- Safe to re-run: wipes existing rows and re-seeds with dates relative to today,
-- so overdue / due-today / upcoming always look right on demo day.

truncate table public.tasks, public.employees cascade;

insert into public.employees (id, name, role) values
  ('11111111-1111-1111-1111-111111111111', 'Ravi Kumar', 'Sales'),
  ('22222222-2222-2222-2222-222222222222', 'Ananya Sharma', 'Operations'),
  ('33333333-3333-3333-3333-333333333333', 'Arjun Reddy', 'Inventory'),
  ('44444444-4444-4444-4444-444444444444', 'Priya Singh', 'Finance');

insert into public.tasks (title, description, assigned_to, priority, status, due_date) values
  -- Overdue
  ('Call supplier about delayed shipment', 'Shipment #ST-4821 is 2 days late. Confirm new ETA and update customer.',
    '11111111-1111-1111-1111-111111111111', 'high', 'todo', current_date - 2),
  ('Follow up on pending payment', 'Invoice INV-1092 from Metro Mart is overdue. Call and send a reminder.',
    '44444444-4444-4444-4444-444444444444', 'high', 'in_progress', current_date - 5),
  ('Restock packaging materials', 'Boxes and tape running low in warehouse bay 2.',
    '33333333-3333-3333-3333-333333333333', 'medium', 'todo', current_date - 1),
  ('Update supplier records', 'Add new GST numbers and bank details for three suppliers.',
    '22222222-2222-2222-2222-222222222222', 'low', 'todo', current_date - 3),

  -- Due today
  ('Update inventory', 'Weekly cycle count for SKUs A100–A150.',
    '33333333-3333-3333-3333-333333333333', 'medium', 'todo', current_date),
  ('Send quotation to customer', 'Bulk rice order enquiry from Lakshmi Stores received yesterday.',
    '11111111-1111-1111-1111-111111111111', 'high', 'in_progress', current_date),
  ('Confirm delivery schedule', 'Confirm truck slots with transporter for this week''s deliveries.',
    '22222222-2222-2222-2222-222222222222', 'medium', 'todo', current_date),
  ('Prepare invoice for ABC Stores', 'Invoice for order #ABC-212 (40 cartons).',
    '44444444-4444-4444-4444-444444444444', 'high', 'todo', current_date),

  -- Upcoming
  ('Prepare weekly sales report', 'Summarize this week''s closed deals and pipeline.',
    '11111111-1111-1111-1111-111111111111', 'medium', 'todo', current_date + 2),
  ('Review customer request', 'Green Valley Mart asked for a custom pack size. Check feasibility.',
    '11111111-1111-1111-1111-111111111111', 'low', 'todo', current_date + 4),
  ('Schedule delivery for Metro Mart', 'Coordinate truck for Monday morning delivery.',
    '22222222-2222-2222-2222-222222222222', 'high', 'todo', current_date + 3),
  ('Check stock for Product X', 'Verify shelf and back-room stock before the promotion starts.',
    '33333333-3333-3333-3333-333333333333', 'high', 'todo', current_date + 1),
  ('Update product price list', 'Apply new wholesale rates from supplier catalog.',
    '33333333-3333-3333-3333-333333333333', 'low', 'todo', current_date + 5),
  ('Reconcile bank statement', 'Match last month''s transactions in books.',
    '44444444-4444-4444-4444-444444444444', 'medium', 'in_progress', current_date + 4),
  ('Train new warehouse helper', 'Walk through receiving and put-away process.',
    '22222222-2222-2222-2222-222222222222', 'low', 'todo', current_date + 7),

  -- Completed
  ('Confirm order with Patel Distributors', 'Order #PD-778 confirmed and payment received.',
    '11111111-1111-1111-1111-111111111111', 'high', 'completed', current_date - 3),
  ('File GST return for last quarter', 'Return filed and acknowledgment saved.',
    '44444444-4444-4444-4444-444444444444', 'high', 'completed', current_date - 7),
  ('Clean and organize storage aisle 3', 'Completed during Saturday shift.',
    '33333333-3333-3333-3333-333333333333', 'low', 'completed', current_date - 4),
  ('Onboard new retail partner', 'Account created and first catalog shared.',
    '22222222-2222-2222-2222-222222222222', 'medium', 'completed', current_date - 2),
  ('Check cold-storage temperature logs', 'All readings within range for the week.',
    '33333333-3333-3333-3333-333333333333', 'medium', 'completed', current_date - 1);
