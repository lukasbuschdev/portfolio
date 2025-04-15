import { typeCommandList } from "../types/types";

export const AVAILABLE_COMMANDS: typeCommandList[] = [
  {
    command: "help",
    description: "Displays a list of all available commands along with a brief description for each one"
  },
  {
    command: "clear",
    description: "Clears the terminal display to provide a fresh, uncluttered screen"
  },
  {
    command: "whoami",
    description: "Outputs the current user or session identifier, revealing who is logged into the terminal"
  },
  {
    command: "ipaddr",
    description: "Displays your current public IP address as reported by an external service"
  },
  {
    command: "cd",
    description: "Changes the current working directory to the specified target directory"
  },
  {
    command: "ls",
    description: "Lists all files and folders contained within the current directory"
  },
  {
    command: "exit",
    description: "Closes console and navigates back to portfolio page https://lukasbusch.dev"
  },
  {
    command: "curl",
    description: "Fetches data from a specified URL or IP address using the HTTP/HTTPS protocol"
  },
  {
    command: "ping",
    description: "Sends repeated network requests to a host to measure latency and network connectivity"
  },
  {
    command: "dig",
    description: "Performs a DNS lookup and returns detailed information about the DNS response, including record types and header data"
  },
  {
    command: "nslookup",
    description: "Queries DNS servers to resolve a domain name into its associated IP addresses and other DNS details"
  },
  {
    command: "history",
    description: "Displays the list of all commands executed during the current terminal session"
  }
];