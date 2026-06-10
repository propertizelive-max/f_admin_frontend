const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000",
  APP_ENV: process.env.NEXT_PUBLIC_APP_ENV ?? "development",
  JWT_SECRET: process.env.JWT_SECRET ?? "",
} as const;

export type Env = typeof env;
export default env;
