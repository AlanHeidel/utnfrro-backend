import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { AccountRole } from "../account/account.entity.js";
import { JWT_SECRET, JWT_EXP_CLIENT, JWT_EXP_ADMIN, JWT_EXP_TABLE } from "../config.js";

const JWT_SECRET_KEY: Secret = JWT_SECRET || "dev-secret";

export type AccountTokenPayload = {
    sub: number;
    role: AccountRole;
    clienteId?: number | null;
    kind: "account";
};

export type TableTokenPayload = {
    sub: number;
    mesaId: number;
    kind: "table-device";
};

export type AnyTokenPayload = AccountTokenPayload | TableTokenPayload;

export function signAccountToken(payload: Omit<AccountTokenPayload, "kind">): string {
    const expiresIn = payload.role === AccountRole.ADMIN ? JWT_EXP_ADMIN : JWT_EXP_CLIENT;
    return jwt.sign(
        { ...payload, kind: "account" },
        JWT_SECRET_KEY,
        { expiresIn } as SignOptions
    );
}

export function signTableToken(payload: Omit<TableTokenPayload, "kind">): string {
    return jwt.sign(
        { ...payload, kind: "table-device" },
        JWT_SECRET_KEY,
        { expiresIn: JWT_EXP_TABLE } as SignOptions
    );
}

export function verifyToken(token: string): AnyTokenPayload {
    return jwt.verify(token, JWT_SECRET_KEY) as unknown as AnyTokenPayload;
}