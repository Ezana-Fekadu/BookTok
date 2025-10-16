import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, FlatList } from 'react-native';

const GENRES = ['Fantasy', 'Romance', 'Mystery', 'Sci‑Fi', 'Non‑Fiction', 'Horror', 'Historical', 'YA'];
const MOODS = ['Cozy', 'Fast‑Paced', 'Dark Academia', 'Feel‑Good', 'Twisty', 'Heartwarming'];

type Props = { onComplete?: (prefs: { genres: string[]; moods: string[] }) => void };

export default function OnboardingPreferences({ onComplete }: Props) {
  const [genres, setGenres] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);

  const toggle = (list: string[], setList: (v: string[]) => void, item: string) =>
    setList(list.includes(item) ? list.filter(i => i !== item) : [...list, item]);

  const canContinue = genres.length >= 3;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tailor your feed</Text>
      <Text style={styles.sub}>Pick at least 3 genres you enjoy.</Text>

      <FlatList
        contentContainerStyle={styles.chips}
        data={GENRES}
        keyExtractor={(i) => i}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggle(genres, setGenres, item)}
            style={[styles.chip, genres.includes(item) && styles.chipSelected]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: genres.includes(item) }}
            accessibilityLabel={item}
          >
            <Text style={[styles.chipText, genres.includes(item) && styles.chipTextSel]}>{item}</Text>
          </Pressable>
        )}
      />

      <Text style={[styles.title, { marginTop: 8 }]}>Pick a few moods</Text>
      <FlatList
        contentContainerStyle={styles.chips}
        data={MOODS}
        keyExtractor={(i) => i}
        numColumns={2}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => toggle(moods, setMoods, item)}
            style={[styles.chip, moods.includes(item) && styles.chipSelected]}
            accessibilityRole="checkbox"
            accessibilityState={{ checked: moods.includes(item) }}
            accessibilityLabel={item}
          >
            <Text style={[styles.chipText, moods.includes(item) && styles.chipTextSel]}>{item}</Text>
          </Pressable>
        )}
      />

      <Pressable
        style={[styles.cta, { opacity: canContinue ? 1 : 0.5 }]}
        disabled={!canContinue}
        onPress={() => onComplete?.({ genres, moods })}
        accessibilityRole="button"
        accessibilityLabel="Continue"
      >
        <Text style={styles.ctaText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 18, fontWeight: '700' },
  sub: { color: '#5A5E6B', marginTop: 4 },
  chips: { gap: 8, marginTop: 12 },
  chip: { flex: 1, borderWidth: 1, borderColor: '#E6E7EC', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 12, margin: 4, alignItems: 'center' },
  chipSelected: { backgroundColor: '#F1EEFF', borderColor: '#6D5EF6' },
  chipText: { color: '#121217' },
  chipTextSel: { color: '#6D5EF6', fontWeight: '700' },
  cta: { backgroundColor: '#6D5EF6', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  ctaText: { color: '#fff', fontWeight: '700' },
});
