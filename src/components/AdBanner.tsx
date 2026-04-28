// Placeholder ad slot for AdMob banner (replace in Capacitor with @capacitor-community/admob)
export function AdBanner() {
  return (
    <div className="border-t border-gold/30 bg-background">
      <div
        className="mx-auto flex h-[60px] w-full max-w-[420px] items-center justify-center px-3 text-xs text-muted-foreground"
        role="region" aria-label="Advertisement"
      >
        <div className="flex h-full w-full items-center justify-between rounded-md border border-dashed border-border/60 bg-muted/30 px-3">
          <span className="font-mono">AdMob Banner</span>
          <span className="text-[10px] opacity-60">320x50 placeholder</span>
        </div>
      </div>
    </div>
  );
}
