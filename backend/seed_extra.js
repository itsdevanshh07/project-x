const mongoose = require('mongoose');
const dotenv = require('dotenv');
const TestSeries = require('./src/models/TestSeries');
const PYQ = require('./src/models/PYQ');
const CurrentAffairs = require('./src/models/CurrentAffairs');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await TestSeries.deleteMany();
        await PYQ.deleteMany();
        await CurrentAffairs.deleteMany();

        // Seed Test Series
        await TestSeries.create([
            {
                title: 'SSC CGL 2024 Tier-1 Full Mock Test',
                description: 'Comprehensive mock tests covering Math, English, Reasoning, and GS as per the latest pattern.',
                category: 'SSC',
                price: 499,
                numberOfTests: 20,
                validity: 365,
                tests: []
            },
            {
                title: 'Railway NTPC CBT-1 Special',
                description: 'Targeted test series for Railway NTPC with detailed solutions and performance analysis.',
                category: 'Railway',
                price: 299,
                numberOfTests: 15,
                validity: 180,
                tests: []
            }
        ]);

        // Seed PYQs
        await PYQ.create([
            {
                title: 'SSC CHSL 2023 All Shifts Combined',
                examType: 'SSC',
                year: 2023,
                pdfUrl: 'https://example.com/ssc-chsl-2023.pdf',
                isFree: true
            },
            {
                title: 'UP Police Constable 2018 Re-exam',
                examType: 'State',
                year: 2018,
                pdfUrl: 'https://example.com/up-police-2018.pdf',
                isFree: true
            }
        ]);

        // Seed Current Affairs
        await CurrentAffairs.create([
            {
                title: 'Union Budget 2024-25: Key Highlights for Exams',
                content: 'The Union Budget 2024-25 was presented by the Finance Minister. Key focus areas include infrastructure, agriculture, and youth employment. For competitive exams, remember the fiscal deficit target of 5.1%...',
                category: 'Economy',
                date: new Date(),
                isFree: true
            },
            {
                title: 'India Wins T20 World Cup 2024',
                content: 'India defeated South Africa in a thrilling final to lift the T20 World Cup trophy after 17 years. Virat Kohli was named Player of the Match, while Jasprit Bumrah received the Player of the Tournament award.',
                category: 'Sports',
                date: new Date(),
                isFree: true
            }
        ]);

        console.log('Data Seeded Successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
