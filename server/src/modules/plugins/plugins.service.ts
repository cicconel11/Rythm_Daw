import { Injectable } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const execAsync = promisify(exec);

@Injectable()
export class PluginsService {
  constructor(private config: ConfigService) {}

  private s3 = new S3Client({ region: this.config.get('AWS_REGION') });

  async getLatest(platform = 'mac'): Promise<{ url: string; filename: string }> {
    // TODO: pull from Prisma; hard-code for now
    const _platform = process.platform;
    const Key = 'installers/Rythm-0.9.3.dmg';
    const Bucket = this.config.get('PLUGIN_BUCKET');
    const url = await getSignedUrl(
      this.s3,
      new GetObjectCommand({ Bucket, Key }),
      { expiresIn: 60 },
    );
    return { url, filename: 'Rythm-0.9.3.dmg' };
  }

  async getLatestPlugin() {
    return this.getLatest();
  }

  async scanUserPlugins(userId: string) {
    try {
      const plugins = await this.scanSystemForPlugins();
      const stats = this.calculatePluginStats(plugins);
      
      return {
        plugins,
        stats: {
          plugins: stats,
          recentActivity: [
            {
              id: 'scan-1',
              action: 'Plugin Scan Completed',
              time: 'Just now',
              type: 'system'
            }
          ],
          installedPlugins: plugins
        }
      };
    } catch (error) {
      console.error('Plugin scan failed:', error);
      throw new Error('Failed to scan plugins');
    }
  }

  private async scanSystemForPlugins() {
    const platform = os.platform();
    const plugins: any[] = [];

    if (platform === 'darwin') {
      // macOS plugin scanning
      plugins.push(...await this.scanMacOSPlugins());
    } else if (platform === 'win32') {
      // Windows plugin scanning
      plugins.push(...await this.scanWindowsPlugins());
    } else if (platform === 'linux') {
      // Linux plugin scanning
      plugins.push(...await this.scanLinuxPlugins());
    }

    return plugins;
  }

  private async scanMacOSPlugins() {
    const plugins: any[] = [];
    
    try {
      // Common macOS plugin directories
      const pluginPaths = [
        '/Library/Audio/Plug-Ins/VST',
        '/Library/Audio/Plug-Ins/VST3',
        '/Library/Audio/Plug-Ins/Components',
        '/Library/Audio/Plug-Ins/Standalone',
        path.join(os.homedir(), 'Library/Audio/Plug-Ins/VST'),
        path.join(os.homedir(), 'Library/Audio/Plug-Ins/VST3'),
        path.join(os.homedir(), 'Library/Audio/Plug-Ins/Components'),
        path.join(os.homedir(), 'Library/Audio/Plug-Ins/Standalone'),
      ];

      for (const pluginPath of pluginPaths) {
        if (fs.existsSync(pluginPath)) {
          const files = await this.readDirectoryRecursively(pluginPath);
          for (const file of files) {
            const plugin = this.parseMacOSPlugin(file);
            if (plugin) {
              plugins.push(plugin);
            }
          }
        }
      }

      // Scan for DAWs
      const dawPaths = [
        '/Applications',
        path.join(os.homedir(), 'Applications')
      ];

      for (const dawPath of dawPaths) {
        if (fs.existsSync(dawPath)) {
          const daws = await this.scanForDAWs(dawPath);
          plugins.push(...daws);
        }
      }

    } catch (error) {
      console.error('macOS plugin scan error:', error);
    }

    return plugins;
  }

  private async scanWindowsPlugins() {
    const plugins: any[] = [];
    
    try {
      // Common Windows plugin directories
      const pluginPaths = [
        'C:\\Program Files\\VSTPlugins',
        'C:\\Program Files\\Common Files\\VST3',
        'C:\\Program Files (x86)\\VSTPlugins',
        'C:\\Program Files (x86)\\Common Files\\VST3',
        path.join(os.homedir(), 'AppData\\Local\\Programs\\VSTPlugins'),
      ];

      for (const pluginPath of pluginPaths) {
        if (fs.existsSync(pluginPath)) {
          const files = await this.readDirectoryRecursively(pluginPath);
          for (const file of files) {
            const plugin = this.parseWindowsPlugin(file);
            if (plugin) {
              plugins.push(plugin);
            }
          }
        }
      }

      // Scan for DAWs
      const dawPaths = [
        'C:\\Program Files',
        'C:\\Program Files (x86)'
      ];

      for (const dawPath of dawPaths) {
        if (fs.existsSync(dawPath)) {
          const daws = await this.scanForDAWs(dawPath);
          plugins.push(...daws);
        }
      }

    } catch (error) {
      console.error('Windows plugin scan error:', error);
    }

    return plugins;
  }

  private async scanLinuxPlugins() {
    const plugins: any[] = [];
    
    try {
      // Common Linux plugin directories
      const pluginPaths = [
        '/usr/lib/vst',
        '/usr/local/lib/vst',
        '/opt/vst',
        path.join(os.homedir(), '.vst'),
        path.join(os.homedir(), '.local/lib/vst'),
      ];

      for (const pluginPath of pluginPaths) {
        if (fs.existsSync(pluginPath)) {
          const files = await this.readDirectoryRecursively(pluginPath);
          for (const file of files) {
            const plugin = this.parseLinuxPlugin(file);
            if (plugin) {
              plugins.push(plugin);
            }
          }
        }
      }

    } catch (error) {
      console.error('Linux plugin scan error:', error);
    }

    return plugins;
  }

  private async readDirectoryRecursively(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          const subFiles = await this.readDirectoryRecursively(fullPath);
          files.push(...subFiles);
        } else {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.error(`Error reading directory ${dirPath}:`, error);
    }
    
    return files;
  }

  private parseMacOSPlugin(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, ext);
    
    // Check for common plugin extensions
    if (ext === '.vst' || ext === '.component' || ext === '.app') {
      return {
        id: Date.now() + Math.random(),
        name: fileName,
        type: this.determinePluginType(fileName),
        version: '1.0.0', // Would need to extract from bundle
        status: 'Active',
        usage: `${Math.floor(Math.random() * 100)}%`,
        lastUsed: new Date().toISOString(),
        path: filePath
      };
    }
    
    return null;
  }

  private parseWindowsPlugin(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, ext);
    
    // Check for common plugin extensions
    if (ext === '.dll' || ext === '.exe') {
      return {
        id: Date.now() + Math.random(),
        name: fileName,
        type: this.determinePluginType(fileName),
        version: '1.0.0', // Would need to extract from file
        status: 'Active',
        usage: `${Math.floor(Math.random() * 100)}%`,
        lastUsed: new Date().toISOString(),
        path: filePath
      };
    }
    
    return null;
  }

  private parseLinuxPlugin(filePath: string) {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, ext);
    
    // Check for common plugin extensions
    if (ext === '.so' || ext === '.vst') {
      return {
        id: Date.now() + Math.random(),
        name: fileName,
        type: this.determinePluginType(fileName),
        version: '1.0.0', // Would need to extract from file
        status: 'Active',
        usage: `${Math.floor(Math.random() * 100)}%`,
        lastUsed: new Date().toISOString(),
        path: filePath
      };
    }
    
    return null;
  }

  private async scanForDAWs(directory: string) {
    const daws: any[] = [];
    const dawNames = [
      'Ableton Live',
      'Logic Pro',
      'Pro Tools',
      'FL Studio',
      'Cubase',
      'Reaper',
      'Studio One',
      'Bitwig Studio',
      'GarageBand',
      'Audacity'
    ];

    try {
      const items = fs.readdirSync(directory);
      
      for (const item of items) {
        const itemPath = path.join(directory, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          for (const dawName of dawNames) {
            if (item.toLowerCase().includes(dawName.toLowerCase())) {
              daws.push({
                id: Date.now() + Math.random(),
                name: item,
                type: 'DAW',
                version: '1.0.0',
                status: 'Active',
                usage: `${Math.floor(Math.random() * 100)}%`,
                lastUsed: new Date().toISOString(),
                path: itemPath
              });
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning for DAWs in ${directory}:`, error);
    }

    return daws;
  }

  private determinePluginType(pluginName: string): string {
    const name = pluginName.toLowerCase();
    
    // Synthesizers
    if (name.includes('serum') || name.includes('massive') || name.includes('sylenth') || 
        name.includes('nexus') || name.includes('kontakt') || name.includes('omnisphere')) {
      return 'Synthesizer';
    }
    
    // EQs
    if (name.includes('eq') || name.includes('pro-q') || name.includes('fruity')) {
      return 'EQ';
    }
    
    // Compressors
    if (name.includes('comp') || name.includes('ssl') || name.includes('1176') || 
        name.includes('la-2a') || name.includes('distressor')) {
      return 'Compressor';
    }
    
    // Reverbs
    if (name.includes('verb') || name.includes('reverb') || name.includes('valhalla') || 
        name.includes('convolution')) {
      return 'Reverb';
    }
    
    // Delays
    if (name.includes('delay') || name.includes('echo')) {
      return 'Delay';
    }
    
    // Limiters
    if (name.includes('limiter') || name.includes('maximizer')) {
      return 'Limiter';
    }
    
    // Mastering
    if (name.includes('ozone') || name.includes('mastering') || name.includes('t-racks')) {
      return 'Mastering Suite';
    }
    
    // DAWs
    if (name.includes('ableton') || name.includes('logic') || name.includes('pro tools') || 
        name.includes('fl studio') || name.includes('cubase') || name.includes('reaper')) {
      return 'DAW';
    }
    
    return 'Plugin';
  }

  private calculatePluginStats(plugins: any[]) {
    return {
      total: plugins.length,
      active: plugins.filter(p => p.status === 'Active').length,
      avgUsage: Math.round(plugins.reduce((sum, p) => sum + parseInt(p.usage), 0) / plugins.length) || 0,
      updatesAvailable: Math.floor(Math.random() * 5) // Simulate some updates
    };
  }
} 