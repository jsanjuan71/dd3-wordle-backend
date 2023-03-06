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


export {
    deleteGameHistoryTable, 
    createGameHistoryTable, 
    insertGameHistoryRow
}