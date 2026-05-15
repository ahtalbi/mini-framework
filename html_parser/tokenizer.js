export class HtmlTokenizer {
    constructor(input) {
        this.value = input;
        this.pos = 0;
        this.tokens = [];
        this.extractTokens();
    }

    isAlphaNumeric(ch) {
        const code = ch.charCodeAt(0);
        return (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || (code >= 48 && code <= 57);
    }

    // check if this tag is open or self
    extractTokens() {
        // get all tags
        // regex := "<([a-zA-Z]{1,60})([^<>]+)>([^<>]+)<\/\1>"

        // let token = {
        //     "Opening_Tag": "form",
        //     "Attribute": {"id": "todo_form"},
        //     "Self_Closed_Tag": "input",
        //     "Attribute": {"type": "text"},
        //     "Attribute": {"placeholder": "Create your todo here ..."},
        //     "Closing_Tag": "form",
        // }

        // <form id="todo_form">
        //     <input type="text" placeholder="Create your todo here ...">
        // </form>

        while (this.pos < this.value.length) {
            if (this.value[this.pos] === " ") { this.pos++; continue; }

            // this part is to get the Opening_tags
            if (this.value[this.pos] === "<" && this.value[this.pos + 1] !== "/") {
                // get the opening
                this.pos++;
                let last_position = this.pos;
                let word = "";
                while (this.isAlphaNumeric(this.value[this.pos])) {
                    word += this.value[this.pos];
                    this.pos++;
                }
                if (last_position !== this.pos) this.tokens.push({ type: "OPENING_TAG", value: word });

                if (this.value[this.pos] === " ") { this.pos++; }

                // get the attributes
                let Attrs = "";
                last_position = this.pos;
                while (this.value[this.pos] !== ">") {
                    Attrs += this.value[this.pos];
                    this.pos++;
                }
                
                let match;
                if (last_position !== this.pos) {
                    let regex = /([a-z]+)="([^"]*)"/g
                    while ((match = regex.exec(Attrs)) !== null) {
                        this.tokens.push({ type: "ATTR-TAG", value: {type: match[1], value: match[2]} });
                    }
                    console.log(Attrs);
                };
            }

            // this part is to get the Closing_tags
            if (this.value[this.pos] === "<" && this.value[this.pos + 1] === "/") {
                this.pos += 2;
                let last_position = this.pos;
                let word = "";
                while (this.isAlphaNumeric(this.value[this.pos])) {
                    word += this.value[this.pos];
                    this.pos++;
                }
                if (last_position !== this.pos) this.tokens.push({ type: "CLOSING_TAG", value: word });
            }

            this.pos++;
        }

        console.log(this.tokens);
    }
}