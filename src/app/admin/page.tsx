import { adminDb } from "@/lib/firebase-admin";

export default async function AdminDashboardPage() {
  let leadsCount = 0, expCount = 0, destCount = 0, blogCount = 0;

  if (adminDb) {
    try {
      const [leads, exp, dest, blog] = await Promise.all([
        adminDb.collection("bookings_leads").count().get(),
        adminDb.collection("experiences").count().get(),
        adminDb.collection("destinations").count().get(),
        adminDb.collection("blog_posts").count().get(),
      ]);

      leadsCount = leads.data().count;
      expCount = exp.data().count;
      destCount = dest.data().count;
      blogCount = blog.data().count;
    } catch (e) {
      console.error(e instanceof Error ? e.message : String(e));
    }
  }

  const stats = [
    { label: "Total Leads", value: leadsCount },
    { label: "Active Experiences", value: expCount },
    { label: "Destinations", value: destCount },
    { label: "Journal Entries", value: blogCount },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="font-serif text-3xl text-[var(--color-charcoal)] mb-2">
          Dashboard Overview
        </h1>
        <p className="font-sans text-sm text-zinc-500">
          Welcome back to the Ourrika Operations Center. Here&apos;s what&apos;s happening today.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white border border-zinc-200 p-6 shadow-sm flex flex-col justify-between"
          >
            <div className="font-sans text-xs tracking-widest uppercase text-zinc-500 mb-4">
              {stat.label}
            </div>
            <div className="font-serif text-4xl text-[var(--color-terracotta)]">
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-zinc-200 p-8 shadow-sm">
        <h2 className="font-serif text-xl text-[var(--color-charcoal)] mb-6">
          Recent Activity
        </h2>
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400">
          <p className="font-sans text-sm tracking-wide">
            Detailed activity stream coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}
