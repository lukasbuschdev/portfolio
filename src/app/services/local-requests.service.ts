import { ElementRef, inject, Injectable, ViewChild } from '@angular/core';
import { typeCommand, typeCommandList, typeDirectory, typeFile } from '../types/types';
import { ScrollService } from './scroll.service';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class LocalRequestsService {
  isEditing: boolean = false;
  openedFile: typeFile = { name: '', data: '' };

  scroll = inject(ScrollService);
  utils = inject(UtilsService);

  clear(executedCommands: typeCommand[]): void {
    executedCommands.length = 0;
  }

  whoami(command: string, executedCommands: typeCommand[], currentPathString: string): void {
    executedCommands.push({ command, output: 'guest', path: currentPathString });
  }

  uname(command: string, executedCommands: typeCommand[], currentPathString: string): void {
    const nav = window.navigator;
    const conn = (nav as any).connection || {};
    const info = [
      `userAgent:          ${nav.userAgent}`,
      `vendor:             ${nav.vendor}`,
      `platform:           ${nav.platform}`,
      `appVersion:         ${nav.appVersion}`,
      `language:           ${nav.language}`,
      `languages:          ${(nav.languages || []).join(', ')}`,
      `online:             ${nav.onLine}`,
      `cookiesEnabled:     ${nav.cookieEnabled}`,
      `cores:              ${nav.hardwareConcurrency}`,
      `deviceMemory:       ${(nav as any).deviceMemory ?? 'n/a'} GB`,
      `connectionType:     ${conn.effectiveType ?? 'n/a'}`,
      `downlink:           ${conn.downlink ?? 'n/a'} Mb/s`,
      `rtt:                ${conn.rtt ?? 'n/a'} ms`,
      `screenResolution:   ${screen.width}x${screen.height}`,
      `viewportSize:       ${window.innerWidth}x${window.innerHeight}`,
      `timezone:           ${Intl.DateTimeFormat().resolvedOptions().timeZone}`,
      `pageUptime:         ${(window.performance.now() / 1000).toFixed(1)} s`
    ];

    executedCommands.push({ command, output: info.join('\n'), path: currentPathString });
  }

  uptime(command: string, executedCommands: typeCommand[], currentPathString: string): void {
    const output = this.utils.getUptime();
    executedCommands.push({ command, output, path: currentPathString });
  }

  date(command: string, executedCommands: typeCommand[], currentPathString: string): void {
    const output = this.utils.getFormattedDate();
    executedCommands.push({ command, output, path: currentPathString });
  }

  echo(command: string, executedCommands: typeCommand[], currentPathString: string): void {
    const printValue = command.trim().split(' ').slice(1).join(' ');
    if(!printValue) return void executedCommands.push({ command, output: '\n', path: currentPathString });
    executedCommands.push({ command, output: printValue, path: currentPathString });
  }

  help(command: string, executedCommands: typeCommand[], currentPathString: string, availableCommands: typeCommandList[]): void {
    executedCommands.push({ command, path: currentPathString });
  }

  cd(command: string, executedCommands: typeCommand[], currentPathString: string, currentDirectory: typeDirectory, currentDirectoryPath: typeDirectory[]): void {
    const tokens = command.trim().split(' ');
    const snapshotPath = currentPathString;
    const snapshot = JSON.parse(JSON.stringify(currentDirectory));

    if(tokens.length < 2) return void executedCommands.push({ command: command, output: 'No such file or directory', path: snapshotPath, snapshot: snapshot });

    const targetDirectory = tokens[1];

    if(targetDirectory === '..') {
      if(currentDirectoryPath.length > 1) {
        currentDirectoryPath.pop();
        return void executedCommands.push({ command, path: snapshotPath, snapshot: snapshot });
      } else return void executedCommands.push({ command, output: 'Already in root directory', path: snapshotPath, snapshot: snapshot });
    } 
    
    if(currentDirectory.subdirectories && currentDirectory.subdirectories.length) {
      const directory = currentDirectory.subdirectories.find(dir => dir.directory === targetDirectory);
      
      if(directory) {
        currentDirectoryPath.push(directory);
        executedCommands.push({ command, path: snapshotPath, snapshot: snapshot });
      } else {
        executedCommands.push({ command: command, output: 'No such directory', path: snapshotPath, snapshot: snapshot });
      }
    } else {
      executedCommands.push({ command: command, output: 'No such directory', path: snapshotPath, snapshot: snapshot });
    }
  }
  
  ls(command: string, executedCommands: typeCommand[], currentPathString: string, currentDirectory: typeDirectory): void {
    const tokens = command.trim().split(' ');
    if(tokens.length > 1) return void executedCommands.push({ command, output: `ls: usage error: extra operand '${ tokens[1] }'\nTry 'help' for more information`, path: currentPathString});

    const snapshot = JSON.parse(JSON.stringify(currentDirectory));
    const files = currentDirectory.files?.map(file => file.name) ?? [];
    const subdirectories = currentDirectory.subdirectories?.map(dir => dir.directory) ?? [];
    const output = [...files, ...subdirectories];
    const outputString = output.length ? output.join('   ') : ''; // three spaces inbetween
    
    executedCommands.push({ command, output: outputString, path: currentPathString, snapshot: snapshot });
  }

  cat(command: string, executedCommands: typeCommand[], currentPathString: string, currentDirectory: typeDirectory, scrollDown: () => void, focusPreElement: () => void): void {
    const snapshot = JSON.parse(JSON.stringify(currentDirectory));
    const filesOfDirectory = currentDirectory.files?.filter(dir => dir.name.includes('.txt'));
    const tokens = command.trim().split(' ');
    
    if(!filesOfDirectory) return void executedCommands.push({ command, output: 'No such file in directory', path: currentPathString, snapshot: snapshot });
    if(tokens.length < 2) return void executedCommands.push({ command, output: 'cat: usage error: File name required', path: currentPathString, snapshot: snapshot });
    
    const fileContent = filesOfDirectory.find(dir => dir.name === tokens[1].toLowerCase());
    if(!fileContent) return void executedCommands.push({ command, output: 'No such file in directory', path: currentPathString, snapshot: snapshot });

    this.openedFile = fileContent;
    this.isEditing = true;
    executedCommands.push({ command, output: fileContent?.data , path: currentPathString, snapshot: snapshot });
    focusPreElement();
    scrollDown();
  }

  touch(command: string, executedCommands: typeCommand[], currentPathString: string, currentDirectory: typeDirectory): void {
    const tokens = command.trim().split(' ');
    const fileNames = tokens.slice(1);

    if(fileNames.length === 0) return void executedCommands.push({ command, output: `touch: missing operand\nTry 'help' for more information.`, path: currentPathString });

    executedCommands.push({ command, output: '', path: currentPathString });
    const commandIndex = executedCommands.length - 1;

    for(const name of fileNames) {
      const exists = currentDirectory.files.some(file => file.name === name);
      const isTextFile = name.endsWith('.txt');

      if(exists) {
        executedCommands[commandIndex].output += `touch: cannot create file '${ name }': File exists\n`;
      } else if(!isTextFile) {
        executedCommands[commandIndex].output += `touch: cannot create file '${ name }': Invalid extension; only .txt files are supported\n`;
      } else {
        currentDirectory.files.push({ name, data: '' });
      }
    }
  }

  saveFile(command: string, executedCommands: typeCommand[], currentPathString: string, currentDirectory: typeDirectory, newData: string, scrollDown: () => void): void {
    const editedFile = currentDirectory.files.find(dir => dir.name === this.openedFile.name);

    if(editedFile) {
      editedFile.data = newData;
    }

    executedCommands.push({ command: `^${command}`, output: '', path: currentPathString });
    scrollDown();
  }

  mkdir(command: string, executedCommands: typeCommand[], currentPathString: string, currentDirectory: typeDirectory): void {
    const tokens = command.trim().split(' ');
    const dirNames = tokens.slice(1);

    if(dirNames.length === 0) return void executedCommands.push({ command, output: `mkdir: missing operand\nTry 'help' for more information.`, path: currentPathString });
    
    executedCommands.push({ command, output: '', path: currentPathString });
    const commandIndex = executedCommands.length - 1;

    for(const name of dirNames) {
      const exists = currentDirectory.subdirectories?.some(dir => dir.directory === name);
  
      if(exists) {
        executedCommands[commandIndex].output += `mkdir: cannot create directory '${ name }': File exists\n`;
      } else if(name.includes('.')) {
        executedCommands[commandIndex].output += `mkdir: cannot create directory '${ name }': Invalid extension\n`;
      } else {
        currentDirectory.subdirectories!.push({ directory: name, subdirectories: [], files: [] });
      }
    }
  }

  rmdir(command: string, executedCommands: typeCommand[], currentPathString: string, currentDirectory: typeDirectory): void {
    const tokens   = command.trim().split(' ');
    const dirNames = tokens.slice(1);
  
    if(dirNames.length === 0) return void executedCommands.push({ command, output: `rmdir: missing operand\nTry 'help' for more information.`, path: currentPathString });
  
    executedCommands.push({ command, output: '', path: currentPathString });
    const cmdIndex = executedCommands.length - 1;

    this.checkSubdirectories(executedCommands, currentDirectory, dirNames, cmdIndex);
  }

  checkSubdirectories(executedCommands: typeCommand[], currentDirectory: typeDirectory, dirNames: string[], cmdIndex: number): void {
    for(const name of dirNames) {
      const index = currentDirectory.subdirectories ? currentDirectory.subdirectories.findIndex(dir => dir.directory === name) : -1;
  
      if(index < 0) {
        executedCommands[cmdIndex].output += `rmdir: failed to remove '${ name }': No such file or directory\n`;
        continue;
      }

      const dir = currentDirectory.subdirectories![index];
      const hasFiles = (dir.files.length ?? 0) > 0;
      const hasSubdirectories = (dir.subdirectories.length ?? 0) > 0;

      if(hasFiles || hasSubdirectories) {
        executedCommands[cmdIndex].output += `rmdir: failed to remove '${ name }': Directory not empty\n`;
      } else {
        currentDirectory.subdirectories!.splice(index, 1);
      }
    }
  }

  pwd(command: string, executedCommands: typeCommand[], currentPathString: string): void {
    executedCommands.push({ command, output: `/root${currentPathString}`, path: currentPathString });
  }

  exit(): void {
    this.scroll.goToSection('main', 'landing-page');
  }
  
  history(command: string, executedCommands: typeCommand[], currentPathString: string): void {
    const commandHistory = this.getCommandHistory(executedCommands);
    executedCommands.push({ command, output: commandHistory, path: currentPathString });
  }

  getCommandHistory(executedCommands: typeCommand[]): string {
    let allCommands = '';
    let count = 0;

    executedCommands.forEach(command => {
      count++;
      allCommands += `${count}\t${command.command}\n`
    });

    return allCommands;
  }
}
