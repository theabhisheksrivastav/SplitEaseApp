import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Button, Text, TextInput } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { addExpense, getGroupDetails } from '../../app/api';
import { MemberSelector } from '../../components/MemberSelector';
import { Group } from '../../types';

export default function AddExpenseScreen() {
  const { groupId } = useLocalSearchParams();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedMember, setSelectedMember] = useState<string>('');

  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await getGroupDetails(groupId as string);
        setGroup(data);
        console.log("this is group", data);
      } catch (err) {
        console.error('Failed to fetch group:', err);
        Alert.alert('Error', 'Unable to load group details.');
      } finally {
        setLoading(false);
      }
    };
    fetchGroup();
  }, [groupId]);

  const handleSaveExpense = async () => {
    if (!description.trim()) {
      console.log('Error', 'Please enter a description');
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    if (!amount.trim() || isNaN(parseFloat(amount))) {
      console.log('Error', 'Please enter a valid amount');
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (!selectedMember) {
      console.log('Error', 'Please select who paid');
      Alert.alert('Error', 'Please select who paid');
      return;
    }

    try {
      console.log('Adding expense:', {
        groupId,
        selectedMember,
        description,
        amount: parseFloat(amount),
      });
      await addExpense(
        groupId as string,
        selectedMember || '',
        description,
        parseFloat(amount)
      );
      console.log('Expense added successfully');
      Alert.alert('Success', 'Expense added successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err) {
      console.error('Error adding expense:', err);
      Alert.alert('Error', 'Failed to add expense. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!group) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Group not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Add Expense" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>Description</Text>
            <TextInput
              mode="outlined"
              value={description}
              onChangeText={setDescription}
              placeholder="Enter expense description"
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#6200EE"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>Amount</Text>
            <TextInput
              mode="outlined"
              value={amount}
              onChangeText={setAmount}
              placeholder="0.00"
              keyboardType="numeric"
              style={styles.input}
              outlineColor="#E0E0E0"
              activeOutlineColor="#6200EE"
              left={<TextInput.Affix text="$" />}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text variant="labelLarge" style={styles.label}>Paid By</Text>
            <MemberSelector
              members={group.members}
              selectedMember={selectedMember}
              onMemberSelect={setSelectedMember}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom || 16 }]}>
        <Button
          mode="contained"
          onPress={handleSaveExpense}
          style={styles.saveButton}
          contentStyle={styles.saveButtonContent}
          labelStyle={styles.saveButtonLabel}
        >
          Save Expense
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { backgroundColor: '#FFFFFF', elevation: 0, shadowOpacity: 0 },
  headerTitle: { color: '#000000', fontWeight: '600' },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 100 },
  form: { gap: 24 },
  inputGroup: { gap: 8 },
  label: { color: '#000000', fontWeight: '600' },
  input: { backgroundColor: '#FFFFFF' },
  bottomContainer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: '#E0E0E0',
  },
  saveButton: { backgroundColor: '#6200EE' },
  saveButtonContent: { paddingVertical: 8 },
  saveButtonLabel: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
