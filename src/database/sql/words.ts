const TABLE_NAME = 'public.words'

const deleteWordsTable: string = `DROP TABLE IF EXISTS ${TABLE_NAME}`

const createWordsTable: string = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id bigserial NOT NULL,
        "name" varchar NOT NULL,
        CONSTRAINT words_pk PRIMARY KEY (id)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS words_id_idx ON ${TABLE_NAME} (id);
    CREATE UNIQUE INDEX IF NOT EXISTS words_name_idx ON ${TABLE_NAME} ("name");`

const insertWordRow: string = `
    INSERT INTO ${TABLE_NAME} (name) VALUES($1);`

const getRandomWordExcludingId = `
    SELECT w.id, w.name FROM ${TABLE_NAME} as w offset random() * (select count(*) FROM ${TABLE_NAME} WHERE id != $1)
    LIMIT 1;`



export {deleteWordsTable, createWordsTable, insertWordRow, getRandomWordExcludingId}