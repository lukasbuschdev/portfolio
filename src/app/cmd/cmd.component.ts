import { Component, inject, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { typeCommand, typeCommandList, typeDirectory, typeDnsResponse } from '../types/types';
import { ScrollService } from '../services/scroll.service';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AVAILABLE_COMMANDS } from '../data/available-commands';
import { COMMAND_CONFIG } from '../data/command-map';
import { AVAILABLE_DIRECTORIES } from '../data/available-directories';
import { LsComponent } from './ls/ls.component';
import { HelpComponent } from "./help/help.component";
import { UtilsService } from '../services/utils.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cmd',
  imports: [FormsModule, LsComponent, HelpComponent],
  templateUrl: './cmd.component.html',
  styleUrl: './cmd.component.scss'
})
export class CmdComponent {
  command: string = '';

  isCommandSent: boolean = false;
  isPinging: boolean = false;

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
  utils = inject(UtilsService);


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

  selectCommand(event: KeyboardEvent): void {
    if(event.key === 'ArrowUp') {
      event.preventDefault();
      this.selectCommandUp();
    }
    if(event.key === 'ArrowDown') {
      event.preventDefault();
      this.selectCommandDown();
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

  exit(): void {
    this.scroll.goToSection('main', 'landing-page');
  }
  
  history(command: string): void {
    const commandHistory = this.getCommandHistory();
    this.executedCommands.push({ command, output: commandHistory, path: this.currentPathString })
  }

  getCommandHistory(): string {
    let allCommands = '';
    let count = 0;

    this.executedCommands.forEach(command => {
      count++;
      allCommands += `${count}\t${command.command}\n`
    });

    return allCommands;
  }







  // GET IP

  async ipaddr(command: string): Promise<void>{
    try {
      const ip = await this.getPublicIP();
      this.executedCommands.push({ command, output: ip, path: this.currentPathString });
      this.scrollDown();
    } catch (error) {
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
      this.scrollDown();
      return;
    }

    const urlTokens = tokens[1];

    this.http.get(urlTokens, { responseType: 'text' }).subscribe(
      response => {
        this.executedCommands.push({ command, output: response, path: this.currentPathString });
        this.scrollDown();
      },
      error => {
        this.executedCommands.push({ command, output: `Error: ${error.message}`, path: this.currentPathString });
        this.scrollDown();
      }
    );
  }


  // PING

  ping(command: string): void {
    const tokens = command.trim().split(' ');
    const url = tokens[1];

    this.checkPingValidation(command, tokens);
    this.isPinging = true;
    
    this.executedCommands.push({ command, output: `ping ${url}`, path: this.currentPathString });
    const pingIndex = this.executedCommands.length - 1;

    this.currentPingInterval = setInterval(() => {
      const startTime = performance.now();

      this.ngZone.run(() => {
        this.http.head(url, { observe: 'response' }).subscribe(
          response => {
            console.log(response)
            const latency = performance.now() - startTime;
            this.executedCommands[pingIndex].output += `\nPING ${url} status: ${response.status} time: ${latency.toFixed(2)}ms`;
            this.scrollDown();
          },
          error => {
            const rtt = performance.now() - startTime;
            this.executedCommands[pingIndex].output += `\nPing to ${url} failed (error: ${error.message}). RTT: ${rtt.toFixed(2)} ms`;
            this.scrollDown();
          }
        );
      });

    }, 1000);
  }

  checkPingValidation(command: string, tokens: string[]): void {
    if(tokens[1] === undefined) {
      this.executedCommands.push({ command, output: 'ping: usage error: Destination address required', path: this.currentPathString });
      this.scrollDown();
      return;
    }
    
    if(!tokens[1].includes('.')) {
      this.executedCommands.push({ command, output: `ping: ${tokens[1]}: Name or service not known`, path: this.currentPathString });
      this.scrollDown();
      return;
    }

    if(this.currentPingInterval) {
      clearInterval(this.currentPingInterval);
      this.currentPingInterval = null;
    }
  }

  stopPing(): void {
    if(this.currentPingInterval) {
      clearInterval(this.currentPingInterval);
      this.currentPingInterval = null;
      this.executedCommands.push({ command: '^C', path: this.currentPathString });
      this.isPinging = false;
      this.scrollDown();
    }
  }


  // DIG

  dig(command: string): void {
    const tokens = command.trim().split(' ');

    if(tokens[1] === undefined) {
      this.executedCommands.push({ command, output: '', path: this.currentPathString });
      this.scrollDown();
      return;
    }

    const hostname = tokens[1];
    const url = `https://dns.google/resolve?name=${hostname}&type=A`;
    const startTime = performance.now();

    this.http.get(url).subscribe(
      (response: any) => {
        const data = this.getDigResponseData(response, hostname, startTime);
        this.executedCommands.push({ command, output: data, path: this.currentPathString });
        this.scrollDown();
      },
      error => {
        this.executedCommands.push({ command, output: `Error: ${error.message}`, path: this.currentPathString });
        this.scrollDown();
      }
    );

  }

  getDigResponseData(response: any, hostname: string, startTime: number): string {
    const domain = response.Question && response.Question.length > 0 ? response.Question[0].name : hostname + '.';
    const answer = response.Answer && response.Answer.length > 0 ? response.Answer[0] : null;
    const statusText = response.Status === 0 ? 'NOERROR' : response.Status;
    const id = this.utils.generateRandomId();
    const queryTime = Math.round(performance.now() - startTime) + ' msec';
    const msgSize = answer ? 59 : 36;
    return `\n; <<>> DiG 9.18.30-0ubuntu0.22.04.2-Ubuntu <<>> ${domain.replace(/\.$/, '')}\n;; global options: +cmd\n;; Got answer:\n;; ->>HEADER<<- opcode: QUERY, status: ${statusText}, id: ${id}\n;; flags: qr rd ra; QUERY: 1, ANSWER: ${answer ? 1 : 0}, AUTHORITY: 0, ADDITIONAL: 1\n\n;; OPT PSEUDOSECTION:\n; EDNS: version: 0, flags:; udp: 65494\n;; QUESTION SECTION:\n;${domain}\t\tIN\tA\n\n;; ANSWER SECTION:\n${answer ? `${answer.name}\t\t${answer.TTL}\tIN\tA\t${answer.data}` : ''}\n\n;; Query time: ${queryTime}\n;; SERVER: 127.0.0.53#53(127.0.0.53) (UDP)\n;; WHEN: ${this.utils.formatTimestamp(new Date())}\n;; MSG SIZE  rcvd: ${msgSize}\n`;
  }


  // NSLOOKUP

  nslookup(command: string): void {
    const tokens = command.trim().split(' ');

    if(tokens[1] === undefined) {
      this.executedCommands.push({ command, output: `nslookup: usage error: Destination address required` });
      this.scrollDown();
      return;
    }

    const hostname = tokens[1];
    const urlA = `https://dns.google/resolve?name=${hostname}&type=A`;
    const urlAAAA = `https://dns.google/resolve?name=${hostname}&type=AAAA`;

    forkJoin({
      a: this.http.get(urlA),
      aaaa: this.http.get(urlAAAA)
    }).subscribe(
      (response: { a: any, aaaa: any }) =>  {
        const finalResponse = this.getFinalResponse(response); 
        const data = this.getNslookupResponseData(finalResponse, hostname);
        this.executedCommands.push({ command, output: data, path: this.currentPathString });
        this.scrollDown();
      },
      error => {
        this.executedCommands.push({ command, output: `Error: ${error.message}`, path: this.currentPathString });
        this.scrollDown();
      }
    );

  }

  getFinalResponse(response: { a: any, aaaa: any }): any {
    const combinedAnswer: any[] = [];

    if(response.a && response.a.Answer) {
      combinedAnswer.push(...response.a.Answer);
    }
    if(response.aaaa && response.aaaa.Answer) {
      combinedAnswer.push(...response.aaaa.Answer);
    }

    return {
      Status: (response.a.Status === 0 || response.aaaa.Status === 0) ? 0 : response.a.Status,
      Answer: combinedAnswer
    }
  }

  getNslookupResponseData(response: typeDnsResponse, hostname: string): string {
    const serverInfo = `Server:\t\t127.0.0.53\nAddress:\t127.0.0.53#53\n\n`;

    if(response.Status !== 0 || !response.Answer[0] || response.Answer.length === 0) return serverInfo + `** server can't find ${hostname}: NXDOMAIN\n`;

    let answerSection = `Non-authoritative answer:\n`;

    response.Answer.forEach((answer: any) => {
      const answerName = answer.name.endsWith('.') ? answer.name.slice(0, -1) : answer.name;
      answerSection += `Name:\t\t${answerName}\n`;
      answerSection += `Address:\t${answer.data}\n`;
    });

    return serverInfo + answerSection;
  }
}
