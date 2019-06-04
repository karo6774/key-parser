import {ParsedKey} from "./parsed-key";
import {solve} from "./key-solver";

export class CompiledKeyParser
{
    private readonly key: ParsedKey;

    public constructor(parsed: ParsedKey)
    {
        this.key = parsed;
    }

    public has(input: string): boolean
    {
        return this.all(input);
    }

    public all(...input: string[]): boolean
    {
        return solve(this.key, input);
    }

    public some(...input: string[]): boolean
    {
        return input.some(key => this.has(key));
    }
}
