import * as _ from "lodash";
import * as Grammar from "./key-parser.grammar";
import {Parser, ParserRule} from "nearley";
import {ParsedKey} from "./parsed-key";
import {ParsedLiteralKey} from "./key-solvers";
import {KeyGroup} from "./key-group";
import {CompiledKeyParser} from "./compiled-key-parser";

export class KeyParser
{
    private keyGroups: KeyGroup[] = [];

    public constructor()
    {
    }

    public hasKey(keys: string, input: string): boolean
    {
        return this.compile(keys).has(input);
    }

    public hasAll(keys: string, ...input: string[]): boolean
    {
        return this.compile(keys).all(...input);
    }

    public hasSome(keys: string, ...input: string[]): boolean
    {
        return this.compile(keys).some(...input);
    }

    public addKeyGroup(group: KeyGroup): this
    {
        this.keyGroups.push(group);
        return this;
    }

    public compile(keys: string): CompiledKeyParser
    {
        return new CompiledKeyParser(this.parseKeys(keys));
    }

    private parseKeys(keys: string): ParsedKey
    {
        let grammar = this.prepareGrammar();
        let parser = new Parser(grammar.ParserRules, grammar.ParserStart);
        return _.last(parser.feed(keys).results) as ParsedKey;
    }

    private prepareGrammar(): typeof Grammar
    {
        let grammar = _.cloneDeep(Grammar);

        // inject custom post-process function for parsing individual keys
        let key = _.find(grammar.ParserRules, {name: "key"}) as ParserRule | undefined;
        if (key) key.postprocess = d => this.parseKey(d[0]);

        return grammar;
    }

    private parseKey(key: string): ParsedKey
    {
        let group = this.matchKeyGroup(key);
        if (!_.isNil(group)) return group.parser(key);
        else return new ParsedLiteralKey(key);
    }

    private matchKeyGroup(key: string): KeyGroup | undefined
    {
        return _.find(this.keyGroups, group => group.predicate(key));
    }
}
