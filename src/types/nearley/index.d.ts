export class Parser
{
    /**
     * @param parserRules {@link ParsedGrammar.ParserRules}
     * @param parserStart {@link ParsedGrammar.ParserStart}
     * @param options
     */
    constructor(parserRules: any, parserStart: string, options?: ParserOptions);

    /**
     * @throws Error
     */
    feed(data: string): this;

    save(): Column;

    restore(state: Column): void;

    results: any[];
}

export class Column
{
    constructor(grammar: any, index: number);
}

export interface ParserOptions
{
    /**
     * @default false
     */
    keepHistory?: boolean;
}

/**
 * Imported from the output file of 'nearleyc'
 */
export interface ParsedGrammar
{
    ParserRules: ParserRule[];
    ParserStart: string;
}

export interface ParserRule
{
    name: string;
    symbols: string[];
    postprocess?(data: any[]): any;
}
