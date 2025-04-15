import { Component, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { typeCommand, typeCommandList, typeDirectory } from '../types/types';
import { ScrollService } from '../services/scroll.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AVAILABLE_COMMANDS } from '../data/available-commands';
import { COMMAND_CONFIG } from '../data/command-map';
import { AVAILABLE_DIRECTORIES } from '../data/available-directories';
import { LsComponent } from './ls/ls.component';
import { HelpComponent } from "./help/help.component";

@Component({
  selector: 'app-cmd',
  imports: [FormsModule, LsComponent, HelpComponent],
  templateUrl: './cmd.component.html',
  styleUrl: './cmd.component.scss'
})
export class CmdComponent {
  command: string = '';

  isCommandSent: boolean = false;

  executedCommands: typeCommand[] = [];
  count: number = 0;

  availableCommands: typeCommandList[] = AVAILABLE_COMMANDS;
  avaiableDirectories: typeDirectory[] = AVAILABLE_DIRECTORIES;

  currentDirectoryPath: typeDirectory[] = [this.avaiableDirectories[0]];
  currentPingInterval: any = null;

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
  ngZone = inject(NgZone);


  executeCommand(inputCommand: string): void {
    this.isCommandSent = true;
    this.command = '';

    this.checkInputs(inputCommand);

    this.count = this.executedCommands.length;
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

  selectCommand(event: KeyboardEvent): void {
    if(event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectCommandUp();
    }
    if(event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectCommandDown();
    }
    if (event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      this.stopPing();
    }
  }

  selectCommandUp(): void {
    if(!this.executedCommands.length) return;
    
    if(this.count > 0) {
      this.count--;
    }

    this.command = this.executedCommands[this.count].command;
  }
  
  selectCommandDown(): void {
    if(!this.executedCommands.length) return;

    if(this.count < this.executedCommands.length - 1) {
      this.count++;
      this.command = this.executedCommands[this.count].command;
    } else {
      this.count = this.executedCommands.length;
      this.command = '';
    }
  }





  // COMMANDS

  clear(): void {
    this.executedCommands = [];
  }

  whoami(command: string): void {
    this.executedCommands.push({ command, output: 'root', path: this.currentPathString });
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
      this.executedCommands.push({ command, output: ip, path: this.currentPathString });
      this.scrollDown();
    } catch (error) {
      console.error('Error fetching IP address: ', error);
      this.executedCommands.push({ command, output: 'Error fetching IP address.', path: this.currentPathString });
      this.scrollDown();
    }
  }

  getPublicIP(): Promise<string> {
    return firstValueFrom(
      this.http.get<{ ip: string }>('https://api.ipify.org?format=json')
    ).then(response => response.ip);
  }



  //CURL

  curl(command: string): void {
    const tokens = command.trim().split(' ');

    if(tokens.length < 2) {
      this.executedCommands.push({ command, output: 'Did you mean: curl <url>?', path: this.currentPathString });
      return;
    }

    const urlTokens = tokens[1];

    this.http.get(urlTokens, { responseType: 'text' }).subscribe(
      response => {
        this.executedCommands.push({ command, output: response, path: this.currentPathString });
      },
      error => {
        this.executedCommands.push({ command, output: `Error: ${error.message}`, path: this.currentPathString });
      }
    );
  }


  // PING

  ping(command: string): void {
    const tokens = command.trim().split(' ');

    if(tokens[1] === undefined) {
      this.executedCommands.push({ command, output: 'ping: usage error: Destination address required', path: this.currentPathString });
      return;
    }

    if(!tokens[1].includes('.')) {
      this.executedCommands.push({ command, output: `ping: ${tokens[1]}: Name or service not known`, path: this.currentPathString });
      return;
    }

    if(this.currentPingInterval) {
      clearInterval(this.currentPingInterval);
      this.currentPingInterval = null;
    }

    const url = tokens[1];
    
    this.executedCommands.push({ command: 'ping', output: `ping ${url}`, path: this.currentPathString });
    const pingIndex = this.executedCommands.length - 1;

    this.currentPingInterval = setInterval(() => {
      const startTime = performance.now();
      console.log('pinging')

      this.ngZone.run(() => {
        this.http.head(url, { observe: 'response' }).subscribe(
          response => {
            const latency = performance.now() - startTime;
            this.executedCommands[pingIndex].output += `\nPING ${url} status: ${response.status} time: ${latency.toFixed(2)}ms`;
          },
          error => {
            const rtt = performance.now() - startTime;
            this.executedCommands[pingIndex].output += `\nPing to ${url} failed (error: ${error.message}). RTT: ${rtt.toFixed(2)} ms`;
          }
        );
      });

      this.scrollDown();
    }, 1000);
  }

  stopPing(): void {
    if(this.currentPingInterval) {
      clearInterval(this.currentPingInterval);
      this.currentPingInterval = null;
      this.executedCommands.push({ command: '^C', path: this.currentPathString });
      this.scrollDown();
    }
  }
}
