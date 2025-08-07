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
    
    // This regex matches import/require statements with relative paths
    const importRegex = /(?:import|require)\(?:(['"])([^'"\s]+)\1\)?/g;
    
    const updatedContent = content.replace(importRegex, (match, quote, importPath) => {
      // Skip if it's not a relative path or already has an extension
      if (!importPath.startsWith('.') || 
          importPath.endsWith('.js') || 
          importPath.endsWith('.ts') || 
          importPath.endsWith('.tsx') ||
          importPath.endsWith('.css') ||
          importPath.endsWith('.scss') ||
          importPath.endsWith('.json')) {
        return match;
      }
      
      // Check if the file exists with .js extension
      const dir = path.dirname(filePath);
      const fullPath = path.resolve(dir, importPath);
      
      if (fs.existsSync(fullPath + '.js') || 
          fs.existsSync(path.join(fullPath, 'index.js'))) {
        updated = true;
        return match.replace(importPath, importPath + '.js');
      }
      
      return match;
    });
    
    if (updated) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
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

// Start processing from the src directory
const srcDir = path.join(__dirname, '../src');
walkDir(srcDir);

console.log('Import updates complete!');
