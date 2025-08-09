// app/group/create/index.tsx
import { createGroup } from '@/app/api';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Appbar, Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { userId } = useUser();

  const handleCreateGroup = async () => {
    if (!groupName.trim()) return;

    try {
      setLoading(true);
      await createGroup(groupName.trim(), userId || '');
      router.push('/');
    } catch (err) {
      console.error('Error creating group', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Create Group" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.content}>
        <Text variant="titleLarge" style={styles.title}>
          Enter Group Name
        </Text>
        <TextInput
          mode="outlined"
          placeholder="e.g. Trip to Bali"
          value={groupName}
          onChangeText={setGroupName}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleCreateGroup}
          loading={loading}
          disabled={loading || !groupName.trim()}
          style={styles.createButton}
          contentStyle={styles.createButtonContent}
          labelStyle={styles.createButtonLabel}
        >
          Create Group
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#FFFFFF', elevation: 0, shadowOpacity: 0 },
  headerTitle: { color: '#000000', fontWeight: '600' },
  content: { flex: 1, padding: 16 },
  title: { marginBottom: 16, color: '#000000', fontWeight: '600' },
  input: { marginBottom: 24, backgroundColor: '#FFFFFF' },
  createButton: { backgroundColor: '#6200EE' },
  createButtonContent: { paddingVertical: 8 },
  createButtonLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
