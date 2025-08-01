
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function FinancialSummaryPage({ params }: { params: { congress: string, state: string, bioguideId: string } }) {
  const { congress, state, bioguideId } = await params;
  const memberDetailUrl = `/congress/${congress}/states/${state}/${bioguideId}`;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <header className="mb-8">
        <Link href={memberDetailUrl} className="inline-flex items-center gap-2 text-primary hover:underline mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Member Profile
        </Link>
        <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">
          Full Financial Summary
        </h1>
        <p className="text-lg text-muted-foreground mt-2">
          A detailed breakdown of campaign finance data.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            This detailed financial summary page is currently under construction.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Check back later for in-depth charts and tables detailing campaign contributions, expenditures, and funding sources.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
