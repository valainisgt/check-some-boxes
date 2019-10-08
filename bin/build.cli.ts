import { build } from "./../infrastructure/build";

const optimize = !!process.argv[2] || false;
(async () => {
    await build(optimize);
})();