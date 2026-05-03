import { useNavigate } from "react-router";

export const MenuSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-xs px-6">
      <MenuItem title="새 게임" primary onClick={() => navigate("/game")} />
      <MenuItem title="계속하기" />
      <MenuItem title="설정" />
    </div>
  );
};

const MenuItem = ({
  title,
  primary = false,
  onClick,
}: {
  title: string;
  primary?: boolean;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full py-3.5 rounded-xl text-base font-semibold tracking-wide transition-all duration-150 cursor-pointer
        ${
          primary
            ? "bg-slate-800 text-white hover:bg-slate-700 active:scale-95"
            : "bg-slate-100 text-slate-600 hover:bg-slate-200 active:scale-95"
        }`}
    >
      {title}
    </button>
  );
};
