export class StringParser
{
    private readonly tokens: string[][];
    private line: number;
    private token: number;

/**
 * Constructs a StringParser object from the given data string
 * 
 * @param data - The string to be parsed
 */
    constructor(data: string)
    {
        this.tokens = [];
        this.line = 0;
        this.token = 0;

        // Trim whitespace from each line
        const lines = data.split('\n');
        for(let i=0; i < lines.length; i++)
        {
            this.tokens.push(lines[i].trim().split(/\s+/));
        }

        // Remove empty strings
        for(let i=0; i < this.tokens.length; i++)
        {
            if(this.tokens[i].length == 1 && this.tokens[i][0] == '')
            {
                this.tokens.splice(i, 1);
                i--;
            }
        }
    }


/**
 * Checks the next token in the string without consuming it
 * 
 * @returns The next token in the string
 */
    peek(): string
    {
        return this.tokens[this.line][this.token];
    }

/**
 * Consumes the current token if it matches the expected token
 * 
 * @param token - The expected token
 * @returns True if the current token matches the expected token and was consumed, false otherwise
 */    
    expect(token: string): boolean
    {
        if(this.peek() == token)
        {
            this.readToken();
            return true;
        }
        else
        {
            return false;
        }
    }

/**
 * Consumes the current line
 */    
    consumeLine(): void
    {
        this.line++;
        this.token = 0;
    }

/**
 * Checks if the parser has reached the end of the string
 * 
 * @returns True if the parser has reached the end of the string, false otherwise
 */
    done(): boolean
    {
        return this.line >= this.tokens.length;
    }

/**
 * Reads and consumes the next token in the string
 * 
 * @returns The next token in the string
 */
    readToken(): string
    {
        const nextToken = this.tokens[this.line][this.token];
        this.token++;

        if(this.token >= this.tokens[this.line].length)
        {
            this.line++;
            this.token = 0;
        }

        return nextToken;
    }

/**
 * Reads and consumes the next token in the string as a number
 * 
 * @returns The next token in the string as a number
 */
    readNumber(): number
    {
        return Number(this.readToken());
    }

/**
 * Reads and consumes the rest of the current line
 * 
 * @returns The rest of the current line as an array of strings
 */
    readLine(): string[]
    {
        const nextLine = [];
        for(let i=this.token; i < this.tokens[this.line].length; i++)
        {
            nextLine.push(this.tokens[this.line][i]);
        }

        this.line++;
        this.token = 0;

        return nextLine;
    }
}