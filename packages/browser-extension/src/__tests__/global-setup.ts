/**
 * Global setup for Jest tests
 * 
 * This file runs once before all tests and sets up the global test environment.
 */

export default async function globalSetup() {
  // Set up global test environment
  process.env.NODE_ENV = 'test';
  
  console.log('🔧 Setting up global test environment for React Responsive Easy Browser Extension');
  
  // Additional global setup can be added here
  // For example, setting up test databases, external services, etc.
}

