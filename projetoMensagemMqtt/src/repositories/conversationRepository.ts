import * as Crypto from 'expo-crypto';

import { appError } from '../appError';
import { getDatabase } from '../database/database';
import { Conversation, CreateConversationInput } from '../types';

interface ConversationRow {
  id: string;
  name: string;
  topic: string;
  created_at: string;
}

export interface ConversationRepository {
  create(input: CreateConversationInput): Promise<Conversation>;
  findAll(): Promise<Conversation[]>;
  findById(id: string): Promise<Conversation | null>;
  findByTopic(topic: string): Promise<Conversation | null>;
  delete(id: string): Promise<void>;
}

function mapRow(row: ConversationRow): Conversation {
  return {
    id: row.id,
    name: row.name,
    topic: row.topic,
    createdAt: row.created_at,
  };
}

async function create(input: CreateConversationInput): Promise<Conversation> {
  const db = await getDatabase();

  const existing = await db.getFirstAsync<{ id: string }>(
    'SELECT id FROM conversations WHERE topic = ?',
    [input.topic]
  );
  if (existing) {
    throw appError('TOPIC_ALREADY_EXISTS', `Já existe uma conversa com o tópico "${input.topic}".`);
  }

  const conversation: Conversation = {
    id: Crypto.randomUUID(),
    name: input.name,
    topic: input.topic,
    createdAt: new Date().toISOString(),
  };

  await db.runAsync(
    'INSERT INTO conversations (id, name, topic, created_at) VALUES (?, ?, ?, ?)',
    [conversation.id, conversation.name, conversation.topic, conversation.createdAt]
  );

  return conversation;
}

async function findAll(): Promise<Conversation[]> {
  const db = await getDatabase();
  const rows = await db.getAllAsync<ConversationRow>(
    'SELECT * FROM conversations ORDER BY created_at DESC'
  );
  return rows.map(mapRow);
}

async function findById(id: string): Promise<Conversation | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ConversationRow>(
    'SELECT * FROM conversations WHERE id = ?',
    [id]
  );
  return row ? mapRow(row) : null;
}

async function findByTopic(topic: string): Promise<Conversation | null> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<ConversationRow>(
    'SELECT * FROM conversations WHERE topic = ?',
    [topic]
  );
  return row ? mapRow(row) : null;
}

async function remove(id: string): Promise<void> {
  const db = await getDatabase();
  await db.runAsync('DELETE FROM conversations WHERE id = ?', [id]);
}

export const conversationRepository: ConversationRepository = {
  create,
  findAll,
  findById,
  findByTopic,
  delete: remove,
};
