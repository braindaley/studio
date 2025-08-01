
import { notFound } from 'next/navigation';
import type { Member } from '@/types';
import { MemberDetailClient } from '@/components/member-detail-client';

async function getMemberDetails(bioguideId: string): Promise<Member | null> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
  const url = `${baseUrl}/api/congress/member/${bioguideId}`;
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
      console.error(`Failed to fetch member from internal API: ${res.status}`);
      return null;
    }

    // Only fetch basic data initially. The rest will be loaded client-side.
    const memberData: Member = await res.json();
    return memberData;
    
  } catch (error) {
    console.error("Error in getMemberDetails:", error);
    return null; 
  }
}

export default async function MemberDetailPage({ params }: { params: { bioguideId: string, congress: string } }) {
  const { bioguideId, congress } = params;
  
  const member = await getMemberDetails(bioguideId);

  if (!member) {
    notFound();
  }
  
  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Pass minimal data to the client, which will fetch the rest */}
      <MemberDetailClient initialMember={member} congress={congress} />
    </div>
  );
}
