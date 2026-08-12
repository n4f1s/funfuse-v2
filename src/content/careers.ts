/**
 * FunFuse Careers page content.
 *
 * Source of truth:
 * https://funfusegames.com/careers/
 *
 * Verified: 2026-08-12
 *
 * Content is derived only from the official FunFuse careers page.
 * Obvious spelling/grammar mistakes from the legacy WordPress page have been
 * normalized for display, but no job requirements, benefits, culture claims,
 * contact details, or other factual claims have been added.
 */

export type CareerJob = {
  title: string;
  requirements: readonly string[];
  goodToHave: readonly string[];
  applyEmail: string;
};

export type CareerBenefitGroup = {
  title: string;
  items: readonly string[];
};

export const careersContent = {
  sourceUrl: "https://funfusegames.com/careers/",
  verifiedAt: "2026-08-12",

  hero: {
    eyebrow: "Careers",
    title: "Start your adventure today",
    description:
      "If you’re excited about the prospect of working with us and meet the qualifications below, please apply to join our team.",
  },

  benefits: {
    title: "Benefits & Perks",
    groups: [
      {
        title: "Career development",
        items: [
          "Two performance reviews every year, with yearly increments.",
          "Two festival bonuses.",
          "Yearly tour.",
          "Regular team outings.",
        ],
      },
      {
        title: "Culture",
        items: [
          "Our team is currently fully remote.",
          "We value passion and are trying to create a talent-dense culture.",
          "Everyone is heard and respected.",
          "Everyone can share feedback to help others improve.",
        ],
      },
    ] satisfies readonly CareerBenefitGroup[],
  },

  jobs: [
    {
      title: "Junior Game Developer L1 (Unity)",
      requirements: [
        "Must have a good understanding of Unity and C#.",
        "Great problem-solving capability.",
        "Good knowledge of Data Structure and Algorithms.",
      ],
      goodToHave: [
        "Playing a lot of casual, puzzle, card, or board games would be a plus.",
        "Having live games on the Play Store would be a plus, but is not necessary.",
        "A good understanding of shaders would be a plus, but is not necessary.",
        "Excellent English communication and writing skills.",
        "Passion for games.",
      ],
      applyEmail: "hr@funfusegames.com",
    },
    {
      title: "Junior Game Developer L2 (Unity)",
      requirements: [
        "1+ years of proven professional experience as a Unity game developer.",
        "Must have a great understanding of C#, Unity APIs, and Version Control (Git).",
        "Understanding of various game programming architectures and patterns.",
        "Good knowledge of Data Structure and Algorithms.",
        "Great problem-solving capability.",
        "Experience integrating third-party SDKs such as PlayFab, Firebase, and AdMob.",
      ],
      goodToHave: [
        "Playing a lot of casual, puzzle, card, or board games would be a plus.",
        "Having live games on the Play Store would be a plus, but is not necessary.",
        "Good knowledge of shaders, skeleton animations, multiplayer networking, and editor scripting.",
        "Excellent English communication and writing skills.",
        "Passion for games.",
      ],
      applyEmail: "hr@funfusegames.com",
    },
    {
      title: "Junior Game Artist (2D)",
      requirements: [
        "Create game UI/UX mocks, game assets, and game icons.",
        "Create marketing creatives.",
        "Must have good design, color, UI, and UX sense.",
        "Experience with Illustrator and Photoshop.",
        "You have to be self-motivated, energetic, and open to learning new things.",
      ],
      goodToHave: [
        "Playing a lot of casual, puzzle, card, or board games would be a plus.",
        "Video editing or animation skills would be a huge plus, but are not necessary.",
        "A basic understanding of Unity would be a plus, but is not necessary.",
      ],
      applyEmail: "hr@funfusegames.com",
    },
  ] satisfies readonly CareerJob[],
} as const;

export type CareersContent = typeof careersContent;
