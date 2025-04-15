export type typeCommand = {
    command: string;
    output?: string | typeDirectory;
    path?: string;
    snapshot?: typeDirectory;
}

export type typeCommandList = {
    command: string;
    description: string;
}

export type typeCommandMap = {
    [key: string]: string;
}

export type typeDirectory<T = any> = {
    directory: string;
    data?: T;
    subdirectories?: typeDirectory<T>[];
}

export type typeDnsResponse = {
    Status: number;
    Answer: typeDnsResponseAnswer[];
}

export type typeDnsResponseAnswer = {
    TTL: number;
    data: string;
    name: string;
    type: number;
}