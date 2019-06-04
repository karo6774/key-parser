import {KeySolver} from "./key-solver";

export interface ParsedKey
{
    [key: string]: any;

    solver: KeySolver;
}
