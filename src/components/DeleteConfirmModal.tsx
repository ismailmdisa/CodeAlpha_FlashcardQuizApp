import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal } from 'react-native';
import { Trash2, AlertTriangle } from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';
import { Flashcard } from '../types/flashcard';

interface DeleteConfirmModalProps {
  visible: boolean;
  card: Flashcard | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  visible,
  card,
  onClose,
  onConfirm,
}) => {
  if (!card) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <AlertTriangle size={24} color="#ffffff" />
          </View>

          <Text style={styles.title}>Delete This Card? 🗑️</Text>
          <Text style={styles.message}>
            Are you sure you want to delete this study flashcard?
          </Text>

          <View style={styles.cardPreview}>
            <Text style={styles.previewQuestion} numberOfLines={2}>
              "{card.question}"
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Keep Card</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={onConfirm}
              activeOpacity={0.85}
            >
              <Trash2 size={16} color="#ffffff" />
              <Text style={styles.deleteBtnText}>Delete!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 11, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: THEME.colors.creamSurface,
    borderRadius: 26,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: THEME.colors.punchCoral,
    borderWidth: 2,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  message: {
    fontSize: 13,
    color: THEME.colors.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    fontWeight: THEME.typography.weights.medium,
  },
  cardPreview: {
    width: '100%',
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#09090b',
    marginVertical: 14,
  },
  previewQuestion: {
    fontSize: 13,
    color: '#09090b',
    fontWeight: THEME.typography.weights.semibold,
    fontStyle: 'italic',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.punchCoral,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#ffffff',
  },
});
