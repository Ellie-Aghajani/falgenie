import { motion } from 'framer-motion';
import { Button } from '../ui/button';

export const Hero = () => {
   return (
      <section
         className="relative h-screen w-full bg-cover bg-center flex flex-col items-center justify-center text-center overflow-hidden"
         style={{
            backgroundImage: "url('/hero.jpg')",
         }}
      >
         {/* Gradient Overlay */}
         <div className="absolute inset-0 bg-gradient-to-b from-[rgba(10,0,20,0.5)] to-[rgba(0,0,0,0.8)]" />

         {/* Content */}
         <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="relative z-10 flex flex-col items-center text-white px-6"
         >
            <h1 className="font-serif text-5xl md:text-6xl text-amber-300 drop-shadow-[0_0_15px_rgba(255,200,100,0.3)]">
               Welcome to FalGenie
            </h1>

            <p className="mt-4 text-lg md:text-2xl max-w-2xl text-purple-100 leading-relaxed">
               Let tarot cards reveal your past, present, and future.
            </p>

            {/* CTA Button */}
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.8, duration: 0.8 }}
               className="mt-10"
            >
               <Button variant="falgenie" size="lg" asChild>
                  <a href="#deck">Begin My Reading</a>
               </Button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ delay: 1.5, duration: 1 }}
               className="absolute bottom-10 text-amber-300 text-2xl animate-bounce"
            >
               ↓
            </motion.div>
         </motion.div>
      </section>
   );
};
