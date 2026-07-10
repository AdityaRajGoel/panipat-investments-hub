-- Dedupe key for the automated corporate-actions sync (sync-market-feed):
-- lets the daily run upsert instead of inserting duplicates.
-- Run on the MAIN Supabase project (zbkjbbujsdlpujotgltm).

-- Remove any existing duplicates before adding the constraint
delete from corporate_actions a
using corporate_actions b
where a.ctid < b.ctid
  and a.company = b.company
  and a.action_type = b.action_type
  and a.ex_date = b.ex_date;

alter table corporate_actions
  drop constraint if exists corporate_actions_dedupe;
alter table corporate_actions
  add constraint corporate_actions_dedupe unique (company, action_type, ex_date);
