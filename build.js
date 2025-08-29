
const fs = require("fs");
const path = require("path");

const readdirRec = dirPath => fs.readdirSync(dirPath)
    .map(fileName => {
        const filePath = path.join(dirPath, fileName);
        const fileInfo = fs.statSync(filePath);
        if(!fileInfo.isDirectory()) { return [filePath]; }
        return readdirRec(filePath);
    })
    .reduce((a, b) => [...a, ...b], []);

const commentFile = filePath => fs.readFileSync(filePath, "utf8")
    .trim()
    .split("\n")
    .map(line => "// " + line)
    .join("\n")

const readSources = dirPath => readdirRec(dirPath)
    .map(filePath => fs.readFileSync(filePath, "utf8"))
    .join("\n");

const sources = commentFile("LICENSE")
    + "\n" 
    + readSources("src");

fs.writeFileSync("shuen.js", sources, "utf8");