import dbConnect from '@/lib/db';
import Member from '@/models/Member';
import PageContent from '@/models/PageContent';
import User from '@/models/User';
import { NextResponse } from 'next/server';

export async function POST() {
  await dbConnect();

  try {
    // Clear existing data
    await Member.deleteMany({});
    await PageContent.deleteMany({});
    await User.deleteMany({}); // BE CAREFUL IN PRODUCTION

    // Seed Admin
    await User.create({
      email: 'admin@fac.com',
      password: 'admin', // Plain text for demo, use bcrypt in production
      role: 'admin'
    });

    // Seed Members
    const members = [
      { name: "Prasenjit Choudhury", role: "President", year: "4th Year", specialization: "Traditional Art", image: "/president.jpg", quote: "Passionate about traditional and contemporary art forms.", order: 1 },
      { name: "Abhinav Santosh Kumar", role: "Vice President", year: "3rd Year", specialization: "Digital Art", image: "/vicepresident.jpg", quote: "Exploring digital art and motion graphics.", order: 2 },
      { name: "Aditya Sharma", role: "Member", year: "4th Year", specialization: "Watercolor", order: 10 },
      { name: "Kavya Reddy", role: "Member", year: "3rd Year", specialization: "Digital Illustration", order: 11 },
      { name: "Vikram Singh", role: "Member", year: "2nd Year", specialization: "Charcoal Sketching", order: 12 },
    ];
    await Member.insertMany(members);

    // Seed Page Content
    const homeContent = {
      page: "home",
      hero: {
        title: "Creativity Lives Here.",
        subtitle: "Celebrate the passion and artistry of our students. Explore our gallery and meet the artists shaping our campus culture.",
        ctaText: "Discover Our Art",
        ctaLink: "#gallery"
      },
      about: {
        title: "About Our Club",
        text: "We bring together creative minds to learn, share and exhibit. Our workshops, exhibitions, and community events provide a platform for everyone passionate about art."
      },
    };
    await PageContent.create(homeContent);

    // Seed Other Pages
    const pages = [
      {
        page: "workshops",
        timeline: [
          {
            year: "2025",
            title: "Workshops 2025",
            description: "Advanced techniques in digital painting and sculpting.",
            images: [
              "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=400&auto=format&fit=crop"
            ]
          },
          {
            year: "2024",
            title: "Workshops 2024",
            description: "Introduction to acrylics and watercolors.",
            images: [
              "https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=400&auto=format&fit=crop"
            ]
          }
        ]
      },
      {
        page: "techno",
        timeline: [
          {
            year: "2025",
            title: "TechnoVIT 2025",
            description: "Showcasing the fusion of technology and art.",
            images: [
              "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop"
            ]
          }
        ]
      },
      {
        page: "vibrance",
        timeline: [
          {
            year: "2024",
            title: "Vibrance 2024",
            description: "Our annual cultural fest exhibitions.",
            images: []
          }
        ]
      },
      {
        page: "gallery",
        timeline: [
          {
            year: "2025",
            title: "Our Gallery",
            description: "A collection of our finest works.",
            images: [
              "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?q=80&w=400&auto=format&fit=crop",
              "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=400&auto=format&fit=crop"
            ]
          }
        ]
      },
      {
        page: "top-picks",
        timeline: [
          {
            year: "2025",
            title: "Top Picks",
            description: "Curated selection of the best artworks from our community.",
            images: [
              "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000",
              "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=400"
            ]
          }
        ]
      },
      {
        page: "afac",
        timeline: [
          {
            year: "2025",
            title: "Art for a Cause",
            description: "Artworks dedicated to social causes and community impact.",
            images: [
              "https://images.unsplash.com/photo-1605106702734-205df224ecce?q=80&w=400"
            ]
          }
        ]
      },
      {
        page: "ca",
        timeline: [
          {
            year: "2025",
            title: "Concept Art",
            description: "Imaginative and conceptual designs for characters and environments.",
            images: [
              "https://images.unsplash.com/photo-1544256718-3bcf237f3974?q=80&w=400"
            ]
          }
        ]
      },
      {
        page: "p",
        timeline: [
          {
            year: "2025",
            title: "Portraits",
            description: "Capturing the essence of human expression.",
            images: [
              "https://images.unsplash.com/photo-1515462277126-2dd0c162007a?q=80&w=400"
            ]
          }
        ]
      },
      {
        page: "da",
        timeline: [
          {
            year: "2025",
            title: "Digital Artworks",
            description: "Exploring the digital medium with creativity and precision.",
            images: [
              "https://images.unsplash.com/photo-1579762715118-a6f1d4b934f1?q=80&w=400"
            ]
          }
        ]
      }
    ];

    for (const p of pages) {
      await PageContent.create(p);
    }

    return NextResponse.json({ message: 'Database seeded successfully' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}
