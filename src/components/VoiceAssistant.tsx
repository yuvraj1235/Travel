"use client";
import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, Globe } from "lucide-react";

export function TravelVoiceAssistant() {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [log, setLog] = useState("Click to start planning your trip!");
  const [conversationHistory, setConversationHistory] = useState<Array<{role: string, text: string}>>([]);
  const recognitionRef = useRef<any>(null);
  const conversationRef = useRef<Array<{role: string, text: string}>>([]);

  // Travel knowledge base
  const travelData = {
    destinations: {
      paris: { name: "Paris", flight: "$600-1200", hotel: "$80-300", attractions: "Eiffel Tower, Louvre, Notre-Dame" },
      tokyo: { name: "Tokyo", flight: "$500-1100", hotel: "$60-250", attractions: "Senso-ji, Shibuya, Mount Fuji" },
      london: { name: "London", flight: "$400-900", hotel: "$70-280", attractions: "Big Ben, Tower Bridge, British Museum" },
      dubai: { name: "Dubai", flight: "$300-800", hotel: "$50-200", attractions: "Burj Khalifa, Palm Jumeirah, Desert Safari" },
      bali: { name: "Bali", flight: "$400-900", hotel: "$30-150", attractions: "Temples, Beaches, Rice Paddies" },
      new_york: { name: "New York", flight: "$200-600", hotel: "$100-400", attractions: "Statue of Liberty, Times Square, Central Park" },
      sydney: { name: "Sydney", flight: "$800-1400", hotel: "$70-300", attractions: "Opera House, Harbour Bridge, Bondi Beach" },
      bangkok: { name: "Bangkok", flight: "$300-700", hotel: "$20-100", attractions: "Grand Palace, Temples, Night Markets" },
    },
    activities: {
      adventure: ["Skydiving", "Bungee Jumping", "Rock Climbing", "White Water Rafting", "Zip Lining"],
      culture: ["Museum Tours", "Historical Sites", "Local Cooking Classes", "Traditional Ceremonies"],
      relaxation: ["Spa & Massage", "Beach Days", "Meditation Retreats", "Hot Springs"],
      food: ["Food Tours", "Street Food Markets", "Fine Dining", "Cooking Classes"],
    },
    tips: [
      "Book flights 2-3 months in advance for best prices",
      "Travel during shoulder season for fewer crowds and lower prices",
      "Get travel insurance for peace of mind",
      "Learn basic phrases in the local language",
      "Keep copies of important documents",
      "Download offline maps and translation apps",
      "Check visa requirements before booking",
    ]
  };

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setLog("🎤 Listening... Tell me about your travel plans!");
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        }
      }

      if (finalTranscript) {
        const userMessage = finalTranscript.trim();
        console.log("User:", userMessage);
        addToConversation("user", userMessage);
        setLog(`📝 You: ${userMessage}`);
        
        // Get AI response after a brief delay
        setTimeout(() => {
          const response = getTravelAssistantResponse(userMessage);
          addToConversation("assistant", response);
          setLog(`🤖 Assistant: ${response}`);
          speakText(response);
        }, 500);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setLog(`❌ Error: ${event.error}. Please try again.`);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const addToConversation = (role: string, text: string) => {
    const newMessage = { role, text };
    conversationRef.current.push(newMessage);
    setConversationHistory([...conversationRef.current]);
  };

  const getTravelAssistantResponse = (userInput: string): string => {
    const input = userInput.toLowerCase().trim();

    // Greeting
    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello! Welcome to your personal travel assistant. I can help you find destinations, plan activities, book hotels, get travel tips, and answer all your travel questions. What would you like to explore today?";
    }

    // Budget questions
    if (input.includes("budget") || input.includes("cheap") || input.includes("afford")) {
      return "Great question! For budget travel, I recommend: Bali ($30-150/night hotels), Bangkok ($20-100/night), and Southeast Asia in general. Travel in shoulder season to save 30-50% on flights and hotels. Would you like specific recommendations for a destination?";
    }

    // Best time to visit
    if (input.includes("best time") || input.includes("when to visit")) {
      return "The best time to travel depends on the destination. Generally, shoulder seasons (spring and fall) offer the best weather and fewer crowds. For tropical destinations like Bali, visit April-May or September-October. For Europe, May-June or September-October are ideal. Which destination interests you?";
    }

    // Visa and documents
    if (input.includes("visa") || input.includes("passport") || input.includes("documents")) {
      return "Make sure to check visa requirements for your destination. Generally, you'll need a valid passport (6 months validity). I recommend using VisaHQ.com or contacting your embassy for current requirements. Always get travel insurance too. Which country are you planning to visit?";
    }

    // Activities and experiences
    if (input.includes("activity") || input.includes("thing to do") || input.includes("experience")) {
      const activities = [
        "Adventure activities: skydiving, bungee jumping, rock climbing, rafting",
        "Cultural experiences: museum tours, historical sites, cooking classes",
        "Relaxation: spa treatments, beach days, meditation retreats",
        "Food experiences: street food tours, fine dining, cooking classes"
      ];
      return `Here are popular travel activities: ${activities.join(". ")}. What type of experience interests you?`;
    }

    // Destination recommendations
    const destinations = Object.keys(travelData.destinations);
    for (const dest of destinations) {
      if (input.includes(dest.replace("_", " "))) {
        const info = travelData.destinations[dest as keyof typeof travelData.destinations];
        return `${info.name} is amazing! Flight costs: ${info.flight}, Hotels: ${info.hotel} per night. Top attractions: ${info.attractions}. Would you like to know about activities, restaurants, or travel tips for ${info.name}?`;
      }
    }

    // Hotel booking
    if (input.includes("hotel") || input.includes("accommodation") || input.includes("where to stay")) {
      return "For hotels, I recommend Booking.com, Airbnb, or Agoda for competitive prices. Start searching 6-8 weeks before your trip. Consider staying slightly outside the city center for better prices. Which destination are you looking for accommodation in?";
    }

    // Flight booking
    if (input.includes("flight") || input.includes("airplane") || input.includes("book flight")) {
      return "For flights, use Skyscanner, Google Flights, or Kayak to compare prices. Set price alerts for your desired dates. Flying mid-week (Tuesday-Thursday) is usually cheaper. Book 2-3 months in advance for best rates. Where are you flying from and to?";
    }

    // Duration of trip
    if (input.includes("days") || input.includes("how long") || input.includes("week")) {
      return "For a first-time international trip, I recommend 7-10 days. For nearby destinations, 3-4 days is fine. For exotic locations like Thailand or Japan, plan 10-14 days to truly experience the culture. How much time do you have available?";
    }

    // Travel tips
    if (input.includes("tip") || input.includes("advice") || input.includes("what should i")) {
      const tips = travelData.tips;
      return `Here are my top travel tips: ${tips[Math.floor(Math.random() * tips.length)]}. Other important tips: Download offline maps, get travel insurance, learn basic local phrases, and keep digital copies of your documents. Any specific concerns?`;
    }

    // Group or solo travel
    if (input.includes("group") || input.includes("solo") || input.includes("friend") || input.includes("family")) {
      return "Great! Group travel is fun and more cost-effective. Consider destinations known for group tours like Thailand, Peru, or Spain. Solo travel offers more flexibility. Family travel needs child-friendly attractions and easy transportation. What's your travel style?";
    }

    // Weather/climate
    if (input.includes("weather") || input.includes("climate") || input.includes("rain") || input.includes("hot")) {
      return "Weather varies greatly by destination and season. Tropical regions are warm year-round but have monsoon seasons. Europe has cold winters and warm summers. Check historical weather data before booking. Pack accordingly and consider travel insurance for weather-related issues. Which destination are you considering?";
    }

    // Packing advice
    if (input.includes("pack") || input.includes("luggage") || input.includes("what to bring")) {
      return "Packing essentials: Comfortable walking shoes, weather-appropriate clothing, power adapter, phone charger, medications, travel documents, and a light jacket. Pack light - aim for carry-on only if possible. Rolling clothes saves space. What destination should I tailor packing advice for?";
    }

    // General travel planning
    if (input.includes("plan") || input.includes("prepare") || input.includes("organize")) {
      return "Here's my travel planning checklist: 1) Choose destination and dates, 2) Check visa requirements, 3) Book flights 2-3 months early, 4) Reserve accommodation, 5) Plan activities and tours, 6) Get travel insurance, 7) Inform your bank, 8) Create a packing list. What step are you at?";
    }

    // Popular destinations inquiry
    if (input.includes("recommend") || input.includes("suggest") || input.includes("where should")) {
      return "Popular destinations I recommend: Paris (romance), Tokyo (culture), Dubai (luxury), Bali (beaches), Bangkok (adventures), London (history), Sydney (nature). Each has unique experiences. What type of trip interests you - adventure, relaxation, culture, or food?";
    }

    // Travel insurance
    if (input.includes("insurance") || input.includes("protection") || input.includes("safe")) {
      return "Travel insurance is essential! It covers medical emergencies, trip cancellations, and lost luggage. I recommend World Nomads, SafetyWing, or AXA insurance. Cost is usually $1-5 per day. Don't skip it - unexpected events can be expensive. Are you looking for specific coverage?";
    }

    // Currency and money
    if (input.includes("money") || input.includes("currency") || input.includes("exchange")) {
      return "For currency exchange: Use ATMs for best rates (avoid airport exchanges). Notify your bank before traveling. Use a travel-friendly credit card with no foreign fees. Some destinations use apps like Wise for currency conversion. What's your destination - I can tell you about their currency!";
    }

    // Default response
    return "That's a great travel question! I can help you with: destination recommendations, flight and hotel bookings, activities and experiences, travel tips and advice, visa information, packing tips, budgeting, and more. What would you like to know about your next trip?";
  };

  const speakText = (text: string) => {
    speechSynthesis.cancel();
    setIsSpeaking(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onend = () => {
      setIsSpeaking(false);
      if (recognitionRef.current && isActive) {
        setTimeout(() => {
          recognitionRef.current.start();
        }, 1000);
      }
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
    };

    speechSynthesis.speak(utterance);
  };

  const toggleVoice = () => {
    if (isActive) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      speechSynthesis.cancel();
      setIsActive(false);
      setLog("Click to start planning your trip!");
      setIsListening(false);
      setIsSpeaking(false);
      return;
    }

    if (!recognitionRef.current) {
      setLog("❌ Speech Recognition not supported in your browser");
      return;
    }

    setIsActive(true);
    conversationRef.current = [];
    setConversationHistory([]);
    
    try {
      recognitionRef.current.start();
    } catch (err) {
      console.error("Error starting recognition:", err);
      setLog("❌ Failed to start listening");
      setIsActive(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {isActive && (
        <div className="absolute bottom-20 right-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 rounded-3xl shadow-2xl w-96 border border-slate-700 mb-2 backdrop-blur-lg max-h-96 flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-700">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isListening ? 'bg-green-500' : isSpeaking ? 'bg-yellow-500' : 'bg-blue-500'}`} />
            <Globe className="w-5 h-5 text-blue-400" />
            <p className="text-sm font-bold text-slate-100">Travel Assistant</p>
          </div>

          {/* Main log display */}
          <div className="mb-4 p-3 bg-slate-800/50 rounded-lg min-h-16 max-h-24 overflow-y-auto">
            <p className="text-sm text-slate-300 break-words leading-relaxed">
              {log}
            </p>
          </div>

          {/* Conversation history */}
          {conversationHistory.length > 0 && (
            <div className="mb-4 p-3 bg-slate-800/30 rounded-lg max-h-32 overflow-y-auto space-y-2 border border-slate-700/50">
              {conversationHistory.slice(-3).map((msg, idx) => (
                <div key={idx} className={`text-xs ${msg.role === 'user' ? 'text-blue-300 text-right' : 'text-green-300'}`}>
                  <span className="font-semibold">{msg.role === 'user' ? '🗣️ You' : '🤖 Bot'}:</span> {msg.text.substring(0, 100)}...
                </div>
              ))}
            </div>
          )}

          {/* Status indicators */}
          <div className="flex gap-3 text-xs text-slate-400">
            {isListening && (
              <div className="flex items-center gap-1">
                <Mic className="w-3 h-3 animate-bounce" />
                <span>Listening</span>
              </div>
            )}
            {isSpeaking && (
              <div className="flex items-center gap-1">
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span>Speaking</span>
              </div>
            )}
            {!isListening && !isSpeaking && (
              <span className="text-slate-500">Ready to help</span>
            )}
          </div>
        </div>
      )}
      
      {/* Main button */}
      <button
        onClick={toggleVoice}
        className={`w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 cursor-pointer font-bold text-lg
          ${isActive 
            ? "bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/60 border-red-400" 
            : "bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-blue-500/60 border-blue-400"
          }`}
      >
        {isActive ? <MicOff className="w-7 h-7 text-white" /> : <Mic className="w-7 h-7 text-white" />}
      </button>
    </div>
  );
}

// Export a stable name used by the app layout
export const VoiceAssistant = TravelVoiceAssistant;