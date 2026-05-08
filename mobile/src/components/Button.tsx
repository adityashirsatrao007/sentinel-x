import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const variantStyle = {
    primary: { bg: COLORS.PRIMARY, text: '#000000', border: COLORS.PRIMARY },
    secondary: { bg: COLORS.BG_CARD, text: COLORS.TEXT_PRIMARY, border: COLORS.BORDER },
    danger: { bg: COLORS.DANGER, text: '#FFFFFF', border: COLORS.DANGER },
    ghost: { bg: 'transparent', text: COLORS.PRIMARY, border: COLORS.PRIMARY },
  }[variant];

  const sizeStyle = {
    sm: { padding: 8, fontSize: 13 },
    md: { padding: 14, fontSize: 15 },
    lg: { padding: 18, fontSize: 17 },
  }[size];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      style={[
        styles.button,
        {
          backgroundColor: variantStyle.bg,
          borderColor: variantStyle.border,
          paddingVertical: sizeStyle.padding,
          opacity: disabled || isLoading ? 0.6 : 1,
        },
        style,
      ]}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={variantStyle.text} size="small" />
      ) : (
        <Text
          style={[
            styles.text,
            { color: variantStyle.text, fontSize: sizeStyle.fontSize },
            textStyle,
          ]}
        >
          {icon ? `${icon}  ${title}` : title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
