import Link from 'next/link';
import WhiteHouse from '../../public/house-icon-wh.svg';
import WhiteRegister from '../../public/register-icon-wh.svg';
import Image from 'next/image';

export default function Login() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <nav className="navbar">
        <ul>
          <li>
            <Link href="/register" className="text-white hover:text-gray-300">
              <Image
                className="w-7"
                src={WhiteRegister}
                alt="utilisateur avec un plus"
                aria-label="icon de navigation vers la page d'
                inscription"
              />
            </Link>
          </li>
          <li>
            <Link href="/" className="text-white hover:text-gray-300">
              <Image
                className="w-7"
                src={WhiteHouse}
                alt="maison blanche"
                aria-label="icon de navigation vers la page d'
              accueil"
              />
            </Link>
          </li>
        </ul>
      </nav>
      <div className="flex flex-col items-center justify-center h-[85vh]">
        <h1 className="title font-quicksand pb-10 text-center">Connexion</h1>
        <form className="flex flex-col justify-center items-center gap-5">
          <div className="p-5 flex flex-col justify-center item-center">
            <label htmlFor="email" className="form-label" aria-label="email form" />
            <input
              type="email"
              id="email"
              className="font-sulphur form-input flex w-[280px] self-center p-2 rounded"
              placeholder="Email"
              required
            />
          </div>
          <div className="flex flex-col justify-center item-center">
            <label htmlFor="password" className="form-label" aria-label="password-input" />
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              required
            />
          </div>
          <div className="flex items-center justify-center pl-20 ml-20">
            <div className="flex items-center justyfy-center h-5">
              <input
                id="remember"
                type="checkbox"
                value=""
                className=":border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
                placeholder="password"
                required
              />
            </div>
            <label htmlFor="remember" className="text-white text-xs ml-2 font-montserrat">
              Remember me
            </label>
          </div>
          <button
            type="submit"
            className="button font-sulphur font-semibold text-red-100 p-5 w-[200px] rounded flex justify-center self-center item-center"
          >
            Submit
          </button>
        </form>
      </div>
      <footer className="py-4 text-center bg-gray-800 text-white mt-auto">
        Copyright TuneMatch 2025
      </footer>
    </main>
  );
}
