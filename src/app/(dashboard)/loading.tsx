import { Skeleton } from "@/components/ui/skeleton";
import { MobileFrame } from "@/components/layout/mobile-frame";

export default function DashboardLoading() {
  return (
    <MobileFrame className="bg-slate-50 min-h-screen">
      {/* Header Skeleton */}
      <div className="sticky top-0 z-30 bg-white border-b-2 border-slate-200 px-4 py-4 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-full rounded-full" />
          <Skeleton className="h-4 w-10" />
        </div>
      </div>

      <div className="p-4 space-y-8 pb-32">
        {/* Unit Skeleton */}
        {[1, 2].map((i) => (
          <section key={i} className="space-y-6">
            <div className="bg-duo-green/20 p-6 rounded-3xl border-b-8 border-green-200 h-32 flex flex-col justify-center gap-2">
              <Skeleton className="h-8 w-48 bg-duo-green/40" />
              <Skeleton className="h-4 w-64 bg-duo-green/30" />
            </div>

            <div className="flex flex-col items-center gap-4 relative">
              {[1, 2, 3, 4, 5].map((j, index) => {
                const marginLeft = [0, 40, 60, 20, -20][index % 5];
                return (
                  <div
                    key={j}
                    style={{ marginLeft: `${marginLeft}px` }}
                  >
                    <Skeleton className="w-20 h-20 rounded-full border-b-8 border-slate-300" />
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </MobileFrame>
  );
}
