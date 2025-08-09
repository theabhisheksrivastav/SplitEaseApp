import * as Clipboard from "expo-clipboard";
import { router, useLocalSearchParams } from "expo-router";
import { Users } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, View } from "react-native";
import { Appbar, Button, Card, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { approveJoin, getGroupDetails } from "../../app/api";
import { Expense, Group } from "../../types";

export default function GroupDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [approvingUserIds, setApprovingUserIds] = useState<string[]>([]);
  const insets = useSafeAreaInsets();

  
   const fetchGroupDetails = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getGroupDetails(id);
      setGroup(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load group details");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchGroupDetails();
  }, [id]);

  const handleAddMember = () => {
    if (!group || !group.joinCode || group.joinCode.length === 0) {
      console.warn('Join code not available');
      return;
    }
    Clipboard.setStringAsync(group.joinCode);
    console.log("Join code copied to clipboard:", group.joinCode);
    Alert.alert('Copied', `Join code "${group.joinCode}" copied to clipboard.`);
  };

  const handleAddExpense = () => {
    router.push(`/add-expense/${id}`);
  };

  const handleApproveJoinRequest = async (userId: string) => {
    if (!group) return;
    setApprovingUserIds(prev => [...prev, userId]);
    try {
      await approveJoin(group._id, userId);
      setGroup((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          joinRequests: prev.joinRequests.filter(u => u._id !== userId),
          members: [...prev.members, prev.joinRequests.find(u => u._id === userId)!],
        };
      });
    } catch (err) {
      console.error('Failed to approve join request', err);
      Alert.alert('Error', 'Failed to approve join request');
    } finally {
      setApprovingUserIds(prev => prev.filter(id => id !== userId));
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (error || !group) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ color: "red", margin: 16 }}>
          {error || "Group not found"}
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={group.name} titleStyle={styles.headerTitle} />
        <Appbar.Action icon="refresh" onPress={fetchGroupDetails} loading={loading} disabled={loading} />

      </Appbar.Header>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Button
          mode="contained"
          onPress={handleAddMember}
          style={styles.addMemberButton}
          contentStyle={styles.addMemberButtonContent}
          labelStyle={styles.addMemberButtonLabel}
          icon={() => <Users size={20} color="#FFFFFF" />}
        >
          Add Member
        </Button>

        <View style={styles.expensesList}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Expenses
          </Text>

          {!group.expenses?.length ? (
            <Card style={styles.emptyCard}>
              <Card.Content style={styles.emptyCardContent}>
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No expenses yet. Add your first expense!
                </Text>
              </Card.Content>
            </Card>
          ) : (
            group.expenses.map((expense: Expense) => (
              <Card key={expense._id} style={styles.expenseCard}>
                <Card.Content style={styles.expenseCardContent}>
                  <View style={styles.expenseInfo}>
                    <Text variant="titleMedium" style={styles.expenseDescription}>
                      {expense.description}
                    </Text>
                    <Text variant="bodyMedium" style={styles.expensePaidBy}>
                      By {expense.addedBy?.deviceName || "Unknown"}
                    </Text>
                  </View>
                  <View style={styles.amountContainer}>
                    <Text variant="titleMedium" style={styles.amount}>
                      ₹{expense.amount.toFixed(2)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            ))
          )}
        </View>

        {group.joinRequests && group.joinRequests.length > 0 && (
          <View style={styles.joinRequestsSection}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Join Requests
            </Text>

            {group.joinRequests.map((user) => (
              <Card key={user._id} style={styles.joinRequestCard}>
                <Card.Content style={styles.joinRequestContent}>
                  <Text variant="bodyMedium" style={styles.joinRequestName}>
                    {user.deviceName || 'Unknown User'}
                  </Text>
                  <Button
                    mode="contained"
                    onPress={() => handleApproveJoinRequest(user._id)}
                    loading={approvingUserIds.includes(user._id)}
                    disabled={approvingUserIds.includes(user._id)}
                    style={styles.approveButton}
                    labelStyle={styles.approveButtonLabel}
                  >
                    Approve
                  </Button>
                </Card.Content>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom || 16 }]}>
        <Button
          mode="contained"
          onPress={handleAddExpense}
          style={styles.addExpenseButton}
          contentStyle={styles.addExpenseButtonContent}
          labelStyle={styles.addExpenseButtonLabel}
        >
          Add Expense
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  header: { backgroundColor: "#FFFFFF", elevation: 0, shadowOpacity: 0 },
  headerTitle: { color: "#000000", fontWeight: "600" },
  content: { flex: 1 },
  contentContainer: { padding: 16, paddingBottom: 100 },
  addMemberButton: {
    backgroundColor: "#6200EE",
    marginBottom: 24,
    alignSelf: "flex-start",
  },
  addMemberButtonContent: { paddingVertical: 4, paddingHorizontal: 8 },
  addMemberButtonLabel: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },
  sectionTitle: { color: "#000000", fontWeight: "600", marginBottom: 16 },
  expensesList: { gap: 12 },
  emptyCard: { backgroundColor: "#F5F5F5", elevation: 0 },
  emptyCardContent: { paddingVertical: 32, alignItems: "center" },
  emptyText: { color: "#757575", textAlign: "center" },
  expenseCard: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  expenseCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  expenseInfo: { flex: 1 },
  expenseDescription: { color: "#000000", fontWeight: "600", marginBottom: 4 },
  expensePaidBy: { color: "#757575" },
  amountContainer: { alignItems: "flex-end" },
  amount: { color: "#000000", fontWeight: "600" },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  addExpenseButton: { backgroundColor: "#6200EE" },
  addExpenseButtonContent: { paddingVertical: 8 },
  addExpenseButtonLabel: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  joinRequestsSection: {
    marginBottom: 24,
    gap: 12,
  },
  joinRequestCard: {
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  joinRequestContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  joinRequestName: {
    color: '#000000',
    fontWeight: '600',
  },
  approveButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
  },
  approveButtonLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
