"use strict";
let out = "";
let code = `
$a = 200;
$b = 33;
$c = 500;

if ($a > $b && $a < $c) {
    echo "Ambas condiciones son verdaderas";
} else {
    echo "Al menos una condición es falsa";
}
`;
let jsCode = code.replace(/echo\s+([^;]+);/g, 'Output.echo($1);');
const Output = { echo: (val) => { out += val; } };
try {
  eval(jsCode);
} catch (e) {
  out = "ERROR: " + e.message;
}
console.log("OUT:", out);
