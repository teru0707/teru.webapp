/* src/lib/BlogUtils.ts */
/**
 * Javaのユーティリティクラスを模した構成
 */
import type { Post } from "../app/_types/Post";

export class BlogUtils {
  private static WORDS_PER_MINUTE = 500; // 日本語の平均読書速度

  /**
   * 記事の本文から読了時間を計算する (Javaの静的メソッド風)
   */
  public static calculateReadingTime(content: string): number {
    if (!content) return 0;
    const textOnly = content.replace(/<[^>]*>/g, ""); // HTMLタグを除去
    const minutes = Math.ceil(textOnly.length / this.WORDS_PER_MINUTE);
    return minutes;
  }

  /**
   * 投稿リストをJava Stream API風にフィルタリング・加工する例
   */
  public static processPosts(rawPosts: Post[]): Post[] {
    // Javaのstream().map().collect()に近い処理
    return rawPosts.map((post) => ({
      ...post,
      readingTime: this.calculateReadingTime(post.content),
    }));
  }
}
