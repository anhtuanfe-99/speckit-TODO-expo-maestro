

// ── App ────────────────────────────────────────────────────────────────

import { StatusBar, View, StyleSheet } from "react-native";

export default function App() {


  // ── Render ───────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>
      <StatusBar  />

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
