import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to process a single file
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;
    
    // Add .js extension to relative imports
    const relativeImportRegex = /from\s+["'](\.\.?\/[^"']+)(?<!\.js)["']/g;
    content = content.replace(relativeImportRegex, (match, p1) => {
      // Skip if it's a CSS/SCSS import or already has an extension
      if (p1.endsWith('.css') || p1.endsWith('.scss') || p1.endsWith('.json')) {
        return match;
      }
      updated = true;
      return `from "${p1}.js"`;
    });
    
    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated imports in ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }
}

// Function to walk through directories
function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
      processFile(filePath);
    }
  });
}

// Start processing from the src/components directory
const componentsDir = path.join(__dirname, '../src/components');
walkDir(componentsDir);

console.log('UI component imports updated!');
