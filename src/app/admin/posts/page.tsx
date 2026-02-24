"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

// 🌟 追加: React Hook Form と Zod のインポート
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type CategoryApiResponse = {
  id: string;
  name: string;
};

// 🌟 追加: Zodによる強力なバリデーションルールの定義（スキーマ）
const postSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(100, "100文字以内で入力してください"),
  content: z.string().min(1, "本文を入力してください"),
  coverImageURL: z.string().url("有効なURL形式で入力してください"),
  categoryIds: z
    .array(z.string())
    .min(1, "最低1つのカテゴリを選択してください"),
});

// ZodスキーマからTypeScriptの型を自動生成
type PostFormValues = z.infer<typeof postSchema>;

const Page: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchErrorMsg, setFetchErrorMsg] = useState<string | null>(null);
  const [availableCategories, setAvailableCategories] = useState<
    CategoryApiResponse[]
  >([]);
  const router = useRouter();

  // 🌟 追加: React Hook Form の初期化
  const {
    register, // inputタグに登録する関数
    handleSubmit, // フォーム送信時の処理をラップする関数
    setValue, // 手動で値をセットする関数（チェックボックス用）
    watch, // 現在の値を取得する関数（チェックボックス用）
    formState: { errors, isSubmitting }, // エラー状態と送信中ステータス
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema), // Zodと連携
    defaultValues: {
      title: "",
      content: "",
      coverImageURL: "",
      categoryIds: [],
    },
  });

  // 現在選択されているカテゴリの配列を監視
  const selectedCategoryIds = watch("categoryIds");

  // 初回レンダリング時にカテゴリ一覧を取得
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/categories", { cache: "no-store" });
        if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);
        const apiResBody = await res.json();
        setAvailableCategories(apiResBody);
      } catch (error) {
        setFetchErrorMsg("カテゴリの取得に失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  // チェックボックスの変更をReact Hook Formに伝える処理
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    if (checked) {
      setValue("categoryIds", [...selectedCategoryIds, categoryId], {
        shouldValidate: true,
      });
    } else {
      setValue(
        "categoryIds",
        selectedCategoryIds.filter((id) => id !== categoryId),
        { shouldValidate: true },
      );
    }
  };

  // 🌟 変更: バリデーション成功時に呼ばれる送信処理
  // (e.preventDefault() などの記述が不要になり、dataに安全な値が入ってきます)
  const onSubmit = async (data: PostFormValues) => {
    try {
      const res = await fetch("/api/admin/posts", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(`${res.status}: ${res.statusText}`);

      const postResponse = await res.json();
      router.push(`/posts/${postResponse.id}`);
    } catch (error) {
      window.alert("投稿に失敗しました");
    }
  };

  if (isLoading) {
    return (
      <div className="text-gray-500">
        <FontAwesomeIcon icon={faSpinner} className="mr-1 animate-spin" />
        Loading...
      </div>
    );
  }

  if (fetchErrorMsg) return <div className="text-red-500">{fetchErrorMsg}</div>;

  return (
    <main>
      <div className="mb-4 text-2xl font-bold">投稿記事の新規作成 (Zod版)</div>

      {isSubmitting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all">
          <div className="flex items-center rounded-lg bg-white px-8 py-4 shadow-xl">
            <FontAwesomeIcon
              icon={faSpinner}
              className="mr-3 animate-spin text-xl text-indigo-600"
            />
            <div className="font-bold text-slate-700">記事を投稿中...</div>
          </div>
        </div>
      )}

      {/* handleSubmit(onSubmit) でラップする */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={twMerge("space-y-6", isSubmitting && "opacity-50")}
      >
        {/* タイトル */}
        <div className="space-y-1">
          <label htmlFor="title" className="block font-bold text-slate-700">
            タイトル
          </label>
          <input
            id="title"
            {...register("title")} // 🌟 useStateの代わりに register を使うだけ！
            className={twMerge(
              "w-full rounded-md border-2 px-3 py-2 transition-colors outline-none",
              errors.title
                ? "border-red-500 focus:border-red-500"
                : "border-slate-200 focus:border-indigo-500",
            )}
            placeholder="タイトルを記入してください"
          />
          {/* エラーメッセージの自動表示 */}
          {errors.title && (
            <p className="flex items-center text-sm font-bold text-red-500">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {errors.title.message}
            </p>
          )}
        </div>

        {/* 本文 */}
        <div className="space-y-1">
          <label htmlFor="content" className="block font-bold text-slate-700">
            本文
          </label>
          <textarea
            id="content"
            {...register("content")}
            className={twMerge(
              "h-48 w-full rounded-md border-2 px-3 py-2 transition-colors outline-none",
              errors.content
                ? "border-red-500 focus:border-red-500"
                : "border-slate-200 focus:border-indigo-500",
            )}
            placeholder="本文を記入してください"
          />
          {errors.content && (
            <p className="flex items-center text-sm font-bold text-red-500">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {errors.content.message}
            </p>
          )}
        </div>

        {/* カバー画像URL */}
        <div className="space-y-1">
          <label
            htmlFor="coverImageURL"
            className="block font-bold text-slate-700"
          >
            カバーイメージ (URL)
          </label>
          <input
            id="coverImageURL"
            {...register("coverImageURL")}
            className={twMerge(
              "w-full rounded-md border-2 px-3 py-2 transition-colors outline-none",
              errors.coverImageURL
                ? "border-red-500 focus:border-red-500"
                : "border-slate-200 focus:border-indigo-500",
            )}
            placeholder="https://example.com/image.jpg"
          />
          {errors.coverImageURL && (
            <p className="flex items-center text-sm font-bold text-red-500">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {errors.coverImageURL.message}
            </p>
          )}
        </div>

        {/* カテゴリ (チェックボックス) */}
        <div className="space-y-2">
          <div className="font-bold text-slate-700">タグ</div>
          <div className="flex flex-wrap gap-3">
            {availableCategories.length > 0 ? (
              availableCategories.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center space-x-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-1.5 transition-colors hover:bg-slate-100"
                >
                  <input
                    type="checkbox"
                    className="cursor-pointer accent-indigo-600"
                    checked={selectedCategoryIds.includes(c.id)}
                    onChange={(e) =>
                      handleCategoryChange(c.id, e.target.checked)
                    }
                  />
                  <span className="text-sm font-medium text-slate-700">
                    {c.name}
                  </span>
                </label>
              ))
            ) : (
              <div className="text-slate-500">
                選択可能なカテゴリが存在しません。
              </div>
            )}
          </div>
          {errors.categoryIds && (
            <p className="flex items-center text-sm font-bold text-red-500">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {errors.categoryIds.message}
            </p>
          )}
        </div>

        {/* 送信ボタン */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className={twMerge(
              "rounded-md px-8 py-2.5 font-bold transition-all",
              "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md",
              "disabled:cursor-not-allowed disabled:opacity-50",
            )}
          >
            記事を投稿する
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
