import CliqueTechLogoImg from '../assets/cliquetech-logo.png';

export function Footer() {
  return (
    <footer className="bg-gray-900 py-6 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
        <span className="text-gray-300 text-sm">Brought to you by</span>
        <a href="http://www.cliquetech.io" target="_blank" rel="noopener noreferrer" className="text-white text-gray">Clique Technologies</a>
          <a href="http://www.cliquetech.io" target="_blank" rel="noopener noreferrer">
            <img
              src={CliqueTechLogoImg}
              alt="CliqueTechnologies"
              className="ml-2 w-8"
            />
          </a>
      </div>
    </footer>
  );
}
