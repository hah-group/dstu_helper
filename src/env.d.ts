declare global {
  namespace NodeJS {
    interface ProcessEnv extends AppEnv {
      DATABASE_HOST: string;
      DATABASE_PORT: string;
      DATABASE_USER: string;
      DATABASE_PASSWORD: string;
      DATABASE_NAME: string;

      REDIS_HOST: string;
      REDIS_PORT: string;

      VK_TOKEN: string;
      VK_GROUP_ID: string;
      VK_CONFIRMATION: string;
      VK_USE_POLLING: 'true' | 'false';

      TG_TOKEN: string;

      ENV: 'dev' | 'prod';

      TZ: string;
    }
  }
}
