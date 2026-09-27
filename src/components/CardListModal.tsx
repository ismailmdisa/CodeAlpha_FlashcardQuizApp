import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';
import {
  X,
  Search,
  Plus,
  Edit3,
  Trash2,
  BookOpen,
  RotateCcw,
  Sparkles,
} from 'lucide-react-native';
import { Flashcard } from '../types/flashcard';
import { THEME } from '../theme/flashcardTheme';

interface CardListModalProps {
  visible: boolean;
  cards: Flashcard[];
  onClose: () => void;
  onSelectCard: (index: number) => void;
  onEditCard: (card: Flashcard) => void;
  onDeleteCard: (card: Flashcard) => void;
  onAddNew: () => void;
  onResetDefaults: () => void;
}

export const CardListModal: React.FC<CardListModalProps> = ({
  visible,
  cards,
  onClose,
  onSelectCard,
  onEditCard,
  onDeleteCard,
  onAddNew,
  onResetDefaults,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Compute categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    cards.forEach((c) => {
      if (c.category) set.add(c.category.trim());
    });
    return Array.from(set);
  }, [cards]);

  // Filter cards
  const filtered = useMemo(() => {
    return cards.filter((card) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        card.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        card.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCat =
        filterCategory === 'ALL' || card.category === filterCategory;

      return matchesSearch && matchesCat;
    });
  }, [cards, searchQuery, filterCategory]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Card Library</Text>
              <Text style={styles.subtitle}>
                {cards.length} cards total • Manage and customize your deck
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

          {/* Search Bar & Add Button */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Search size={16} color={THEME.colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search cards by question or keyword..."
                placeholderTextColor={THEME.colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color={THEME.colors.textMuted} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.addNewBtn}
              onPress={() => {
                onClose();
                onAddNew();
              }}
              activeOpacity={0.8}
            >
              <Plus size={16} color={THEME.colors.textInverse} />
              <Text style={styles.addNewBtnText}>Add</Text>
            </TouchableOpacity>
          </View>

          {/* Category Filter Chips */}
          <View style={styles.categoryBar}>
            <TouchableOpacity
              style={[
                styles.categoryChip,
                filterCategory === 'ALL' && styles.categoryChipActive,
              ]}
              onPress={() => setFilterCategory('ALL')}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  filterCategory === 'ALL' && styles.categoryChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  filterCategory === cat && styles.categoryChipActive,
                ]}
                onPress={() => setFilterCategory(cat)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    filterCategory === cat && styles.categoryChipTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Card Items List */}
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item, index }) => (
              <View style={styles.cardItem}>
                <TouchableOpacity
                  style={styles.cardMainInfo}
                  onPress={() => {
                    const originalIndex = cards.findIndex((c) => c.id === item.id);
                    onSelectCard(originalIndex >= 0 ? originalIndex : 0);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardItemHeader}>
                    <View style={styles.categoryTag}>
                      <Text style={styles.categoryTagText}>{item.category}</Text>
                    </View>
                    <Text style={styles.cardIndexText}>#{index + 1}</Text>
                  </View>

                  <Text style={styles.cardItemQuestion} numberOfLines={2}>
                    {item.question}
                  </Text>
                  <Text style={styles.cardItemAnswer} numberOfLines={2}>
                    {item.answer}
                  </Text>
                </TouchableOpacity>

                {/* Actions */}
                <View style={styles.cardItemActions}>
                  <TouchableOpacity
                    style={styles.itemActionBtn}
                    onPress={() => {
                      onEditCard(item);
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Edit3 size={16} color={THEME.colors.textSecondary} />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.itemActionBtn}
                    onPress={() => {
                      onDeleteCard(item);
                    }}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Trash2 size={16} color={THEME.colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <BookOpen size={36} color={THEME.colors.textMuted} />
                <Text style={styles.emptyTitle}>No flashcards found</Text>
                <Text style={styles.emptySubtitle}>
                  Try clearing your search query or create a new card.
                </Text>
              </View>
            }
          />

          {/* Footer with Reset Defaults */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={onResetDefaults}
              activeOpacity={0.7}
            >
              <RotateCcw size={14} color={THEME.colors.textSecondary} />
              <Text style={styles.resetBtnText}>Restore Sample Deck</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.doneBtnText}>Close</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: THEME.spacing.lg,
  },
  content: {
    width: '100%',
    maxWidth: 640,
    height: '85%',
    backgroundColor: THEME.colors.surface,
    borderRadius: THEME.radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.border,
    ...THEME.shadows.card,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: THEME.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: THEME.colors.surfaceSubtle,
  },
  title: {
    fontSize: THEME.typography.sizes.xl,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  subtitle: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: THEME.spacing.xl,
    paddingTop: THEME.spacing.md,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: THEME.colors.border,
    borderRadius: THEME.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: THEME.colors.background,
  },
  searchInput: {
    flex: 1,
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textPrimary,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.md,
    ...THEME.shadows.button,
  },
  addNewBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textInverse,
  },
  categoryBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: THEME.spacing.xl,
    paddingVertical: 10,
  },
  categoryChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  categoryChipActive: {
    backgroundColor: THEME.colors.primaryLight,
  },
  categoryChipText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
  },
  categoryChipTextActive: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  listContent: {
    paddingHorizontal: THEME.spacing.xl,
    paddingBottom: 20,
    gap: 10,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: THEME.colors.background,
    borderRadius: THEME.radius.lg,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  cardMainInfo: {
    flex: 1,
    gap: 4,
  },
  cardItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 10,
  },
  categoryTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textSecondary,
  },
  cardIndexText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textMuted,
  },
  cardItemQuestion: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textPrimary,
  },
  cardItemAnswer: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
  },
  cardItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 10,
  },
  itemActionBtn: {
    padding: 8,
    borderRadius: THEME.radius.sm,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    gap: 10,
  },
  emptyTitle: {
    fontSize: THEME.typography.sizes.md,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textSecondary,
  },
  emptySubtitle: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: THEME.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: THEME.colors.surfaceSubtle,
    backgroundColor: THEME.colors.surface,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  resetBtnText: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
  },
  doneBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  doneBtnText: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textPrimary,
    fontWeight: THEME.typography.weights.semibold,
  },
});
