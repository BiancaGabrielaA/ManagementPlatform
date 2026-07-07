import {
  GiftIcon,
  LinkIcon,
  Mail,
  SquareKanban,
} from "lucide-react";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-6 py-10 md:flex-row">
        <div>
          <div className="flex items-center gap-2">
            <SquareKanban className="h-7 w-7 text-primary" />

            <h2 className="text-2xl font-bold text-slate-900">
              Task<span className="text-primary">Flow</span>
            </h2>
          </div>

          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
            A modern project management platform built with React, NestJS
          </p>
        </div>

        {/* Social Links */}
       <div className="flex gap-6 text-sm">
            <a
                href="https://github.com/USERNAME/taskflow"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 transition hover:text-primary"
            >
                GitHub
            </a>

            <a
                href="https://linkedin.com/in/YOURPROFILE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 transition hover:text-primary"
            >
                LinkedIn
            </a>

            <a
                href="mailto:you@email.com"
                className="text-slate-600 transition hover:text-primary"
            >
                Contact
            </a>
        </div>
      </div>

      <div className="border-t border-slate-100 py-5 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} TaskFlow 
      </div>
    </footer>
  );
}

export default Footer;