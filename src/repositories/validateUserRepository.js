import connection from "../db/database.js";


async function getSessionByToken(token) {
    
    const { rows: session } = await connection.query(`SELECT * FROM "sessions" WHERE "token" = $1`, [token])
    
    return session;
}


const validateUserRepository = {
    getSessionByToken
}
  
export default validateUserRepository;