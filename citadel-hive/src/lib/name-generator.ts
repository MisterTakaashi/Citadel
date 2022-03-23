const adjectives = [
  'abandoned',
  'aberrant',
  'actually',
  'adorable',
  'adventurous',
  'amazing',
  'angry',
  'arrogant',
  'belligerent',
  'beautiful',
];
const nouns = ['nectar', 'wasp', 'honey', 'ant', 'comb', 'beetle', 'orchid', 'buzz', 'hornet', 'butterfly', 'larva'];

export default function generateName(after?: string, retrieved?: number) {
  if (retrieved && retrieved > 20) return after;

  if (after) {
    const [currentAdjective, currentNoun] = after.split(' ');
    let adjectiveIndex = adjectives.findIndex((adjective) => adjective === currentAdjective);
    let nounIndex = nouns.findIndex((noun) => noun === currentNoun);

    if (adjectiveIndex + 1 >= adjectives.length) {
      adjectiveIndex = 0;
    } else {
      adjectiveIndex = adjectiveIndex + 1;
    }
    if (nounIndex + 1 >= nouns.length) {
      nounIndex = 0;
    } else {
      nounIndex = nounIndex + 1;
    }

    return `${adjectives[adjectiveIndex]} ${nouns[nounIndex]}`;
  }

  const adjective = adjectives[Math.floor(Math.random() * adjectives.length - 1)];
  const noun = nouns[Math.floor(Math.random() * nouns.length - 1)];

  return `${adjective} ${noun}`;
}
