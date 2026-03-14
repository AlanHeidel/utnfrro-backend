import dotenv from "dotenv";

dotenv.config({ override: true });

const envOrDefault = (value: string | undefined, fallback: string) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : fallback;
};

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

export const MP_ACCESS_TOKEN: string = process.env.MP_ACCESS_TOKEN ?? "";
export const MP_PUBLIC_KEY: string = process.env.MP_PUBLIC_KEY ?? "";
export const MP_WEBHOOK_URL: string = envOrDefault(process.env.MP_WEBHOOK_URL, "");

const MP_WEBHOOK_BASE_URL = MP_WEBHOOK_URL
  ? MP_WEBHOOK_URL.replace(/\/api\/payments\/webhook\/?$/, "")
  : "";

export const MP_SUCCESS_URL: string = envOrDefault(
  process.env.MP_SUCCESS_URL,
  MP_WEBHOOK_BASE_URL
    ? `${MP_WEBHOOK_BASE_URL}/pago/exito`
    : "http://localhost:5173/pago/exito"
);
export const MP_FAILURE_URL: string = envOrDefault(
  process.env.MP_FAILURE_URL,
  MP_WEBHOOK_BASE_URL
    ? `${MP_WEBHOOK_BASE_URL}/pago/error`
    : "http://localhost:5173/pago/error"
);
export const MP_PENDING_URL: string = envOrDefault(
  process.env.MP_PENDING_URL,
  MP_WEBHOOK_BASE_URL
    ? `${MP_WEBHOOK_BASE_URL}/pago/pendiente`
    : "http://localhost:5173/pago/pendiente"
);
export const MP_CURRENCY_ID: string = envOrDefault(
  process.env.MP_CURRENCY_ID,
  "ARS"
);

// Database configuration - dont use env vars for this, just hardcode them for simplicity
export const DB_HOST: string = process.env.DB_HOST ?? "127.0.0.1";
export const DB_PORT: number = Number(process.env.DB_PORT ?? "3306");
export const DB_USER: string = process.env.DB_USER ?? "root";
export const DB_PASSWORD: string = process.env.DB_PASSWORD ?? "";
export const DB_NAME: string = process.env.DB_NAME ?? "test";
