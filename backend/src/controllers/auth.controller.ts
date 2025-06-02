import { NextFunction, Request, Response } from 'express';
import { CreateUserDto } from '@dtos/users.dto';
import { RequestWithUser } from '@interfaces/auth.interface';
import AuthService from '@services/auth.service';
import { IUserDocument } from '@/models/users.model';

class AuthController {
  public authService = new AuthService();

  public signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      await this.authService.signup(userData);

      res.status(201).json({ data: {}, message: 'signuped successfully' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userData: CreateUserDto = req.body;
      const { cookie, findUser } = await this.authService.login(userData);

      res.setHeader('Set-Cookie', [cookie]);
      res.status(200).json({ data:findUser, message: 'LoggedIn successfully' });
    } catch (error) {
      next(error);
    }
  };

  public getMe = async(req: RequestWithUser, res: Response, next: NextFunction) => {
    const userData: IUserDocument = req.user;
    res.status(200).json({ data: userData });
  }

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction) => {
    try {
      const userData: IUserDocument = req.user;
      await this.authService.logout(userData);

      res.setHeader('Set-Cookie', ['Authorization=; Max-age=0']);
      res.status(200).json({ data: {}, message: 'loggedOut successfully' });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
