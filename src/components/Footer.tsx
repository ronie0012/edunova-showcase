import { Link } from "@tanstack/react-router";
import { Github, Instagram, Linkedin, Twitter, GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-primary"><GraduationCap className="h-5 w-5 text-primary-foreground" /></div>
            <span className="text-lg font-bold">EduNova</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Learn from India's best instructors. Build a career that matters.</p>
          <div className="mt-4 flex gap-3">
            {[Twitter, Instagram, Linkedin, Github].map((Icon, i) => (
              <a key={i} href="#" className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted hover:bg-accent transition-colors"><Icon className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Platform</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/courses" className="hover:text-foreground">Browse Courses</Link></li>
            <li><Link to="/student" className="hover:text-foreground">Student Dashboard</Link></li>
            <li><Link to="/instructor" className="hover:text-foreground">Become an Instructor</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms of Service</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Newsletter</h4>
          <p className="mt-3 text-sm text-muted-foreground">Weekly drops on careers, courses & code.</p>
          <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="you@email.com" className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
            <button className="rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">Join</button>
          </form>
        </div>
      </div>
      <div className="border-t border-border py-5 text-center text-xs text-muted-foreground">© 2026 EduNova Technologies Pvt. Ltd. All rights reserved.</div>
    </footer>
  );
}
