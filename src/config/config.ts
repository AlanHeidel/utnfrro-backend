import dotenv from "dotenv";

const isTestEnv =
  process.env.NODE_ENV === "test" || process.env.VITEST === "true";

dotenv.config({
  path: isTestEnv ? ".env.test" : ".env",
  override: true,
});

const envOrDefault = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

const envBoolean = (value: string | undefined, fallback: boolean) => {
  const trimmed = value?.trim().toLowerCase();
  if (!trimmed) return fallback;
  return ["1", "true", "yes", "on"].includes(trimmed);
};

const requiredEnv = (value: string | undefined, name: string) => {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(`${name} is required`);
  }
  return trimmed;
};

export const JWT_SECRET: string = requiredEnv(
  process.env.JWT_SECRET,
  "JWT_SECRET",
);

export const JWT_EXP_CLIENT: string = process.env.JWT_EXP_CLIENT ?? "1h";
export const JWT_EXP_ADMIN: string = process.env.JWT_EXP_ADMIN ?? "1h";
export const JWT_EXP_TABLE: string = process.env.JWT_EXP_TABLE ?? "30d";
export const NODE_ENV: string = process.env.NODE_ENV ?? "development";
export const IS_PROD: boolean = NODE_ENV === "production";
export const ORM_DEBUG: boolean = envBoolean(process.env.ORM_DEBUG, !IS_PROD);
export const ORM_SYNC_SCHEMA: boolean = envBoolean(
  process.env.ORM_SYNC_SCHEMA,
  !IS_PROD,
);

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

export const MP_ACCESS_TOKEN: string = process.env.MP_ACCESS_TOKEN ?? "";
export const MP_PUBLIC_KEY: string = process.env.MP_PUBLIC_KEY ?? "";
export const MP_WEBHOOK_URL: string = envOrDefault(process.env.MP_WEBHOOK_URL, "");
export const FRONTEND_BASE_URL: string = envOrDefault(
  process.env.FRONTEND_BASE_URL,
  "https://utnfrro-frontend.vercel.app",
);

const MP_WEBHOOK_BASE_URL = MP_WEBHOOK_URL
  ? MP_WEBHOOK_URL.replace(/\/api\/payments\/webhook\/?$/, "")
  : "";

const MP_RETURN_BASE_URL = envOrDefault(
  process.env.MP_RETURN_BASE_URL,
  MP_WEBHOOK_BASE_URL || FRONTEND_BASE_URL,
);

export const MP_SUCCESS_URL: string = envOrDefault(
  process.env.MP_SUCCESS_URL,
  `${MP_RETURN_BASE_URL}/pago/exito`,
);
export const MP_FAILURE_URL: string = envOrDefault(
  process.env.MP_FAILURE_URL,
  `${MP_RETURN_BASE_URL}/pago/error`,
);
export const MP_PENDING_URL: string = envOrDefault(
  process.env.MP_PENDING_URL,
  `${MP_RETURN_BASE_URL}/pago/pendiente`,
);
export const MP_CURRENCY_ID: string = envOrDefault(
  process.env.MP_CURRENCY_ID,
  "ARS"
);

// Database configuration
export const DB_HOST: string = process.env.DB_HOST ?? "127.0.0.1";
export const DB_PORT: number = Number(process.env.DB_PORT ?? "3306");
export const DB_USER: string = process.env.DB_USER ?? "root";
export const DB_PASSWORD: string = process.env.DB_PASSWORD ?? "";
export const DB_NAME: string = process.env.DB_NAME ?? "test";
