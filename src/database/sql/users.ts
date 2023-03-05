
const deleteUsersTable: string = `DROP TABLE IF EXISTS public.users`

const createUsersTable: string = `
    CREATE TABLE IF NOT EXISTS public.users (
        id bigserial NOT NULL,
        username varchar NOT NULL,
        password varchar NOT NULL,
        salt varchar NOT NULL,
        created_at timestamp NOT NULL DEFAULT NOW(),
        deleted_at timestamp NULL,
        CONSTRAINT users_pk PRIMARY KEY (id)
    );
    CREATE UNIQUE INDEX IF NOT EXISTS users_username_idx ON public.users (username);`

const insertUserRow: string = `
    INSERT INTO public.users (username, salt, password) VALUES($1, $2, $3) RETURNING id, username;`



export {deleteUsersTable, createUsersTable, insertUserRow}