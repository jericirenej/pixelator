import { bytesToUnits } from "../constants/constants";
import { RenderedImageDimensionLimits } from "../types";
import { imageRatios } from "./utils";

describe("bytesToUnits", () => {
  const KB = 2 ** 10,
    MB = 2 ** 20;
  it("Should return proper values ", () => {
    const testCases = [
      { val: 925, expected: "925 B" },
      { val: 1 * KB, expected: "1 KB" },
      { val: 1.25 * KB, expected: "1.25 KB" },
      { val: 1.259 * KB, expected: "1.26 KB" },
      { val: 250.259 * KB, expected: "250.26 KB" },
      { val: 2.23 * MB, expected: "2.23 MB" },
    ];
    for (const { val, expected } of testCases) {
      expect(bytesToUnits(val)).toBe(expected);
    }
  });
  it("Should return proper separators", () => {
    const val = 1.35 * KB;
    const testCases = [
      { locale: undefined, expected: "." },
      { locale: "en-US", expected: "." },
      { locale: "de-DE", expected: "," },
      { locale: "de", expected: "," },
    ];
    for (const { locale, expected } of testCases) {
      expect(bytesToUnits(val, locale).search(expected)).toBeGreaterThan(-1);
    }
  });
  it("Should return proper number of decimals", () => {
    const val = 1.123 * KB,
      regex = /(?<=\.)\d*/;
    const testCases = [
      { digits: undefined, expected: 2 },
      { digits: 4, expected: 3 },
      { digits: 3, expected: 3 },
      { digits: 2, expected: 2 },
      { digits: 1, expected: 1 },
      { digits: 0, expected: 0 },
    ];
    for (const { digits, expected } of testCases) {
      const result = bytesToUnits(val, undefined, digits);
      const match = result.match(regex);
      if (expected === 0) {
        expect(match).toBeNull();
      } else {
        expect(result.match(regex)![0].length).toBe(expected);
      }
    }
  });
});

describe("imageRatios", () => {
  const mockDimensionLimits: RenderedImageDimensionLimits = {
    desktop: { defaultWidth: 50, maximumHeight: 50 },
    mobile: { defaultWidth: 75, maximumHeight: 75 },
  };
  it("Should return defaultWidths, if maximum height is not exceeded", () => {
    const mockRatios = [1.5, 1],
      expected = { "--width": 50, "--mobile-width": 75 };
    for (const ratio of mockRatios) {
      expect(imageRatios(ratio, 1, mockDimensionLimits)).toEqual(expected);
    }
  });
  it("Should return modified widths, if max ratio is exceeded", () => {
    const mockRatio = 0.5;
    const result = imageRatios(mockRatio, 1, mockDimensionLimits, 1);
    expect(Math.abs(result["--width"]- 50*0.5)).toBeLessThan(1);
    expect(Math.abs(result["--mobile-width"] - 75*0.5)).toBeLessThan(1);
  });
});
