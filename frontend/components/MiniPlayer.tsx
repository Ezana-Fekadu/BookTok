import React, { useMemo } from 'react';
import { View, Text, Pressable, StyleSheet, useColorScheme } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type MiniPlayerProps = {
  title: string;
  subtitle?: string;
  progress?: number; // 0..1
  isPlaying: boolean;
  onPlayPause?: () => void;
  onExpand?: () => void;
  onSkipNext?: () => void;
  onSkipPrev?: () => void;
};

const BRAND = {
  light: { bg: '#1C1D27', text: '#FFFFFF', muted: '#C9CBD8', accent: '#6D5EF6' },
  dark: { bg: '#0E0F16', text: '#FFFFFF', muted: '#A5A7B4', accent: '#8C86FF' },
};

export default function MiniPlayer({
  title,
  subtitle,
  progress = 0,
  isPlaying,
  onPlayPause,
  onExpand,
  onSkipNext,
  onSkipPrev,
}: MiniPlayerProps) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? BRAND.dark : BRAND.light;
  const insets = useSafeAreaInsets();

  const pct = useMemo(() => Math.max(0, Math.min(1, progress)), [progress]);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Mini player"
      accessibilityHint="Tap to expand the player"
      onPress={onExpand}
      style={[styles.container, { backgroundColor: theme.bg, paddingBottom: Math.max(insets.bottom, 8) }]}
    >
      <View style={styles.row}>
        <Pressable
          onPress={async () => {
            try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
            onSkipPrev && onSkipPrev();
          }}
          accessibilityRole="button"
          accessibilityLabel="Previous"
          style={styles.control}
          hitSlop={10}
        >
          <Ionicons name="play-skip-back" size={22} color={theme.muted} />
        </Pressable>

        <Pressable
          onPress={async () => {
            try { await Haptics.selectionAsync(); } catch {}
            onPlayPause && onPlayPause();
          }}
          accessibilityRole="button"
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          style={[styles.playBtn, { backgroundColor: theme.accent }]}
          hitSlop={10}
        >
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#FFFFFF" />
        </Pressable>

        <Pressable
          onPress={async () => {
            try { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); } catch {}
            onSkipNext && onSkipNext();
          }}
          accessibilityRole="button"
          accessibilityLabel="Next"
          style={styles.control}
          hitSlop={10}
        >
          <Ionicons name="play-skip-forward" size={22} color={theme.muted} />
        </Pressable>

        <View style={styles.meta} accessible accessibilityRole="text">
          <Text numberOfLines={1} style={[styles.title, { color: theme.text }]}>{title}</Text>
          {!!subtitle && <Text numberOfLines={1} style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text>}
        </View>

        <Ionicons name="chevron-up" size={20} color={theme.muted} accessibilityElementsHidden importantForAccessibility="no" />
      </View>

      <View style={styles.progressTrack} accessibilityRole="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(pct * 100)}>
        <View style={[styles.progressFill, { width: `${pct * 100}%`, backgroundColor: theme.accent }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 8, gap: 8 },
  control: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  playBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  meta: { flex: 1, marginLeft: 8 },
  title: { fontWeight: '700', fontSize: 14 },
  subtitle: { fontSize: 12, marginTop: 2 },
  progressTrack: { height: 2, width: '100%', backgroundColor: 'rgba(255,255,255,0.15)', marginTop: 8 },
  progressFill: { height: 2, borderRadius: 1 },
});
