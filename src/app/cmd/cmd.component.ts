import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { typeCommand, typeCommandList, typeDirectory } from '../types/types';
import { ScrollService } from '../services/scroll.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AVAIABLE_COMMANDS } from '../data/available-commands';
import { COMMAND_CONFIG } from '../data/command-map';
import { AVAILABLE_DIRECTORIES } from '../data/avaiable-directories';

@Component({
  selector: 'app-cmd',
  imports: [FormsModule],
  templateUrl: './cmd.component.html',
  styleUrl: './cmd.component.scss'
})
export class CmdComponent {
  command: string = '';

  isCommandSent: boolean = false;

  executedCommands: typeCommand[] = [];

  availableCommands: typeCommandList[] = AVAIABLE_COMMANDS;
  avaiableDirectories: typeDirectory[] = AVAILABLE_DIRECTORIES;

  currentDirectoryPath: typeDirectory[] = [this.avaiableDirectories[0]];

  private commandMap: { [key: string]: (cmd: string) => void } = {};

  get currentDirectory(): typeDirectory {
    return this.currentDirectoryPath[this.currentDirectoryPath.length - 1];
  }

  get currentPathString(): string {
    const path = this.currentDirectoryPath.map(dir => dir.directory).filter(Boolean).join('/');
    return path ? '/' + path : '';
  }

  ngOnInit(): void {
    Object.keys(COMMAND_CONFIG).forEach(cmd => {
      if(typeof (this as any)[COMMAND_CONFIG[cmd]] === 'function') {
        this.commandMap[cmd] = (this as any)[COMMAND_CONFIG[cmd]].bind(this);
      }
    });
  }

  scroll = inject(ScrollService);
  http = inject(HttpClient);


  executeCommand(inputCommand: string): void {
    this.isCommandSent = true;
    this.command = '';

    this.checkInputs(inputCommand);
    this.scrollDown();
  }

  scrollDown(): void {
    setTimeout(() => {
      const inputLineElement = document.getElementById('input-line');
      if(inputLineElement) inputLineElement.scrollIntoView({ behavior: 'smooth' });
    });
  }

  checkInputs(command: string): void {
    const tokens = command.trim().split(' ');
    const commandKey = tokens[0].toLowerCase();

    const fn = this.commandMap[commandKey];
    fn ? fn(command) : this.executedCommands.push({ command, output: 'Command not found!', path: this.currentPathString });
  }





  // COMMANDS

  clear(): void {
    this.executedCommands = [];
  }

  whoami(command: string): void {
    this.executedCommands.push({ command, output: 'root' });
  }

  help(command: string): void {
    const output = 'Available command: ' + this.availableCommands.join(' ');
    this.executedCommands.push({ command, output, path: this.currentPathString });
  }

  cd(command: string): void {
    const tokens = command.trim().split(' ');
    const snapshotPath = this.currentPathString;
    const snapshot = JSON.parse(JSON.stringify(this.currentDirectory));

    if(tokens.length < 2) {
      this.executedCommands.push({ command: command, output: 'No such file or directory', path: snapshotPath, snapshot: snapshot });
      return;
    }

    const targetDirectory = tokens[1];

    if(targetDirectory === '..') {
      if(this.currentDirectoryPath.length > 1) {
        this.currentDirectoryPath.pop();
        this.executedCommands.push({ command, path: snapshotPath, snapshot: snapshot });
        return;
      } else {
        this.executedCommands.push({ command, output: 'Already in root directory', path: snapshotPath, snapshot: snapshot });
        return;
      }
    } 
    
    if(this.currentDirectory.subdirectories && this.currentDirectory.subdirectories.length) {
      const found = this.currentDirectory.subdirectories.find(dir => dir.directory.toLowerCase() === targetDirectory);
     
      if(found) {
        this.currentDirectoryPath.push(found);
        this.executedCommands.push({ command, path: snapshotPath, snapshot: snapshot });
      } else {
        this.executedCommands.push({ command: command, output: 'No such file or directory', path: snapshotPath, snapshot: snapshot });
      }
    }
  }
  
  ls(command: string): void {
    const snapshot = JSON.parse(JSON.stringify(this.currentDirectory));
    this.executedCommands.push({ command, path: this.currentPathString, snapshot: snapshot })
  }







  // GET IP

  async ipconfig(command: string): Promise<void>{
    try {
      const ip = await this.getPublicIP();
      this.executedCommands.push({ command, output: ip });
      this.scrollDown();
    } catch (error) {
      console.error('Error fetching IP address: ', error);
      this.executedCommands.push({ command, output: 'Error fetching IP address.' });
      this.scrollDown();
    }
  }

  getPublicIP(): Promise<string> {
    return firstValueFrom(
      this.http.get<{ ip: string }>('https://api.ipify.org?format=json')
    ).then(response => response.ip);
  }
}
