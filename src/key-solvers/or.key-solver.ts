import {ParsedKey} from "../parsed-key";
import {KeySolver, solve} from "../key-solver";

export class ParsedOrKey implements ParsedKey
{
    public static make(data: any[]): ParsedOrKey
    {
        let keys = [data[0]].concat(data[2].map((val: any[]) => val[2]));
        return new ParsedOrKey(keys);
    }

    public solver: KeySolver = OrKeySolver;
    public readonly subKeys: ParsedKey[];

    public constructor(subKeys: ParsedKey[])
    {
        this.subKeys = subKeys;
    }
}

export function OrKeySolver(parsed: ParsedOrKey, input: string[]): boolean
{
    return parsed.subKeys.some(value => solve(value, input));
}
