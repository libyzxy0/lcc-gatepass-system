export function formatPHNumber(input) {
  const digits = input.replace(/\D/g, "");

  let cleaned = digits;
  if (cleaned.startsWith("63")) cleaned = cleaned.slice(2);
  if (cleaned.startsWith("0")) cleaned = cleaned.slice(1);

  if (cleaned.length !== 10) {
    throw new Error("Invalid PH mobile number");
  }

  const part1 = cleaned.slice(0, 3);
  const part2 = cleaned.slice(3, 6);
  const part3 = cleaned.slice(6);

  return `${part1}-${part2}-${part3}`;
}

export const normalize = (num: string | null) => {
  if (!num) return null;
  let digits = num.replace(/\D/g, "");
  if (digits.startsWith("63")) digits = digits.slice(2);
  if (digits.startsWith("0")) digits = digits.slice(1);
  return digits.slice(-10);
};

export function isValidPHPhoneNumber(phoneNumber) {
  const cleaned = phoneNumber.replace(/\D/g, ""); 
  const normalized =
    cleaned.startsWith("63") ? cleaned.slice(2) :
    cleaned.startsWith("09") ? cleaned.slice(1) :
    cleaned;
  return /^9\d{9}$/.test(normalized);
}
