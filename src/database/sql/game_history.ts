const TABLE_NAME = "public.game_history"

const deleteGameHistoryTable: string = `DROP TABLE IF EXISTS ${TABLE_NAME}`

const createGameHistoryTable: string = `
    CREATE TABLE IF NOT EXISTS ${TABLE_NAME} (
        id bigserial NOT NULL,
        game_id bigserial NOT NULL,

        attemps smallint NOT NULL DEFAULT 0,
        won boolean DEFAULT FALSE, 
        created_at timestamp NOT NULL DEFAULT NOW(),
        closed_at timestamp NULL,
        
        CONSTRAINT game_history_pk PRIMARY KEY (id),
        CONSTRAINT game_history_game_fk FOREIGN KEY (game_id) REFERENCES public.games(id)
    );`

const insertGameHistoryRow: string = `
    INSERT INTO ${TABLE_NAME} (game_id) VALUES($1) RETURNING id;`

const closeGameHistoryRow: string = `
    UPDATE ${TABLE_NAME}
    SET closed_at = NOW(), attemps = $2, won = $3 
    WHERE closed_at IS NULL AND game_id = $1
    RETURNING id, game_id`

const fetchGamesByUserId: string = `
    SELECT count(history.id) as played, count(DISTINCT CASE WHEN history.won = TRUE THEN history.id END) as won FROM ${TABLE_NAME} as history
    LEFT JOIN public.games as games ON games.id = history.game_id
    WHERE games.user_id = $1
`

export {
    deleteGameHistoryTable, 
    createGameHistoryTable, 
    insertGameHistoryRow,
    closeGameHistoryRow,
    fetchGamesByUserId
}