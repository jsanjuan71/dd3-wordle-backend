
const deleteWordsTable: string = `DROP TABLE IF EXISTS public.words`

const createWordsTable: string = `
    CREATE TABLE IF NOT EXISTS public.words (
        id bigserial NOT NULL,
        "name" varchar NOT NULL,
        CONSTRAINT words_pk PRIMARY KEY (id)
    );
    CREATE UNIQUE INDEX words_id_idx ON public.words (id);
    CREATE UNIQUE INDEX words_name_idx ON public.words ("name");`;

const insertWordRow: string = `
    INSERT INTO public.words (name) VALUES($1);`;


export {deleteWordsTable, createWordsTable, insertWordRow}