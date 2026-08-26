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

const seedAll = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio_bishal';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB.');

    // 1. Seed / Update Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'bishalbiswas2026@gmail.com';
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
      title: 'Full-Stack MERN & C Developer',
      tagline: 'Crafting Robust Web Solutions with Core Logic Passion',
      photoUrl: '/ME.jpg',
      aboutPhotoUrl: '/ME.jpg',
      aboutText:
        'I am a passionate Full-Stack Software Developer specializing in the MERN stack (MongoDB, Express, React, Node.js) and low-level system design with C. With a strong grasp of data structures, algorithms, and clean architecture, I thrive on engineering fast, reliable, and user-centric web applications. Whether building complex reactive frontends, designing resilient RESTful APIs, or optimizing memory in system tools, I bring dedication and attention to detail to every line of code.',
      resumeUrl: 'https://example.com/resume.pdf',
      socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'bishalbiswas2026@gmail.com',
      },
    });
    console.log('Profile seeded successfully.');

    // 3. Seed Skills
    await Skill.deleteMany({});
    const skillsData = [
      {
        name: 'React.js',
        icon: 'react',
        proficiency: 85,
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
        proficiency: 80,
        category: 'Backend',
        order: 3,
        isVisible: true,
      },
      {
        name: 'MongoDB',
        icon: 'mongodb',
        proficiency: 85,
        category: 'Database',
        order: 4,
        isVisible: true,
      },
      {
        name: 'MySQL',
        icon: 'mysql',
        proficiency: 80,
        category: 'Database',
        order: 5,
        isVisible: true,
      },
      {
        name: 'C Language',
        icon: 'c',
        proficiency: 75,
        category: 'Language',
        order: 6,
        isVisible: true,
      },
      {
        name: 'JavaScript (ES6+)',
        icon: 'javascript',
        proficiency: 90,
        category: 'Language',
        order: 7,
        isVisible: true,
      },
      {
        name: 'Tailwind CSS',
        icon: 'tailwind',
        proficiency: 88,
        category: 'Frontend',
        order: 8,
        isVisible: true,
      },
      {
        name: 'Redux Toolkit',
        icon: 'redux',
        proficiency: 82,
        category: 'Frontend',
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

    // 4. Seed Projects
    await Project.deleteMany({});
    const projectsData = [
      {
        title: 'MERN E-Commerce Store',
        slug: 'mern-e-commerce-store',
        shortDescription:
          'Full-featured e-commerce platform with real-time cart state, Stripe payment gateway, product reviews, and admin dashboard.',
        fullDescription:
          'A comprehensive full-stack e-commerce web platform engineered with MongoDB, Express.js, React, and Node.js. Includes complete product catalog management with multi-criteria filtering, persistent shopping cart using Redux Toolkit, integrated Stripe checkout with webhook verification, order tracking, and a comprehensive role-based admin dashboard.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=1200&q=80',
        demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        role: 'Lead Full-Stack Developer',
        duration: '3 Months',
        liveSiteUrl: 'https://demo-ecommerce.example.com',
        githubRepoUrl: 'https://github.com/example/mern-ecommerce',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'Stripe'],
        features: [
          {
            icon: 'shopping-bag',
            title: 'Product Catalog & Search',
            description: 'Instant search, category filters, price ranges, and pagination with caching.',
          },
          {
            icon: 'shield-check',
            title: 'Authentication & RBAC',
            description: 'JWT token auth with refresh token rotation and role-based access control.',
          },
          {
            icon: 'credit-card',
            title: 'Stripe Payment Gateway',
            description: 'Secure checkout workflow with webhook handling and invoice generation.',
          },
          {
            icon: 'bar-chart',
            title: 'Admin Analytics Dashboard',
            description: 'Real-time sales charts, inventory tracking, order dispatch management.',
          },
        ],
        order: 1,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'Developer Task Manager & Kanban',
        slug: 'developer-task-manager',
        shortDescription:
          'Interactive agile sprint and Kanban board application with drag-and-drop workflow, team collaboration, and task analytics.',
        fullDescription:
          'A productive workspace built for engineering teams to manage sprints and track tasks with smooth drag-and-drop column transitions. Supports real-time collaborative updates, markdown descriptions, subtasks, deadline notifications, and activity audit logs.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?auto=format&fit=crop&w=1200&q=80',
        demoVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        role: 'Frontend & API Engineer',
        duration: '2 Months',
        liveSiteUrl: 'https://kanban-demo.example.com',
        githubRepoUrl: 'https://github.com/example/task-manager',
        techStack: ['React', 'Node.js', 'Express', 'MongoDB', 'Tailwind CSS', 'DnD Kit'],
        features: [
          {
            icon: 'layout',
            title: 'Drag & Drop Kanban Board',
            description: 'Smooth reordering of cards across custom sprint swimlanes and status columns.',
          },
          {
            icon: 'users',
            title: 'Collaborative Workspaces',
            description: 'Team invitations, assignment tags, priority badges, and comments.',
          },
          {
            icon: 'clock',
            title: 'Due Date Reminders & Filters',
            description: 'Smart filtering by assignee, tag, milestone, and upcoming deadlines.',
          },
        ],
        order: 2,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'C Language Memory & File Utility',
        slug: 'c-file-memory-utility',
        shortDescription:
          'High-performance CLI utility in C for efficient chunked binary file parsing, memory benchmarking, and data indexing.',
        fullDescription:
          'A low-level systems programming project written in C demonstrating deep understanding of memory management, pointer arithmetic, dynamic allocations (malloc/free/realloc), and POSIX file I/O. Capable of streaming gigabyte-sized log files with minimal memory footprint.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
        demoVideoUrl: '',
        role: 'Systems Programmer',
        duration: '1 Month',
        liveSiteUrl: '',
        githubRepoUrl: 'https://github.com/example/c-memory-utility',
        techStack: ['C', 'POSIX API', 'Valgrind', 'Makefile', 'GDB'],
        features: [
          {
            icon: 'cpu',
            title: 'Zero-Copy Buffer Streaming',
            description: 'Custom ring buffer architecture for efficient high-throughput log ingestion.',
          },
          {
            icon: 'hard-drive',
            title: 'Binary Indexed Search',
            description: 'O(log N) record lookups using custom B-tree file structures.',
          },
          {
            icon: 'check-circle',
            title: 'Memory Leak Free',
            description: 'Strictly audited and verified 100% leak-free via Valgrind test suites.',
          },
        ],
        order: 3,
        isFeatured: true,
        isPublished: true,
      },
      {
        title: 'Weather & Climate Analytics Dashboard',
        slug: 'weather-analytics-dashboard',
        shortDescription:
          'Interactive weather forecasting app with geolocation, historical climate charts, UV index alerts, and severe storm radar.',
        fullDescription:
          'A sleek, responsive dashboard providing minute-by-minute precipitation forecasts, interactive temperature heatmaps, and historical climate comparisons. Integrated with OpenWeather and Mapbox APIs, featuring dark glassmorphism visuals and smooth chart animations.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1592210454359-9043f067919b?auto=format&fit=crop&w=1200&q=80',
        demoVideoUrl: '',
        role: 'Full-Stack Developer',
        duration: '1.5 Months',
        liveSiteUrl: 'https://weather-demo.example.com',
        githubRepoUrl: 'https://github.com/example/weather-dashboard',
        techStack: ['React', 'Tailwind CSS', 'Chart.js', 'Express', 'OpenWeatherMap API'],
        features: [
          {
            icon: 'cloud-sun',
            title: '7-Day Granular Forecast',
            description: 'Hourly temperature, humidity, wind speeds, and precipitation likelihood.',
          },
          {
            icon: 'map-pin',
            title: 'Geolocation & Saved Cities',
            description: 'Auto-detect current location and bookmark favorite cities for fast switching.',
          },
          {
            icon: 'activity',
            title: 'Historical Trends Visualization',
            description: 'Interactive Chart.js visualizations showing seasonal trends over time.',
          },
        ],
        order: 4,
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
        role: 'Tech Recruiter',
        text: 'Impressive architecture! The cart flow and Stripe integration feel very smooth and production-ready.',
        approved: true,
      },
      {
        project: createdProjects[0]._id,
        name: 'Alex Rivera',
        role: 'Senior Backend Engineer',
        text: 'Clean separation of concerns in the Express controllers and great Redux Toolkit setup.',
        approved: true,
      },
      {
        project: createdProjects[1]._id,
        name: 'Michael Chang',
        role: 'Product Manager',
        text: 'Love the drag and drop UX on the Kanban board. Very intuitive sprint workflow!',
        approved: true,
      },
      {
        project: createdProjects[2]._id,
        name: 'David K.',
        role: 'Systems Software Engineer',
        text: 'Great to see solid C fundamentals alongside modern MERN stack skills. Clean memory handling!',
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
