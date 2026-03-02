const DAY_MS = 24 * 60 * 60 * 1000;
const CACHE_KEY = 'fsa-hijri-calendar-v1';

const getDateStamp = () => {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, '0');
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const year = today.getFullYear();
  return `${day}-${month}-${year}`;
};

const readCache = () => {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.expiresAt || Date.now() > parsed.expiresAt) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }
    return parsed.data || null;
  } catch {
    return null;
  }
};

const writeCache = (data) => {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({
        expiresAt: Date.now() + DAY_MS,
        data,
      })
    );
  } catch {
    // no-op if storage is unavailable
  }
};

export async function getHijriDate() {
  const cached = readCache();
  if (cached) {
    return cached;
  }

  const dateStamp = getDateStamp();
  const response = await fetch(`https://api.aladhan.com/v1/gToH?date=${dateStamp}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Hijri API request failed');
  }

  const payload = await response.json();
  const hijri = payload?.data?.hijri;
  const month = Number(hijri?.month?.number);
  const day = Number(hijri?.day);
  const year = Number(hijri?.year);

  if (!month || !day || !year) {
    throw new Error('Hijri API returned invalid payload');
  }

  const data = { month, day, year };
  writeCache(data);
  return data;
}

export async function isRamadanPeriod() {
  const hijriDate = await getHijriDate();
  return hijriDate.month === 9;
}
