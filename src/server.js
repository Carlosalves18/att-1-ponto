import "dotenv/config"
import express from "express"
import cors from "cors"

//Importar a conexão com o banco
import conn from "./config/conn.js"

//Importar modulos
import "./models/usuarioModel.js"
import "./models/produtoModel.js"

//Importar as Rotas
import usuarioRouter from "./routes/usuarioRouter.js"
import livroRouter from "./routes/livroRouter.js"

const PORT = process.env.PORT || 7777
const app = express()

// 3 middeleware
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json())

//Utilizar as Rotas
app.use("/usuarios", usuarioRouter)
app.use("/livros", livroRouter)

app.use((req,res)=>{
    res.status(404).json({message:"Rota não encontrada"})
})

app.listen(PORT,()=>{
    console.log(`Servidor oN PORT ${PORT}`)
})