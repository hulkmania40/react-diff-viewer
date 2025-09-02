import React from "react";
import DiffViewerComponent from "./DiffViewerComponent";

function App() {
  const oldFileContent = `// utils.ts (old version)

// Array helpers
export function sumArray(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}

export function averageArray(arr: number[]): number {
  if (arr.length === 0) return 0;
  return sumArray(arr) / arr.length;
}

export function maxInArray(arr: number[]): number {
  return Math.max(...arr);
}

export function minInArray(arr: number[]): number {
  return Math.min(...arr);
}

// Math helpers
export function factorial(n: number): number {
  if (n === 0) return 1;
  return n * factorial(n - 1);
}

export function fibonacci(n: number): number {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  for (let i = 2; i < n; i++) {
    if (n % i === 0) return false;
  }
  return true;
}

// String helpers
export function reverseString(str: string): string {
  return str.split("").reverse().join("");
}

export function isPalindrome(str: string): boolean {
  const reversed = reverseString(str);
  return str === reversed;
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => \`_\${letter.toLowerCase()}\`);
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Object helpers
export function cloneObject<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// Misc
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function range(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i++) {
    result.push(i);
  }
  return result;
}`;

  const newFileContent = `// utils.ts (new version with improvements)

// Array helpers
export function sumArray(arr: number[]): number {
  return arr.reduce((acc, val) => acc + val, 0);
}

export function averageArray(arr: number[]): number {
  if (arr.length === 0) throw new Error("Array cannot be empty");
  return sumArray(arr) / arr.length;
}

export function maxInArray(arr: number[]): number | null {
  if (arr.length === 0) return null;
  return Math.max(...arr);
}

export function minInArray(arr: number[]): number | null {
  if (arr.length === 0) return null;
  return Math.min(...arr);
}

// Math helpers
export function factorial(n: number): number {
  if (n < 0) throw new Error("Negative numbers not allowed");
  if (n === 0) return 1;
  return n * factorial(n - 1);
}

export function fibonacci(n: number, memo: Record<number, number> = {}): number {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

export function isPrime(n: number): boolean {
  if (n <= 1) return false;
  if (n <= 3) return true;
  if (n % 2 === 0 || n % 3 === 0) return false;
  for (let i = 5; i * i <= n; i += 6) {
    if (n % i === 0 || n % (i + 2) === 0) return false;
  }
  return true;
}

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export function lcm(a: number, b: number): number {
  return (a * b) / gcd(a, b);
}

// String helpers
export function reverseString(str: string): string {
  return str.split("").reverse().join("");
}

export function isPalindrome(str: string): boolean {
  const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  const reversed = reverseString(normalized);
  return normalized === reversed;
}

export function capitalize(str: string): string {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function camelToSnake(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => \`_\${letter.toLowerCase()}\`);
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

// Object helpers
export function cloneObject<T>(obj: T): T {
  return structuredClone(obj);
}

export function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

export function deepMerge<T>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key in source) {
    if (typeof source[key] === "object" && source[key] !== null) {
      (result as any)[key] = deepMerge((target as any)[key] || {}, source[key] as any);
    } else {
      (result as any)[key] = source[key];
    }
  }
  return result;
}

// Misc
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function range(start: number, end: number, step: number = 1): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += step) {
    result.push(i);
  }
  return result;
}

export function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}`;

  return (
    <div className="App">
      <DiffViewerComponent oldFile={oldFileContent} newFile={newFileContent} />
    </div>
  );
}

export default App;
