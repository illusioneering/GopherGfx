export class StringParser
{
    private readonly tokens: string[][];
    private line: number;
    private token: number;

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

    peek(): string
    {
        return this.tokens[this.line][this.token];
    }
    
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

    consumeLine(): void
    {
        this.line++;
        this.token = 0;
    }

    done(): boolean
    {
        return this.line >= this.tokens.length;
    }

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


    readNumber(): number
    {
        return Number(this.readToken());
    }

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