import { fakeServer } from "./../infrastructure/fakeServer";
(async () => {
    const port = 8080;
    const app = await fakeServer(false);
    app.listen(port, () => console.log(`Server started.  goto: http://localhost:8080/check-some-boxes/`));
})()