import { describe, it, expect } from "vitest";
import {
  signAccountToken,
  signTableToken,
  verifyToken,
} from "../../../modules/auth/auth.utils.js";
import { AccountRole } from "../../../modules/account/account.entity.js";

describe("verifyToken", () => {
  it("decodifica correctamente un token de account", () => {
    const token = signAccountToken({ sub: 1, role: AccountRole.ADMIN });

    const payload = verifyToken(token);

    expect(payload.kind).toBe("account");
    if (payload.kind !== "account") throw new Error("kind inesperado");
    expect(payload.sub).toBe(1);
    expect(payload.role).toBe(AccountRole.ADMIN);
  });

  it("decodifica correctamente un token de table-device", () => {
    const token = signTableToken({ sub: 10, mesaId: 3 });

    const payload = verifyToken(token);

    expect(payload.kind).toBe("table-device");
    if (payload.kind !== "table-device") throw new Error("kind inesperado");
    expect(payload.sub).toBe(10);
    expect(payload.mesaId).toBe(3);
  });

  it("lanza error con token inválido", () => {
    expect(() => verifyToken("token.invalido")).toThrow();
  });
});
