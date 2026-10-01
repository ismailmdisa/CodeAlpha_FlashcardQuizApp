import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { AppModal } from './AppModal';
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
    <AppModal
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
              <Text style={styles.title}>Card Library 📚</Text>
              <Text style={styles.subtitle}>
                {cards.length} cards total • Manage & customize your deck
              </Text>
            </View>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              aria-label="Close modal"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color="#09090b" />
            </TouchableOpacity>
          </View>

          {/* Search Bar & Add Button */}
          <View style={styles.searchRow}>
            <View style={styles.searchContainer}>
              <Search size={16} color={THEME.colors.textMuted} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search flashcards..."
                placeholderTextColor={THEME.colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <X size={16} color="#09090b" />
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
              <Plus size={16} color="#09090b" />
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
                All ({cards.length})
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
                    onPress={() => onEditCard(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Edit3 size={15} color="#09090b" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.itemActionBtn, styles.deleteActionBtn]}
                    onPress={() => onDeleteCard(item)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Trash2 size={15} color={THEME.colors.punchCoral} />
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

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={onResetDefaults}
              activeOpacity={0.8}
            >
              <RotateCcw size={14} color="#09090b" />
              <Text style={styles.resetBtnText}>Restore Defaults</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.doneBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.doneBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(9, 9, 11, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  content: {
    width: '100%',
    height: '92%',
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
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 2,
    borderBottomColor: '#09090b',
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  title: {
    fontSize: 20,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  subtitle: {
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
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: '#09090b',
    borderRadius: THEME.radius.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#09090b',
    fontWeight: THEME.typography.weights.medium,
  },
  addNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: THEME.colors.neonLime,
    borderRadius: THEME.radius.full,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  addNewBtnText: {
    fontSize: 13,
    fontWeight: THEME.typography.weights.extrabold,
    color: '#09090b',
  },
  categoryBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    backgroundColor: THEME.colors.tertiaryFixed,
  },
  categoryChipText: {
    fontSize: 11,
    color: '#09090b',
    fontWeight: THEME.typography.weights.bold,
  },
  categoryChipTextActive: {
    color: '#09090b',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    gap: 10,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#09090b',
    shadowColor: '#09090b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  cardMainInfo: {
    flex: 1,
    gap: 4,
  },
  cardItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  categoryTag: {
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: THEME.radius.full,
    backgroundColor: THEME.colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: '#09090b',
  },
  categoryTagText: {
    fontSize: 10,
    fontWeight: THEME.typography.weights.bold,
    color: '#09090b',
  },
  cardIndexText: {
    fontSize: 11,
    fontWeight: THEME.typography.weights.extrabold,
    color: THEME.colors.textMuted,
  },
  cardItemQuestion: {
    fontSize: 14,
    fontWeight: THEME.typography.weights.bold,
    color: '#09090b',
  },
  cardItemAnswer: {
    fontSize: 12,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
  },
  cardItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 8,
  },
  itemActionBtn: {
    padding: 7,
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  deleteActionBtn: {
    backgroundColor: '#fff1f2',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: THEME.typography.weights.bold,
    color: '#09090b',
  },
  emptySubtitle: {
    fontSize: 12,
    color: THEME.colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderTopWidth: 2,
    borderTopColor: '#09090b',
    backgroundColor: THEME.colors.surfaceSubtle,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.full,
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
    borderColor: '#09090b',
  },
  resetBtnText: {
    fontSize: 12,
    color: '#09090b',
    fontWeight: THEME.typography.weights.bold,
  },
  doneBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: THEME.radius.full,
    backgroundColor: '#09090b',
  },
  doneBtnText: {
    fontSize: 13,
    color: '#ffffff',
    fontWeight: THEME.typography.weights.bold,
  },
});
