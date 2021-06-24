/* eslint-env jest */
import React from "react";

import Org from "./Org";

function getHTML(elt: React.ReactElement | null) {
  if (elt) {
    return elt.props.dangerouslySetInnerHTML.__html;
  }
}

function sampleOrg(orgText: string) {
  return {
    source: orgText,
    displayURL: "displayURL",
    sourceURL: "sourceURL",
    baseURL: "baseURL",
  };
}

function htmlFromOrg(orgText: string) {
  return getHTML(Org(sampleOrg(orgText)));
}

function testOrgToHTML(testName: string, orgText: string, expected: string) {
  test(testName, () => {
    expect(htmlFromOrg(orgText)).toEqual(expected);
  });
}

testOrgToHTML("regular text", "Test", "<p>Test</p>");

testOrgToHTML(
  "regular text (multiple lines)",
  `First line
Second line

Fourth (after gap)`,
  `<p>First line
Second line</p><p>Fourth (after gap)</p>`
);

describe("text styling", () => {
  for (const [testName, markupSym, htmlTag] of [
    ["bold", "*", "strong"],
    ["strikethrough", "+", "del"],
    ["italic", "/", "em"],
    ["verbatim", "=", "code"],
    ["code (inline)", "~", "code"],
  ]) {
    testOrgToHTML(
      testName,
      `${markupSym}Test${markupSym}`,
      `<p><${htmlTag}>Test</${htmlTag}></p>`
    );
  }

  testOrgToHTML(
    "underline",
    "_Test_",
    '<p><span style="text-decoration: underline;">Test</span></p>'
  );

  // NOTE: this currently is not supported by the parser. Expected result is '<p><del>Te <strong>st</strong> ing</del></p>' (2021-06-23)
  testOrgToHTML(
    "strikethrough and bold",
    "+Te *st* ing+",
    "<p><del>Te *st* ing</del></p>"
  );
});

testOrgToHTML("horizontal rule", "-----", "<hr>");

testOrgToHTML(
  "flat bullet list",
  `- this
- is
- a
- *bullet*
- list`,
  "<ul><li>this</li><li>is</li><li>a</li><li><strong>bullet</strong></li><li>list</li></ul>"
);

testOrgToHTML(
  "title",
  "#+TITLE: Document Title",
  mkHeaderHTML(1, "Document Title", "document-title")
);

describe("comments", () => {
  testOrgToHTML("comment, one line", "# a comment", "");

  testOrgToHTML(
    "comment, multi-line",
    `# first line of comment
# second line`,
    ""
  );

  testOrgToHTML(
    "paragraph with comment character inside",
    "this is not # a comment",
    "<p>this is not # a comment</p>"
  );
});

describe("embedding HTML", () => {
  testOrgToHTML(
    "HTML in regular text",
    "<p>&Test</p>",
    "<p>&lt;p&gt;&amp;Test&lt;/p&gt;</p>"
  );

  testOrgToHTML(
    "HTML in HTML export",
    "#+HTML: <div><p>Test</p></div>",
    "<div><p>Test</p></div>"
  );

  testOrgToHTML(
    "HTML in HTML export with XSS",
    "#+HTML: <img src=x onerror=alert(1) //>",
    '<img src="x">'
  );

  testOrgToHTML(
    "HTML in HTML export block",
    `
#+BEGIN_EXPORT html
<div>
    <p>Content</p>
</div>
#+END_EXPORT`,
    `<div>
    <p>Content</p>
</div>`
  );

  testOrgToHTML(
    "HTML in HTML export block with XSS",
    `
#+BEGIN_EXPORT html
<div>
    <img src=x onerror=alert(1) />
</div>
#+END_EXPORT`,
    `<div>
    <img src="x">
</div>`
  );
});

function mkHeaderHTML(level: number, headerText: string, anchorText: string) {
  return `<h${level}>
  <a name="${anchorText}" class="anchor" href="#${anchorText}">
    <span class="octicon-link"></span>
  </a>
  ${headerText}
</h${level}>`;
}

function testHeading(
  testName: string,
  headerText: string,
  expected: { level: number; text: string; anchor: string }
) {
  testOrgToHTML(
    testName,
    headerText,
    mkHeaderHTML(expected.level, expected.text, expected.anchor)
  );
}

describe("headings", () => {
  // up to heading level 6
  describe("heading levels", () => {
    for (let level = 1; level <= 6; level++) {
      testHeading(
        `heading ${level}`,
        `${new Array(level).fill("*").join("")} Test`,
        {
          level: level,
          text: "Test",
          anchor: "test",
        }
      );
    }
  });

  testHeading("heading 1 multiword", "* Test title", {
    level: 1,
    text: "Test title",
    anchor: "test-title",
  });

  testHeading("heading with markup", "* Test *title* /italic/", {
    level: 1,
    text: "Test <strong>title</strong> <em>italic</em>",
    anchor: "test-title-italic",
  });

  testOrgToHTML(
    "nested headings with content",
    `* First heading

Some content.

** Nested heading

More content.

* Outer heading again.`,
    `${mkHeaderHTML(
      1,
      "First heading",
      "first-heading"
    )}<p>Some content.</p>${mkHeaderHTML(
      2,
      "Nested heading",
      "nested-heading"
    )}<p>More content.</p>${mkHeaderHTML(
      1,
      "Outer heading again.",
      "outer-heading-again"
    )}`
  );
});

describe("links", () => {
  testOrgToHTML(
    "link (to external resource)",
    "[[https://duckduckgo.com][DuckDuckGo!]]",
    '<p><a href="https://duckduckgo.com">DuckDuckGo!</a></p>'
  );

  testOrgToHTML("unclosed link", "[[", "<p>[[</p>");
});

describe("code", () => {
  testOrgToHTML(
    "simple typescript",
    `#+BEGIN_SRC typescript
function foo() {}
#+END_SRC`,
    '<pre><pre style="color: rgb(36, 41, 46); background-color: #f6f8fa;" class="prism-code language-typescript flex overflow-y-auto ">' +
      '<code><div style="color: rgb(36, 41, 46);" class="token-line text-xs"><span style="color: #e3116c;" class="token keyword">' +
      'function</span><span class="token plain"> </span><span style="color: rgb(111, 66, 193);" class="token function">foo</span>' +
      '<span style="color: rgb(36, 41, 46);" class="token punctuation">(</span><span style="color: rgb(36, 41, 46);" class="token punctuation">)' +
      '</span><span class="token plain"> </span><span style="color: rgb(36, 41, 46);" class="token punctuation">' +
      '{</span><span style="color: rgb(36, 41, 46);" class="token punctuation">}</span></div></code></pre></pre>'
  );
});

describe("injection safety", () => {
  const testIn = "<p>&Test</p>";
  const testOut = "&lt;p&gt;&amp;Test&lt;/p&gt;";

  testOrgToHTML(
    "HTML in heading",
    `* ${testIn}`,
    mkHeaderHTML(1, testOut, "ptestp")
  );
  testOrgToHTML(
    "HTML in list item",
    `- ${testIn}`,
    `<ul><li>${testOut}</li></ul>`
  );
});
