import { AuthProviders, useWunderGraph } from "../components/generated/nextjs";
import Configuration from "./components/Configuration";

export default function Home() {
  const { user, login, logout } = useWunderGraph();
  if (!user)
    return (
      <div className="bg-gradient-to-br from-[#2C3E50] to-black w-screen h-screen">
        <div className="flex flex-col justify-center items-start h-screen w-full px-16 gap-y-6">
          <div className="text-white text-7xl font-main">
            Have a code snippet
            <br />
            Create a <span className="text-cyan-500">code video</span>
          </div>
          <button
            className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold font-main py-2 px-4 rounded "
            onClick={() => {
              login(AuthProviders.google);
            }}
          >
            Login
          </button>
        </div>
      </div>
    );
  return (
    <div className="bg-[#080B1C] w-screen h-screen flex flex-col">
      <button
        className="absolute right-4 top-4 bg-cyan-500 hover:bg-cyan-700 text-white font-bold font-main py-2 px-4 rounded"
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
      <div className="grid grid-cols-5">
        <div className="h-screen col-span-1 col-start-0 bg-[#14162A]">
          <h1 className="text-4xl font-bold font-main text-white p-4">
            {"<video/>"}
          </h1>
          <hr />
          <Configuration />
        </div>
        <div className="col-span-4 col-start-1"></div>
      </div>
    </div>
  );
}
