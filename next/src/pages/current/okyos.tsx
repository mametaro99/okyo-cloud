import { GetServerSideProps } from "next";
import Link from "next/link";

interface Okyo {
  id: number;
  name: string;
  description: string;
  video_url: string;
  article_url: string;
}

interface Props {
  okyos: Okyo[];
  userSectId: number; // 仮に現在のユーザーの宗派IDが必要だと仮定
}

const OkyoList = ({ okyos, userSectId }: Props) => {
  return (
    <div className="p-6">
      <p>所属している宗派のみ、編集可能です。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {okyos.map((okyo) => (
          <div
            key={okyo.id}
            className="border rounded-lg shadow-md p-4 flex flex-col justify-between bg-white"
          >
            <h2 className="text-xl font-bold mb-4">{okyo.name}</h2>
            <p className="text-gray-600 mb-4">
              {okyo.description.length > 100
                ? `${okyo.description.substring(0, 100)}...`
                : okyo.description}
            </p>
            <div className="flex justify-between">
              {/* 詳細ページリンク */}
              <Link
                href={`/okyos/${okyo.id}`}
                className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
              >
                詳細
              </Link>
              {/* 編集ページリンク */}
              {userSectId === 1 && ( // 仮に宗派IDが一致しているかどうかをチェック
                <Link
                  href={`/okyos/${okyo.id}/edit`}
                  className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                >
                  編集
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      <br />
      {/* 新しいお経を作成リンク */}
      <Link
        href="/okyos/new"
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        新しいお経を作成
      </Link>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/v1/current/okyo");

    // レスポンスが成功した場合のみ、JSONとして解析
    if (!response.ok) {
      console.error("Failed to fetch okyos:", response.statusText);
      return { props: { okyos: [], userSectId: 1 } };
    }

    // レスポンスをJSONとして解析
    const okyos: Okyo[] = await response.json();

    // 仮にユーザーの宗派情報を取得（例: ユーザーのIDを利用して取得）
    const userSectId = 1; // 宗派IDは動的に取得することを想定

    return {
      props: {
        okyos,
        userSectId,
      },
    };
  } catch (error) {
    console.error("Error fetching okyos:", error);
    return { props: { okyos: [], userSectId: 1 } };
  }
};

export default OkyoList;
