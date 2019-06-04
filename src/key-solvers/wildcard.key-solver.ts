import {ParsedKey} from "../parsed-key";
import {intersection} from "lodash";
import {KeyGroup} from "../key-group";

export class ParsedWildcardKey implements ParsedKey
{
    private allowUnknown: boolean;
    private recognized: string[];

    public constructor(allowUnknown: boolean, ...keys: string[])
    {
        this.allowUnknown = allowUnknown;
        this.recognized = keys;
    }

    public solver(key: this, input: string[]): boolean
    {
        return this.allowUnknown || intersection(this.recognized, input).length > 0;
    }
}

export class WildcardKeyGroup implements KeyGroup
{
    private readonly token: string;
    private readonly allowUnknown: boolean;
    private readonly recognized: string[];

    public constructor(options: { allowUnknown: boolean, recognized?: string[], token?: string })
    {
        this.allowUnknown = options.allowUnknown;
        this.recognized = options.recognized || [];
        this.token = options.token || '*';
    }

    public predicate(key: string): boolean
    {
        return key === this.token;
    }

    public parser(key: string): ParsedWildcardKey
    {
        return new ParsedWildcardKey(this.allowUnknown, ...this.recognized);
    }
}
