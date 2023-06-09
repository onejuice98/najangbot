import { useEffect, useState } from "react";
import { getDetail } from "../../lib/apis";
import { LoadingSVG } from "../common/svgs";
import Typography from "../common/Typography";
import Detail from "./Detail";
import { IPostList } from "./List";

interface TableProps {
  data: IPostList[];
  loading: boolean;
}

const PAGINATION_SHOW_DATAS = 12;

export type DetailType = {
  업체명: string;
  대표자명: string;
  "입찰금액(원)": string;
  "투찰률(%)": string;
  기초금액: string;
};
const Table = ({ data, loading }: TableProps) => {
  const [page, setPage] = useState<number>(1);
  const [list, setList] = useState<IPostList[]>([]);
  const [detailData, setDetailData] = useState<DetailType[]>([]);
  const [detailLoading, setDetailLoading] = useState<boolean>(false);

  /* 재검색 후 Pagination 1 페이지로 가게 하기 위한 Data dependency 연결 */
  useEffect(() => {
    setPage(1);
    setList(data);
  }, [data]);

  const clickedItem = async (keyword: string) => {
    /* loading start */
    setDetailLoading(true);

    /* Axios get data */
    const data = await getDetail(keyword.slice(0, 11));
    setDetailData(data);

    /* end Loading */
    setDetailLoading(false);
  };

  return (
    <>
      {(loading || detailLoading) && (
        <div className="fixed flex flex-col justify-center items-center bg-gray-500/30 top-0 left-0 w-full h-full gap-4 z-50">
          <LoadingSVG w={48} h={48} />
          <span className="font-bold text-lg text-gray-500 animate-bounce">
            잠시만 기달려주세요! 기간을 길게하면 오래걸려요 😉
          </span>
        </div>
      )}
      <div className="flex flex-col max-w-[1200px] justify-between text-gray-500 text-base gap-2 p-2 bg-white rounded-md shadow-md">
        <table className="">
          <thead className="border-b-2">
            <tr>
              <th className="w-40">공고번호</th>
              <th className="w-14">분류</th>
              <th className="w-[420px]">공고명</th>
              <th className="w-32">수요기관</th>
              <th className="w-44">입력일시(마감일)</th>
              <th className="w-20">마감여부</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {list !== undefined &&
              list
                .slice(
                  (page - 1) * PAGINATION_SHOW_DATAS,
                  page * PAGINATION_SHOW_DATAS
                )
                .map((value, index) => (
                  <tr key={index} className="border-b h-16">
                    <td className="py-6">
                      <Typography
                        variants="span"
                        hoverColor="hover:text-green-600"
                        click={() => clickedItem(value.공고번호)}
                        pointer
                      >
                        {value.공고번호}
                      </Typography>
                    </td>
                    <td>{value.분류}</td>
                    <td>
                      <Typography
                        variants="span"
                        hoverColor="hover:text-green-600"
                        click={() => clickedItem(value.공고명)}
                        pointer
                        bold
                      >
                        {value.공고명}
                      </Typography>
                    </td>
                    <td>{value.수요기관}</td>
                    <td className="flex flex-col h-16 justify-center">
                      {value.입력일시.slice(0, 16)}
                      <Typography
                        variants="span"
                        size="text-xs"
                        color="text-blue-300"
                      >
                        {value.입찰마감일시}
                      </Typography>
                    </td>
                    <td>{value.마감여부}</td>
                  </tr>
                ))}
          </tbody>
        </table>
        <div className="flex gap-4 font-medium text-lg right-0 ml-2">
          {data !== undefined &&
            Array(Math.ceil(data.length / PAGINATION_SHOW_DATAS))
              .fill("")
              .map((_, index) => (
                <button
                  key={index}
                  onClick={() => setPage(index + 1)}
                  className={`${index + 1 === page && "text-green-600"}`}
                >
                  {index + 1}
                </button>
              ))}
        </div>
      </div>
      <Detail data={detailData} loading={detailLoading} />
    </>
  );
};
export default Table;
