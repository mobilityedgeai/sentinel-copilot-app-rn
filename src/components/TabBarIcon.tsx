import React from 'react';
import { View, StyleSheet } from 'react-native';

interface TabBarIconProps {
  name: string;
  focused: boolean;
  color: string;
  size?: number;
}

export default function TabBarIcon({ name, focused, color, size = 24 }: TabBarIconProps) {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'dashboard':
        return (
          <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View style={[styles.dashboardIcon, { borderColor: color }]}>
              <View style={[styles.dashboardDot, { backgroundColor: color }]} />
              <View style={[styles.dashboardDot, { backgroundColor: color }]} />
              <View style={[styles.dashboardDot, { backgroundColor: color }]} />
              <View style={[styles.dashboardDot, { backgroundColor: color }]} />
            </View>
          </View>
        );
      
      case 'trips':
        return (
          <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View style={[styles.truckIcon, { borderColor: color }]}>
              <View style={[styles.truckCab, { backgroundColor: color }]} />
              <View style={[styles.truckTrailer, { borderColor: color }]} />
              <View style={[styles.truckWheel, { backgroundColor: color }]} />
              <View style={[styles.truckWheel, { backgroundColor: color }]} />
            </View>
          </View>
        );
      
      case 'inspection':
        return (
          <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View style={[styles.clipboardIcon, { borderColor: color }]}>
              <View style={[styles.clipboardClip, { backgroundColor: color }]} />
              <View style={[styles.clipboardLine, { backgroundColor: color }]} />
              <View style={[styles.clipboardLine, { backgroundColor: color }]} />
              <View style={[styles.clipboardLine, { backgroundColor: color }]} />
            </View>
          </View>
        );
      
      case 'copilot':
        return (
          <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View style={[styles.robotIcon, { borderColor: color }]}>
              <View style={[styles.robotHead, { backgroundColor: color }]} />
              <View style={[styles.robotEye, { backgroundColor: focused ? '#ffffff' : color }]} />
              <View style={[styles.robotEye, { backgroundColor: focused ? '#ffffff' : color }]} />
              <View style={[styles.robotMouth, { borderColor: focused ? '#ffffff' : color }]} />
            </View>
          </View>
        );
      
      default:
        return (
          <View style={[styles.iconContainer, { width: size, height: size }]}>
            <View style={[styles.defaultIcon, { backgroundColor: color }]} />
          </View>
        );
    }
  };

  return (
    <View style={[styles.container, focused && styles.focusedContainer]}>
      {getIcon(name)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  focusedContainer: {
    transform: [{ scale: 1.1 }],
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Dashboard Icon
  dashboardIcon: {
    width: 18,
    height: 18,
    borderWidth: 1.5,
    borderRadius: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 2,
    gap: 1,
  },
  dashboardDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  
  // Truck Icon
  truckIcon: {
    width: 20,
    height: 14,
    position: 'relative',
  },
  truckCab: {
    width: 6,
    height: 8,
    borderRadius: 1,
    position: 'absolute',
    left: 0,
    top: 2,
  },
  truckTrailer: {
    width: 12,
    height: 6,
    borderWidth: 1.5,
    borderRadius: 1,
    position: 'absolute',
    right: 0,
    top: 4,
  },
  truckWheel: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    position: 'absolute',
    bottom: 0,
  },
  
  // Clipboard Icon
  clipboardIcon: {
    width: 14,
    height: 18,
    borderWidth: 1.5,
    borderRadius: 2,
    position: 'relative',
    paddingTop: 4,
    paddingHorizontal: 2,
  },
  clipboardClip: {
    width: 6,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
    top: -1,
    left: 4,
  },
  clipboardLine: {
    width: 8,
    height: 1,
    marginBottom: 2,
  },
  
  // Robot Icon
  robotIcon: {
    width: 16,
    height: 18,
    position: 'relative',
  },
  robotHead: {
    width: 12,
    height: 10,
    borderRadius: 6,
    position: 'absolute',
    top: 0,
    left: 2,
  },
  robotEye: {
    width: 2,
    height: 2,
    borderRadius: 1,
    position: 'absolute',
    top: 3,
  },
  robotMouth: {
    width: 4,
    height: 2,
    borderWidth: 1,
    borderRadius: 1,
    position: 'absolute',
    top: 6,
    left: 6,
  },
  
  // Default Icon
  defaultIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
});

// Posicionar os olhos do robô
StyleSheet.create({
  ...styles,
  robotEye: {
    ...styles.robotEye,
    left: 5, // Primeiro olho
  },
});

// Segundo olho do robô (será aplicado via style inline)
export const robotEyeRight = {
  ...styles.robotEye,
  left: 9,
};

