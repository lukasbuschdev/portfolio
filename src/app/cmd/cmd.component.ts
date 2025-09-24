import { Component, ElementRef, inject, NgZone, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { typeCommand, typeCommandList, typeDirectory, typeLog } from '../types/types';
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
  @ViewChild(AutoGrowDirective) autoGrow!: AutoGrowDirective;
  @ViewChild('terminalContainer', { static: false }) terminalContainer!: ElementRef<HTMLElement>;
  @ViewChild('contentContainer', { static: false }) contentContainer!: ElementRef<HTMLElement>;
  @ViewChild('commandInput', { static: false }) commandInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('nanoInput', { static: false }) nanoInput!: ElementRef<HTMLTextAreaElement>;

  command: string = '';
  pendingCommand: string | null = null;

  isCommandSent: boolean = false;

  executedCommands: typeCommand[] = [];
  count: number = 0;
  tabIndex: number = 0;
  password: string = 'TemetNosce!';
  inputPw: string = '';

  availableCommands: typeCommandList[] = AVAILABLE_COMMANDS;
  avaiableDirectories: typeDirectory[] = AVAILABLE_DIRECTORIES;

  currentDirectoryPath: typeDirectory[] = [this.avaiableDirectories[0]];

  logs: typeLog[] = [];

  private commandMap: { [key: string]: (cmd: string) => void } = {};

  get currentDirectory(): typeDirectory {
    return this.currentDirectoryPath[this.currentDirectoryPath.length - 1];
  }

  get currentPathString(): string {
    const path = this.currentDirectoryPath.map(dir => dir.directory).filter(Boolean).join('/');
    return path ? '/' + path : '';
  }

  constructor(public host: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    Object.keys(COMMAND_CONFIG).forEach(cmd => {
      if(typeof (this as any)[COMMAND_CONFIG[cmd]] === 'function') {
        this.commandMap[cmd] = (this as any)[COMMAND_CONFIG[cmd]].bind(this);
      }
    });

    this.focusTextarea();
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
    this.tabIndex = 0;

    this.commandInput.nativeElement.style.removeProperty('height');
    setTimeout(() => this.autoGrow.resize());
    this.scrollDown();
  }

  scrollDown(): void {
    setTimeout(() => {
      const el = this.contentContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    }, 10);
  }

  checkInputs(command: string): void {
    if(!this.checkIfSudo(command)) return;

    const commands = command.split('&&').map(command => command.trim()).filter(command => command.length);
    this.appendLog(command);

    for(const cmd of commands) {
      const tokens = cmd.split(' ');
      const commandKey = tokens[0];
      const fn = this.commandMap[commandKey];
      
      if(fn) {
        fn(cmd)
      } else {
        this.executedCommands.push({ command, output: `${ command }: command not found\nType 'help' for more information`, path: this.currentPathString });
      }
    }
  }

  checkIfSudo(command: string): boolean{
    if(command.startsWith('sudo ') && !this.localRequests.hasRootPermissions) {
      this.pendingCommand = command;
      this.localRequests.isInputPassword = true;
      this.inputPw = '';
      this.executedCommands.push({ command, path: this.currentPathString });
      this.focusPasswordInput();
      return false;
    }

    if(command.startsWith('sudo ') && this.localRequests.hasRootPermissions) {
      this.executedCommands.push({ command, output: `sudo: usage error: root permission already granted`, path: this.currentPathString });
      return false;
    }

    return true;
  }

  appendLog(command: string): void {
    const timestamp = this.utils.formatTimestamp(new Date());
    this.logs.push({ timestamp, command });
  }

  selectCommand(event: KeyboardEvent, command?: string): void {
    if(event.key === 'ArrowUp') {
      if(this.localRequests.isEditing) return;
      event.preventDefault();
      this.selectCommandUp();
    }
    if(event.key === 'ArrowDown') {
      if(this.localRequests.isEditing) return;
      event.preventDefault();
      this.selectCommandDown();
    }
    if(event.key === 'Enter') {
      if(this.localRequests.isEditing) return;
      event.preventDefault();
      if(this.httpRequests.isFetching) return;
      if(!command) return;
      this.executeCommand(command);
      this.focusTextarea();
    }
    if(event.ctrlKey && event.key.toLowerCase() === 'c') {
      event.preventDefault();
      this.stopPing();
    }
    if(event.ctrlKey && event.key.toLowerCase() === 'o') {
      this.saveAndExitNano(event);
    }
    if(event.ctrlKey && event.key.toLowerCase() === 'x') {
      this.exitNano(event);
    }
    if(event.key === 'Tab') {
      event.preventDefault();
      this.showFilesAndDirectories();
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
      const inputField = document.querySelector('.input-line textarea');
      if(inputField) (inputField as HTMLElement).focus({ preventScroll: true });
      if(event instanceof MouseEvent && event.detail === 1) return;
      this.scrollDown();
    });
  }

  focusPasswordInput(): void {
    setTimeout(() => {
      const input = document.querySelector('.password-input-container input');
      if(input) (input as HTMLElement).focus();
      this.scrollDown();
    });
  }

  focusTextarea(): void {
    setTimeout(() => {
      this.commandInput.nativeElement.focus();
    }, 100);
  }

  focusNanoInput(): void {
    setTimeout(() => {
      this.nanoInput.nativeElement.focus();
    }, 100);
  }

  checkPassword(inputPassword: string): void {
    this.localRequests.isInputPassword = false;

    if(inputPassword !== this.password) {
      this.executedCommands.push({ command: this.pendingCommand!, output: `${ this.pendingCommand }: wrong password: Permission denied`, path: this.currentPathString });
      this.pendingCommand = null;
      this.focusTextarea();
      return this.scrollDown();
    }

    this.localRequests.hasRootPermissions = true;
    const cmd = this.pendingCommand!;
    this.pendingCommand = null;

    this.checkInputs(cmd.replace(/^sudo\s+/, ''));
    this.focusTextarea();
  }

  exitNano(event?: Event): void {
    event?.stopPropagation();
    if(!this.localRequests.isEditing) return;
    this.localRequests.isEditing = false;
    this.focusTextarea();
    this.command = '';
    this.scrollDown();
  }

  saveAndExitNano(event: Event): void {
    event?.stopPropagation();
    if(!this.localRequests.isEditing) return;
    this.localRequests.isEditing = false;
    this.saveFile('O');
    this.focusTextarea();
    this.command = '';
    this.scrollDown();
  }

  showFilesAndDirectories(): void {
    const files = this.currentDirectory.files.filter(file => !file.isHidden).map(file => file.name);
    const subdirectories = this.currentDirectory.subdirectories.map(subdir => subdir.directory);
    const tabFiles = [...files, ...subdirectories, ''];

    const insertedCommand = this.command.trim().split(' ')[0];
    const isFileOrDir = tabFiles.includes(insertedCommand);

    this.command = (insertedCommand && !isFileOrDir) ? (insertedCommand + ' ' + tabFiles[this.tabIndex]) : tabFiles[this.tabIndex];
    this.tabIndex = (this.tabIndex + 1) % tabFiles.length;
  }


  // LOCAL REQUESTS

  clear(): void {
    this.localRequests.clear(this.executedCommands);
  }

  reboot(command: string): void {
    this.localRequests.reboot(command, this.executedCommands, this.currentPathString);
  }
  
  color(command: string): void {
    this.localRequests.color(command, this.executedCommands, this.currentPathString, this.host.nativeElement);
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
    this.localRequests.help(command, this.executedCommands, this.currentPathString);
  }

  story(command: string): void {
    this.localRequests.story(command, this.executedCommands, this.currentPathString);
  }

  cd(command: string): void {
    this.localRequests.cd(command, this.executedCommands, this.currentPathString, this.currentDirectory, this.currentDirectoryPath);
  }

  ls(command: string): void {
    this.localRequests.ls(command, this.executedCommands, this.currentPathString, this.currentDirectory);
  }

  cat(command: string): void {
    this.localRequests.cat(command, this.executedCommands, this.currentPathString, this.currentDirectory, this.scrollDown.bind(this));
  }

  nano(command: string): void {
    this.localRequests.nano(command, this.executedCommands, this.currentPathString, this.currentDirectory, this.focusNanoInput.bind(this));
  }

  mkdir(command: string): void {
    this.localRequests.mkdir(command, this.executedCommands, this.currentPathString, this.currentDirectory);
  }

  rmdir(command: string): void {
    this.localRequests.rmdir(command, this.executedCommands, this.currentPathString, this.currentDirectory);
  }

  rm(command: string): void {
    this.localRequests.rm(command, this.executedCommands, this.currentPathString, this.currentDirectory);
  }

  touch(command: string): void {
    this.localRequests.touch(command, this.executedCommands, this.currentPathString, this.currentDirectory);
  }

  saveFile(command: string): void {
    this.localRequests.saveFile(command, this.executedCommands, this.currentPathString, this.currentDirectory);
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
    this.httpRequests.curl(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this), this.host.nativeElement);
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
      this.httpRequests.isPinging = false;
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

  shorten(command: string): void {
    this.httpRequests.shorten(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }
  
  qr(command: string): void {
    this.httpRequests.qr(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }
  
  status(command: string): void {
    this.httpRequests.status(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }

  whois(command: string): void {
    this.httpRequests.whois(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }

  ssl(command: string): void {
    this.httpRequests.ssl(command, this.executedCommands, this.currentPathString, this.scrollDown.bind(this));
  }
}
