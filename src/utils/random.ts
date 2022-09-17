export const getRandom = (min: number, max: number, digits = 0) => +((Math.random() * (max - min) + min).toFixed(digits));

export const getRandomItem = <T>(array: T[]): T => array[getRandom(0, array.length - 1)];

export const getTrueOrFalse = (): boolean => Math.random() > 0.5;


function* generateUniqueRandom<T>(array: T[]): IterableIterator<T> {
  const generated: T[] = [];
  let random: T;
  while (true) {
    do {
      random = getRandomItem(array);
      if (generated.length >= array.length) {
        generated.length = 0;
      }
    } while (generated.includes(random));
    generated.push(random);
    yield random;
  }
}

export const getRandomItems = <T>(array: T[], n: number): T[] => {
  const generator = generateUniqueRandom(array);
  return Array
    .from({length: n},
      (): T => generator.next().value);
};
