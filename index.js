import router from "./router/index.js";
import ui from "./ui/index.js";

ui();
router();

let unusedVariable;
console.log("Hello world"); // Mangler semikolon her, hvis det kreves
eval("console.log('This is bad practice')");
