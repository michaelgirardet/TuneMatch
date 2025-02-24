import Link from 'next/link';
import WhiteHouse from '../../public/house-icon-wh.svg';
import WhiteLogin from '../../public/login-icon-wh.svg';
import Image from 'next/image';

export default function Register() {
  return (
    <main className="min-h-screen w-full flex flex-col">
      <nav className="navbar">
        <ul>
          <li>
            <Link href="/login" className="text-white hover:text-gray-300">
              <Image
                className="w-7"
                src={WhiteLogin}
                alt="utilisateur blanc"
                aria-label="icon de navigation vers la page de connexion"
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
      <div className="flex flex-col items-center justify-center h-[85vh]" id="register-form">
        <form className="flex flex-col justify-center items-center pb-7 gap-5">
          <h1 className="title font-quicksand text-4xl pb-10 text-center">Inscription</h1>
          <div className="p-5 flex flex-col justify-center item-center">
            <label htmlFor="email" className="form-label font-sulphur" aria-label="email form" />
            <select
              name="role"
              id="role-select"
              className="form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              required
            >
              <option value="">Choisissez votre status</option>
              <option value="producteur">Producteur</option>
              <option value="artiste">Artiste</option>
            </select>
          </div>
          <div className="flex flex-col justify-center item-center">
            <label htmlFor="password" className="form-label" aria-label="password-input" />
            <input
              type="username"
              id="username"
              placeholder="Username"
              className="form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              required
            />
          </div>
          <div className="p-5 flex flex-col justify-center item-center">
            <label htmlFor="email" className="form-label" aria-label="email form" />
            <input
              type="email"
              id="email"
              className="form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              placeholder="Email"
              required
            />
          </div>
          <div className="p-5 flex flex-col justify-center item-center">
            <label htmlFor="password" className="form-label" aria-label="email form" />
            <input
              type="password"
              id="password"
              className="form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              placeholder="Password"
              required
            />
          </div>
          <div className="p-5 flex flex-col justify-center item-center">
            <label htmlFor="password" className="form-label" aria-label="email form" />
            <input
              type="password"
              id="password"
              className="form-input font-sulphur flex w-[280px] self-center p-2 rounded"
              placeholder="Confirm Password"
              required
            />
          </div>
          <button
            type="submit"
            className="button font-sulphur text-red-100 p-5 w-[200px] rounded flex justify-center self-center item-center"
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
