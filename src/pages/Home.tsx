import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Palette, ArrowRight, CheckCircle2, Users, Image, Layers } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-neutral-50 to-neutral-100 overflow-hidden">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Transform Your <span className="text-primary-600">Interior Design</span> Vision Into Reality
              </h1>
              <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto lg:mx-0">
                Create stunning moodboards for your interior design projects with our intuitive drag-and-drop editor. Visualize your ideas and bring them to life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to={isAuthenticated ? "/editor/new" : "/register"} 
                  className="btn btn-primary px-8 py-3"
                >
                  Get Started Free
                </Link>
                <Link to="/inspiration" className="btn btn-outline px-8 py-3 flex items-center justify-center">
                  See Examples
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-neutral-200 aspect-[4/3]">
                <img 
                  src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1200" 
                  alt="Interior Design Moodboard" 
                  className="w-full h-full object-cover"
                />
                
                {/* Floating UI elements */}
                <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3 backdrop-blur-sm bg-white/90 border border-neutral-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-error-500"></div>
                    <div className="w-3 h-3 rounded-full bg-warning-500"></div>
                    <div className="w-3 h-3 rounded-full bg-success-500"></div>
                  </div>
                </div>
                
                <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 backdrop-blur-sm bg-white/90 border border-neutral-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 rounded-full bg-secondary-500"></div>
                    <div className="w-6 h-6 rounded-full bg-primary-600"></div>
                    <div className="w-6 h-6 rounded-full bg-accent-500"></div>
                  </div>
                </div>
                
                <div className="absolute top-1/4 -right-6 bg-white rounded-lg shadow-lg p-2 w-32 border border-neutral-200 animate-float">
                  <img 
                    src="https://images.pexels.com/photos/2762247/pexels-photo-2762247.jpeg?auto=compress&cs=tinysrgb&w=150" 
                    alt="Furniture Item" 
                    className="w-full h-24 object-cover rounded"
                  />
                </div>
                
                <div className="absolute bottom-1/3 -left-6 bg-white rounded-lg shadow-lg p-2 w-32 border border-neutral-200 animate-float" style={{ animationDelay: '2s' }}>
                  <img 
                    src="https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=150" 
                    alt="Furniture Item" 
                    className="w-full h-24 object-cover rounded"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/4 left-12 w-64 h-64 bg-primary-200 rounded-full filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-12 w-64 h-64 bg-secondary-200 rounded-full filter blur-3xl opacity-30"></div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Powerful Features for Interior Designers</h2>
            <p className="text-lg text-neutral-600">
              Everything you need to create beautiful, professional interior design moodboards in minutes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-6">
                <Layers className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Room Generator</h3>
              <p className="text-neutral-600">
                Input your room dimensions and preferences, and let our AI generate the perfect layout for your space.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-6">
                <Image className="w-6 h-6 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Rich Item Library</h3>
              <p className="text-neutral-600">
                Access thousands of furniture pieces, textures, and decor items to use in your designs.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mb-6">
                <Palette className="w-6 h-6 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Auto Design Suggestions</h3>
              <p className="text-neutral-600">
                Get intelligent design suggestions based on your room measurements and style preferences.
              </p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Share & Collaborate</h3>
              <p className="text-neutral-600">
                Share your moodboards with clients and collaborate with team members in real-time.
              </p>
            </motion.div>
            
            {/* Feature 5 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-warning-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-warning-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Room Templates</h3>
              <p className="text-neutral-600">
                Start with pre-designed room templates to speed up your design process.
              </p>
            </motion.div>
            
            {/* Feature 6 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-neutral-50 rounded-xl p-6 border border-neutral-200 hover:shadow-md transition-all duration-300"
            >
              <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center mb-6">
                <Image className="w-6 h-6 text-error-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Inspiration Gallery</h3>
              <p className="text-neutral-600">
                Browse through our curated gallery of interior design inspiration to spark your creativity.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Bring Your Design Ideas to Life?</h2>
            <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
              Join thousands of interior designers who use MoodPalette to create stunning moodboards and impress their clients.
            </p>
            <Link 
              to={isAuthenticated ? "/editor/new" : "/register"}
              className="btn btn-primary px-8 py-3 text-lg"
            >
              Get Started Free
            </Link>
            <p className="mt-4 text-neutral-500">No credit card required. Free 14-day trial.</p>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What Our Users Say</h2>
            <p className="text-lg text-neutral-600">
              Don't just take our word for it. See what professional designers are saying about MoodPalette.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-neutral-50 rounded-xl p-6 border border-neutral-200"
            >
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100" 
                  alt="Sarah Johnson" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-neutral-500">Interior Designer</p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                "The auto-generate feature is a game-changer! I input my room dimensions, and it creates the perfect layout instantly."
              </p>
              <div className="flex text-warning-500">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </motion.div>
            
            {/* Testimonial 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-neutral-50 rounded-xl p-6 border border-neutral-200"
            >
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100" 
                  alt="Michael Chen" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Michael Chen</h4>
                  <p className="text-sm text-neutral-500">Studio Owner</p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                "The smart room generator saves me hours of work. It's like having an AI design assistant at my fingertips."
              </p>
              <div className="flex text-warning-500">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </motion.div>
            
            {/* Testimonial 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-neutral-50 rounded-xl p-6 border border-neutral-200"
            >
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100" 
                  alt="Emma Rodriguez" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Emma Rodriguez</h4>
                  <p className="text-sm text-neutral-500">Freelance Designer</p>
                </div>
              </div>
              <p className="text-neutral-600 mb-4">
                "The automatic design suggestions are spot-on! It understands my style and makes perfect recommendations."
              </p>
              <div className="flex text-warning-500">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;