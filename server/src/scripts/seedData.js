const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Skill = require('../models/Skill');
const Project = require('../models/Project');
const Comment = require('../models/Comment');
const { normalizeTags } = require('../utils/tagNormalizer');

const seedAll = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_bishal';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // 1. Seed / Update Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'bishalbiswas2027@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(adminPassword, salt);

    let admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      admin = await Admin.create({
        email: adminEmail,
        passwordHash,
      });
      console.log(`Admin created: ${adminEmail} (password: ${adminPassword})`);
    } else {
      admin.passwordHash = passwordHash;
      await admin.save();
      console.log(`Admin updated: ${adminEmail}`);
    }

    // 2. Seed Profile
    await Profile.deleteMany({});
    const profile = await Profile.create({
      name: 'Bishal Biswas',
      title: 'Full-Stack MERN & Systems (C) Developer',
      tagline: 'Architecting resilient full-stack web platforms and high-performance system applications.',
      photoUrl: '/ME.jpg',
      aboutPhotoUrl: '/ME.jpg',
      aboutText:
        'I am a passionate Full-Stack Software Developer specializing in the modern MERN stack (MongoDB, Express.js, React.js 19, Node.js) and low-level systems programming in C. With a rigorous understanding of memory models, cache coherence, and asynchronous runtime mechanics, I bridge the gap between low-level performance and elegant, reactive user interfaces. Whether orchestrating complex Redux Toolkit state architectures, designing hardened RESTful APIs with defense-in-depth security, or optimizing memory pipelines in C, I build software designed for scale, resilience, and speed.',
      resumeUrl: 'https://example.com/resume.pdf',
      socialLinks: {
        github: 'https://github.com/Bishal136',
        linkedin: 'https://linkedin.com/in/bishal',
        email: 'bishalbiswas2027@gmail.com',
      },
    });
    console.log('Profile seeded successfully.');

    // 3. Seed Skills
    await Skill.deleteMany({});
    const skillsData = [
      {
        name: 'React.js',
        icon: 'react',
        proficiency: 92,
        category: 'Frontend',
        order: 1,
        isVisible: true,
      },
      {
        name: 'Node.js',
        icon: 'node',
        proficiency: 90,
        category: 'Backend',
        order: 2,
        isVisible: true,
      },
      {
        name: 'Express.js',
        icon: 'express',
        proficiency: 88,
        category: 'Backend',
        order: 3,
        isVisible: true,
      },
      {
        name: 'MongoDB',
        icon: 'mongodb',
        proficiency: 86,
        category: 'Database',
        order: 4,
        isVisible: true,
      },
      {
        name: 'Redux Toolkit',
        icon: 'redux',
        proficiency: 88,
        category: 'Frontend',
        order: 5,
        isVisible: true,
      },
      {
        name: 'Tailwind CSS',
        icon: 'tailwind',
        proficiency: 90,
        category: 'Frontend',
        order: 6,
        isVisible: true,
      },
      {
        name: 'C Programming',
        icon: 'c',
        proficiency: 82,
        category: 'Language',
        order: 7,
        isVisible: true,
      },
      {
        name: 'MySQL',
        icon: 'mysql',
        proficiency: 80,
        category: 'Database',
        order: 8,
        isVisible: true,
      },
      {
        name: 'JavaScript',
        icon: 'javascript',
        proficiency: 92,
        category: 'Language',
        order: 9,
        isVisible: true,
      },
      {
        name: 'Git & GitHub',
        icon: 'git',
        proficiency: 85,
        category: 'Tools',
        order: 10,
        isVisible: true,
      },
    ];
    await Skill.insertMany(skillsData);
    console.log(`Seeded ${skillsData.length} skills.`);

    // 4. Seed Projects (Disambiguated titles, fixed typos, and normalized canonical tags)
    await Project.deleteMany({});
    const projectsData = [
      {
        title: 'Multi-Role E-Commerce Platform (Buyer, Seller & Admin Suite)',
        slug: 'multi-role-ecommerce-platform',
        shortDescription:
          'Enterprise multi-vendor commerce platform with distinct buyer workflows, seller inventory consoles, and role-based administrative control panel.',
        fullDescription:
          'A comprehensive multi-role e-commerce web platform engineered with MongoDB, Express.js, React.js, and Node.js. Includes advanced seller storefronts, buyer shopping experiences, persistent cart state with Redux Toolkit, integrated Stripe checkout with webhook verification, and an administrative control panel for full platform oversight and dispute resolution.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        ],
        demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videos: [
          'https://www.youtube.com/embed/dQw4w9WgXcQ',
        ],
        role: 'Lead Full-Stack Developer',
        duration: '3 Months',
        liveSiteUrl: 'https://demo-ecommerce.example.com',
        githubRepoUrl: 'https://github.com/Bishal136/multi-role-ecommerce',
        techStack: normalizeTags(['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'Stripe']),
        features: [
          {
            icon: 'layout',
            title: 'Unified Control Panel',
            description: 'Intuitive administrative control panel providing granular access policies, revenue reporting, and user moderation.',
          },
          {
            icon: 'shield-check',
            title: 'Role-Based Authentication',
            description: 'Defense-in-depth security model using JWT token rotation and HTTP-only cookie validation.',
          },
          {
            icon: 'credit-card',
            title: 'Stripe Payment Gateway',
            description: 'Production-ready checkout flow supporting asynchronous webhooks and automated order fulfillment.',
          },
          {
            icon: 'shopping-bag',
            title: 'Sub-Second Product Search',
            description: 'Compound indexed catalog search with price filters, live tag sorting, and stock decrement locks.',
          },
        ],
        order: 1,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'Full-Stack MERN Storefront & Checkout Engine',
        slug: 'mern-storefront-checkout-engine',
        shortDescription:
          'High-conversion digital storefront featuring instant search, resilient Stripe checkout webhooks, and real-time inventory synchronization.',
        fullDescription:
          'A high-performance customer-facing digital storefront built with React.js 19 and Node.js, focusing on ultra-fast initial page loads, optimistic UI updates via Redux Toolkit, and hardened payment checkout handling with idempotent Stripe webhooks. Features clean modular API routes and comprehensive control panel analytics.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
        ],
        demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videos: [
          'https://www.youtube.com/embed/dQw4w9WgXcQ',
        ],
        role: 'Full-Stack Developer',
        duration: '2.5 Months',
        liveSiteUrl: 'https://storefront-demo.example.com',
        githubRepoUrl: 'https://github.com/Bishal136/mern-storefront',
        techStack: normalizeTags(['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS']),
        features: [
          {
            icon: 'shopping-bag',
            title: 'Optimistic State Cart',
            description: 'Zero-latency cart modifications utilizing RTK Query optimistic cache updates.',
          },
          {
            icon: 'credit-card',
            title: 'Idempotent Webhook Engine',
            description: 'Robust server architecture ensuring zero duplicate charges across asynchronous network blips.',
          },
          {
            icon: 'layout',
            title: 'Merchant Control Panel',
            description: 'Streamlined control panel for item stock adjustment, shipping labels, and customer communication.',
          },
        ],
        order: 2,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'Smart Gas Detection & Auto Cut-Off System (IoT & React)',
        slug: 'smart-gas-detection-system',
        shortDescription:
          'IoT hazard monitoring dashboard connecting MQ gas sensors to an automated valve cut-off solenoid with real-time browser alerts and emergency control panel.',
        fullDescription:
          'An IoT hardware and web application developed to prevent industrial and domestic gas hazards. Gas sensor telemetry streams directly to an interactive React.js control panel with audible threshold alarms and automated servo-driven solenoid shut-off managed by firmware logic.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        ],
        demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videos: [
          'https://www.youtube.com/embed/dQw4w9WgXcQ',
        ],
        role: 'Embedded & Systems Architect',
        duration: '2 Months',
        liveSiteUrl: 'https://gas-detection-iot.example.com',
        githubRepoUrl: 'https://github.com/Bishal136/smart-gas-detection',
        techStack: normalizeTags(['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'C']),
        features: [
          {
            icon: 'layout',
            title: 'Real-Time Sensor Control Panel',
            description: 'Live sensor telemetry visualizer with sub-second WebSocket updates and historical ppm logging.',
          },
          {
            icon: 'shield-check',
            title: 'Hardware Cut-Off Solenoid',
            description: 'Safety interrupt logic executed in C on the microcontroller to isolate fuel valves immediately upon leak threshold.',
          },
          {
            icon: 'clock',
            title: 'Instant Incident Notifications',
            description: 'Automated emergency SMS and push alerts broadcasted to duty safety officers.',
          },
        ],
        order: 3,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'C Systems Memory & Stream Engine',
        slug: 'c-systems-memory-stream-engine',
        shortDescription:
          'High-performance CLI utility in C for zero-copy chunked binary file parsing, memory benchmarking, and data indexing.',
        fullDescription:
          'A low-level systems programming project written in C demonstrating deep understanding of memory management, pointer arithmetic, dynamic allocations (malloc/free/realloc), and POSIX file I/O. Capable of streaming gigabyte-sized log files with minimal memory footprint and zero leaks.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80',
        ],
        demoVideoUrl: '',
        videos: [],
        role: 'Systems Programmer',
        duration: '1.5 Months',
        liveSiteUrl: '',
        githubRepoUrl: 'https://github.com/Bishal136/c-stream-engine',
        techStack: normalizeTags(['C', 'Makefile', 'Valgrind']),
        features: [
          {
            icon: 'cpu',
            title: 'Zero-Copy Ring Buffer',
            description: 'Custom ring buffer architecture for efficient high-throughput log ingestion and parsing.',
          },
          {
            icon: 'hard-drive',
            title: 'POSIX File I/O Engine',
            description: 'Direct system calls for unbuffered multi-gigabyte file manipulation with constant RAM usage.',
          },
          {
            icon: 'check-circle',
            title: 'Valgrind Leak-Free Audit',
            description: '100% clean memory allocation validated through automated Valgrind CI test suites.',
          },
        ],
        order: 4,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'Developer Task Manager & Kanban',
        slug: 'developer-task-manager',
        shortDescription:
          'Interactive agile sprint and Kanban board application with drag-and-drop workflow, team collaboration, and task analytics.',
        fullDescription:
          'A productive workspace built for engineering teams to manage sprints and track tasks with smooth drag-and-drop column transitions and an intuitive project control panel. Features real-time state synchronization, markdown task descriptions, and swimlane filtering.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=1200&q=80',
        ],
        demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        videos: [
          'https://www.youtube.com/embed/dQw4w9WgXcQ',
        ],
        role: 'Frontend & API Engineer',
        duration: '2 Months',
        liveSiteUrl: 'https://kanban-demo.example.com',
        githubRepoUrl: 'https://github.com/Bishal136/task-manager',
        techStack: normalizeTags(['React.js', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS']),
        features: [
          {
            icon: 'layout',
            title: 'Agile Kanban Control Panel',
            description: 'Smooth reordering of cards across custom sprint swimlanes and status columns.',
          },
          {
            icon: 'users',
            title: 'Team Workspaces',
            description: 'Role-based access, task assignment tags, priority badges, and thread discussions.',
          },
        ],
        order: 5,
        isFeatured: false,
        isPublished: true,
      },
      {
        title: 'Weather & Climate Analytics Dashboard',
        slug: 'weather-analytics-dashboard',
        shortDescription:
          'Interactive weather forecasting app with geolocation, historical climate charts, UV index alerts, and severe storm radar.',
        fullDescription:
          'A sleek, responsive dashboard providing minute-by-minute precipitation forecasts, interactive temperature heatmaps, and historical climate comparisons. Integrated with OpenWeather APIs, featuring high-contrast dark visual design.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1200&q=80',
        images: [
          'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1534088568595-a066f410bcda?auto=format&fit=crop&w=1200&q=80',
        ],
        demoVideoUrl: '',
        videos: [],
        role: 'Full-Stack Developer',
        duration: '1.5 Months',
        liveSiteUrl: 'https://weather-demo.example.com',
        githubRepoUrl: 'https://github.com/Bishal136/weather-dashboard',
        techStack: normalizeTags(['React.js', 'Tailwind CSS', 'JavaScript']),
        features: [
          {
            icon: 'cloud-sun',
            title: 'Granular Hourly Forecast',
            description: 'Hourly temperature, humidity, wind speeds, and precipitation likelihood curves.',
          },
          {
            icon: 'map-pin',
            title: 'Geolocation Intelligence',
            description: 'Auto-detect current location and bookmark favorite cities for instant switching.',
          },
        ],
        order: 6,
        isFeatured: false,
        isPublished: true,
      },
    ];

    const createdProjects = await Project.insertMany(projectsData);
    console.log(`Seeded ${createdProjects.length} projects.`);

    // 5. Seed Comments
    await Comment.deleteMany({});
    const commentsData = [
      {
        project: createdProjects[0]._id,
        name: 'Sarah Jenkins',
        role: 'Tech Lead',
        text: 'The checkout architecture and Stripe integration are exceptionally smooth and resilient. Impressive control panel design!',
        approved: true,
      },
      {
        project: createdProjects[0]._id,
        name: 'Alex Rivera',
        role: 'Senior Backend Engineer',
        text: 'Clean separation of concerns in the Express controllers, rock-solid token rotation, and elegant Redux state handling.',
        approved: true,
      },
      {
        project: createdProjects[2]._id,
        name: 'Marcus Vance',
        role: 'IoT Systems Reviewer',
        text: 'The emergency valve shut-off logic in C paired with the React telemetry dashboard is a great engineering showcase.',
        approved: true,
      },
      {
        project: createdProjects[3]._id,
        name: 'David K.',
        role: 'Systems Software Engineer',
        text: 'Fantastic to see deep low-level C memory mastery alongside modern MERN applications. The Valgrind reports are spotless.',
        approved: true,
      },
    ];
    await Comment.insertMany(commentsData);
    console.log(`Seeded ${commentsData.length} comments.`);

    console.log('All seed data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedAll();
