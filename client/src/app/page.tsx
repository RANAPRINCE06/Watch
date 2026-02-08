import HeroSection from '@/components/home/HeroSection';
import FeaturedWatches from '@/components/home/FeaturedWatches';
import CategorySection from '@/components/home/CategorySection';
import BrandStory from '@/components/home/BrandStory';
import Testimonials from '@/components/home/Testimonials';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedWatches />
      <CategorySection />
      <BrandStory />
      <Testimonials />
    </>
  );
}
