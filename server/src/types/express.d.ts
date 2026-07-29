import {jwtPayload} from 'jsonwebtoken'

declare global {
    namespace Express{
        interface Request{
            user?: string| jwtPayload
        }
    }
}