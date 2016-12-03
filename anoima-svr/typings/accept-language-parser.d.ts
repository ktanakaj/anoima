// Type definitions for accept-language-parser

interface IParserResult {
	code: string,
	script: string,
	region: string,
	quality: number,
}

declare module "accept-language-parser" {
    export function parse(al: string): Array<IParserResult>;
}
