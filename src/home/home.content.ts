export const languages = [
  ['en', 'English'], ['ro', 'Română'], ['it', 'Italiano'], ['ja', '日本語'],
  ['hu', 'Magyar'], ['fr', 'Français'], ['bg', 'Български'], ['ar', 'العربية'],
  ['zh', '中文'], ['el', 'Ελληνικά'], ['ru', 'Русский'], ['es', 'Español'],
  ['sv', 'Svenska'], ['tr', 'Türkçe'], ['uk', 'Українська'],
] as const;
export interface Presentation {
  intro: string; sections: { title: string; items: string[]; icon: string }[]; outro: string;
}
export const presentation: Presentation = {
  intro: "Hey there, code aficionados! I'm not just your run-of-the-mill developer; I'm the proud captain of a code spaceship with over a decade of experience navigating the cosmic seas of software development. Buckle up and let's take a joyride through my tech universe:",
  sections: [
    { title: 'Front-end Fiesta:', icon: 'browser', items: [
      'HTML is my secret language for talking to web browsers.',
      'CSS is my artistic palette; I paint masterpieces with style.',
      "JavaScript? Well, that's my coffee – can't start the day without it!",
      'Vue.js and React are my dynamic duo, making user interfaces dance to the rhythm of the code.',
    ] },
    { title: 'Back-end Banter:', icon: 'code', items: [
      'PHP is my trusty sidekick, handling server-side shenanigans for over 10 years.',
      'Laravel is like my code butler, ensuring everything runs smoother than a cat video on the internet.',
      "Node.js? It's where I tap into my superhero mode, using JavaScript to save the day on the server.",
    ] },
    { title: 'Database Dazzle:', icon: 'database', items: [
      'MySQL is where I play Sherlock, solving mysteries in the world of relational databases.',
      'MongoDB is my flexible friend, embracing the chaos of non-relational data like a pro.',
    ] },
    { title: 'Version Control Virtuoso:', icon: 'branch', items: [
      'Git is my time machine, keeping track of all the twists and turns in the code saga for over a decade. Think of me as the code historian with a sense of humor.',
    ] },
  ],
  outro: "So, if you're looking for a developer who doesn't just code but also brings a dash of wit to the table, you've found your match. Let's create some tech magic together – the fun way!",
};
export function textsOf(content: Presentation): string[] {
  return [content.intro, ...content.sections.flatMap(section => [section.title, ...section.items]), content.outro];
}
export function withTexts(texts: string[]): Presentation {
  let index = 0;
  return { intro: texts[index++], sections: presentation.sections.map(section => ({
    icon: section.icon, title: texts[index++], items: section.items.map(() => texts[index++]),
  })), outro: texts[index] };
}
