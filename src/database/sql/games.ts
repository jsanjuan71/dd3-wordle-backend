const TABLE_NAME = "public.games"

const deleteGamesTable: string = `DROP TABLE IF EXISTS ${TABLE_NAME}`

const createGamesTable: string = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id bigserial NOT NULL,
        user_id bigserial UNIQUE NOT NULL,
        word_id bigserial NOT NULL,
        attemps smallint NOT NULL DEFAULT 0,
        created_at timestamp NOT NULL DEFAULT NOW(),
        deleted_at timestamp NULL,
        CONSTRAINT games_pk PRIMARY KEY (id),
        CONSTRAINT game_user_fk FOREIGN KEY (user_id) REFERENCES public.users(id),
        CONSTRAINT game_word_fk FOREIGN KEY (word_id) REFERENCES public.words(id)
    );`

const upsertGameRow: string = `
    INSERT INTO ${TABLE_NAME} (user_id, word_id, attemps) 
        VALUES($1, $2, $3)
        ON CONFLICT (user_id)
        DO
            UPDATE SET word_id = EXCLUDED.word_id, attemps = EXCLUDED.attemps
        RETURNING id, user_id, word_id, attemps, created_at;`

const resetAttempsForAllGames: string = `
    UPDATE ${TABLE_NAME}
    SET attemps = 0
    WHERE deleted_at IS NULL AND attemps != 0`

const fetchAllActiveGames: string = `
    SELECT id, user_id, attemps, word_id FROM ${TABLE_NAME}
    WHERE deleted_at IS NULL`


const getGameById: string = `
    SELECT id, user_id, attemps FROM ${TABLE_NAME}
    WHERE id = $1`

export {
    deleteGamesTable, 
    createGamesTable, 
    upsertGameRow,
    resetAttempsForAllGames,
    fetchAllActiveGames,
    getGameById
}