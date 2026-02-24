import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

// 🌟 VercelのEdge環境で爆速動作させるための設定
export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    // URLのクエリパラメータ（?title=...）からタイトルを取得
    const title = searchParams.get("title") || "Next.js Modern Blog";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0f172a",
            // プロ級のドットパターン背景
            backgroundImage:
              "radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1e293b 2%, transparent 0%)",
            backgroundSize: "100px 100px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: "bold",
              color: "white",
              textAlign: "center",
              padding: "0 100px",
              lineHeight: 1.4,
              wordBreak: "break-word",
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 40,
              fontSize: 32,
              color: "#818cf8",
              fontWeight: "bold",
            }}
          >
            MyBlog.
          </div>
        </div>
      ),
      { width: 1200, height: 630 }, // X(Twitter)推奨のOGPサイズ
    );
  } catch (e) {
    return new Response("Failed to generate image", { status: 500 });
  }
}
