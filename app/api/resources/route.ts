import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

// ─── 50+ Free Resources from 20+ Open Source Platforms ────────────────────────
export const RESOURCES = [
    // ── Khan Academy ──
    { id: "k1", subject: "Mathematics", title: "Khan Academy — Calculus", type: "Video", tags: ["calculus", "integration", "derivatives"], url: "https://www.khanacademy.org/math/calculus-1", source: "Khan Academy", free: true },
    { id: "k2", subject: "Mathematics", title: "Khan Academy — Linear Algebra", type: "Video", tags: ["vectors", "matrices", "linear systems"], url: "https://www.khanacademy.org/math/linear-algebra", source: "Khan Academy", free: true },
    { id: "k3", subject: "Physics", title: "Khan Academy — Waves & Optics", type: "Video", tags: ["waves", "light", "optics"], url: "https://www.khanacademy.org/science/physics/light-waves", source: "Khan Academy", free: true },
    { id: "k4", subject: "Biology", title: "Khan Academy — AP Biology", type: "Video", tags: ["cells", "mitosis", "DNA"], url: "https://www.khanacademy.org/science/ap-biology", source: "Khan Academy", free: true },
    { id: "k5", subject: "Economics", title: "Khan Academy — Microeconomics", type: "Video", tags: ["supply", "demand", "markets"], url: "https://www.khanacademy.org/economics-finance-domain/microeconomics", source: "Khan Academy", free: true },
    { id: "k6", subject: "Chemistry", title: "Khan Academy — Organic Chemistry", type: "Video", tags: ["organic", "reactions", "functional groups"], url: "https://www.khanacademy.org/science/organic-chemistry", source: "Khan Academy", free: true },
    { id: "k7", subject: "History", title: "Khan Academy — World History", type: "Video", tags: ["civilizations", "wars", "revolutions"], url: "https://www.khanacademy.org/humanities/world-history", source: "Khan Academy", free: true },

    // ── MIT OpenCourseWare ──
    { id: "m1", subject: "Mathematics", title: "MIT 18.01 — Single Variable Calculus", type: "Course", tags: ["calculus", "limits", "MIT"], url: "https://ocw.mit.edu/courses/18-01sc-single-variable-calculus-fall-2010/", source: "MIT OpenCourseWare", free: true },
    { id: "m2", subject: "Computer Science", title: "MIT 6.006 — Intro to Algorithms", type: "Course", tags: ["algorithms", "data structures", "MIT"], url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/", source: "MIT OpenCourseWare", free: true },
    { id: "m3", subject: "Physics", title: "MIT 8.01 — Classical Mechanics", type: "Course", tags: ["mechanics", "physics", "Newton"], url: "https://ocw.mit.edu/courses/8-01l-physics-i-classical-mechanics-fall-2005/", source: "MIT OpenCourseWare", free: true },
    { id: "m4", subject: "Economics", title: "MIT 14.01 — Microeconomics", type: "Course", tags: ["microeconomics", "market", "MIT"], url: "https://ocw.mit.edu/courses/14-01-principles-of-microeconomics-fall-2018/", source: "MIT OpenCourseWare", free: true },
    { id: "m5", subject: "Mathematics", title: "MIT 18.06 — Linear Algebra", type: "Course", tags: ["linear algebra", "matrices", "eigenvalues"], url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", source: "MIT OpenCourseWare", free: true },

    // ── OpenStax (Free Textbooks) ──
    { id: "o1", subject: "Mathematics", title: "OpenStax — Precalculus 2e", type: "Textbook", tags: ["algebra", "trigonometry", "functions"], url: "https://openstax.org/details/books/precalculus-2e", source: "OpenStax", free: true },
    { id: "o2", subject: "Physics", title: "OpenStax — University Physics Vol 1", type: "Textbook", tags: ["mechanics", "kinematics", "Newton"], url: "https://openstax.org/details/books/university-physics-volume-1", source: "OpenStax", free: true },
    { id: "o3", subject: "Biology", title: "OpenStax — Biology 2e", type: "Textbook", tags: ["cells", "genetics", "evolution"], url: "https://openstax.org/details/books/biology-2e", source: "OpenStax", free: true },
    { id: "o4", subject: "Chemistry", title: "OpenStax — Chemistry: Atoms First 2e", type: "Textbook", tags: ["atoms", "periodic table", "bonding"], url: "https://openstax.org/details/books/chemistry-atoms-first-2e", source: "OpenStax", free: true },
    { id: "o5", subject: "Economics", title: "OpenStax — Principles of Economics 3e", type: "Textbook", tags: ["microeconomics", "macroeconomics", "trade"], url: "https://openstax.org/details/books/principles-economics-3e", source: "OpenStax", free: true },
    { id: "o6", subject: "Statistics", title: "OpenStax — Introductory Statistics", type: "Textbook", tags: ["probability", "distributions", "regression"], url: "https://openstax.org/details/books/introductory-statistics", source: "OpenStax", free: true },
    { id: "o7", subject: "Psychology", title: "OpenStax — Psychology 2e", type: "Textbook", tags: ["cognition", "behavior", "memory"], url: "https://openstax.org/details/books/psychology-2e", source: "OpenStax", free: true },

    // ── 3Blue1Brown (YouTube) ──
    { id: "3b1", subject: "Mathematics", title: "3Blue1Brown — Essence of Calculus", type: "Video", tags: ["calculus", "visual", "intuition"], url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr", source: "3Blue1Brown", free: true },
    { id: "3b2", subject: "Mathematics", title: "3Blue1Brown — Essence of Linear Algebra", type: "Video", tags: ["vectors", "eigenvalues", "visual"], url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab", source: "3Blue1Brown", free: true },
    { id: "3b3", subject: "Mathematics", title: "3Blue1Brown — Neural Networks", type: "Video", tags: ["neural networks", "deep learning", "math"], url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", source: "3Blue1Brown", free: true },

    // ── CrashCourse (YouTube) ──
    { id: "cc1", subject: "Biology", title: "CrashCourse — Biology", type: "Video", tags: ["overview", "genetics", "ecology"], url: "https://www.youtube.com/playlist?list=PL3EED4C1D684D3ADF", source: "CrashCourse", free: true },
    { id: "cc2", subject: "Psychology", title: "CrashCourse — Psychology", type: "Video", tags: ["Freud", "memory", "sleep"], url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtOPRKzVLY0jJY-uHOH9KVU6", source: "CrashCourse", free: true },
    { id: "cc3", subject: "History", title: "CrashCourse — World History", type: "Video", tags: ["ancient", "modern", "empires"], url: "https://www.youtube.com/playlist?list=PLBDA2E52FB1EF80C9", source: "CrashCourse", free: true },
    { id: "cc4", subject: "Computer Science", title: "CrashCourse — Computer Science", type: "Video", tags: ["computing", "binary", "networks"], url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtNlUrzyH5r6jN9ulIgZBpdo", source: "CrashCourse", free: true },
    { id: "cc5", subject: "Chemistry", title: "CrashCourse — Chemistry", type: "Video", tags: ["atoms", "reactions", "redox"], url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtPHzzYuWy6fYEaX9mQQ8oGr", source: "CrashCourse", free: true },

    // ── Harvard CS50 ──
    { id: "h1", subject: "Computer Science", title: "CS50x — Harvard Introduction to CS", type: "Course", tags: ["programming", "C", "Python", "algorithms"], url: "https://cs50.harvard.edu/x/", source: "Harvard / edX", free: true },
    { id: "h2", subject: "Computer Science", title: "CS50 Web — Web Programming", type: "Course", tags: ["web", "Django", "React", "SQL"], url: "https://cs50.harvard.edu/web/", source: "Harvard / edX", free: true },
    { id: "h3", subject: "Computer Science", title: "CS50 AI — Intro to AI with Python", type: "Course", tags: ["AI", "machine learning", "Python"], url: "https://cs50.harvard.edu/ai/", source: "Harvard / edX", free: true },

    // ── freeCodeCamp ──
    { id: "fc1", subject: "Computer Science", title: "freeCodeCamp — Full Stack Web Dev", type: "Practice", tags: ["web", "javascript", "python", "projects"], url: "https://www.freecodecamp.org/", source: "freeCodeCamp", free: true },
    { id: "fc2", subject: "Computer Science", title: "freeCodeCamp — Machine Learning", type: "Practice", tags: ["tensorflow", "neural networks", "Python"], url: "https://www.freecodecamp.org/learn/machine-learning-with-python/", source: "freeCodeCamp", free: true },

    // ── The Odin Project ──
    { id: "op1", subject: "Computer Science", title: "The Odin Project — Full Stack JS", type: "Course", tags: ["web dev", "React", "Node", "SQL"], url: "https://www.theodinproject.com/paths/full-stack-javascript", source: "The Odin Project", free: true },
    { id: "op2", subject: "Computer Science", title: "The Odin Project — Foundations", type: "Course", tags: ["HTML", "CSS", "JavaScript", "Git"], url: "https://www.theodinproject.com/paths/foundations", source: "The Odin Project", free: true },

    // ── LibreTexts ──
    { id: "lt1", subject: "Psychology", title: "LibreTexts — Intro to Psychology", type: "Textbook", tags: ["cognition", "behavior", "mental health"], url: "https://socialsci.libretexts.org/Bookshelves/Psychology/Introductory_Psychology", source: "LibreTexts", free: true },
    { id: "lt2", subject: "Chemistry", title: "LibreTexts — General Chemistry", type: "Textbook", tags: ["bonding", "equilibrium", "thermodynamics"], url: "https://chem.libretexts.org/Bookshelves/General_Chemistry", source: "LibreTexts", free: true },
    { id: "lt3", subject: "Mathematics", title: "LibreTexts — Calculus", type: "Textbook", tags: ["derivatives", "integrals", "series"], url: "https://math.libretexts.org/Bookshelves/Calculus", source: "LibreTexts", free: true },

    // ── Brilliant ──
    { id: "br1", subject: "Mathematics", title: "Brilliant — Statistics", type: "Practice", tags: ["statistics", "probability", "data"], url: "https://brilliant.org/courses/statistics/", source: "Brilliant", free: true },
    { id: "br2", subject: "Computer Science", title: "Brilliant — Algorithms", type: "Practice", tags: ["algorithms", "graphs", "dynamic programming"], url: "https://brilliant.org/courses/algorithms/", source: "Brilliant", free: true },

    // ── W3Schools ──
    { id: "w1", subject: "Computer Science", title: "W3Schools — Learn Python", type: "Practice", tags: ["Python", "beginner", "syntax"], url: "https://www.w3schools.com/python/", source: "W3Schools", free: true },
    { id: "w2", subject: "Computer Science", title: "W3Schools — SQL Tutorial", type: "Practice", tags: ["SQL", "databases", "queries"], url: "https://www.w3schools.com/sql/", source: "W3Schools", free: true },

    // ── edX ──
    { id: "ex1", subject: "Statistics", title: "edX — Statistics and Probability", type: "Course", tags: ["probability", "distributions", "inference"], url: "https://www.edx.org/learn/statistics", source: "edX", free: true },
    { id: "ex2", subject: "Computer Science", title: "edX — Introduction to Linux", type: "Course", tags: ["Linux", "command line", "sysadmin"], url: "https://www.edx.org/learn/linux", source: "edX", free: true },

    // ── Coursera (Free Audit) ──
    { id: "co1", subject: "Computer Science", title: "Coursera — Machine Learning (Stanford)", type: "Course", tags: ["ML", "Andrew Ng", "neural networks"], url: "https://www.coursera.org/learn/machine-learning", source: "Coursera", free: true },
    { id: "co2", subject: "Psychology", title: "Coursera — Learning How to Learn", type: "Course", tags: ["metacognition", "memory", "study skills"], url: "https://www.coursera.org/learn/learning-how-to-learn", source: "Coursera", free: true },

    // ── Physics Girl (YouTube) ──
    { id: "pg1", subject: "Physics", title: "Physics Girl — Experiments & Demos", type: "Video", tags: ["experiments", "waves", "electromagnetism"], url: "https://www.youtube.com/@physicsgirl", source: "Physics Girl", free: true },

    // ── Professor Leonard (YouTube) ──
    { id: "pl1", subject: "Mathematics", title: "Professor Leonard — Full Calculus", type: "Video", tags: ["calculus", "lectures", "detailed"], url: "https://www.youtube.com/@ProfessorLeonard/playlists", source: "Professor Leonard", free: true },

    // ── Organic Chemistry Tutor (YouTube) ──
    { id: "oc1", subject: "Mathematics", title: "Organic Chem Tutor — Math & Science", type: "Video", tags: ["algebra", "physics", "chemistry"], url: "https://www.youtube.com/@TheOrganicChemistryTutor", source: "Organic Chem Tutor", free: true },

    // ── Codecademy (Free tier) ──
    { id: "ca1", subject: "Computer Science", title: "Codecademy — Learn Python 3", type: "Practice", tags: ["Python", "interactive", "beginner"], url: "https://www.codecademy.com/learn/learn-python-3", source: "Codecademy", free: true },

    // ── GeeksforGeeks ──
    { id: "gf1", subject: "Computer Science", title: "GeeksforGeeks — DSA Self-Paced", type: "Practice", tags: ["data structures", "algorithms", "interview"], url: "https://www.geeksforgeeks.org/data-structures/", source: "GeeksforGeeks", free: true },

    // ── LeetCode ──
    { id: "lc1", subject: "Computer Science", title: "LeetCode — Coding Practice", type: "Practice", tags: ["algorithms", "interview", "competitive"], url: "https://leetcode.com/problemset/", source: "LeetCode", free: true },

    // ── Saylor Academy ──
    { id: "sa1", subject: "Economics", title: "Saylor — Principles of Economics", type: "Course", tags: ["economics", "free certificate", "self-paced"], url: "https://learn.saylor.org/course/ECON101", source: "Saylor Academy", free: true },
    { id: "sa2", subject: "History", title: "Saylor — World History Survey", type: "Course", tags: ["ancient", "medieval", "modern"], url: "https://learn.saylor.org/course/HIST101", source: "Saylor Academy", free: true },

    // ── HyperPhysics ──
    { id: "hp1", subject: "Physics", title: "HyperPhysics — Concept Maps", type: "Textbook", tags: ["concept maps", "formulas", "visual"], url: "http://hyperphysics.phy-astr.gsu.edu/hbase/hph.html", source: "HyperPhysics", free: true },

    // ── Paul's Online Math Notes ──
    { id: "pm1", subject: "Mathematics", title: "Paul's Notes — Calculus I/II/III", type: "Textbook", tags: ["calculus", "differential equations", "notes"], url: "https://tutorial.math.lamar.edu/", source: "Paul's Math Notes", free: true },
];

// Count unique sources
const UNIQUE_SOURCES = [...new Set(RESOURCES.map(r => r.source))];

/* ─── Goal-Based Filtering ─────────────────────────────────────────────── */
function isResourceRelevant(resource: typeof RESOURCES[0], goal: string): boolean {
    const lowerGoal = goal.toLowerCase();
    const textToMatch = `${resource.subject} ${resource.title} ${resource.tags.join(" ")}`.toLowerCase();

    // If it's the default generic goal or exam prep, don't filter aggressively initially 
    // to avoid an empty library, but ideally we'd filter even this.
    if (lowerGoal === "general learning" || lowerGoal === "exam preparation" || lowerGoal === "skill building") {
        return true;
    }

    // Domain: Aviation / Pilot
    if (lowerGoal.includes("pilot") || lowerGoal.includes("aviation") || lowerGoal.includes("faa")) {
        return textToMatch.includes("physics") || textToMatch.includes("math") || textToMatch.includes("mechanics") || textToMatch.includes("weather") || textToMatch.includes("navigation");
    }

    // Domain: Government/Civil Services (UPSC)
    if (lowerGoal.includes("upsc") || lowerGoal.includes("civil service")) {
        return textToMatch.includes("history") || textToMatch.includes("economics") || textToMatch.includes("geography") || textToMatch.includes("statistics") || textToMatch.includes("polity");
    }

    // Domain: STEM & Technical (GATE/JEE)
    if (lowerGoal.includes("gate") || lowerGoal.includes("jee") || lowerGoal.includes("olympiad")) {
        return textToMatch.includes("math") || textToMatch.includes("physics") || textToMatch.includes("chemistry") || textToMatch.includes("calculus") || textToMatch.includes("algebra");
    }

    // Domain: Professional Skills (Coding, Tech)
    if (lowerGoal.includes("code") || lowerGoal.includes("programm") || lowerGoal.includes("developer") || lowerGoal.includes("software") || lowerGoal.includes("computer")) {
        return textToMatch.includes("computer science") || textToMatch.includes("programming") || textToMatch.includes("python") || textToMatch.includes("machine learning") || textToMatch.includes("web") || textToMatch.includes("algorithms");
    }

    // Domain: Medical/Biology
    if (lowerGoal.includes("mcat") || lowerGoal.includes("medicine") || lowerGoal.includes("doctor")) {
        return textToMatch.includes("biology") || textToMatch.includes("chemistry") || textToMatch.includes("psychology") || textToMatch.includes("anatomy");
    }

    // Fallback loosely matching any word in the goal
    const words = lowerGoal.split(/\s+/).filter(w => w.length > 3);
    if (words.length > 0) {
        return words.some(w => textToMatch.includes(w));
    }

    return true;
}

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = (searchParams.get("q") ?? "").toLowerCase();
    const subject = searchParams.get("subject") ?? "";
    const type = searchParams.get("type") ?? "";

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        include: { userProfile: true, personalityProfile: true },
    });

    let userSubjects: string[] = [];
    try {
        if (user?.userProfile?.subjects) {
            let parsed = JSON.parse(user.userProfile.subjects);
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            if (Array.isArray(parsed)) userSubjects = parsed;
        }
    } catch (e) {
        // Parse error fallback
    }
    const userPersonality = user?.personalityProfile?.personalityType ?? null;

    let userGoals: string[] = [];
    try {
        if (user?.userProfile?.goals) {
            let parsed = JSON.parse(user.userProfile.goals);
            if (typeof parsed === 'string') parsed = JSON.parse(parsed);
            if (Array.isArray(parsed)) userGoals = parsed;
        }
    } catch (e) {
        // Parse error fallback
    }
    const primaryGoal = userGoals[0] || "General Learning";

    // 1. Goal-First Filtering: Eliminate non-relevant data to prevent choice paralysis
    let goalFiltered = RESOURCES.filter(r => isResourceRelevant(r, primaryGoal));

    // 2. Standard user filters (search, subject, type) applied on top of the Goal-Filtered subset
    let results = goalFiltered;
    if (subject && subject !== "All") results = results.filter(r => r.subject === subject);
    if (type && type !== "All") results = results.filter(r => r.type === type);
    if (query) results = results.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.subject.toLowerCase().includes(query) ||
        r.tags.some(t => t.includes(query)) ||
        r.source.toLowerCase().includes(query)
    );

    const scored = results.map(r => {
        let score = 0;
        if (userSubjects.includes(r.subject)) score += 10;
        if (userPersonality === "Explorer" && r.type === "Video") score += 5;
        if (userPersonality === "Architect" && (r.type === "Course" || r.type === "Textbook")) score += 5;
        if (userPersonality === "Practitioner" && r.type === "Practice") score += 5;
        if (userPersonality === "Collaborator" && (r.source === "Khan Academy" || r.source === "freeCodeCamp" || r.source === "Coursera")) score += 5;
        return { ...r, score };
    });

    const recommended = scored.filter(r => r.score > 0).sort((a, b) => b.score - a.score);
    const rest = scored.filter(r => r.score === 0);

    return NextResponse.json({
        resources: [...recommended, ...rest],
        total: results.length,
        totalLibrary: goalFiltered.length, // Only show the # of resources relevant to the goal
        totalSources: UNIQUE_SOURCES.length,
        userSubjects,
        userPersonality,
        primaryGoal
    });
}
