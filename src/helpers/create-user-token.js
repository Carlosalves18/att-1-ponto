import jwt from "jsonwebtoken"

const createUserToken = async (usuario,req, res) =>{
    //Cria o token
    const token = jwt.sign(
        {
            nome: usuario.nome,
            id: usuario.usuario_id
        },
        "SENHASURPERSEGURA"//Senha de cripttografia
    );
    //Retornar o token
    res.status(200).json({
        message:"Você está autenticado",
        token:token,
        usuarioID: usuario.usuario_id,
    })
}

export default createUserToken