
import { generate } from "shortid";
const compileToString = require("node-elm-compiler").compileToString;
import path from "path";
import { minify } from "uglify-js";
import fs from "fs";
import { compileFile } from "pug";
const rmdirSync = require("fs").rmdirSync;

export const buildDir = path.join(__dirname, "..", "build");

export const build = async (optimize: boolean) => {
    const hash = generate();
    let elm = await compileToString(path.join(__dirname, "..", "src", "Main.elm"), { optimize, pathToElm: path.join(__dirname, "..", "node_modules", "elm", "bin", "elm")});
    if(optimize){
        const compress = minify(elm, {
            compress: {
                pure_funcs: ["F2","F3","F4","F5","F6","F7","F8","F9","A2","A3","A4","A5","A6","A7","A8","A9"],
                pure_getters: true,
                keep_fargs: false,
                unsafe_comps: true,
                unsafe: true
            },
            mangle: false
        });
        const mangle = minify(compress.code, { compress: false });
        elm = mangle.code;
    }
    if(fs.existsSync(buildDir)){
        rmdirSync(buildDir, { recursive: true });
    }
    fs.mkdirSync(buildDir);
    fs.writeFileSync(path.join(buildDir, `app.${hash}.js`), elm);
    fs.copyFileSync(path.join(__dirname, "..", "src", "index.js"), path.join(buildDir, `index.${hash}.js`));
    fs.copyFileSync(path.join(__dirname, "..", "src", "404.html"), path.join(buildDir, "404.html"));

    const fnIndex = compileFile(path.join(__dirname, "..", "src", "index.pug"), { pretty: true });
    fs.writeFileSync(path.join(buildDir, "index.html"), fnIndex({ hash }));
};