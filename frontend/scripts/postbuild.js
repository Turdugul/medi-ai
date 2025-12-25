const fs = require('fs');
const path = require('path');

// Create 'out' directory for Render compatibility
// Note: Next.js builds to .next, but Render requires a publish directory
const outDir = path.join(process.cwd(), 'out');

try {
  // Always ensure the directory exists
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
    console.log('✅ Created out directory for Render compatibility');
  } else {
    console.log('ℹ️  out directory already exists');
  }
  
  // Create a README explaining the situation
  fs.writeFileSync(
    path.join(outDir, 'README.txt'),
    'Next.js builds to .next directory.\n' +
    'This out directory exists for Render compatibility.\n' +
    'The actual build is in .next directory.\n' +
    'Render should be configured as a Web Service (not Static Site)\n' +
    'with Start Command: npm start\n' +
    'and Publish Directory: .next (or leave empty)'
  );
  
  // Create a .gitkeep file to ensure the directory is tracked
  fs.writeFileSync(path.join(outDir, '.gitkeep'), '');
  
  console.log('✅ Post-build script completed successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Error in post-build script:', error);
  // Still exit with 0 to not fail the build, but log the error
  process.exit(0);
}

