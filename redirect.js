(function () {

    "use strict";

    /* Allowed hosts */
    const allowedLocalHosts = [
        "localhost",
        "127.0.0.1",
    ];

    /* Private domains (optional future use) */
    const allowedDomains = [

    ];

    /* Freeze configuration */
    Object.freeze(allowedLocalHosts);
    Object.freeze(allowedDomains);

    /* Port range */
    const MIN_PORT = 1;
    const MAX_PORT = 65535;

    function fail(msg) {
        document.body.textContent = msg;
        throw new Error(msg);
    };

    /* Read query parameters */
    const params = new URLSearchParams(window.location.search);
    const state = params.get("state");

    if (!state) fail("Missing state parameter");

    /* Decode state safely & Trim whitespace to prevent bypass tricks */
    const cleanState = (() => {
        const trimmed = state.trim();
        try {
            return decodeURIComponent(trimmed);
        } catch {
            return trimmed;
        }
    })();

    /* Optional safety */
    if (cleanState.length > 2000) fail("State too long");

    /*
        Expected state format:
        origin|/path|anything csrf
        Examples:
        http://localhost:3032|/oauth/callback|userId=49fj34
        https://dev.yourcompany.com|/oauth/callback|D45DT3SQW4DH46VC|eru@#djD325
    */

    const { origin, path } = (() => {
        const [rawOrigin, rawPath] = cleanState.split("|", 2);

        if (!rawOrigin) fail("Missing origin");

        return {
            origin: rawOrigin,
            path: rawPath || "/"
        };
    })();

    /* Validate origin */
    const parsedOrigin = (() => {
        try {
            return new URL(origin);
        } catch {
            fail("Invalid origin");
        }
    })();

    /* Restrict protocol */
    if (!["http:", "https:"].includes(parsedOrigin.protocol)) fail("Invalid protocol");

    /* Prevent credentials */
    if (parsedOrigin.username || parsedOrigin.password) fail("Credentials not allowed");

    /* Validate localhost */
    if (allowedLocalHosts.includes(parsedOrigin.hostname)) {

        if (!parsedOrigin.port) fail("Localhost must include port");

        const port = Number(parsedOrigin.port);

        /* Validate port */
        if (!Number.isInteger(port) || port < MIN_PORT || port > MAX_PORT) fail("Invalid port");

    }

    /* Validate private domains */
    else if (!allowedDomains.includes(parsedOrigin.hostname)) {
        fail("Host not allowed");
    }

    /* Validate path */
    if (!path.startsWith("/")) fail("Invalid path");
    if (path.includes("//")) fail("Invalid path");
    if (path.includes("?")) fail("Path cannot contain query");
    if (path.includes("#")) fail("Path cannot contain fragment");

    /* Build redirect URL safely */
    const url = new URL(path, parsedOrigin.origin);

    /* Preserve OAuth query parameters */
    url.search = window.location.search;

    const target = url.toString();

    /* Redirect */
    window.location.replace(target);

})();