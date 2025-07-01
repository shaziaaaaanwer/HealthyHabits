import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Users,
  Award,
} from "lucide-react";
import LifestyleTrackCard from "../components/LifestyleTrackCard";
import { lifestyleTracks } from "../data/lifestyleTracks";
import { useAuth } from "../contexts/AuthContext";

const Home: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 py-20 lg:py-32">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-bounce" />
          <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Healthy Habits
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tracker
            </span>
          </h1>

          <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your lifestyle, one habit at a time. Build lasting habits
            that improve your health, boost your energy, and enhance your
            well-being.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to={user ? "/dashboard" : "/auth"}
              className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl flex items-center space-x-2"
            >
              <span>{user ? "Go to Dashboard" : "Start Your Journey"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            {!user && (
              <Link
                to="/auth"
                className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-full font-semibold text-lg hover:bg-purple-600 hover:text-white transition-all"
              >
                Learn More
              </Link>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { icon: CheckCircle, label: "Habits Tracked", value: "10K+" },
              { icon: TrendingUp, label: "Success Rate", value: "85%" },
              { icon: Users, label: "Happy Users", value: "2K+" },
              { icon: Award, label: "Badges Earned", value: "500+" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              What Our App Does
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We make it simple to build and maintain healthy habits through
              science-backed tracking, personalized insights, and motivational
              features.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Track Daily Progress",
                description:
                  "Log your habits effortlessly and watch your streaks grow day by day.",
                icon: CheckCircle,
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Visualize Your Journey",
                description:
                  "Beautiful charts and analytics show your progress over time.",
                icon: TrendingUp,
                color: "from-blue-500 to-indigo-500",
              },
              {
                title: "Earn Achievements",
                description:
                  "Unlock badges and rewards as you build consistent habits.",
                icon: Award,
                color: "from-purple-500 to-pink-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-8 rounded-2xl hover:shadow-lg transition-all"
              >
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6`}
                >
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lifestyle Tracks Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Choose Your Lifestyle Track
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Each track is designed with specific habits that work together to
              transform different aspects of your life. Start with one or
              combine multiple tracks.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {lifestyleTracks.map((track) => (
              <LifestyleTrackCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Life?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people who are already building better habits and
            living healthier, happier lives. Your journey starts today.
          </p>

          <Link
            to={user ? "/dashboard" : "/auth"}
            className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg"
          >
            <span>{user ? "Continue Your Journey" : "Start Your Journey"}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
