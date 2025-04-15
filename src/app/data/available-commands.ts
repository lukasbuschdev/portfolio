import { typeCommandList } from "../types/types";

export const AVAILABLE_COMMANDS: typeCommandList[] = [
    {
      command: 'help',
      description: "Shows all avaiable commands"
    }, 
    {
      command: 'clear',
      description: "Clears the console"
    }, 
    {
      command: 'whoami',
      description: "Outputs current user"
    }, 
    {
      command: 'ipconfig',
      description: "Outsputs current public IP address"
    },
    {
      command: 'cd',
      description: "Changes directory"
    },
    {
      command: 'ls',
      description: "Outputs list of all files and folders in current directory"
    },
    {
      command: 'curl',
      description: "Curls an url or IP address"
    },
    {
      command: 'ping',
      description: "Pings an url or IP address"
    },
];