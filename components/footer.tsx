export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <p className="text-sm text-foreground/60">
          &copy; {new Date().getFullYear()} Dominic Taylor. All rights reserved.
        </p>
        <p className="text-sm text-foreground/60">
          Built with precision and curiosity.
        </p>
      </div>
    </footer>
  )
}
