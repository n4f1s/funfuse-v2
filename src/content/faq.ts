export type FaqEntry = {
  question: string;
  answer: string;
};

export const faqContent = {
  eyebrow: "Player support",
  title: "Frequently asked questions",
  description:
    "Answers to common questions about FunFuse games, offline play, accounts, privacy, updates, and support.",
  support: {
    title: "Still need help?",
    body: "Experiencing problems? Stuck on a level? Found a weird bug? Write us and we’ll do our best to figure out how to fix it. If you have suggestions or feedback, please send us an email.",
    email: "support@funfusegames.com",
  },
  entries: [
    {
      question: "What types of games do you offer?",
      answer:
        "We specialize in free-to-play card and board games that you can enjoy on your mobile devices. Our games are designed for all ages and skill levels, offering a wide range of engaging and entertaining experiences. Whether you enjoy classic board games or innovative card games, we have something for everyone. Our focus is on providing high-quality, fun, and accessible games that bring people together.",
    },
    {
      question: "Are your games really free?",
      answer:
        "Yes! All our games are free to download and play. We believe in making our games accessible to everyone, so you can enjoy the full experience without any cost. While we offer in-game purchases for additional content and features, these are entirely optional. You can have a complete and enjoyable gaming experience without spending any money. The in-game purchases are there for players who wish to enhance their experience further.",
    },
    {
      question: "Can I play your games offline?",
      answer:
        "Some features may require an internet connection, but many aspects of our games can be enjoyed offline. Check the specific game’s page for more details. We understand that players may not always have access to the internet, so we’ve designed our games to be enjoyable even without a connection. Offline modes allow you to play solo or against AI opponents, ensuring you can have fun anytime, anywhere.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "If you wish to delete your account, please contact our support team at support@funfusegames.com. Note that this action is irreversible and will result in the loss of all your game progress. We recommend considering this decision carefully before proceeding. Our support team is available to assist you with any concerns or questions you may have about account deletion.",
    },
    {
      question: "I encountered a bug, what should I do?",
      answer:
        "We’re sorry for the inconvenience. Please contact our support team through the in-game support feature or email us at support@funfusegames.com with a description of the issue and any relevant screenshots. Our team is dedicated to providing timely assistance and resolving any issues you may encounter. Your feedback helps us improve the game and ensure a better experience for all players.",
    },
    {
      question: "How do you protect my privacy?",
      answer:
        "We take your privacy seriously and employ industry-standard security measures to protect your data. For more information, please refer to our Privacy Policy. Our commitment to your privacy includes using encryption, secure servers, and other technologies to keep your data safe. We continuously review and update our practices to ensure the highest level of security.",
    },
    {
      question: "How can I stay updated on new releases and updates?",
      answer:
        "Follow us on social media, subscribe to our newsletter, or regularly check our website for the latest news and updates. We provide regular updates on new game releases, features, and events. Stay connected with us to never miss out on important announcements and opportunities to engage with our community.",
    },
  ] satisfies readonly FaqEntry[],
} as const;
