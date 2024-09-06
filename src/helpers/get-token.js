const getToken = (req) =>{
    //extrair o token
    const authHeader = req.headers.authHeader
    //(baerer token)
    const token = authHeader.split(" ")[1]

    return token
}
export default getToken;