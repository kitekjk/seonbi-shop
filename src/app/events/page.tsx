import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface EventRow {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  starts_at: string;
  ends_at: string;
  event_comments: Array<{ id: string }>;
}

function isOngoing(endsAt: string) {
  return new Date(endsAt) >= new Date();
}

export default async function EventsPage() {
  let events: EventRow[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("*, event_comments(id)")
      .eq("is_active", true)
      .order("starts_at", { ascending: false });
    events = (data ?? []) as unknown as EventRow[];
  } catch {
    // Supabase not configured
  }

  const ongoingEvents = events.filter((e) => isOngoing(e.ends_at));
  const endedEvents = events.filter((e) => !isOngoing(e.ends_at));

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-3xl font-bold text-stone-900">이벤트</h1>
      <p className="mt-2 text-sm text-stone-500">선비샵의 다양한 이벤트에 참여하세요</p>

      {ongoingEvents.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold text-brand-navy">진행중인 이벤트</h2>
          <div className="mt-4 space-y-4">
            {ongoingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group block overflow-hidden rounded-xl border border-stone-200 transition-shadow hover:shadow-lg"
              >
                <div className="flex">
                  <div className="flex h-48 w-48 flex-shrink-0 items-center justify-center bg-gradient-to-br from-brand-red to-brand-red-light text-6xl">
                    🎉
                  </div>
                  <div className="flex flex-1 flex-col justify-center p-6">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                        진행중
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(event.starts_at).toLocaleDateString("ko-KR")} ~{" "}
                        {new Date(event.ends_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <h3 className="mt-2 text-xl font-bold text-stone-900 group-hover:text-brand-red transition-colors">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm text-stone-500 line-clamp-2">{event.description}</p>
                    <p className="mt-3 text-xs text-stone-400">
                      댓글 {event.event_comments?.length ?? 0}개
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {endedEvents.length > 0 && (
        <section className="mt-12">
          <h2 className="text-lg font-bold text-stone-500">종료된 이벤트</h2>
          <div className="mt-4 space-y-3">
            {endedEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group block rounded-xl border border-stone-200 p-5 opacity-70 transition-all hover:opacity-100 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                        종료
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(event.starts_at).toLocaleDateString("ko-KR")} ~{" "}
                        {new Date(event.ends_at).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <h3 className="mt-2 text-lg font-semibold text-stone-700 group-hover:text-stone-900">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm text-stone-400 line-clamp-1">{event.description}</p>
                  </div>
                  <span className="text-xs text-stone-400">
                    댓글 {event.event_comments?.length ?? 0}개
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-5xl">🎉</p>
          <p className="mt-4 text-lg font-medium text-stone-500">이벤트가 없습니다</p>
        </div>
      )}
    </div>
  );
}
