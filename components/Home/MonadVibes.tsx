import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { positiveRoasts, negativeRoasts } from './roastMessages';
import { useMiniAppContext } from "@/hooks/use-miniapp-context";
import { APP_URL } from "@/lib/constants";
import html2canvas from 'html2canvas';

interface NFT {
  id: string;
  name: string;
  image: string;
  description: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
  volumeChange: {
    "1day": number;
    "7day": number;
    "30day": number | null;
  };
}

interface AddressHistory {
  address: string;
  timestamp: number;
}

export function MonadVibes() {
  const [nft, setNft] = useState<NFT | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [showAddressInput, setShowAddressInput] = useState(false);
  const [addressHistory, setAddressHistory] = useState<AddressHistory[]>([]);
  const [previousNFT, setPreviousNFT] = useState<NFT | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const nftRef = useRef<HTMLDivElement>(null);
  const { actions } = useMiniAppContext();

  const getBackgroundGradient = (volumeChange: number | null) => {
    if (volumeChange === null) {
      return 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700';
    }

    // Convert volume change to percentage and get absolute value
    const percentage = Math.abs(volumeChange * 100);
    
    if (volumeChange >= 0) {
      // Positive change - green spectrum
      if (percentage < 10) return 'bg-gradient-to-br from-green-700 via-emerald-600 to-teal-500';
      if (percentage < 20) return 'bg-gradient-to-br from-green-800 via-emerald-700 to-teal-600';
      if (percentage < 30) return 'bg-gradient-to-br from-green-900 via-emerald-800 to-teal-700';
      if (percentage < 50) return 'bg-gradient-to-br from-green-950 via-emerald-900 to-teal-800';
      return 'bg-gradient-to-br from-green-950 via-emerald-950 to-teal-900';
    } else {
      // Negative change - red spectrum
      if (percentage < 10) return 'bg-gradient-to-br from-red-700 via-rose-600 to-pink-500';
      if (percentage < 20) return 'bg-gradient-to-br from-red-800 via-rose-700 to-pink-600';
      if (percentage < 30) return 'bg-gradient-to-br from-red-900 via-rose-800 to-pink-700';
      if (percentage < 50) return 'bg-gradient-to-br from-red-950 via-rose-900 to-pink-800';
      return 'bg-gradient-to-br from-red-950 via-rose-950 to-pink-900';
    }
  };

  const getVolumeColor = (value: number | null) => {
    if (value === null) return 'bg-gray-100';
    
    // Convert volume change to percentage and get absolute value
    const percentage = Math.abs(value * 100);
    
    if (value >= 0) {
      // Positive change - green spectrum
      if (percentage < 10) return 'bg-green-50';
      if (percentage < 20) return 'bg-green-100';
      if (percentage < 30) return 'bg-green-200';
      if (percentage < 50) return 'bg-green-300';
      return 'bg-green-400';
    } else {
      // Negative change - red spectrum
      if (percentage < 10) return 'bg-red-50';
      if (percentage < 20) return 'bg-red-100';
      if (percentage < 30) return 'bg-red-200';
      if (percentage < 50) return 'bg-red-300';
      return 'bg-red-400';
    }
  };

  const getRoastMessage = (volumeChange: number | null) => {
    if (volumeChange === null) return "Your NFT is as mysterious as my future";
    
    const percentage = Math.abs(volumeChange * 100);
    const roasts = volumeChange >= 0 ? positiveRoasts : negativeRoasts;
    
    for (const roast of roasts) {
      if (percentage <= roast.threshold) {
        return roast.message;
      }
    }
    return roasts[roasts.length - 1].message;
  };

  // Validate Ethereum address format
  const isValidAddress = (addr: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };

  const handleCheckAnother = () => {
    if (nft) {
      setPreviousNFT(nft);
    }
    setAddress('');
    setShowAddressInput(true);
    setNft(null);
    setError(null);
  };

  const handleBack = () => {
    if (previousNFT) {
      setNft(previousNFT);
      setShowAddressInput(false);
      setPreviousNFT(null);
    }
  };

  const handleAddressSelect = (selectedAddress: string) => {
    setAddress(selectedAddress);
  };

  const fetchNFTs = async () => {
    if (!address) {
      setError('Please enter an address');
      return;
    }

    if (!isValidAddress(address)) {
      setError('Please enter a valid Ethereum address');
      return;
    }

    setLoading(true);
    setError(null);
    setNft(null);

    try {
      const options = {
        method: 'GET',
        url: `https://api-mainnet.magiceden.dev/v3/rtp/monad-testnet/users/${address}/collections/v3?includeTopBid=false&includeLiquidCount=false&offset=0&limit=100`,
        headers: { accept: '*/*' }
      };

      console.log('Making API request with options:', options);

      const response = await axios.request(options);
      const nfts = response.data.collections;
      
      console.log('Raw API response:', response);
      console.log('NFTs data:', nfts);

      if (nfts && nfts.length > 0) {
        const findValidNFT = (startIndex: number): NFT | null => {
          for (let i = startIndex; i < nfts.length; i++) {
            const nft = nfts[i].collection;
            if (nft && nft.image) {
              console.log('Found valid NFT at index:', i);
              return nft;
            }
          }
          return null;
        };

        const startIndex = Math.floor(Math.random() * nfts.length);
        let validNFT = findValidNFT(startIndex);

        if (!validNFT) {
          console.log('No valid NFT found from random index, trying from beginning');
          validNFT = findValidNFT(0);
        }

        if (validNFT) {
          console.log('Setting valid NFT:', validNFT);
          setNft(validNFT);
          setShowAddressInput(false);
          
          // Add to address history
          setAddressHistory(prev => {
            const newHistory = [
              { address, timestamp: Date.now() },
              ...prev.filter(h => h.address !== address)
            ].slice(0, 5); // Keep only last 5 addresses
            return newHistory;
          });
        } else {
          console.log('No NFTs with valid images found');
          setError('No valid NFTs found in this collection');
        }
      } else {
        console.log('No NFTs found in collection');
        setError('No NFTs found in this collection');
      }
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      setError('Failed to fetch NFTs. Please check the address and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Log state changes
  useEffect(() => {
    console.log('Current NFT state:', nft);
  }, [nft]);

  const formatVolumeChange = (value: number | null) => {
    if (value === null) return 'N/A';
    return `${(value * 100).toFixed(2)}%`;
  };

  const handleShare = async () => {
    if (!nft || !nftRef.current) return;

    setIsCapturing(true);
    try {
      const canvas = await html2canvas(nftRef.current, {
        background: 'transparent',
        logging: false,
        useCORS: true,
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob: Blob | null) => {
          if (blob) resolve(blob);
        }, 'image/png');
      });

      // Create a File object from the blob
      const file = new File([blob], `monad-vibes-${Date.now()}.png`, { type: 'image/png' });
      
      // Create a FormData object and append the file
   

    
      
      // Share with the image
      actions?.composeCast({
        text: `🎨 Monad Vibes: ${nft.name}\n\n📈 7-Day Performance: ${formatVolumeChange(nft.volumeChange["7day"])}\n\n${getRoastMessage(nft.volumeChange["7day"])}\n\nCheck it out!`,
        embeds: [ `${APP_URL}`],
      });
    } catch (err) {
      console.error('Error capturing or uploading screenshot:', err);
      // Fallback to sharing without screenshot
      actions?.composeCast({
        text: `🎨 Monad Vibes: ${nft.name}\n\n📈 7-Day Performance: ${formatVolumeChange(nft.volumeChange["7day"])}\n\n${getRoastMessage(nft.volumeChange["7day"])}\n\nCheck it out!`,
        embeds: [`${APP_URL}`],
      });
    } finally {
      setIsCapturing(false);
    }
  };

  if (showAddressInput || !nft) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Monad Vibes</h1>
            <p className="text-xl text-white/80">Discover NFT performance with style</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col space-y-6">
              <div>
                <label htmlFor="address" className="block text-white/90 text-sm font-medium mb-2">
                  Enter Wallet Address
                </label>
                <input
                  id="address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-white/5 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-white/20 focus:outline-none focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all"
                />
              </div>

              {/* Address History */}
              {addressHistory.length > 0 && (
                <div className="space-y-2">
                  <p className="text-white/80 text-sm">Recent addresses:</p>
                  <div className="flex flex-wrap gap-2">
                    {addressHistory.map((history, index) => (
                      <button
                        key={index}
                        onClick={() => handleAddressSelect(history.address)}
                        className="bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-1 rounded-lg transition-all"
                      >
                        {history.address.slice(0, 6)}...{history.address.slice(-4)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <button
                onClick={fetchNFTs}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </div>
                ) : (
                  'Check NFT'
                )}
              </button>
              
              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (nft) {
    const backgroundGradient = getBackgroundGradient(nft.volumeChange["7day"]);
    const roastMessage = getRoastMessage(nft.volumeChange["7day"]);
    const volumeChange = nft.volumeChange["7day"];
    const isPositive = volumeChange !== null && volumeChange >= 0;
    
    return (
      <div className={`min-h-screen ${backgroundGradient} p-8`}>
        <div className="max-w-4xl mx-auto">
          <div 
            ref={nftRef}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="relative h-96">
              <Image
                src={nft.image}
                alt={nft.name}
                fill
                className="object-contain p-4"
                unoptimized
              />
            </div>
            
            <div className="p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{nft.name}</h2>
              
              {/* Volume Changes with Roast */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">7-Day Performance</h3>
                  <div className={`text-2xl font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {formatVolumeChange(volumeChange)}
                  </div>
                </div>
                <div className="bg-gray-100/80 backdrop-blur-sm p-6 rounded-xl">
                  <p className="text-gray-800 text-lg font-medium">{roastMessage}</p>
                </div>
              </div>
              
              {/* Other Volume Changes */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Other Timeframes</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className={`p-6 rounded-xl ${getVolumeColor(nft.volumeChange["1day"])}`}>
                    <p className="text-sm text-gray-500 mb-1">24h Change</p>
                    <p className="text-2xl font-bold text-gray-800">{formatVolumeChange(nft.volumeChange["1day"])}</p>
                  </div>
                  <div className={`p-6 rounded-xl ${getVolumeColor(nft.volumeChange["30day"])}`}>
                    <p className="text-sm text-gray-500 mb-1">30d Change</p>
                    <p className="text-2xl font-bold text-gray-800">{formatVolumeChange(nft.volumeChange["30day"])}</p>
                  </div>
                </div>
              </div>
              
              {/* Attributes */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {nft.attributes?.map((attr, index) => (
                  <div key={index} className="bg-gray-100/80 backdrop-blur-sm p-6 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">{attr.trait_type}</p>
                    <p className="text-lg font-semibold text-gray-800">{attr.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center space-x-6">
            {previousNFT && (
              <button
                onClick={handleBack}
                className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold py-3 px-6 rounded-xl text-lg shadow-lg hover:bg-white transition-all transform hover:scale-105"
              >
                ← Back
              </button>
            )}
            <button
              onClick={handleCheckAnother}
              className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold py-3 px-6 rounded-xl text-lg shadow-lg hover:bg-white transition-all transform hover:scale-105"
            >
              Check Another
            </button>
            <button
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 px-6 rounded-xl text-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleShare}
              disabled={isCapturing}
            >
              {isCapturing ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Capturing...
                </div>
              ) : (
                'Share your vibe'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 space-y-8">
      <h1 className="text-white text-4xl font-bold">Monad Vibes</h1>
      <p className="text-white text-xl">Enter an address to view NFTs</p>
      <div className="flex flex-col space-y-4 w-full max-w-md">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter wallet address"
          className="bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/20 focus:outline-none focus:border-white/40"
        />
        <button
          onClick={fetchNFTs}
          className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold py-3 px-6 rounded-full text-xl shadow-lg hover:bg-white transition-colors"
        >
          Fetch NFTs
        </button>
        {error && (
          <p className="text-red-400 text-center">{error}</p>
        )}
      </div>
    </div>
  );
} 