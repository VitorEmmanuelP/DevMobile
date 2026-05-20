import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { StackParamList } from '../../routes/stack';
import { SCREEN_NAMES } from '../../constants/screens';
import { subscribeToAllPresencesByDate, PresenceStatus } from '../../services/presenceService';
import { subscribeToAllUsers } from '../../services/userService';
import { AppUser } from '../../types';

type Props = StackScreenProps<StackParamList, typeof SCREEN_NAMES.DAY_DETAIL>;

type UserWithStatus = AppUser & { status: PresenceStatus };

const STATUS_CONFIG: Record<PresenceStatus, { label: string; color: string; bg: string }> = {
  vai: { label: 'Vai', color: '#059669', bg: '#D1FAE5' },
  nao_vai: { label: 'Não vai', color: '#DC2626', bg: '#FEE2E2' },
  sem_resposta: { label: 'Sem resposta', color: '#6B7280', bg: '#F3F4F6' },
};

function formatDateLabel(dateString: string, label: string): string {
  const [, month, day] = dateString.split('-');
  return `${label}, ${day}/${month}`;
}

export default function DayDetailScreen({ navigation, route }: Props) {
  const { date, label } = route.params;
  const [users, setUsers] = useState<AppUser[]>([]);
  const [presences, setPresences] = useState<Record<string, PresenceStatus>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAllUsers((allUsers) => {
      setUsers(allUsers);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const unsub = subscribeToAllPresencesByDate(date, setPresences);
    return unsub;
  }, [date]);

  const data: UserWithStatus[] = users.map((u) => ({
    ...u,
    status: presences[u.uid] ?? 'sem_resposta',
  }));

  const counts = {
    vai: data.filter((u) => u.status === 'vai').length,
    nao_vai: data.filter((u) => u.status === 'nao_vai').length,
    sem_resposta: data.filter((u) => u.status === 'sem_resposta').length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{formatDateLabel(date, label)}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <View style={styles.summary}>
        <View style={[styles.summaryItem, { backgroundColor: '#D1FAE5' }]}>
          <Text style={[styles.summaryCount, { color: '#059669' }]}>{counts.vai}</Text>
          <Text style={[styles.summaryLabel, { color: '#059669' }]}>Vão</Text>
        </View>
        <View style={[styles.summaryItem, { backgroundColor: '#FEE2E2' }]}>
          <Text style={[styles.summaryCount, { color: '#DC2626' }]}>{counts.nao_vai}</Text>
          <Text style={[styles.summaryLabel, { color: '#DC2626' }]}>Não vão</Text>
        </View>
        <View style={[styles.summaryItem, { backgroundColor: '#F3F4F6' }]}>
          <Text style={[styles.summaryCount, { color: '#6B7280' }]}>{counts.sem_resposta}</Text>
          <Text style={[styles.summaryLabel, { color: '#6B7280' }]}>Sem resposta</Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#6366F1" style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.uid}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const cfg = STATUS_CONFIG[item.status];
            return (
              <View style={styles.card}>
                {item.photoUrl ? (
                  <Image source={{ uri: item.photoUrl }} style={styles.avatar} />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarInitial}>
                      {item.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                )}
                <View style={styles.cardInfo}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: cfg.bg }]}>
                  <Text style={[styles.badgeText, { color: cfg.color }]}>{cfg.label}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  backBtn: { padding: 4 },
  backText: { fontSize: 15, color: '#6366F1', fontWeight: '600' },
  title: { fontSize: 18, fontWeight: '700', color: '#1E1E2E' },
  headerSpacer: { width: 60 },
  summary: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  summaryCount: { fontSize: 24, fontWeight: '700' },
  summaryLabel: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  loader: { marginTop: 40 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#E5E7EB' },
  avatarFallback: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  cardInfo: { flex: 1, marginLeft: 12 },
  name: { fontSize: 15, fontWeight: '600', color: '#1E1E2E' },
  email: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeText: { fontSize: 12, fontWeight: '600' },
});
