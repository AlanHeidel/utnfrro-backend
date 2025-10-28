import bcrypt from "bcrypt";
import { orm } from "../shared/db/orm.js";
import { TableAccount } from "./tableAccount.entity.js";
import { Mesa } from "../mesa/mesa.entity.js";

const em = orm.em;
const SALT_ROUNDS = 12;

export interface CreateTableAccountInput {
  mesaId: number;
  identifier?: string;
  password: string;
  nombre?: string;
}

export interface TableAccountDTO {
  id: number;
  identifier: string;
  mesa: { id: number; numeroMesa: number | null };
  nombre: string | null;
  ultimoLogin: Date | null;
}

function toDTO(entity: TableAccount): TableAccountDTO {
  return {
    id: entity.id,
    identifier: entity.identifier,
    mesa: {
      id: entity.mesa.id,
      numeroMesa:
        entity.mesa.numeroMesa !== undefined ? entity.mesa.numeroMesa : null,
    },
    nombre: entity.nombre ?? null,
    ultimoLogin: entity.ultimoLogin ?? null,
  };
}

export class TableAccountService {
  async create(input: CreateTableAccountInput) {
    const mesa = await em.findOneOrFail(Mesa, { id: input.mesaId });

    const identifier =
      input.identifier ??
      (mesa.numeroMesa !== undefined
        ? `mesa-${mesa.numeroMesa}`
        : `mesa-${mesa.id}`);

    const existing = await em.findOne(TableAccount, { identifier });
    if (existing) {
      throw new Error("Identifier already in use");
    }

    const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

    const account = em.create(TableAccount, {
      identifier,
      passwordHash,
      mesa,
      nombre: input.nombre,
    });

    await em.persistAndFlush(account);
    return toDTO(account);
  }

  async updatePassword(id: number, newPassword: string) {
    const account = await em.findOneOrFail(TableAccount, { id });
    account.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await em.flush();
    return toDTO(account);
  }

  async validateCredentials(identifier: string, password: string) {
    const account = await em.findOne(TableAccount, { identifier }, { populate: ["mesa"] });
    if (!account) {
      return null;
    }

    const ok = await bcrypt.compare(password, account.passwordHash);
    return ok ? toDTO(account) : null;
  }

  async list() {
    const accounts = await em.find(TableAccount, {}, { populate: ["mesa"] });
    return accounts.map(toDTO);
  }
}

export const tableAccountService = new TableAccountService();
