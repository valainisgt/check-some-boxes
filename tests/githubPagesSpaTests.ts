const { openBrowser, goto, closeBrowser, text } = require('taiko');
import { fakeServer } from "./../infrastructure/fakeServer";
import { build, buildDir } from "./../infrastructure/build";
import { Server } from "http";
import anyTest, {TestInterface} from 'ava';
const test = anyTest as TestInterface<{server: Server}>;

test.before(async t => {
    await build(true);
    const app = fakeServer(buildDir);
    t.context = {
        server: app.listen(8080)
    }
    await openBrowser();
})

test.serial("Page says hello world", async t => {
    await goto("http://localhost:8080/check-some-boxes/");
    const actual = await text("hello world!").exists();
    t.is(actual, true);
})

test.after.always(async t => {
    await closeBrowser();
	t.context.server.close();
});