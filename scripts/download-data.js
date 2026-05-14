import fs from 'fs';
import https from 'https';
import path from 'path';
import unzipper from 'unzipper';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../data');
const dataZipUrl = 'https://huggingface.co/datasets/MatchaMacchiato/TQH-NYC-AirBNB/resolve/main/data.zip';
const dataZipPath = path.join(dataDir, 'data.zip');
const expectedFiles = [
  'cleaned_reviews.csv',
  'neighbourhoods.geojson',
  'cleaned_listings.csv',
  'cleaned_calendar.csv'
];

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

const hasAllFiles = () => expectedFiles.every((name) => {
  const filePath = path.join(dataDir, name);
  return fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
});

const normalizeExtractedData = () => {
  if (hasAllFiles()) {
    return;
  }

  const nestedDir = path.join(dataDir, 'data');
  if (!fs.existsSync(nestedDir) || !fs.statSync(nestedDir).isDirectory()) {
    return;
  }

  expectedFiles.forEach((name) => {
    const nestedPath = path.join(nestedDir, name);
    const targetPath = path.join(dataDir, name);
    if (fs.existsSync(nestedPath) && !fs.existsSync(targetPath)) {
      fs.renameSync(nestedPath, targetPath);
    }
  });
};

const downloadZip = () => new Promise((resolve, reject) => {
  if (fs.existsSync(dataZipPath) && fs.statSync(dataZipPath).size > 0) {
    console.log('[Data] data.zip already exists, skipping download...');
    resolve();
    return;
  }

  const request = (downloadUrl) => {
    https.get(downloadUrl, (response) => {
      if ([301, 302, 303, 307, 308].includes(response.statusCode)) {
        request(response.headers.location);
        return;
      }

      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download data.zip: ${response.statusCode}`));
        return;
      }

      const fileStream = fs.createWriteStream(dataZipPath);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log('[Data] data.zip downloaded successfully.');
        resolve();
      });
      fileStream.on('error', (err) => {
        fs.unlink(dataZipPath, () => {});
        reject(err);
      });
    }).on('error', (err) => {
      fs.unlink(dataZipPath, () => {});
      reject(err);
    });
  };

  console.log('[Data] Downloading data.zip...');
  request(dataZipUrl);
});

const extractZip = async () => {
  await fs
    .createReadStream(dataZipPath)
    .pipe(unzipper.Extract({ path: dataDir }))
    .promise();
  console.log('[Data] data.zip extracted successfully.');
};

async function main() {
  console.log('[Data] Checking data files...');
  try {
    if (hasAllFiles()) {
      console.log('[Data] All data files are ready.');
      return;
    }

    await downloadZip();
    await extractZip();
    normalizeExtractedData();

    if (!hasAllFiles()) {
      throw new Error('Missing expected data files after extraction.');
    }

    fs.unlink(dataZipPath, () => {});
    console.log('[Data] All data files are ready.');
  } catch (err) {
    console.error('[Data] Error downloading data:', err.message);
    console.error('[Data] Please check data/data-link.txt for manual download links.');
    // Don't exit with 1 to avoid breaking npm install if network is down
    // process.exit(1);
  }
}

main();
