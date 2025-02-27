import React from "react";
import { Link } from "react-router-dom";
import { BookOpen, Users, Award, Zap } from "lucide-react";
import onlineStudent from "../../src/assets/onlinestudents.jpg";
import FeatureCard from "../components/cards/FeatureCard";
import CourseCard from "../components/cards/CourseCard";
import TestimonialCarousel from "../pages/TestimonialCarousel.jsx";
import webdev from "../../src/assets/Web Development.png"
import datascience from "../../src/assets/Data Science.png"
import digital from "../../src/assets/Digital Marketing.jpg"

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Unlock Your Potential with E-Learning
                </h1>
                <p className="text-xl mb-6">
                  Discover a world of knowledge at your fingertips. Start your learning journey today!
                </p>
                <Link
                  to="/courses"
                  className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-200"
                >
                  Explore Courses
                </Link>
              </div>
              <div className="md:w-1/2 flex justify-around">
                <img
                  src={onlineStudent}
                  alt="Students learning online"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<BookOpen className="h-10 w-10 text-blue-600" />}
                title="Diverse Courses"
                description="Access a wide range of courses across various disciplines."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-blue-600" />}
                title="Expert Instructors"
                description="Learn from industry professionals and experienced educators."
              />
              <FeatureCard
                icon={<Zap className="h-10 w-10 text-blue-600" />}
                title="Interactive Learning"
                description="Engage with dynamic content and hands-on projects."
              />
              <FeatureCard
                icon={<Award className="h-10 w-10 text-blue-600" />}
                title="Certifications"
                description="Earn recognized certificates upon course completion."
              />
            </div>
          </div>
        </section>

        {/* Popular Courses Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Courses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <CourseCard
                title="Web Development Bootcamp"
                description="Master HTML, CSS, and JavaScript to build modern websites."
                image={webdev}
              />
              <CourseCard
                title="Data Science Fundamentals"
                description="Learn essential skills for analyzing and interpreting complex data."
                image={datascience}
              />
              <CourseCard
                title="Digital Marketing Mastery"
                description="Develop strategies to grow your business in the digital age."
                image={digital}
              />
            </div>
            <div className="text-center mt-12">
              <Link
                to="/courses"
                className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100"
              >
                View All Courses
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <TestimonialCarousel />

        {/* CTA Section */}
        <section className="bg-blue-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl mb-8">Join thousands of students already learning on our platform.</p>
            <Link
              to="/register"
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-200"
            >
              Sign Up Now
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
