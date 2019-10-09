const { openBrowser, goto, closeBrowser, textBox, focus, press, listItem, write, into, evaluate } = require('taiko');
import { fakeServer } from "./../infrastructure/fakeServer";
import { build, buildDir } from "./../infrastructure/build";
import { Server } from "http";
import anyTest, {TestInterface} from 'ava';
const test = anyTest as TestInterface<{server: Server}>;

test.before(async t => {
    await build(true);
    const app = fakeServer(buildDir);
    t.context = {
        server: app.listen(8081)
    }
});
test.beforeEach(async t => {
    await openBrowser();
    await goto("http://localhost:8081/check-some-boxes/");
});
test.serial("Pressing enter with no task text does nothing", async t => {
    await focus(textBox({id: "newTask"}));
    await press('Enter');
    const exists = await listItem().exists();
    t.is(exists, false);
});
test.serial("Pressing enter with white space task text does nothing", async t => {
    await write("       ", into(textBox({id:"newTask"})));
    await press('Enter');
    const exists = await listItem().exists();
    t.is(exists, false);
});
test.serial("Pressing enter with valid task text adds task", async t => {
    const expectedText = "task 1";
    await write(expectedText, into(textBox({id:"newTask"})));
    await press('Enter');
    const exists = await listItem().exists();
    const actualText = await listItem().text();
    t.is(exists, true);
    t.deepEqual(actualText, [expectedText]);
});
test.serial("Pressing enter with valid task text clears input", async t => {
    await write("task 1", into(textBox({id:"newTask"})));
    await press('Enter');
    const actualInputText = await textBox({id:"newTask"}).value();
    t.is(actualInputText, "");
});
test.serial("Pressing enter with white space task text keeps whitespace in input", async t => {
    const expectedText = "   ";
    await write(expectedText, into(textBox({id:"newTask"})));
    await press('Enter');
    const actualInputText = await textBox({id:"newTask"}).value();
    t.is(actualInputText, expectedText);
});
test.serial("Adding multiple tasks adds the correct number of tasks and in order", async t => {
    const expectedText = ["task 1", "task 2", "task 3"];
    await write(expectedText[0], into(textBox({id:"newTask"})));
    await press('Enter');
    await write(expectedText[1], into(textBox({id:"newTask"})));
    await press('Enter');
    await write(expectedText[2], into(textBox({id:"newTask"})));
    await press('Enter');
    const actualText = await listItem().text();
    t.deepEqual(actualText, expectedText);
});

test.afterEach(async t => {
    await closeBrowser();
});
test.after.always(async t => {
	t.context.server.close();
});