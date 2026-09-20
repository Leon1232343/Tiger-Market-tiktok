import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding initial database state with SQLite...');

  // Create sample trends
  const trend1 = await prisma.trend.create({
    data: {
      name: 'POV: You hired a cheap Roblox scripter',
      type: 'format',
      status: 'EXPLODING',
      platform: 'tiktok',
      growthSignal: 0.95,
      viralityScore: 92,
      tigerRelevance: 88,
      competitionLevel: 0.3,
      estimatedAge: 12,
      expectedLifespan: 72,
      whyTrending: 'Extremely relatable pain point for indie Roblox game developers dealing with broken code.',
      currentUsage: 'Creators showing hilarious glitches in games caused by terrible custom scripts.',
      exampleVideos: JSON.stringify([{ platform: 'tiktok', url: 'https://tiktok.com', views: 1200000, likes: 145000, title: 'When the scripter says "it works on my machine"' }]),
      sourceLinks: JSON.stringify([{ platform: 'tiktok', url: 'https://tiktok.com' }]),
      detectedAt: new Date(),
    },
  });

  const trend2 = await prisma.trend.create({
    data: {
      name: 'Roblox Studio UI Redesign Panic',
      type: 'topic',
      status: 'RISING',
      platform: 'youtube',
      growthSignal: 0.85,
      viralityScore: 84,
      tigerRelevance: 95,
      competitionLevel: 0.2,
      estimatedAge: 24,
      expectedLifespan: 120,
      whyTrending: 'Latest Roblox Studio update changed UI layouts, causing mass confusion among builders.',
      currentUsage: 'Dramatic reaction videos and tutorials on how to find missing buttons.',
      exampleVideos: JSON.stringify([{ platform: 'youtube', url: 'https://youtube.com', views: 450000, likes: 32000, title: 'Where did my properties window go?!' }]),
      sourceLinks: JSON.stringify([{ platform: 'youtube', url: 'https://youtube.com' }]),
      detectedAt: new Date(),
    },
  });

  const trend3 = await prisma.trend.create({
    data: {
      name: 'Audio: "Is this real or is this just fantasy?" (sped up synth)',
      type: 'sound',
      status: 'ACTIVE',
      platform: 'tiktok',
      growthSignal: 0.75,
      viralityScore: 78,
      tigerRelevance: 60,
      competitionLevel: 0.6,
      estimatedAge: 48,
      expectedLifespan: 168,
      whyTrending: 'Used for before/after showcases of building transformation or GFX rendering.',
      currentUsage: 'Transitions from gray boxout to fully detailed game world.',
      soundLink: 'https://tiktok.com/music/fake-fantasy',
      exampleVideos: JSON.stringify([{ platform: 'tiktok', url: 'https://tiktok.com', views: 850000, likes: 98000, title: 'Map progress over 2 years' }]),
      sourceLinks: JSON.stringify([{ platform: 'tiktok', url: 'https://tiktok.com' }]),
      detectedAt: new Date(),
    },
  });

  // Create initial content ideas
  await prisma.contentIdea.create({
    data: {
      title: 'The 3 types of Roblox scripters you meet in Discord',
      contentType: 'Meme',
      advertising: 'Low',
      trendScore: 92,
      virality: 95,
      tigerRelevance: 85,
      difficulty: 'Easy',
      duration: '15-20 seconds',
      descriptionDe: 'Ein humorvolles Video über die verschiedenen Typen von Scriptern auf Roblox-Discord-Servern.',
      whyNowDe: 'Das Thema Entwicklung und Discord-Collaboration ist gerade extrem präsent.',
      howToMakeDe: 'Spiele selbst 3 Charaktere: Der „Es ist ein Feature“-Scripter, der Ghoster und der 14-jährige Wunderkind.',
      onScreenConcept: 'Text overlay: "The 3 types of scripters in your dev server"',
      captionEn: 'Which one are you trusting with your game? 💀 #robloxdev #gamedev #roblox',
      hashtagsEn: '#robloxdev #gamedev #roblox #coding #indiegames',
      status: 'NEW',
      trendId: trend1.id,
      inspirationLinks: JSON.stringify([]),
    },
  });

  await prisma.contentIdea.create({
    data: {
      title: 'POV: You tried hiring a builder on Twitter instead of Tiger Market',
      contentType: 'POV',
      advertising: 'Medium',
      trendScore: 88,
      virality: 85,
      tigerRelevance: 98,
      difficulty: 'Medium',
      duration: '12-15 seconds',
      descriptionDe: 'Zeigt den Frust, wenn man auf Twitter nach Entwicklern sucht und nur gescammt wird.',
      whyNowDe: 'Viele Entwickler beklagen sich aktuell über unzuverlässige Freelancer.',
      howToMakeDe: 'Verwende einen verzweifelten Gesichts-Filter und zeige Chat-Verläufe, die im Nirgendwo enden.',
      onScreenConcept: 'POV: Searching for a Roblox builder on Twitter in 2026',
      captionEn: 'Skip the drama and find verified devs in one marketplace. Link in bio! 🐯 #robloxdev #gamedev',
      hashtagsEn: '#robloxdev #roblox #gamedev #marketplace',
      status: 'NEW',
      trendId: trend2.id,
      inspirationLinks: JSON.stringify([]),
    },
  });

  await prisma.contentIdea.create({
    data: {
      title: 'Building a map in 1 hour vs 100 hours',
      contentType: 'Comparison',
      advertising: 'Low',
      trendScore: 82,
      virality: 90,
      tigerRelevance: 70,
      difficulty: 'Easy',
      duration: '10-14 seconds',
      descriptionDe: 'Ein schneller visueller Vergleich von einem hässlichen Block-Modell zu einer fotorealistischen Map.',
      whyNowDe: 'Visuelle Transformations-Videos laufen auf TikTok und YouTube Shorts derzeit astronomisch gut.',
      howToMakeDe: 'Nutze den Synth-Sound, zeige links graue Blöcke mit Fehlern, rechts atemberaubende Beleuchtung.',
      onScreenConcept: '1 hour blockout vs 100 hours of suffering',
      captionEn: 'Trust the process. 😭✨ #robloxbuilds #robloxdev #gamedev #blender',
      hashtagsEn: '#robloxbuilds #robloxdev #gamedev #blender #roblox',
      status: 'NEW',
      trendId: trend3.id,
      inspirationLinks: JSON.stringify([]),
    },
  });

  // Create initial brand comment opportunities
  await prisma.brandCommentOpportunity.create({
    data: {
      videoUrl: 'https://tiktok.com/@example/video/123456',
      platform: 'tiktok',
      title: 'When your game hits 10k concurrents out of nowhere',
      description: 'A developer celebrating unexpected viral success on Roblox.',
      viewCount: 2400000,
      likeCount: 310000,
      commentCount: 4200,
      shareCount: 15000,
      brandAccounts: JSON.stringify([
        { username: 'Ryanair', platform: 'tiktok', comment: 'Charge them baggage fees for the server load.' },
        { username: 'Duolingo', platform: 'tiktok', comment: 'Did they do their Spanish lessons before hitting 10k?' },
      ]),
      suggestedComments: JSON.stringify([
        { text: 'Time to hire 5 more scripters before the data store explodes.', style: 'playful', rating: null },
        { text: 'Bro unlocked the success achievement before finishing the tutorial.', style: 'meme', rating: null },
        { text: 'We have a marketplace for when you need to panic-hire devs at 3 AM.', style: 'sarcastic', rating: null },
      ]),
      detectedAt: new Date(),
    },
  });

  // Create initial competitors
  await prisma.competitor.create({
    data: {
      username: 'Ryanair',
      platform: 'tiktok',
      displayName: 'Ryanair',
      bio: 'We charge you for breathing.',
      followerCount: 2500000,
      isApproved: true,
      isPaused: false,
    },
  });

  await prisma.competitor.create({
    data: {
      username: 'Duolingo',
      platform: 'tiktok',
      displayName: 'Duolingo',
      bio: 'The owl is watching.',
      followerCount: 8900000,
      isApproved: true,
      isPaused: false,
    },
  });

  // Create initial categories
  await prisma.contentCategory.create({
    data: {
      name: 'Fake Corporate Ads',
      description: 'Satirical, self-aware corporate advertisements that mock traditional marketing.',
      examples: JSON.stringify([{ title: 'How to ruin your game in 3 easy steps', url: 'https://tiktok.com' }]),
      tigerPotential: 'High potential to position Tiger Market as the cool, anti-corporate marketplace for devs.',
      isApproved: true,
    },
  });

  await prisma.contentCategory.create({
    data: {
      name: 'Developer Therapy / Venting',
      description: 'Relatable rants about coding bugs, difficult clients, and annoying engine updates.',
      examples: JSON.stringify([{ title: 'Why NULL is my worst enemy', url: 'https://tiktok.com' }]),
      tigerPotential: 'Direct connection to target audience pain points.',
      isApproved: false,
    },
  });

  // Create what works insights
  await prisma.whatWorksInsight.create({
    data: {
      insight: 'POV videos under 15 seconds generate 2.3x more profile visits than direct promotional posts.',
      category: 'content_type',
      confidence: 0.92,
      sampleSize: 45,
    },
  });

  await prisma.whatWorksInsight.create({
    data: {
      insight: 'Low advertising posts achieve 40% higher share rates than posts with explicit CTAs.',
      category: 'advertising',
      confidence: 0.88,
      sampleSize: 60,
    },
  });

  console.log('Seeding completed successfully with SQLite!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
