try {
  Deno.removeSync("cov_profile", { recursive: true });
} catch (_err) { /* noop */ }
