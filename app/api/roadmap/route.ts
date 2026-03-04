import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

/* ─── Personality-Based Study Blueprints ──────────────────────────────────── */
const PERSONALITY_SCHEDULES: Record<string, {
    dailyBlocks: { time: string; activity: string; duration: number; type: string; reason: string }[];
    weeklyFocus: { day: string; theme: string; hours: number }[];
    roadmapPhases: { phase: string; weeks: string; focus: string; milestones: string[] }[];
    studyTips: string[];
    optimalSessionLength: number;
    breakPattern: string;
}> = {
    Explorer: {
        dailyBlocks: [
            { time: "09:00", activity: "Curiosity Hour — Explore a new topic", duration: 60, type: "deep", reason: "Explorers thrive on novelty; start with something new to hook motivation" },
            { time: "10:00", activity: "Cross-linking — Connect today's topic to prior knowledge", duration: 30, type: "medium", reason: "Building concept maps cements broad understanding" },
            { time: "10:30", activity: "Break — Walk or creative activity", duration: 15, type: "break", reason: "Movement refreshes divergent thinking" },
            { time: "10:45", activity: "Video deep-dive (YouTube / 3Blue1Brown)", duration: 45, type: "deep", reason: "Visual explanations match Explorer learning style" },
            { time: "11:30", activity: "Quick practice problems", duration: 30, type: "light", reason: "Short practice prevents Explorer fatigue from repetition" },
            { time: "12:00", activity: "Lunch break", duration: 60, type: "break", reason: "Reset before afternoon" },
            { time: "13:00", activity: "Subject rotation — Switch topic entirely", duration: 45, type: "deep", reason: "Explorers lose focus on single-subject marathons" },
            { time: "13:45", activity: "Mind map / Concept sketch", duration: 30, type: "medium", reason: "Visual synthesis locks in connections" },
            { time: "14:15", activity: "Break — Creative reset", duration: 15, type: "break", reason: "Prevents cognitive tunneling" },
            { time: "14:30", activity: "Resource discovery — Browse OpenStax / MIT OCW", duration: 30, type: "light", reason: "Feed the curiosity drive before ending" },
            { time: "15:00", activity: "Reflective journal — What surprised me today?", duration: 15, type: "admin", reason: "Metacognitive reflection cements insight" },
        ],
        weeklyFocus: [
            { day: "Monday", theme: "New Territory", hours: 4 },
            { day: "Tuesday", theme: "Deep Dive Subject A", hours: 3.5 },
            { day: "Wednesday", theme: "Creative Connections", hours: 3 },
            { day: "Thursday", theme: "Deep Dive Subject B", hours: 3.5 },
            { day: "Friday", theme: "Review + Explore", hours: 3 },
            { day: "Saturday", theme: "Project / Side Quest", hours: 2 },
            { day: "Sunday", theme: "Rest + Light Reading", hours: 1 },
        ],
        roadmapPhases: [
            { phase: "Foundation", weeks: "Weeks 1–3", focus: "Survey all subjects broadly", milestones: ["Complete subject overview maps", "Identify 3 areas of deep interest", "Set up resource library"] },
            { phase: "Exploration", weeks: "Weeks 4–8", focus: "Deep dives into interest areas with cross-linking", milestones: ["Complete 2 mini-projects", "Build concept network across subjects", "Watch 20+ educational videos"] },
            { phase: "Integration", weeks: "Weeks 9–12", focus: "Synthesize knowledge, connect dots", milestones: ["Create comprehensive mind map", "Teach one topic to a peer", "Write summary essays"] },
            { phase: "Mastery Sprint", weeks: "Weeks 13–16", focus: "Exam prep + gaps filling", milestones: ["Complete practice exams", "Review weak areas", "Final concept review"] },
        ],
        studyTips: [
            "Rotate subjects every 45–60 min to keep novelty high",
            "Use concept maps and visual tools — mind maps are your superpower",
            "Watch videos from different educators on the same topic for multiple perspectives",
            "Set a 'curiosity budget' — 20% of study time for unstructured exploration",
            "Keep a 'What surprised me today?' journal",
        ],
        optimalSessionLength: 45,
        breakPattern: "45-min focus → 10-min creative break → repeat",
    },

    Architect: {
        dailyBlocks: [
            { time: "08:00", activity: "Review yesterday's spaced repetition cards", duration: 30, type: "light", reason: "SM-2 algorithm works best with consistent morning review" },
            { time: "08:30", activity: "Structured lecture / textbook chapter", duration: 60, type: "deep", reason: "Architects excel with linear, structured content" },
            { time: "09:30", activity: "Note-taking — Cornell method", duration: 30, type: "medium", reason: "Structured notes cement systematic understanding" },
            { time: "10:00", activity: "Break — Light stretching", duration: 10, type: "break", reason: "Brief, structured break maintains flow" },
            { time: "10:10", activity: "Problem set — Structured exercises", duration: 50, type: "deep", reason: "Deliberate practice with clear progress tracking" },
            { time: "11:00", activity: "Self-test — Practice quiz", duration: 30, type: "medium", reason: "Active recall is the Architect's strongest tool" },
            { time: "11:30", activity: "Progress tracking — Update study log", duration: 15, type: "admin", reason: "Architects are motivated by visible progress" },
            { time: "11:45", activity: "Lunch break", duration: 75, type: "break", reason: "Adequate recovery before PM session" },
            { time: "13:00", activity: "Deep work — Hardest subject of the day", duration: 60, type: "deep", reason: "Post-lunch dip is minimal for disciplined Architects" },
            { time: "14:00", activity: "Flashcard creation — New cards for today's material", duration: 30, type: "medium", reason: "Building the SM-2 deck for future retention" },
            { time: "14:30", activity: "Break — Walk", duration: 15, type: "break", reason: "Physical reset" },
            { time: "14:45", activity: "Review + Plan tomorrow's schedule", duration: 30, type: "admin", reason: "Architects thrive with planned next-day agendas" },
        ],
        weeklyFocus: [
            { day: "Monday", theme: "Mathematics deep work", hours: 5 },
            { day: "Tuesday", theme: "Science / Physics", hours: 4.5 },
            { day: "Wednesday", theme: "Problem sets + testing", hours: 4 },
            { day: "Thursday", theme: "CS / Technical skills", hours: 4.5 },
            { day: "Friday", theme: "Review + Spaced repetition", hours: 3.5 },
            { day: "Saturday", theme: "Weak area remediation", hours: 3 },
            { day: "Sunday", theme: "Light review + Planning", hours: 1.5 },
        ],
        roadmapPhases: [
            { phase: "Foundation", weeks: "Weeks 1–4", focus: "Master fundamentals systematically", milestones: ["Complete foundational chapters", "Build flashcard decks (200+ cards)", "Establish daily routine"] },
            { phase: "Structured Build", weeks: "Weeks 5–9", focus: "Progressive difficulty increase", milestones: ["Complete all problem sets", "Score 70%+ on practice tests", "Fill knowledge gaps identified by testing"] },
            { phase: "Optimization", weeks: "Weeks 10–13", focus: "Refine weak areas, increase speed", milestones: ["Score 85%+ on practice tests", "Master spaced repetition queue", "Complete timed practice exams"] },
            { phase: "Peak Performance", weeks: "Weeks 14–16", focus: "Final review + exam simulation", milestones: ["Full-length timed mock exams", "Review error patterns", "Confident exam readiness"] },
        ],
        studyTips: [
            "Use the Pomodoro technique: 50 min work + 10 min break",
            "Track everything — hours studied, scores, completion rates",
            "Create structured study plans with daily and weekly goals",
            "Use spaced repetition (Anki/SM-2) religiously — it's made for you",
            "Don't skip the planning phase; your plans ARE your superpower",
        ],
        optimalSessionLength: 50,
        breakPattern: "50-min Pomodoro → 10-min break → repeat (4 cycles → 30-min long break)",
    },

    Collaborator: {
        dailyBlocks: [
            { time: "09:00", activity: "Community check-in — Forums / Study group chat", duration: 20, type: "light", reason: "Collaborators activate best through social connection" },
            { time: "09:20", activity: "Paired reading / Study buddy session", duration: 50, type: "deep", reason: "Learning with others keeps Collaborators engaged" },
            { time: "10:10", activity: "Discuss and explain — Teach what you learned", duration: 30, type: "medium", reason: "The Feynman technique: if you can teach it, you know it" },
            { time: "10:40", activity: "Break — Chat with peers", duration: 15, type: "break", reason: "Social recharge" },
            { time: "10:55", activity: "Khan Academy / Interactive learning", duration: 45, type: "deep", reason: "Interactive platforms match Collaborator energy" },
            { time: "11:40", activity: "Forum participation — Answer questions on Reddit/Discord", duration: 20, type: "medium", reason: "Teaching others is the highest form of learning" },
            { time: "12:00", activity: "Lunch break", duration: 60, type: "break", reason: "Reset" },
            { time: "13:00", activity: "Group project work", duration: 60, type: "deep", reason: "Collaborators produce best work in teams" },
            { time: "14:00", activity: "Solo review — Process group discussions", duration: 30, type: "medium", reason: "Internalize social learning through solo reflection" },
            { time: "14:30", activity: "Break — Social media or call a friend", duration: 15, type: "break", reason: "Relational recharge" },
            { time: "14:45", activity: "Prepare tomorrow's discussion topics", duration: 20, type: "admin", reason: "Pre-reading fuels the next social learning session" },
        ],
        weeklyFocus: [
            { day: "Monday", theme: "Study group kickoff", hours: 4 },
            { day: "Tuesday", theme: "Independent prep + reading", hours: 3 },
            { day: "Wednesday", theme: "Tutoring / Teaching peers", hours: 3.5 },
            { day: "Thursday", theme: "Group project sprint", hours: 4 },
            { day: "Friday", theme: "Discussion + Debate", hours: 3 },
            { day: "Saturday", theme: "Solo reflection + notes", hours: 2 },
            { day: "Sunday", theme: "Rest + Light social study", hours: 1 },
        ],
        roadmapPhases: [
            { phase: "Community Setup", weeks: "Weeks 1–3", focus: "Form study groups, find mentors", milestones: ["Join 2+ study communities", "Find study buddy for each subject", "Set up shared notes system"] },
            { phase: "Collaborative Learning", weeks: "Weeks 4–8", focus: "Active group study and peer teaching", milestones: ["Teach 5+ concepts to peers", "Participate in 10+ forum discussions", "Complete group assignments"] },
            { phase: "Peer Review", weeks: "Weeks 9–12", focus: "Test each other, give/receive feedback", milestones: ["Exchange practice exams with peers", "Run mock oral exams", "Collective error analysis"] },
            { phase: "Exam Support Circle", weeks: "Weeks 13–16", focus: "Mutual support + final prep", milestones: ["Group revision sprints", "Peer accountability checks", "Celebrate together"] },
        ],
        studyTips: [
            "Find a study buddy — you learn 2x faster through discussion",
            "Use the Feynman technique: explain concepts out loud or to a peer",
            "Join Reddit r/learnprogramming, Discord study servers, or local groups",
            "Alternate between solo and social study (50/50 split)",
            "Teach someone else — it's the best retention strategy for you",
        ],
        optimalSessionLength: 50,
        breakPattern: "50-min study → 10-min social break → repeat",
    },

    Practitioner: {
        dailyBlocks: [
            { time: "08:30", activity: "Quick theory review — Scan key formulas/concepts", duration: 20, type: "light", reason: "Practitioners need just enough theory before doing" },
            { time: "08:50", activity: "Hands-on practice — Coding / Lab / Problem solving", duration: 60, type: "deep", reason: "Practitioners learn by doing, not reading" },
            { time: "09:50", activity: "Break — Physical movement", duration: 10, type: "break", reason: "Kinesthetic recharge" },
            { time: "10:00", activity: "Project work — Build something with today's concept", duration: 60, type: "deep", reason: "Applied projects cement procedural knowledge" },
            { time: "11:00", activity: "Debug / Review — Analyze mistakes", duration: 30, type: "medium", reason: "Error analysis is high-yield learning for Practitioners" },
            { time: "11:30", activity: "Break — Hands-on hobby", duration: 15, type: "break", reason: "Physical activity between study sessions" },
            { time: "11:45", activity: "LeetCode / Practice problems", duration: 45, type: "deep", reason: "Timed practice builds speed and pattern recognition" },
            { time: "12:30", activity: "Lunch break", duration: 60, type: "break", reason: "Recovery" },
            { time: "13:30", activity: "Lab / Experiment / Real-world application", duration: 60, type: "deep", reason: "Concrete experience > abstract theory for Practitioners" },
            { time: "14:30", activity: "Document what you built — Quick notes", duration: 20, type: "admin", reason: "Brief reflection extracts maximal learning from practice" },
            { time: "14:50", activity: "Break", duration: 10, type: "break", reason: "Reset" },
            { time: "15:00", activity: "Plan tomorrow's hands-on activities", duration: 15, type: "admin", reason: "Prep materials and project scope for next day" },
        ],
        weeklyFocus: [
            { day: "Monday", theme: "Build Day — Major project", hours: 5 },
            { day: "Tuesday", theme: "Problem sets + Drills", hours: 4 },
            { day: "Wednesday", theme: "Lab / Experiment day", hours: 4.5 },
            { day: "Thursday", theme: "Project iteration + debug", hours: 4 },
            { day: "Friday", theme: "Speed drills + Timed tests", hours: 3.5 },
            { day: "Saturday", theme: "Side project / Hackathon", hours: 3 },
            { day: "Sunday", theme: "Light theory + Rest", hours: 1.5 },
        ],
        roadmapPhases: [
            { phase: "Foundations Lab", weeks: "Weeks 1–3", focus: "Learn by building simple projects", milestones: ["Complete 3 mini-projects", "Set up dev environment", "Build muscle memory for core tools"] },
            { phase: "Applied Practice", weeks: "Weeks 4–8", focus: "Increase complexity, real-world problems", milestones: ["Complete 100+ practice problems", "Build a mid-size project", "Master debugging workflow"] },
            { phase: "Speed & Accuracy", weeks: "Weeks 9–12", focus: "Timed practice, competitive drills", milestones: ["Timed problem solving (2 min/problem)", "Mock practical exams", "Master edge cases"] },
            { phase: "Capstone", weeks: "Weeks 13–16", focus: "Full project + exam simulation", milestones: ["Complete capstone project", "Full-length practice exams", "Demonstrate practical mastery"] },
        ],
        studyTips: [
            "Flip the script: DO first, then read theory — not the other way around",
            "Build projects for every concept — a calculator, a simulation, an experiment",
            "Use LeetCode, HackerRank, or lab exercises as your primary study method",
            "Keep a 'Build Log' — document what you create each day",
            "Time your practice sessions — speed matters as much as correctness",
        ],
        optimalSessionLength: 60,
        breakPattern: "60-min deep work → 10-min movement break → repeat",
    },
};

/* ─── Chronotype-Based Time Shifting ─────────────────────────────────────── */
function shiftSchedule(blocks: typeof PERSONALITY_SCHEDULES.Explorer.dailyBlocks, chronotype: string) {
    const shifts: Record<string, number> = { LION: -2, BEAR: 0, WOLF: 3, DOLPHIN: 1 };
    const shift = shifts[chronotype] ?? 0;
    return blocks.map(b => {
        const [h, m] = b.time.split(":").map(Number);
        const newH = Math.max(6, Math.min(23, h + shift));
        return { ...b, time: `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}` };
    });
}

/* ─── Goal-Based Roadmap Generation ──────────────────────────────────────── */
function generateGoalPhases(goal: string) {
    const lowerGoal = goal.toLowerCase();

    // Aviation / Pilot
    if (lowerGoal.includes("pilot") || lowerGoal.includes("aviation") || lowerGoal.includes("faa")) {
        return [
            { phase: "Ground School & Medical", weeks: "Months 1–3", focus: "Pass FAA written exam & get 1st Class Medical", milestones: ["Pass FAA Written Exam (90%+)", "Obtain FAA 1st Class Medical Certificate", "Complete Ground School courses"] },
            { phase: "Private Pilot License (PPL)", weeks: "Months 4–6", focus: "Flight training & PPL checkride", milestones: ["First Solo Flight", "Complete 40+ flight hours", "Pass PPL Checkride"] },
            { phase: "Instrument Rating (IR)", weeks: "Months 7–10", focus: "Flying in IMC & instrument navigation", milestones: ["Complete 40 hours instrument time", "Pass IR Written Exam", "Pass IR Checkride"] },
            { phase: "Commercial Pilot License (CPL)", weeks: "Months 11–24", focus: "Accumulate 250 hours & commercial maneuvers", milestones: ["Time building (cross-country)", "Pass CPL Written Exam", "Pass CPL Checkride"] },
        ];
    }

    // Government/Civil Services
    if (lowerGoal.includes("upsc") || lowerGoal.includes("civil service")) {
        return [
            { phase: "Syllabus & NCERTs", weeks: "Months 1–3", focus: "Build foundational knowledge across all subjects", milestones: ["Read NCERTs Class 6-12", "Analyze past 5 years preliminary papers", "Start daily newspaper routine (The Hindu/IE)"] },
            { phase: "Standard Books & Notes", weeks: "Months 4–7", focus: "Deep dive into core subjects (Polity, History, Geo, Eco)", milestones: ["Complete standard textbooks (Laxmikanth, Spectrum)", "Create concise revision notes", "Begin optional subject preparation"] },
            { phase: "Mains Answer Writing", weeks: "Months 8–10", focus: "Ethics, essay writing, and daily answer practice", milestones: ["Complete optional subject syllabus", "Write 2 essays weekly", "Join Mains Test Series"] },
            { phase: "Prelims Sprint", weeks: "Months 11–12", focus: "Objective practice and current affairs revision", milestones: ["Solve 50+ mock tests", "Revise current affairs compilation", "Appear for Preliminary examination"] },
        ];
    }

    // STEM & Technical (GATE/JEE)
    if (lowerGoal.includes("gate") || lowerGoal.includes("jee") || lowerGoal.includes("olympiad")) {
        return [
            { phase: "Core Concepts", weeks: "Months 1–2", focus: "Master fundamental mathematical and scientific principles", milestones: ["Complete high-weightage topics", "Solve previous year chapter-wise questions", "Create formula cheat sheets"] },
            { phase: "Advanced Applications", weeks: "Months 3–4", focus: "Tackle complex, multi-concept problems", milestones: ["Complete entire syllabus", "Solve textbook exercises completely", "Identify and fix weak areas"] },
            { phase: "Mock Testing & Debugging", weeks: "Months 5–5.5", focus: "Time management and error rate reduction", milestones: ["Take 15 full-length mock tests", "Keep an 'Error Log' and review weekly", "Improve speed and accuracy"] },
            { phase: "Final Revision Sprints", weeks: "Weeks 23–24", focus: "Short notes revision and relaxation", milestones: ["Revise only from short notes", "Stop learning new topics", "Optimize sleep schedule for exam day"] },
        ];
    }

    // Professional Skills (Coding, Tech)
    if (lowerGoal.includes("code") || lowerGoal.includes("programm") || lowerGoal.includes("developer")) {
        return [
            { phase: "Syntax & Basics", weeks: "Weeks 1–4", focus: "Variables, loops, functions, and basic data structures", milestones: ["Write 50+ basic scripts", "Understand control flow", "Complete basic algorithm exercises"] },
            { phase: "Frameworks & Tools", weeks: "Weeks 5–8", focus: "Learn industry standard tools (Git, React/Node, etc.)", milestones: ["Build 3 minor projects", "Learn Version Control (Git/GitHub)", "Understand APIs"] },
            { phase: "Complex Architecture", weeks: "Weeks 9–12", focus: "State management, databases, and deployment", milestones: ["Build a full-stack CRUD application", "Deploy to Vercel/AWS", "Set up a database schema"] },
            { phase: "Portfolio & Interview Prep", weeks: "Weeks 13–16", focus: "Polishing projects and grinding LeetCode", milestones: ["Publish portfolio website", "Solve 50 Data Structure problems", "Conduct 3 mock interviews"] },
        ];
    }

    // Default / Generic Goal
    return [
        { phase: "Discovery & Planning", weeks: "Weeks 1–2", focus: "Defining requirements and setting up the environment", milestones: ["Define precise success metrics", "Gather all essential resources", "Set up daily routine"] },
        { phase: "Skill Acquisition", weeks: "Weeks 3–8", focus: "Rapid learning of core concepts", milestones: ["Complete foundational material", "Practice daily", "Apply concepts in minor tasks"] },
        { phase: "Deep Application", weeks: "Weeks 9–12", focus: "Tackling complex problems", milestones: ["Complete a major milestone project", "Identify and fix knowledge gaps", "Teach a concept to someone else"] },
        { phase: "Mastery & Execution", weeks: "Weeks 13–16", focus: "Polishing and final execution", milestones: ["Achieve target metric", "Review overall progress", "Plan next steps"] },
    ];
}

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { personalityProfile: true, userProfile: true, tasks: { where: { completed: false }, orderBy: { deadline: "asc" } } },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const personalityType = user.personalityProfile?.personalityType ?? "Architect";
    const chronotype = user.chronotype ?? "BEAR";

    let subjects: string[] = [];
    try {
        if (user.userProfile?.subjects) {
            let parsed = JSON.parse(user.userProfile.subjects);
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            if (Array.isArray(parsed)) subjects = parsed;
        }
    } catch (e) {
        // Parse error fallback
    }

    // Parse goals to feed into the dynamic roadmap generation
    let userGoals: string[] = [];
    try {
        if (user.userProfile?.goals) {
            let parsed = JSON.parse(user.userProfile.goals);
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            if (Array.isArray(parsed)) userGoals = parsed;
        }
    } catch (e) {
        // Parse error fallback
    }
    const primaryGoal = userGoals[0] || "General Learning";

    const blueprint = PERSONALITY_SCHEDULES[personalityType] ?? PERSONALITY_SCHEDULES.Architect;

    // Shift daily schedule based on chronotype
    const dailySchedule = shiftSchedule(blueprint.dailyBlocks, chronotype);

    // Generate goal-based phases instead of static personality phases
    const roadmapPhases = generateGoalPhases(primaryGoal);

    // Calculate total study hours per week
    const weeklyHours = blueprint.weeklyFocus.reduce((a, b) => a + b.hours, 0);

    return NextResponse.json({
        personalityType,
        chronotype,
        subjects,
        primaryGoal,
        dailySchedule,
        weeklyFocus: blueprint.weeklyFocus,
        roadmapPhases: roadmapPhases,
        studyTips: blueprint.studyTips,
        optimalSessionLength: blueprint.optimalSessionLength,
        breakPattern: blueprint.breakPattern,
        weeklyHours,
        activeTasks: user.tasks.slice(0, 5).map(t => ({ id: t.id, title: t.title, complexity: t.complexity, deadline: t.deadline })),
    });
}
