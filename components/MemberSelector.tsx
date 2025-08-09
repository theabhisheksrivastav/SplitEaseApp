import { Member } from '@/types';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Card, RadioButton, Text } from 'react-native-paper';

interface MemberSelectorProps {
  members: Member[];
  selectedMember: string;
  onMemberSelect: (memberId: string) => void;
}

export function MemberSelector({ members, selectedMember, onMemberSelect }: MemberSelectorProps) {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.cardContent}>
        <RadioButton.Group onValueChange={onMemberSelect} value={selectedMember}>
          {members.map((member) => (
            <View key={member._id} style={styles.memberRow}>
              <View style={styles.memberInfo}>
                <Text variant="bodyLarge" style={styles.memberName}>
                  {member?.deviceName}
                </Text>
              </View>
              <RadioButton
                value={member._id}
                color="#6200EE"
              />
            </View>
          ))}
        </RadioButton.Group>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  cardContent: {
    paddingVertical: 8,
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    color: '#000000',
  },
});