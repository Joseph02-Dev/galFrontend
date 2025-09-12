import StoriesSection from "../composants/StoriesSection";
import PostsSection from "../composants/PostsSection";

export default function Home() {
  return (
    <div className="p-2 xs:p-3 sm:p-6" data-theme="night">
      
      {/* Section des stories */}
      <StoriesSection />
      
      {/* Section des publications */}
      <PostsSection />
    </div>
  );
}
