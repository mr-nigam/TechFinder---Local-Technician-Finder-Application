// Mock data for the application
export const technicians = [
    {
        id: 1,
        name: "Rajesh Kumar",
        category: "home",
        specialties: ["Plumbing", "Electrical", "AC Repair"],
        rating: 4.9,
        reviews: 127,
        price: 500,
        location: "Connaught Place, New Delhi",
        distance: 1.2,
        available: true,
        experience: 8,
        phone: "+91 98765 43210",
        email: "rajesh.kumar@techfinder.in",
        avatar: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        description: "Licensed plumber with 8+ years of experience. Specializes in emergency repairs and installations.",
        services: [
            { name: "Pipe Repair", price: 450 },
            { name: "Faucet Installation", price: 350 },
            { name: "Drain Cleaning", price: 600 },
            { name: "Water Heater Repair", price: 800 }
        ],
        photos: [
            "https://images.pexels.com/photos/834892/pexels-photo-834892.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            "https://images.pexels.com/photos/1251175/pexels-photo-1251175.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
        ],
        availability: {
            today: true,
            tomorrow: true,
            week: true
        }
    },
    {
        id: 2,
        name: "Priya Sharma",
        category: "computer",
        specialties: ["Hardware Repair", "Software Issues", "Data Recovery"],
        rating: 4.8,
        reviews: 94,
        price: 650,
        location: "Bandra West, Mumbai",
        distance: 2.1,
        available: true,
        experience: 6,
        phone: "+91 87654 32109",
        email: "priya.sharma@techfinder.in",
        avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        description: "Computer specialist with expertise in both hardware and software solutions. Quick diagnostics and reliable repairs.",
        services: [
            { name: "Virus Removal", price: 500 },
            { name: "Hardware Upgrade", price: 750 },
            { name: "Data Recovery", price: 1200 },
            { name: "System Optimization", price: 400 }
        ],
        photos: [
            "https://images.pexels.com/photos/2148217/pexels-photo-2148217.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
        ],
        availability: {
            today: false,
            tomorrow: true,
            week: true
        }
    },
    {
        id: 3,
        name: "Arjun Singh",
        category: "vehicle",
        specialties: ["Auto Repair", "Oil Changes", "Tire Service"],
        rating: 4.7,
        reviews: 156,
        price: 600,
        location: "Koramangala, Bangalore",
        distance: 3.5,
        available: false,
        experience: 12,
        phone: "+91 76543 21098",
        email: "arjun.singh@techfinder.in",
        avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        description: "Experienced auto mechanic with ASE certification. Specializes in engine diagnostics and preventive maintenance.",
        services: [
            { name: "Oil Change", price: 300 },
            { name: "Brake Repair", price: 800 },
            { name: "Engine Diagnostics", price: 600 },
            { name: "Tire Replacement", price: 500 }
        ],
        photos: [
            "https://images.pexels.com/photos/279906/pexels-photo-279906.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
        ],
        availability: {
            today: false,
            tomorrow: false,
            week: true
        }
    },
    {
        id: 4,
        name: "Meera Patel",
        category: "home",
        specialties: ["Electrical", "Lighting", "Wiring"],
        rating: 4.9,
        reviews: 89,
        price: 700,
        location: "Satellite, Ahmedabad",
        distance: 1.8,
        available: true,
        experience: 7,
        phone: "+91 65432 10987",
        email: "meera.patel@techfinder.in",
        avatar: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        description: "Licensed electrician specializing in residential electrical work. Safety-focused with attention to detail.",
        services: [
            { name: "Outlet Installation", price: 400 },
            { name: "Light Fixture Install", price: 500 },
            { name: "Circuit Breaker Repair", price: 750 },
            { name: "Electrical Inspection", price: 650 }
        ],
        photos: [
            "https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
        ],
        availability: {
            today: true,
            tomorrow: true,
            week: true
        }
    },
    {
        id: 5,
        name: "Vikram Reddy",
        category: "computer",
        specialties: ["Network Setup", "Security", "Server Maintenance"],
        rating: 4.6,
        reviews: 73,
        price: 850,
        location: "Hitech City, Hyderabad",
        distance: 4.2,
        available: true,
        experience: 9,
        phone: "+91 54321 09876",
        email: "vikram.reddy@techfinder.in",
        avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        description: "IT specialist with expertise in network infrastructure and cybersecurity. Provides comprehensive tech solutions.",
        services: [
            { name: "Network Setup", price: 1000 },
            { name: "Security Audit", price: 1500 },
            { name: "Server Maintenance", price: 900 },
            { name: "WiFi Optimization", price: 600 }
        ],
        photos: [
            "https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
        ],
        availability: {
            today: true,
            tomorrow: false,
            week: true
        }
    },
    {
        id: 6,
        name: "Kavya Nair",
        category: "vehicle",
        specialties: ["Bodywork", "Paint", "Detailing"],
        rating: 4.8,
        reviews: 112,
        price: 550,
        location: "Marine Drive, Kochi",
        distance: 2.7,
        available: true,
        experience: 5,
        phone: "+91 43210 98765",
        email: "kavya.nair@techfinder.in",
        avatar: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
        description: "Auto body specialist with expertise in collision repair and custom paint work. Attention to detail guaranteed.",
        services: [
            { name: "Dent Repair", price: 650 },
            { name: "Paint Touch-up", price: 500 },
            { name: "Full Detail", price: 800 },
            { name: "Scratch Removal", price: 450 }
        ],
        photos: [
            "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop",
            "https://images.pexels.com/photos/190574/pexels-photo-190574.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop"
        ],
        availability: {
            today: true,
            tomorrow: true,
            week: true
        }
    }
];

export const reviews = [
    {
        id: 1,
        technicianId: 1,
        customerName: "Amit Gupta",
        rating: 5,
        comment: "Excellent work! Rajesh fixed my plumbing issue quickly and professionally.",
        date: "2025-01-10",
        service: "Pipe Repair"
    },
    {
        id: 2,
        technicianId: 1,
        customerName: "Sunita Joshi",
        rating: 5,
        comment: "Very reliable and knowledgeable. Would definitely recommend!",
        date: "2025-01-08",
        service: "Faucet Installation"
    },
    {
        id: 3,
        technicianId: 2,
        customerName: "Rohit Agarwal",
        rating: 4,
        comment: "Priya did a great job recovering my data. Very professional service.",
        date: "2025-01-09",
        service: "Data Recovery"
    },
    {
        id: 4,
        technicianId: 3,
        customerName: "Deepika Rao",
        rating: 5,
        comment: "Arjun is amazing! Fixed my car's engine issue perfectly.",
        date: "2025-01-07",
        service: "Engine Diagnostics"
    }
];

export const bookings = [
    {
        id: 1,
        technicianId: 1,
        customerName: "Anita Verma",
        customerPhone: "+91 98765 12345",
        customerEmail: "anita@example.com",
        service: "Pipe Repair",
        date: "2025-01-15",
        time: "14:00",
        status: "confirmed",
        address: "123 MG Road, Delhi 110001",
        description: "Kitchen sink pipe is leaking",
        price: 450,
        priority: "normal"
    },
    {
        id: 2,
        technicianId: 2,
        customerName: "Ravi Malhotra",
        customerPhone: "+91 87654 23456",
        customerEmail: "ravi@example.com",
        service: "Virus Removal",
        date: "2025-01-16",
        time: "10:00",
        status: "pending",
        address: "456 Brigade Road, Bangalore 560001",
        description: "Computer running very slow, suspect virus",
        price: 500,
        priority: "normal"
    }
];

export const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

export const serviceCategories = {
    home: {
        name: "Home Repairs",
        services: [
            "Plumbing",
            "Electrical",
            "AC Repair",
            "Appliance Repair",
            "Carpentry",
            "Painting"
        ]
    },
    computer: {
        name: "Computer Repairs",
        services: [
            "Hardware Repair",
            "Software Issues",
            "Virus Removal",
            "Data Recovery",
            "Network Setup",
            "System Optimization"
        ]
    },
    vehicle: {
        name: "Vehicle Repairs",
        services: [
            "Engine Repair",
            "Brake Service",
            "Oil Change",
            "Tire Service",
            "Electrical",
            "Bodywork"
        ]
    }
};