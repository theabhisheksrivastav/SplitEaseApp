import { getGroups } from '@/app/api';
import { useUser } from '@/context/UserContext';
import { Group } from '@/types';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const [pastGroups, setPastGroups] = useState<Group[]>([]);
  const { userId } = useUser();

  useEffect(() => {
    const fetchPastGroups = async () => {
      try {
        const data = await getGroups(userId || '');
        setPastGroups(data);
      } catch (err) {
        console.error('Error fetching past groups', err);
      }
    };
    if (userId) fetchPastGroups();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="History" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.groupsList}>
          {pastGroups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text variant="bodyLarge" style={styles.emptyText}>
                No past groups yet
              </Text>
            </View>
          ) : (
            pastGroups.map((group) => (
              <Card key={group._id} style={styles.groupCard}>
                <Card.Content style={styles.groupCardContent}>
                  <View style={styles.groupInfo}>
                    <Text variant="titleMedium" style={styles.groupName}>
                      {group.name}
                    </Text>
                    <Text variant="bodyMedium" style={styles.memberCount}>
                      {group.members.length} members
                    </Text>
                  </View>
                  <View style={styles.balanceContainer}>
                    <Text variant="labelSmall" style={styles.balanceLabel}>
                      Net Balance
                    </Text>
                    <Text variant="titleMedium" style={styles.balance}>
                     ${typeof group.totalBalance === 'number' ? group.totalBalance.toFixed(2) : '0.00'}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#FFFFFF', elevation: 0, shadowOpacity: 0 },
  headerTitle: { color: '#000000', fontWeight: '600' },
  content: { flex: 1 },
  contentContainer: { padding: 16 },
  groupsList: { gap: 12 },
  emptyState: {
    flex: 1, justifyContent: 'center',
    alignItems: 'center', paddingVertical: 48,
  },
  emptyText: { color: '#757575', textAlign: 'center' },
  groupCard: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  groupCardContent: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 8,
  },
  groupInfo: { flex: 1 },
  groupName: { color: '#000000', fontWeight: '600', marginBottom: 4 },
  memberCount: { color: '#757575' },
  balanceContainer: { alignItems: 'flex-end' },
  balanceLabel: { color: '#757575', marginBottom: 2 },
  balance: { color: '#6200EE', fontWeight: '600' },
});
