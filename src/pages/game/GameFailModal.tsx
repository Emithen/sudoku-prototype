import { useNavigate } from "react-router";

export const GameFailModal = ({ onRetry }: { onRetry: () => void }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end justify-center z-50 pb-12">
      <div className="bg-white rounded-2xl w-full max-w-sm mx-4 px-6 py-8 flex flex-col items-center gap-6 shadow-2xl">
        <div className="flex flex-col items-center gap-1">
          <p className="text-3xl font-black text-slate-800 tracking-tight">
            시간 초과
          </p>
          <p className="text-sm text-slate-400">시간 안에 풀지 못했어요</p>
        </div>
        <div className="flex flex-col w-full gap-3">
          <button
            onClick={onRetry}
            className="w-full py-3.5 rounded-xl bg-slate-800 text-white text-base font-semibold hover:bg-slate-700 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            다시 시도
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3.5 rounded-xl bg-slate-100 text-slate-600 text-base font-semibold hover:bg-slate-200 active:scale-95 transition-all duration-150 cursor-pointer"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};
