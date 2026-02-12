// Adding React import to resolve namespace errors for React.ReactNode
import React from 'react';

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  subItems?: SubNavItem[];
}

export interface SubNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
}

export interface MetricCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
  secondaryInfo?: {
    label: string;
    value: string;
  }[];
}