import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import { TaskRow } from './TaskRow';
import { useTasks } from '../hooks/useTasks';

export function TaskList() {
  const { tasks, toggleTask } = useTasks();

  return (
    <FlatList
      style={styles.list}
      data={tasks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TaskRow task={item} onToggle={toggleTask} />
      )}
      testID="task_list"
    />
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
