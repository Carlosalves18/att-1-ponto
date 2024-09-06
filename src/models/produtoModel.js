import conn from "../config/conn.js                       ";

const tabelaLivros = /*sql*/`
    CREATE TABLE IF NOT EXISTS livros(
        livro_id VARCHAR(60) PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        autor VARCHAR(255) NOT NULL,
        editora VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
)`;

conn.query(tabelaLivros, (err) => {
    if(err){
        console.error(err);
        return;
    };
    console.log("Tabela [livros] criada com sucesso");
});