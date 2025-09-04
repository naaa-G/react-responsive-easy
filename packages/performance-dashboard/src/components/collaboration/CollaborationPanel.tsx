import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  useRealTimeCollaboration, 
  useCollaborativeCursors, 
  useCollaborativeSelections,
  CollaborationConfig,
  CollaborationUser 
} from '../../hooks/useRealTimeCollaboration';
import './CollaborationPanel.css';

export interface CollaborationPanelProps {
  config: CollaborationConfig;
  containerRef: React.RefObject<HTMLElement>;
  onUserJoin?: (user: CollaborationUser) => void;
  onUserLeave?: (user: CollaborationUser) => void;
  onDataUpdate?: (data: any, userId: string) => void;
  className?: string;
  style?: React.CSSProperties;
  showUserList?: boolean;
  showCursorSharing?: boolean;
  showSelectionSharing?: boolean;
  showConnectionStatus?: boolean;
  showActivityFeed?: boolean;
  maxVisibleUsers?: number;
  maxActivityItems?: number;
}

/**
 * Enterprise-grade real-time collaboration panel
 * Provides user presence, cursor sharing, and data synchronization
 */
export const CollaborationPanel: React.FC<CollaborationPanelProps> = ({
  config,
  containerRef,
  onUserJoin,
  onUserLeave,
  onDataUpdate,
  className = '',
  style,
  showUserList = true,
  showCursorSharing = true,
  showSelectionSharing = true,
  showConnectionStatus = true,
  showActivityFeed = true,
  maxVisibleUsers = 10,
  maxActivityItems = 50
}) => {
  const [collaborationState, collaborationActions] = useRealTimeCollaboration(config);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const activityFeedRef = useRef<HTMLDivElement>(null);

  // Collaborative cursors and selections
  const { cursors, getVisibleCursors } = useCollaborativeCursors(
    containerRef,
    collaborationState.users
  );

  const { selections, getVisibleSelections } = useCollaborativeSelections(
    containerRef,
    collaborationState.users
  );

  // Handle user events
  useEffect(() => {
    const handleUserJoin = (event: any) => {
      const user = collaborationState.users.get(event.userId);
      if (user) {
        onUserJoin?.(user);
      }
    };

    const handleUserLeave = (event: any) => {
      const user = collaborationState.users.get(event.userId);
      if (user) {
        onUserLeave?.(user);
      }
    };

    const handleDataUpdate = (event: any) => {
      onDataUpdate?.(event.data, event.userId);
    };

    // Add event listeners
    if (collaborationState.currentUser) {
      // Listen for collaboration events
      // In a real implementation, these would be WebSocket events
    }

    return () => {
      // Cleanup event listeners
    };
  }, [collaborationState.users, collaborationState.currentUser, onUserJoin, onUserLeave, onDataUpdate]);

  // Auto-scroll activity feed
  useEffect(() => {
    if (activityFeedRef.current) {
      activityFeedRef.current.scrollTop = activityFeedRef.current.scrollHeight;
    }
  }, [collaborationState.events]);

  // Handle cursor movement
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (showCursorSharing && collaborationState.isConnected) {
      collaborationActions.updateCursor({
        x: event.clientX,
        y: event.clientY,
        element: (event.target as HTMLElement)?.tagName
      });
    }
  }, [showCursorSharing, collaborationState.isConnected, collaborationActions]);

  // Handle selection changes
  const handleSelectionChange = useCallback(() => {
    if (showSelectionSharing && collaborationState.isConnected) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        collaborationActions.updateSelection({
          start: range.startOffset,
          end: range.endOffset,
          element: range.startContainer.parentElement?.tagName
        });
      }
    }
  }, [showSelectionSharing, collaborationState.isConnected, collaborationActions]);

  // Attach event listeners
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('selectionchange', handleSelectionChange);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [containerRef, handleMouseMove, handleSelectionChange]);

  // Filter activity events
  const filteredEvents = collaborationState.events.filter(event => {
    if (activityFilter === 'all') return true;
    return event.type === activityFilter;
  }).slice(-maxActivityItems);

  // Get connection status color
  const getConnectionStatusColor = () => {
    switch (collaborationState.connectionQuality) {
      case 'excellent': return '#28a745';
      case 'good': return '#ffc107';
      case 'poor': return '#fd7e14';
      case 'disconnected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  // Get user status color
  const getUserStatusColor = (status: CollaborationUser['status']) => {
    switch (status) {
      case 'online': return '#28a745';
      case 'away': return '#ffc107';
      case 'offline': return '#6c757d';
      default: return '#6c757d';
    }
  };

  // Render user avatar
  const renderUserAvatar = (user: CollaborationUser, size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClasses = {
      small: 'avatar-small',
      medium: 'avatar-medium',
      large: 'avatar-large'
    };

    return (
      <div className={`user-avatar ${sizeClasses[size]}`}>
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} />
        ) : (
          <div className="avatar-initials">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div 
          className="status-indicator" 
          style={{ backgroundColor: getUserStatusColor(user.status) }}
        />
      </div>
    );
  };

  // Render collaborative cursors
  const renderCollaborativeCursors = () => {
    if (!showCursorSharing) return null;

    const visibleCursors = getVisibleCursors();
    
    return (
      <div className="collaborative-cursors">
        {visibleCursors.map(({ x, y, user }) => (
          <div
            key={user.id}
            className="collaborative-cursor"
            style={{
              left: x,
              top: y,
              '--user-color': `hsl(${user.id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)`
            } as React.CSSProperties}
          >
            <div className="cursor-pointer" />
            <div className="cursor-label">
              {user.name}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Render collaborative selections
  const renderCollaborativeSelections = () => {
    if (!showSelectionSharing) return null;

    const visibleSelections = getVisibleSelections();
    
    return (
      <div className="collaborative-selections">
        {visibleSelections.map(({ start, end, user }) => (
          <div
            key={user.id}
            className="collaborative-selection"
            style={{
              '--user-color': `hsl(${user.id.charCodeAt(0) * 137.5 % 360}, 70%, 50%)`
            } as React.CSSProperties}
          >
            <div className="selection-highlight" />
            <div className="selection-label">
              {user.name}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`collaboration-panel ${className}`} style={style}>
      {/* Collaborative cursors overlay */}
      {renderCollaborativeCursors()}

      {/* Collaborative selections overlay */}
      {renderCollaborativeSelections()}

      {/* Main collaboration panel */}
      <div className={`collaboration-main ${isExpanded ? 'expanded' : 'collapsed'}`}>
        {/* Header */}
        <div className="collaboration-header">
          <div className="collaboration-title">
            <span className="collaboration-icon">👥</span>
            <span className="collaboration-text">
              Collaboration ({collaborationState.users.size})
            </span>
          </div>
          
          {showConnectionStatus && (
            <div className="connection-status">
              <div 
                className="status-dot" 
                style={{ backgroundColor: getConnectionStatusColor() }}
              />
              <span className="status-text">
                {collaborationState.connectionQuality}
              </span>
            </div>
          )}

          <button
            className="expand-button"
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse panel' : 'Expand panel'}
          >
            {isExpanded ? '−' : '+'}
          </button>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="collaboration-content">
            {/* User list */}
            {showUserList && (
              <div className="user-list-section">
                <h4 className="section-title">Active Users</h4>
                <div className="user-list">
                  {Array.from(collaborationState.users.values())
                    .slice(0, maxVisibleUsers)
                    .map(user => (
                      <div
                        key={user.id}
                        className={`user-item ${selectedUser === user.id ? 'selected' : ''}`}
                        onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                      >
                        {renderUserAvatar(user, 'small')}
                        <div className="user-info">
                          <div className="user-name">{user.name}</div>
                          <div className="user-role">{user.role}</div>
                        </div>
                        <div className="user-actions">
                          {user.id !== config.userId && (
                            <button
                              className="action-button"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle user actions (kick, ban, etc.)
                              }}
                              title="User actions"
                            >
                              ⋯
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Activity feed */}
            {showActivityFeed && (
              <div className="activity-feed-section">
                <div className="activity-header">
                  <h4 className="section-title">Activity Feed</h4>
                  <select
                    className="activity-filter"
                    value={activityFilter}
                    onChange={(e) => setActivityFilter(e.target.value)}
                  >
                    <option value="all">All Events</option>
                    <option value="user_join">User Joins</option>
                    <option value="user_leave">User Leaves</option>
                    <option value="data_update">Data Updates</option>
                    <option value="permission_change">Permission Changes</option>
                  </select>
                </div>
                
                <div className="activity-feed" ref={activityFeedRef}>
                  {filteredEvents.map(event => (
                    <div key={event.id} className="activity-item">
                      <div className="activity-time">
                        {event.timestamp.toLocaleTimeString()}
                      </div>
                      <div className="activity-content">
                        <span className="activity-user">
                          {collaborationState.users.get(event.userId)?.name || 'Unknown User'}
                        </span>
                        <span className="activity-action">
                          {event.type.replace('_', ' ')}
                        </span>
                        {event.data && (
                          <span className="activity-data">
                            {JSON.stringify(event.data)}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Connection info */}
            <div className="connection-info">
              <div className="info-item">
                <span className="info-label">Room:</span>
                <span className="info-value">{config.roomId}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Activity:</span>
                <span className="info-value">
                  {collaborationState.lastActivity?.toLocaleTimeString() || 'Never'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">Events:</span>
                <span className="info-value">{collaborationState.events.length}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="collaboration-actions">
              <button
                className="action-button primary"
                onClick={() => collaborationActions.retryConnection()}
                disabled={collaborationState.isConnected}
              >
                {collaborationState.isConnected ? 'Connected' : 'Reconnect'}
              </button>
              
              <button
                className="action-button secondary"
                onClick={() => {
                  const stats = collaborationActions.getConnectionStats();
                  console.log('Connection stats:', stats);
                }}
              >
                Stats
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborationPanel;
