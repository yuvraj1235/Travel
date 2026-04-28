import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import { BookingLinksClient } from "@/components/BookingLinksClient";
import { MailButtonClient } from "@/components/MailButtonClient";

export default async function TripDetailsPage({ params }: { params: { id: string } }) {
  const user = await getAuthUser();
  if (!user) redirect("/login");

  const trip = await prisma.trip.findFirst({
    where: { id: params.id, users: { some: { id: user.id } } },
    include: {
      days: {
        include: { activities: true },
        orderBy: { index: "asc" }
      }
    }
  });

  if (!trip) return <div className="p-20 text-center text-xl text-slate-500 dark:text-slate-400 font-medium">Trip not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 md:p-12 text-slate-900 dark:text-slate-100 font-sans relative overflow-hidden">
      {/* Colorful lively backgrounds */}
      <div className="travel-blob absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-200/50 dark:bg-blue-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="travel-blob absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-200/50 dark:bg-amber-500/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="travel-blob absolute top-[30%] right-[10%] w-[30%] h-[30%] bg-rose-200/40 dark:bg-rose-500/15 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800/60">← Back to Dashboard</Button>
          </Link>
          <div className="flex items-center gap-3">
             <MailButtonClient tripId={trip.id} />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">
            {trip.title}
          </h1>
          <div className="flex flex-wrap gap-3 mt-4">
            <span className="bg-blue-100 dark:bg-blue-500/15 text-blue-700 dark:text-blue-200 font-semibold px-4 py-1.5 rounded-full shadow-sm border border-blue-200/60 dark:border-blue-500/40">{trip.destination}</span>
            <span className="bg-emerald-100 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-200 font-semibold px-4 py-1.5 rounded-full shadow-sm border border-emerald-200/60 dark:border-emerald-500/40">{trip.budget} Budget</span>
            <span className="bg-violet-100 dark:bg-violet-500/15 text-violet-700 dark:text-violet-200 font-semibold px-4 py-1.5 rounded-full shadow-sm border border-violet-200/60 dark:border-violet-500/40">
              {format(new Date(trip.startDate), 'MMM dd')} — {format(new Date(trip.endDate), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>

        <Card className="bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border-white dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/20 overflow-hidden">
          <CardContent className="p-8 space-y-10">
            {trip.days.map((day: any) => (
              <div key={day.id} className="relative pl-8 before:absolute before:left-3 before:top-4 before:bottom-0 before:w-px before:bg-slate-200 dark:before:bg-slate-700 last:before:hidden">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 border-2 border-blue-400 dark:border-blue-400/70 flex items-center justify-center shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-300" />
                </div>
                <h3 className="font-extrabold text-2xl text-slate-800 dark:text-slate-100 mb-6 flex items-center">
                  Day {day.index} <span className="text-slate-400 dark:text-slate-400 ml-3 font-semibold text-lg">{format(new Date(day.date), 'EEEE, MMMM dd')}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {day.activities.map((activity: any) => (
                    <div key={activity.id} className="bg-white dark:bg-slate-900/70 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl hover:border-blue-300 dark:hover:border-blue-500/60 hover:shadow-lg hover:shadow-blue-100/50 dark:hover:shadow-blue-900/20 transition-all group">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-blue-600 dark:text-blue-200 font-bold text-sm tracking-widest uppercase bg-blue-50 dark:bg-blue-500/10 inline-block px-3 py-1 rounded-full mb-3 border border-blue-100 dark:border-blue-500/30">
                            {activity.time}
                          </p>
                          <p className="font-bold text-slate-800 dark:text-slate-100 text-xl leading-tight">{activity.title}</p>
                          {activity.description && (
                            <p className="text-slate-500 dark:text-slate-400 text-base mt-3 leading-relaxed">{activity.description}</p>
                          )}
                        </div>
                        <div className="ml-4 shrink-0 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-500/30 font-bold text-emerald-600 dark:text-emerald-200 shadow-sm">
                          ${activity.estimatedCost}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-8 border-t border-slate-200 dark:border-slate-800 mt-8">
              <BookingLinksClient 
                destination={trip.destination} 
                startDate={format(new Date(trip.startDate), 'yyyy-MM-dd')} 
                endDate={format(new Date(trip.endDate), 'yyyy-MM-dd')} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
