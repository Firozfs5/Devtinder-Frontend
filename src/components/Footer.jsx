const Footer = () => {
  return (
    <footer className="bg-[#151a21] border-t border-[#252c35] text-gray-400 ">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          {/* Brand */}
          <div>
            <h2 className="text-xl font-bold text-white">
              Dev<span className="text-indigo-400">Tinder</span>
            </h2>

            <p className="mt-2 text-sm max-w-sm">
              Connect with developers, build meaningful connections, and grow
              together.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Explore</h3>

              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Developers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Connections
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Profile
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Support</h3>

              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Help
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[#252c35] mt-8 pt-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm">
          <p>© {new Date().getFullYear()} DevTinder. All rights reserved.</p>

          <p className="text-gray-500">Built for developers ❤️</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
