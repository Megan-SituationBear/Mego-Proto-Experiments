import CardLibraryPublic from '../components/ui/CardLibraryPublic';
import '../styles/copado-ai-theme.css';

const CardLibraryDemo = () => {
  return (
    <div className="min-h-screen bg-page-gradient py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-3">Card Library - Public</h1>
        <p className="text-slate-600 mb-3">Visual reference for card component states</p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-12">
          <p className="text-blue-800 text-sm font-medium">
            💡 <strong>Tip:</strong> Hover over cards to see the hover state
          </p>
        </div>

        {/* STATE 1: DEFAULT */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-slate-200">
            State 1: Default
          </h2>
          <div className="mb-4 text-sm text-slate-600">
            Card at rest, no interaction
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CardLibraryPublic
              category="Deployment"
              title="Strategy title here about using real data"
              description="Identify security vulnerabilities and provide actionable recommendations for improvement."
            />
            <CardLibraryPublic
              category="Testing"
              title="Automated Test Suite Generator"
              description="Generate comprehensive test suites for your Salesforce code automatically."
            />
            <CardLibraryPublic
              category="Security"
              title="Security Audit Automation"
              description="Automatically scan and identify security vulnerabilities in your org."
            />
          </div>
        </section>

        {/* STATE 2: HOVER */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-2 border-slate-200">
            State 2: Hover
          </h2>
          <div className="mb-4 text-sm text-slate-600">
            Card with hover effect (try hovering on the cards below)
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card-library-public hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer">
              <div className="card-library-content">
                <div className="card-library-row-header">
                  <div className="card-library-left">
                    <div className="card-library-pill">
                      <div className="card-library-pill-text">Deployment</div>
                    </div>
                  </div>
                </div>
                <div className="card-library-content">
                  <div className="card-library-title">
                    Strategy title here about using real data
                  </div>
                </div>
              </div>
              <div className="card-library-description">
                Identify security vulnerabilities and provide actionable recommendations for improvement.
              </div>
            </div>

            <div className="card-library-public hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer">
              <div className="card-library-content">
                <div className="card-library-row-header">
                  <div className="card-library-left">
                    <div className="card-library-pill">
                      <div className="card-library-pill-text">Testing</div>
                    </div>
                  </div>
                </div>
                <div className="card-library-content">
                  <div className="card-library-title">
                    Automated Test Suite Generator
                  </div>
                </div>
              </div>
              <div className="card-library-description">
                Generate comprehensive test suites for your Salesforce code automatically.
              </div>
            </div>

            <div className="card-library-public hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer">
              <div className="card-library-content">
                <div className="card-library-row-header">
                  <div className="card-library-left">
                    <div className="card-library-pill">
                      <div className="card-library-pill-text">Security</div>
                    </div>
                  </div>
                </div>
                <div className="card-library-content">
                  <div className="card-library-title">
                    Security Audit Automation
                  </div>
                </div>
              </div>
              <div className="card-library-description">
                Automatically scan and identify security vulnerabilities in your org.
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CardLibraryDemo;

