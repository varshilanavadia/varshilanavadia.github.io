// The Work section's content (src/components/Work.astro): the roles, newest first, then
// education, then skills. The owner's own wording, tightened where it ran long; nothing here
// is to be added to or guessed at. Months are YYYY-MM, as <time> takes them; a role with no
// `to` is the present one.
export interface Entry {
  title: string;
  org: string;
  /** The first and last month, or `when` for anything that is not a span of months. */
  from?: string;
  to?: string;
  when?: { label: string; datetime: string };
  /** `lead` names the team a point belongs to, where there was more than one. */
  points: { lead?: string; text: string }[];
  tools?: string[];
}

export const roles: Entry[] = [
  {
    title: 'Software Engineer',
    org: 'Oracle (NetSuite)',
    from: '2022-05',
    points: [
      { text: 'Designing and developing customer experiences and features for Oracle’s ERP software, NetSuite.' },
      { text: 'Debugging and troubleshooting customer issues, and building enhancements within an existing software architecture to suggest improvements to it.' },
    ],
    tools: ['Java', 'SQL', 'TypeScript', 'SuiteScript', 'Oracle JET', 'React'],
  },
  {
    title: 'Software Engineer (Data Analytics)',
    org: 'Nike (contract via Ernst & Young)',
    from: '2020-09',
    to: '2022-05',
    points: [
      {
        lead: 'Membership Lifecycle and Growth Analytics team, Consumer Insights',
        text: 'Developed a data warehouse and pipelines to support membership growth strategy by analyzing member lifecycle, churn and communication data (about 30 billion records and more) across all digital platforms, using a member health framework.',
      },
      {
        lead: 'Consumer Planning Analytics team, Commercial Analytics',
        text: 'Developed self-service analytics products on SQL Server Analysis Services by creating intermediary data layers, leading end-to-end data analysis to validate integrity, and conducting QA/UA tests under agile methodologies.',
      },
      { text: 'Identified data gaps and proposed solutions to improve attribute and data coverage by driving root cause analysis, analyzing dimensional and transactional data, developing mitigation plans and maintaining ETL pipelines.' },
      { text: 'Informed product strategy and engaged with product and analytics stakeholders to increase data quality by 35% and user adoption by 50% by mining data, solving complex pipeline issues and improving related data joins.' },
      { text: 'Coordinated the organization-wide consumer direct acceleration strategy by gathering requirements, identifying risks, integrating data sets into products and communicating with project stakeholders for improved data reporting.' },
      { text: 'Received 5 accolade awards for proactively leading with empathy, curiosity, authenticity and a growth mindset.' },
    ],
    tools: ['Python', 'Apache Spark', 'Apache Hive', 'AWS', 'Databricks', 'SQL', 'Snowflake', 'Airflow'],
  },
  {
    title: 'Software Engineer (Research)',
    org: 'Hong Kong University of Science and Technology',
    from: '2017-01',
    to: '2017-07',
    points: [
      { text: 'Increased indoor localization accuracy by 20% to forecast dimensional type-2 Wi-Fi signal strength by designing and developing a forecasting module and reducing localization error for people sensing and user analytics in public places.' },
      { text: 'Assessed and analyzed the network testbed by configuring access points and optimizing placements of wireless routers for production deployment on the Smart AP project (Wi-Fi Positioning and Optimizing for Smart Cities).' },
      { text: 'Funded by a HKD 60,000 scholarship under the International Visiting Internship Student Program by Dr. Gary SH Chan.' },
    ],
    tools: ['Java', 'MATLAB', 'GitHub', 'Time series forecasting', 'OpenWRT'],
  },
];

export const education: Entry[] = [
  {
    title: 'MS Computer Science',
    org: 'The Pennsylvania State University',
    when: { label: 'Class of 2020', datetime: '2020' },
    points: [
      { text: 'Received an outstanding community service award for hosting cultural workshops as a global cultural ambassador.' },
    ],
  },
];

export const skills = ['Java', 'Python', 'Apache Spark', 'Git', 'SQL', 'Bash', 'Snowflake', 'Databricks', 'Tableau', 'JavaScript'];
