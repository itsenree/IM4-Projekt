// Check authentication status on page load by hitting a protected endpoint.
// Wrapped in an IIFE so the result (a Promise) can be awaited by other modules.
const authReady = (async function () {
  // Request a protected resource, sending cookies along for session auth
  const response = await fetch("/api/protected.php", {
    credentials: "include",
  });

  // Not authenticated — redirect to login and bail out
  if (response.status === 401) {
    window.location.href = "/login.html";
    return null;
  }

  // Authenticated — resolve with the user/session data
  return response.json();
})();
