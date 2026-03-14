import bcrypt from "bcrypt";
import { orm } from "../../shared/db/orm.js";
import { Account, AccountRole } from "./account.entity.js";

const em = orm.em;
const SALT_ROUNDS = 12;

export interface RegisterClienteInput {
  email: string;
  password: string;
  nombre?: string;
}

type SanitizedAccount = {
  id: number;
  identifier: string;
  nombre: string | null;
  role: AccountRole;
  ultimoLogin: Date | null;
};

async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

async function verifyPassword(stored: string | undefined, plain: string) {
  if (!stored) {
    return false;
  }

  return bcrypt.compare(plain, stored);
}

function toResponse(account: Account): SanitizedAccount {
  return {
    id: account.id,
    identifier: account.identifier,
    nombre: account.nombre ?? null,
    role: account.role,
    ultimoLogin: account.ultimoLogin ?? null,
  };
}

export class AccountService {
  async registerCliente(input: RegisterClienteInput) {
    const identifier = input.email?.trim().toLowerCase();
    if (!identifier || !input.password) {
      throw new Error("Email and password are required");
    }

    const existing = await em.findOne(Account, { identifier });
    if (existing) {
      throw new Error("Account already exists");
    }

    const passwordHash = await hashPassword(input.password);

    const account = em.create(Account, {
      identifier,
      nombre: input.nombre,
      role: AccountRole.CLIENTE,
      passwordHash,
    });

    await em.persistAndFlush(account);
    return toResponse(account);
  }

  async validateCredentials(identifier: string, password: string) {
    const normalized = identifier.trim().toLowerCase();
    const account = await em.findOne(Account, { identifier: normalized });

    if (!account) {
      return null;
    }

    const ok = await verifyPassword(account.passwordHash, password);
    return ok ? toResponse(account) : null;
  }

  async findOne(id: number) {
    const account = await em.findOneOrFail(Account, { id });
    return toResponse(account);
  }

  async list() {
    const accounts = await em.find(Account, {});
    return accounts.map(toResponse);
  }
}

export const accountService = new AccountService();
