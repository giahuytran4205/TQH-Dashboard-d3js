import fs from "fs";
import path from "path";
import readline from "readline";
import { csvParse, csvParseRows } from "d3-dsv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const outputDir = path.join(rootDir, "src", "data");
const outputPath = path.join(outputDir, "derivedMetrics.json");

const DATA_YEAR = 2026;
const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const MIN_NIGHTS_GROUPS = ["Short <=3", "Medium 4-7", "Long >7"];

const positiveTerms = [
  "clean",
  "location",
  "comfortable",
  "recommend",
  "subway",
  "easy",
  "perfect",
  "close",
  "quiet",
  "helpful",
  "neighborhood",
  "restaurants",
  "amazing",
  "responsive",
  "friendly",
  "walk",
  "wonderful",
  "beautiful",
  "spacious",
  "kitchen",
  "safe",
  "lovely",
  "experience",
  "bathroom",
  "airbnb",
  "great location",
  "good communication",
  "highly recommend",
  "easy check in",
  "close to subway",
  "would stay again",
  "perfect location",
  "well located",
  "clean apartment",
  "responsive host",
  "comfortable bed",
  "quiet neighborhood",
  "great host",
  "best airbnb",
  "beautifully decorated",
  "immaculate",
  "lovely clean",
  "stocked kitchen",
  "warm welcome",
  "gorgeous",
  "historic",
  "attention detail",
  "amazing stay",
  "wonderful experience",
  "safe neighborhood",
  "super clean",
  "excellent communication",
];

const negativeTerms = [
  "dirty",
  "noisy",
  "small",
  "broken",
  "rude",
  "smell",
  "bug",
  "issue",
  "problem",
  "uncomfortable",
  "unsafe",
  "late check in",
  "not clean",
  "not as described",
  "poor communication",
  "hidden fees",
  "too expensive",
  "cancel reservation",
  "worst experience",
  "security deposit",
  "infestation",
  "smelly",
  "disgusting",
  "terrible experience",
  "unresponsive",
  "smaller pictures",
  "receptionist",
  "noisy street",
  "tiny room",
  "bad location",
  "dirty bathroom",
  "missing towel",
  "cold room",
  "air conditioning issue",
  "unclean",
  "poor value",
  "noise",
  "complaint",
  "maintenance",
  "stained",
  "cigarette",
];

const termRules = [...positiveTerms, ...negativeTerms].map((term) => ({
  term,
  pattern: makePattern(term),
}));

const REVIEW_THEME_TOKENS = new Set([
  "clean",
  "location",
  "comfortable",
  "recommend",
  "subway",
  "easy",
  "perfect",
  "close",
  "quiet",
  "helpful",
  "neighborhood",
  "restaurants",
  "responsive",
  "highly",
  "amazing",
  "friendly",
  "safe",
  "spacious",
  "beautiful",
  "lovely",
  "experience",
  "kitchen",
  "bathroom",
  "airbnb",
  "city",
  "walk",
  "wonderful",
  "convenient",
  "cozy",
  "charming",
  "bed",
  "communication",
  "value",
  "view",
  "brooklyn",
  "cleanliness",
  "welcome",
  "details",
  "decorated",
  "renovated",
  "location",
  "transportation",
  "market",
  "excellent",
  "best",
  "warm",
  "beautifully",
  "cleaned",
  "subway",
]);

function parseNumber(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function parseBoolean(value) {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (["true", "1", "yes", "y", "t"].includes(normalized)) {
    return true;
  }

  if (["false", "0", "no", "n", "f"].includes(normalized)) {
    return false;
  }

  return null;
}

function readCsvText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
}

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/<br\s*\/?>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[^a-z0-9\s']/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractReviewTokens(text) {
  const tokens = normalizeText(text)
    .split(" ")
    .map((token) => token.trim())
    .filter((token) => token.length >= 3 && !/^\d+$/.test(token) && REVIEW_THEME_TOKENS.has(token));

  return Array.from(new Set(tokens));
}

function makePattern(term) {
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\s+/g, "\\s+");
  return new RegExp(`\\b${escaped}\\b`, "g");
}

function minNightsGroup(value) {
  if (!Number.isFinite(value)) {
    return null;
  }

  if (value <= 3) {
    return "Short <=3";
  }

  if (value <= 7) {
    return "Medium 4-7";
  }

  return "Long >7";
}

function makeCounter() {
  return { total: 0, booked: 0 };
}

function incrementCounter(map, key, booked) {
  if (!map.has(key)) {
    map.set(key, makeCounter());
  }

  const current = map.get(key);
  current.total += 1;
  current.booked += booked;
}

function counterToRate(counter) {
  return counter.total ? (counter.booked / counter.total) * 100 : null;
}

function loadListings() {
  const listingPath = path.join(dataDir, "cleaned_listings.csv");
  if (!fs.existsSync(listingPath)) {
    throw new Error(`Missing ${listingPath}`);
  }

  const rows = csvParse(readCsvText(listingPath));
  const hostCounts = new Map();
  const listingById = new Map();

  rows.forEach((row) => {
    const hostId = row.host_id;
    hostCounts.set(hostId, (hostCounts.get(hostId) ?? 0) + 1);
  });

  rows.forEach((row) => {
    const hostType = (hostCounts.get(row.host_id) ?? 0) > 1 ? "Professional host" : "Individual host";
    listingById.set(String(row.id), {
      id: String(row.id),
      hostId: row.host_id,
      hostType,
      region: row.neighbourhood_group_cleansed || "Unknown",
      neighbourhood: row.neighbourhood_cleansed || "Unknown",
      roomType: row.room_type || "Unknown",
      price: parseNumber(row.price),
      rating: parseNumber(row.review_scores_rating),
    });
  });

  const hostSummaryMap = new Map();
  rows.forEach((row) => {
    const listing = listingById.get(String(row.id));
    if (!listing) {
      return;
    }

    if (!hostSummaryMap.has(listing.hostType)) {
      hostSummaryMap.set(listing.hostType, {
        hostType: listing.hostType,
        hostIds: new Set(),
        listingCount: 0,
        ratingSum: 0,
        ratingCount: 0,
      });
    }

    const summary = hostSummaryMap.get(listing.hostType);
    summary.hostIds.add(listing.hostId);
    summary.listingCount += 1;
    if (Number.isFinite(listing.rating)) {
      summary.ratingSum += listing.rating;
      summary.ratingCount += 1;
    }
  });

  return { listingById, hostSummaryMap, listingCount: rows.length };
}

async function aggregateCalendar(listingById) {
  const calendarPath = path.join(dataDir, "cleaned_calendar.csv");
  if (!fs.existsSync(calendarPath)) {
    throw new Error(`Missing ${calendarPath}`);
  }

  const monthlyRegionMap = new Map();
  const monthlyOverallMap = new Map();
  const minNightsMap = new Map();
  const hostTypeOccupancyMap = new Map();
  const observedMonths = new Set();

  const rl = readline.createInterface({
    input: fs.createReadStream(calendarPath),
    crlfDelay: Infinity,
  });

  let header = null;
  for await (const line of rl) {
    if (!header) {
      header = line.replace(/^\uFEFF/, "").split(",");
      continue;
    }

    if (!line) {
      continue;
    }

    const parts = line.split(",");
    const row = Object.fromEntries(header.map((name, index) => [name, parts[index] ?? ""]));
    const year = Number(row.year);
    const month = Number(row.month);
    if (year !== DATA_YEAR || !MONTHS.includes(month)) {
      continue;
    }

    const listing = listingById.get(String(row.listing_id));
    if (!listing) {
      continue;
    }

    const booked = parseNumber(row.is_booked) ?? (parseBoolean(row.is_available) === false ? 1 : 0);
    const minGroup = minNightsGroup(parseNumber(row.minimum_nights));
    observedMonths.add(month);

    incrementCounter(monthlyRegionMap, `${month}|${listing.region}`, booked);
    incrementCounter(monthlyOverallMap, String(month), booked);
    incrementCounter(hostTypeOccupancyMap, listing.hostType, booked);

    if (minGroup) {
      incrementCounter(minNightsMap, `${month}|${minGroup}`, booked);
    }
  }

  return {
    monthlyOccupancyByRegion: Array.from(monthlyRegionMap, ([key, counter]) => {
      const [month, region] = key.split("|");
      return {
        year: DATA_YEAR,
        month: Number(month),
        region,
        totalDays: counter.total,
        bookedDays: counter.booked,
        occupancyRate: counterToRate(counter),
      };
    }).sort((left, right) => left.region.localeCompare(right.region) || left.month - right.month),
    monthlyOccupancyOverall: Array.from(observedMonths).sort((a, b) => a - b).map((month) => {
      const counter = monthlyOverallMap.get(String(month)) ?? makeCounter();
      return {
        year: DATA_YEAR,
        month,
        totalDays: counter.total,
        bookedDays: counter.booked,
        occupancyRate: counterToRate(counter),
      };
    }),
    monthlyOccupancyByMinNights: Array.from(observedMonths).sort((a, b) => a - b).flatMap((month) =>
      MIN_NIGHTS_GROUPS.map((group) => {
        const counter = minNightsMap.get(`${month}|${group}`) ?? makeCounter();
        return {
          year: DATA_YEAR,
          month,
          minNightsGroup: group,
          totalDays: counter.total,
          bookedDays: counter.booked,
          occupancyRate: counterToRate(counter),
        };
      })
    ),
    hostTypeOccupancyMap,
  };
}

function aggregateReviews(listingById) {
  const reviewsPath = path.join(dataDir, "cleaned_reviews.csv");
  if (!fs.existsSync(reviewsPath)) {
    throw new Error(`Missing ${reviewsPath}`);
  }

  const highCounts = new Map(termRules.map((rule) => [rule.term, 0]));
  const lowCounts = new Map(termRules.map((rule) => [rule.term, 0]));
  const tokenHighCounts = new Map();
  const tokenLowCounts = new Map();
  let highReviews = 0;
  let lowReviews = 0;

  csvParseRows(readCsvText(reviewsPath), (row, index) => {
    if (index === 0) {
      return null;
    }

    const listing = listingById.get(String(row[0]));
    if (!listing || !Number.isFinite(listing.rating)) {
      return null;
    }

    const isHigh = listing.rating >= 4.8;
    const isLow = listing.rating <= 4.5;
    if (!isHigh && !isLow) {
      return null;
    }

    const text = normalizeText(row[2]);
    if (!text) {
      return null;
    }

    if (isHigh) {
      highReviews += 1;
    } else {
      lowReviews += 1;
    }

    extractReviewTokens(text).forEach((token) => {
      const counts = isHigh ? tokenHighCounts : tokenLowCounts;
      counts.set(token, (counts.get(token) ?? 0) + 1);
    });

    termRules.forEach((rule) => {
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(text)) {
        const counts = isHigh ? highCounts : lowCounts;
        counts.set(rule.term, (counts.get(rule.term) ?? 0) + 1);
      }
    });

    return null;
  });

  const scoredTerms = termRules.map((rule) => {
    const highCount = highCounts.get(rule.term) ?? 0;
    const lowCount = lowCounts.get(rule.term) ?? 0;
    const highRate = (highCount + 1) / (highReviews + 2);
    const lowRate = (lowCount + 1) / (lowReviews + 2);
    const strength = Math.log2(highRate / lowRate);

    return {
      term: rule.term,
      group: strength >= 0 ? "High-rating reviews" : "Low-rating reviews",
      strength,
      highCount,
      lowCount,
    };
  });

  const tokenCounts = new Set([...tokenHighCounts.keys(), ...tokenLowCounts.keys()]);
  const scoredTokens = Array.from(tokenCounts).map((token) => {
    const highCount = tokenHighCounts.get(token) ?? 0;
    const lowCount = tokenLowCounts.get(token) ?? 0;
    const highRate = (highCount + 1) / (highReviews + 2);
    const lowRate = (lowCount + 1) / (lowReviews + 2);
    const strength = Math.log2(highRate / lowRate);

    return {
      term: token,
      group: strength >= 0 ? "High-rating reviews" : "Low-rating reviews",
      strength,
      highCount,
      lowCount,
    };
  });

  const positive = [...scoredTerms, ...scoredTokens]
    .filter((term) => term.strength > 0)
    .sort((left, right) => right.highCount + right.lowCount - (left.highCount + left.lowCount))
    .slice(0, 32);
  const negative = [...scoredTerms, ...scoredTokens]
    .filter((term) => term.strength < 0)
    .sort((left, right) => left.strength - right.strength)
    .slice(0, 32);

  return {
    reviewGroupCounts: { highReviews, lowReviews },
    sentimentTerms: [...negative, ...positive]
      .filter((term, index, array) => array.findIndex((item) => item.term === term.term) === index)
      .sort((left, right) => (right.highCount + right.lowCount) - (left.highCount + left.lowCount)),
  };
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log("[Derived] Loading listings...");
  const { listingById, hostSummaryMap, listingCount } = loadListings();

  console.log("[Derived] Aggregating calendar...");
  const calendar = await aggregateCalendar(listingById);

  console.log("[Derived] Aggregating reviews...");
  const reviewMetrics = aggregateReviews(listingById);

  const hostPerformance = Array.from(hostSummaryMap.values()).map((summary) => {
    const occupancy = calendar.hostTypeOccupancyMap.get(summary.hostType) ?? makeCounter();
    return {
      hostType: summary.hostType,
      hostCount: summary.hostIds.size,
      listingCount: summary.listingCount,
      avgRating: summary.ratingCount ? summary.ratingSum / summary.ratingCount : null,
      occupancyRate: counterToRate(occupancy),
    };
  });

  const output = {
    generatedAt: new Date().toISOString(),
    sourceYear: DATA_YEAR,
    listingCount,
    ...calendar,
    hostPerformance,
    ...reviewMetrics,
  };
  delete output.hostTypeOccupancyMap;

  fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);
  console.log(`[Derived] Wrote ${path.relative(rootDir, outputPath)}`);
}

main().catch((error) => {
  console.error("[Derived] Failed:", error);
  process.exitCode = 1;
});
