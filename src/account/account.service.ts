import bcrypt from "bcrypt";
import { orm } from "../shared/db/orm.js";
import { Account, AccountRole } from "./account.entity.js";
import { Cliente } from "../cliente/cliente.entity.js";

const em = orm.em;
const SALT_ROUNDS = 12;

export interface RegisterClienteInput {
  email: string;
  password: string;
  nombre?: string;
  clienteId?: number;
}

type SanitizedAccount = {
  id: number;
  identifier: string;
  nombre: string | null;
  role: AccountRole;
  ultimoLogin: Date | null;
  cliente: { id: number } | null;
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
  const cliente =
    account.cliente && "id" in account.cliente
      ? { id: account.cliente.id }
      : null;

  return {
    id: account.id,
    identifier: account.identifier,
    nombre: account.nombre ?? null,
    role: account.role,
    ultimoLogin: account.ultimoLogin ?? null,
    cliente,
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

    if (input.clienteId) {
      account.cliente = await em.getReference(Cliente, input.clienteId);
    }

    await em.persistAndFlush(account);
    return toResponse(account);
  }

  async validateCredentials(identifier: string, password: string) {
    const normalized = identifier.trim().toLowerCase();
    const account = await em.findOne(
      Account,
      { identifier: normalized },
      { populate: ["cliente"] }
    );

    if (!account) {
      return null;
    }

    const ok = await verifyPassword(account.passwordHash, password);
    return ok ? toResponse(account) : null;
  }

  async findOne(id: number) {
    const account = await em.findOneOrFail(Account, { id }, { populate: ["cliente"] });
    return toResponse(account);
  }

  async list() {
    const accounts = await em.find(Account, {}, { populate: ["cliente"] });
    return accounts.map(toResponse);
  }
}

export const accountService = new AccountService();
