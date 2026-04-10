import CliqueTechLogoImg from '../assets/cliquetech-logo.png';

export function Footer() {
  return (
    <footer className="bg-gray-900 py-4 sm:py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-center">
        <span className="text-gray-300 text-xs sm:text-sm">Brought to you by</span>
        <div className="flex items-center gap-2">
          <a href="http://www.cliquetech.io" target="_blank" rel="noopener noreferrer" className="text-white text-xs sm:text-base">Clique Technologies</a>
          <a href="http://www.cliquetech.io" target="_blank" rel="noopener noreferrer">
            <img
              src={CliqueTechLogoImg}
              alt="CliqueTechnologies"
              className="w-6 sm:w-8"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}
