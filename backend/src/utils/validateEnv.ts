import { cleanEnv, port, str, num, bool } from 'envalid';

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str(),
    PORT: port(),
    DB_HOST: str(),
    DB_PORT: num(),
    SECRET_KEY: str(),
    ORIGIN: str(),
    CREDENTIALS: bool()
  });
};

export default validateEnv;
