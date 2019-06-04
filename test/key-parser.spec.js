const
    Mocha = require("mocha"),
    chai = require("chai"),
    expect = chai.expect,
    KeyParser = require("../lib/key-parser").KeyParser,
    CompiledKeyParser = require("../lib/compiled-key-parser").CompiledKeyParser,
    ParsedWildcardKey = require("../lib/key-solvers").ParsedWildcardKey,
    WildcardKeyGroup = require("../lib/key-solvers").WildcardKeyGroup,
    includes = require("lodash").includes
;

chai.should();

describe("KeyParser", () =>
{
    describe("#hasKey", () =>
    {
        it("should match a or ',' sequence", async () =>
        {
            let keys = "string,number!object";
            let parser = new KeyParser();

            expect(parser.hasKey(keys, "string")).to.be.true;
            expect(parser.hasKey(keys, "number")).to.be.true;
            expect(parser.hasKey(keys, "object")).to.be.false;
            expect(parser.hasKey(keys, "unknown")).to.be.false;
        });

        it("should match with parenthesis", async () =>
        {
            let keys = "string,(object,array)!number";
            let parser = new KeyParser();

            expect(parser.hasKey(keys, "string")).to.be.true;
            expect(parser.hasKey(keys, "object")).to.be.true;
            expect(parser.hasKey(keys, "array")).to.be.true;
            expect(parser.hasKey(keys, "number")).to.be.false;
            expect(parser.hasKey(keys, "unknown")).to.be.false;
        });

        it("should support '&' operator", async () =>
        {
            let keys = "thing1,thing2&(thing3,thing4),thing5!thing6&thing1,thing7";
            let parser = new KeyParser();

            expect(parser.hasKey(keys, "thing1")).to.be.true;
            expect(parser.hasKey(keys, "thing2")).to.be.false;
            expect(parser.hasKey(keys, "thing3")).to.be.false;
            expect(parser.hasKey(keys, "thing4")).to.be.false;
            expect(parser.hasKey(keys, "thing5")).to.be.true;
            expect(parser.hasKey(keys, "thing6")).to.be.false;
            expect(parser.hasKey(keys, "thing7")).to.be.false;
        });
    });

    describe("#hasAll", () =>
    {
        it("should return false if one or more keys are rejected", async () =>
        {
            let keys = "string,number!object";
            let parser = new KeyParser();

            expect(parser.hasAll(keys, "string", "number")).to.be.true;
            expect(parser.hasAll(keys, "string", "object")).to.be.false;
            expect(parser.hasAll(keys, "unknown", "object")).to.be.false;
            expect(parser.hasAll(keys, "unknown1", "unknown2")).to.be.false;
        });
    });

    describe("#hasSome", () =>
    {
        it("should return true if one or more keys are matched", async () =>
        {
            let keys = "string,number!object";
            let parser = new KeyParser();

            expect(parser.hasSome(keys, "string", "number")).to.be.true;
            expect(parser.hasSome(keys, "string", "object")).to.be.true;
            expect(parser.hasSome(keys, "object", "string")).to.be.true;
            expect(parser.hasSome(keys, "string", "unknown")).to.be.true;
            expect(parser.hasSome(keys, "object", "unknown")).to.be.false;
            expect(parser.hasSome(keys, "unknown1", "unknown2")).to.be.false;
        });
    });

    describe("#addKeyGroup", () =>
    {
        it("should add a key group and match it", async () =>
        {
            let keys = "collection";
            let parser = new KeyParser();

            parser.addKeyGroup(
                {
                    predicate: key => key === "collection",
                    parser: key => (
                        {
                            solver: (parsed, input) => includes(input, "array") || includes(input, "object")
                        }
                    )
                }
            );

            expect(parser.hasKey(keys, "array")).to.be.true;
            expect(parser.hasKey(keys, "object")).to.be.true;
            expect(parser.hasKey(keys, "collection")).to.be.false; // make sure it's not parsed as a literal key
            expect(parser.hasKey(keys, "number")).to.be.false;

            let altKeys = "collection!array";

            expect(parser.hasKey(altKeys, "array")).to.be.false; // prioritize disallowed keys
            expect(parser.hasKey(altKeys, "object")).to.be.true;
            expect(parser.hasKey(altKeys, "collection")).to.be.false;
            expect(parser.hasKey(altKeys, "number")).to.be.false;
        });
    });

    describe("#compile", () =>
    {
        it("should compile the 'keys' argument, and return a CompiledKeyParser", async () =>
        {
            let keys = "string,number!object,array";
            let parser = new KeyParser().compile(keys);

            expect(parser instanceof CompiledKeyParser).to.be.true;

            expect(parser.has("string")).to.be.true;
            expect(parser.has("number")).to.be.true;
            expect(parser.has("object")).to.be.false;
            expect(parser.has("array")).to.be.false;

            expect(parser.some("string", "number")).to.be.true;
            expect(parser.some("string", "object")).to.be.true;
            expect(parser.some("object", "array")).to.be.false;

            expect(parser.all("string", "number")).to.be.true;
            expect(parser.all("string", "object")).to.be.false;
            expect(parser.all("object", "array")).to.be.false;
        });
    });
});

describe("Wildcard", () =>
{
    it("should match any key with 'allowUnknown' is true", async () =>
    {
        let keys = "*!string";
        let parser = new KeyParser();
        parser.addKeyGroup({predicate: key => key === '*', parser: () => new ParsedWildcardKey(true)});

        expect(parser.hasKey(keys, "number")).to.be.true;
        expect(parser.hasKey(keys, "unknown")).to.be.true;
        expect(parser.hasKey(keys, "string")).to.be.false;
    });

    it("should only match keys when added and 'allowUnknown' is false", async () =>
    {
        let keys = "*!string";
        let parser = new KeyParser();
        parser.addKeyGroup({predicate: key => key === '*', parser: () => new ParsedWildcardKey(false, "number")});

        expect(parser.hasKey(keys, "number")).to.be.true;
        expect(parser.hasKey(keys, "unknown")).to.be.false;
        expect(parser.hasKey(keys, "string")).to.be.false;
    });

    it("should expose a 'WildcardKeyGroup' constructor", async () =>
    {
        let keys = "wild!string";
        let parser = new KeyParser();
        parser.addKeyGroup(new WildcardKeyGroup({allowUnknown: true, token: "wild"}));

        expect(parser.hasKey(keys, "number")).to.be.true;
        expect(parser.hasKey(keys, "unknown")).to.be.true;
        expect(parser.hasKey(keys, "string")).to.be.false;
    })
});
