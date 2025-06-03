import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { SECRET_KEY } from '@config';
import { CreateUserDto } from '@dtos/users.dto';
import { HttpException } from '@exceptions/HttpException';
import { DataStoredInToken, TokenData } from '@interfaces/auth.interface';
import { isEmpty } from '@utils/util';
import { UserRepository } from '@/respositories/user.repository';
import { IUserDocument } from '@/models/users.model';

class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  public async signup(userData: CreateUserDto): Promise<{ cookie: string; user: Partial<IUserDocument> }> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: IUserDocument = await this.userRepository.findByEmail(userData.email );
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);

    const createUserData: IUserDocument = await this.userRepository.create(userData);
    const tokenData = this.createToken(createUserData);
    const cookie = this.createCookie(tokenData);
    return {cookie, user: createUserData};
  }

  public async login(userData: CreateUserDto): Promise<{ cookie: string; user: Partial<IUserDocument> }> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: IUserDocument = await this.userRepository.findByEmail(userData.email );
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "Password is not matching");

    const tokenData = this.createToken(findUser);
    const cookie = this.createCookie(tokenData);

    return { cookie, user:{email: findUser.email} };
  }

  public async logout(userData: IUserDocument): Promise<IUserDocument> {
    if (isEmpty(userData)) throw new HttpException(400, "userData is empty");

    const findUser: IUserDocument = await this.userRepository.findByEmail(userData.email );
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    return findUser;
  }

  public createToken(user: IUserDocument): TokenData {
    const dataStoredInToken: DataStoredInToken = { _id: user._id.toString() };
    const secretKey: string = SECRET_KEY;
    const expiresIn: number = 60 * 60;

    return { expiresIn, token: sign(dataStoredInToken, secretKey, { expiresIn }) };
  }

  public createCookie(tokenData: TokenData): string {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/;`;
  }
}

export default AuthService;
