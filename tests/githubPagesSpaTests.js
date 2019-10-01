import test from "ava";
const { openBrowser, goto, closeBrowser, currentURL } = require('taiko');
const Bundler = require('parcel-bundler');

test.before(async t => {
    const server = await new Bundler(["./src/index.html", "./src/404.html"], {publicUrl: "/check-some-boxes/", outDir: "./tests/dist"}).serve();
    t.context = {
        server: server
    }
    await openBrowser();
})

test.serial("404 performs redirect", async t => {
    await goto("http://localhost:1234/check-some-boxes/404.html");
    const url = await currentURL();
    t.is(url, "http://localhost:1234/check-some-boxes/?p=/404.html");
})

test.serial("index performs redirect", async t => {
    await goto("http://localhost:1234/check-some-boxes/index.html?p=/one/two&q=a=b~and~c=d#qwe");
    const url = await currentURL();
    t.is(url, "http://localhost:1234/check-some-boxes/index.htm/one/two?a=b&c=d#qwe");
})

test.after.always(async t => {
    await closeBrowser();
	t.context.server.close();
});