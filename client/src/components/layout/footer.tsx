import { getAttribution, AUTHOR } from "@/lib/author";
import { SiGithub } from "react-icons/si";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          {getAttribution()}
        </div>
        <div className="flex space-x-4">
          <a
            href={AUTHOR.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="GitHub"
          >
            <SiGithub className="h-5 w-5" />
          </a>
          <a
            href={AUTHOR.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Twitter/X"
          >
            <FaXTwitter className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}