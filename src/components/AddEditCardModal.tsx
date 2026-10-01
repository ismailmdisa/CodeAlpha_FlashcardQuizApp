import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AppModal } from './AppModal';
import { X, Check, AlertCircle, Sparkles } from 'lucide-react-native';
import { Flashcard } from '../types/flashcard';
import { THEME } from '../theme/flashcardTheme';

interface AddEditCardModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (data: {
    question: string;
    answer: string;
    category?: string;
    difficulty?: 'Easy' | 'Medium' | 'Hard';
  }) => void;
  initialCard: Flashcard | null;
  existingCategories: string[];
}

export const AddEditCardModal: React.FC<AddEditCardModalProps> = ({
  visible,
  onClose,
  onSave,
  initialCard,
  existingCategories,
}) => {
  const isEditing = !!initialCard;

  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCard) {
      setQuestion(initialCard.question);
      setAnswer(initialCard.answer);
      setCategory(initialCard.category || 'General');
      setDifficulty(initialCard.difficulty || 'Medium');
    } else {
      setQuestion('');
      setAnswer('');
      setCategory('General');
      setDifficulty('Medium');
    }
    setError(null);
  }, [initialCard, visible]);

  const handleSave = () => {
    if (!question.trim()) {
      setError('Please provide a question for the front face.');
      return;
    }
    if (!answer.trim()) {
      setError('Please provide an answer for the back face.');
      return;
    }

    onSave({
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim() || 'General',
      difficulty,
    });
    onClose();
  };

  return (
    <AppModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Pop Card ✏️' : 'Create Pop Card ✨'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {isEditing
                  ? 'Update question, answer or category'
                  : 'Add a new study question to your deck'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color="#09090b" />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollBody}
            keyboardShouldPersistTaps="handled"
          >
            {/* Error Banner */}
            {error && (
              <View style={styles.errorBox}>
                <AlertCircle size={16} color={THEME.colors.punchCoral} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Question Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Question (Front Face) *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="e.g. Can ostriches fly backwards?"
                placeholderTextColor={THEME.colors.textMuted}
                value={question}
                onChangeText={(t) => {
                  setQuestion(t);
                  if (error) setError(null);
                }}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Answer Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Answer (Back Face) *</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="e.g. NOPE! They can't even fly forward!"
                placeholderTextColor={THEME.colors.textMuted}
                value={answer}
                onChangeText={(t) => {
                  setAnswer(t);
                  if (error) setError(null);
                }}
                multiline
                numberOfLines={3}
              />
            </View>

            {/* Category / Topic */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category / Topic</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. Animal Whiz Trivia, React & Web"
                placeholderTextColor={THEME.colors.textMuted}
                value={category}
                onChangeText={setCategory}
              />

              {/* Quick suggestions */}
              {existingCategories.length > 0 && (
                <View style={styles.chipsWrap}>
                  {existingCategories.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        category.trim().toLowerCase() === cat.toLowerCase() &&
                          styles.categoryChipActive,
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          category.trim().toLowerCase() === cat.toLowerCase() &&
                            styles.categoryChipTextActive,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* Modal Footer Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Check size={16} color="#09090b" />
              <Text style={styles.saveBtnText}>
                {isEditing ? 'Save Changes' : 'Create Card'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 11, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  modalContent: {
    width: '100%',
    maxHeight: '92%',
    backgroundColor: THEME.colors.creamSurface,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 8,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#09090b',
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  modalSubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    fontWeight: THEME.typography.weights.medium,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#09090b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollBody: {
    padding: 18,
    gap: 14,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: THEME.radius.md,
    backgroundColor: '#ffe4e6',
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  errorText: {
    fontSize: 12,
    color: THEME.colors.punchCoral,
    fontWeight: THEME.typography.weights.bold,
    flex: 1,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#09090b',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#09090b',
    backgroundColor: '#ffffff',
    fontWeight: THEME.typography.weights.medium,
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  categoryChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  categoryChipActive: {
    backgroundColor: THEME.colors.neonLime,
  },
  categoryChipText: {
    fontSize: 11,
    color: '#09090b',
    fontWeight: THEME.typography.weights.bold,
  },
  categoryChipTextActive: {
    color: '#09090b',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    padding: 16,
    borderTopWidth: 2,
    borderTopColor: '#09090b',
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.bold,
    color: '#09090b',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.neonLime,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
});
