
const deleteWordsTable: string = `DROP TABLE IF EXISTS public.words`

const createWordsTable: string = `
    CREATE TABLE IF NOT EXISTS public.words (
        id bigserial NOT NULL,
        "name" varchar NOT NULL,
        CONSTRAINT words_pk PRIMARY KEY (id)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS words_id_idx ON public.words (id);
    CREATE UNIQUE INDEX IF NOT EXISTS words_name_idx ON public.words ("name");`

const insertWordRow: string = `
    INSERT INTO public.words (name) VALUES($1);`

const getRandomWordExcludingId = `
    SELECT w.id, w.name FROM public.words as w offset random() * (select count(*) FROM public.words WHERE id != $1)
    LIMIT 1;`



export {deleteWordsTable, createWordsTable, insertWordRow, getRandomWordExcludingId}