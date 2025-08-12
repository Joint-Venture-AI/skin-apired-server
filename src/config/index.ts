// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.join(process.cwd(), '.env') });

// export default {
//   ip_address: process.env.IP_ADDRESS,
//   database_url: process.env.DATABASE_URL,
//   node_env: process.env.NODE_ENV,
//   port: process.env.PORT,
//   bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
//   stripe_secret_key: process.env.STRIPE_SECRET_KEY,
//   google_maps: process.env.GOOGLE_MAPS,
//   jwt: {
//     jwt_secret: process.env.JWT_SECRET,
//     jwt_expire_in: process.env.JWT_EXPIRE_IN,
//     jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
//     jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
//     jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
//   },
//   email: {
//     from: process.env.EMAIL_FROM,
//     user: process.env.EMAIL_USER,
//     port: process.env.EMAIL_PORT,
//     host: process.env.EMAIL_HOST,
//     pass: process.env.EMAIL_PASS,
//   },
//   admin: {
//     email: process.env.ADMIN_EMAIL,
//     password: process.env.ADMIN_PASSWORD,
//   },
// };

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const firebasePrivateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

export default {
  ip_address: process.env.IP_ADDRESS,
  database_url: process.env.DATABASE_URL,
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  stripe_secret_key: process.env.STRIPE_SECRET_KEY,
  google_maps: process.env.GOOGLE_MAPS,
  jwt: {
    jwt_secret: process.env.JWT_SECRET,
    jwt_expire_in: process.env.JWT_EXPIRE_IN,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    jwt_refresh_expire_in: process.env.JWT_REFRESH_EXPIRE_IN,
  },
  email: {
    from: process.env.EMAIL_FROM,
    user: process.env.EMAIL_USER,
    port: process.env.EMAIL_PORT,
    host: process.env.EMAIL_HOST,
    pass: process.env.EMAIL_PASS,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  firebase: {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: firebasePrivateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url:
      process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
  },
};
