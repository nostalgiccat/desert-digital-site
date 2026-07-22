import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ROW_ID = 'default';

// Single shared row (no per-user accounts) — matches the password-gated,
// single-study-hub scope of this feature. Maps the localStorage keys the
// curriculum component uses onto columns of that row.
const KEY_TO_COLUMN = {
  'sec-plus-progress-v2': 'progress',
  'sec-plus-exam-date': 'exam_date',
  'sec-plus-confidence': 'confidence',
};

export const storage = {
  get: async (key) => {
    const column = KEY_TO_COLUMN[key];
    if (!column) return null;
    const { data, error } = await supabase
      .from('study_state')
      .select(column)
      .eq('id', ROW_ID)
      .single();
    if (error || !data) return null;
    const raw = data[column];
    if (raw === null || raw === undefined) return null;
    const value = typeof raw === 'string' ? raw : JSON.stringify(raw);
    return { value };
  },
  set: async (key, value) => {
    const column = KEY_TO_COLUMN[key];
    if (!column) return;
    let stored = value;
    if (column !== 'exam_date') {
      try { stored = JSON.parse(value); } catch { stored = value; }
    }
    await supabase
      .from('study_state')
      .upsert({ id: ROW_ID, [column]: stored, updated_at: new Date().toISOString() });
  },
  delete: async (key) => {
    const column = KEY_TO_COLUMN[key];
    if (!column) return;
    await supabase
      .from('study_state')
      .update({ [column]: column === 'exam_date' ? null : {} })
      .eq('id', ROW_ID);
  },
};
