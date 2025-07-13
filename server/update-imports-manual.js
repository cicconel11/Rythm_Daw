const fs = require('fs');
const path = require('path');

// List of module files to update with their correct import paths
const moduleFiles = [
  { 
    path: 'src/modules/events/events.module.ts',
    oldImport: "from '../../prisma/prisma.module'",
    newImport: "from '../../prisma/prisma.module'"
  },
  { 
    path: 'src/modules/inventory/inventory.module.ts',
    oldImport: "from '../../prisma/prisma.module'",
    newImport: "from '../../prisma/prisma.module'"
  },
  { 
    path: 'src/modules/presence/presence.module.ts',
    oldImport: "from '../../prisma/prisma.module'",
    newImport: "from '../../prisma/prisma.module'"
  },
  { 
    path: 'src/modules/activity-log/activity-log.module.ts',
    oldImport: "from '../../prisma/prisma.module'",
    newImport: "from '../../prisma/prisma.module'"
  },
  { 
    path: 'src/modules/tags/tags.module.ts',
    oldImport: "from '../../prisma/prisma.module'",
    newImport: "from '../../prisma/prisma.module'"
  },
  { 
    path: 'src/modules/qos/qos.module.ts',
    oldImport: "from '../../prisma/prisma.module'",
    newImport: "from '../../prisma/prisma.module'"
  },
  { 
    path: 'src/modules/snapshots/snapshots.module.ts',
    oldImport: "from '../../prisma/prisma.module'",
    newImport: "from '../../prisma/prisma.module'"
  },
  { 
    path: 'src/app.module.ts',
    oldImport: "from './prisma/prisma.module'",
    newImport: "from './prisma/prisma.module'"
  }
];

// Update each file
moduleFiles.forEach(({ path: filePath, oldImport, newImport }) => {
  const fullPath = path.join(__dirname, filePath);
  
  try {
    if (!fs.existsSync(fullPath)) {
      console.log(`File not found: ${filePath}`);
      return;
    }
    
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Log the current content for debugging
    console.log(`\n=== Processing ${filePath} ===`);
    console.log('Current content:');
    console.log(content.split('\n').filter(line => line.includes('PrismaModule')).join('\n') || 'No PrismaModule import found');
    
    // Only update if the old import exists
    if (content.includes(oldImport)) {
      const updatedContent = content.replace(new RegExp(oldImport, 'g'), newImport);
      
      if (content !== updatedContent) {
        fs.writeFileSync(fullPath, updatedContent, 'utf8');
        console.log(`✅ Updated imports in ${filePath}`);
      } else {
        console.log(`ℹ️  No changes needed for ${filePath} (already correct)`);
      }
    } else {
      console.log(`ℹ️  No matching import to update in ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log('\nImport update complete!');
