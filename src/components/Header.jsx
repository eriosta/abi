import logo from '../assets/logo.svg';

export default function Header({ business }) {
  return (
    <header className="pattern-hearts relative overflow-hidden bg-abi-mist">
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 pb-6 pt-6 text-center sm:pb-10 sm:pt-10">
        <img
          src={logo}
          alt={`${business.name} — ${business.tagline}`}
          className="h-32 w-32 sm:h-44 sm:w-44"
        />
        <p className="mt-2 max-w-md text-sm text-abi-deep/80 sm:text-base">
          Comida casera venezolana, hecha con amor por{' '}
          <span className="font-bold">{business.cook}</span>.
        </p>
        <p className="mt-0.5 text-xs text-abi-deep/60 sm:text-sm">{business.serviceArea}</p>
      </div>
    </header>
  );
}
