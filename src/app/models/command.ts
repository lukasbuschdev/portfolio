import { typeCommand } from "../types/types";

export class Command {
    command: string;
    output: string;

    constructor(data: typeCommand) {
        this.command = data.command;
        this.output = data.output; 
    }
}