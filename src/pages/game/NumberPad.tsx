const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export const NumberPad = ({
  onInput,
  disabled,
}: {
  onInput: (value: number | null) => void;
  disabled: boolean;
}) => (
  <div
    className={`w-full max-w-sm flex flex-col gap-1.5 transition-opacity duration-150 ${
      disabled ? "opacity-30 pointer-events-none" : ""
    }`}
  >
    <div className="flex justify-end gap-1.5">
      <button
        onClick={() => onInput(null)}
        className="py-3 px-5 rounded-xl bg-slate-100 text-slate-500 text-base font-medium hover:bg-slate-200 active:scale-95 transition-all duration-100 cursor-pointer"
      >
        ⌫
      </button>
    </div>
    <div className="flex gap-1.5">
      {DIGITS.map((n) => (
        <button
          key={n}
          onClick={() => onInput(n)}
          className="flex-1 py-3.5 rounded-xl bg-slate-100 text-slate-800 text-base font-semibold hover:bg-slate-200 active:scale-95 transition-all duration-100 cursor-pointer"
        >
          {n}
        </button>
      ))}
    </div>
  </div>
);
