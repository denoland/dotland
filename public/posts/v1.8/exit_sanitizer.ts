Deno.test({
  name: "false success",
  fn() {
    Deno.exit(0);
  },
  sanitizeExit: false,
});

// This test is never run
Deno.test({
  name: "failing test",
  fn() {
    throw new Error("this test fails");
  },
});
