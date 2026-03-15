const projects = [
  {
    id: 1,
    title: 'AC Frontend Architecture',
    company: 'ActiveCampaign',
    role: 'Lead Software Engineer',
    problem: 'Multiple product teams at ActiveCampaign were stuck shipping features within a legacy monolith release cycle. Attempts to break free led to inconsistent UX, dependency chaos, and painful release coordination.',
    solution: 'Architected a micro-frontend platform using Module Federation in an Nx monorepo that replaced the monolith as the primary UI entry point — enabling independent team deploys, shared runtime dependencies, and a unified experience across the entire product surface.',
    tech: ['React', 'Module Federation', 'Nx', 'Rspack', 'TypeScript'],
    link: null,
  },
  {
    id: 2,
    title: 'FieldproofAI',
    company: 'FieldproofAI',
    role: 'Founder & Engineer',
    problem: 'Roofing contractors and tradesmen lose hours per claim juggling paperwork, PDFs, and adjuster back-and-forth — with no reliable way to catch coverage gaps or generate insurer-ready documentation.',
    solution: 'Built a multi-app platform (web app, marketing site, support portal, native app shipping 2026) that turns on-site photos and job details into AI-generated damage claims, policy analysis, and professional documentation — helping contractors close more jobs, faster.',
    tech: ['React', 'Node.js', 'Python', 'OpenAI', 'PostgreSQL'],
    link: null,
  },
  {
    id: 3,
    title: 'AI-Driven Contact Import',
    company: 'ActiveCampaign',
    role: 'Lead Software Engineer',
    problem: 'Customers were stuck using a clunky, PHP-driven legacy import flow that left them frustrated, confused, and unable to refine or configure their contacts before importing.',
    solution: 'Led a net-new build of an AI-driven contact import from strategy and design collaboration through customer feedback triage to frontend delivery — mentoring a junior engineer while building a performant React-based flow that supports agentic file upload and fine-tuned configuration of contact lists, tags, and fields.',
    tech: ['React', 'TypeScript', 'OpenAI', 'Python', 'ActiveCampaign'],
    link: null,
  },
];

export default projects;
