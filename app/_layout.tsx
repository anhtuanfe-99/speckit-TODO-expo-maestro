import { Stack } from 'expo-router';
import { TaskProvider } from '../src/context/TaskContext';

export default function RootLayout() {
  return (
    <TaskProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TaskProvider>
  );
}
