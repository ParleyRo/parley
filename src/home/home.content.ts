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
  intro: "I'm a software developer who enjoys understanding how an application fits together: its interface, underlying logic, data, and the infrastructure it runs on.\nI build web applications, integrate services, and automate repetitive tasks. My personal projects often start with a practical need and become opportunities to explore, build, and improve something I use every day.",
  sections: [
    {
      title: 'Web applications & interfaces',
      icon: 'browser',
      items: [
        'I build interfaces with JavaScript and TypeScript, choosing tools that suit the project: React/Next.js, server-side templates, or interactions powered by Alpine and HTMX. I value clear, responsive applications and thoughtful attention to usability.',
      ],
    },
    {
      title: 'Backend & integrations',
      icon: 'code',
      items: [
        'I develop backends in PHP and Node.js, connect services through APIs and webhooks, and work with authentication, payments, and background processing. I care about how the entire workflow behaves, including when things go wrong.',
      ],
    },
    {
      title: 'Data & real-time communication',
      icon: 'database',
      items: [
        'I work with relational databases, particularly MySQL and PostgreSQL, and with applications that coordinate messages, events, and real-time updates. I pay attention to how data moves between components and stays consistent.',
      ],
    },
    {
      title: 'Integrations & automation',
      icon: 'workflow',
      items: [
        'I connect applications and services through APIs, webhooks, and notifications, and keep track of how the workflows between them operate.',
      ],
    },
    {
      title: 'Linux, Docker & infrastructure',
      icon: 'server',
      items: [
        'I manage my own server and the environments my applications run in, including Docker containers, reverse proxies, HTTPS, and supporting services. I use metrics, dashboards, and alerts to monitor their operation.',
      ],
    },
    {
      title: 'Debugging & maintenance',
      icon: 'bug',
      items: [
        'I investigate issues across the interface, backend, database, and infrastructure. I use Git, tests, and logs to verify changes and improve existing applications.',
      ],
    },
  ],
  outro: "I enjoy building useful things, understanding why they work, and making them easier to maintain. My curiosity carries on after work.",
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
