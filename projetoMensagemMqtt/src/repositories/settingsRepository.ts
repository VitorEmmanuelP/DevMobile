import * as Crypto from 'expo-crypto';

import { appError } from '../appError';
import { DEFAULT_BROKER } from '../config';
import { getDatabase } from '../database/database';
import { Settings, UpdateSettingsInput } from '../types';

interface SettingsRow {
  nickname: string;
  broker_host: string;
  broker_port: number;
  use_ssl: number;
  client_id: string;
}

export interface SettingsRepository {
  get(): Promise<Settings | null>;
  save(input: UpdateSettingsInput): Promise<Settings>;
}

function mapRow(row: SettingsRow): Settings {
  return {
    nickname: row.nickname,
    brokerHost: row.broker_host,
    brokerPort: row.broker_port,
    useSsl: row.use_ssl === 1,
    clientId: row.client_id,
  };
}

async function get(): Promise<Settings | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<SettingsRow>('SELECT * FROM settings WHERE id = 1');
  return row ? mapRow(row) : null;
}

async function save(input: UpdateSettingsInput): Promise<Settings> {
  const db = await getDatabase();
  const current = await get();

  const merged: Settings = {
    nickname: input.nickname ?? current?.nickname ?? '',
    brokerHost: input.brokerHost ?? current?.brokerHost ?? DEFAULT_BROKER.host,
    brokerPort: input.brokerPort ?? current?.brokerPort ?? DEFAULT_BROKER.port,
    useSsl: input.useSsl ?? current?.useSsl ?? DEFAULT_BROKER.useSsl,
    clientId: current?.clientId ?? Crypto.randomUUID(),
  };

  if (!merged.nickname || !merged.brokerHost || !merged.brokerPort) {
    throw appError('INVALID_INPUT', 'Apelido, host e porta do broker são obrigatórios.');
  }

  await db.runAsync(
    `INSERT INTO settings (id, nickname, broker_host, broker_port, use_ssl, client_id)
     VALUES (1, ?, ?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET
       nickname = excluded.nickname,
       broker_host = excluded.broker_host,
       broker_port = excluded.broker_port,
       use_ssl = excluded.use_ssl`,
    [merged.nickname, merged.brokerHost, merged.brokerPort, merged.useSsl ? 1 : 0, merged.clientId]
  );

  return merged;
}

export const settingsRepository: SettingsRepository = { get, save };
