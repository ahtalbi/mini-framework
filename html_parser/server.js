import { HtmlTokenizer } from "./tokenizer.js";

async function getFile(path) {
    try {
        let res = await fetch(path);
        res = await res.text();
        return res;
    } catch (error) { console.error(error); }
}

async function parseHtml(path) {
    let htmlText = await getFile(path);
    console.log(htmlText);
    new HtmlTokenizer(htmlText)
}

(async () => {
    await parseHtml("./page.html");
})();