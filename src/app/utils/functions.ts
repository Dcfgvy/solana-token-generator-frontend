export function formatElapsedTime(start: Date): string {
  const now = new Date();
  const elapsedMs = now.getTime() - start.getTime();

  const totalSeconds = Math.floor(elapsedMs / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  let parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours}h`);
  }
  if (minutes > 0 || hours > 0) {
    parts.push(`${minutes}m`);
  }
  parts.push(`${seconds}s`);

  return parts.join(' ');
}

export function formatTimeMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const leftMinutes = minutes % 60;
  console.log('minutes', minutes)

  let parts: string[] = [];

  if (hours === 1) {
    parts.push(`${hours} hour`);
  }
  else if (hours > 1) {
    parts.push(`${hours} hours`);
  }
  if (leftMinutes === 1) {
    parts.push(`${leftMinutes} minute`);
  }
  else if (leftMinutes > 1) {
    parts.push(`${leftMinutes} minutes`);
  }

  return parts.join(' ');
}

export function formatNumberShort(num: number): string {
  const absNum = Math.abs(num);
  let formatted: string;

  if (absNum >= 1_000_000_000) {
    formatted = (num / 1_000_000_000).toFixed(2) + 'B';
  } else if (absNum >= 1_000_000) {
    formatted = (num / 1_000_000).toFixed(2) + 'M';
  } else if (absNum >= 1_000) {
    formatted = (num / 1_000).toFixed(2) + 'K';
  } else {
    formatted = num.toString();
  }

  return formatted;
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res();
    }, ms);
  })
}