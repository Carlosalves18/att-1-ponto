import conn from "../config/conn.js";

const tabelaUsuario = /*sql*/ `
create table if not exists usuarios(
    usuario_id varchar (60) primary key,
    nome varchar (255) not null,
    email varchar(255) not null,
    telefone varchar(50) not null,
    senha varchar(255) not null,
    imagem varchar(255) not null,
    craeted_at timestamp default CURRENT_TIMESTAMP,
    updated_at timestamp default CURRENT_TIMESTAMP ON update CURRENT_TIMESTAMP
)
`

conn.query(tabelaUsuario, (err, results, fields)=>{
    if(err){
        console.error(err)
        return
    }
    console.log("Tabela [usuarios] criada com sucesso!")
})