import Head from "next/head";
import { AuthProviders, useWunderGraph } from "../components/generated/nextjs";

export default function Home() {
  const { user, login, logout } = useWunderGraph();
  if (!user)
    return (
      <div className="bg-gradient-to-br from-[#2C3E50] to-black w-screen h-screen">
        <Head>
          <title>Code Video</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col justify-center items-start h-screen w-full px-16 gap-y-6">
          <div className="text-white text-7xl leading-tight">
            Have a code snippet
            <br />
            Create a <span className="text-cyan-500">code video</span>
          </div>
          <button
            className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
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
    <div className="bg-gradient-to-br from-[#2C3E50] to-black w-screen h-screen">
      <div className="flex justify-end p-4">
        <button
          className="bg-cyan-500 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            logout();
          }}
        >
          Logout
        </button>
      </div>
      {JSON.stringify(user)}
    </div>
  );
}
