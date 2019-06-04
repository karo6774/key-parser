import {ParsedKey} from "../parsed-key";
import {KeySolver, solve} from "../key-solver";

export class ParsedAndKey implements ParsedKey
{
    public static make(data: any[]): ParsedAndKey
    {
        let keys = [data[0]].concat(data[2].map((val: any[]) => val[2]));
        return new ParsedAndKey(keys);
    }

    public solver: KeySolver = AndKeySolver;
    public readonly subKeys: ParsedKey[];

    public constructor(subKeys: ParsedKey[])
    {
        this.subKeys = subKeys;
    }
}

export function AndKeySolver(parsed: ParsedAndKey, input: string[]): boolean
{
    return parsed.subKeys.every(value => solve(value, input))
}
