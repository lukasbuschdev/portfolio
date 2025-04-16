import { inject, Injectable } from '@angular/core';
import { typeCommand, typeCommandList, typeDirectory } from '../types/types';
import { ScrollService } from './scroll.service';

@Injectable({
  providedIn: 'root'
})
export class LocalRequestsService {
  scroll = inject(ScrollService);

  clear(executedCommands: typeCommand[]): void {
    executedCommands.length = 0;
  }

  whoami(command: string, executedCommands: typeCommand[], currentPathString: string): void {
    executedCommands.push({ command, output: 'root', path: currentPathString });
  }

  help(command: string, executedCommands: typeCommand[], currentPathString: string, availableCommands: typeCommandList[]): void {
    const output = 'Available command: ' + availableCommands.join(' ');
    executedCommands.push({ command, output, path: currentPathString });
  }

  cd(command: string, executedCommands: typeCommand[], currentPathString: string, currentDirectory: typeDirectory, currentDirectoryPath: typeDirectory[]): void {
    const tokens = command.trim().split(' ');
    const snapshotPath = currentPathString;
    const snapshot = JSON.parse(JSON.stringify(currentDirectory));

    if(tokens.length < 2) {
      executedCommands.push({ command: command, output: 'No such file or directory', path: snapshotPath, snapshot: snapshot });
      return;
    }

    const targetDirectory = tokens[1];

    if(targetDirectory === '..') {
      if(currentDirectoryPath.length > 1) {
        currentDirectoryPath.pop();
        executedCommands.push({ command, path: snapshotPath, snapshot: snapshot });
        return;
      } else {
        executedCommands.push({ command, output: 'Already in root directory', path: snapshotPath, snapshot: snapshot });
        return;
      }
    } 
    
    if(currentDirectory.subdirectories && currentDirectory.subdirectories.length) {
      const found = currentDirectory.subdirectories.find(dir => dir.directory.toLowerCase() === targetDirectory);
     
      if(found) {
        currentDirectoryPath.push(found);
        executedCommands.push({ command, path: snapshotPath, snapshot: snapshot });
      } else {
        executedCommands.push({ command: command, output: 'No such file or directory', path: snapshotPath, snapshot: snapshot });
      }
    }
  }
  
  ls(command: string, executedCommands: typeCommand[], currentPathString: string, currentDirectory: typeDirectory): void {
    const snapshot = JSON.parse(JSON.stringify(currentDirectory));
    executedCommands.push({ command, path: currentPathString, snapshot: snapshot })
  }

  exit(): void {
    this.scroll.goToSection('main', 'landing-page');
  }
  
  history(command: string, executedCommands: typeCommand[], currentPathString: string): void {
    const commandHistory = this.getCommandHistory(executedCommands);
    executedCommands.push({ command, output: commandHistory, path: currentPathString })
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
