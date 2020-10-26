// How to run:
// deno run https://deno.land/posts/v1.5/alert_confirm_prompt.js

let name = "";

while (true) {
  name = prompt("What is your name?");

  if (confirm(`Are you sure ${name} is your name?`)) {
    break;
  }
}

alert(`Hello ${name}!`);
