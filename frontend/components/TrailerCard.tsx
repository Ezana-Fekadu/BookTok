import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  coverUrl: string;
  title: string;
  author: string;
  tags?: string[];
  isPlaying?: boolean;
  onPlayPause?: () => void;
  onSave?: () => void;
  onOpen?: () => void; // open book detail
};

export default function TrailerCard({
  coverUrl,
  title,
  author,
  tags = [],
  isPlaying = false,
  onPlayPause,
  onSave,
  onOpen,
}: Props) {
  return (
    <Pressable style={styles.card} onPress={onOpen} accessibilityRole="button" accessibilityLabel={`${title} by ${author}`} >
      <Image source={{ uri: coverUrl }} style={styles.cover} accessibilityIgnoresInvertColors />
      <View style={styles.info}>
        <Text numberOfLines={1} style={styles.title}>{title}</Text>
        <Text numberOfLines={1} style={styles.author}>{author}</Text>
        <View style={styles.tags}>
          {tags.slice(0, 3).map((t) => (
            <View key={t} style={styles.tag}><Text style={styles.tagText}>{t}</Text></View>
          ))}
        </View>
      </View>
      <View style={styles.ctaRow}>
        <Pressable onPress={onPlayPause} accessibilityRole="button" accessibilityLabel={isPlaying ? 'Pause trailer' : 'Play trailer'} style={styles.iconBtn}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={18} color="#121217" />
        </Pressable>
        <Pressable onPress={onSave} accessibilityRole="button" accessibilityLabel="Save title" style={styles.iconBtn}>
          <Ionicons name="bookmark-outline" size={18} color="#121217" />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 12, borderRadius: 12, backgroundColor: '#FFF', alignItems: 'center', gap: 12, marginBottom: 12 },
  cover: { width: 56, height: 84, borderRadius: 6, backgroundColor: '#EEE' },
  info: { flex: 1, minWidth: 0 },
  title: { fontSize: 16, fontWeight: '700' },
  author: { fontSize: 13, color: '#5A5E6B', marginTop: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tag: { backgroundColor: '#F1F1F6', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  tagText: { fontSize: 11, color: '#5A5E6B' },
  ctaRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#F1F1F6', alignItems: 'center', justifyContent: 'center' },
});
