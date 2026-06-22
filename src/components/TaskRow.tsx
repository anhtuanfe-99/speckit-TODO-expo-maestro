import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Task } from '../types/task';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
}

export function TaskRow({ task, onToggle }: TaskRowProps) {
  return (
    <View style={styles.container} testID={`task_row_${task.id}`}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => onToggle(task.id)}
        testID="task_checkbox"
        accessibilityLabel={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        <View
          style={[
            styles.checkboxInner,
            task.completed && styles.checkboxChecked,
          ]}
        >
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>
      <Text
        style={[styles.title, task.completed && styles.titleCompleted]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {task.title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  checkbox: {
    width: 28,
    height: 28,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#4A90D9',
    borderColor: '#4A90D9',
  },
  checkmark: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
});
