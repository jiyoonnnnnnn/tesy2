/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/html/**/*.html', './src/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        // Figma 디자인 토큰
        ink: '#111111', // Font/02_black
        purple: {
          DEFAULT: '#6250ff',
          light: '#9d92ff',
        },
        badge: {
          purple: '#6250ff',
          orange: '#ff8750',
          blue: '#50a7ff',
        },
        gray: {
          150: '#f3f3f3', // 페이지 배경
          400: '#cbcbcb', // 구분선
          450: '#929292',
          500: '#8e8e8e',
          550: '#8d8d8d',
          600: '#7c7c7c',
        },
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        card: '0px 0px 10px rgba(179, 179, 179, 0.5)',
        'service-card': '0px 6px 10px rgba(91, 110, 160, 0.12)',
      },
      backgroundImage: {
        'cta-gradient':
          'linear-gradient(81.8deg, #9d92ff 0%, #6250ff 32%, #6250ff 100%)',
      },
      maxWidth: {
        mobile: '375px',
      },
    },
  },
  plugins: [],
};
