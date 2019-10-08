import { fakeServer } from "./../infrastructure/fakeServer";
import { build, buildDir } from "./../infrastructure/build";
(async () => {
    await build(false);
    const port = 8080;
    const app = fakeServer(buildDir);
    app.listen(port, () => console.log(`Server started.  goto: http://localhost:8080/check-some-boxes/`));
})()