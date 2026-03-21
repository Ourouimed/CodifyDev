import { Star, Zap, Briefcase, Puzzle, Trophy, MessageSquare, Bell } from "lucide-react"
import { Badge } from "../ui/Badge"
import { FeatureCard } from "../cards/FeatureCard"
import { features } from "@/lib/features"

const Features = () => {
  return (
    <section id="features" className="relative py-4 px-6 md:px-10 min-h-screen overflow-hidden ">

      <div className="flex flex-col items-center text-center gap-3 mb-8">
        <Badge text="Features" icon={Star} />
        <h2 className="max-w-2xl text-xl md:text-3xl font-black tracking-tight leading-tight">
          Connect with{" "}
          <span className="text-primary">
            developers & freelancers
          </span>{" "}
          and build your social network
        </h2>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <FeatureCard key={feature.title} feature={feature} />
        ))}
      </div>
    </section>
  )
}

export default Features