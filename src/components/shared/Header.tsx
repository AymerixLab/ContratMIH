import { ImageWithFallback } from '../figma/ImageWithFallback';
import newLogo from 'figma:asset/2487ffd81f6eb0aa5bff329df2b3e60b0fe4c80a.png';

export function Header() {
  return (
    <header className="mb-8 text-center">
      <div className="flex justify-center mb-6">
        <ImageWithFallback 
          src={newLogo}
          alt="Made in Hainaut Logo"
          width={200}
          height={200}
          className="object-contain"
        />
      </div>
      <h1 className="text-3xl font-bold text-[#D55A3A] mb-2 font-[Poppins]">
        Formulaire d'inscription exposant
      </h1>
      <p className="text-lg text-gray-600 font-[Poppins]">
        Salon Made in Hainaut 2026 - 21 et 22 mai 2026
      </p>
    </header>
  );
}
