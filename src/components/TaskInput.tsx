import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTasks } from '../hooks/useTasks';

export function TaskInput() {
  const [text, setText] = useState('');
  const { addTask } = useTasks();

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    addTask(trimmed);
    setText('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="What needs to be done?"
        placeholderTextColor="#999"
        value={text}
        onChangeText={setText}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        testID="task_input"
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleSubmit}
        testID="add_button"
        accessibilityLabel="Add task"
      >
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    width: 44,
    height: 44,
    marginLeft: 8,
    backgroundColor: '#4A90D9',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 26,
  },
});
