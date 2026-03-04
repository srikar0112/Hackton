import { NextResponse } from "next/server";

// We define structured templates for various goals across two pillars.
type GoalBlueprint = {
    id: string;
    title: string;
    pillar: "Academic+" | "Life";
    description: string;
    timelineMonths: number;
    requirements: {
        exams?: string[];
        certifications?: string[];
        physical?: string[];
        financial?: string[];
        equipment?: string[];
    };
    roadmapPhases: {
        phase: string;
        focus: string;
        duration: string;
        milestones: string[];
    }[];
    resources: { title: string; type: string; url: string }[];
    keywords: string[];
};

const DATABASE: GoalBlueprint[] = [
    // ─── ACADEMIC+ PILLAR ───────────────────────────────────────────────
    {
        id: "upsc",
        title: "UPSC Civil Services",
        pillar: "Academic+",
        description: "The premier civil service examination in India for IAS, IPS, and IFS.",
        timelineMonths: 18,
        requirements: {
            exams: ["UPSC Prelims (GS + CSAT)", "UPSC Mains (9 Papers)", "Personality Test / Interview"],
            financial: ["Attempt fees (~₹100)", "Coaching/Materials (~₹10k - ₹1L+)"],
        },
        roadmapPhases: [
            { phase: "Foundation", focus: "NCERTs & Newspaper reading habit", duration: "Months 1-3", milestones: ["Read NCERTs Class 6-12", "Start daily reading of The Hindu/Indian Express"] },
            { phase: "Core Preparation", focus: "Standard books & Optional subject", duration: "Months 4-10", milestones: ["Complete Laxmikanth, Spectrum", "Finish Optional Subject syllabus", "Start answer writing"] },
            { phase: "Prelims Dedicated", focus: "Mock tests & Revision", duration: "Months 11-13", milestones: ["Solve 50+ Prelims mocks", "CSAT practice", "Current Affairs 1-year revision"] },
            { phase: "Mains & Interview", focus: "Essay, Ethics & Mock Interviews", duration: "Months 14-18", milestones: ["Write 10+ full-length Mains tests", "DAF Preparation", "Mock interviews"] }
        ],
        resources: [
            { title: "Mrunal Patel Economy", type: "Video", url: "https://youtube.com/" },
            { title: "VisionIAS Current Affairs", type: "PDF", url: "https://visionias.in/" },
            { title: "ClearIAS Mock Exams", type: "Practice", url: "https://www.clearias.com/" }
        ],
        keywords: ["upsc", "ias", "ips", "civil services", "cse", "collector", "bureaucrat", "district magistrate"]
    },
    {
        id: "gre",
        title: "Graduate Record Examination (GRE)",
        pillar: "Academic+",
        description: "Standardized test required for admission to most grad schools globally.",
        timelineMonths: 3,
        requirements: {
            exams: ["GRE General Test (AWA, Verbal, Quant)"],
            financial: ["Test Fee (~$220)", "Test Prep (~$50 - $300)"],
        },
        roadmapPhases: [
            { phase: "Diagnostic & Plan", focus: "Baseline score & Vocabulary building", duration: "Weeks 1-2", milestones: ["Take ETS diagnostic test", "Start daily vocab flashcards (Magoosh/GregMat)"] },
            { phase: "Concept Mastery", focus: "Quant formulas & Verbal strategies", duration: "Weeks 3-8", milestones: ["Complete 5lb Book Quant", "Master Reading Comprehension techniques"] },
            { phase: "Practice & Speed", focus: "Timed sections & AWA Essays", duration: "Weeks 9-10", milestones: ["Write 4 timed essays", "Complete Manhattan 5lb Verbal"] },
            { phase: "Mock Testing", focus: "Full-length stamina", duration: "Weeks 11-12", milestones: ["Take 4 full mock exams", "Error log analysis"] }
        ],
        resources: [
            { title: "GregMat+", type: "Course", url: "https://www.gregmat.com/" },
            { title: "ETS Official Guide", type: "Textbook", url: "https://www.ets.org/gre/" },
            { title: "Magoosh Flashcards", type: "App", url: "https://gre.magoosh.com/flashcards/vocabulary" }
        ],
        keywords: ["gre", "masters", "ms", "grad school", "mphil", "phd admission"]
    },

    // ─── LIFE PILLAR ──────────────────────────────────────────────────
    {
        id: "pilot",
        title: "Commercial Pilot License (CPL)",
        pillar: "Life",
        description: "Certification required to fly an aircraft for financial reward.",
        timelineMonths: 18,
        requirements: {
            exams: ["DGCA/FAA Written Exams (Navigation, Metereology, Air Law)", "Flight Test (Checkride)"],
            physical: ["Class 1 Medical Certificate (20/20 vision, ECG, Audiometry)"],
            financial: ["Flight Training (~$60k - $90k)", "Medical & Exam Fees"]
        },
        roadmapPhases: [
            { phase: "Eligibility & Ground School", focus: "Medical clearance and theory", duration: "Months 1-3", milestones: ["Pass Class 1 Medical", "Clear 5-6 Ground School written exams"] },
            { phase: "PPL (Private Pilot)", focus: "First solo flight", duration: "Months 4-7", milestones: ["Accumulate 40-50 flight hours", "First solo cross-country flight", "Pass PPL Checkride"] },
            { phase: "Hour Building", focus: "Accumulate required PIC hours", duration: "Months 8-12", milestones: ["Reach 150 hours total time", "Night flying requirements", "Instrument rating training"] },
            { phase: "CPL Multi-Engine", focus: "Complex aircraft and final test", duration: "Months 13-18", milestones: ["Multi-engine rating", "Pass CPL Checkride (200-250 hours total)"] }
        ],
        resources: [
            { title: "FAA Airplane Flying Handbook", type: "Textbook", url: "https://www.faa.gov/regulations_policies/handbooks_manuals/aviation/airplane_handbook" },
            { title: "King Schools Ground School", type: "Course", url: "https://kingschools.com/" },
            { title: "FlightRadar24 (ATC Comms)", type: "App", url: "https://www.flightradar24.com/" }
        ],
        keywords: ["pilot", "flying", "cpl", "aviation", "dgca", "faa", "commercial pilot", "fly planes"]
    },
    {
        id: "developer",
        title: "Full-Stack Software Engineer",
        pillar: "Life",
        description: "Build complete web applications from database to user interface.",
        timelineMonths: 6,
        requirements: {
            certifications: ["Optional: AWS Cloud Practitioner"],
            equipment: ["Laptop (8GB+ RAM, SSD)", "Stable Internet"]
        },
        roadmapPhases: [
            { phase: "Frontend Fundamentals", focus: "HTML, CSS, JavaScript basics", duration: "Months 1-2", milestones: ["Build a responsive portfolio site", "Master DOM manipulation", "Build a weather app API"] },
            { phase: "Frontend Frameworks", focus: "React / Next.js", duration: "Months 3-4", milestones: ["Build an e-commerce UI", "Understand state management (Redux/Zustand)", "Implement React Router"] },
            { phase: "Backend & Databases", focus: "Node.js, Express, SQL/NoSQL", duration: "Month 5", milestones: ["Build a RESTful API", "Implement JWT Authentication", "Connect to PostgreSQL/MongoDB"] },
            { phase: "Portfolio & Deployment", focus: "Ship to production", duration: "Month 6", milestones: ["Deploy full-stack app on Vercel/Render", "Write README docs", "Start applying"] }
        ],
        resources: [
            { title: "The Odin Project", type: "Course", url: "https://www.theodinproject.com/" },
            { title: "freeCodeCamp", type: "Practice", url: "https://www.freecodecamp.org/" },
            { title: "MDN Web Docs", type: "Textbook", url: "https://developer.mozilla.org/" }
        ],
        keywords: ["software engineer", "developer", "coding", "programming", "full stack", "web dev", "react", "app dev"]
    },
    {
        id: "marathon",
        title: "Run a Full Marathon (42.2km)",
        pillar: "Life",
        description: "Endurance training to complete a 26.2 mile race.",
        timelineMonths: 4,
        requirements: {
            physical: ["Can comfortably run 5km without stopping", "No major joint injuries"],
            equipment: ["Properly fitted running shoes", "Anti-chafe gear", "GPS Watch (Optional)"]
        },
        roadmapPhases: [
            { phase: "Base Building", focus: "Increase weekly volume safely", duration: "Weeks 1-4", milestones: ["Run 3x a week", "First 10km long run", "Establish stretching routine"] },
            { phase: "Endurance Phase", focus: "Lengthening the long run", duration: "Weeks 5-10", milestones: ["First Half-Marathon (21km) distance", "Practice mid-run fueling (gels)", "Weekly mileage hit 40km"] },
            { phase: "Peak Mileage", focus: "Maximum distance & simulated race pace", duration: "Weeks 11-13", milestones: ["The 32km (20-mile) peak long run", "Test race day outfit/shoes"] },
            { phase: "Taper & Race", focus: "Rest and execute", duration: "Weeks 14-16", milestones: ["Reduce mileage heavily (Taper)", "Carb load", "Race Day!"] }
        ],
        resources: [
            { title: "Hal Higdon Marathon Plans", type: "Plan", url: "https://www.halhigdon.com/" },
            { title: "Nike Run Club App", type: "App", url: "https://www.nike.com/nrc-app" },
            { title: "Global Triathlon Network (Running Tech)", type: "Video", url: "https://www.youtube.com/c/gtn" }
        ],
        keywords: ["marathon", "running", "jogging", "endurance", "42k", "fitness", "runner"]
    }
];

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();
        if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

        const lowercasePrompt = prompt.toLowerCase();

        // Simple intent matching engine
        let matchedGoal = null;
        let maxMatches = 0;

        for (const goal of DATABASE) {
            let matches = 0;
            for (const keyword of goal.keywords) {
                if (lowercasePrompt.includes(keyword)) {
                    matches++;
                    // Give heavy weight to exact phrases
                    if (lowercasePrompt.includes(` ${keyword} `) || lowercasePrompt.startsWith(`${keyword} `) || lowercasePrompt.endsWith(` ${keyword}`)) {
                        matches += 2;
                    }
                }
            }
            if (matches > maxMatches) {
                maxMatches = matches;
                matchedGoal = goal;
            }
        }

        if (!matchedGoal) {
            // Fallback or generic goal extraction could go here.
            return NextResponse.json({
                unmatched: true,
                message: "We couldn't precisely map that goal yet. We are continually expanding our database. Try terms like 'UPSC', 'GRE', 'Pilot', 'Software Engineer', or 'Marathon'."
            });
        }

        return NextResponse.json({ goal: matchedGoal });
    } catch (error) {
        return NextResponse.json({ error: "Failed to process goal" }, { status: 500 });
    }
}
