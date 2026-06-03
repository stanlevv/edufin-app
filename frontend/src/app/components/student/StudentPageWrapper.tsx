import React, { ReactNode } from "react";

interface StudentPageWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Consistent wrapper for all student pages
 * - Mobile-first responsive
 * - Consistent padding
 * - Proper spacing from navbar and bottom nav
 */
export function StudentPageWrapper({ children, className = "" }: StudentPageWrapperProps) {
  return (
    <div className={`min-h-screen pb-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Page Header Component
 * Consistent header styling for all pages
 */
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="px-4 md:px-6 py-4 md:py-5 bg-white border-b border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h1>
          {subtitle && <p className="text-sm md:text-base text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0 ml-4">{action}</div>}
      </div>
    </div>
  );
}

/**
 * Content Section with consistent padding
 */
interface ContentSectionProps {
  children: ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function ContentSection({ children, className = "", noPadding = false }: ContentSectionProps) {
  return (
    <div className={`${noPadding ? "" : "px-4 md:px-6 py-4 md:py-5"} ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Component - Consistent card styling
 */
interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export function Card({ children, className = "", onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-sm border border-gray-100 ${
        onClick ? "cursor-pointer active:scale-[0.98] transition-transform" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

/**
 * Stats Grid - Responsive grid for statistics
 */
interface StatsGridProps {
  children: ReactNode;
  columns?: 2 | 3 | 4;
}

export function StatsGrid({ children, columns = 2 }: StatsGridProps) {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-2 md:grid-cols-3",
    4: "grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-3 md:gap-4`}>
      {children}
    </div>
  );
}

/**
 * Stat Card - Individual stat display
 */
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  bgColor?: string;
}

export function StatCard({ label, value, icon, color = "#1677FF", bgColor = "#EEF4FF" }: StatCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-gray-500 mb-1 truncate">{label}</p>
          <p className="text-xl md:text-2xl font-bold truncate" style={{ color }}>
            {value}
          </p>
        </div>
        {icon && (
          <div
            className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 ml-2"
            style={{ background: bgColor }}
          >
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
