/**
 * Breakpoint Toolbar Component for Storybook Addon
 * 
 * This component provides a toolbar for quickly switching between breakpoints.
 */

import React, { useState, useEffect } from 'react';
import { IconButton, WithTooltip, TooltipLinkList } from '@storybook/components';
import { EVENTS, DEFAULT_BREAKPOINTS } from '../constants';
import type { ToolbarProps, BreakpointConfig } from '../types';

export const BreakpointToolbar: React.FC<ToolbarProps> = ({ api }) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<BreakpointConfig | null>(null);
  const [availableBreakpoints, setAvailableBreakpoints] = useState<BreakpointConfig[]>(() => [...DEFAULT_BREAKPOINTS]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Load breakpoints from story parameters
  useEffect(() => {
    const updateBreakpoints = () => {
      const storyData = api.getCurrentStoryData();
      const parameters = storyData?.parameters?.responsiveEasy;
      
      if (parameters?.breakpoints) {
        setAvailableBreakpoints([...parameters.breakpoints]);
        setCurrentBreakpoint(parameters.breakpoints[0]);
      } else {
        setAvailableBreakpoints([...DEFAULT_BREAKPOINTS]);
        setCurrentBreakpoint(DEFAULT_BREAKPOINTS[0]);
      }
    };

    api.on('storyChanged', updateBreakpoints);
    updateBreakpoints();

    return () => {
      api.off('storyChanged', updateBreakpoints);
    };
  }, [api]);

  // Listen for breakpoint changes from panel
  useEffect(() => {
    const handleBreakpointChange = ({ breakpoint }: { breakpoint: BreakpointConfig }) => {
      setCurrentBreakpoint(breakpoint);
      
      // Update Storybook viewport
      api.setQueryParams({
        viewMode: 'story',
        viewport: `${breakpoint.width}x${breakpoint.height}`
      });
    };

    api.on(EVENTS.BREAKPOINT_CHANGED, handleBreakpointChange);
    
    return () => {
      api.off(EVENTS.BREAKPOINT_CHANGED, handleBreakpointChange);
    };
  }, [api]);

  const handleBreakpointSelect = (breakpoint: BreakpointConfig) => {
    setCurrentBreakpoint(breakpoint);
    setIsExpanded(false);
    
    // Emit breakpoint change event
    api.emit(EVENTS.BREAKPOINT_CHANGED, { breakpoint });
    
    // Update viewport in Storybook
    api.setQueryParams({
      viewMode: 'story',
      viewport: `${breakpoint.width}x${breakpoint.height}`
    });
  };

  const breakpointOptions = availableBreakpoints.map((breakpoint) => ({
    id: breakpoint.alias,
    title: breakpoint.name,
    value: breakpoint,
    right: `${breakpoint.width}×${breakpoint.height}`,
    active: currentBreakpoint?.alias === breakpoint.alias,
    onClick: () => handleBreakpointSelect(breakpoint)
  }));

  const currentIcon = getBreakpointIcon(currentBreakpoint);
  const currentLabel = currentBreakpoint ? 
    `${currentBreakpoint.name} (${currentBreakpoint.width}×${currentBreakpoint.height})` : 
    'Select Breakpoint';

  return (
    <WithTooltip
      placement="top"
      trigger="click"
      tooltipShown={isExpanded}
      onVisibilityChange={setIsExpanded}
      tooltip={<TooltipLinkList links={breakpointOptions} />}
    >
      <IconButton
        key="responsive-breakpoint-selector"
        title={currentLabel}
        active={isExpanded}
        placeholder=""
        onPointerEnterCapture={() => {}}
        onPointerLeaveCapture={() => {}}
      >
        <span style={{ fontSize: '14px' }}>
          {currentIcon}
        </span>
        <span style={{ 
          marginLeft: '4px', 
          fontSize: '11px',
          maxWidth: '80px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {currentBreakpoint?.name || 'Responsive'}
        </span>
      </IconButton>
    </WithTooltip>
  );
};

function getBreakpointIcon(breakpoint: BreakpointConfig | null): string {
  if (!breakpoint) return '📱';
  
  if (breakpoint.width <= 480) return '📱'; // Mobile
  if (breakpoint.width <= 768) return '📱'; // Mobile
  if (breakpoint.width <= 1024) return '💻'; // Tablet
  if (breakpoint.width <= 1440) return '🖥️'; // Laptop
  return '🖥️'; // Desktop
}
