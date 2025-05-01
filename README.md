# Monad Vibes

A mini-app that allows users to check and share NFT performance with style. Built on the Monad blockchain and integrated with Farcaster, this application provides a fun and interactive way to view NFT statistics and share them with others directly on Farcaster.

## Features

- 🎨 View NFT details and performance metrics
- 📊 Track volume changes across different timeframes (1 day, 7 days, 30 days)
- 🎭 Get personalized roast messages based on NFT performance
- 📱 Share your NFT vibes directly on Farcaster
- 🎯 Clean and modern UI with responsive design
- 🔗 Seamless Farcaster integration for easy sharing

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- A Monad-compatible wallet
- Farcaster account (for sharing functionality)

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd monad-miniapp-template
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_APP_URL=your-app-url
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a wallet address in the input field
2. View the NFT details and performance metrics
3. Share your NFT vibes directly on Farcaster using the share button
4. Check another NFT by clicking the "Check Another" button

### Farcaster Integration

The app integrates with Farcaster to allow users to:
- Share NFT performance metrics directly to their Farcaster feed
- Include personalized roast messages in their posts
- Generate visually appealing cards for their Farcaster posts
- Track engagement on their shared NFT content

## Project Structure

```

├── components/         # React components
│   └── Home/          # Home page components
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and constants
├── pages/            # Next.js pages
├── public/           # Static assets
└── styles/           # Global styles
```

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- html2canvas
- Monad SDK
- Farcaster API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Monad team for the blockchain infrastructure
- Farcaster team for the social protocol
- All contributors who have helped improve this project
