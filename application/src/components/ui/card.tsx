import React from 'react';
import { View, Text, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "", ...props }: CardProps) => (
  <View 
    className={`bg-background-card p-6 rounded-[32px] border border-white/5 ${className}`}
    {...props}
  >
    {children}
  </View>
);

export const CardTitle = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <Text className={`text-white text-xl font-bold mb-4 ${className}`}>{children}</Text>
);
