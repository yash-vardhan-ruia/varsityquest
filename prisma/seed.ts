import { PrismaClient, CollegeType } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting database seeding...");

  // Clean the database
  await prisma.review.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.savedCollege.deleteMany({});
  await prisma.savedComparison.deleteMany({});
  await prisma.college.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("Database cleared.");

  // Pre-seed some default users
  const users = [
    {
      email: "student1@varsityquest.com",
      name: "Rohan Sharma",
      passwordHash: "$2a$10$gO6.lV5lB9gK3Yx3q8LpYeI2u2.0X2g4h6S2wD9w7u1.1S2w3e4r5", // mock hashed password for 'password123'
    },
    {
      email: "student2@varsityquest.com",
      name: "Priya Patel",
      passwordHash: "$2a$10$gO6.lV5lB9gK3Yx3q8LpYeI2u2.0X2g4h6S2wD9w7u1.1S2w3e4r5",
    },
  ];

  for (const user of users) {
    await prisma.user.create({ data: user });
  }
  console.log("Default users seeded.");

  const collegeTemplates = [
    // ENGINEERING (15 colleges)
    {
      name: "Indian Institute of Technology (IIT) Bombay",
      slug: "iit-bombay",
      location: "Powai, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      rating: 4.8,
      totalFees: 220000,
      established: 1958,
      type: CollegeType.GOVERNMENT,
      category: "Engineering",
      overview: "Indian Institute of Technology Bombay is a premier public technical and research university located in Powai, Mumbai. Established in 1958, IIT Bombay is highly respected for its globally competitive engineering programs, world-class research facilities, and extremely selective admissions process through JEE Advanced.",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
      website: "https://www.iitb.ac.in",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 220000, seats: 120 },
        { name: "B.Tech Electrical Engineering", duration: 4, fees: 210000, seats: 100 },
        { name: "B.Tech Mechanical Engineering", duration: 4, fees: 190000, seats: 90 },
        { name: "M.Tech Software Engineering", duration: 2, fees: 150000, seats: 40 }
      ],
      placement: {
        avgPackage: 23,
        highestPackage: 160,
        placementRate: 98.2,
        topRecruiters: ["Google", "Microsoft", "Uber", "Apple", "Rubrik", "Qualcomm"],
        year: 2025
      },
      reviews: [
        { authorName: "Ayush Patel", rating: 5, content: "Life at IIT Bombay is a dream. The coding culture is outstanding, and Powai campus is beautiful. Placements are unmatched in India.", pros: "Top-tier coding culture, world-class peers, prime location in Powai.", cons: "High academic stress, competitive grading system.", batch: 2024 },
        { authorName: "Karan Johar", rating: 4.5, content: "Highly competitive, but it prepares you for any challenge in life. Superb research opportunities and labs.", pros: "Amazing sports facilities and infrastructure.", cons: "Mess food is average.", batch: 2023 }
      ]
    },
    {
      name: "Indian Institute of Technology (IIT) Delhi",
      slug: "iit-delhi",
      location: "Hauz Khas, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.7,
      totalFees: 225000,
      established: 1961,
      type: CollegeType.GOVERNMENT,
      category: "Engineering",
      overview: "Located in the historical area of Hauz Khas in New Delhi, IIT Delhi is one of the most prominent science and technology institutions in India, famous for its rigorous academic curriculum and extensive startup incubation initiatives.",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
      website: "https://home.iitd.ac.in",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 225000, seats: 110 },
        { name: "B.Tech Electronics & Communication", duration: 4, fees: 215000, seats: 90 },
        { name: "M.Tech Artificial Intelligence", duration: 2, fees: 160000, seats: 30 }
      ],
      placement: {
        avgPackage: 22,
        highestPackage: 145,
        placementRate: 97.5,
        topRecruiters: ["Goldman Sachs", "Jane Street", "Microsoft", "Amazon", "Nvidia"],
        year: 2025
      },
      reviews: [
        { authorName: "Rahul Kumar", rating: 5, content: "Incredible startup culture. Almost every second student is building a startup. The professors are very supportive of entrepreneurship.", pros: "Fabulous incubation cell, central Delhi life, awesome alumni network.", cons: "Hostels are slightly old and cramped.", batch: 2025 },
        { authorName: "Neha Aggarwal", rating: 4.4, content: "Excellent academics but a bit too theory-focused in some branches. Still, the brand value solves all problems.", pros: "Brand value and recruitment pipelines.", cons: "Cramped campus compared to newer IITs.", batch: 2024 }
      ]
    },
    {
      name: "Indian Institute of Technology (IIT) Madras",
      slug: "iit-madras",
      location: "Adyar, Chennai",
      city: "Chennai",
      state: "Tamil Nadu",
      rating: 4.9,
      totalFees: 218000,
      established: 1959,
      type: CollegeType.GOVERNMENT,
      category: "Engineering",
      overview: "Ranked as the No. 1 Engineering institution in India by NIRF for several consecutive years, IIT Madras is celebrated for its sprawling forest-like campus, pioneering research, and state-of-the-art Research Park.",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
      website: "https://www.iitm.ac.in",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 218000, seats: 115 },
        { name: "B.Tech Aerospace Engineering", duration: 4, fees: 200000, seats: 60 },
        { name: "B.Tech Data Science & AI", duration: 4, fees: 230000, seats: 80 }
      ],
      placement: {
        avgPackage: 24,
        highestPackage: 155,
        placementRate: 98.6,
        topRecruiters: ["Google", "Intel", "Qualcomm", "Apple", "AMD", "HUL"],
        year: 2025
      },
      reviews: [
        { authorName: "Shruti Iyer", rating: 5, content: "The Research Park is simply phenomenal. Green, clean campus with deer roaming around. A perfect blend of nature and high technology.", pros: "Stunning forest campus, massive research budgets, high placements.", cons: "Strict attendance rules in some departments.", batch: 2024 }
      ]
    },
    {
      name: "Indian Institute of Science (IISc)",
      slug: "iisc-bangalore",
      location: "Yeshwanthpur, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      rating: 4.9,
      totalFees: 45000,
      established: 1909,
      type: CollegeType.GOVERNMENT,
      category: "Engineering",
      overview: "Established in 1909 with support from Jamsetji Tata, IISc is India's leading research institution, offering highly advanced postgraduate and select undergraduate technical programs with state-of-the-art lab equipments.",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
      website: "https://iisc.ac.in",
      courses: [
        { name: "Bachelor of Science (Research)", duration: 4, fees: 30000, seats: 120 },
        { name: "M.Tech Computer Science", duration: 2, fees: 50000, seats: 50 },
        { name: "Ph.D. in Physics / Nanotechnology", duration: 5, fees: 20000, seats: 80 }
      ],
      placement: {
        avgPackage: 26,
        highestPackage: 90,
        placementRate: 99.0,
        topRecruiters: ["Microsoft Research", "Google Research", "IBM Research", "Intel Labs", "Shell"],
        year: 2025
      },
      reviews: [
        { authorName: "Devashish Sen", rating: 5, content: "This is a place for research, not a standard placement mill. The lab equipment here is on par with MIT or Stanford.", pros: "World-class researchers, extremely low fees, silent green campus.", cons: "Social life is quiet; heavy focus on academic research.", batch: 2023 }
      ]
    },
    {
      name: "Birla Institute of Technology and Science (BITS) Pilani",
      slug: "bits-pilani",
      location: "Vidya Vihar, Pilani",
      city: "Pilani",
      state: "Rajasthan",
      rating: 4.6,
      totalFees: 520000,
      established: 1964,
      type: CollegeType.PRIVATE,
      category: "Engineering",
      overview: "BITS Pilani is a highly acclaimed private deemed university known for its strict meritocracy, 'no attendance policy', and the unique Practice School (PS-II) industrial internship system that connects students directly to global businesses.",
      imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600&auto=format&fit=crop",
      website: "https://www.bits-pilani.ac.in",
      courses: [
        { name: "B.E. Computer Science", duration: 4, fees: 520000, seats: 150 },
        { name: "B.E. Electronics & Instrumentation", duration: 4, fees: 500000, seats: 120 },
        { name: "M.Sc. Economics (Dual Degree)", duration: 5, fees: 480000, seats: 100 }
      ],
      placement: {
        avgPackage: 19,
        highestPackage: 85,
        placementRate: 96.0,
        topRecruiters: ["Nvidia", "JPMorgan", "AppDynamics", "Salesforce", "Atlassian"],
        year: 2025
      },
      reviews: [
        { authorName: "Vikram Malhotra", rating: 4.7, content: "Zero attendance policy means absolute freedom to code, build projects, or build startups. The alumni network is incredibly powerful.", pros: "No attendance rules, BITSian brotherhood, Practice School internships.", cons: "Fees are extremely high and increase by 10% annually.", batch: 2024 }
      ]
    },
    {
      name: "Delhi Technological University (DTU)",
      slug: "dtu-delhi",
      location: "Bawana Road, Shahbad Daulatpur",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.3,
      totalFees: 219000,
      established: 1941,
      type: CollegeType.GOVERNMENT,
      category: "Engineering",
      overview: "Formerly known as Delhi College of Engineering (DCE), DTU is a premier public university in Delhi, highly famous for its engineering placement stats, active technical student chapters, and massive 164-acre campus.",
      imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd996c5c0c?q=80&w=600&auto=format&fit=crop",
      website: "https://dtu.ac.in",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 219000, seats: 240 },
        { name: "B.Tech Software Engineering", duration: 4, fees: 219000, seats: 180 },
        { name: "B.Tech Information Technology", duration: 4, fees: 219000, seats: 180 }
      ],
      placement: {
        avgPackage: 16,
        highestPackage: 82,
        placementRate: 94.0,
        topRecruiters: ["Microsoft", "Amazon", "Adobe", "Flipkart", "Sprinklr"],
        year: 2025
      },
      reviews: [
        { authorName: "Sumit Bansal", rating: 4.5, content: "DTU is famous for placements, and it delivers on that. The campus life is lively, and the cultural fest Engifest is legendary.", pros: "Outstanding placements, great location, huge brand value.", cons: "Administrative processes are slow and bureaucratic.", batch: 2024 }
      ]
    },
    {
      name: "Netaji Subhas University of Technology (NSUT)",
      slug: "nsut-delhi",
      location: "Dwarka, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.2,
      totalFees: 206000,
      established: 1983,
      type: CollegeType.GOVERNMENT,
      category: "Engineering",
      overview: "NSUT, formerly NSIT, is a state technical university in Dwarka, New Delhi, renowned for its brilliant placement pipelines, highly competitive coding batches, and robust engineering pedagogy.",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
      website: "http://www.nsut.ac.in",
      courses: [
        { name: "B.Tech Computer Engineering", duration: 4, fees: 206000, seats: 180 },
        { name: "B.Tech Information Technology", duration: 4, fees: 206000, seats: 120 }
      ],
      placement: {
        avgPackage: 15,
        highestPackage: 78,
        placementRate: 93.5,
        topRecruiters: ["Amazon", "Cisco", "Paytm", "D.E. Shaw", "Tower Research"],
        year: 2025
      },
      reviews: [
        { authorName: "Siddharth Garg", rating: 4.2, content: "Dwarka campus is very nice and close to the metro. The coding culture is very strong and rivals DTU and IIT Delhi.", pros: "Close proximity to metro, solid coding groups.", cons: "Strict attendance checking (75% compulsory).", batch: 2025 }
      ]
    },
    {
      name: "Vellore Institute of Technology (VIT) Vellore",
      slug: "vit-vellore",
      location: "Katpadi, Vellore",
      city: "Vellore",
      state: "Tamil Nadu",
      rating: 4.1,
      totalFees: 198000,
      established: 1984,
      type: CollegeType.DEEMED,
      category: "Engineering",
      overview: "VIT Vellore is a leading private university known for its massive student population, flexible credit system (FFCS), modern infrastructure, and record-breaking bulk placement runs.",
      imageUrl: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?q=80&w=600&auto=format&fit=crop",
      website: "https://vit.ac.in",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 198000, seats: 1200 },
        { name: "B.Tech Information Technology", duration: 4, fees: 198000, seats: 400 },
        { name: "M.Tech Cloud Computing", duration: 2, fees: 140000, seats: 60 }
      ],
      placement: {
        avgPackage: 9,
        highestPackage: 50,
        placementRate: 91.0,
        topRecruiters: ["TCS", "Cognizant", "Wipro", "Intel", "Infosys", "Deloitte"],
        year: 2025
      },
      reviews: [
        { authorName: "Rahul Sen", rating: 4.0, content: "The campus infrastructure is super premium. The student population is very high so competition is intense, but companies visit in bulk.", pros: "Modern infrastructure, high variety of campus clubs.", cons: "Very crowded, strict curfew rules for hostels.", batch: 2024 }
      ]
    },
    {
      name: "Manipal Institute of Technology (MIT)",
      slug: "mit-manipal",
      location: "Madhav Nagar, Manipal",
      city: "Manipal",
      state: "Karnataka",
      rating: 4.3,
      totalFees: 385000,
      established: 1957,
      type: CollegeType.PRIVATE,
      category: "Engineering",
      overview: "MIT Manipal is a constituent college of Manipal Academy of Higher Education (MAHE), famous for offering a highly dynamic college life, excellent international exchange opportunities, and state-of-the-art hostels.",
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
      website: "https://manipal.edu/mit.html",
      courses: [
        { name: "B.Tech Computer Science", duration: 4, fees: 385000, seats: 200 },
        { name: "B.Tech Data Science Engineering", duration: 4, fees: 370000, seats: 120 }
      ],
      placement: {
        avgPackage: 12,
        highestPackage: 55,
        placementRate: 92.5,
        topRecruiters: ["Cisco", "IBM", "Microsoft", "Philips", "Accenture"],
        year: 2025
      },
      reviews: [
        { authorName: "Ananya Hegde", rating: 4.4, content: "Manipal offers a premium student experience. Beautiful coastal climate and top-class facilities. Placements are solid too.", pros: "Premium lifestyle, rich academic resources, scenic campus.", cons: "Cost of living and tuition fees are high.", batch: 2024 }
      ]
    },
    {
      name: "College of Engineering, Pune (COEP)",
      slug: "coep-pune",
      location: "Wellesley Road, Shivaji Nagar",
      city: "Pune",
      state: "Maharashtra",
      rating: 4.4,
      totalFees: 135000,
      established: 1854,
      type: CollegeType.GOVERNMENT,
      category: "Engineering",
      overview: "COEP Technological University is one of the oldest engineering colleges in Asia (established 1854). Located in Shivaji Nagar, Pune, it is highly renowned for its rigorous academic excellence and deep industrial integration in Maharashtra.",
      imageUrl: "https://images.unsplash.com/photo-1598257006458-087169a1f08d?q=80&w=600&auto=format&fit=crop",
      website: "https://www.coep.org.in",
      courses: [
        { name: "B.Tech Computer Engineering", duration: 4, fees: 135000, seats: 120 },
        { name: "B.Tech Mechanical Engineering", duration: 4, fees: 120000, seats: 120 }
      ],
      placement: {
        avgPackage: 11,
        highestPackage: 50,
        placementRate: 93.0,
        topRecruiters: ["Tata Motors", "Cummins", "Siemens", "TCS", "Barkleys"],
        year: 2025
      },
      reviews: [
        { authorName: "Manoj Deshmukh", rating: 4.6, content: "Historical college with outstanding credibility in Pune's industrial belt. The tech clubs like MindSpark and COEP satellite are legendary.", pros: "Excellent placement in core engineering, prestigious brand.", cons: "Infrastructure needs modernisation in old blocks.", batch: 2023 }
      ]
    },
    {
      name: "National Institute of Technology (NIT) Trichy",
      slug: "nit-trichy",
      location: "Tanjore Main Road, Tiruchirappalli",
      city: "Tiruchirappalli",
      state: "Tamil Nadu",
      rating: 4.6,
      totalFees: 145000,
      established: 1964,
      type: CollegeType.GOVERNMENT,
      category: "Engineering",
      overview: "NIT Trichy is globally recognized as the top-ranking NIT in India, boasting a massive 800-acre self-contained residential campus and highly competitive placement pipelines.",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
      website: "https://www.nitt.edu",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 145000, seats: 110 },
        { name: "B.Tech Electronics & Communication", duration: 4, fees: 145000, seats: 100 }
      ],
      placement: {
        avgPackage: 17,
        highestPackage: 64,
        placementRate: 96.5,
        topRecruiters: ["Samsung", "Texas Instruments", "Qualcomm", "Microsoft", "Uber"],
        year: 2025
      },
      reviews: [
        { authorName: "Karthik Raja", rating: 4.7, content: "NIT Trichy holds massive brand weight. The placement cell is highly active. Cultural fest Festember is very famous.", pros: "Ranked #1 among NITs, outstanding placements, huge campus.", cons: "Extremely hot climate during summers.", batch: 2024 }
      ]
    },
    {
      name: "National Institute of Technology (NIT) Surathkal",
      slug: "nit-surathkal",
      location: "Srinivasnagar, Mangaluru",
      city: "Mangaluru",
      state: "Karnataka",
      rating: 4.6,
      totalFees: 150000,
      established: 1960,
      type: CollegeType.GOVERNMENT,
      category: "Engineering",
      overview: "NIT Surathkal is uniquely positioned right on the shore of the Arabian Sea in Karnataka, boasting its own private beach. It offers world-class laboratory systems and top placements.",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
      website: "https://www.nitk.ac.in",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 150000, seats: 115 },
        { name: "B.Tech Information Technology", duration: 4, fees: 150000, seats: 100 }
      ],
      placement: {
        avgPackage: 18,
        highestPackage: 60,
        placementRate: 96.0,
        topRecruiters: ["Microsoft", "Amazon", "Intuit", "Morgan Stanley", "Visa"],
        year: 2025
      },
      reviews: [
        { authorName: "Aditya Hegde", rating: 4.8, content: "Having a private beach inside the campus is an unbelievable experience. The placements are amazing, especially in software.", pros: "Beach campus, highly qualified professors.", cons: "Hostels in first year are average.", batch: 2024 }
      ]
    },
    {
      name: "RV College of Engineering (RVCE)",
      slug: "rvce-bangalore",
      location: "Mysore Road, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      rating: 4.2,
      totalFees: 240000,
      established: 1963,
      type: CollegeType.PRIVATE,
      category: "Engineering",
      overview: "RVCE is a premier private engineering college in Bengaluru, strategically connected to the IT hubs of Electronic City and Whitefield, delivering outstanding placement profiles.",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
      website: "https://rvce.edu.in",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 240000, seats: 180 },
        { name: "B.Tech Information Science", duration: 4, fees: 230000, seats: 120 }
      ],
      placement: {
        avgPackage: 11,
        highestPackage: 48,
        placementRate: 93.0,
        topRecruiters: ["Adobe", "Cisco", "Goldman Sachs", "IBM", "Accenture"],
        year: 2025
      },
      reviews: [
        { authorName: "Kiran R", rating: 4.3, content: "Placements are almost equivalent to top NITs due to its prime location in Bangalore. Very strict academic regulations though.", pros: "Top-tier IT placement, located in Bangalore.", cons: "Strict rules, campus is relatively small.", batch: 2024 }
      ]
    },
    {
      name: "PSG College of Technology",
      slug: "psg-tech-coimbatore",
      location: "Peelamedu, Coimbatore",
      city: "Coimbatore",
      state: "Tamil Nadu",
      rating: 4.3,
      totalFees: 125000,
      established: 1951,
      type: CollegeType.PRIVATE,
      category: "Engineering",
      overview: "PSG College of Technology is a government-aided private college in Coimbatore, heavily renowned for its close ties with manufacturing and textile industries, offering great internships.",
      imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600&auto=format&fit=crop",
      website: "https://www.psgtech.edu",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 125000, seats: 120 },
        { name: "B.Tech Mechanical Engineering (Sandwich)", duration: 5, fees: 110000, seats: 60 }
      ],
      placement: {
        avgPackage: 9,
        highestPackage: 40,
        placementRate: 91.5,
        topRecruiters: ["Caterpillar", "Qualcomm", "Soliton", "Intel", "Robert Bosch"],
        year: 2025
      },
      reviews: [
        { authorName: "Meena Sundaram", rating: 4.4, content: "Very disciplined environment. The sandwich programs are awesome since you get literal industry shifts during college hours.", pros: "Industrial experience, top reputation in south India.", cons: "Strict uniform code on some days.", batch: 2023 }
      ]
    },
    {
      name: "Jadavpur University",
      slug: "jadavpur-university-kolkata",
      location: "Jadavpur, Kolkata",
      city: "Kolkata",
      state: "West Bengal",
      rating: 4.5,
      totalFees: 10000,
      established: 1955,
      type: CollegeType.GOVERNMENT,
      category: "Engineering",
      overview: "Jadavpur University is globally famous for its incredibly low fee structure (less than INR 10,000 for the entire 4 years B.Tech) and outstanding placement records that match top-tier IITs.",
      imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd996c5c0c?q=80&w=600&auto=format&fit=crop",
      website: "http://www.jaduniv.edu.in",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 2400, seats: 60 },
        { name: "B.Tech Electronics & Telecommunication", duration: 4, fees: 2400, seats: 60 }
      ],
      placement: {
        avgPackage: 15,
        highestPackage: 85,
        placementRate: 95.0,
        topRecruiters: ["Google", "Microsoft", "Texas Instruments", "PwC", "Wells Fargo"],
        year: 2025
      },
      reviews: [
        { authorName: "Sourav Roy", rating: 4.6, content: "The ROI (Return on Investment) of Jadavpur University is unbeatable in the entire world. Total fee is literally peanuts, but you get Google placements.", pros: "Unmatched ROI, brilliant research culture.", cons: "Campus politics can occasionally disrupt classes.", batch: 2024 }
      ]
    },
    {
      name: "Vellore Institute of Technology (VIT) Bhopal",
      slug: "vit-bhopal",
      location: "Bhopal-Indore Highway, Kothrikalan, Sehore",
      city: "Bhopal",
      state: "Madhya Pradesh",
      rating: 4.2,
      totalFees: 198000,
      established: 2017,
      type: CollegeType.PRIVATE,
      category: "Engineering",
      overview: "Vellore Institute of Technology Bhopal (VIT Bhopal) is a private technological university located on the Bhopal-Indore Highway in Madhya Pradesh. Established in 2017 by the VIT Group, it is widely known for its futuristic campus, full-flexible credit system (FFCS), CALTECH learning model, and extensive placement programs that draw major global recruiters.",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
      website: "https://vitbhopal.ac.in",
      courses: [
        { name: "B.Tech Computer Science & Engineering", duration: 4, fees: 198000, seats: 360 },
        { name: "B.Tech CSE (Artificial Intelligence & Machine Learning)", duration: 4, fees: 198000, seats: 240 },
        { name: "B.Tech Electronics & Communication Engineering", duration: 4, fees: 198000, seats: 120 },
        { name: "B.Tech Mechanical Engineering", duration: 4, fees: 198000, seats: 60 }
      ],
      placement: {
        avgPackage: 8,
        highestPackage: 59,
        placementRate: 92.4,
        topRecruiters: ["Microsoft", "Amazon", "Intel", "TCS", "Cognizant", "Wipro", "Infosys"],
        year: 2025
      },
      reviews: [
        { authorName: "Nikhil Sharma", rating: 4.5, content: "VIT Bhopal offers amazing academic flexibility through the FFCS system. The campus is modern and the placement opportunities are excellent.", pros: "Flexible curriculum, advanced lab facilities, great campus environment.", cons: "Hostel distance from academic blocks, food variety can be improved.", batch: 2024 },
        { authorName: "Shreya Patel", rating: 4, content: "Futuristic teaching-learning process (CALTECH model) and supportive faculty. Placements are very strong.", pros: "Good placement cell support, great peers.", cons: "Strict campus outing rules.", batch: 2025 }
      ]
    },

    // MEDICAL (10 colleges)
    {
      name: "All India Institute of Medical Sciences (AIIMS)",
      slug: "aiims-delhi",
      location: "Ansari Nagar, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.9,
      totalFees: 1628,
      established: 1956,
      type: CollegeType.GOVERNMENT,
      category: "Medical",
      overview: "AIIMS New Delhi is India's most prestigious medical research university and hospital. Established in 1956, it is highly renowned for its extremely low fees (almost free), outstanding clinical exposure, and selection of only the absolute top scorers of NEET UG.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
      website: "https://www.aiims.edu",
      courses: [
        { name: "MBBS (Bachelor of Medicine & Surgery)", duration: 5, fees: 1628, seats: 125 },
        { name: "MD General Medicine", duration: 3, fees: 2000, seats: 30 }
      ],
      placement: {
        avgPackage: 18,
        highestPackage: 35,
        placementRate: 100.0,
        topRecruiters: ["Apollo Hospitals", "Max Healthcare", "Fortis", "Medanta", "NHS UK"],
        year: 2025
      },
      reviews: [
        { authorName: "Amit Kumar", rating: 5, content: "AIIMS New Delhi is the heaven of medical education. The patients exposure you get here is unimaginable. Fees are literally free.", pros: "Unlimited clinical cases, top brand, highly subsidized food & hostel.", cons: "Extremely heavy work pressure for interns.", batch: 2023 }
      ]
    },
    {
      name: "Christian Medical College (CMC) Vellore",
      slug: "cmc-vellore",
      location: "Ida Scudder Road, Vellore",
      city: "Vellore",
      state: "Tamil Nadu",
      rating: 4.8,
      totalFees: 52000,
      established: 1900,
      type: CollegeType.PRIVATE,
      category: "Medical",
      overview: "CMC Vellore is a legendary private medical institution established in 1900, highly renowned for its service-oriented healthcare, state-of-the-art diagnostics, and highly competitive MBBS training.",
      imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop",
      website: "https://www.cmch-vellore.edu",
      courses: [
        { name: "MBBS", duration: 5, fees: 52000, seats: 100 },
        { name: "MD Paediatrics", duration: 3, fees: 60000, seats: 15 }
      ],
      placement: {
        avgPackage: 14,
        highestPackage: 25,
        placementRate: 100.0,
        topRecruiters: ["CMC Hospital", "Apollo", "St. Johns", "Christian Medical Fellowship"],
        year: 2025
      },
      reviews: [
        { authorName: "Jessica D'souza", rating: 4.8, content: "CMC Vellore teaches you empathy, service, and clinical precision. The ethical standards here are exemplary.", pros: "Ethical medical training, top clinical exposure.", cons: "Compulsory service bond for some candidates.", batch: 2024 }
      ]
    },
    {
      name: "Kasturba Medical College (KMC) Manipal",
      slug: "kmc-manipal",
      location: "Madhav Nagar, Manipal",
      city: "Manipal",
      state: "Karnataka",
      rating: 4.6,
      totalFees: 1780000,
      established: 1953,
      type: CollegeType.PRIVATE,
      category: "Medical",
      overview: "KMC Manipal is one of the top private medical colleges in India, boasting massive international recognition, an excellent high-fidelity simulation center, and highly modern hospital blocks.",
      imageUrl: "https://images.unsplash.com/photo-1516549655169-df83a0774514?q=80&w=600&auto=format&fit=crop",
      website: "https://manipal.edu/kmc-manipal.html",
      courses: [
        { name: "MBBS", duration: 5, fees: 1780000, seats: 250 },
        { name: "MD Cardiology", duration: 3, fees: 2200000, seats: 8 }
      ],
      placement: {
        avgPackage: 15,
        highestPackage: 30,
        placementRate: 99.0,
        topRecruiters: ["Manipal Hospitals", "Apollo", "Fortis", "Aster DM Healthcare"],
        year: 2025
      },
      reviews: [
        { authorName: "Nitin Pai", rating: 4.7, content: "A highly premium college. The infrastructure here is outstanding and the simulation lab is the best in India.", pros: "Simulation labs, world class campus, scenic Manipal location.", cons: "Fees are extremely high.", batch: 2024 }
      ]
    },
    {
      name: "Maulana Azad Medical College (MAMC)",
      slug: "mamc-new-delhi",
      location: "Bahadur Shah Zafar Marg",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.7,
      totalFees: 15000,
      established: 1959,
      type: CollegeType.GOVERNMENT,
      category: "Medical",
      overview: "MAMC is a premium public medical institution in New Delhi, connected to Lok Nayak Hospital, offering incredibly vast clinical practice exposure to its medical students.",
      imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901f?q=80&w=600&auto=format&fit=crop",
      website: "https://www.mamc.ac.in",
      courses: [
        { name: "MBBS", duration: 5, fees: 15000, seats: 250 }
      ],
      placement: {
        avgPackage: 16,
        highestPackage: 28,
        placementRate: 100.0,
        topRecruiters: ["LNJP Hospital", "Apollo", "Medanta", "Max Healthcare"],
        year: 2025
      },
      reviews: [
        { authorName: "Kunal Mehra", rating: 4.6, content: "Being in central Delhi, MAMC sees a massive patient load. You get highly skilled within your internships.", pros: "Vast patient load, cheap hostels, central Delhi.", cons: "Old infrastructure in hosteling areas.", batch: 2023 }
      ]
    },
    {
      name: "King George's Medical University (KGMU)",
      slug: "kgmu-lucknow",
      location: "Chowk, Lucknow",
      city: "Chowk, Lucknow",
      state: "Uttar Pradesh",
      rating: 4.5,
      totalFees: 48000,
      established: 1911,
      type: CollegeType.GOVERNMENT,
      category: "Medical",
      overview: "KGMU is a historic and highly prestigious state medical university in Lucknow, famous for its grand British-era architecture, highly skilled doctors, and intensive clinical exposures.",
      imageUrl: "https://images.unsplash.com/photo-1582750433449-64c656df1a80?q=80&w=600&auto=format&fit=crop",
      website: "https://www.kgmu.org",
      courses: [
        { name: "MBBS", duration: 5, fees: 48000, seats: 250 },
        { name: "BDS (Dental)", duration: 4, fees: 38000, seats: 70 }
      ],
      placement: {
        avgPackage: 13,
        highestPackage: 24,
        placementRate: 99.5,
        topRecruiters: ["KGMU Hospital", "SGPGI", "Medanta", "Apollo Lucknow"],
        year: 2025
      },
      reviews: [
        { authorName: "Sharat Srivastava", rating: 4.7, content: "KGMU is legendary in UP. The brand value is massive, and clinical teachings are superb.", pros: "Historical campus, massive clinical exposure.", cons: "Highly crowded OPDs can be tiring.", batch: 2024 }
      ]
    },
    {
      name: "St. John's Medical College",
      slug: "st-johns-medical-college-bangalore",
      location: "Sarjapur Road, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      rating: 4.5,
      totalFees: 628000,
      established: 1963,
      type: CollegeType.PRIVATE,
      category: "Medical",
      overview: "St. John's is a top-ranking private medical college on Sarjapur Road, Bengaluru, highly recognized for its rigorous ethics, values, and top-tier infrastructure.",
      imageUrl: "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?q=80&w=600&auto=format&fit=crop",
      website: "https://www.stjohns.in",
      courses: [
        { name: "MBBS", duration: 5, fees: 628000, seats: 150 }
      ],
      placement: {
        avgPackage: 12,
        highestPackage: 22,
        placementRate: 99.0,
        topRecruiters: ["St. Johns Hospital", "Fortis Bangalore", "Columbia Asia", "Manipal"],
        year: 2025
      },
      reviews: [
        { authorName: "Aiswarya R", rating: 4.4, content: "The discipline here is very high. The campus is green and lovely. Clinical postings are highly informative.", pros: "Strict discipline, top class hospital attachment.", cons: "Attendance rules are extremely tight.", batch: 2024 }
      ]
    },
    {
      name: "Grant Government Medical College",
      slug: "grant-medical-college-mumbai",
      location: "Byculla, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      rating: 4.4,
      totalFees: 125000,
      established: 1845,
      type: CollegeType.GOVERNMENT,
      category: "Medical",
      overview: "Grant Medical College and Sir J.J. Group of Hospitals is a historic medical institution in Byculla, Mumbai, established in 1845, making it one of the oldest in India. It offers elite medical education.",
      imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=600&auto=format&fit=crop",
      website: "https://ggmcjjh.com",
      courses: [
        { name: "MBBS", duration: 5, fees: 125000, seats: 250 }
      ],
      placement: {
        avgPackage: 11,
        highestPackage: 20,
        placementRate: 100.0,
        topRecruiters: ["JJ Hospital Group", "KEM Hospital", "Lilavati", "Kokilaben Hospital"],
        year: 2025
      },
      reviews: [
        { authorName: "Siddhesh Kulkarni", rating: 4.5, content: "Sir J.J. Hospital sees some of the most complex clinical cases in India. You learn rapidly through observations.", pros: "Elite reputation, central Mumbai location, vast case studies.", cons: "Hostels are highly basic and old.", batch: 2023 }
      ]
    },
    {
      name: "Armed Forces Medical College (AFMC)",
      slug: "afmc-pune",
      location: "Wanowrie, Pune",
      city: "Pune",
      state: "Maharashtra",
      rating: 4.8,
      totalFees: 32000,
      established: 1948,
      type: CollegeType.GOVERNMENT,
      category: "Medical",
      overview: "AFMC Pune is a unique and elite military-medical institution. Managed by the Indian Armed Forces, students here serve as commission officers upon completion of their MBBS.",
      imageUrl: "https://images.unsplash.com/photo-1579684389782-64d84b5e901f?q=80&w=600&auto=format&fit=crop",
      website: "https://afmc.nic.in",
      courses: [
        { name: "MBBS (Armed Forces)", duration: 5, fees: 32000, seats: 150 }
      ],
      placement: {
        avgPackage: 16,
        highestPackage: 25,
        placementRate: 100.0,
        topRecruiters: ["Indian Army Medical Corps", "Indian Navy", "Indian Air Force"],
        year: 2025
      },
      reviews: [
        { authorName: "Captain Vikram Singh", rating: 4.9, content: "AFMC is not just a college, it is a way of life. The military training, physical fitness programs, and medical studies are top-notch.", pros: "Assured military officer commission, zero cost education, elite discipline.", cons: "Compulsory service bond or huge penalty on dropout.", batch: 2024 }
      ]
    },
    {
      name: "Madras Medical College (MMC)",
      slug: "madras-medical-college-chennai",
      location: "Park Town, Chennai",
      city: "Chennai",
      state: "Tamil Nadu",
      rating: 4.6,
      totalFees: 22000,
      established: 1835,
      type: CollegeType.GOVERNMENT,
      category: "Medical",
      overview: "MMC Chennai is the third oldest medical college in India. It is highly prestigious in South India, offering supreme patient exposure and deep clinical teachings.",
      imageUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=600&auto=format&fit=crop",
      website: "http://www.mmc.ac.in",
      courses: [
        { name: "MBBS", duration: 5, fees: 22000, seats: 250 }
      ],
      placement: {
        avgPackage: 12,
        highestPackage: 22,
        placementRate: 99.5,
        topRecruiters: ["Government General Hospital", "Apollo Chennai", "Fortis Malar", "MIOT"],
        year: 2025
      },
      reviews: [
        { authorName: "Saravanan M", rating: 4.6, content: "Outstanding clinical exposure in Tamil Nadu. The teachers are highly legendary in their medical fields.", pros: "Subsidized state education, supreme brand.", cons: "Infrastructure is ancient and undergoing reconstruction.", batch: 2024 }
      ]
    },
    {
      name: "Bangalore Medical College (BMCRI)",
      slug: "bangalore-medical-college-bmcri",
      location: "K.R. Road, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      rating: 4.5,
      totalFees: 60000,
      established: 1955,
      type: CollegeType.GOVERNMENT,
      category: "Medical",
      overview: "BMCRI is a premier state government medical college associated with four massive hospitals in Bengaluru, ensuring massive hands-on practice.",
      imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?q=80&w=600&auto=format&fit=crop",
      website: "https://www.bmcri.org",
      courses: [
        { name: "MBBS", duration: 5, fees: 60000, seats: 250 }
      ],
      placement: {
        avgPackage: 11,
        highestPackage: 18,
        placementRate: 100.0,
        topRecruiters: ["Victoria Hospital", "Vani Vilas Hospital", "Apollo Bangalore", "Manipal"],
        year: 2025
      },
      reviews: [
        { authorName: "Sandeep Patil", rating: 4.5, content: "Excellent clinical studies. Victoria Hospital is always highly packed so you get extensive surgical and clinical knowledge.", pros: "Extremely rich clinical postings, central Bangalore location.", cons: "Cleanliness in old OPDs could be improved.", batch: 2023 }
      ]
    },

    // MANAGEMENT (10 colleges)
    {
      name: "Indian Institute of Management (IIM) Ahmedabad",
      slug: "iim-ahmedabad",
      location: "Vastrapur, Ahmedabad",
      city: "Ahmedabad",
      state: "Gujarat",
      rating: 4.9,
      totalFees: 1250000,
      established: 1961,
      type: CollegeType.GOVERNMENT,
      category: "Management",
      overview: "IIM Ahmedabad is widely considered the leading business school in India and one of the finest globally. Famous for its rigorous 'Case Study Method' and historical Louis Kahn brick campus, it selects only the top 99.9+ percentiles in CAT.",
      imageUrl: "https://images.unsplash.com/photo-1527891751199-7225231a68dd?q=80&w=600&auto=format&fit=crop",
      website: "https://www.iima.ac.in",
      courses: [
        { name: "PGP in Management (MBA)", duration: 2, fees: 1250000, seats: 380 },
        { name: "PGPX (One Year Executive MBA)", duration: 1, fees: 1600000, seats: 140 }
      ],
      placement: {
        avgPackage: 34,
        highestPackage: 115,
        placementRate: 100.0,
        topRecruiters: ["McKinsey & Co", "Boston Consulting Group", "Goldman Sachs", "HUL", "Tata Group", "Morgan Stanley"],
        year: 2025
      },
      reviews: [
        { authorName: "Anubhav Sinha", rating: 5, content: "The Case Study Method is extremely mind-stimulating. Sleeping 4 hours a night is normal, but the learning curve is massive.", pros: "World-class peers, legendary McKinsey/BCG recruiters, awesome networking.", cons: "Super intense academic rigor, zero work-life balance during terms.", batch: 2024 }
      ]
    },
    {
      name: "Indian Institute of Management (IIM) Bangalore",
      slug: "iim-bangalore",
      location: "Bannerghatta Road, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      rating: 4.8,
      totalFees: 1225000,
      established: 1973,
      type: CollegeType.GOVERNMENT,
      category: "Management",
      overview: "IIM Bangalore is a world-renowned business school located in the tech capital Bengaluru, famous for its stone architecture, outstanding digital tech integration, and top-tier placement results.",
      imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=600&auto=format&fit=crop",
      website: "https://www.iimb.ac.in",
      courses: [
        { name: "PGP in Management (MBA)", duration: 2, fees: 1225000, seats: 400 }
      ],
      placement: {
        avgPackage: 33,
        highestPackage: 105,
        placementRate: 100.0,
        topRecruiters: ["Bain & Company", "McKinsey", "Microsoft", "Kearney", "Amazon"],
        year: 2025
      },
      reviews: [
        { authorName: "Megha Rao", rating: 4.9, content: "Beautiful green stone-wall campus. Being in Bangalore gives massive advantages for tech-consulting and product management placements.", pros: "Stone-walled campus, tech-hub corporate connectivity.", cons: "Grading is extremely competitive.", batch: 2024 }
      ]
    },
    {
      name: "Indian Institute of Management (IIM) Calcutta",
      slug: "iim-calcutta",
      location: "Joka, Kolkata",
      city: "Kolkata",
      state: "West Bengal",
      rating: 4.8,
      totalFees: 1200000,
      established: 1961,
      type: CollegeType.GOVERNMENT,
      category: "Management",
      overview: "IIM Calcutta is historically known as the 'Finance Campus' of India, boasting highly structured finance courses, a lovely 7-lakes campus, and top quantitative investment banking placements.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
      website: "https://www.iimcal.ac.in",
      courses: [
        { name: "PGP in Management (MBA)", duration: 2, fees: 1200000, seats: 460 }
      ],
      placement: {
        avgPackage: 35,
        highestPackage: 120,
        placementRate: 100.0,
        topRecruiters: ["Avendus Capital", "JPMorgan Chase", "Goldman Sachs", "Morgan Stanley", "Barclays"],
        year: 2025
      },
      reviews: [
        { authorName: "Rajat Sen", rating: 4.8, content: "The Joka campus is famous for its peaceful lakes. If you love finance and quantitative economics, IIM Calcutta has no match in Asia.", pros: "Finance legacy, quantitative studies, beautiful 7-lakes campus.", cons: "Hostel rooms in old hostels are small.", batch: 2024 }
      ]
    },
    {
      name: "XLRI - Xavier School of Management",
      slug: "xlri-jamshedpur",
      location: "Circuit House Area, Jamshedpur",
      city: "Jamshedpur",
      state: "Jharkhand",
      rating: 4.7,
      totalFees: 1180000,
      established: 1949,
      type: CollegeType.PRIVATE,
      category: "Management",
      overview: "XLRI Jamshedpur is India's oldest business school, established in 1949. It is globally recognized as the absolute No. 1 institution for Human Resources Management (HRM) in Asia.",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
      website: "https://www.xlri.ac.in",
      courses: [
        { name: "PGDM Human Resource Management", duration: 2, fees: 1180000, seats: 180 },
        { name: "PGDM Business Management", duration: 2, fees: 1180000, seats: 180 }
      ],
      placement: {
        avgPackage: 30,
        highestPackage: 75,
        placementRate: 100.0,
        topRecruiters: ["Aditya Birla Group", "TAS", "HUL", "P&G", "BCG", "Mercer"],
        year: 2025
      },
      reviews: [
        { authorName: "Swati Sengupta", rating: 4.8, content: "XLRI teaches extreme values and community bonding. The XL-culture is highly cooperative, unlike the cut-throat environments elsewhere.", pros: "HR Capital of India, amazing cooperative student culture.", cons: "Jamshedpur connectivity is slightly poor.", batch: 2024 }
      ]
    },
    {
      name: "Faculty of Management Studies (FMS)",
      slug: "fms-delhi",
      location: "Malka Ganj, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.6,
      totalFees: 100000,
      established: 1954,
      type: CollegeType.GOVERNMENT,
      category: "Management",
      overview: "FMS Delhi is legendary as the 'Red Building of Dreams'. Affiliated with Delhi University, it is highly famous for its incredibly low tuition fees and placement figures matching IIM ABC, yielding the highest ROI in management education.",
      imageUrl: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=600&auto=format&fit=crop",
      website: "http://fms.edu",
      courses: [
        { name: "MBA Full Time", duration: 2, fees: 100000, seats: 290 }
      ],
      placement: {
        avgPackage: 31,
        highestPackage: 96,
        placementRate: 100.0,
        topRecruiters: ["Morgan Stanley", "Google", "HUL", "BCG", "E&Y", "Reliance"],
        year: 2025
      },
      reviews: [
        { authorName: "Pankaj Sethi", rating: 4.7, content: "The ROI is simply mind-blowing. Total fees are under 2 lakhs for two years, but you sit in the exact same placement drives as IIMs.", pros: "Supreme ROI, located in Delhi University North Campus.", cons: "Tiny campus infrastructure compared to massive IIM properties.", batch: 2024 }
      ]
    },
    {
      name: "Symbiosis Institute of Business Management (SIBM) Pune",
      slug: "sibm-pune",
      location: "Lavale, Pune",
      city: "Pune",
      state: "Maharashtra",
      rating: 4.4,
      totalFees: 1100000,
      established: 1978,
      type: CollegeType.DEEMED,
      category: "Management",
      overview: "SIBM Pune is a premier private business school situated on a hilltop in Lavale, Pune, renowned for its dynamic campus life and top marketing and human resource placements.",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
      website: "https://www.sibmpune.edu.in",
      courses: [
        { name: "MBA in Marketing / Finance / HR", duration: 2, fees: 1100000, seats: 180 }
      ],
      placement: {
        avgPackage: 23,
        highestPackage: 49,
        placementRate: 100.0,
        topRecruiters: ["ITC", "P&G", "Marico", "L'Oreal", "Deloitte"],
        year: 2025
      },
      reviews: [
        { authorName: "Nisha K", rating: 4.5, content: "Lavale campus is literally above the clouds. Breathtaking views and superb marketing corporate connect.", pros: "Hilltop scenic campus, top-tier corporate marketing profile.", cons: "Far from Pune main city.", batch: 2025 }
      ]
    },
    {
      name: "S.P. Jain Institute of Management and Research (SPJIMR)",
      slug: "spjimr-mumbai",
      location: "Andheri West, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      rating: 4.6,
      totalFees: 1075000,
      established: 1981,
      type: CollegeType.PRIVATE,
      category: "Management",
      overview: "SPJIMR is a highly ranked private business school in Andheri, Mumbai, unique for its value-based leadership programs like Abhyudaya and excellent PGDM placements.",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
      website: "https://www.spjimr.org",
      courses: [
        { name: "PGDM Business Administration", duration: 2, fees: 1075000, seats: 240 }
      ],
      placement: {
        avgPackage: 29,
        highestPackage: 70,
        placementRate: 100.0,
        topRecruiters: ["Amazon", "Boston Consulting Group", "Unilever", "L'Oreal", "Tata Group"],
        year: 2025
      },
      reviews: [
        { authorName: "Meera Nair", rating: 4.7, content: "The emphasis on social values and community work makes SPJIMR highly unique. And Andheri location gives brilliant access to corporate Mumbai.", pros: "Values-based management, great Andheri location.", cons: "Very strict academic schedules.", batch: 2024 }
      ]
    },
    {
      name: "Management Development Institute (MDI)",
      slug: "mdi-gurugram",
      location: "Sector 17, Gurugram",
      city: "Gurugram",
      state: "Delhi NCR",
      rating: 4.5,
      totalFees: 1120000,
      established: 1973,
      type: CollegeType.PRIVATE,
      category: "Management",
      overview: "MDI Gurugram is a premier private business school in Gurugram, India's corporate hub, ensuring excellent corporate consulting placements.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
      website: "https://www.mdi.ac.in",
      courses: [
        { name: "PGDM (MBA Equivalent)", duration: 2, fees: 1120000, seats: 300 }
      ],
      placement: {
        avgPackage: 26,
        highestPackage: 60,
        placementRate: 100.0,
        topRecruiters: ["Goldman Sachs", "McKinsey", "Cognizant", "Microsoft", "Johnson & Johnson"],
        year: 2025
      },
      reviews: [
        { authorName: "Pranav Goel", rating: 4.6, content: "Superb campus life in Gurgaon's heart. Immediate connection with corporate guests and tech-consulting executives.", pros: "Located in Delhi NCR corporate hub, solid placements.", cons: "Hostel allocation rules are occasionally strict.", batch: 2024 }
      ]
    },
    {
      name: "Narsee Monjee Institute of Management Studies (NMIMS)",
      slug: "nmims-mumbai",
      location: "Vile Parle West, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      rating: 4.2,
      totalFees: 1195000,
      established: 1981,
      type: CollegeType.DEEMED,
      category: "Management",
      overview: "NMIMS School of Business Management in Mumbai is a highly popular deemed university, famous for its massive batch size, high corporate integration, and state-of-the-art skyscraper building.",
      imageUrl: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop",
      website: "https://sbm.nmims.edu",
      courses: [
        { name: "MBA Core", duration: 2, fees: 1195000, seats: 600 }
      ],
      placement: {
        avgPackage: 23,
        highestPackage: 67,
        placementRate: 98.0,
        topRecruiters: ["JPMorgan", "ICICI Bank", "Google", "Dell", "Capgemini"],
        year: 2025
      },
      reviews: [
        { authorName: "Rohan Deshmukh", rating: 4.1, content: "NMIMS has excellent placements. The skyscraper glass-building is very premium, but there is no conventional green campus.", pros: "Elite finance placements, central Mumbai vibe.", cons: "No massive outdoor playground, large batch sizes.", batch: 2024 }
      ]
    },
    {
      name: "Shailesh J. Mehta School of Management (SJMSoM)",
      slug: "sjmsom-iit-bombay",
      location: "IIT Bombay, Powai, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      rating: 4.5,
      totalFees: 700000,
      established: 1995,
      type: CollegeType.GOVERNMENT,
      category: "Management",
      overview: "SJMSoM is the business school of IIT Bombay, offering a highly analytical MBA program with supreme tech-management and operations training.",
      imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=600&auto=format&fit=crop",
      website: "https://www.som.iitb.ac.in",
      courses: [
        { name: "Master of Management (MBA)", duration: 2, fees: 700000, seats: 120 }
      ],
      placement: {
        avgPackage: 28,
        highestPackage: 54,
        placementRate: 100.0,
        topRecruiters: ["P&G", "Amazon", "Intel", "PwC", "Avanade"],
        year: 2025
      },
      reviews: [
        { authorName: "Karan Johar", rating: 4.6, content: "You get access to the entire outstanding infrastructure of IIT Bombay. Operations and consulting roles are excellent.", pros: "IIT Bombay campus benefits, low fee structure for premium MBA.", cons: "Only engineers are eligible for admission.", batch: 2024 }
      ]
    },

    // LAW (7 colleges)
    {
      name: "National Law School of India University (NLSIU)",
      slug: "nlsiu-bangalore",
      location: "Nagarbhavi, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      rating: 4.8,
      totalFees: 275000,
      established: 1987,
      type: CollegeType.GOVERNMENT,
      category: "Law",
      overview: "NLSIU Bangalore is widely recognized as the absolute No. 1 Law school in India. Famous for its highly rigorous 'Trimester System' and legendary moot court activities, it represents the absolute pinnacle of legal studies.",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
      website: "https://www.nls.ac.in",
      courses: [
        { name: "B.A., LL.B. (Hons)", duration: 5, fees: 275000, seats: 180 },
        { name: "Master of Laws (LL.M.)", duration: 1, fees: 200000, seats: 50 }
      ],
      placement: {
        avgPackage: 16,
        highestPackage: 28,
        placementRate: 98.5,
        topRecruiters: ["Shardul Amarchand Mangaldas", "Cyril Amarchand Mangaldas", "Khaitan & Co", "Trilegal", "AZB & Partners"],
        year: 2025
      },
      reviews: [
        { authorName: "Anikait Sen", rating: 4.8, content: "NLSIU is extremely challenging. The trimester system means you have exams almost constantly, but the brand value and moot court exposure are unmatched.", pros: "Mooting legacy, top law firm recruitments, beautiful campus.", cons: "High academic stress and constant examinations.", batch: 2024 }
      ]
    },
    {
      name: "National Law University (NLU) Delhi",
      slug: "nlu-delhi",
      location: "Sector 14, Dwarka",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.7,
      totalFees: 280000,
      established: 2008,
      type: CollegeType.GOVERNMENT,
      category: "Law",
      overview: "NLU Delhi is a premier law university situated in Dwarka, New Delhi. Famous for hosting highly elite legal conferences and its top-tier corporate legal placements.",
      imageUrl: "https://images.unsplash.com/photo-1505664194779-8bebcb95d539?q=80&w=600&auto=format&fit=crop",
      website: "https://nludelhi.ac.in",
      courses: [
        { name: "B.A., LL.B. (Hons)", duration: 5, fees: 280000, seats: 120 }
      ],
      placement: {
        avgPackage: 15,
        highestPackage: 25,
        placementRate: 97.0,
        topRecruiters: ["Trilegal", "Khaitan & Co", "Luthra & Luthra", "AZB", "JSA"],
        year: 2025
      },
      reviews: [
        { authorName: "Tanvi Gupta", rating: 4.6, content: "Excellent infrastructure in Dwarka. Moot court halls are super premium and the research output is very high.", pros: "Modern infrastructure, top corporate placement rate.", cons: "Dwarka is a bit far from Delhi's central action.", batch: 2024 }
      ]
    },
    {
      name: "NALSAR University of Law",
      slug: "nalsar-hyderabad",
      location: "Shameerpet, Hyderabad",
      city: "Hyderabad",
      state: "Telangana",
      rating: 4.7,
      totalFees: 260000,
      established: 1998,
      type: CollegeType.GOVERNMENT,
      category: "Law",
      overview: "NALSAR is a highly prestigious law university on a sprawling lakeside campus in Shameerpet, Hyderabad, celebrated for its brilliant academic freedom.",
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
      website: "https://www.nalsar.ac.in",
      courses: [
        { name: "B.A., LL.B. (Hons)", duration: 5, fees: 260000, seats: 130 }
      ],
      placement: {
        avgPackage: 15,
        highestPackage: 26,
        placementRate: 98.0,
        topRecruiters: ["Cyril Amarchand Mangaldas", "Trilegal", "Khaitan & Co", "AZB", "Talwar Thakore & Associates"],
        year: 2025
      },
      reviews: [
        { authorName: "Kavya Reddy", rating: 4.7, content: "Sprawling lake-side campus with immense student autonomy. The research culture and legal discussions here are top-tier.", pros: "Lakeside green campus, immense student freedom.", cons: "Shameerpet is located 30km away from central Hyderabad.", batch: 2024 }
      ]
    },
    {
      name: "West Bengal National University of Juridical Sciences (NUJS)",
      slug: "nujs-kolkata",
      location: "Salt Lake, Kolkata",
      city: "Kolkata",
      state: "West Bengal",
      rating: 4.6,
      totalFees: 245000,
      established: 1999,
      type: CollegeType.GOVERNMENT,
      category: "Law",
      overview: "NUJS Kolkata, located in Salt Lake, is highly celebrated in India for its rich mooting history and outstanding corporate placement pipelines.",
      imageUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
      website: "https://www.nujs.edu",
      courses: [
        { name: "B.A., LL.B. (Hons)", duration: 5, fees: 245000, seats: 125 }
      ],
      placement: {
        avgPackage: 14,
        highestPackage: 24,
        placementRate: 96.5,
        topRecruiters: ["Khaitan & Co", "Trilegal", "AZB & Partners", "ICICI Bank Legal", "PwC Legal"],
        year: 2025
      },
      reviews: [
        { authorName: "Anirudh Ghosh", rating: 4.5, content: "NUJS dominates national moot court championships. Salt Lake location is excellent with a brilliant student lifestyle.", pros: "Mooting records, salt lake prime location.", cons: "Campus size is compact compared to other NLUs.", batch: 2023 }
      ]
    },
    {
      name: "National Law University (NLU) Jodhpur",
      slug: "nlu-jodhpur",
      location: "Mandore, Jodhpur",
      city: "Jodhpur",
      state: "Rajasthan",
      rating: 4.5,
      totalFees: 250000,
      established: 1999,
      type: CollegeType.GOVERNMENT,
      category: "Law",
      overview: "NLU Jodhpur is a premier law school located in the historic city of Jodhpur, offering dynamic legal programs and top judicial coaching outcomes.",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=600&auto=format&fit=crop",
      website: "http://www.nlujodhpur.ac.in",
      courses: [
        { name: "B.A., LL.B. (Hons)", duration: 5, fees: 250000, seats: 120 }
      ],
      placement: {
        avgPackage: 13,
        highestPackage: 22,
        placementRate: 95.0,
        topRecruiters: ["Trilegal", "SAM", "CAM", "Khaitan", "JSA"],
        year: 2025
      },
      reviews: [
        { authorName: "Devendra Rathore", rating: 4.4, content: "Very neat, clean campus in Jodhpur. The legal research and faculty are very cooperative.", pros: "Judicial services coaching support, peaceful campus.", cons: "Extremely hot weather during summer terms.", batch: 2024 }
      ]
    },
    {
      name: "Symbiosis Law School (SLS) Pune",
      slug: "sls-pune",
      location: "Viman Nagar, Pune",
      city: "Pune",
      state: "Maharashtra",
      rating: 4.3,
      totalFees: 400000,
      established: 1977,
      type: CollegeType.PRIVATE,
      category: "Law",
      overview: "SLS Pune is a premium private law school under Symbiosis International University, famous for its outstanding corporate law firms internships.",
      imageUrl: "https://images.unsplash.com/photo-1505664194779-8bebcb95d539?q=80&w=600&auto=format&fit=crop",
      website: "https://www.symlaw.ac.in",
      courses: [
        { name: "B.A. LL.B. / B.B.A. LL.B.", duration: 5, fees: 400000, seats: 240 }
      ],
      placement: {
        avgPackage: 10,
        highestPackage: 20,
        placementRate: 92.0,
        topRecruiters: ["Luthra & Luthra", "AZB", "Lakshmikumaran", "Tatva Legal", "Aditya Birla Group"],
        year: 2025
      },
      reviews: [
        { authorName: "Aishwarya Deshpande", rating: 4.2, content: "Superb campus life in Viman Nagar, Pune. Great corporate internships and international seminars.", pros: "Viman Nagar urban lifestyle, good internships.", cons: "Fees are higher than government NLUs.", batch: 2024 }
      ]
    },
    {
      name: "Gujarat National Law University (GNLU)",
      slug: "gnlu-gandhinagar",
      location: "Koba, Gandhinagar",
      city: "Gandhinagar",
      state: "Gujarat",
      rating: 4.5,
      totalFees: 250000,
      established: 2003,
      type: CollegeType.GOVERNMENT,
      category: "Law",
      overview: "GNLU Gandhinagar is a highly reputed national law university in Gujarat, famous for its massive sports infrastructure, legal research, and corporate placements.",
      imageUrl: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?q=80&w=600&auto=format&fit=crop",
      website: "https://www.gnlu.ac.in",
      courses: [
        { name: "B.A., LL.B. (Hons)", duration: 5, fees: 250000, seats: 180 }
      ],
      placement: {
        avgPackage: 12,
        highestPackage: 22,
        placementRate: 94.0,
        topRecruiters: ["SAM", "CAM", "Trilegal", "Adani Group Legal", "Reliance Legal"],
        year: 2025
      },
      reviews: [
        { authorName: "Jayesh Patel", rating: 4.4, content: "Superb sports campus and world class moot court halls. The library is massive and highly resourceful.", pros: "Outstanding sports facilities, rich library database.", cons: "Strict hostel gates timing rules.", batch: 2024 }
      ]
    },

    // ARTS & COMMERCE (10 colleges)
    {
      name: "Lady Shri Ram College for Women (LSR)",
      slug: "lsr-delhi",
      location: "Lajpat Nagar, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.7,
      totalFees: 20000,
      established: 1956,
      type: CollegeType.GOVERNMENT,
      category: "Arts",
      overview: "LSR is a premier women's college under Delhi University, highly famous for its psychology and economics degrees, excellent liberal-arts teaching, and top corporate consulting placements.",
      imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
      website: "https://lsr.edu.in",
      courses: [
        { name: "B.A. (Hons) Psychology", duration: 3, fees: 20000, seats: 60 },
        { name: "B.A. (Hons) Economics", duration: 3, fees: 18000, seats: 100 }
      ],
      placement: {
        avgPackage: 10,
        highestPackage: 40,
        placementRate: 94.5,
        topRecruiters: ["McKinsey", "BCG", "Kepler Cannon", "EY", "Deloitte"],
        year: 2025
      },
      reviews: [
        { authorName: "Kritika Sen", rating: 4.8, content: "LSR transforms you completely. The academic discussions, strong emphasis on women leadership, and top consulting placements are elite.", pros: "Highly qualified professors, rich liberal arts discussions, top placements.", cons: "Limited hostel accommodation inside campus.", batch: 2024 }
      ]
    },
    {
      name: "Shri Ram College of Commerce (SRCC)",
      slug: "srcc-delhi",
      location: "North Campus, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.8,
      totalFees: 30000,
      established: 1926,
      type: CollegeType.GOVERNMENT,
      category: "Commerce",
      overview: "SRCC is widely recognized as the absolute No. 1 college for Commerce in India. Located in Delhi University North Campus, it holds a legendary reputation for its B.Com (Hons) placements and highly selective cut-offs.",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=600&auto=format&fit=crop",
      website: "https://www.srcc.edu",
      courses: [
        { name: "B.Com (Hons)", duration: 3, fees: 30000, seats: 600 },
        { name: "B.A. (Hons) Economics", duration: 3, fees: 28000, seats: 150 }
      ],
      placement: {
        avgPackage: 12,
        highestPackage: 45,
        placementRate: 96.0,
        topRecruiters: ["Brain & Company", "McKinsey", "DE Shaw", "JPMorgan", "Deutsche Bank"],
        year: 2025
      },
      reviews: [
        { authorName: "Ayush Gupta", rating: 4.9, content: "SRCC is the IIT of Commerce. The placements are higher than many tier-1 MBA colleges. Extremely active finance societies.", pros: "Unbeatable commerce placements, prestigious DU brand.", cons: "Admission requires extreme NEET/CUET percentages.", batch: 2024 }
      ]
    },
    {
      name: "Loyola College",
      slug: "loyola-college-chennai",
      location: "Nungambakkam, Chennai",
      city: "Chennai",
      state: "Tamil Nadu",
      rating: 4.6,
      totalFees: 48000,
      established: 1925,
      type: CollegeType.GOVERNMENT,
      category: "Arts",
      overview: "Loyola College is a highly reputed Jesuit institution in Chennai, established in 1925, offering premier science, commerce, and liberal arts programs.",
      imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600&auto=format&fit=crop",
      website: "http://www.loyolacollege.edu",
      courses: [
        { name: "B.Com General", duration: 3, fees: 48000, seats: 200 },
        { name: "B.A. English Literature", duration: 3, fees: 38000, seats: 120 }
      ],
      placement: {
        avgPackage: 7,
        highestPackage: 22,
        placementRate: 91.0,
        topRecruiters: ["Goldman Sachs", "EY", "Cognizant", "Deloitte", "TresVista"],
        year: 2025
      },
      reviews: [
        { authorName: "Vijay Kumar", rating: 4.6, content: "The heritage of Loyola is massive. Outstanding professors and highly disciplined campus schedules.", pros: "Historic campus, superb commerce placements.", cons: "Strict attendance checking rules.", batch: 2024 }
      ]
    },
    {
      name: "St. Stephen's College",
      slug: "st-stephens-delhi",
      location: "North Campus, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.8,
      totalFees: 42000,
      established: 1881,
      type: CollegeType.GOVERNMENT,
      category: "Arts",
      overview: "St. Stephen's is one of India's oldest and most prestigious liberal arts institutions, famous for its grand red-brick architecture, highly intellectual alumni network, and distinct tutorials system.",
      imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd996c5c0c?q=80&w=600&auto=format&fit=crop",
      website: "https://ststephens.edu",
      courses: [
        { name: "B.A. (Hons) English", duration: 3, fees: 42000, seats: 60 },
        { name: "B.Sc. (Hons) Mathematics", duration: 3, fees: 45000, seats: 60 }
      ],
      placement: {
        avgPackage: 11,
        highestPackage: 40,
        placementRate: 95.0,
        topRecruiters: ["McKinsey", "BCG", "Bain", "Kearney", "Oliver Wyman"],
        year: 2025
      },
      reviews: [
        { authorName: "Dev Dutt", rating: 4.8, content: "Stephen's has a highly unique intellectual vibe. The dining hall discussions are legendary and tutorial systems are very personal.", pros: "Intellectual peer group, rich red brick heritage, elite consulting placements.", cons: "Highly traditional rules.", batch: 2024 }
      ]
    },
    {
      name: "St. Xavier's College",
      slug: "st-xaviers-mumbai",
      location: "Mahapalika Marg, Fort",
      city: "Mumbai",
      state: "Maharashtra",
      rating: 4.6,
      totalFees: 38000,
      established: 1869,
      type: CollegeType.PRIVATE,
      category: "Arts",
      overview: "St. Xavier's College Mumbai is a highly iconic Jesuit institution in Fort, Mumbai, renowned for its stunning Gothic architecture, highly active student fests like Malhar, and elite media and arts training.",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
      website: "https://xaviers.edu",
      courses: [
        { name: "B.A. (Arts)", duration: 3, fees: 25000, seats: 360 },
        { name: "Bachelor of Mass Media (BMM)", duration: 3, fees: 45000, seats: 60 }
      ],
      placement: {
        avgPackage: 8,
        highestPackage: 30,
        placementRate: 92.5,
        topRecruiters: ["Google India", "Citi Bank", "Bloomberg", "Condé Nast", "Viacom18"],
        year: 2025
      },
      reviews: [
        { authorName: "Karan Johar", rating: 4.7, content: "Malhar festival is an incredible experience. The campus feels like Hogwarts. Highly premium liberal arts discussions.", pros: "Gothic Hogwarts campus, Malhar fest, top media placements.", cons: "Strict attendance rules.", batch: 2024 }
      ]
    },
    {
      name: "Christ University",
      slug: "christ-university-bangalore",
      location: "Hosur Road, Bengaluru",
      city: "Bengaluru",
      state: "Karnataka",
      rating: 4.3,
      totalFees: 185000,
      established: 1969,
      type: CollegeType.DEEMED,
      category: "Commerce",
      overview: "Christ University is a highly famous private deemed university in Bengaluru, boasting multiple campuses, extremely active cultural groups, and top commerce/business placements.",
      imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=600&auto=format&fit=crop",
      website: "https://christuniversity.in",
      courses: [
        { name: "Bachelor of Business Administration (BBA)", duration: 3, fees: 185000, seats: 400 },
        { name: "B.Com Honors", duration: 3, fees: 175000, seats: 300 }
      ],
      placement: {
        avgPackage: 8,
        highestPackage: 21,
        placementRate: 91.5,
        topRecruiters: ["Goldman Sachs", "Deloitte", "EY", "KPMG", "Amazon"],
        year: 2025
      },
      reviews: [
        { authorName: "Preeti Hegde", rating: 4.2, content: "Very clean and highly disciplined campus Hosur Road. Excellent fests and presentation-based studies.", pros: "Presentation skills development, active campus life.", cons: "Extremely strict dress code and 85% compulsory attendance.", batch: 2024 }
      ]
    },
    {
      name: "Miranda House",
      slug: "miranda-house-delhi",
      location: "North Campus, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.7,
      totalFees: 18000,
      established: 1948,
      type: CollegeType.GOVERNMENT,
      category: "Arts",
      overview: "Miranda House is a leading women's college under Delhi University, consistently ranked No. 1 in the college category by NIRF for several consecutive years, famous for its science and humanities studies.",
      imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=600&auto=format&fit=crop",
      website: "http://www.mirandahouse.ac.in",
      courses: [
        { name: "B.A. (Hons) English", duration: 3, fees: 18000, seats: 80 }
      ],
      placement: {
        avgPackage: 8,
        highestPackage: 26,
        placementRate: 93.0,
        topRecruiters: ["McKinsey", "Deloitte", "TresVista", "ZS Associates", "PwC"],
        year: 2025
      },
      reviews: [
        { authorName: "Garima Singh", rating: 4.7, content: " कंसिस्टेंटली रेंक्ड #1 फॉर ए रीज़न. Outstanding intellectual freedom, supportive faculty, and active cultural societies.", pros: "Academic excellence, highly progressive, DU North Campus.", cons: "Limited hostel seats.", batch: 2024 }
      ]
    },
    {
      name: "Presidency College",
      slug: "presidency-college-chennai",
      location: "Kamaraajar Salai, Triplicane",
      city: "Chennai",
      state: "Tamil Nadu",
      rating: 4.2,
      totalFees: 8000,
      established: 1840,
      type: CollegeType.GOVERNMENT,
      category: "Arts",
      overview: "Presidency College Chennai is a historic government college located right on Marina Beach, established in 1840, renowned for its strong humanities research.",
      imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=600&auto=format&fit=crop",
      website: "http://www.presidencycollegechennai.ac.in",
      courses: [
        { name: "B.A. History", duration: 3, fees: 2000, seats: 120 }
      ],
      placement: {
        avgPackage: 5,
        highestPackage: 12,
        placementRate: 88.0,
        topRecruiters: ["TCS", "Cognizant", "Sutherland", "Murugappa Group"],
        year: 2025
      },
      reviews: [
        { authorName: "Karthik S", rating: 4.1, content: "Historic campus right opposite Marina Beach. Extremely low fees make it accessible to everyone.", pros: "Marina Beach view, historic legacy, extremely cheap fees.", cons: "Infrastructure needs maintenance.", batch: 2023 }
      ]
    },
    {
      name: "Fergusson College",
      slug: "fergusson-college-pune",
      location: "FC Road, Pune",
      city: "Pune",
      state: "Maharashtra",
      rating: 4.4,
      totalFees: 24000,
      established: 1885,
      type: CollegeType.PRIVATE,
      category: "Arts",
      overview: "Fergusson College is a historic and highly famous autonomous college on FC Road, Pune, celebrated for its rich arts, science, and liberal arts programs.",
      imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?q=80&w=600&auto=format&fit=crop",
      website: "https://www.fergusson.edu",
      courses: [
        { name: "B.A. Economics", duration: 3, fees: 8000, seats: 180 },
        { name: "B.A. Psychology", duration: 3, fees: 10000, seats: 120 }
      ],
      placement: {
        avgPackage: 6,
        highestPackage: 18,
        placementRate: 90.0,
        topRecruiters: ["De Shaw", "EY", "Cognizant", "Deloitte", "Wipro"],
        year: 2025
      },
      reviews: [
        { authorName: "Sneha Joshi", rating: 4.5, content: "Fergusson has Pune's best student culture. FC road is filled with cafes and student hubs. Great liberal learning.", pros: "Scenic hill campus, highly vibrant FC road vibe.", cons: "Office admin works slowly.", batch: 2024 }
      ]
    },
    {
      name: "Hindu College",
      slug: "hindu-college-delhi",
      location: "North Campus, New Delhi",
      city: "New Delhi",
      state: "Delhi",
      rating: 4.7,
      totalFees: 25000,
      established: 1899,
      type: CollegeType.GOVERNMENT,
      category: "Commerce",
      overview: "Hindu College is one of the most prestigious constituent colleges under Delhi University, famous for its historic role in India's independence movement and outstanding placements in commerce.",
      imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd996c5c0c?q=80&w=600&auto=format&fit=crop",
      website: "http://www.hinducollege.ac.in",
      courses: [
        { name: "B.Com (Hons)", duration: 3, fees: 25000, seats: 120 }
      ],
      placement: {
        avgPackage: 11,
        highestPackage: 38,
        placementRate: 95.0,
        topRecruiters: ["Brain & Co", "McKinsey", "Google", "EY", "KPMG"],
        year: 2025
      },
      reviews: [
        { authorName: "Kshitij Aggarwal", rating: 4.8, content: "Hindu College has an exceptional legacy. The parliament discussions (Hindu Parliament) are legendary.", pros: "Top class faculty, highly intellectual atmosphere, central DU location.", cons: "Hostel seats are highly competitive to get.", batch: 2024 }
      ]
    }
  ];

  console.log(`Generating programmatic variations to populate exactly 50+ colleges...`);
  
  // Seed all templates in parallel
  console.log("Seeding all college templates concurrently...");
  const seedPromises = collegeTemplates.map(async (t) => {
    return prisma.college.create({
      data: {
        name: t.name,
        slug: t.slug,
        location: t.location,
        city: t.city,
        state: t.state,
        rating: t.rating,
        totalFees: t.totalFees,
        established: t.established,
        type: t.type,
        category: t.category,
        overview: t.overview,
        imageUrl: t.imageUrl,
        website: t.website,
        courses: {
          create: t.courses
        },
        placements: {
          create: t.placement
        },
        reviews: {
          create: t.reviews.map(r => ({
            authorName: r.authorName,
            rating: r.rating,
            content: r.content,
            pros: r.pros,
            cons: r.cons,
            batch: r.batch
          }))
        }
      }
    });
  });

  await Promise.all(seedPromises);
  console.log(`Successfully seeded ${collegeTemplates.length} colleges!`);
  console.log("Database seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during database seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
