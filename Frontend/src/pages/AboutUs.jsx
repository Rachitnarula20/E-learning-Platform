import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-600 mb-4">About Us</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We are an innovative e-learning platform dedicated to providing high-quality education 
            to learners worldwide. Our mission is to empower individuals with the knowledge and skills they need 
            to succeed in their careers and personal growth.
          </p>
        </section>

        {/* Our Mission & Vision */}
        <section className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Our Mission</h2>
            <p className="text-gray-700">
              To make learning accessible, engaging, and effective by leveraging technology and 
              expert-driven content. We believe that education should be available to everyone, 
              regardless of location or background.
            </p>
          </div>

          <div className="bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-2xl font-semibold text-blue-600 mb-2">Our Vision</h2>
            <p className="text-gray-700">
              To become the leading e-learning platform by continuously innovating and providing 
              high-quality courses, fostering a global community of learners, and making education 
              more flexible and personalized.
            </p>
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard title="Expert Instructors" description="Learn from industry professionals and experienced educators." />
            <FeatureCard title="Flexible Learning" description="Access courses anytime, anywhere, at your own pace." />
            <FeatureCard title="Recognized Certifications" description="Earn industry-recognized certificates upon completion." />
          </div>
        </section>

        {/* Our Team */}
        <section className="text-center justify-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-6">Meet Our Team</h2>
          <div className="flex justify-center">
            <TeamMember name="Rachit Narula" role="Founder & CEO" image="https://randomuser.me/api/portraits/men/1.jpg" />
            
          </div>
        </section>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, description }) => (
  <div className="bg-white shadow-md p-6 rounded-lg text-center">
    <h3 className="text-xl font-semibold text-blue-600 mb-2">{title}</h3>
    <p className="text-gray-700">{description}</p>
  </div>
);

const TeamMember = ({ name, role, image }) => (
  <div className="bg-white shadow-md p-8 rounded-lg text-center w-64 md:w-80 mx-auto ">
    <img src={image} alt={name} className="w-24 h-24 mx-auto rounded-full mb-4" />
    <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
    <p className="text-gray-600">{role}</p>
  </div>
);

export default AboutUs;
