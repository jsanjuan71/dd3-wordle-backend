
const deleteWordsHistoryTable: string = `DROP TABLE IF EXISTS public.word_history`

const createWordsHistoryTable: string = `
    CREATE TABLE IF NOT EXISTS public.word_history (
        id bigserial NOT NULL,
        word_id bigserial NOT NULL,
        is_active bool NOT NULL DEFAULT FALSE,
        created_at timestamp NOT NULL DEFAULT NOW(),
        closed_at timestamp NULL,
        CONSTRAINT word_history_pk PRIMARY KEY (id),
        CONSTRAINT word_history_fk FOREIGN KEY (word_id) REFERENCES public.words(id)
    );`


const insertWordHistoryRow: string = `
    INSERT INTO public.word_history (word_id, is_active) VALUES($1, true);`

const getLastActiveWord = `
    SELECT * from public.word_history
    WHERE is_active = TRUE
        AND closed_at IS NULL
    ORDER BY created_at desc
    LIMIT 1`

const setLastActiveWord = `
    UPDATE public.word_history
    SET is_active = FALSE
    WHERE id = $1`

export {
    deleteWordsHistoryTable, 
    createWordsHistoryTable, 
    insertWordHistoryRow, 
    getLastActiveWord, 
    setLastActiveWord
}