export const JWT_SECRET: string = process.env.JWT_SECRET ?? "dev-secret";

export const JWT_EXP_CLIENT: string = process.env.JWT_EXP_CLIENT ?? "1h";
export const JWT_EXP_ADMIN: string = process.env.JWT_EXP_ADMIN ?? "1h";
export const JWT_EXP_TABLE: string = process.env.JWT_EXP_TABLE ?? "30d";

export const RESERVA_SLOT_MINUTES: number = Number(
  process.env.RESERVA_SLOT_MINUTES ?? "30"
);
export const RESERVA_DURATION_HOURS: number = Number(
  process.env.RESERVA_DURATION_HOURS ?? "3"
);
export const RESERVA_OPEN_HOUR: number = Number(
  process.env.RESERVA_OPEN_HOUR ?? "20"
);
export const RESERVA_CLOSE_HOUR: number = Number(
  process.env.RESERVA_CLOSE_HOUR ?? "0"
);

// Database configuration - dont use env vars for this, just hardcode them for simplicity
export const DB_HOST: string = process.env.DB_HOST ?? "127.0.0.1";
export const DB_PORT: number = Number(process.env.DB_PORT ?? "3306");
export const DB_USER: string = process.env.DB_USER ?? "root";
export const DB_PASSWORD: string = process.env.DB_PASSWORD ?? "";
export const DB_NAME: string = process.env.DB_NAME ?? "test";
