import React from 'react';
import { Modal, ModalProps, View, StyleSheet, Platform } from 'react-native';

interface AppModalProps extends ModalProps {
  visible: boolean;
  children: React.ReactNode;
  onClose?: () => void;
}

export const AppModal: React.FC<AppModalProps> = ({
  visible,
  children,
  transparent = true,
  animationType = 'slide',
  onRequestClose,
  ...props
}) => {
  if (!visible) return null;

  // On Web: Render strictly inside the phone viewport container with position: absolute
  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.webAbsoluteOverlay,
          transparent ? styles.webTransparent : styles.webOpaque,
        ]}
      >
        {children}
      </View>
    );
  }

  // On iOS / Android Native: use native Modal
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      animationType={animationType}
      onRequestClose={onRequestClose}
      {...props}
    >
      {children}
    </Modal>
  );
};

const styles = StyleSheet.create({
  webAbsoluteOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  webTransparent: {
    backgroundColor: 'transparent',
  },
  webOpaque: {
    backgroundColor: 'rgba(9, 9, 11, 0.65)',
  },
});
