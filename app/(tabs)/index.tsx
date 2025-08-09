import { getGroups, joinGroup } from '@/app/api';
import { useUser } from '@/context/UserContext';
import { Group } from '@/types';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { Appbar, Button, Card, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [groups, setGroups] = useState<Group[]>([]);
  const { userId } = useUser();
  const [joinCode, setJoinCode] = useState('');
const [joining, setJoining] = useState(false);
 const [loading, setLoading] = useState(false);

  const fetchGroups = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await getGroups(userId);
      setGroups(data);
      console.log(data);
    } catch (err) {
      console.error('Error fetching active groups', err);
      Alert.alert('Error', 'Failed to fetch groups');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [userId]);

  const handleCreateGroup = () => {
    router.push('/group/create'); // better than hardcoding `/group/1`
  };

  const handleGroupPress = (groupId: string) => {
    router.push(`/group/${groupId}`);
  };

  const handleJoinGroup = async () => {
  if (!joinCode.trim()) {
    Alert.alert('Error', 'Please enter a join code');
    return;
  }
  if (!userId) {
    Alert.alert('Error', 'User not logged in');
    return;
  }

  setJoining(true);
  try {
    const response = await joinGroup(joinCode.trim(), userId);
    Alert.alert('Success', response.message || 'Join request sent');
    setJoinCode('');
    // Optionally, refresh groups after joining
    const data = await getGroups(userId);
    setGroups(data);
  } catch (error: any) {
    Alert.alert('Error', error.response?.data?.message || 'Failed to send join request');
  } finally {
    setJoining(false);
  }
};


  const calculateTotalBalance = (group: Group) => {
    if (!group.expenses || group.expenses.length === 0) return 0;
    return group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };


  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="Split-Ease" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="refresh" onPress={fetchGroups} loading={loading} disabled={loading} />

      </Appbar.Header>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={{ marginBottom: 24 }}>
  <TextInput
    label="Join Code"
    mode="outlined"
    value={joinCode}
    onChangeText={setJoinCode}
    style={{ marginBottom: 8 }}
    autoCapitalize="characters"
  />
  <Button
    mode="outlined"
    onPress={handleJoinGroup}
    loading={joining}
    disabled={joining}
  >
    Join Group
  </Button>
</View>

        <Button
          mode="contained"
          onPress={handleCreateGroup}
          style={styles.createButton}
          contentStyle={styles.createButtonContent}
          labelStyle={styles.createButtonLabel}
        >
          Create New Group
        </Button>

        <View style={styles.groupsList}>
          {groups.map((group) => (
            <Card
              key={group._id}
              style={styles.groupCard}
              onPress={() => handleGroupPress(group._id)}
            >
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
                  <Text variant="titleMedium" style={styles.balance}>
                    Rs.{calculateTotalBalance(group).toFixed(2)}
                  </Text>

                </View>
              </Card.Content>
            </Card>
          ))}
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
  createButton: { backgroundColor: '#6200EE', marginBottom: 24 },
  createButtonContent: { paddingVertical: 8 },
  createButtonLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  groupsList: { gap: 12 },
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
  balance: { color: '#6200EE', fontWeight: '600' },
});
