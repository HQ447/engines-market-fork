export type BrandHeadingParts = {
  primary: string;
  accent: string;
};

const accentPatterns = [
  /\bWhich (?:Fuel Type|Powertrain) Is Right For You$/i,
  /\bby Fuel Type$/i,
  /\bWhen Replacement Makes Sense$/i,
  /\bAverage Rebuilt Prices \(UK Supply\)$/i,
  /\bFull Directory$/i,
  /\bReplacement Models$/i,
  /\bPrice Guide$/i,
  /\bWhat to Expect$/i,
  /\bYour Model$/i,
  /\bWhat Was Fitted & When$/i,
  /\bFrequently Asked Questions$/i,
  /\bAcross the UK$/i,
];

export function splitBrandHeading(value: string): BrandHeadingParts {
  const heading = value
    .replace(/[–—]/g, "-")
    .replace(/-\s*$/, "")
    .trim();
  const match = accentPatterns
    .map((pattern) => heading.match(pattern))
    .find((result) => result?.index !== undefined);

  if (!match || match.index === undefined) {
    return { primary: heading, accent: "" };
  }

  return {
    primary: heading.slice(0, match.index).trim(),
    accent: match[0].trim(),
  };
}
