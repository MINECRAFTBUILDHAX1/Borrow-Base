
import { Link } from "react-router-dom";

const AboutUs = () => {
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-4">
            BorrowBase is a peer-to-peer rental platform that connects people who have items to lend with those who need to borrow them.
          </p>
          
          <p className="mb-4">
            Founded in 2023, our mission is to create a more sustainable world by making borrowing easy, affordable, and accessible to everyone. We believe in the power of the sharing economy to reduce waste, save money, and bring communities together.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Vision</h2>
          <p className="mb-4">
            We envision a world where borrowing is the first choice for items you don't need to own. By encouraging shared ownership, we help reduce environmental impact while enabling people to access the items they need without the burden of ownership.
          </p>
          
          <h2 className="text-2xl font-semibold mt-8 mb-4">Our Values</h2>
          <ul className="list-disc pl-6 mb-6">
            <li className="mb-2"><strong>Trust and Safety</strong> — We prioritize creating a secure platform where users can connect with confidence.</li>
            <li className="mb-2"><strong>Sustainability</strong> — We're committed to reducing waste and promoting a circular economy.</li>
            <li className="mb-2"><strong>Community</strong> — We believe in the power of sharing to strengthen local connections.</li>
            <li className="mb-2"><strong>Accessibility</strong> — We strive to make borrowing accessible and affordable for everyone.</li>
          </ul>
          
          <div className="mt-8">
            <Link to="/how-it-works" className="text-brand-purple hover:underline font-medium">
              Learn how BorrowBase works →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
