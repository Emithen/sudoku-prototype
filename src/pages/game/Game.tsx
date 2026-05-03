import { Board } from "./Board";

export const Game = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center bg-white">
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4">
        <Board />
      </div>
    </div>
  );
};
