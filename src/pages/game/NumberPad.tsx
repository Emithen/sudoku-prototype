const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const NumberPad = ({
  onInput,
  disabled,
}: {
  onInput: (value: number | null) => void;
  disabled: boolean;
}) => (
  <div
    className={`w-full max-w-sm flex flex-col gap-2 transition-opacity duration-150 ${
      disabled ? "opacity-30 pointer-events-none" : ""
    }`}
  >
    <div className="grid grid-cols-3 gap-2">
      {DIGITS.map((n) => (
        <button
          key={n}
          onClick={() => onInput(n)}
          className="py-4 rounded-xl bg-slate-100 text-slate-800 text-xl font-semibold hover:bg-slate-200 active:scale-95 transition-all duration-100 cursor-pointer"
        >
          {n}
        </button>
      ))}
    </div>
    <button
      onClick={() => onInput(null)}
      className="w-full py-3 rounded-xl bg-slate-100 text-slate-500 text-sm font-medium hover:bg-slate-200 active:scale-95 transition-all duration-100 cursor-pointer"
    >
      지우기
    </button>
  </div>
);
