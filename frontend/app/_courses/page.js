import CoursesClient from '@/components/CoursesClient';

export const revalidate = 60; // ISR: revalidate every 60 seconds

async function fetchCourses() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        
        const res = await fetch(`${apiUrl}/courses`, {
            next: { revalidate: 60 },
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (!res.ok) {
            console.error('Failed to fetch courses during SSR:', res.statusText);
            return null;
        }
        
        return res.json();
    } catch (err) {
        console.error('Error in SSR fetchCourses:', err.message);
        return null;
    }
}

export default async function CoursesPage() {
    const initialCourses = await fetchCourses();
    return <CoursesClient initialCourses={initialCourses} />;
}
