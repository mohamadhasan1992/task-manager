import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.status(200).json({ message: "healthy" });
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
