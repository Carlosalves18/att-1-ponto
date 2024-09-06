import conn from "../config/conn.js";
import {v4 as uuidv4} from "uuid"
import { request, response } from "express";

export const registerLivro = (request, response) => {
    const { titulo, autor, editora } = request.body;

    //Validações
    if (!titulo) {
        response.status(400).json({ err: "O Titulo do livro é obrigatório" });
        return;
    }
    if (!autor) {
        response.status(400).json({ err: "O do autor é obrigatório" });
        return;
    }
    if (!editora) {
        response.status(400).json({ err: "O nome da editora é obrigatório" });
        return;
    }
    //verificar se o livro não foi cadastrado
    const checkSql = /*sql*/ `SELECT * FROM livros WHERE titulo = "${titulo}" AND autor = "${autor}" AND editora = "${editora}"`;
    conn.query(checkSql, (err, data) => {
        if (err) {
            console.error(err);
            response.status(500).json({ err: "Erro ao buscar livros" });
            return;
        }

        if (data.length > 0) {
            response.status(409).json({ err: "Livro já foi cadastrado" });
            return;
        }

        //Cadastrar o livro
        const id = uuidv4();
        const insertSql = /*sql*/ `INSERT INTO livros
      (livro_id, titulo, autor, editora)
      VALUES
      ("${id}","${titulo}","${autor}","${editora}")
      `;
        conn.query(insertSql, (err) => {
            if (err) {
                console.error(err);
                response.status(500).json({ err: "Erro ao cadastrar livro" });
                return;
            }
            response.status(201).json({ message: "Livro Cadastrado" });
        });
    });
}
export const listarLivro = (request, response) =>{
    const sql = /*sql*/ `SELECT * FROM livros`;
    conn.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            response.status(500).json({ err: "Erro ao buscar livros" });
            return;
        }
        const livros = data;
        response.status(200).json(livros);
    });
}