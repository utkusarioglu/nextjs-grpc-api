export function isEnvEnabled(envVar: string | undefined): boolean {
  const disabledPhrases = ["FALSE", "0", "DISABLED", "NO"];
  return !envVar ? true : !disabledPhrases.includes(envVar.toUpperCase());
}
