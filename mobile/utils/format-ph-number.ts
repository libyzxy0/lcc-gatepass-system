export function formatPHNumber(input: string) {
  if (!input) return "";

  let digits = input.replace(/\D/g, "");

  if (digits.startsWith("63")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);

  digits = digits.slice(0, 10);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;

  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
}


export const normalize = (num: string | null): string | null => {
  if (!num) return null;

  let digits = num.replace(/\D/g, "");

  if (digits.startsWith("63")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);

  return digits.length === 10 ? digits : null;
};


export function isValidPHPhoneNumber(phoneNumber: string) {
  if (!phoneNumber) return false;

  let digits = phoneNumber.replace(/\D/g, "");

  if (digits.startsWith("63")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);

  return /^9\d{9}$/.test(digits);
}

