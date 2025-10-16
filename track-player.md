Here’s a complete, production-ready React Native audio playback integration using react-native-track-player, wired to your existing components (MiniPlayer, TrailerCard). This includes setup, background service, a player provider with hooks, and a small overlay to render the MiniPlayer globally.

Before you start
- Expo support: react-native-track-player requires a custom dev client (not Expo Go).
- You’ll run: expo prebuild and use expo-dev-client to build a local client.

Install and configure
- Install packages:
  - npm i react-native-track-player
  - npx expo install expo-dev-client
- Add the plugin to app.json (or app.config.js):
  - This enables background audio modes and Android foreground service.

app.json
```json
{
  "expo": {
    "name": "BookTok",
    "slug": "booktok",
    "plugins": [
      "react-native-track-player"
    ],
    "ios": {
      "bundleIdentifier": "app.booktok",
      "infoPlist": {
        "UIBackgroundModes": ["audio"]
      }
    },
    "android": {
      "package": "app.booktok",
      "permissions": [
        "FOREGROUND_SERVICE",
        "FOREGROUND_SERVICE_MEDIA_PLAYBACK",
        "WAKE_LOCK"
      ]
    }
  }
}
```

Build a dev client (after prebuild)
- npx expo prebuild
- npx expo run:ios or npx expo run:android (or use EAS build with dev client)

New files to add

frontend/player/setup.ts
```ts
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from 'react-native-track-player';

let isSetup = false;

export async function setupPlayer() {
  if (isSetup) return;

  await TrackPlayer.setupPlayer({});

  await TrackPlayer.updateOptions({
    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
      Capability.Stop,
    ],
    compactCapabilities: [Capability.Play, Capability.Pause, Capability.SkipToNext],
    progressUpdateEventInterval: 0.5,
    alwaysPauseOnInterruption: true,
    notificationCapabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SkipToNext,
      Capability.SkipToPrevious,
      Capability.SeekTo,
      Capability.Stop,
    ],
  });

  // Android-specific behavior when the app is killed
  await TrackPlayer.setAndroidOptions?.({
    appKilledPlaybackBehavior:
      AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    // You can set a notification channel/title here if desired.
  });

  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  isSetup = true;
}
```

frontend/player/service.ts
```ts
// Background service for remote controls, headset buttons, etc.
import TrackPlayer, { Event } from 'react-native-track-player';

export default async function playbackService() {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
  TrackPlayer.addEventListener(Event.RemoteSeek, (e) => TrackPlayer.seekTo(e.position));

  TrackPlayer.addEventListener(Event.PlaybackError, (e) => {
    console.warn('Playback error', e);
  });

  // Optional: ducking/interruptions handling is automatic on most platforms.
}
```

frontend/player/usePlayer.ts
```ts
import { useCallback, useMemo } from 'react';
import TrackPlayer, {
  State,
  useActiveTrack,
  usePlaybackState,
  useProgress,
  Track,
  TrackType,
} from 'react-native-track-player';

export type TrailerTrack = Track & {
  trailerId: string;
  bookId: string;
};

export function usePlayer() {
  const playbackState = usePlaybackState();
  const progress = useProgress(250); // ms
  const active = useActiveTrack();

  const isPlaying = playbackState.state === State.Playing;

  const togglePlayPause = useCallback(async () => {
    if (isPlaying) return TrackPlayer.pause();
    return TrackPlayer.play();
  }, [isPlaying]);

  const playTrailer = useCallback(async (track: TrailerTrack) => {
    const currentId = active?.id as string | undefined;
    if (currentId === track.id) {
      // Toggle current
      if (isPlaying) return TrackPlayer.pause();
      return TrackPlayer.play();
    }
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await TrackPlayer.play();
  }, [active?.id, isPlaying]);

  const addToQueue = useCallback(async (tracks: TrailerTrack[] | TrailerTrack) => {
    const list = Array.isArray(tracks) ? tracks : [tracks];
    await TrackPlayer.add(list);
  }, []);

  const skipNext = useCallback(() => TrackPlayer.skipToNext().catch(() => {}), []);
  const skipPrevious = useCallback(() => TrackPlayer.skipToPrevious().catch(() => {}), []);
  const seekTo = useCallback((seconds: number) => TrackPlayer.seekTo(seconds), []);
  const stop = useCallback(() => TrackPlayer.stop(), []);

  const value = useMemo(() => ({
    isPlaying,
    active,        // { id, title, artist, artwork, duration, url }
    progress,      // { position, duration, buffered }
    togglePlayPause,
    playTrailer,
    addToQueue,
    skipNext,
    skipPrevious,
    seekTo,
    stop,
  }), [isPlaying, active, progress, togglePlayPause, playTrailer, addToQueue, skipNext, skipPrevious, seekTo, stop]);

  return value;
}

// Helper to map your trailer model to a TrackPlayer track
export function mapTrailerToTrack(params: {
  trailerId: string;
  bookId: string;
  url: string;
  title: string;
  author: string;
  artwork?: string | null;
  duration?: number | null; // seconds
}): TrailerTrack {
  return {
    id: params.trailerId,
    url: params.url,
    title: params.title,
    artist: params.author,
    artwork: params.artwork ?? undefined,
    duration: params.duration ?? undefined,
    type: TrackType.HLS, // HLS is common for Mux/CDN streams
    trailerId: params.trailerId,
    bookId: params.bookId,
  };
}
```

frontend/player/PlayerProvider.tsx
```tsx
import React, { PropsWithChildren, useEffect } from 'react';
import TrackPlayer from 'react-native-track-player';
import { setupPlayer } from './setup';

// Must be called once to register background service
function registerServiceOnce() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  TrackPlayer.registerPlaybackService(() => require('./service').default);
}
let registered = false;

export default function PlayerProvider({ children }: PropsWithChildren<{}>) {
  useEffect(() => {
    (async () => {
      if (!registered) {
        registerServiceOnce();
        registered = true;
      }
      await setupPlayer();
    })();
    return () => {
      // Keep the player for app lifetime; don't destroy on unmount of provider.
    };
  }, []);

  return <>{children}</>;
}
```

frontend/player/PlayerOverlay.tsx
```tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import MiniPlayer from '../components/MiniPlayer';
import { usePlayer } from './usePlayer';

export default function PlayerOverlay() {
  const { active, isPlaying, progress, togglePlayPause, skipNext, skipPrevious } = usePlayer();

  if (!active?.id) return null;

  return (
    <View style={styles.wrap} pointerEvents="box-none">
      <MiniPlayer
        title={active.title ?? 'Untitled'}
        subtitle={active.artist ?? undefined}
        progress={progress.duration ? progress.position / progress.duration : 0}
        isPlaying={isPlaying}
        onPlayPause={togglePlayPause}
        onSkipNext={skipNext}
        onSkipPrev={skipPrevious}
        onExpand={() => {
          // TODO: Navigate to a full player screen if desired
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 56, // keep above the bottom nav bar height
  },
});
```

Wire up with your app root

frontend/App.tsx (example usage)
```tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainTabs from './MainTabs'; // your existing tab navigator
import PlayerProvider from './player/PlayerProvider';
import PlayerOverlay from './player/PlayerOverlay';

export default function App() {
  return (
    <PlayerProvider>
      <NavigationContainer>
        <MainTabs />
        <PlayerOverlay />
      </NavigationContainer>
    </PlayerProvider>
  );
}
```

Hook TrailerCard to player actions
- Use the mapping helper to convert your data into TrackPlayer tracks and trigger play/pause.

Example feed integration
```tsx
import React from 'react';
import { FlatList, View } from 'react-native';
import TrailerCard from '../components/TrailerCard';
import { usePlayer, mapTrailerToTrack } from '../player/usePlayer';

const MOCK = [
  {
    trailerId: 'trl_1',
    bookId: 'bk_1',
    url: 'https://cdn.example.com/hls/trailer1.m3u8',
    title: 'The Night Library',
    author: 'A. Writer',
    artwork: 'https://cdn.example.com/covers/1.jpg',
    duration: 75,
  },
  // more items...
];

export default function FeedScreen() {
  const { active, isPlaying, playTrailer } = usePlayer();

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <FlatList
        data={MOCK}
        keyExtractor={(i) => i.trailerId}
        renderItem={({ item }) => {
          const isThisPlaying = active?.id === item.trailerId && isPlaying;
          return (
            <TrailerCard
              coverUrl={item.artwork}
              title={item.title}
              author={item.author}
              tags={['Cozy', 'Mystery']}
              isPlaying={isThisPlaying}
              onPlayPause={() => playTrailer(mapTrailerToTrack(item))}
              onSave={() => {
                // TODO: Save to list
              }}
              onOpen={() => {
                // TODO: Navigate to Book Detail
              }}
            />
          );
        }}
      />
    </View>
  );
}
```

Troubleshooting and best practices
- Expo Go: Not supported. Use expo-dev-client or EAS to run on device/simulator.
- Background playback stops on Android when app is killed:
  - We configured StopPlaybackAndRemoveNotification; if you prefer continue, switch to ContinuePlaybackWithPausedNotification—but be mindful of UX and battery.
- HLS streams:
  - Mux HLS URLs work out of the box (ensure CORS/CDN headers). Provide https URLs.
- Performance:
  - Keep the track metadata small; artwork should be a CDN URL or local file.
- Analytics:
  - Emit listen_start when you call play(), and listen_complete when reaching 90% or on PlaybackQueueEnded event (you can listen via addEventListener(Event.PlaybackQueueEnded, ...)).
- Permissions:
  - No mic permission needed for playback; only for recording flows.

Want me to add a FullPlayer screen (with waveform seek + 15s jump) and analytics hooks wired to the taxonomy doc, or wire your RecorderSheet to expo-av for recording?
