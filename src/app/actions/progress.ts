"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function completeLesson(
  lessonId: string,
  score: number,
  totalQuestions: number,
  xpGained: number
) {
  const supabase = await createClient();
  
  // ユーザー認証の確認
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Unauthorized" };
  }

  try {
    // 1. レッスン進捗の更新 (user_progress)
    const { error: progressError } = await supabase
      .from("user_progress")
      .upsert(
        {
          user_id: user.id,
          lesson_id: lessonId,
          status: "completed",
          score: score,
          completed_at: new Date().toISOString(),
        },
        { onConflict: "user_id, lesson_id" }
      );

    if (progressError) throw progressError;

    // 2. ユーザープロフィールの更新 (XP, Streakなど)
    // まず現在のプロフィールを取得
    const { data: profile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("xp, streak, last_active_at")
      .eq("id", user.id)
      .single();

    if (profileFetchError) throw profileFetchError;

    // Streakの計算 (簡易版: 最後に活動したのが昨日以前なら+1)
    const lastActive = new Date(profile.last_active_at || 0);
    const now = new Date();
    const isToday = lastActive.toDateString() === now.toDateString();
    
    let newStreak = profile.streak;
    if (!isToday) {
      newStreak += 1;
    }

    // プロフィール更新
    const { error: profileUpdateError } = await supabase
      .from("profiles")
      .update({
        xp: (profile.xp || 0) + xpGained,
        streak: newStreak,
        last_active_at: now.toISOString(),
      })
      .eq("id", user.id);

    if (profileUpdateError) throw profileUpdateError;

    // キャッシュの更新
    revalidatePath("/learn");

    return { success: true };

  } catch (error: any) {
    console.error("Failed to complete lesson:", error);
    return { error: error.message };
  }
}
