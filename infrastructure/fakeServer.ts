import express, { Application } from "express";
import { build, buildDir } from "./build";
import path from "path";

export const fakeServer = async (optimize: boolean) => {
    await build(optimize);

    const app: Application = express();

    app.use("/check-some-boxes", express.static(buildDir));
    
    app.get("/check-some-boxes/", (_,res) => {
        res.sendFile(path.join(buildDir, "index.html"));
    });

    app.get("/check-some-boxes/*", (_,res) => {
        res.sendFile(path.join(buildDir, "404.html"));
    });

    return app;
}