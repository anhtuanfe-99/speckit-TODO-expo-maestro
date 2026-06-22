import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { TaskInput } from '../src/components/TaskInput';
import { TaskList } from '../src/components/TaskList';
import { useTasks } from '../src/hooks/useTasks';

export default function HomeScreen() {
  const { activeCount } = useTasks();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <Text style={styles.heading}>Tasks</Text>
      <Text style={styles.subtitle}>
        {activeCount} active task{activeCount !== 1 ? 's' : ''} remaining
      </Text>
      <TaskInput />
      <TaskList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 60,
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#333',
    paddingHorizontal: 16,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});
