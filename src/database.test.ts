import DATABASE from "./database.json";

test("a database entry of type github should have a owner and repo", () => {
  for (const key in DATABASE) {
    const entry = DATABASE[key];
    if (entry.type == "github") {
      expect(entry.owner).toBeTruthy();
      expect(entry.repo).toBeTruthy();
    }
  }
});

test("a database entry should never have a path starting with /", () => {
  for (const key in DATABASE) {
    const entry = DATABASE[key];
    if (entry.path) {
      expect(entry.path[0]).not.toBe("/");
    }
  }
});

test("database names with dashes are not allowed", () => {
  for (let key in DATABASE) {
    expect(key.indexOf("-") < 0);
  }
});
