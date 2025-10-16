import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  onRecordStart?: () => void;
  onRecordStop?: () => Promise<{ uri: string; durationMs: number } | null>;
  onPublish?: (payload: { audioUri: string; bookId: string; tags: string[] }) => void;
  maxDurationMs?: number; // default 90000
};

export default function RecorderSheet({ onRecordStart, onRecordStop, onPublish, maxDurationMs = 90000 }: Props) {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const start = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    onRecordStart?.();
    setIsRecording(true);
    setDuration(0);
    timerRef.current = setInterval(() => setDuration((d) => d + 100), 100);
    // Integrate with expo-av or native recorder in your app-level hook
  };

  const stop = async () => {
    await Haptics.selectionAsync().catch(() => {});
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRecording(false);
    const res = (await onRecordStop?.()) ?? null;
    if (res) {
      setAudioUri(res.uri);
      setDuration(res.durationMs);
    }
  };

  const overLimit = duration >= maxDurationMs;

  return (
    <View style={styles.sheet} accessibilityRole="dialog" accessibilityLabel="Recorder">
      <Text style={styles.heading}>Create a trailer</Text>
      <Text style={styles.sub}>Aim for 60–90 seconds. Keep it spoiler‑free.</Text>

      <View style={styles.timerWrap}>
        <Text style={[styles.timer, { color: overLimit ? '#E5484D' : '#121217' }]}>
          {(duration / 1000).toFixed(1)}s / {(maxDurationMs / 1000).toFixed(0)}s
        </Text>
      </View>

      <View style={styles.controls}>
        {!isRecording ? (
          <Pressable style={styles.recBtn} onPress={start} accessibilityRole="button" accessibilityLabel="Start recording">
            <Ionicons name="mic" size={22} color="#fff" />
            <Text style={styles.recText}>Record</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.recBtn, { backgroundColor: '#E5484D' }]} onPress={stop} accessibilityRole="button" accessibilityLabel="Stop recording">
            <Ionicons name="square" size={22} color="#fff" />
            <Text style={styles.recText}>Stop</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.publishBtn, { opacity: audioUri && !overLimit ? 1 : 0.5 }]}
          disabled={!audioUri || overLimit}
          onPress={() => audioUri && onPublish?.({ audioUri, bookId: '', tags: [] })}
          accessibilityRole="button"
          accessibilityLabel="Publish trailer"
        >
          <Text style={styles.publishText}>Publish</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: { padding: 16, backgroundColor: '#FFF', borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  heading: { fontSize: 18, fontWeight: '700' },
  sub: { fontSize: 13, color: '#5A5E6B', marginTop: 4 },
  timerWrap: { alignItems: 'center', marginVertical: 12 },
  timer: { fontVariant: ['tabular-nums'], fontSize: 16, fontWeight: '700' },
  controls: { alignItems: 'center', marginVertical: 8 },
  recBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#6D5EF6', borderRadius: 999, paddingHorizontal: 24, paddingVertical: 12 },
  recText: { color: '#fff', fontWeight: '700' },
  footer: { marginTop: 12 },
  publishBtn: { backgroundColor: '#121217', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  publishText: { color: '#fff', fontWeight: '700' },
});
