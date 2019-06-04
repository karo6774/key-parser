import * as _ from "lodash";
import {ParsedKey} from "../parsed-key";
import {KeySolver} from "../key-solver";

export class ParsedLiteralKey implements ParsedKey
{
    public static make(data: any[]): ParsedLiteralKey
    {
        return new ParsedLiteralKey(data[0]);
    }

    public solver: KeySolver = LiteralKeySolver;
    public readonly key: string;

    public constructor(key: string)
    {
        this.key = key;
    }
}

export function LiteralKeySolver(parsed: ParsedLiteralKey, input: string[]): boolean
{
    return _.includes(input, parsed.key);
}