import { Instagram, Facebook, MessageCircle } from 'lucide-react';
import logo from '../assets/logo.svg';

export default function Footer({ business }) {
  const whatsappHref = `https://wa.me/${business.whatsapp}`;

  return (
    <footer className="mt-12 border-t border-abi-mist bg-abi-cream pb-28 pt-10 sm:pb-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 text-center">
        <img src={logo} alt="" aria-hidden="true" className="h-20 w-20" />
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-abi-skyDk">
          Síguenos
        </p>
        <div className="flex items-center gap-3">
          {/* TODO: reemplazar con el link real de Instagram cuando esté listo */}
          <a
            href="#"
            aria-label="Instagram (próximamente)"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-abi-deep shadow-card ring-1 ring-abi-mist transition hover:bg-abi-sky"
          >
            <Instagram className="h-5 w-5" />
          </a>
          {/* TODO: reemplazar con el link real de Facebook cuando esté listo */}
          <a
            href="#"
            aria-label="Facebook (próximamente)"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white text-abi-deep shadow-card ring-1 ring-abi-mist transition hover:bg-abi-sky"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Escribir por WhatsApp"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-abi-deep text-white shadow-card transition hover:bg-abi-skyDk"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>
        <p className="text-sm text-abi-deep/80">{business.serviceArea}</p>
        <p className="text-sm italic text-abi-deep/70">Cocina por {business.cook}</p>
        <p className="text-xs text-abi-deep/50">© 2026 {business.name}</p>
      </div>
    </footer>
  );
}
