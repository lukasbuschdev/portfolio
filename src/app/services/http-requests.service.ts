import { inject, Injectable, NgZone } from '@angular/core';
import { ScrollService } from './scroll.service';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from './utils.service';
import { typeCommand, typeDnsResponse } from '../types/types';
import { firstValueFrom, forkJoin } from 'rxjs';
import { LocalRequestsService } from './local-requests.service';

@Injectable({
  providedIn: 'root'
})
export class HttpRequestsService {
  isFetching: boolean = false;
  isPinging: boolean = false;
  currentPingInterval: any = null;
  private apiKeyPromise: Promise<string> | null = null;

  scroll = inject(ScrollService);
  http = inject(HttpClient);
  ngZone = inject(NgZone);
  utils = inject(UtilsService);
  localRequests = inject(LocalRequestsService);


  // PING

  ping(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    const tokens = command.trim().split(' ');
    const url = tokens[1];

    if(!this.checkPingValidation(command, tokens, executedCommands, currentPathString, scrollDown)) return;
    this.isFetching = true;
    this.isPinging = true;
    
    executedCommands.push({ command, output: `ping ${url}`, path: currentPathString });
    const pingIndex = executedCommands.length - 1;

    this.currentPingInterval = setInterval(() => {
      const startTime = performance.now();

      this.ngZone.run(() => {
        this.httpRequestPing(executedCommands, scrollDown, url, startTime, pingIndex);
      });
    }, 1000);
  }

  checkPingValidation(command: string, tokens: string[], executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): boolean {
    if(tokens.length < 2) {
      executedCommands.push({ command, output: 'ping: usage error: Destination address required', path: currentPathString });
      scrollDown();
      return false;
    }
    
    if(!tokens[1].includes('.')) {
      executedCommands.push({ command, output: `ping: ${tokens[1]}: Name or service not known`, path: currentPathString });
      scrollDown();
      return false;
    }

    this.checkCurrentPingIntervall();
    return true;
  }

  checkCurrentPingIntervall(): void {
    if(this.currentPingInterval) {
      clearInterval(this.currentPingInterval);
      this.currentPingInterval = null;
    }
  }

  httpRequestPing(executedCommands: typeCommand[], scrollDown: () => void, url: string, startTime: number, pingIndex: number): void {
    this.http.head(url, { observe: 'response' }).subscribe(
      response => {
        const latency = performance.now() - startTime;
        executedCommands[pingIndex].output += `\nPING ${url} status: ${response.status} time: ${latency.toFixed(2)}ms`;
        scrollDown();
      },
      error => {
        const rtt = performance.now() - startTime;
        executedCommands[pingIndex].output += `\nPing to ${url} failed (error: ${error.message}). RTT: ${rtt.toFixed(2)} ms`;
        scrollDown();
      }
    );
  }


  // DIG

  dig(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    const tokens = command.trim().split(' ');
    if(!this.checkDigInput(command, tokens, executedCommands, currentPathString, scrollDown)) return;

    executedCommands.push({ command, output: '', path: currentPathString });
    const digIndex = executedCommands.length - 1;

    const hostname = tokens[1];
    const url = `https://dns.google/resolve?name=${hostname}&type=A`;
    const startTime = performance.now();

    this.httpRequestDig(executedCommands, scrollDown, digIndex, hostname, url, startTime);
  }

  checkDigInput(command: string, tokens: string[], executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): boolean {
    if(tokens.length < 2) {
      executedCommands.push({ command, output: 'dig: usage error: Destination address required', path: currentPathString });
      scrollDown();
      return false;
    }

    return true;
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

  httpRequestDig(executedCommands: typeCommand[], scrollDown: () => void, digIndex: number, hostname: string, url: string, startTime: number): void {
    this.http.get(url).subscribe(
      (response: any) => {
        const data = this.getDigResponseData(response, hostname, startTime);
        executedCommands[digIndex].output += data;
        scrollDown();
      },
      error => {
        executedCommands[digIndex].output += `Error: ${error.message}`;
        scrollDown();
      }
    );
  }


  // NSLOOKUP

  nslookup(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    const tokens = command.trim().split(' ');
    if(!this.checkNslookupInput(command, tokens, executedCommands, scrollDown)) return;

    executedCommands.push({ command, output: '', path: currentPathString });
    const lookupIndex = executedCommands.length - 1;

    const hostname = tokens[1];
    const urlA = `https://dns.google/resolve?name=${hostname}&type=A`;
    const urlAAAA = `https://dns.google/resolve?name=${hostname}&type=AAAA`;

    this.httpRequestNslookup(executedCommands, scrollDown, lookupIndex, hostname, urlA, urlAAAA);
  }

  checkNslookupInput(command: string, tokens: string[], executedCommands: typeCommand[], scrollDown: () => void): boolean {
    if(tokens.length < 2) {
      executedCommands.push({ command, output: `nslookup: usage error: Destination address required` });
      scrollDown();
      return false;
    }

    return true;
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

  httpRequestNslookup(executedCommands: typeCommand[], scrollDown: () => void, lookupIndex: number, hostname: string, urlA: string, urlAAAA: string): void {
    forkJoin({
      a: this.http.get(urlA),
      aaaa: this.http.get(urlAAAA)
    }).subscribe(
      (response: { a: any, aaaa: any }) =>  {
        const finalResponse = this.getFinalResponse(response); 
        const data = this.getNslookupResponseData(finalResponse, hostname);
        executedCommands[lookupIndex].output += data;
        scrollDown();
      },
      error => {
        executedCommands[lookupIndex].output += `Error: ${error.message}`;
        scrollDown();
      }
    );
  }


  // GET IP

  async ipaddr(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): Promise<void>{
    executedCommands.push({ command, output: '', path: currentPathString });
    this.isFetching = true;
    const ipIndex = executedCommands.length - 1;

    try {
      const ip = await this.getPublicIP();
      executedCommands[ipIndex].output += ip;
      this.isFetching = false;
      scrollDown();
    } catch (error) {
      executedCommands[ipIndex].output += 'Error fetching IP address.';
      this.isFetching = false;
      scrollDown();
    }
  }
  
  getPublicIP(): Promise<string> {
    return firstValueFrom(
      this.http.get<{ ip: string }>('https://api.ipify.org?format=json')
    ).then(response => response.ip);
  }


  // CURL

  curl(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void, hostElement: HTMLElement, terminalContainer: HTMLElement): void {
    const tokens = command.trim().split(' ');
    if(!this.checkCurlInput(command, tokens, executedCommands, currentPathString, scrollDown)) return;
    
    executedCommands.push({ command, output: '', path: currentPathString });
    const curlIndex = executedCommands.length - 1;
    this.isFetching = true;

    let rawUrl = tokens[1].startsWith('http://') || tokens[1].startsWith('https://') ? tokens[1] : 'https://' + tokens[1];

    const proxyUrl = 'https://proxy.lukasbusch.dev/?url=';
    const fetchUrl = tokens[1] === 'matrix' ? 'https://lukasbusch.dev/matrix.txt?ngsw-bypass=true' : proxyUrl + encodeURIComponent(rawUrl);
    
    this.httpRequestCurl(executedCommands, scrollDown, fetchUrl, curlIndex);
    if(tokens[1] === 'matrix') this.localRequests.color(command, executedCommands, currentPathString, hostElement, terminalContainer);
  }

  checkCurlInput(command: string, tokens: string[], executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): boolean {
    if(tokens.length < 2) {
      executedCommands.push({ command, output: 'curl: usage error: Destination address required', path: currentPathString });
      scrollDown();
      return false;
    }
    
    return true;
  }

  httpRequestCurl(executedCommands: typeCommand[], scrollDown: () => void, fetchUrl: string, curlIndex: number): void {
    this.http.get(fetchUrl, { responseType: 'text' }).subscribe(
      response => {
        executedCommands[curlIndex].output += response;
        this.isFetching = false;
        scrollDown();
      },
      error => {
        executedCommands[curlIndex].output += `Error: ${error.message}`;
        this.isFetching = false;
        scrollDown();
      }
    );
  }


  // WEATHER

  private getWeatherApiKey(): Promise<string> {
    if(!this.apiKeyPromise) {
      this.apiKeyPromise = firstValueFrom(this.http.get<{ WEATHER_API_KEY: string }>('/api/config.php')).then(cfg => {
        if(!cfg || !cfg.WEATHER_API_KEY) {
          throw new Error('Weather API key missing from config.php');
        }
        return cfg.WEATHER_API_KEY;
      });
    }
    return this.apiKeyPromise;
  }

  async weather(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): Promise<void> {
    const tokens = command.trim().split(' ');

    if(!this.checkWeatherInput(command, tokens, executedCommands, currentPathString, scrollDown)) return;
    executedCommands.push({ command, output: '', path: currentPathString });
    this.isFetching = true;

    const weatherIndex = executedCommands.length - 1;

    const city = tokens.slice(1).join(' ');
    const apiKey = await this.getWeatherApiKey();
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

    this.httpRequestWeather(executedCommands, scrollDown, url, weatherIndex);
  }

  checkWeatherInput(command: string, tokens: string[], executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): boolean {
    if(tokens.length < 2) {
      executedCommands.push({ command, output: 'weather: usage error: Location required', path: currentPathString });
      scrollDown();
      return false;
    }

    return true;
  }

  httpRequestWeather(executedCommands: typeCommand[], scrollDown: () => void, url: string, weatherIndex: number): void {
    this.http.get(url).subscribe(
      (response: any) => {
        const fetchOutput = `Weather in ${response.name}, ${response.sys.country}:\n\nSky:\t\t${response.weather[0].main}\nTemperature:\t${response.main.temp.toFixed(1)}°C\nHumidity:\t ${response.main.humidity}%\nPressure:\t${response.main.pressure}\nWind:\t\t${response.wind.speed.toFixed(0)}km/h FROM ${response.wind.deg}°\nVisibility:\t${response.visibility}m\nSunrise:\t${this.utils.formatTime(response.sys.sunrise, response.timezone)} AM\nSunset:\t\t${this.utils.formatTime(response.sys.sunset, response.timezone)} PM\nCoordinates:\t${this.utils.formatCoordinates(response.coord.lat, response.coord.lon)}\n`;
        executedCommands[weatherIndex].output += fetchOutput;
        this.isFetching = false;
        scrollDown();
      },
      error => {
        executedCommands[weatherIndex].output += `Error: ${error.message}`;
        this.isFetching = false;
        scrollDown();
      }
    );
  }


  // TRACEROUTE

  traceroute(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    const tokens = command.trim().split(' ');

    if(!this.checkTracerouteInput(command, executedCommands, currentPathString, scrollDown, tokens)) return;

    executedCommands.push({ command, output: `Traceroute to ${tokens[1]} in progress...\n`, path: currentPathString });

    const traceIndex = executedCommands.length - 1;
    this.isFetching = true;

    const fetchUrl = `https://api.lukasbusch.dev/traceroute?q=${encodeURIComponent(tokens[1])}`;

    this.httpRequestTraceroute(executedCommands, scrollDown, fetchUrl, traceIndex);
  }

  checkTracerouteInput(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void, tokens: string[]): boolean {
    if(tokens.length < 2) {
      executedCommands.push({ command, output: 'traceroute: usage error: Destination address required', path: currentPathString });
      scrollDown();
      return false;
    }

    return true;
  }

  httpRequestTraceroute(executedCommands: typeCommand[], scrollDown: () => void, fetchUrl: string, traceIndex: number): void {
    this.http.get(fetchUrl, { responseType: 'text' }).subscribe(
      (response: string) => {
        executedCommands[traceIndex].output = response;
        this.isFetching = false;
        scrollDown();
      },
      error => {
        executedCommands[traceIndex].output += `Error: ${error.message}`;
        this.isFetching = false;
        scrollDown();
      }
    );
  }
}
