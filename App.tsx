import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// ── Types ──────────────────────────────────────────────────────────────

type TaskStatus = 'active' | 'completed';

interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

type FilterOption = 'all' | 'active' | 'completed';

// ── Utility functions ──────────────────────────────────────────────────

function getFilteredTasks(tasks: Task[], filter: FilterOption): Task[] {
  switch (filter) {
    case 'all':
      return tasks;
    case 'active':
      return tasks.filter((t) => t.status === 'active');
    case 'completed':
      return tasks.filter((t) => t.status === 'completed');
  }
}

function getCounts(tasks: Task[]) {
  return {
    total: tasks.length,
    active: tasks.filter((t) => t.status === 'active').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };
}

// ── Helpers ────────────────────────────────────────────────────────────

let nextId = 1;
function generateId(): string {
  return `task_${nextId++}`;
}

// ── Empty state messages ────────────────────────────────────────────────

const EMPTY_MESSAGES: Record<FilterOption, string> = {
  all: 'No tasks yet. Add one above!',
  active: 'No active tasks!',
  completed: 'No completed tasks yet!',
};

// ── App ────────────────────────────────────────────────────────────────

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editText, setEditText] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');

  const filteredTasks = getFilteredTasks(tasks, activeFilter);
  const counts = getCounts(tasks);
  const isEmpty = filteredTasks.length === 0;

  // ── Handlers ─────────────────────────────────────────────────────────

  function handleAddTask() {
    const trimmed = inputText.trim();
    if (trimmed.length === 0) {
      return; // UC-01 AC-2: empty / whitespace-only rejection
    }
    const newTask: Task = {
      id: generateId(),
      title: trimmed,
      status: 'active',
    };
    setTasks((prev) => [...prev, newTask]);
    setInputText(''); // UC-01 AC-1: clear input after creation
  }

  function handleStartEdit(task: Task) {
    setEditingTaskId(task.id);
    setEditText(task.title);
  }

  function handleConfirmEdit() {
    const trimmed = editText.trim();
    if (trimmed.length === 0) {
      // UC-02 A2/A3: empty / whitespace → revert
      setEditingTaskId(null);
      setEditText('');
      return;
    }
    setTasks((prev) =>
      prev.map((t) => (t.id === editingTaskId ? { ...t, title: trimmed } : t)),
    );
    setEditingTaskId(null);
    setEditText('');
  }

  function handleCancelEdit() {
    setEditingTaskId(null);
    setEditText('');
  }

  function handleToggleComplete(taskId: string) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: t.status === 'active' ? 'completed' : 'active' }
          : t,
      ),
    );
  }

  function handleDeleteTask(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  }

  // ── Render helpers ───────────────────────────────────────────────────

  function renderTaskItem({ item }: { item: Task }) {
    const isEditing = editingTaskId === item.id;
    const isCompleted = item.status === 'completed';

    return (
      <View style={styles.taskItem} testID="task_item">
        {/* Completion checkbox */}
        <Pressable
          style={styles.checkbox}
          testID="task_checkbox"
          onPress={() => handleToggleComplete(item.id)}
        >
          <View
            style={[
              styles.checkboxInner,
              isCompleted && styles.checkboxInnerCompleted,
            ]}
            testID={isCompleted ? 'task_completed' : undefined}
          >
            {isCompleted ? <Text style={styles.checkmark}>✓</Text> : null}
          </View>
        </Pressable>

        {/* Title (display or edit) */}
        {isEditing ? (
          <View style={styles.editRow}>
            <TextInput
              style={styles.editInput}
              testID="task_title"
              value={editText}
              onChangeText={setEditText}
              onSubmitEditing={handleConfirmEdit}
              autoFocus
            />
            <Pressable
              style={styles.cancelEditButton}
              testID="cancel_edit_button"
              onPress={handleCancelEdit}
            >
              <Text style={styles.cancelEditText}>✕</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            style={styles.titlePressable}
            onPress={() => handleStartEdit(item)}
          >
            <Text
              style={[styles.taskTitle, isCompleted && styles.taskTitleCompleted]}
              testID="task_title"
            >
              {item.title}
            </Text>
          </Pressable>
        )}

        {/* Delete button */}
        <Pressable
          style={styles.deleteButton}
          testID="delete_button"
          onPress={() => handleDeleteTask(item.id)}
        >
          <Text style={styles.deleteText}>✕</Text>
        </Pressable>
      </View>
    );
  }

  function renderEmptyState() {
    return (
      <View style={styles.emptyState} testID="empty_state">
        <Text style={styles.emptyStateText}>
          {EMPTY_MESSAGES[activeFilter]}
        </Text>
      </View>
    );
  }

  // ── Render ───────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      {/* Header */}
      <Text style={styles.heading}>Tasks</Text>
      <Text style={styles.counts}>
        {counts.active} active · {counts.completed} completed
      </Text>

      {/* New task input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          testID="task_input"
          placeholder="Add a new task..."
          placeholderTextColor="#999"
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={handleAddTask}
          returnKeyType="done"
        />
        <Pressable
          style={styles.addButton}
          testID="add_task_button"
          onPress={handleAddTask}
        >
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Filter bar */}
      <View style={styles.filterRow}>
        {(['all', 'active', 'completed'] as FilterOption[]).map((opt) => (
          <Pressable
            key={opt}
            style={[
              styles.filterChip,
              activeFilter === opt && styles.filterChipActive,
            ]}
            testID={`filter_${opt}`}
            onPress={() => setActiveFilter(opt)}
          >
            <Text
              style={[
                styles.filterChipText,
                activeFilter === opt && styles.filterChipTextActive,
              ]}
            >
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Task list */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTaskItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={
          isEmpty ? styles.listEmptyContainer : styles.listContainer
        }
      />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  counts: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },

  // Input
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: '#1a1a1a',
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
  },

  // Filter
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  filterChipActive: {
    backgroundColor: '#007AFF',
  },
  filterChipText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#fff',
  },

  // Task list
  listContainer: {
    paddingBottom: 40,
  },
  listEmptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Task item
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    marginRight: 12,
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
  checkboxInnerCompleted: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  checkmark: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '700',
  },
  titlePressable: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  editRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 6,
    paddingHorizontal: 8,
    fontSize: 16,
    color: '#1a1a1a',
  },
  cancelEditButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
  },
  cancelEditText: {
    fontSize: 14,
    color: '#666',
  },
  deleteButton: {
    marginLeft: 8,
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 16,
    color: '#999',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#aaa',
  },
});
