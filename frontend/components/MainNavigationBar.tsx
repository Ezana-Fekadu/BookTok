// frontend/components/MainNavigationBar.tsx
// A11y-focused, responsive bottom navigation bar with a prominent Create action.
// Use as the custom tabBar in createBottomTabNavigator.

import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';

type Props = BottomTabBarProps & {
  onCreatePress?: () => void;
  hideLabels?: boolean;
  hidden?: boolean;
};

const BRAND = {
  light: {
    background: '#FFFFFF',
    surface: '#F8F8FA',
    border: '#E6E7EC',
    text: '#121217',
    textMuted: '#6B6E77',
    primary: '#6D5EF6',
    primaryTextOn: '#FFFFFF',
    icon: '#2F3241',
    iconActive: '#6D5EF6',
    shadow: '#000000',
  },
  dark: {
    background: '#0B0B0F',
    surface: '#11121A',
    border: '#1F2030',
    text: '#ECECF2',
    textMuted: '#A5A7B4',
    primary: '#8C86FF',
    primaryTextOn: '#0B0B0F',
    icon: '#C9CBD8',
    iconActive: '#8C86FF',
    shadow: '#000000',
  },
};

const TAB_ICON: Record<
  string,
  { focused: keyof typeof Ionicons.glyphMap; default: keyof typeof Ionicons.glyphMap; label: string }
> = {
  Feed: { focused: 'home', default: 'home-outline', label: 'Home' },
  Search: { focused: 'search', default: 'search-outline', label: 'Search' },
  Create: { focused: 'add', default: 'add', label: 'Create' }, // central action
  Saved: { focused: 'bookmark', default: 'bookmark-outline', label: 'Saved' },
  Profile: { focused: 'person', default: 'person-outline', label: 'Profile' },
};

const MIN_TOUCH = 44;

export default function MainNavigationBar({
  state,
  descriptors,
  navigation,
  onCreatePress,
  hideLabels,
  hidden,
}: Props) {
  const scheme = useColorScheme();
  const theme = scheme === 'dark' ? BRAND.dark : BRAND.light;
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  // Compact layout: hide labels on narrow screens unless explicitly disabled
  const compact = useMemo(() => hideLabels ?? width < 360, [hideLabels, width]);

  const handleCreate = useCallback(async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}
    // Placeholder: open record/upload flow or navigate to Create screen
    if (onCreatePress) {
      onCreatePress();
      return;
    }
    // Fallback: try to navigate to a "Create" route if present
    const route = state.routes.find(r => r.name === 'Create');
    if (route) {
      navigation.navigate(route.name);
    }
  }, [navigation, onCreatePress, state.routes]);

  if (hidden) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          paddingBottom: Math.max(insets.bottom, 8),
          borderTopColor: theme.border,
          shadowColor: theme.shadow,
        },
      ]}
      accessibilityRole="tablist"
      accessibilityLabel="Main navigation"
      testID="main-navigation-bar"
    >
      <View style={styles.inner}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const iconDef = TAB_ICON[route.name] ?? {
            focused: 'ellipse',
            default: 'ellipse-outline',
            label: options.tabBarLabel?.toString() || route.name,
          };

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          // Render a prominent center Create button
          if (route.name === 'Create') {
            return (
              <View key={route.key} style={styles.centerSlot} pointerEvents="box-none">
                <Pressable
                  onPress={handleCreate}
                  onLongPress={onLongPress}
                  accessibilityRole="button"
                  accessibilityLabel="Create a book trailer"
                  accessibilityHint="Opens the recorder to create a new trailer"
                  hitSlop={12}
                  style={({ pressed }) => [
                    styles.createButton,
                    {
                      backgroundColor: theme.primary,
                      transform: [{ translateY: -12 }, { scale: pressed ? 0.98 : 1 }],
                      shadowColor: theme.shadow,
                    },
                  ]}
                  testID="tab-create"
                >
                  <Ionicons name="mic" size={22} color={theme.primaryTextOn} />
                  {!compact && <Text style={[styles.createText, { color: theme.primaryTextOn }]}>Create</Text>}
                </Pressable>
              </View>
            );
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={({ pressed }) => [
                styles.tabItem,
                {
                  minWidth: width / 5 - 4,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={options.tabBarAccessibilityLabel ?? `${iconDef.label} tab`}
              hitSlop={8}
              testID={`tab-${route.name.toLowerCase()}`}
            >
              <Ionicons
                name={isFocused ? iconDef.focused : iconDef.default}
                size={22}
                color={isFocused ? theme.iconActive : theme.icon}
                style={styles.icon}
              />
              {!compact && (
                <Text
                  numberOfLines={1}
                  style={[
                    styles.label,
                    { color: isFocused ? theme.text : theme.textMuted },
                  ]}
                >
                  {iconDef.label}
                </Text>
              )}
              {/* Focus indicator for high contrast and keyboard users on TV/web */}
              <View
                style={[
                  styles.focusBar,
                  { opacity: isFocused ? 1 : 0, backgroundColor: theme.iconActive },
                ]}
              />
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 14,
      },
      default: {},
    }),
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  tabItem: {
    flex: 1,
    minHeight: MIN_TOUCH,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  icon: {
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  focusBar: {
    height: 2,
    width: 16,
    borderRadius: 1,
    marginTop: 4,
  },
  centerSlot: {
    width: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButton: {
    minHeight: MIN_TOUCH + 8,
    minWidth: 72,
    paddingHorizontal: 16,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.18,
        shadowRadius: 12,
      },
      android: {
        elevation: 10,
      },
      default: {},
    }),
  },
  createText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
