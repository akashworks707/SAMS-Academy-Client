import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // next.config.js
  // webpack: (config) => {
  //   config.externals = config.externals || [];
  //   config.externals.push({ "@zoom/meetingsdk/embedded": "@zoom/meetingsdk/embedded" });
  //   return config;
  // },
  // async headers() {
  //     return [
  //       // ── Apply COOP/COEP only to the zoom iframe page ──────────────────────
  //       // These headers enable SharedArrayBuffer (needed for Zoom gallery view)
  //       {
  //         source: "/zoom-meeting.html",
  //         headers: [
  //           { key: "Cross-Origin-Opener-Policy",   value: "same-origin" },
  //           { key: "Cross-Origin-Embedder-Policy",  value: "require-corp" },
  //           { key: "Cross-Origin-Resource-Policy",  value: "cross-origin" },
  //         ],
  //       },
  //       // ── For the parent page that embeds the iframe ────────────────────────
  //       {
  //         source: "/(.*)",
  //         headers: [
  //           { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
  //         ],
  //       },
  //     ];
  //   },
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
      ],
    }];
  },
};


export default withNextIntl(nextConfig);
