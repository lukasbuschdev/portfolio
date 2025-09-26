import { inject, Injectable, NgZone } from '@angular/core';
import { ScrollService } from './scroll.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
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

  qrPath: string = '';
  currentPingInterval: any = null;
  private apiKeyPromise: Promise<string> | null = null;

  scroll = inject(ScrollService);
  http = inject(HttpClient);
  ngZone = inject(NgZone);
  utils = inject(UtilsService);
  localRequests = inject(LocalRequestsService);


  // PING

  ping(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('ping'), path: currentPathString });
      scrollDown();
      return;
    }

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
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('dig'), path: currentPathString });
      scrollDown();
      return;
    }

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
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('nslookup'), path: currentPathString });
      scrollDown();
      return;
    }

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
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('ipaddr'), path: currentPathString });
      scrollDown();
      return;
    }

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

  curl(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void, hostElement: HTMLElement): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('curl'), path: currentPathString });
      scrollDown();
      return;
    }

    const tokens = command.trim().split(/\s+/);
    const wantsHeaders = this.hasHeadersFlag(tokens);
    const target = this.firstNonFlagArg(tokens);

    if (!target) {
      executedCommands.push({ command, output: 'curl: usage error: Destination address required\nTip: try "curl -I <url>" to fetch only headers', path: currentPathString });
      scrollDown();
      return;
    }

    executedCommands.push({ command, output: '', path: currentPathString });
    const curlIndex = executedCommands.length - 1;
    this.isFetching = true;

    const rawUrl = (target.startsWith('http://') || target.startsWith('https://')) ? target : 'https://' + target;
    const proxyBase = 'https://proxy.lukasbusch.dev';
    const proxyUrl = `${proxyBase}/proxy?ngsw-bypass=true&url=`;
    const headersUrl = `${proxyBase}/headers?ngsw-bypass=true&url=`;

    let fetchUrl = '';

    if (target === 'matrix') {
      fetchUrl = 'https://lukasbusch.dev/matrix.txt?ngsw-bypass=true';
    } else if (target === '86.173.192.12:80') {
      fetchUrl = 'https://lukasbusch.dev/congrats.txt?ngsw-bypass=true';
    } else {
      fetchUrl = (wantsHeaders ? (headersUrl + encodeURIComponent(rawUrl)) : (proxyUrl + encodeURIComponent(rawUrl)));
    }

    if (wantsHeaders) {
      this.httpRequestCurlHeaders(executedCommands, scrollDown, rawUrl, fetchUrl, curlIndex);
    } else {
      this.httpRequestCurl(executedCommands, scrollDown, rawUrl, fetchUrl, curlIndex);
      if (target === 'matrix') this.localRequests.color(command, executedCommands, currentPathString, hostElement, scrollDown);
    }
  }

  checkCurlInput(command: string, tokens: string[], executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): boolean {
    if(tokens.length < 2) {
      executedCommands.push({ command, output: 'curl: usage error: Destination address required', path: currentPathString });
      scrollDown();
      return false;
    }
    
    return true;
  }

  hasHeadersFlag(tokens: string[]): boolean {
    return tokens.includes('-I');
  }
  
  firstNonFlagArg(tokens: string[]): string | null {
    for (const t of tokens.slice(1)) {
      if (!t.startsWith('-')) return t;
    }
    return null;
  }

  httpRequestCurl(executedCommands: typeCommand[], scrollDown: () => void, rawUrl: string, fetchUrl: string, curlIndex: number): void {
    this.http.get(fetchUrl, { responseType: 'text' }).subscribe(
      response => {
        executedCommands[curlIndex].output += response;
        this.isFetching = false;
        scrollDown();
      },
      (error) => {
        executedCommands[curlIndex].output += this.formatCurlError(error, rawUrl);
        this.isFetching = false;
        scrollDown();
      }
    );
  }

  httpRequestCurlHeaders(executedCommands: typeCommand[], scrollDown: () => void, rawUrl: string, fetchUrl: string, curlIndex: number): void {
    this.http.get(fetchUrl, { responseType: 'text' }).subscribe(
      (text) => {
        executedCommands[curlIndex].output = text;
        this.isFetching = false;
        scrollDown();
      },
      (error) => {
        executedCommands[curlIndex].output += this.formatCurlError(error, rawUrl);
        this.isFetching = false;
        scrollDown();
      }
    );
  }

  formatCurlError(err: any, url: string): string {
    if (err.status === 429) {
      return `curl: upstream returned 429 (Too Many Requests) for ${url}\n\n` +
             `Tip: try "curl -I ${url}" to fetch only headers (lighter, less likely to be blocked).`;
    }
    return `Error: ${err.message || 'unknown error'} (status ${err.status || 'n/a'})`;
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
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('weather'), path: currentPathString });
      scrollDown();
      return;
    }

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
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('traceroute'), path: currentPathString });
      scrollDown();
      return;
    }

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


  // SHORTEN

  shorten(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('shorten'), path: currentPathString });
      scrollDown();
      return;
    }

    const tokens = command.trim().split(' ');

    if(!this.checkShortenInput(command, executedCommands, currentPathString, scrollDown, tokens)) return;

    executedCommands.push({ command, output: `Shorten ${tokens[1]} in progress...\n`, path: currentPathString });

    const traceIndex = executedCommands.length - 1;
    this.isFetching = true;

    const raw = tokens[1].startsWith('http://') || tokens[1].startsWith('https://') ? tokens[1] : `https://${tokens[1]}`;
    const fetchUrl = 'https://proxy.lukasbusch.dev/shorten?ngsw-bypass=true&url=' + encodeURIComponent(raw);

    this.httpRequestShorten(executedCommands, scrollDown, fetchUrl, traceIndex);
  }

  checkShortenInput(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void, tokens: string[]): boolean {
    if(tokens.length < 2) {
      executedCommands.push({ command, output: 'shorten: usage error: Destination address required', path: currentPathString });
      scrollDown();
      return false;
    }

    return true;
  }

  httpRequestShorten(executedCommands: typeCommand[], scrollDown: () => void, fetchUrl: string, traceIndex: number): void {
    this.http.get(fetchUrl, {responseType: 'text'}).subscribe(
      (text) => {
        try {
          const response = JSON.parse(text);
          const short = response?.shorturl || response?.result_url;
          executedCommands[traceIndex].output =  short ? `${short}` : `Unexpected JSON:\n${text}`;
        } catch {
          executedCommands[traceIndex].output =  `Upstream did not return JSON. \n\n${text}`;
        }
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


  // QR

  qr(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('qr'), path: currentPathString });
      scrollDown();
      return;
    }

    const tokens = command.trim().split(' ');

    if(!this.checkQrInput(command, executedCommands, currentPathString, scrollDown, tokens)) return;

    executedCommands.push({ command, output: `QR creation for ${tokens[1]} in progress...\n`, path: currentPathString });

    const traceIndex = executedCommands.length - 1;
    this.isFetching = true;

    const raw = tokens[1].startsWith('http://') || tokens[1].startsWith('https://') ? tokens[1] : `https://${tokens[1]}`;
    const fetchUrl = 'https://proxy.lukasbusch.dev/qr?data=' + encodeURIComponent(raw);

    this.qrPath = fetchUrl;

    const tester = new Image();
    const done = (ok: boolean, msg: string) => {
      this.isFetching = false;
      if(ok) {
        executedCommands[traceIndex].output = '';
        executedCommands[traceIndex].qrPath = fetchUrl;
      } else {
        executedCommands[traceIndex].output = msg || 'qr: failed to load image';
        this.qrPath = '';
      }
      scrollDown();
    }

    tester.onload = () => done(true, '');
    tester.onerror = () => done(false, `qr: failed to load image for ${raw}`);
    tester.src = fetchUrl;
  }

  checkQrInput(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void, tokens: string[]): boolean {
    if(tokens.length < 2) {
      executedCommands.push({ command, output: 'qr: usage error: Target address required', path: currentPathString });
      scrollDown();
      return false;
    }

    return true;
  }


  // STATUS

  status(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('status'), path: currentPathString });
      scrollDown();
      return;
    }

    const tokens = command.trim().split(/\s+/);
    if (!this.checkStatusInput(command, executedCommands, currentPathString, scrollDown, tokens)) return;
    
    let raw = tokens[1];
    if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
    const target = new URL(raw);
    target.searchParams.set('ngsw-bypass', 'true');

    executedCommands.push({ command, output: `Checking status for ${raw}...\n\n`, path: currentPathString });
    const traceIndex = executedCommands.length - 1;
    this.isFetching = true;

    this.httpRequestStatus(executedCommands, scrollDown, raw, target.toString(), traceIndex);
  }

  checkStatusInput(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void, tokens: string[]): boolean {
    if(tokens.length < 2) {
      executedCommands.push({ command, output: 'status: usage error: Destination address required', path: currentPathString });
      scrollDown();
      return false;
    }

    return true;
  }

  httpRequestStatus(executedCommands: typeCommand[], scrollDown: () => void, rawUrl: string, fetchUrl: string, traceIndex: number): void {
    const start = performance.now();
    const proxied = `https://proxy.lukasbusch.dev/status?url=${encodeURIComponent(fetchUrl)}`;

    this.http.get<any>(proxied, { observe: 'response' }).subscribe({
      next: (res: HttpResponse<any>) => {
        const end = performance.now();
        const body = res.body || {};
        const lines: string[] = [];

        lines.push(`URL: ${rawUrl}`);
        lines.push(`Status: ${body.status} ${body.statusText || ''}`.trim());
        lines.push(`Time: ${(end - start).toFixed(1)} ms`);

        if (body.redirected) lines.push(`Redirected: ${body.redirected}`);
        if (body.headers?.location) lines.push(`Location: ${body.headers.location}`);
        if (body.headers?.['content-type']) lines.push(`Content-Type: ${body.headers['content-type']}`);
        if (body.headers?.['content-length']) lines.push(`Content-Length: ${body.headers['content-length']}`);

        executedCommands[traceIndex].output = (executedCommands[traceIndex].output || '') + lines.join('\n') + '\n';
        this.isFetching = false;
        scrollDown();
      },
      error: (err) => {
        executedCommands[traceIndex].output =
          (executedCommands[traceIndex].output || '') +
          `Error (proxy): ${err?.error?.error || err?.message || 'Unknown error'}\n`;
        this.isFetching = false;
        scrollDown();
      }
    });
  }

  
  // WHOIS

  whois(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('whois'), path: currentPathString });
      scrollDown();
      return;
    }

    const tokens = command.trim().split(/\s+/);

    // Reuse your existing validation (keeps behavior identical)
    if (!this.checkWhoisInput(command, executedCommands, currentPathString, scrollDown, tokens)) return;

    const { arg, rawFlag } = this.parseWhoisArgs(tokens);
    executedCommands.push({ command, output: `Looking up WHOIS for ${arg}...\n\n`, path: currentPathString });
    const traceIndex = executedCommands.length - 1;
    this.isFetching = true;

    const url = this.buildWhoisUrl(arg, rawFlag);

    this.http.get<any>(url).subscribe({
      next: (body) => {
        const out = rawFlag ? JSON.stringify(body, null, 2) + '\n' : this.formatWhoisOutput(body, arg);
        executedCommands[traceIndex].output += out;
        this.isFetching = false;
        scrollDown();
      },
      error: (err) => {
        executedCommands[traceIndex].output += `Error (whois): ${err?.error?.error || err?.message || 'Unknown error'}\n`;
        this.isFetching = false;
        scrollDown();
      }
    });
  }

  /** Extract first non-flag argument and flags (like --json) */
  private parseWhoisArgs(tokens: string[]): { arg: string; rawFlag: boolean } {
    const rawFlag = tokens.includes('--json');
    // first non-flag after "whois"
    const arg = tokens.slice(1).find(t => !t.startsWith('--')) || '';
    return { arg, rawFlag };
  }

  /** Build proxy URL with optional raw passthrough */
  private buildWhoisUrl(arg: string, rawFlag: boolean): string {
    const base = `https://proxy.lukasbusch.dev/whois?domain=${encodeURIComponent(arg)}`;
    return rawFlag ? `${base}&raw=1` : base;
  }

  /** Decide IP vs domain and format accordingly */
  private formatWhoisOutput(body: any, arg: string): string {
    const cls = String(body?.objectClassName || '').toLowerCase();
    if (cls.includes('ip') || body?.startAddress || body?.endAddress) return this.formatIpBody(body, arg);
    return this.formatDomainBody(body, arg);
  }

  /** Pretty print domain RDAP */
  private formatDomainBody(body: any, arg: string): string {
    const lines: string[] = [];
    lines.push(`Domain:\t\t${body.unicodeName || body.ldhName || arg}`);
    if (body.ldhName && body.unicodeName && body.ldhName !== body.unicodeName) {
      lines.push(`ASCII:\t\t${body.ldhName}`);
    }
    if (body.registrar) lines.push(`Registrar:\t${body.registrar}`);

    if (Array.isArray(body.status) && body.status.length) {
      lines.push(`Status:\t\t${body.status.join(', ')}`);
    }

    lines.push(`Created:\t${this.formatDate(body.registration)}`);
    lines.push(`Expires:\t${this.formatDate(body.expiration)}`);
    if (body.lastChanged) lines.push(`Updated:\t${this.formatDate(body.lastChanged)}`);

    if (Array.isArray(body.abuseEmails) && body.abuseEmails.length) {
      lines.push(`Abuse:\t\t${body.abuseEmails.join(', ')}`);
    }

    if (Array.isArray(body.nameServers) && body.nameServers.length) {
      lines.push(`Name servers:\n  - ${body.nameServers.join('\n  - ')}`);
    }

    return lines.join('\n') + '\n';
  }

  /** Pretty print IP network RDAP */
  private formatIpBody(body: any, arg: string): string {
    const lines: string[] = [];
    lines.push(`IP / Network:\t${arg}`);
    if (body.handle)       lines.push(`Handle:\t\t${body.handle}`);
    if (body.name)         lines.push(`Name:\t\t${body.name}`);
    if (body.startAddress) lines.push(`Start:\t\t${body.startAddress}`);
    if (body.endAddress)   lines.push(`End:\t\t${body.endAddress}`);
    if (body.country)      lines.push(`Country:\t${body.country}`);

    if (Array.isArray(body.events) && body.events.length) {
      const ev = body.events.slice(0, 4)
        .map((e: any) => `  - ${e.eventAction}: ${this.formatDate(e.eventDate)}`)
        .join('\n');
      lines.push(`Events:\n${ev}`);
    }

    return lines.join('\n') + '\n';
  }

  /** Consistent date formatting (UTC) */
  private formatDate(date?: string | null): string {
    return date ? new Date(date).toISOString().replace('T', ' ').replace('Z', ' UTC') : '—';
  }

  checkWhoisInput(command: string, executedCommands: typeCommand[], currentPathString: string,scrollDown: () => void,tokens: string[]): boolean {
    if (tokens.length < 2) {
      executedCommands.push({ command, output: 'whois: usage error: Domain or IP required', path: currentPathString });
      scrollDown();
      return false;
    }
    // first non-flag arg
    const arg = tokens.slice(1).find(t => !t.startsWith('--'));
    if (!arg) {
      executedCommands.push({ command, output: 'whois: usage error: Domain or IP required', path: currentPathString });
      scrollDown();
      return false;
    }
    // allow domains (have a dot) or IPv4/IPv6
    const looksLikeDomain = /[.]/.test(arg);
    const looksLikeIPv4 = /^[0-9.]+$/.test(arg);
    const looksLikeIPv6 = /^[0-9a-f:.]+$/i.test(arg);
    if (!looksLikeDomain && !looksLikeIPv4 && !looksLikeIPv6) {
      executedCommands.push({ command, output: `whois: "${arg}" is not a valid domain or IP`, path: currentPathString });
      scrollDown();
      return false;
    }
    return true;
  }


  // openssl CERT

  openssl(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('openssl'), path: currentPathString });
      scrollDown();
      return;
    }

    const tokens = command.trim().split(/\s+/);
    if (!this.checkSslInput(command, executedCommands, currentPathString, scrollDown, tokens)) return;

    const { domain, json } = this.parseSslArgs(tokens);

    executedCommands.push({ command, output: `Checking SSL certificate for ${domain}...\n\n`, path: currentPathString });
    const traceIndex = executedCommands.length - 1;
    this.isFetching = true;

    const url = this.buildSslUrl(domain, json);

    this.http.get<any>(url).subscribe({
      next: (body) => {
        const out = json ? (JSON.stringify(body, null, 2) + '\n') : this.formatSsl(body);
        executedCommands[traceIndex].output += out;
        this.isFetching = false;
        scrollDown();
      },
      error: (err) => {
        executedCommands[traceIndex].output += `Error (openssl): ${err?.error?.error || err?.message || 'Unknown error'}\n`;
        this.isFetching = false;
        scrollDown();
      }
    });
  }

  private checkSslInput(command: string, executedCommands: typeCommand[], currentPathString: string,scrollDown: () => void,tokens: string[]): boolean {
    if (tokens.length < 2) {
      executedCommands.push({ command, output: 'openssl: usage error: Domain required', path: currentPathString });
      scrollDown();
      return false;
    }
    const d = tokens.slice(1).find(t => !t.startsWith('--'));
    if (!d) {
      executedCommands.push({ command, output: 'openssl: usage error: Domain required', path: currentPathString });
      scrollDown();
      return false;
    }
    return true;
  }

  private parseSslArgs(tokens: string[]): { domain: string; json: boolean } {
    const json = tokens.includes('--json');
    const domain = tokens.slice(1).find(t => !t.startsWith('--')) || '';
    return { domain, json };
  }

  private buildSslUrl(domain: string, json: boolean): string {
    const base = `https://proxy.lukasbusch.dev/ssl?domain=${encodeURIComponent(domain)}`;
    return json ? `${base}&raw=1` : base;
  }

  private formatSsl(body: any): string {
    const lines: string[] = [];
    const subj = body.subject ? this.kvToLine(body.subject) : '';
    const issuer = body.issuer ? this.kvToLine(body.issuer) : '';

    if (subj)   lines.push(`Subject: ${subj}`);
    if (issuer) lines.push(`Issuer: ${issuer}`);
    if (body.valid_from) lines.push(`Valid from: ${body.valid_from}`);
    if (body.valid_to)   lines.push(`Valid to: ${body.valid_to}`);
    if (typeof body.valid_now === 'boolean') lines.push(`Currently valid: ${body.valid_now ? 'Yes' : 'No'}`);

    if (Array.isArray(body.alt_names) && body.alt_names.length) {
      lines.push(`Alt Names:\n  - ${body.alt_names.join('\n  - ')}`);
    }

    return lines.join('\n') + '\n';
  }

  /** Render { C: 'US', O: 'X', CN: 'Y' } → C=US, O=X, CN=Y */
  private kvToLine(obj: Record<string, any>): string {
    try {
      const pairs = Object.entries(obj).map(([k,v]) => `${k}=${v}`);
      return pairs.join(', ');
    } catch {
      return JSON.stringify(obj);
    }
  }


  // GEOIP

  geoip(command: string, executedCommands: typeCommand[], currentPathString: string,scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('geoip'), path: currentPathString });
      scrollDown();
      return;
    }

    const tokens = command.trim().split(/\s+/);
    if (!this.checkGeoipInput(command, executedCommands, currentPathString, scrollDown, tokens)) return;

    const { query, json } = this.parseGeoipArgs(tokens);

    executedCommands.push({ command, output: `GeoIP lookup for ${query}...\n\n`, path: currentPathString });
    const traceIndex = executedCommands.length - 1;
    this.isFetching = true;

    const url = this.buildGeoipUrl(query, json);

    this.http.get<any>(url).subscribe({
      next: (body) => {
        const out = json ? (JSON.stringify(body, null, 2) + '\n')
                         : this.formatGeoip(body);
        executedCommands[traceIndex].output += out;
        this.isFetching = false;
        scrollDown();
      },
      error: (err) => {
        executedCommands[traceIndex].output += `Error (geoip): ${err?.error?.error || err?.message || 'Unknown error'}\n`;
        this.isFetching = false;
        scrollDown();
      }
    });
  }

  private checkGeoipInput(command: string, executedCommands: typeCommand[], currentPathString: string,scrollDown: () => void,tokens: string[]): boolean {
    if (tokens.length < 2) {
      executedCommands.push({ command, output: 'geoip: usage error: IP or domain required', path: currentPathString });
      scrollDown();
      return false;
    }
    const q = tokens.slice(1).find(t => !t.startsWith('--'));
    if (!q) {
      executedCommands.push({ command, output: 'geoip: usage error: IP or domain required', path: currentPathString });
      scrollDown();
      return false;
    }
    return true;
  }

  private parseGeoipArgs(tokens: string[]): { query: string; json: boolean } {
    const json = tokens.includes('--json');
    const query = tokens.slice(1).find(t => !t.startsWith('--')) || '';
    return { query, json };
  }

  private buildGeoipUrl(query: string, json: boolean): string {
    const base = `https://proxy.lukasbusch.dev/geoip?query=${encodeURIComponent(query)}`;
    return json ? `${base}&raw=1` : base;
  }

  private formatGeoip(body: any): string {
    // if backend returned compact payload
    if (body?.location && body?.network) {
      const b = body;
      const L = b.location;
      const N = b.network;

      const lines: string[] = [];
      lines.push(`Query:\t\t${b.query}`);
      lines.push(`Country:\t${L.country} (${L.countryCode})`);
      if (L.regionName) lines.push(`Region:\t\t${L.regionName}${L.region ? ' (' + L.region + ')' : ''}`);
      if (L.city) lines.push(`City:\t\t${L.city}${L.zip ? ' ' + L.zip : ''}`);
      lines.push(`Coords:\t\t${this.utils.formatCoordinates(L.lat, L.lon)}`);
      if (L.timezone) lines.push(`Timezone:\t${L.timezone}${typeof L.offset === 'number' ? ` (UTC${this.formatOffset(L.offset)})` : ''}`);

      if (N.isp) lines.push(`ISP:\t\t${N.isp}`);
      if (N.org) lines.push(`Org:\t\t${N.org}`);
      if (N.as || N.asname) lines.push(`ASN:\t\t${N.as || ''}${N.as && N.asname ? ' ('+N.asname+')' : (N.asname || '')}`);
      if (N.reverse) lines.push(`Reverse:\t${N.reverse}`);
      lines.push(`Mobile:\t\t${N.mobile ? 'Yes' : 'No'}`);
      lines.push(`Proxy:\t\t${N.proxy ? 'Yes' : 'No'}`);
      lines.push(`Hosting:\t${N.hosting ? 'Yes' : 'No'}`);

      return lines.join('\n') + '\n';
    }

    // if backend returned raw ip-api payload (when --json omitted accidentally on raw)
    return JSON.stringify(body, null, 2) + '\n';
  }

  private formatOffset(seconds: number): string {
    // seconds east of UTC; ip-api uses seconds offset
    const sign = seconds >= 0 ? '+' : '-';
    const abs = Math.abs(seconds);
    const hh = String(Math.floor(abs / 3600)).padStart(2, '0');
    const mm = String(Math.floor((abs % 3600) / 60)).padStart(2, '0');
    return `${sign}${hh}:${mm}`;
  }


  // ASN (lightweight via /geoip)

  asn(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('asn'), path: currentPathString });
      scrollDown();
      return;
    }

    const tokens = command.trim().split(/\s+/);
    // require one non-flag arg
    const q = tokens.slice(1).find(t => !t.startsWith('--'));
    if (!q) {
      executedCommands.push({ command, output: 'asn: usage error: IP or domain required', path: currentPathString });
      scrollDown();
      return;
    }

    const rawJson = tokens.includes('--json'); // optional, just dump geoip payload

    executedCommands.push({ command, output: `ASN lookup for ${q}...\n\n`, path: currentPathString });
    const traceIndex = executedCommands.length - 1;
    this.isFetching = true;

    const url = `https://proxy.lukasbusch.dev/geoip?query=${encodeURIComponent(q)}${rawJson ? '&raw=1' : ''}`;

    this.http.get<any>(url).subscribe({
      next: (body) => {
        if (rawJson) {
          executedCommands[traceIndex].output += JSON.stringify(body, null, 2) + '\n';
        } else {
          const isCompact = body?.location && body?.network;
          const asStr   = isCompact ? (body.network.as || '') : (body.as || '');
          const asName  = isCompact ? (body.network.asname || '') : (body.asname || '');
          const isp     = isCompact ? (body.network.isp || '') : (body.isp || '');
          const org     = isCompact ? (body.network.org || '') : (body.org || '');
          const query   = isCompact ? (body.query || q) : (body.query || q);
          const country = isCompact ? (body.location?.country || '') : (body.country || '');

          const lines: string[] = [];
          lines.push(`Query:\t\t${query}`);
          if (asStr) lines.push(`AS:\t\t${asStr}`);      // e.g. "AS15169 Google LLC"
          if (asName) lines.push(`AS Name:\t${asName}`); // e.g. "GOOGLE"
          if (isp) lines.push(`ISP:\t\t${isp}`);
          if (org) lines.push(`Org:\t\t${org}`);
          if (country) lines.push(`Country:\t${country}`);

          if (!asStr && !asName && !isp && !org)
            lines.push('(no ASN/ISP data available)');

          executedCommands[traceIndex].output += lines.join('\n') + '\n';
        }

        this.isFetching = false;
        scrollDown();
      },
      error: (err) => {
        executedCommands[traceIndex].output += `Error (asn): ${err?.error?.error || err?.message || 'Unknown error'}\n`;
        this.isFetching = false;
        scrollDown();
      }
    });
  }


  // REVERSEIP

  reverseip(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('reverseip'), path: currentPathString });
      scrollDown();
      return;
    }

    const tokens = command.trim().split(/\s+/);
    const q = tokens.slice(1).find(t => !t.startsWith('--'));
    if (!q) {
      executedCommands.push({ command, output: 'reverseip: usage error: IP or domain required', path: currentPathString });
      scrollDown();
      return;
    }

    const wantJson = tokens.includes('--json');
    const wantAll  = tokens.includes('--all');

    executedCommands.push({ command, output: `Reverse DNS for ${q}...\n\n`, path: currentPathString });
    const traceIndex = executedCommands.length - 1;
    this.isFetching = true;

    const url = `https://proxy.lukasbusch.dev/reverseip?query=${encodeURIComponent(q)}${wantJson ? '&raw=1' : ''}${wantAll ? '&all=1' : ''}`;

    this.http.get<any>(url).subscribe({
      next: (body) => {
        const out = wantJson ? (JSON.stringify(body, null, 2) + '\n') : this.formatReverseIp(q, body);
        executedCommands[traceIndex].output += out;
        this.isFetching = false;
        scrollDown();
      },
      error: (err) => {
        executedCommands[traceIndex].output += `Error (reverseip): ${err?.error?.error || err?.message || 'Unknown error'}\n`;
        this.isFetching = false;
        scrollDown();
      }
    });
  }

  private formatReverseIp(input: string, body: any): string {
    const lines: string[] = [];
    if (body?.type === 'ip') {
      lines.push(`IP:\t\t${body.query}`);
      if (body.ptrName) lines.push(`PTR name:\t${body.ptrName}`);
      if (Array.isArray(body.ptr) && body.ptr.length) {
        lines.push(`Hostnames:\n  - ${body.ptr.join('\n  - ')}`);
      } else {
        lines.push('Hostnames:\t(none)');
      }
      return lines.join('\n') + '\n';
    }

    if (body?.type === 'domain' && Array.isArray(body.addresses)) {
      lines.push(`Domain:\t${body.query}`);
      if (!body.addresses.length) {
        lines.push('No A/AAAA records found.');
        return lines.join('\n') + '\n';
      }
      for (const a of body.addresses) {
        lines.push(`\nIP:\t\t${a.ip} (IPv${a.family || '?'})`);
        if (a.ptrName) lines.push(`PTR name:\t${a.ptrName}`);
        if (Array.isArray(a.ptr) && a.ptr.length) {
          lines.push(`Hostnames:\n  - ${a.ptr.join('\n  - ')}`);
        } else {
          lines.push('Hostnames:\t(none)');
        }
      }
      return lines.join('\n') + '\n';
    }

    return JSON.stringify(body, null, 2) + '\n';
  }


  // CIPHERS

  ciphers(command: string, executedCommands: typeCommand[], currentPathString: string,scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('ciphers'), path: currentPathString });
      scrollDown();
      return;
    }
    
    const tokens = command.trim().split(/\s+/);
    if (!this.checkCiphersInput(command, executedCommands, currentPathString, scrollDown, tokens)) return;

    const { domain, json, port } = this.parseCiphersArgs(tokens);

    executedCommands.push({ command, output: `TLS cipher/protocol for ${domain}${port !== 443 ? ':' + port : ''}...\n\n`, path: currentPathString });
    const traceIndex = executedCommands.length - 1;
    this.isFetching = true;

    const url = this.buildCiphersUrl(domain, port, json);

    this.http.get<any>(url).subscribe({
      next: (body) => {
        const out = json ? (JSON.stringify(body, null, 2) + '\n')
                         : this.formatCiphers(body);
        executedCommands[traceIndex].output += out;
        this.isFetching = false;
        scrollDown();
      },
      error: (err) => {
        executedCommands[traceIndex].output += `Error (ciphers): ${err?.error?.error || err?.message || 'Unknown error'}\n`;
        this.isFetching = false;
        scrollDown();
      }
    });
  }

  private checkCiphersInput(command: string,executedCommands: typeCommand[],currentPathString: string,scrollDown: () => void,tokens: string[]): boolean {
    if (tokens.length < 2) {
      executedCommands.push({ command, output: 'ciphers: usage error: Domain required', path: currentPathString });
      scrollDown();
      return false;
    }
    const d = tokens.slice(1).find(t => !t.startsWith('--') && !/^\d+$/.test(t));
    if (!d) {
      executedCommands.push({ command, output: 'ciphers: usage error: Domain required', path: currentPathString });
      scrollDown();
      return false;
    }
    return true;
  }

  private parseCiphersArgs(tokens: string[]): { domain: string; json: boolean; port: number } {
    const json = tokens.includes('--json');
    // Allow optional --port N
    const portFlagIdx = tokens.findIndex(t => t === '--port');
    let port = 443;
    if (portFlagIdx >= 0 && tokens[portFlagIdx + 1] && /^\d+$/.test(tokens[portFlagIdx + 1])) {
      port = parseInt(tokens[portFlagIdx + 1], 10);
    }
    // first non-flag token after command that isn't a number
    const domain = tokens.slice(1).find(t => !t.startsWith('--') && !/^\d+$/.test(t)) || '';
    return { domain, json, port };
  }

  private buildCiphersUrl(domain: string, port: number, json: boolean): string {
    const base = `https://proxy.lukasbusch.dev/ciphers?domain=${encodeURIComponent(domain)}&port=${port}`;
    return json ? `${base}&raw=1` : base;
  }

  private formatCiphers(body: any): string {
    const proto = body?.protocol || '—';
    const cipher = body?.cipher || '—';
    const std = body?.standardName ? ` (${body.standardName})` : '';
    const kxType = body?.ephemeralKey?.type || null;  // e.g., 'ECDH'
    const curve  = body?.ephemeralKey?.name || null;  // e.g., 'X25519'
    const bits   = body?.ephemeralKey?.size || null;  // e.g., 253
    const alpn   = body?.alpn || null;

    const parts: string[] = [];
    parts.push(`${proto}`);
    if (curve) {
      // Example: TLSv1.3 with X25519 and TLS_AES_128_GCM_SHA256
      parts.push(`with ${curve}`);
    } else if (kxType) {
      parts.push(`with ${kxType}`);
    }
    parts.push(`and ${cipher}${std}`);

    const line1 = parts.filter(Boolean).join(' ');
    const line2 = alpn ? `ALPN: ${alpn}` : '';

    const out = [line1, line2].filter(Boolean).join('\n');
    return out + '\n';
  }
  

  // TLS CHAIN
  
  tlschain(command: string, executedCommands: typeCommand[], currentPathString: string, scrollDown: () => void): void {
    if (this.utils.hasExplainFlag(command)) {
      executedCommands.push({ command, output: this.utils.renderExplain('tlschain'), path: currentPathString });
      scrollDown();
      return;
    }
    
    const { arg, rawFlag } = this.parseTlschainArgs(command);
    if (!arg) {
      executedCommands.push({ command, output: 'tlschain: usage error: DOMAIN required', path: currentPathString });
      scrollDown();
      return;
    }

    executedCommands.push({ command, output: `Fetching TLS chain for ${arg}...\n\n`, path: currentPathString });
    const idx = executedCommands.length - 1;
    this.isFetching = true;

    const url = `https://proxy.lukasbusch.dev/tlschain?domain=${encodeURIComponent(arg)}${rawFlag ? '&raw=1' : ''}`;

    this.http.get<any>(url).subscribe({
      next: (body) => {
        executedCommands[idx].output += rawFlag ? this.prettyJson(body) : this.formatTlschain(body);
        this.isFetching = false;
        scrollDown();
      },
      error: (err) => {
        executedCommands[idx].output += `Error (tlschain): ${err?.error?.error || err?.message || 'Unknown error'}\n`;
        this.isFetching = false;
        scrollDown();
      }
    });
  }

  private parseTlschainArgs(command: string): { arg: string | null, rawFlag: boolean } {
    const tokens = command.trim().split(/\s+/);
    const rawFlag = tokens.includes('--json');
    const arg = tokens.slice(1).find(t => !t.startsWith('--')) || null;
    return { arg, rawFlag };
  }

  private prettyJson(obj: any): string {
    try { return JSON.stringify(obj, null, 2) + '\n'; }
    catch { return String(obj) + '\n'; }
  }

  private formatTlschain(payload: any): string {
    // supports both { host, port, protocol, alpn, chain } or { summary: {...}, rawLeaf: {...} }
    const p = payload?.summary || payload || {};
    const lines: string[] = [];

    const host = p.host || '—';
    const port = p.port || 443;
    const proto = p.protocol || '—';
    const alpn  = p.alpn || '—';
    const depth = Array.isArray(p.chain) ? p.chain.length : 0;

    lines.push(`Host:\t\t${host}:${port}`);
    lines.push(`Protocol:\t${proto}`);
    lines.push(`ALPN:\t\t${alpn}`);
    lines.push(`Chain depth:\t${depth}`);

    const chain = Array.isArray(p.chain) ? p.chain : [];
    chain.forEach((c: any, i: number) => {
      const sub = c.subjectCN || c.subject?.CN || '—';
      const iss = c.issuerCN  || c.issuer?.CN  || '—';
      const from = c.valid_from ? this.isoish(c.valid_from) : '—';
      const to   = c.valid_to   ? this.isoish(c.valid_to)   : '—';

      lines.push('');
      lines.push(`[#${i}] Subject:\t${sub}`);
      lines.push(`    Issuer:\t${iss}`);
      if (Array.isArray(c.san) && c.san.length) {
        // keep it short if huge
        const preview = c.san.slice(0, 6).join(', ') + (c.san.length > 6 ? ` …(+${c.san.length - 6})` : '');
        lines.push(`    SAN:\t${preview}`);
      }
      lines.push(`    Valid:\t${from} → ${to}`);
      if (c.fingerprint256) lines.push(`    SHA256:\t${c.fingerprint256}`);
      if (c.pubkeyCurve)    lines.push(`    PubKey:\t${c.pubkeyCurve}`);
      lines.push(`    CA:\t\t${c.isCA ? 'yes' : 'no'}`);
    });

    lines.push('\nTip: use --json for full details.');
    return lines.join('\n') + '\n';
  }

  private isoish(s: string): string {
    // normalize OpenSSL-style dates such as "Sep  8 08:34:53 2025 GMT"
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      return d.toISOString().replace('T',' ').replace('Z',' UTC');
    }
    return s;
  }
}
