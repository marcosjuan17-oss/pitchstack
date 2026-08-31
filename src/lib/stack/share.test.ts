import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  decodeInputs,
  encodeInputs,
  normalizeCalculatorInputs,
} from "./share.ts";
import { DEFAULT_INPUTS } from "./types.ts";

describe("share encoding", () => {
  it("round-trips default inputs", () => {
    const id = encodeInputs(DEFAULT_INPUTS);
    assert.equal(id, "v1.high_school.15.6.2500.USD.40");
    assert.deepEqual(decodeInputs(id), DEFAULT_INPUTS);
  });

  it("rejects garbage", () => {
    assert.equal(decodeInputs("nope"), null);
    assert.equal(decodeInputs("v2.club.16.4.1500.EUR.0"), null);
  });

  it("normalizes old EUR soccer inputs to basketball USD", () => {
    const next = normalizeCalculatorInputs({
      sport: "soccer",
      level: "club",
      rosterSize: 18,
      practiceHoursPerWeek: 4,
      budget: 1500,
      currency: "EUR",
      needs: ["film"],
    });
    assert.equal(next.sport, "basketball");
    assert.equal(next.currency, "USD");
    assert.equal(next.level, "club");
    assert.deepEqual(next.needs, ["film"]);
  });
});
