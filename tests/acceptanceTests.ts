const { openBrowser, goto, closeBrowser, textBox, focus, press, listItem, write, into, text, click, button, toLeftOf, checkBox, toRightOf, below } = require('taiko');
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
test.serial("Page Renders", async t => {
    const actual = await text("Check Some Boxes!").exists();
    t.is(actual, true);
})
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
    const exists = await text("task 1", below(textBox({id:"newTask"}))).exists();
    t.is(exists, true);
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
    
    const task1 = await text("task 1", below(textBox({id:"newTask"}))).exists();
    const task2 = await text("task 2", below(textBox({id:"newTask"}))).exists();
    const task3 = await text("task 3", below(textBox({id:"newTask"}))).exists();
    t.is(task1, true);
    t.is(task2, true);
    t.is(task3, true);
});

test.serial("First item is removed properly", async t => {
    await write("task 1", into(textBox({id:"newTask"})));
    await press('Enter');
    await write("task 2", into(textBox({id:"newTask"})));
    await press('Enter');
    await write("task 3", into(textBox({id:"newTask"})));
    await press('Enter');

    await click(button(),toRightOf("task 1"));

    const task1 = await text("task 1", below(textBox({id:"newTask"}))).exists();
    const task2 = await text("task 2", below(textBox({id:"newTask"}))).exists();
    const task3 = await text("task 3", below(textBox({id:"newTask"}))).exists();
    t.is(task1, false);
    t.is(task2, true);
    t.is(task3, true);
});

test.serial("Second item is removed properly", async t => {
    await write("task 1", into(textBox({id:"newTask"})));
    await press('Enter');
    await write("task 2", into(textBox({id:"newTask"})));
    await press('Enter');
    await write("task 3", into(textBox({id:"newTask"})));
    await press('Enter');

    await click(button(),toRightOf("task 2"));

    const task1 = await text("task 1", below(textBox({id:"newTask"}))).exists();
    const task2 = await text("task 2", below(textBox({id:"newTask"}))).exists();
    const task3 = await text("task 3", below(textBox({id:"newTask"}))).exists();
    t.is(task1, true);
    t.is(task2, false);
    t.is(task3, true);
});

test.serial("Third item is removed properly", async t => {
    await write("task 1", into(textBox({id:"newTask"})));
    await press('Enter');
    await write("task 2", into(textBox({id:"newTask"})));
    await press('Enter');
    await write("task 3", into(textBox({id:"newTask"})));
    await press('Enter');

    await click(button(),toRightOf("task 3"));

    const task1 = await text("task 1", below(textBox({id:"newTask"}))).exists();
    const task2 = await text("task 2", below(textBox({id:"newTask"}))).exists();
    const task3 = await text("task 3", below(textBox({id:"newTask"}))).exists();
    t.is(task1, true);
    t.is(task2, true);
    t.is(task3, false);
});

test.serial("Task status can be updated", async t => {
    await write("task 1", into(textBox({id:"newTask"})));
    await press('Enter');

    await checkBox(toLeftOf("task 1")).check();

    const checked = await checkBox(toLeftOf("task 1")).isChecked();
    
    await checkBox(toLeftOf("task 1")).uncheck();

    const unchecked = await checkBox(toLeftOf("task 1")).isChecked();

    t.is(checked, true);
    t.is(unchecked, false);
})

test.afterEach(async t => {
    await closeBrowser();
});
test.after(async t => {
	t.context.server.close();
});