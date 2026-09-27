import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample trends
  const trends = await Promise.all([
    prisma.trend.create({
      data: {
        name: 'Roblox Dev Life',
        type: 'topic',
        status: 'EXPLODING',
        platform: 'tiktok',
        growthSignal: 0.95,
        viralityScore: 95,
        tigerRelevance: 90,
        competitionLevel: 0.7,
        estimatedAge: 12,
        expectedLifespan: 72,
        whyTrending: 'Developers sharing Roblox development struggles and wins',
        currentUsage: 'Trending across TikTok and YouTube Shorts'
      }
    }),
    prisma.trend.create({
      data: {
        name: 'POV Gaming',
        type: 'format',
        status: 'ACTIVE',
        platform: 'tiktok',
        growthSignal: 0.8,
        viralityScore: 80,
        tigerRelevance: 75,
        competitionLevel: 0.8,
        estimatedAge: 48,
        expectedLifespan: 144,
        whyTrending: 'POV videos dominate gaming content',
        currentUsage: 'High engagement on gaming creators'
      }
    }),
    prisma.trend.create({
      data: {
        name: 'Tech Startup Stories',
        type: 'topic',
        status: 'ACTIVE',
        platform: 'x',
        growthSignal: 0.7,
        viralityScore: 70,
        tigerRelevance: 85,
        competitionLevel: 0.6,
        estimatedAge: 24,
        expectedLifespan: 96,
        whyTrending: 'Entrepreneurial content resonates strongly',
        currentUsage: 'Viral threads on X/Twitter'
      }
    })
  ]);

  // Create sample content ideas
  const contentIdeas = await Promise.all([
    prisma.contentIdea.create({
      data: {
        title: 'My First Roblox Game: It Failed (POV)',
        contentType: 'POV',
        advertising: 'Low',
        trendScore: 92,
        virality: 88,
        tigerRelevance: 85,
        difficulty: 'Easy',
        duration: '15s',
        descriptionDe: 'Show the struggle of creating a Roblox game and its disappointing results',
        whyNowDe: 'Everyone relates to failed projects and the learning process',
        howToMakeDe: 'Record yourself working on Roblox studio, show failures, end with lessons learned',
        onScreenConcept: "It's okay to fail. Growth comes from mistakes.",
        captionEn: 'Failed at my first Roblox game 😅 Turned into a learning moment! #Roblox #DevLife',
        hashtagsEn: '#Roblox #DevLife #Gaming #Tutorial #Learning',
        status: 'NEW',
        trendId: trends[0].id
      }
    }),
    prisma.contentIdea.create({
      data: {
        title: '10 Roblox Scripts You Need to Know',
        contentType: 'Educational',
        advertising: 'Low',
        trendScore: 85,
        virality: 82,
        tigerRelevance: 90,
        difficulty: 'Medium',
        duration: '45s',
        descriptionDe: 'Quick guide to essential Roblox Lua scripts',
        whyNowDe: 'New developers are constantly learning Lua',
        howToMakeDe: 'Fast-paced tutorial showing 10 useful scripts with explanations',
        onScreenConcept: 'Essential Scripts for Every Roblox Developer',
        captionEn: '10 Roblox scripts that will save you hours! ⚡ #Roblox #Lua #Scripting',
        hashtagsEn: '#Roblox #Lua #Programming #Tutorial #Scripts',
        status: 'NEW',
        trendId: trends[0].id
      }
    }),
    prisma.contentIdea.create({
      data: {
        title: 'Why I Built My Own Game Engine',
        contentType: 'Storytelling',
        advertising: 'Medium',
        trendScore: 88,
        virality: 85,
        tigerRelevance: 78,
        difficulty: 'Hard',
        duration: '60s',
        descriptionDe: 'Document the journey of creating a custom game engine',
        whyNowDe: 'Technical deep-dive content performs very well',
        howToMakeDe: 'Narrative-style video with visualizations of engine components',
        onScreenConcept: 'From Zero to Custom Engine',
        captionEn: 'Building my own game engine from scratch was INSANE 🤯 #Gamedev #Engineering',
        hashtagsEn: '#Gamedev #Engineering #Programming #DevLife #Tutorial',
        status: 'NEW',
        trendId: trends[0].id
      }
    })
  ]);

  // Create sample brand opportunities
  const brandOpportunities = await Promise.all([
    prisma.brandCommentOpportunity.create({
      data: {
        videoUrl: 'https://www.tiktok.com/@example/video/1234567890',
        platform: 'tiktok',
        title: 'Best Roblox Tutorials for Beginners',
        description: 'Viral video with 1.2M views discussing Roblox development tips',
        viewCount: 1200000,
        likeCount: 98000,
        commentCount: 8500,
        shareCount: 4500,
        brandAccounts: JSON.stringify([]),
        suggestedComments: JSON.stringify([
          { style: 'Casual', text: 'Great tutorials! 🎮' },
          { style: 'Professional', text: 'This is exactly what I was looking for.' },
          { style: 'Witty', text: 'Finally someone gets it! 😂' }
        ])
      }
    })
  ]);

  // Create sample competitors
  const competitors = await Promise.all([
    prisma.competitor.create({
      data: {
        username: 'robloxdev',
        platform: 'tiktok',
        displayName: 'Roblox Developers Hub',
        bio: 'Daily tips and tutorials for Roblox creators',
        followerCount: 25000,
        isApproved: true
      }
    }),
    prisma.competitor.create({
      data: {
        username: 'devlife',
        platform: 'x',
        displayName: 'Developer Life',
        bio: 'Software engineering stories and tips',
        followerCount: 185000,
        isApproved: true
      }
    })
  ]);

  // Create sample what works insights
  const insights = await Promise.all([
    prisma.whatWorksInsight.create({
      data: {
        insight: 'POV format performs 40% better for gaming content',
        category: 'content_type',
        confidence: 0.85,
        sampleSize: 127,
        supportingData: JSON.stringify({ averageEngagement: 8.5 })
      }
    }),
    prisma.whatWorksInsight.create({
      data: {
        insight: 'First 3 seconds determine retention',
        category: 'hooks',
        confidence: 0.78,
        sampleSize: 203,
        supportingData: JSON.stringify({ avgRetention: 72 })
      }
    }),
    prisma.whatWorksInsight.create({
      data: {
        insight: 'Educational content performs 35% better on TikTok vs YouTube',
        category: 'platform',
        confidence: 0.82,
        sampleSize: 89,
        supportingData: JSON.stringify({ tikTokVsYt: 1.35 })
      }
    })
  ]);

  console.log('✅ Seeding complete!');
  console.log(`  - ${trends.length} trends`);
  console.log(`  - ${contentIdeas.length} content ideas`);
  console.log(`  - ${brandOpportunities.length} brand opportunities`);
  console.log(`  - ${competitors.length} competitors`);
  console.log(`  - ${insights.length} insights`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
