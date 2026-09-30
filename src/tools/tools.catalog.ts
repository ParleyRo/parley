export const tools = [
  { slug: 'line-length', title: 'Lungime fir', category: 'PESCUIT', description: 'Firul potrivit, pe tamburul potrivit.', icon: 'reel', label: 'Calculează lungimea' },
  { slug: 'casting-weight', title: 'Putere de aruncare', category: 'PESCUIT', description: 'Din livre în grame. Simplu și rapid.', icon: 'rod', label: 'Calculează greutatea' },
  { slug: 'rule-of-three', title: 'Regula de 3 simplă', category: 'MATEMATICĂ', description: 'Trei valori cunoscute. Un răspuns.', icon: 'math', label: 'Rezolvă proporția' },
  { slug: 'radio', title: 'Radio', category: 'MUZICĂ', description: 'Un soundtrack pentru orice faci.', icon: 'radio', label: 'Alege un post' },
] as const;
export type ToolSlug = typeof tools[number]['slug'];
export const findTool = (slug?: string) => tools.find(tool => tool.slug === slug);
