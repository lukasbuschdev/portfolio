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
      const directory = currentDirectory.subdirectories.find(dir => dir.directory?.toLowerCase() === targetDirectory);
      
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
    const snapshot = JSON.parse(JSON.stringify(currentDirectory));
    const files = currentDirectory.files?.map(file => file.name) ?? [];
    const subdirectories = currentDirectory.subdirectories?.map(dir => dir.directory) ?? [];
    const output = [...files, ...subdirectories];
    const outputString = output.length ? output.join('   ') : ''; // three spaces inbetween
    
    executedCommands.push({ command, output: outputString, path: currentPathString, snapshot: snapshot });
  }

  cat(command: string, executedCommands: typeCommand[], currentPathString: string, currentDirectory: typeDirectory): void {
    const snapshot = JSON.parse(JSON.stringify(currentDirectory));
    const filesOfDirectory = currentDirectory.files?.filter(dir => dir.name.includes('.txt'));
    const tokens = command.trim().split(' ');
    
    if(!filesOfDirectory) return void executedCommands.push({ command, output: 'No such file in directory', path: currentPathString, snapshot: snapshot });
    if(tokens.length < 2) return void executedCommands.push({ command, output: 'cat: usage error: File name required', path: currentPathString, snapshot: snapshot });
    
    const fileContent = filesOfDirectory.find(dir => dir.name === tokens[1].toLowerCase());
    if(!fileContent) return void executedCommands.push({ command, output: 'No such file in directory', path: currentPathString, snapshot: snapshot });

    executedCommands.push({ command, output: fileContent?.data , path: currentPathString, snapshot: snapshot });
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
