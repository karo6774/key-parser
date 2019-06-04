import {ParsedKey} from "../parsed-key";
import {KeySolver, solve} from "../key-solver";

export class ParsedBlockKey implements ParsedKey
{
    public static make(data: any[]): ParsedBlockKey
    {
        return new ParsedBlockKey(data[0], data[4]);
    }

    public solver: KeySolver = BlockKeySolver;
    public readonly allowed: ParsedKey;
    public readonly disallowed: ParsedKey;

    public constructor(allow: ParsedKey, disallow: ParsedKey)
    {
        this.allowed = allow;
        this.disallowed = disallow;
    }
}

export function BlockKeySolver(key: ParsedBlockKey, input: string[]): boolean
{
    if (solve(key.disallowed, input))
        return false;
    return solve(key.allowed, input);
}
