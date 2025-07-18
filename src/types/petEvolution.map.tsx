
export const puppyEvolutionMap: Record<string, string | null> = {
  puppy: 'fox',
  fox: 'wolf',
  'wolf': 'werewolf',
   werewolf: 'cerberus',
  'cerberus': null, // final evolution
};

export const puppyEvolutionLevels: Record<string, number> = {
  puppy: 1,
  fox: 10,
  wolf: 25,
  werewolf: 45,
  cerberus: 70,
};

export const kittenEvolutionMap: Record<string, string | null> = {
 "kitten": "egyptian cat",
  "egyptian cat": "astronaut cat",
  "astronaut cat": "pirate cat",
  "pirate cat": "superhero cat",
  "superhero cat": null // Final evolution
};

export const kittenEvolutionLevels: Record<string, number> = {
  "kitten": 1,
  "egyptian cat": 10,
  "astronaut cat": 25,
  "pirate cat": 45,
  "superhero cat": 70 // Final evolution
};