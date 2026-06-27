-- Admin-editable knowledge base for the AI shopping assistant. A single row of
-- free-form text that is appended to the chatbot's system prompt, so staff can
-- broaden what the assistant knows about the business without code changes.
-- Apply after 0006.

create table if not exists chatbot_knowledge (
  id boolean primary key default true,
  content text not null default '',
  updated_at timestamptz default now(),
  constraint chatbot_knowledge_singleton check (id)
);

-- Seed the single row so updates can upsert against it.
insert into chatbot_knowledge (id, content)
  values (true, '')
  on conflict (id) do nothing;

-- Locked down: only the service role (admin server actions + the chat API) reads
-- or writes this. No anon/authenticated policies are granted.
alter table chatbot_knowledge enable row level security;
