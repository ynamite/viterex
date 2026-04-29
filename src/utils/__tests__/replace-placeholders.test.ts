import { describe, expect, it } from "vitest";
import { replacePlaceholders } from "../replace-placeholders.js";

describe("replacePlaceholders", () => {
  it("substitutes a known token", () => {
    expect(replacePlaceholders("hello {{NAME}}", { NAME: "world" })).toBe(
      "hello world",
    );
  });

  it("leaves unknown tokens intact (literal {{KEY}} survives)", () => {
    expect(
      replacePlaceholders("hello {{NAME}} from {{PLACE}}", { NAME: "world" }),
    ).toBe("hello world from {{PLACE}}");
  });

  it("substitutes repeated occurrences of the same key", () => {
    expect(
      replacePlaceholders("{{X}} and {{X}} and {{X}}", { X: "a" }),
    ).toBe("a and a and a");
  });

  it("returns the input unchanged when no tokens are present", () => {
    expect(replacePlaceholders("plain text, no tokens", { X: "ignored" })).toBe(
      "plain text, no tokens",
    );
  });

  it("ignores non-{{}} occurrences of the same word", () => {
    expect(replacePlaceholders("NAME and {{NAME}}", { NAME: "world" })).toBe(
      "NAME and world",
    );
  });
});
