import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { signOut } from 'firebase/auth';
import { StackScreenProps } from '@react-navigation/stack';
import { auth } from '../../config';
import { useAuth } from '../../context';
import {
  setPresence,
  subscribeToUserPresences,
  PresenceStatus,
} from '../../services/presenceService';
import { subscribeToUserProfile } from '../../services/userService';
import { AppUser } from '../../types';
import { StackParamList } from '../../routes/stack';
import { SCREEN_NAMES } from '../../constants/screens';

type Props = StackScreenProps<StackParamList, typeof SCREEN_NAMES.HOME>;

type WeekDay = {
  date: Date;
  dateString: string;
  label: string;
  dayNumber: string;
};

const DAY_NAMES = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
const MIN_OFFSET = -4;
const MAX_OFFSET = 4;

function toDateString(d: Date): string {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

function getWeekDays(offset: number): WeekDay[] {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7) + offset * 7);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      date: d,
      dateString: toDateString(d),
      label: DAY_NAMES[d.getDay()],
      dayNumber: String(d.getDate()).padStart(2, '0'),
    };
  });
}

function getWeekLabel(days: WeekDay[]): string {
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const d1 = String(first.getDate()).padStart(2, '0');
  const d2 = String(last.getDate()).padStart(2, '0');
  const m1 = MONTH_NAMES[first.getMonth()];
  const m2 = MONTH_NAMES[last.getMonth()];
  return m1 === m2 ? `${d1} - ${d2} ${m1}` : `${d1} ${m1} - ${d2} ${m2}`;
}

export default function HomeScreen({ navigation }: Props) {
  const { user } = useAuth();
  const [weekOffset, setWeekOffset] = useState(0);
  const weekDays = useMemo(() => getWeekDays(weekOffset), [weekOffset]);
  const [presences, setPresences] = useState<Record<string, PresenceStatus>>({});
  const [loadingDay, setLoadingDay] = useState<Record<string, boolean>>({});
  const [profile, setProfile] = useState<AppUser | null>(null);

  useEffect(() => {
    if (!user) return;
    const dates = weekDays.map((d) => d.dateString);
    const unsubscribe = subscribeToUserPresences(user.uid, dates, setPresences);
    return unsubscribe;
  }, [user, weekDays]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToUserProfile(user.uid, setProfile);
    return unsubscribe;
  }, [user]);

  async function handleToggle(dateString: string, status: PresenceStatus) {
    if (!user) return;
    const current = presences[dateString];
    const next: PresenceStatus = current === status ? 'sem_resposta' : status;
    setLoadingDay((prev) => ({ ...prev, [dateString]: true }));
    try {
      await setPresence(user.uid, dateString, next);
    } finally {
      setLoadingDay((prev) => ({ ...prev, [dateString]: false }));
    }
  }

  const todayString = toDateString(new Date());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Presença Semanal</Text>
        <TouchableOpacity onPress={() => signOut(auth)} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>
        {profile?.name ?? user?.displayName ?? user?.email ?? 'Aluno'}
      </Text>

      <View style={styles.weekNav}>
        <TouchableOpacity
          onPress={() => setWeekOffset((o) => o - 1)}
          disabled={weekOffset <= MIN_OFFSET}
          style={[styles.navBtn, weekOffset <= MIN_OFFSET && styles.navBtnDisabled]}
        >
          <Text style={[styles.navArrow, weekOffset <= MIN_OFFSET && styles.navArrowDisabled]}>‹</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setWeekOffset(0)} style={styles.weekLabelBtn}>
          <Text style={styles.weekLabel}>{getWeekLabel(weekDays)}</Text>
          {weekOffset !== 0 && <Text style={styles.weekToday}>Hoje</Text>}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setWeekOffset((o) => o + 1)}
          disabled={weekOffset >= MAX_OFFSET}
          style={[styles.navBtn, weekOffset >= MAX_OFFSET && styles.navBtnDisabled]}
        >
          <Text style={[styles.navArrow, weekOffset >= MAX_OFFSET && styles.navArrowDisabled]}>›</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {weekDays.map((item) => {
          const status = presences[item.dateString];
          const isToday = item.dateString === todayString;
          const isLoading = loadingDay[item.dateString];

          return (
            <TouchableOpacity
              key={item.dateString}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate(SCREEN_NAMES.DAY_DETAIL, {
                  date: item.dateString,
                  label: item.label,
                })
              }
            >
            <View style={[styles.card, isToday && styles.cardToday]}>
              <View style={styles.cardLeft}>
                <Text style={[styles.dayLabel, isToday && styles.todayAccent]}>
                  {item.label}
                </Text>
                <Text style={[styles.dayNumber, isToday && styles.todayAccent]}>
                  {item.dayNumber}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                {status === 'vai' && (
                  <View style={styles.badgeVai}>
                    <Text style={styles.badgeText}>✓ Confirmado</Text>
                  </View>
                )}
                {status === 'nao_vai' && (
                  <View style={styles.badgeNaoVai}>
                    <Text style={styles.badgeText}>✗ Não vai</Text>
                  </View>
                )}
                {(!status || status === 'sem_resposta') && (
                  <View style={styles.badgePending}>
                    <Text style={[styles.badgeText, styles.badgePendingText]}>
                      Sem resposta
                    </Text>
                  </View>
                )}
              </View>

              {isLoading ? (
                <ActivityIndicator size="small" color="#6366F1" style={styles.loader} />
              ) : (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={[styles.btn, status === 'vai' && styles.btnVaiActive]}
                    onPress={() => handleToggle(item.dateString, 'vai')}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        status === 'vai' && styles.btnVaiText,
                      ]}
                    >
                      Vai
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.btn, status === 'nao_vai' && styles.btnNaoVaiActive]}
                    onPress={() => handleToggle(item.dateString, 'nao_vai')}
                  >
                    <Text
                      style={[
                        styles.btnText,
                        status === 'nao_vai' && styles.btnNaoVaiText,
                      ]}
                    >
                      Não vai
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate(SCREEN_NAMES.RIDE_REGISTER)}
        activeOpacity={0.85}
      >
        <Text style={styles.fabText}>+ Carona</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: { fontSize: 22, fontWeight: '700', color: '#1E1E2E' },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  logoutBtn: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: { color: '#FFF', fontWeight: '600', fontSize: 13 },
  list: { paddingHorizontal: 16, paddingBottom: 96 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardToday: {
    borderLeftWidth: 4,
    borderLeftColor: '#6366F1',
  },
  cardLeft: { alignItems: 'center', width: 44 },
  dayLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  dayNumber: { fontSize: 20, fontWeight: '700', color: '#1E1E2E' },
  todayAccent: { color: '#6366F1' },
  statusBadge: { flex: 1, paddingHorizontal: 10 },
  badgeVai: {
    backgroundColor: '#D1FAE5',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeNaoVai: {
    backgroundColor: '#FEE2E2',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgePending: {
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeText: { fontSize: 12, fontWeight: '600', color: '#1E1E2E' },
  badgePendingText: { color: '#9CA3AF' },
  loader: { marginLeft: 8 },
  actions: { flexDirection: 'row', gap: 6 },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFF',
  },
  btnVaiActive: { backgroundColor: '#D1FAE5', borderColor: '#10B981' },
  btnNaoVaiActive: { backgroundColor: '#FEE2E2', borderColor: '#EF4444' },
  btnText: { fontSize: 12, color: '#6B7280', fontWeight: '600' },
  btnVaiText: { color: '#065F46' },
  btnNaoVaiText: { color: '#991B1B' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#6366F1',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingVertical: 14,
    shadowColor: '#6366F1',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  weekNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtnDisabled: { backgroundColor: '#F9FAFB' },
  navArrow: { fontSize: 22, fontWeight: '700', color: '#6366F1', lineHeight: 26 },
  navArrowDisabled: { color: '#D1D5DB' },
  weekLabelBtn: { alignItems: 'center' },
  weekLabel: { fontSize: 15, fontWeight: '700', color: '#1E1E2E' },
  weekToday: { fontSize: 11, color: '#6366F1', fontWeight: '600', marginTop: 2 },
});
