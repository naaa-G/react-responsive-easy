const { favicons } = require('favicons');
const fs = require('fs');
const path = require('path');

// Path to logo file
const logoPath = path.join(__dirname, '../assets/logo.svg');

const configuration = {
  path: '/public/',
  appName: 'React Responsive Easy',
  appShortName: 'RRE',
  appDescription: 'Enterprise-grade responsive design system for React applications',
  developerName: 'naa-G',
  developerURL: 'https://github.com/naa-G',
  background: '#ffffff',
  theme_color: '#0ea5e9',
  appleStatusBarStyle: 'default',
  display: 'standalone',
  orientation: 'portrait',
  scope: '/',
  start_url: '/',
  version: '1.0.0',
  logging: false,
  pixel_art: false,
  loadManifestWithCredentials: false,
  manifestMaskable: false,
  icons: {
    android: true,
    appleIcon: true,
    appleStartup: false,
    favicons: true,
    windows: false,
    yandex: false
  }
};

async function generateFavicons() {
  try {
    console.log('🎨 Generating favicons...');
    
    const response = await favicons(logoPath, configuration);
    
    // Ensure public directory exists
    const publicDir = path.join(__dirname, '../public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write images
    response.images.forEach((image) => {
      const filePath = path.join(publicDir, image.name);
      fs.writeFileSync(filePath, image.contents);
      console.log(`✅ Created ${image.name}`);
    });
    
    // Write files (like manifest)
    response.files.forEach((file) => {
      const filePath = path.join(publicDir, file.name);
      fs.writeFileSync(filePath, file.contents);
      console.log(`✅ Created ${file.name}`);
    });
    
    // Generate the HTML meta tags
    const metaTags = response.html.join('\n    ');
    console.log('\n📋 Add these meta tags to your layout.tsx:');
    console.log('```html');
    console.log(metaTags);
    console.log('```\n');
    
    console.log('🎉 Favicons generated successfully!');
    
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
  }
}

generateFavicons();
