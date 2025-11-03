# AIInput Component - Installation Guide

The AIInput component comes in **3 simple variants** that you can drop into any page.

---

## 🔵 Variant 1: AI Input Logged Out

**Use this for:** Landing pages, marketing pages, or any logged-out experience

```tsx
import { AIInput, ConversationMessage } from './components/ui';

function MyLandingPage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMsg: ConversationMessage = {
      id: Date.now().toString(),
      content: text,
      isUser: true,
      timestamp: new Date()
    };
    setMessages([...messages, userMsg]);

    // Show typing and add AI response
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg: ConversationMessage = {
        id: (Date.now() + 1).toString(),
        content: "Your AI response here",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <AIInput
      placeholder="Try: @Copado what do you do?"
      onSendMessage={handleSendMessage}
      messages={messages}
      showTypingIndicator={isTyping}
      isLoggedIn={false}
      pageContext="home"
      hasConversation={messages.length > 0}
    />
  );
}
```

### States:
- **Default:** 48px height, gray border, subtle shadow
- **Focused:** 120px height, blue border with ring glow
- **With Conversation:** Conversation appears above input

---

## 🟢 Variant 2: AI Input Home - Logged In

**Use this for:** Dashboard home page, logged-in welcome screen

```tsx
import { AIInput, ConversationMessage } from './components/ui';

function MyHomePage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    // Your message handling logic
  };

  return (
    <AIInput
      placeholder="What would you like to work on today?"
      onSendMessage={handleSendMessage}
      messages={messages}
      showTypingIndicator={isTyping}
      isLoggedIn={true}
      pageContext="home"
      hasConversation={messages.length > 0}
    />
  );
}
```

### States:
- **Default:** 48px height, blue-200 border, medium shadow
- **Focused:** 100px height, blue-400 border, ring glow
- **With Conversation:** 140px height, conversation above

---

## 🟡 Variant 3: AI Input Context Page - Logged In

**Use this for:** Workspace pages, project pages, chat panels

```tsx
import { AIInput, ConversationMessage } from './components/ui';

function MyWorkspacePage() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (text: string) => {
    // Your message handling logic
  };

  return (
    <AIInput
      placeholder="Continue the conversation..."
      onSendMessage={handleSendMessage}
      messages={messages}
      showTypingIndicator={isTyping}
      isLoggedIn={true}
      pageContext="workspace"
      hasConversation={messages.length > 0}
    />
  );
}
```

### States:
- **Default:** 48px height, slate-300 border, subtle shadow
- **Focused:** 80px height, blue-400 border, ring glow
- **With Conversation:** 120px height, conversation above

---

## 📦 Message Format

```tsx
interface ConversationMessage {
  id: string;           // Unique identifier
  content: string;      // The message text
  isUser: boolean;      // true for user messages, false for AI
  timestamp?: Date;     // Optional timestamp
}
```

---

## ✨ Additional Features (Included Automatically)

All variants include:
- ✅ **Context Menu** - Hover on the + button to add images, docs, integrations
- ✅ **Settings Modal** - Click settings icon for configuration
- ✅ **Upload Modal** - Add images and documents
- ✅ **Typing Indicator** - Animated dots when AI is responding
- ✅ **Auto-scroll** - Messages scroll to bottom automatically
- ✅ **Smooth Animations** - All state transitions are smooth

---

## 🎨 Quick Reference

| Variant | isLoggedIn | pageContext | Best For |
|---------|-----------|-------------|----------|
| **Logged Out** | `false` | `"home"` | Landing pages |
| **Home - Logged In** | `true` | `"home"` | Dashboard home |
| **Context Page** | `true` | `"workspace"` | Project/workspace pages |

---

## 💡 Pro Tips

1. **Set `hasConversation={messages.length > 0}`** - This ensures the component knows when to show conversation styling
2. **Use `showTypingIndicator`** - Shows animated dots while waiting for AI response
3. **The component handles its own layout** - Conversation appears above input automatically
4. **All modals are built-in** - No need to manage additional components

---

## 🚀 That's It!

Pick one of the 3 variants, copy the code, and you're done. The component handles everything else automatically.

