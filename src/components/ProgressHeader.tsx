import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  Layers,
  Plus,
  BookOpen,
  Filter,
} from 'lucide-react-native';
import { THEME } from '../theme/flashcardTheme';
import { CardFilter } from '../types/flashcard';

interface ProgressHeaderProps {
  currentIndex: number;
  totalCards: number;
  categories: string[];
  selectedCategory: CardFilter;
  onSelectCategory: (category: CardFilter) => void;
  onOpenAddModal: () => void;
  onOpenManageModal: () => void;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentIndex,
  totalCards,
  categories,
  selectedCategory,
  onSelectCategory,
  onOpenAddModal,
  onOpenManageModal,
}) => {
  const progressPercent = totalCards > 0 ? ((currentIndex + 1) / totalCards) * 100 : 0;

  return (
    <View style={styles.container}>
      {/* Top Navbar Row */}
      <View style={styles.topRow}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <BookOpen size={18} color={THEME.colors.primary} />
          </View>
          <View>
            <Text style={styles.brandTitle}>Flashcard Quiz</Text>
            <Text style={styles.brandSubtitle}>Active Study & Recall</Text>
          </View>
        </View>

        <View style={styles.topActionGroup}>
          <TouchableOpacity
            style={styles.manageBtn}
            onPress={onOpenManageModal}
            activeOpacity={0.7}
          >
            <Layers size={16} color={THEME.colors.textSecondary} />
            <Text style={styles.manageBtnText}>Library</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addBtn}
            onPress={onOpenAddModal}
            activeOpacity={0.8}
          >
            <Plus size={16} color={THEME.colors.textInverse} />
            <Text style={styles.addBtnText}>Add Card</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter Horizontal Scroll */}
      <View style={styles.filterSection}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          <TouchableOpacity
            style={[
              styles.filterChip,
              selectedCategory === 'ALL' && styles.filterChipActive,
            ]}
            onPress={() => onSelectCategory('ALL')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedCategory === 'ALL' && styles.filterChipTextActive,
              ]}
            >
              All Cards ({totalCards})
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                styles.filterChip,
                selectedCategory === cat && styles.filterChipActive,
              ]}
              onPress={() => onSelectCategory(cat)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterChipText,
                  selectedCategory === cat && styles.filterChipTextActive,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Progress Counter & Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressCardCount}>
            {totalCards > 0 ? (
              <>
                Card <Text style={styles.highlightIndex}>{currentIndex + 1}</Text> of{' '}
                {totalCards}
              </>
            ) : (
              'No cards in this deck'
            )}
          </Text>

          {totalCards > 0 && (
            <Text style={styles.progressPercentage}>
              {Math.round(progressPercent)}% Completed
            </Text>
          )}
        </View>

        {/* Progress Track */}
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progressPercent}%` },
            ]}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 580,
    alignSelf: 'center',
    gap: 12,
    marginBottom: THEME.spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: THEME.spacing.xs,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: THEME.typography.sizes.lg,
    fontWeight: THEME.typography.weights.bold,
    color: THEME.colors.textPrimary,
  },
  brandSubtitle: {
    fontSize: THEME.typography.sizes.xs,
    color: THEME.colors.textMuted,
  },
  topActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  manageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  manageBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.md,
    backgroundColor: THEME.colors.primary,
    ...THEME.shadows.button,
  },
  addBtnText: {
    fontSize: THEME.typography.sizes.sm,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textInverse,
  },
  filterSection: {
    paddingVertical: 2,
  },
  filterScroll: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.surface,
    borderWidth: 1,
    borderColor: THEME.colors.border,
  },
  filterChipActive: {
    backgroundColor: THEME.colors.primaryLight,
    borderColor: THEME.colors.primaryBorder,
  },
  filterChipText: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.medium,
    color: THEME.colors.textSecondary,
  },
  filterChipTextActive: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  progressContainer: {
    gap: 6,
    marginTop: 4,
  },
  progressLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  progressCardCount: {
    fontSize: THEME.typography.sizes.sm,
    color: THEME.colors.textSecondary,
    fontWeight: THEME.typography.weights.medium,
  },
  highlightIndex: {
    color: THEME.colors.primary,
    fontWeight: THEME.typography.weights.bold,
  },
  progressPercentage: {
    fontSize: THEME.typography.sizes.xs,
    fontWeight: THEME.typography.weights.semibold,
    color: THEME.colors.textMuted,
  },
  progressBarTrack: {
    height: 6,
    borderRadius: THEME.radius.pill,
    backgroundColor: THEME.colors.surfaceSubtle,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.primary,
    borderRadius: THEME.radius.pill,
  },
});
