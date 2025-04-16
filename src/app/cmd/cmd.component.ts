import { Component, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { typeCommand, typeCommandList, typeDirectory } from '../types/types';
import { ScrollService } from '../services/scroll.service';
import { HttpClient } from '@angular/common/http';
import { AVAILABLE_COMMANDS } from '../data/available-commands';
import { COMMAND_CONFIG } from '../data/command-map';
import { AVAILABLE_DIRECTORIES } from '../data/available-directories';
import { LsComponent } from './ls/ls.component';
import { HelpComponent } from "./help/help.component";
import { UtilsService } from '../services/utils.service';
import { HttpRequestsService } from '../services/http-requests.service';
import { LocalRequestsService } from '../services/local-requests.service';

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
  utils = inject(UtilsService);
  httpRequests = inject(HttpRequestsService);
  localRequests = inject(LocalRequestsService);


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
      if(inputLineElement) inputLineElement.scrollIntoView();
    }, 10);
  }

  checkInputs(command: string): void {
    const tokens = command.trim().split(' ');
    const commandKey = tokens[0].toLowerCase();

    const fn = this.commandMap[commandKey];
    fn ? fn(command) : this.executedCommands.push({ command, output: 'Command not found!', path: this.currentPathString });
  }

  selectCommand(event: KeyboardEvent, command: string): void {
    if(event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectCommandUp();
    }
    if(event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectCommandDown();
    }
    if(event.key === 'Enter') {
      event.preventDefault();
      if(this.httpRequests.isFetching) return;
      this.executeCommand(command);
    }
    if(event.ctrlKey && event.key.toLowerCase() === 'c') {
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

  focusInput(event: MouseEvent): void {
    const inputField = document.querySelector('textarea');
    if(inputField) (inputField as HTMLElement).focus({ preventScroll: true });
    if(event.detail === 1) return;
    this.scrollDown();
  }


  // LOCAL REQUESTS

  clear(): void {
    this.localRequests.clear(this.executedCommands);
  }
  
  whoami(command: string): void {
    this.localRequests.whoami(command, this.executedCommands, this.currentPathString);
  }

  help(command: string): void {
    this.localRequests.help(command, this.executedCommands, this.currentPathString, this.availableCommands);
  }

  cd(command: string): void {
    this.localRequests.cd(command, this.executedCommands, this.currentPathString, this.currentDirectory, this.currentDirectoryPath);
  }

  ls(command: string): void {
    this.localRequests.ls(command, this.executedCommands, this.currentPathString, this.currentDirectory);
  }

  exit(): void {
    this.localRequests.exit();
  }
  
  history(command: string): void {
    this.localRequests.history(command, this.executedCommands, this.currentPathString);
  }


  // HTTP REQUESTS

  async ipaddr(command: string): Promise<void> {
    return this.httpRequests.ipaddr(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }

  curl(command: string): void {
    this.httpRequests.curl(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }

  ping(command: string): void {
    this.httpRequests.ping(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
    this.scrollDown();
  }

  stopPing(): void {
    if(this.httpRequests.currentPingInterval) {
      clearInterval(this.httpRequests.currentPingInterval);
      this.httpRequests.currentPingInterval = null;
      this.executedCommands.push({ command: '^C', path: this.currentPathString });
      this.httpRequests.isFetching = false;
      this.command = '';
      this.scrollDown();
    }
  }

  dig(command: string): void {
    this.httpRequests.dig(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }

  nslookup(command: string): void {
    this.httpRequests.nslookup(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }

  traceroute(command: string): void {
    this.httpRequests.traceroute(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }

  weather(command: string): void {
    this.httpRequests.weather(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }
}
