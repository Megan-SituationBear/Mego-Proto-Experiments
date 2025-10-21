# Adding Your Lottie Animation to BuildingModal

## 📦 What's Already Done

✅ **Lottie React** installed (`npm install lottie-react`)  
✅ **BuildingModal** component created with placeholder animation  
✅ **Complete onboarding flow** wired up:
- SSO sign-in → Terms → Questions → Name → Building → Home

## 🎨 How to Add Your Lottie Animation

### Step 1: Add Your Animation File

1. Export your Lottie animation as a `.json` file
2. Place it in the project, for example:
   ```
   src/assets/animations/building-cubes.json
   ```

### Step 2: Update BuildingModal.tsx

Open `src/components/ui/BuildingModal.tsx` and make these changes:

```typescript
// BEFORE (current placeholder):
import { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
// Import Lottie when you add the animation file
// import Lottie from 'lottie-react';
// import animationData from './path-to-your-lottie-animation.json';

// AFTER (with your animation):
import { useEffect, useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react';
import Lottie from 'lottie-react';
import animationData from '../../assets/animations/building-cubes.json';
```

Then replace the placeholder animation div:

```typescript
// BEFORE (current placeholder):
{/* Placeholder: Animated Cubes (CSS) */}
<div className="w-32 h-32 flex items-center justify-center">
  <div className="relative">
    <div className="absolute animate-ping w-16 h-16 bg-blue-400 rounded-lg opacity-20"></div>
    <div className="relative w-16 h-16 bg-blue-600 rounded-lg animate-pulse"></div>
  </div>
</div>

// AFTER (with Lottie):
<Lottie 
  animationData={animationData}
  loop={true}
  className="w-32 h-32"
/>
```

### Step 3: Customize (Optional)

You can customize the Lottie animation with these options:

```typescript
<Lottie 
  animationData={animationData}
  loop={true}
  autoplay={true}
  style={{ width: 128, height: 128 }}
  // Speed: 1 is normal, 2 is 2x speed, 0.5 is half speed
  speed={1}
  // Additional options:
  // - initialSegment={[0, 50]} // Play only frames 0-50
  // - onComplete={() => console.log('Animation complete')}
/>
```

## 🔄 Complete Onboarding Flow

The sign-in flow now works like this:

1. **User clicks SSO button** (Salesforce, Google, Github, SAML)
2. **SSO Terms screen** - User agrees to terms
3. **Questions Modal** - User selects goals and expertise level
4. **Name Collection** - "What should we call you?"
5. **Building Animation** - 3 seconds with animated text:
   - "Matching templates..."
   - "Configuring agents..."
   - "Setting up your workspace..."
6. **Home Page** - User is logged in and ready to go!

## 📝 Current Animation

Right now the BuildingModal uses a CSS-based placeholder with:
- Pulsing blue cube
- Ping effect
- Text animations
- Progress dots

This works fine as a fallback, but will look much better with your custom Lottie animation!

## 🎯 Test It Out

To test the complete flow:

1. Run `npm run dev`
2. Click "Sign Up" or "Login" on landing page
3. Choose any SSO provider
4. Click "I Agree - Continue with SSO"
5. Complete the questions
6. Enter your name
7. Watch the building animation
8. You'll be redirected to the home page

## 🐛 Troubleshooting

**Animation file won't import?**
- Make sure the file is valid JSON
- Check the file path is correct
- Try importing it differently: `import * as animationData from '...'`

**Animation is too big/small?**
- Adjust the `className` or `style` prop width/height
- Use responsive sizes: `className="w-24 h-24 sm:w-32 sm:h-32"`

**Animation won't loop?**
- Check `loop={true}` is set
- Some animations have `loop: false` in their JSON - you can override this

Need help? The placeholder animation works great as a backup! 🚀
