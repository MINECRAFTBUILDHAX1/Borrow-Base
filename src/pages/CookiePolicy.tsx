
const CookiePolicy = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Cookie Policy</h1>
        
        <div className="prose max-w-none">
          <p className="text-gray-500 mb-6">Last updated: May 6, 2023</p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What Are Cookies</h2>
            <p>
              Cookies are small pieces of text sent to your web browser by a website you visit. A cookie file is stored in your web browser and allows the service or a third-party to recognize you and make your next visit easier and more useful to you. Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device when you go offline, while session cookies are deleted as soon as you close your web browser.
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">How We Use Cookies</h2>
            <p className="mb-4">
              When you use and access our service, we may place a number of cookie files in your web browser. We use cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-2">
                <strong>Essential cookies:</strong> To enable core functionality such as security, network management, and authentication. You may not opt-out of these cookies.
              </li>
              <li className="mb-2">
                <strong>Functionality cookies:</strong> To remember your preferences and various settings.
              </li>
              <li className="mb-2">
                <strong>Analytical cookies:</strong> To collect information about how you use our website, which pages you visit and if you experience any errors.
              </li>
              <li className="mb-2">
                <strong>Targeting cookies:</strong> To help us deliver relevant ads and content to you based on your interests and browsing behavior.
              </li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-medium mb-2">Session Cookies</h3>
                <p>
                  These cookies are temporary and are deleted when you close your browser. They are used to keep you logged in as you navigate through our site.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Persistent Cookies</h3>
                <p>
                  These cookies remain on your device until they expire or you delete them. They are used to remember your preferences and settings for future visits.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Third-Party Cookies</h3>
                <p>
                  We use cookies from third-party services such as Google Analytics to help us understand how you use our website and to improve your experience.
                </p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Managing Your Cookies</h2>
            <p className="mb-4">
              Most web browsers allow you to control cookies through their settings. You can:
            </p>
            <ul className="list-disc pl-6">
              <li className="mb-2">Delete all cookies from your browser</li>
              <li className="mb-2">Block cookies from being set</li>
              <li className="mb-2">Allow first-party cookies but block third-party cookies</li>
              <li className="mb-2">Configure cookie settings for specific websites</li>
            </ul>
            <p>
              Please note that if you choose to block or delete cookies, you may not be able to access certain areas or features of our website, and some functionality may be affected.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to This Cookie Policy</h2>
            <p>
              We may update our Cookie Policy from time to time. We will notify you of any changes by posting the new Cookie Policy on this page and updating the "Last updated" date at the top.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
