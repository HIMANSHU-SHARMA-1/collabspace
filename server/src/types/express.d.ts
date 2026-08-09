import {jwtPayload} from 'jsonwebtoken'


interface AuthTokenPayload extends JwtPayload{
    id:string
}


declare global {
    namespace Express{
        interface Request{
            user?: AuthTokenPayload
        }
    }
}