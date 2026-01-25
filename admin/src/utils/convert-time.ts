export function toPHTime(utcString: string | null) {
  if (!utcString) return 'N/A';

  const [datePart, timePart] = utcString.split(' ');
  if (!datePart || !timePart) return 'Invalid date';
  const isoString = `${datePart}T${timePart}Z`;

  const date = new Date(isoString);

  return date.toLocaleTimeString('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'Asia/Manila',
  });
}

export function toPHDate(utcString: string | null) {
  if (!utcString) return 'N/A';

  const [datePart, timePart] = utcString.split(' ');
  if (!datePart || !timePart) return 'Invalid date';
  const isoString = `${datePart}T${timePart}Z`;

  const date = new Date(isoString);

  return date.toLocaleDateString('en-PH', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
