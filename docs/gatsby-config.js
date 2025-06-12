module.exports = {
  siteMetadata: {
    title: `Clinical Regex`,
    description: `Cross-platform desktop app for searching and annotating clinical texts.`,
    author: `lindvalllab`,
    siteUrl: `https://lindvalllab.dana-farber.org/`,
    labUrl: `https://lindvalllab.dana-farber.org/`,
    dfciUrl: `https://www.dana-farber.org/`,
    releasesUrl: `https://github.com/lindvalllab/clinical-regex-releases/releases`,
    gettingStartedVideoUrl: `https://www.youtube.com/embed/PutemhaS_D0`,
    configFileVideoUrl: `https://www.youtube.com/embed/vmK7EJdFFbI?si=-JnYc8cgyTgp0-2O`,
    annotatingVideoUrl: `https://www.youtube.com/embed/7HV_TaW66Lo`,
    finishingSavingVideoUrl: `https://www.youtube.com/embed/_Qe-wT00nZg`,
  },
  pathPrefix: `/clinical-regex`,
  plugins: [
    `gatsby-plugin-typescript`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `data`,
        path: `${__dirname}/src/data/`,
        ignore: [`**/.*`], // ignore files starting with a dot
      },
    },
    `gatsby-transformer-csv`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `clinical-regex-docs`,
        short_name: `clinical-regex`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/logo_icon-512x512.png`,
      },
    },
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: `/sitemap.xml`,
        excludes: ["/404/*"],
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "XXXXXXXX",
        head: false,
        respectDNT: true,
      },
    },
    {
      resolve: `gatsby-plugin-google-fonts`,
      options: {
        fonts: [`Poppins:300,400,700`, `Inter`, `JetBrains Mono`],
      },
    },
    {
      resolve: `@chakra-ui/gatsby-plugin`,
      options: {
        resetCSS: true,
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
