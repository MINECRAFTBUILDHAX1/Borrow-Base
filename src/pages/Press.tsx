
const Press = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Press & Media</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-6">
            Find the latest news, press releases, and media resources about BorrowBase.
          </p>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Press Contact</h2>
            <p className="mb-4">
              For press inquiries, please contact:
            </p>
            <p className="mb-4">
              <strong>Email:</strong> info@borrowbase.co.uk<br />
              
            </p>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Press Releases</h2>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <p className="text-sm text-gray-500">May 1, 2023</p>
                <h3 className="text-xl font-medium">BorrowBase Launches in the UK, Revolutionizing the Way People Rent Items</h3>
                <p className="mt-1 text-gray-700">The peer-to-peer rental platform connects lenders and borrowers to make item rentals easy, affordable, and accessible.</p>
              </div>
            </div>
          </section>
          
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Brand Assets</h2>
            <p className="mb-4">
              Download our logo and brand assets for media use.
            </p>
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-brand-purple text-white rounded hover:bg-brand-purple/90">
                Download Logo Pack
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                Brand Guidelines
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Press;
