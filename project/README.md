# BioPay - AI-Powered Identity & Payment Platform

BioPay is a cutting-edge mobile application built on the Algorand blockchain that combines AI-powered identity verification with seamless cryptocurrency payments. The app features biometric authentication, proof-of-humanity verification, and instant payment capabilities.

## 🚀 Features

### 🔐 Identity Verification
- **AI-Powered Face ID**: Secure biometric authentication using advanced AI
- **Proof-of-Humanity**: Blockchain-based identity verification system
- **Trust Score System**: Dynamic scoring based on verification level and activity
- **Reward Points**: Earn ALGO rewards for maintaining verification status

### 💳 Payment Solutions
- **Address Payments**: Send ALGO and ASAs to any Algorand address
- **QR Code Payments**: Instant payments via QR code scanning
- **Face ID Payment Requests**: Create authenticated payment requests using biometrics
- **Multi-Asset Support**: Support for ALGO, USDC, and other Algorand Standard Assets

### 🏦 Wallet Management
- **Secure Wallet Creation**: Generate new Algorand wallets with 25-word recovery phrases
- **Wallet Import**: Restore existing wallets using mnemonic phrases
- **Real-time Balance**: Live portfolio tracking with USD valuations
- **Transaction History**: Complete transaction history with detailed information

## 🛠 Technology Stack

- **Frontend**: React Native with Expo SDK 52
- **Navigation**: Expo Router 4.0
- **Blockchain**: Algorand SDK (algosdk)
- **State Management**: Zustand
- **UI Components**: Custom components with Lucide React Native icons
- **Camera**: Expo Camera for QR code scanning
- **Styling**: React Native StyleSheet with gradient effects

## 📱 Platform Support

- **Web**: Primary platform with full feature support
- **iOS**: Native mobile experience (requires development build)
- **Android**: Native mobile experience (requires development build)

## 🏗 Project Structure

```
app/
├── _layout.tsx              # Root layout with navigation setup
├── (tabs)/                  # Tab-based navigation
│   ├── _layout.tsx         # Tab bar configuration
│   ├── index.tsx           # Home screen with wallet overview
│   ├── charge.tsx          # Payment methods selection
│   └── identity.tsx        # Identity verification hub
├── payment/
│   └── [method].tsx        # Dynamic payment method screens
└── +not-found.tsx          # 404 error page

components/
├── AssetCard.tsx           # Cryptocurrency asset display
├── TransactionItem.tsx     # Transaction history item
└── WalletSetup.tsx         # Wallet creation/import flow

stores/
├── walletStore.ts          # Wallet state management
└── identityStore.ts        # Identity verification state

hooks/
└── useFrameworkReady.ts    # Framework initialization hook
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd biopay
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open the app:
   - **Web**: Open http://localhost:8081 in your browser
   - **Mobile**: Use Expo Go app to scan the QR code

### Development Build (for native features)

For full native functionality including camera and biometrics:

```bash
# Install Expo Dev Client
npx expo install expo-dev-client

# Create development build
npx expo run:ios
# or
npx expo run:android
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_ALGORAND_NODE_URL=https://mainnet-api.algonode.cloud
EXPO_PUBLIC_ALGORAND_INDEXER_URL=https://mainnet-idx.algonode.cloud
```

### Algorand Network

The app is configured for Algorand MainNet by default. For TestNet development:

1. Update the node URLs in your environment variables
2. Use TestNet dispensers for test ALGO
3. Update asset IDs for TestNet equivalents

## 🔐 Security Features

- **Client-side Key Storage**: Private keys never leave the device
- **Mnemonic Encryption**: Recovery phrases are securely stored
- **Biometric Authentication**: Face ID integration for payment requests
- **Transaction Signing**: All transactions signed locally
- **Network Security**: HTTPS-only API communications

## 🎨 Design Philosophy

BioPay follows Apple-level design aesthetics with:
- **Clean Interface**: Minimalist design with purposeful elements
- **Smooth Animations**: Micro-interactions and transitions
- **Consistent Theming**: Unified color palette and typography
- **Responsive Layout**: Optimized for all screen sizes
- **Accessibility**: WCAG compliant with proper contrast ratios

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npx tsc --noEmit
```

## 📦 Building for Production

### Web Build
```bash
npm run build:web
```

### Mobile Build
```bash
# iOS
npx expo build:ios

# Android
npx expo build:android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Algorand Foundation** for the robust blockchain infrastructure
- **Expo Team** for the excellent development platform
- **React Native Community** for the comprehensive ecosystem
- **Lucide Icons** for the beautiful icon library

## 📞 Support

For support and questions:
- Create an issue in this repository
- Join our community Discord
- Email: support@biopay.app

## 🗺 Roadmap

- [ ] Multi-language support
- [ ] Advanced DeFi integrations
- [ ] NFT marketplace integration
- [ ] Cross-chain bridge support
- [ ] Enterprise API access
- [ ] Hardware wallet integration

---

Built with ❤️ using React Native, Expo, and Algorand