import { useState } from 'react';
import IntroPage from './pages/IntroPage';
import HomePage from './pages/HomePage';
import OnboardingFlow from './pages/OnboardingFlow';
import TemplatePage from './pages/TemplatePage';
import PricingPage from './pages/PricingPage';
import ProjectPage from './pages/ProjectPage';
import './App.css';

/**
 * Main App Component - Acts as router and manages global navigation state
 * 
 * Pages manage their own internal state (UI, forms, etc.)
 * App manages cross-page state (auth, navigation, selected items)
 */
function App() {
  // Navigation state
  const [currentView, setCurrentView] = useState<'intro' | 'home' | 'onboarding' | 'template' | 'pricing' | 'project'>('intro');
  
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // User data (could be moved to context in future)
  const [userName] = useState('Jill');
  const [hasProjects, setHasProjects] = useState(false);
  const [favoritedTemplates, setFavoritedTemplates] = useState<any[]>([]);
  const [activeProjects, setActiveProjects] = useState<any[]>([]);
  
  // Selected item state
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [projectTitle, setProjectTitle] = useState('Landing Page Redesign');

  // ============ Navigation Handlers ============
  
  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleSignUp = () => {
    setCurrentView('onboarding');
  };

  const handleOnboardingComplete = () => {
    setIsLoggedIn(true);
    setCurrentView('home');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setHasProjects(false);
    setFavoritedTemplates([]);
    setActiveProjects([]);
    setCurrentView('intro');
  };

  const handleBackToIntro = () => {
    setCurrentView('intro');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
  };

  // ============ Template & Project Handlers ============
  
  const handleViewTemplate = (template: any) => {
    setSelectedTemplate(template);
    if (isLoggedIn) {
      // Logged in users: go directly to project page
      setProjectTitle(template.title);
      setCurrentView('project');
    } else {
      // Logged out users: show template preview with CTA
      setCurrentView('template');
    }
  };

  const handleUseTemplate = () => {
    if (isLoggedIn) {
      // Add to active projects
      const newProject = {
        ...selectedTemplate,
        id: Date.now().toString(),
        startedAt: new Date(),
      };
      setActiveProjects(prev => [...prev, newProject]);
      setHasProjects(true);
      setProjectTitle(selectedTemplate?.title || 'New Project');
      setCurrentView('project');
    } else {
      // Show pricing for logged out users
      setCurrentView('pricing');
    }
  };

  const handleCreateProject = (title?: string) => {
    const newProject = {
      title: title || 'New Project',
      category: 'New Project',
      savedHours: 0,
      id: Date.now().toString(),
      startedAt: new Date(),
    };
    setActiveProjects(prev => [...prev, newProject]);
    setHasProjects(true);
    setProjectTitle(newProject.title);
    setSelectedTemplate(newProject);
    setCurrentView('project');
  };


  const handleSelectPlan = (plan: string) => {
    if (plan === 'Free') {
      handleLogin();
    } else {
      setCurrentView('onboarding');
    }
  };

  // ============ Render Views ============

  if (currentView === 'intro') {
    return (
      <IntroPage 
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onViewTemplate={handleViewTemplate}
        onViewPricing={() => setCurrentView('pricing')}
      />
    );
  }

  if (currentView === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  if (currentView === 'template') {
    return (
      <TemplatePage
        template={selectedTemplate}
        onBack={handleBackToIntro}
        onUseTemplate={handleUseTemplate}
      />
    );
  }

  if (currentView === 'pricing') {
    return (
      <PricingPage
        onBack={handleBackToIntro}
        onSelectPlan={handleSelectPlan}
      />
    );
  }

  if (currentView === 'home') {
    return (
      <HomePage 
        userName={userName}
        hasProjects={hasProjects}
        favoritedTemplates={favoritedTemplates}
        activeProjects={activeProjects}
        onCreateProject={handleCreateProject}
        onLogout={handleLogout}
        onViewTemplate={handleViewTemplate}
      />
    );
  }

  if (currentView === 'project') {
    return (
      <ProjectPage
        projectTitle={projectTitle}
        projectDate={new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        onBack={handleBackToHome}
      />
    );
  }

  // Fallback
  return null;
}

export default App;
