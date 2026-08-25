export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        ink: '#0B0B0B',
        paper: '#FFFFFF',
        mute: '#B4B2A9',
        line: '#E5E4DE',
        accent: '#0B0B0B',
        surface: '#F7F7F5',
      },
      keyframes: {
        riseIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        ringPulse: {
          '0%': { boxShadow: '0 0 0 0 rgba(11,11,11,0.25)' },
          '70%': { boxShadow: '0 0 0 10px rgba(11,11,11,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(11,11,11,0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(20px, -20px)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(-25px, 25px)' },
        },
      },
      animation: {
        riseIn: 'riseIn 0.5s ease-out both',
        ringPulse: 'ringPulse 2.4s ease-out infinite',
        marquee: 'marquee 22s linear infinite',
        float: 'float 8s ease-in-out infinite',
        floatSlow: 'floatSlow 11s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};