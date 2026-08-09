import type {Request, Response, NextFunction} from 'express'

const catchAsync = <Req extends Request = Request> (fn:(req: Req, res: Response, next: NextFunction) => Promise<any>) => {
    return (req:Req, res:Response, next:NextFunction) => {
        fn(req,res,next).catch(next)
    }
}
export = catchAsync