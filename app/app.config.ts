export default defineAppConfig({
  ui: {
    primary: 'orange',
    gray: '#12181d',
  },
  app: {
    logo: '/images/logo.svg',
    name: 'Wish List'
  },
  footer: {
    smallLinks: [
      {
        label: 'Privacy Policy',
        to: '/privacy',
      },
      {
        label: 'Terms of Service',
        to: '/terms',
      },
      {
        label: 'Contact',
        to: 'mailto:alexeyzlotnik@gmail.com?subject=Wish%20List',
      },
    ],
  },
  socials: [
    {
      title: 'Made with ❤️ by Alexey Zlotnik',
      to: 'https://alexeyzlotnik.github.io/',
      target: '_blank',
    },
  ],
})
