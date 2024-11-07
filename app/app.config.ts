export default defineAppConfig({
  ui: {
    primary: 'orange',
    gray: '#12181d',
  },
  app: {
    logo: '/images/tool-farm.png',
    name: 'Wish List'
  },
  footer: {
    smallLinks: [
      // {
      //   label: 'Privacy Policy',
      //   to: '/privacy',
      // },
      // {
      //   label: 'Terms of Service',
      //   to: '/terms',
      // },
      {
        label: 'Contact',
        to: 'mailto:alexeyzlotnik@gmail.com?subject=Tool%20Farm',
      },
    ],
  },
  socials: [
    {
      title: 'Made with ❤️ by Alexey Zlotnik',
      // icon: 'i-simple-line-icons:link',
      to: 'https://zlotnik.website',
      target: '_blank',
    },
  ],
})
