const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.studySession.deleteMany();
  await prisma.task.deleteMany();
  await prisma.healthMetric.deleteMany();
  await prisma.personalityProfile.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const admin = await prisma.user.create({
    data: { name: "Admin User", email: "admin@bio-adaptive.edu", role: "ADMIN", chronotype: "BEAR", baseSleepNeed: 8, onboardingDone: true },
  });
  const student = await prisma.user.create({
    data: { name: "Alex Student", email: "alex@bio-adaptive.edu", role: "STUDENT", chronotype: "WOLF", baseSleepNeed: 7, onboardingDone: true },
  });
  const professor = await prisma.user.create({
    data: { name: "Dr. Sarah Prof", email: "sarah@bio-adaptive.edu", role: "PROFESSOR", chronotype: "LION", baseSleepNeed: 8, onboardingDone: false },
  });
  const normal = await prisma.user.create({
    data: { name: "Guest Parent", email: "guest@bio-adaptive.edu", role: "NORMAL", chronotype: "BEAR", baseSleepNeed: 8, onboardingDone: false },
  });
  const tech = await prisma.user.create({
    data: { name: "Tech Support", email: "support@bio-adaptive.edu", role: "TECHNICAL", chronotype: "DOLPHIN", baseSleepNeed: 7, onboardingDone: false },
  });

  // User profiles
  await prisma.userProfile.create({
    data: {
      userId: student.id,
      subjects: JSON.stringify(["Mathematics", "Physics", "Computer Science"]),
      goals: JSON.stringify(["Exam Preparation", "Skill Building"]),
      learningStyle: "Visual",
      resourcePrefs: "Video",
      institution: "State University",
      gradeLevel: "Year 2",
    },
  });

  // Personality profiles
  await prisma.personalityProfile.create({
    data: {
      userId: student.id,
      personalityType: "Architect",
      scores: JSON.stringify({ Explorer: 2, Architect: 5, Collaborator: 1, Practitioner: 2 }),
    },
  });

  // Health metrics for student
  await prisma.healthMetric.create({
    data: { userId: student.id, sleepDuration: 7.0, sleepQuality: 7, stressLevel: 4 },
  });
  await prisma.healthMetric.create({
    data: { userId: admin.id, sleepDuration: 7.5, sleepQuality: 8, stressLevel: 3 },
  });

  // Tasks for student
  const now = new Date();
  const tasks = [
    { title: "Calculus Problem Set", description: "Chapter 5 integration exercises", complexity: 9, estimatedDuration: 90, maxDuration: 120, deadline: new Date(now.getTime() + 24 * 3600 * 1000) },
    { title: "Physics Lab Report", description: "Write up quantum tunneling experiment", complexity: 7, estimatedDuration: 60, maxDuration: 90, deadline: new Date(now.getTime() + 48 * 3600 * 1000) },
    { title: "CS Algorithm Review", description: "Dijkstra and A* pathfinding", complexity: 6, estimatedDuration: 45, maxDuration: 60, deadline: new Date(now.getTime() + 72 * 3600 * 1000) },
    { title: "Spaced Repetition", description: "SM-2 flashcard queue", complexity: 3, estimatedDuration: 30, maxDuration: 40, deadline: new Date(now.getTime() + 12 * 3600 * 1000) },
    { title: "Reflective Journal", description: "Metacognitive reflection log", complexity: 2, estimatedDuration: 15, maxDuration: 20, deadline: new Date(now.getTime() + 6 * 3600 * 1000) },
  ];

  for (const t of tasks) {
    await prisma.task.create({ data: { ...t, userId: student.id } });
  }

  console.log("✅ Seed complete — 5 users, profiles, personality, health metrics, and tasks created.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
