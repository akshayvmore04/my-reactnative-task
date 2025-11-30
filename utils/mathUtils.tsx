// utils/mathUtils.ts

// 🔹 Check if a number is prime
export const isPrime = (n: number): boolean => {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;

  const limit = Math.floor(Math.sqrt(n));
  for (let i = 3; i <= limit; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
};

// 🔹 Count vowels in a string
export const countVowels = (text: string): number =>
  (text.toLowerCase().match(/[aeiou]/g) || []).length;

// 🔹 Calculate price using the given formula
export const calculatePrice = (title: string, description: string): number => {
  const titleLength = title.length;
  const vowelsInDescription = countVowels(description);
  return titleLength * 10 + vowelsInDescription;
};

// 🔹 Format number as currency
export const formatCurrency = (amount: number): string =>
  `$${amount.toFixed(2)}`;
