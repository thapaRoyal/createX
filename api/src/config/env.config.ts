export const envConfig = {
  ACCESS_TOKEN_SECRET:
    process.env.ACCESS_TOKEN_SECRET || "default_access_token_secret",
  REFRESH_TOKEN_SECRET:
    process.env.REFRESH_TOKEN_SECRET || "default_refresh_token_secret",
  ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE || "1h",
  REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || "7d",
};
