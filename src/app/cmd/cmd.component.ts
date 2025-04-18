import { Component, ElementRef, inject, NgZone, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { typeCommand, typeCommandList, typeDirectory } from '../types/types';
import { ScrollService } from '../services/scroll.service';
import { HttpClient } from '@angular/common/http';
import { AVAILABLE_COMMANDS } from '../data/available-commands';
import { COMMAND_CONFIG } from '../data/command-map';
import { AVAILABLE_DIRECTORIES } from '../data/available-directories';
import { HelpComponent } from "./help/help.component";
import { UtilsService } from '../services/utils.service';
import { HttpRequestsService } from '../services/http-requests.service';
import { LocalRequestsService } from '../services/local-requests.service';
import { AutoGrowDirective } from '../directives/auto-grow.directive';

@Component({
  selector: 'app-cmd',
  imports: [FormsModule, HelpComponent, AutoGrowDirective],
  templateUrl: './cmd.component.html',
  styleUrl: './cmd.component.scss'
})
export class CmdComponent {
  @ViewChildren('preTag') preTags!: QueryList<ElementRef<HTMLElement>>;
  @ViewChild('contentContainer', { static: false }) contentContainer!: ElementRef<HTMLElement>;

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
      const el = this.contentContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    });
  }

  checkInputs(command: string): void {
    const commands = command.split('&&').map(command => command.trim()).filter(command => command.length);

    for(const cmd of commands) {
      const tokens = cmd.split(' ');
      const commandKey = tokens[0];
      const fn = this.commandMap[commandKey];
      
      if(fn) {
        fn(cmd)
      } else {
        this.executedCommands.push({ command, output: `${ command }: command not found`, path: this.currentPathString });
      }
    }
  }

  selectCommand(event: KeyboardEvent, command?: string): void {
    if(this.localRequests.isEditing && event.key === 'Enter' && !event.ctrlKey) {
      event.preventDefault();
      document.execCommand('insertHTML', false, '\n');
      this.scrollDown();
    }
    if(event.shiftKey && event.key === 'Enter') {
      return;
    }
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
      if(!command) return;
      this.executeCommand(command);
    }
    if(event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      this.stopPing();
    }
    if(event.ctrlKey && event.key.toLowerCase() === 'x') {
      event.stopPropagation();
      if(!this.localRequests.isEditing) return;
      this.localRequests.isEditing = false;

      const pre = event.currentTarget as HTMLElement;
      const newData = pre.innerText;
  
      this.localRequests.isEditing = false;
      this.saveFile(event.key.toUpperCase(), newData);
      this.focusInput();
      this.scrollDown();
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

  focusInput(event?: MouseEvent): void {
    setTimeout(() => {
      const inputField = document.querySelector('textarea');
      if(inputField) (inputField as HTMLElement).focus({ preventScroll: true });
      if(event instanceof MouseEvent && event.detail === 1) return;
      this.scrollDown();
    });
  }

  focusPreElement(): void {
    setTimeout(() => {
      const arr = this.preTags.toArray();
      if(arr.length) {
        arr[arr.length - 1].nativeElement.focus();
      }
    });
  }


  // LOCAL REQUESTS

  clear(): void {
    this.localRequests.clear(this.executedCommands);
  }
  
  whoami(command: string): void {
    this.localRequests.whoami(command, this.executedCommands, this.currentPathString);
  }

  uname(command: string): void {
    this.localRequests.uname(command, this.executedCommands, this.currentPathString);
  }

  uptime(command: string): void {
    this.localRequests.uptime(command, this.executedCommands, this.currentPathString);
  }

  date(command: string): void {
    this.localRequests.date(command, this.executedCommands, this.currentPathString);
  }

  echo(command: string): void {
    this.localRequests.echo(command, this.executedCommands, this.currentPathString);
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

  cat(command: string): void {
    this.localRequests.cat(command, this.executedCommands, this.currentPathString, this.currentDirectory, this.scrollDown.bind(this), this.focusPreElement.bind(this));
  }

  mkdir(command: string): void {
    this.localRequests.mkdir(command, this.executedCommands, this.currentPathString, this.currentDirectory);
  }

  rmdir(command: string): void {
    this.localRequests.rmdir(command, this.executedCommands, this.currentPathString, this.currentDirectory);
  }

  touch(command: string): void {
    this.localRequests.touch(command, this.executedCommands, this.currentPathString, this.currentDirectory);
  }

  saveFile(command: string, newData: string): void {
    this.localRequests.saveFile(command, this.executedCommands, this.currentPathString, this.currentDirectory, newData, this.scrollDown.bind(this));
  }

  pwd(command: string): void {
    this.localRequests.pwd(command, this.executedCommands, this.currentPathString);
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
