import conn from "../config/conn.js";
import bcrypt from "bcrypt";
import {v4 as uuidv4} from "uuid"
import createUserToken from "../helpers/create-user-token.js";
import getToken from "../helpers/get-token.js";
import jwt  from "jsonwebtoken";
import getUserByToken from "../helpers/get-user-by-token.js";


export const register = async (req,res) => {
    const {nome, email, telefone, senha, confirmarsenha} = req.body

    if(!nome){
        res.status(400).json({ message:"O nome é obrigatorio"})
    }
    if(!email){
        res.status(400).json({ message:"O E-mail é obrigatorio"})
    }
    if(!telefone){
        res.status(400).json({ message:"O telefone é obrigatorio"})
    }
    if(!senha){
        res.status(400).json({ message:"A senha é obrigatorio"})
    }
    if(!confirmarsenha){
        res.status(400).json({ message:"O campo confirma senha é obrigatorio"})
        return
    }

    //verificar se o email é valido
    if(!email.includes("@")){
        res.status(400).json({ message:"O @ é obrigatorio"})
        return
    }
    if(senha !== confirmarsenha){
        res.status(400).json({ message:"A senha e a confirmaççao de senha devem ser iguais"});
        return
    }

    const checkSql = /*sql*/ `SELECT * from usuarios where ?? = ?`
    const checkSqlData = ["email",email]
    conn.query(checkSql,checkSqlData,async (err, data)=>{
        if(err){
            console.error(err)
            res.status(500).json({err: "Erro ao buscar email para cadastro"})
            return
        }

        //2º
        if(data.length > 0){
            res.status(409).json({err:"O email já esta em uso"})
            return
        }

        //posso fazer o registro
        const salt = await bcrypt.genSalt(12)
        // console.log(salt)
        const senhaHash = await bcrypt.hash(senha, salt)
        // console.log("Senha digitada: ",senha)
        // console.log("Senha com hash: ",senhaHash)

        //Criar o usuario
        const id = uuidv4();
        const usuario_img ="userDefault.png"
        const insertSql = /*sql*/ `insert into usuarios
        (??, ??, ??, ??, ??, ??) values (?, ?, ?, ?, ?, ?)
        `
        const insertSqlData = ["usuario_id", "nome", "email", "telefone", "senha", "imagem",id, nome, email, telefone, senhaHash,usuario_img ]
        conn.query(insertSql, insertSqlData, (err)=>{
            if(err){
                console.error(err)
                res.status(500).json({err:"Erro ao cadastra usuário"})
                return
            }
            //1 criar um token
            //2 passar o token para o front-end
            const usuarioSql = /*sql*/ ` SELECT * from usuarios where ?? = ?`
            const usuarioData = ["usuario_id", id]
            conn.query(usuarioSql, usuarioData, async (err,data)=>{
                if(err){
                    console.error(err)
                    response.status(500).json({err: "Erro ao fazer login"})
                    return
                }
                const usuario = data[0]

                try{
                    await createUserToken(usuario, res,req)
                } catch(error){
                    console.error(error)
                    res.status(500).json({err:"Erro ao processar requisição"})
                }
            })  
        })
    })
}

export const login = async (req,res)=>{
    const {email, senha} = req.body

    if(!email){
        res.status(400).json({message:"O email é obrigtorio"})
        return
    }
    if(!senha){
        res.status(400).json({message:"A senha é obrigatoria"})
        return
    }
    const checkEmailSql = /*sql*/ `SELECT * from usuarios where ?? = ?`
    const checkEmailData = ["email",email]
    conn.query(checkEmailSql, checkEmailData, async (err, data)=>{
        if(err){
            console.error(err)
            res.status(500).json({err: "Erro ao ler login"})
            return
        }
        if(data.length === 0){
            res.status(500).json({err: "E-mail não está cadastrado"})
            return
        }

        const usuario = data[0]
        console.log(usuario.senha)

        //Comparar senhas
        const comparaSenha = await bcrypt.compare(senha, usuario.senha)
        console.log("Compara senha: ", comparaSenha)
        if(!comparaSenha){
            res.status(401).json({message:"Senha inválida"})  
        }
        //1 criar um token
        try{
            await createUserToken(usuario, res, req)
        }catch(error){
            console.error(error)
            res.status(500).json({err:"Erro ao processar"})
        }
    })
};
//chekUser -> verificar os usuário logado na aplicação
export const checkUser = async (req,res) =>{
   let usuarioAtual;

    if(req.headers.autorization){
       const token = getToken(req)
       console.log(token)
       const decoded = jwt.decoded(token, "SENHASUPERSEGURA")
       console.log(decoded)

       const usuarioId = decoded.id
       const selectSql = /*sql*/ `SELECT nome, email, telefone, imagem from usuaros where ?? = ?`
       const selectData = ["usuario_id", usuarioId]
       conn.query(selectSql, selectData, (err,data)=>{
        if(err){
            console.error(err)
            response.status(500).json({err:"Erro ao verificar usuário"})
            return
        }
        usuarioAtual = data[0]
        res.status(200).json(usuarioAtual)
       })
    }else{
        usuarioAtual = null
        res.status(200).json(usuarioAtual)
    }

}
//getUserByld -> Verificar usuário
export const checkUserById = async (req,res) =>{
    const { id } = req.params

    const checkSql = /*sql*/ `SELECT usuario_id, nome, email, telefone, imagem FROM usuarios WHERE ?? = ?`
    const checkDataSql = ["usuario_id", id]

    conn.query(checkSql, checkDataSql, (err, data) => {
        if(err){
            console.error(err)
            res.status(500).json({Err: "Erro ao buscar usuário"})
            return
        }

        if(data.length === 0){
            res.status(404).json({message: "Usuário não encontrado"})
            return
        }

        const usuario = data[0]

        res.status(200).json(usuario)
    })
}
//editUser -> Controlado Protegido, contém imagem de usuário
export const editUser = async (req,res) =>{
    const {id} = req.params;

    try {
        const token = getToken(request);
        const user = await getUserByToken(token);
        console.log(user);
    } catch (error) {
        
    }
}