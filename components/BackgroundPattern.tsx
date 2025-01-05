/**
 * @fileOverview Provides a global background pattern component for the application layout
 * 
 * This component creates a full-screen background with a consistent color scheme
 * that supports both light and dark modes. It serves as a root-level wrapper
 * for page content, ensuring a uniform visual foundation across the application.
 * 
 * @module BackgroundPattern
 * @category Components
 * @subcategory Layout
 */

import React from 'react';

/**
 * BackgroundPattern component creates a full-screen background with flexible content placement
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Child components to be rendered within the background
 * 
 * @example
 * // Used in layout.tsx to wrap entire application
 * <BackgroundPattern>
 *   <PageContent />
 * </BackgroundPattern>
 * 
 * @returns {React.ReactElement} A full-screen background div containing child components
 */
export default function BackgroundPattern({children}: {children: React.ReactNode}) {
    return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        {children}
    </div>
    )
}