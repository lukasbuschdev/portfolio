import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  generateRandomId(): number {
    return Math.floor(Math.random() * (70000 - 30000)) + 30000;
  }

  formatTimestamp(date: Date): string {
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  
    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    
    const pad = (num: number): string => num.toString().padStart(2, '0');
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
  
    let timezone = 'GMT';
    const tzMatch = date.toString().match(/\(([^)]+)\)$/);
    if(tzMatch && tzMatch[1]) {
      timezone = tzMatch[1].split(' ').map(word => word[0]).join('');
    } else {
      timezone = date.toTimeString().split(' ')[0];
    }
  
    return `${dayOfWeek} ${month} ${day} ${hours}:${minutes}:${seconds} ${timezone} ${year}`;
  }

  formatTime(timestamp: number, timezoneOffset: number): string {
    const localDate = new Date((timestamp + timezoneOffset) * 1000);
    const hours = localDate.getUTCHours().toString();
    const minutes = localDate.getUTCMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  formatCoordinates(lat: number, lon: number): string {
    const latDirection = lat >= 0 ? 'N' : 'S';
    const lonDirection = lon >= 0 ? 'E' : 'W';

    const absLat = Math.abs(lat).toFixed(4);
    const absLon = Math.abs(lon).toFixed(4);
  
    return `${absLat}° ${latDirection}, ${absLon}° ${lonDirection}`;
  }
}
