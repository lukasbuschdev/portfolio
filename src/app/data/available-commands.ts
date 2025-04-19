import { typeCommandList } from "../types/types";

export const AVAILABLE_COMMANDS: typeCommandList[] = [
  {
    command: "help",
    description: "Displays a list of all available commands along with a brief description for each one"
  },
  {
    command: "exit",
    description: "Closes console and navigates back to portfolio page https://lukasbusch.dev/main"
  },
  {
    command: "clear",
    description: "Clears the terminal screen and scrollback buffer"
  },
  {
    command: "pwd",
    description: "Prints the path of the working directory"
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
    command: "whoami",
    description: "Outputs the current user or session identifier, revealing who is logged into the terminal"
  },
  {
    command: "uname",
    description: "Displays system info: browser userAgent, platform, language, screen resolution, etc."
  },
  {
    command: "cat",
    description: "Displays file content of the selected file"
  },
  {
    command: "nano",
    description: "Simple, modeless WYSIWYG (What You See Is What You Get) command-line text editor for creating or editing the specified text file (.txt)"
  },
  {
    command: "touch",
    description: "Creates one or multiple new text files (must include extension '.txt')"
  },
  {
    command: "mkdir",
    description: "Creates one or multiple new directories"
  },
  {
    command: "rmdir",
    description: "Removes one or multiple empty directories"
  },
  {
    command: "rm",
    description: "Removes one or multiple files from current directory"
  },
  {
    command: "echo",
    description: "Writes the given text"
  },
  {
    command: "date",
    description: "Displays the current date and time"
  },
  {
    command: "uptime",
    description: "Shows the current time and how long the session has been running (dd hh:mm:ss), followed by the user count and system load averages for the past 1, 5, and 15 minutes"
  },
  {
    command: "history",
    description: "Displays the list of all commands executed during the current terminal session"
  },
  {
    command: "ipaddr",
    description: "Displays your current public IP address as reported by an external service"
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
    command: "traceroute",
    description: "Displays the network path and latency to a specified destination"
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
    command: "weather",
    description: "Fetches and displays current weather details for the specified city—including temperature, humidity, pressure, wind speed, visibility (in meters), and local sunrise/sunset times."
  }
];