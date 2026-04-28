import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getAuthUser, logoutAction } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/ThemeToggle";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  let trips: any[] = [];
  try {
    trips = await prisma.trip.findMany({
      where: { users: { some: { id: user.id } } },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Failed to connect to Prisma.", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden">
      <div className="travel-blob absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/50 blur-[120px] pointer-events-none rounded-full" />
      <div className="travel-blob absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-200/50 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="max-w-6xl mx-auto space-y-10 relative z-10">
        <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-transparent bg-clip-text">
              {user.name}'s Dashboard
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-3 text-lg font-medium">Your curated journeys and adventures.</p>
          </div>
          <div className="flex gap-4">
            <Link href="/">
               <Button variant="outline" className="bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                 Home
               </Button>
            </Link>
            <ThemeToggle />
            <Link href="/new">
               <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md">
                 + New Trip
               </Button>
            </Link>
            <form action={logoutAction}>
              <Button variant="ghost" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">Logout</Button>
            </form>
          </div>
        </div>

        {trips.length === 0 ? (
          <div className="text-slate-500 dark:text-slate-400 p-16 border border-slate-300 dark:border-slate-700 border-dashed rounded-3xl text-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-sm">
            <div className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">No active journeys found.</div>
            <p className="mb-6 font-medium">It looks like you haven't generated any trips yet.</p>
            <Link href="/new">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-8 py-6 h-auto text-lg shadow-xl shadow-indigo-200">
                Start Planning
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trips.map((trip) => (
              <Link href={`/dashboard/trip/${trip.id}`} key={trip.id}>
                <Card className="bg-white/90 dark:bg-slate-900/85 backdrop-blur-md border-white dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/60 text-slate-900 dark:text-slate-100 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-black/20 hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group h-full flex flex-col">
                  <CardHeader className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30 border-b border-slate-100 dark:border-slate-800 p-8 flex-1">
                    <div className="flex items-start justify-between">
                      <span className="text-5xl drop-shadow-md transition-transform group-hover:scale-110" role="img" aria-label="destination">🌍</span>
                      <div className="text-right">
                        <span className="bg-emerald-100 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider">{trip.budget}</span>
                      </div>
                    </div>
                    <div className="mt-6">
                      <CardTitle className="text-2xl font-extrabold tracking-tight mb-2 text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                        {trip.title}
                      </CardTitle>
                      <CardDescription className="text-slate-500 dark:text-slate-400 font-medium">
                        {trip.destination}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 bg-white dark:bg-slate-900/40 flex justify-between items-center text-sm font-semibold text-slate-500 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-50 text-blue-600 p-2 rounded-lg">📅</span>
                      {format(new Date(trip.startDate), 'MMM dd')} - {format(new Date(trip.endDate), 'MMM dd')}
                    </div>
                    <span className="text-indigo-600 group-hover:translate-x-1 transition-transform">View Details →</span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
