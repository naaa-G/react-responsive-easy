/**
 * Storybook Manager for React Responsive Easy Addon
 * 
 * This file registers the addon panel and toolbar with Storybook.
 */

import React from 'react';
import { addons, types } from '@storybook/addons';
import { ADDON_ID, PANEL_ID, TOOLBAR_ID } from './constants';
import { ResponsivePanel } from './components/ResponsivePanel';
import { BreakpointToolbar } from './components/BreakpointToolbar';

// Register the addon
addons.register(ADDON_ID, (api) => {
  // Register the panel
  addons.add(PANEL_ID, {
    type: types.PANEL,
    title: 'Responsive',
    match: ({ viewMode }) => viewMode === 'story',
    render: ({ active, key }) => (
      <ResponsivePanel active={active || false} api={api} key={String(key || 'responsive-panel')} />
    ),
    paramKey: 'responsiveEasy'
  });

  // Register the toolbar
  addons.add(TOOLBAR_ID, {
    type: types.TOOL,
    title: 'Breakpoint Selector',
    match: ({ viewMode }) => viewMode === 'story',
    render: () => <BreakpointToolbar api={api} />
  });
});
