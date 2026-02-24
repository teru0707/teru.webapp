"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faTriangleExclamation,
  faTrash,
  faSave,
} from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast"; // 🌟 トースト通知をインポート

// 🌟 React Hook Form と Zod
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --- 型定義 ---
type CategoryApiResponse = { id: string; name: string };
type PostApiResponse = {
  id: string;
  title: string;
  content: string;
  coverImageURL: string;
  categories: { category: { id: string; name: string } }[];
};

// --- Zodスキーマ ---
const postSchema = z.object({
  title: z
    .string()
    .min(1, "タイトルを入力してください")
    .max(100, "100文字以内です"),
  content: z.string().min(1, "本文を入力してください"),
  coverImageURL: z.string().url("有効なURL形式で入力してください"),
  categoryIds: z
    .array(z.string())
    .min(1, "最低1つのカテゴリを選択してください"),
});
type PostFormValues = z.infer<typeof postSchema>;

const Page: React.FC = () => {
  const { id } = useParams() as { id: string };
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<
    CategoryApiResponse[]
  >([]);

  // 🌟 React Hook Form の設定
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset, // 既存データをフォームにセットするための関数
    formState: { errors, isSubmitting },
  } = useForm<PostFormValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      content: "",
      coverImageURL: "",
      categoryIds: [],
    },
  });

  const selectedCategoryIds = watch("categoryIds");

  // --- 初期データ取得 (記事情報 ＆ カテゴリ一覧) ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 並列でデータを取得して高速化！
        const [postRes, catRes] = await Promise.all([
          fetch(`/api/posts/${id}`, { cache: "no-store" }),
          fetch("/api/categories", { cache: "no-store" }),
        ]);

        if (!postRes.ok || !catRes.ok)
          throw new Error("データの取得に失敗しました");

        const postData: PostApiResponse = await postRes.json();
        const catData: CategoryApiResponse[] = await catRes.json();

        setAvailableCategories(catData);

        // 🌟 取得したデータをフォームに流し込む（resetを使用）
        reset({
          title: postData.title,
          content: postData.content,
          coverImageURL: postData.coverImageURL,
          categoryIds: postData.categories.map((c) => c.category.id),
        });
      } catch (error) {
        toast.error("データの読み込みに失敗しました");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id, reset]);

  // --- カテゴリのチェックボックス処理 ---
  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newIds = checked
      ? [...selectedCategoryIds, categoryId]
      : selectedCategoryIds.filter((cid) => cid !== categoryId);
    setValue("categoryIds", newIds, { shouldValidate: true });
  };

  // --- 🌟 記事の更新 (PUT) ---
  const onSubmit = async (data: PostFormValues) => {
    // toast.promise を使うと、処理中・成功・失敗のトーストを自動で切り替えてくれます！
    const updatePromise = fetch(`/api/admin/posts/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(async (res) => {
      if (!res.ok) throw new Error();
      router.push(`/posts/${id}`);
    });

    await toast.promise(updatePromise, {
      loading: "記事を更新中...",
      success: "記事を更新しました！🎉",
      error: "更新に失敗しました...",
    });
  };

  // --- 🌟 記事の削除 (DELETE) ---
  const handleDelete = async () => {
    if (
      !window.confirm(
        "本当にこの記事を削除しますか？\nこの操作は取り消せません。",
      )
    )
      return;

    const deletePromise = fetch(`/api/admin/posts/${id}`, {
      method: "DELETE",
      cache: "no-store",
    }).then(async (res) => {
      if (!res.ok) throw new Error();
      router.push("/admin/posts"); // 削除後は一覧ページへ
    });

    await toast.promise(deletePromise, {
      loading: "削除しています...",
      success: "記事を削除しました🗑️",
      error: "削除に失敗しました...",
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-500">
        <FontAwesomeIcon
          icon={faSpinner}
          className="mr-2 animate-spin text-2xl text-indigo-500"
        />
        <span className="font-bold tracking-wider">Loading Data...</span>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-extrabold text-slate-800">記事の編集</h1>
        {/* 🌟 削除ボタン */}
        <button
          type="button"
          onClick={handleDelete}
          className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-500 hover:text-white"
        >
          <FontAwesomeIcon icon={faTrash} />
          この記事を削除
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className={twMerge(
          "space-y-6 rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200",
          isSubmitting && "opacity-60",
        )}
      >
        {/* タイトル */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-bold text-slate-700"
          >
            タイトル
          </label>
          <input
            id="title"
            {...register("title")}
            className={twMerge(
              "w-full rounded-lg border px-4 py-3 text-lg transition-all outline-none focus:ring-4",
              errors.title
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100",
            )}
          />
          {errors.title && (
            <p className="text-sm font-bold text-red-500">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {errors.title.message}
            </p>
          )}
        </div>

        {/* 本文 */}
        <div className="space-y-2">
          <label
            htmlFor="content"
            className="block text-sm font-bold text-slate-700"
          >
            本文 (HTML可)
          </label>
          <textarea
            id="content"
            {...register("content")}
            className={twMerge(
              "min-h-[300px] w-full resize-y rounded-lg border px-4 py-3 leading-relaxed transition-all outline-none focus:ring-4",
              errors.content
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100",
            )}
          />
          {errors.content && (
            <p className="text-sm font-bold text-red-500">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {errors.content.message}
            </p>
          )}
        </div>

        {/* カバー画像URL */}
        <div className="space-y-2">
          <label
            htmlFor="coverImageURL"
            className="block text-sm font-bold text-slate-700"
          >
            カバー画像URL
          </label>
          <input
            id="coverImageURL"
            {...register("coverImageURL")}
            className={twMerge(
              "w-full rounded-lg border px-4 py-3 transition-all outline-none focus:ring-4",
              errors.coverImageURL
                ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100",
            )}
          />
          {errors.coverImageURL && (
            <p className="text-sm font-bold text-red-500">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {errors.coverImageURL.message}
            </p>
          )}
        </div>

        {/* カテゴリ */}
        <div className="space-y-3 pt-2">
          <div className="text-sm font-bold text-slate-700">カテゴリタグ</div>
          <div className="flex flex-wrap gap-3">
            {availableCategories.map((c) => {
              const isChecked = selectedCategoryIds.includes(c.id);
              return (
                <label
                  key={c.id}
                  className={twMerge(
                    "flex cursor-pointer items-center space-x-2 rounded-full border px-4 py-2 transition-all",
                    isChecked
                      ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                      : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100",
                  )}
                >
                  <input
                    type="checkbox"
                    className="hidden" // デフォルトのチェックボックスを隠してデザイン化
                    checked={isChecked}
                    onChange={(e) =>
                      handleCategoryChange(c.id, e.target.checked)
                    }
                  />
                  <span
                    className={twMerge(
                      "h-3 w-3 rounded-sm border",
                      isChecked
                        ? "border-indigo-600 bg-indigo-600"
                        : "border-slate-400 bg-white",
                    )}
                  ></span>
                  <span className="text-sm font-bold">{c.name}</span>
                </label>
              );
            })}
          </div>
          {errors.categoryIds && (
            <p className="text-sm font-bold text-red-500">
              <FontAwesomeIcon icon={faTriangleExclamation} className="mr-1" />
              {errors.categoryIds.message}
            </p>
          )}
        </div>

        {/* アクションボタン */}
        <div className="flex justify-end border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 font-bold text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
          >
            <FontAwesomeIcon icon={faSave} />
            変更を保存する
          </button>
        </div>
      </form>
    </main>
  );
};

export default Page;
