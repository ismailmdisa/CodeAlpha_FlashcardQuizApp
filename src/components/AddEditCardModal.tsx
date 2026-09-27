import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { X, Check, Plus, AlertCircle } from 'lucide-react-native';
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
      setError('Please provide a question for the front of the card.');
      return;
    }
    if (!answer.trim()) {
      setError('Please provide an answer for the back of the card.');
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
    <Modal
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
                {isEditing ? 'Edit Flashcard' : 'Create New Flashcard'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {isEditing
                  ? 'Update question, answer, or category'
                  : 'Add a new study question to your deck'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={20} color={THEME.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollBody}
            keyboardShouldPersistTaps="handled"
          >
            {/* Error Banner */}
            {error && (
              <View style={styles.errorBox}>
                <AlertCircle size={16} color={THEME.colors.danger} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Question Input */}
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Question (Front Face)</Text>
                <Text style={styles.requiredAsterisk}>*</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="e.g. What is the difference between let and const in JavaScript?"
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
              <View style={styles.labelRow}>
                <Text style={styles.label}>Answer (Back Face)</Text>
                <Text style={styles.requiredAsterisk}>*</Text>
              </View>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                placeholder="e.g. 'let' can be reassigned, while 'const' identifiers cannot be reassigned after declaration."
                placeholderTextColor={THEME.colors.textMuted}
                value={answer}
                onChangeText={(t) => {
                  setAnswer(t);
                  if (error) setError(null);
                }}
                multiline
                numberOfLines={4}
              />
            </View>

            {/* Category / Deck Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Category / Topic</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. JavaScript, React, Science"
                placeholderTextColor={THEME.colors.textMuted}
                value={category}
                onChangeText={setCategory}
              />

              {/* Suggestions Chips */}
              {existingCategories.length > 0 && (
                <View style={styles.categorySuggestions}>
                  <Text style={styles.suggestionTitle}>Existing topics:</Text>
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
                </View>
              )}
            </View>

            {/* Difficulty Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Difficulty Level</Text>
              <View style={styles.difficultyRow}>
                {(['Easy', 'Medium', 'Hard'] as const).map((lvl) => (
                  <TouchableOpacity
                    key={lvl}
                    style={[
                      styles.difficultyBtn,
                      difficulty === lvl && styles.difficultyBtnActive,
                    ]}
                    onPress={() => setDifficulty(lvl)}
                  >
                    <Text
                      style={[
                        styles.difficultyBtnText,
                        difficulty === lvl && styles.difficultyBtnTextActive,
                      ]}
                    >
                      {lvl}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Modal Actions */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Check size={16} color={THEME.colors.textInverse} />
              <Text style={styles.saveBtnText}>
                {isEditing ? 'Save Changes' : 'Create Card'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: THEME.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceSubtle,
  },
  modalTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  scrollBody: {
    padding: THEME.spacing.xl,
    gap: 16,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.dangerLight,
  },
  errorText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.danger,
    fontWeight: THEME.typography.weights.medium,
    flex: 1,
  },
  inputGroup: {
    gap: 6,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  requiredAsterisk: {
    color: THEME.colors.danger,
    fontWeight: THEME.typography.weights.bold,
  },
  textInput: {
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: THEME.typography.sizes.md,
    color: THEME.colors.textPrimary,
    backgroundColor: THEME.colors.background,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categorySuggestions: {
    marginTop: 6,
    gap: 6,
  },
  suggestionTitle: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textMuted,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  categoryChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  categoryChipActive: {
    backgroundColor: THEME.colors.primaryLight,
    borderColor: THEME.colors.primaryBorder,
  },
  categoryChipText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
  },
  categoryChipTextActive: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  difficultyRow: {
    flexDirection: 'row',
    gap: 10,
  },
  difficultyBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  difficultyBtnActive: {
    backgroundColor: THEME.colors.primaryLight,
    borderColor: THEME.colors.primary,
  },
  difficultyBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
  difficultyBtnTextActive: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceSubtle,
    backgroundColor: THEME.colors.surface,
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  cancelBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primary,
    ...THEME.shadows.button,
  },
  saveBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textInverse,
  },
});
