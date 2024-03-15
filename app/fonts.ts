import localFont from 'next/font/local';

export const marianne = localFont({
  src: [
    {
      path: '../style/fonts/Marianne-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../style/fonts/Marianne-Regular_Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../style/fonts/Marianne-Bold.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  display: 'swap',
  variable: '--font-marianne',
});
