import { Request, Response, NextFunction, RequestHandler } from 'express';

const AsyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};

export default AsyncHandler;
