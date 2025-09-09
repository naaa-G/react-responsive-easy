/**
 * DevTools integration for React Responsive Easy Browser Extension
 */
class DevToolsIntegration {
  constructor() {
    this.init();
  }

  private init(): void {
    // Create a panel in Chrome DevTools
    chrome.devtools.panels.create(
      'React Responsive Easy',
      'icons/icon-32.png',
      'devtools-panel.html',
      (panel) => {
        console.log('🛠️ React Responsive Easy DevTools panel created');
        
        // Handle panel shown/hidden
        panel.onShown.addListener(() => {
          console.log('DevTools panel shown');
        });
        
        panel.onHidden.addListener(() => {
          console.log('DevTools panel hidden');
        });
      }
    );
  }
}

// Initialize DevTools integration
new DevToolsIntegration();
