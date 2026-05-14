async function getFile(path) {
    try {
        let res = await fetch(path);
        res = await res.text();
        return res;
    } catch (error) { console.error(error);}
}

async function parseHtml(path) {
    let htmlText = await getFile(path);
    console.log(htmlText);
    // get all tags
    // regex := "<([a-zA-Z]{1,60})([^<>]+)>([^<>]+)<\/\1>"
}

(async () => {
    await parseHtml("./page.html");
})();