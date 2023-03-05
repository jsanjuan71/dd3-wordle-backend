const TABLE_NAME = "public.word_history"

const deleteWordsHistoryTable: string = `DROP TABLE IF EXISTS ${TABLE_NAME}`

const createWordsHistoryTable: string = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id bigserial NOT NULL,
        word_id bigserial NOT NULL,
        is_active bool NOT NULL DEFAULT FALSE,
        created_at timestamp NOT NULL DEFAULT NOW(),
        closed_at timestamp NULL,
        CONSTRAINT word_history_pk PRIMARY KEY (id),
        CONSTRAINT word_history_fk FOREIGN KEY (word_id) REFERENCES public.words(id)
    );`


const insertWordHistoryRow: string = `
    INSERT INTO ${TABLE_NAME} (word_id, is_active) VALUES($1, true);`

const getLastActiveWord = `
    SELECT * from ${TABLE_NAME}
    WHERE is_active = TRUE
        AND closed_at IS NULL
    ORDER BY created_at desc
    LIMIT 1`

const setLastActiveWord = `
    UPDATE ${TABLE_NAME}
    SET is_active = FALSE
    WHERE id = $1`

export {
    deleteWordsHistoryTable, 
    createWordsHistoryTable, 
    insertWordHistoryRow, 
    getLastActiveWord, 
    setLastActiveWord
}