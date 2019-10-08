import express, { Application } from "express";
import path from "path";
import fs from "fs";

export const fakeServer = (assetsDir: string) => {

    if(!fs.existsSync(assetsDir)){ throw `Invalid Directory ${assetsDir}`; }

    const app: Application = express();

    app.use("/check-some-boxes", express.static(assetsDir));
    
    app.get("/check-some-boxes/", (_,res) => {
        res.sendFile(path.join(assetsDir, "index.html"));
    });

    app.get("/check-some-boxes/*", (_,res) => {
        res.sendFile(path.join(assetsDir, "404.html"));
    });

    return app;
}