import { useState, useRef, useEffect } from "react";
import { TypingAnimation } from "./typing-animation";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, X } from "lucide-react";
import { AUTHOR } from "@/lib/author";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: string;
  text: string;
  sender: "bot" | "user";
  typing?: boolean;
}

const INITIAL_MESSAGE = "Hi there! I'm Alertify Assistant. How can I help you with your website monitoring today?";

const RESPONSES = [
  {
    keywords: ["hello", "hi", "hey", "greet"],
    response: "Hello! I'm Alertify's assistant. How can I help you with your monitoring needs today?"
  },
  {
    keywords: ["monitor", "check", "track", "watch"],
    response: "Alertify provides comprehensive monitoring for your websites and applications. You can add sites from the Sites page and customize your monitoring settings!"
  },
  {
    keywords: ["alert", "notification", "warn", "inform"],
    response: "Our alert system notifies you instantly when issues are detected. You can customize alert thresholds and notification channels in your site settings."
  },
  {
    keywords: ["dashboard", "stats", "statistics", "metrics"],
    response: "The Dashboard gives you a real-time overview of all your monitored sites, including uptime, response time, and active alerts. Check it out!"
  },
  {
    keywords: ["team", "collaborate", "share", "member"],
    response: "Alertify supports team collaboration! You can add team members and assign specific roles for notification routing from the Team page."
  },
  {
    keywords: ["integration", "connect", "webhook", "api"],
    response: "We offer integrations with popular services like Slack, Discord, and more. Visit the Integrations page to set them up!"
  },
  {
    keywords: ["report", "analytics", "data", "insight"],
    response: "Generate detailed reports on the Reports page. You can analyze historical data and get AI-powered insights about your websites' performance."
  },
  {
    keywords: ["setting", "config", "preference", "customize"],
    response: "You can customize Alertify to suit your needs on the Settings page, including notification preferences, theme options, and account details."
  },
  {
    keywords: ["help", "support", "assist", "guide"],
    response: `For additional help, check our documentation or contact our support team. You can also reach out to ${AUTHOR.name} directly through social media!`
  },
  {
    keywords: ["thank", "thanks", "appreciate", "grateful"],
    response: "You're welcome! I'm happy to help. If you have any other questions, feel free to ask!"
  }
];

const DEFAULT_RESPONSE = "I don't have specific information about that topic. Can you try asking about monitoring, alerts, dashboards, or any of our features?";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setIsTyping(true);
      const initialMessage: Message = {
        id: Date.now().toString(),
        text: INITIAL_MESSAGE,
        sender: "bot",
        typing: true
      };
      setMessages([initialMessage]);
    }
  }, [messages.length]);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTypingComplete = () => {
    setMessages(current => 
      current.map(message => 
        message.typing ? { ...message, typing: false } : message
      )
    );
    setIsTyping(false);
  };

  const getResponse = (userMessage: string) => {
    const lowercaseMessage = userMessage.toLowerCase();
    
    // Find matching response based on keywords
    for (const item of RESPONSES) {
      if (item.keywords.some(keyword => lowercaseMessage.includes(keyword))) {
        return item.response;
      }
    }
    
    return DEFAULT_RESPONSE;
  };

  const handleSend = () => {
    if (!inputValue.trim() || isTyping) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user"
    };
    
    setMessages(current => [...current, userMessage]);
    setInputValue("");
    
    // Get bot response
    setTimeout(() => {
      setIsTyping(true);
      const botResponse = getResponse(userMessage.text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        typing: true
      };
      setMessages(current => [...current, botMessage]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button 
            size="icon" 
            className="rounded-full shadow-lg h-12 w-12 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700"
            onClick={() => setIsOpen(true)}
          >
            <MessageSquare size={24} />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-80 sm:w-96 p-0 mr-4 mb-4 max-h-[500px] rounded-xl shadow-lg"
          align="end"
        >
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
            >
              <div className="flex items-center justify-between p-4 border-b bg-primary/5">
                <h3 className="font-semibold">Alertify Assistant</h3>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8"
                >
                  <X size={18} />
                </Button>
              </div>
              <ScrollArea className="h-[350px] p-4">
                <div className="flex flex-col space-y-4">
                  {messages.map((message) => (
                    <div 
                      key={message.id}
                      className={`flex ${message.sender === 'bot' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div 
                        className={`rounded-lg px-4 py-2 max-w-[85%] ${
                          message.sender === 'bot' 
                            ? 'bg-muted text-foreground' 
                            : 'bg-primary text-primary-foreground'
                        }`}
                      >
                        {message.typing ? (
                          <TypingAnimation 
                            text={message.text} 
                            onComplete={handleTypingComplete}
                          />
                        ) : (
                          message.text
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isTyping}
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSend}
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </PopoverContent>
      </Popover>
    </div>
  );
}