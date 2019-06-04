import {ParsedKey} from "./parsed-key";

export interface KeySolver
{
    (key: ParsedKey, input: string[]): boolean;
}

export function solve(key: ParsedKey, input: string[]): boolean
{
    return key.solver(key, input);
}
