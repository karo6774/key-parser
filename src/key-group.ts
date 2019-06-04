import {ParsedKey} from "./parsed-key";

export interface KeyGroup
{
    predicate(key: string): boolean;
    parser(key: string): ParsedKey;
}
