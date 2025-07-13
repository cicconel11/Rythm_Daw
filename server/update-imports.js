const fs = require('fs');
const path = require('path');

// List of module files to update
const moduleFiles = [
  'src/modules/events/events.module.ts',
  'src/modules/inventory/inventory.module.ts',
  'src/modules/presence/presence.module.ts',
  'src/modules/activity-log/activity-log.module.ts',
  'src/modules/tags/tags.module.ts',
  'src/modules/qos/qos.module.ts',
  'src/modules/snapshots/snapshots.module.ts'
];

// Update each file
moduleFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf8');
    const updatedContent = content.replace(
      /from ['"]\.\.\/\.\.\/prisma\/prisma\.module['"]/g,
      "from '../../prisma/prisma.module'"
    );
    
    if (content !== updatedContent) {
      fs.writeFileSync(fullPath, updatedContent, 'utf8');
      console.log(`Updated imports in ${filePath}`);
    } else {
      console.log(`No changes needed for ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
});

// Update app.module.ts to use the correct path
const appModulePath = path.join(__dirname, 'src/app.module.ts');
try {
  let content = fs.readFileSync(appModulePath, 'utf8');
  const updatedContent = content.replace(
    /from ['"]\.\/prisma\/prisma\.module['"]/g,
    "from './prisma/prisma.module'"
  );
  
  if (content !== updatedContent) {
    fs.writeFileSync(appModulePath, updatedContent, 'utf8');
    console.log('Updated imports in app.module.ts');
  } else {
    console.log('No changes needed for app.module.ts');
  }
} catch (error) {
  console.error('Error processing app.module.ts:', error.message);
}

console.log('Import update complete!');
