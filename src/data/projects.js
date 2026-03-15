const projects = [
  {
    id: 1,
    title: 'Design System & Component Library',
    problem: 'Teams were building UI inconsistently across 12 products — fragmented experiences for users and duplicated work for engineers.',
    solution: 'Led the frontend effort on a token-driven design system with a shared component library and documentation site, bringing consistency across products and cutting UI development time by 40%.',
    tech: ['React', 'TypeScript', 'Storybook', 'Style Dictionary', 'Figma API'],
    link: null,
  },
  {
    id: 2,
    title: 'Real-Time Analytics Dashboard',
    problem: 'Product managers had zero visibility into live user behavior — every decision relied on stale, day-old batch reports.',
    solution: 'Architected and delivered a streaming dashboard with live charts, filterable event timelines, and alerting — processing 50k events/second with sub-200ms render times. Became the most-used internal tool.',
    tech: ['React', 'D3.js', 'WebSockets', 'Node.js', 'ClickHouse'],
    link: null,
  },
  {
    id: 3,
    title: 'Developer Portal & Onboarding',
    problem: 'Third-party developers faced a 3-day average onboarding time due to fragmented docs and manual API key provisioning.',
    solution: 'Built a self-serve developer portal with an interactive API explorer and CLI tool that cut onboarding to under 30 minutes — directly improving developer adoption and retention.',
    tech: ['Next.js', 'MDX', 'OpenAPI', 'Node.js', 'OAuth 2.0'],
    link: null,
  },
];

export default projects;
