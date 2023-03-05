const TABLE_NAME = "public.games"

const deleteGamesTable: string = `DROP TABLE IF EXISTS ${TABLE_NAME}`

const createGamesTable: string = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id bigserial NOT NULL,
        user_id bigserial NOT NULL,
        word_id bigserial NOT NULL,
        attemps smallint NOT NULL DEFAULT 0,
        created_at timestamp NOT NULL DEFAULT NOW(),
        deleted_at timestamp NULL,
        CONSTRAINT games_pk PRIMARY KEY (id),
        CONSTRAINT game_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
        CONSTRAINT game_word_fk FOREIGN KEY (word_id) REFERENCES public.words(id)
    );`

const insertGameRow: string = `
    INSERT INTO ${TABLE_NAME} (username, salt, password) VALUES($1, $2, $3) RETURNING id, username;`

const fetchGameByUserId: string = `
    SELECT id, username, password, salt, created_at FROM ${TABLE_NAME} WHERE deleted_at IS NULL AND username = $1`


export {
    deleteGamesTable, 
    createGamesTable, 
    insertGameRow,
    fetchGameByUserId
}