
const tagStyles = {
  purple:
    "bg-violet-500/10 text-violet-700 dark:text-violet-300 dark:bg-violet-500/10",
  yellow:
    "bg-amber-400/10 text-amber-700 dark:text-amber-300 dark:bg-amber-400/10",
  teal:
    "bg-teal-400/10 text-teal-700 dark:text-teal-300 dark:bg-teal-400/10",
  pink:
    "bg-pink-500/10 text-pink-700 dark:text-pink-300 dark:bg-pink-500/10",
  green:
    "bg-green-400/10 text-green-700 dark:text-green-300 dark:bg-green-400/10",
  cyan:
    "bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 dark:bg-cyan-500/10",
}

const iconStyles = {
  purple:
    "bg-violet-500/10 text-violet-600 dark:text-violet-400 dark:bg-violet-500/10",
  yellow:
    "bg-amber-400/10 text-amber-600 dark:text-amber-400 dark:bg-amber-400/10",
  teal:
    "bg-teal-400/10 text-teal-600 dark:text-teal-400 dark:bg-teal-400/10",
  pink:
    "bg-pink-500/10 text-pink-600 dark:text-pink-400 dark:bg-pink-500/10",
  green:
    "bg-green-400/10 text-green-600 dark:text-green-400 dark:bg-green-400/10",
  cyan:
    "bg-cyan-500/10 text-cyan-600 dark:text-cyan-300 dark:bg-cyan-500/10",
}
export const FeatureCard = ({ feature }) => {
  const Icon = feature.icon
  const tag = feature.tagColor

  return (
    <div className="bg-background border border-border rounded-2xl p-7 hover:-translate-y-1 hover:border-primary transition-all duration-300">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${iconStyles[tag]}`}>
        <Icon size={20} />
      </div>
      <span className={`inline-block text-[10px] font-semibold uppercase tracking-widest rounded-full px-3 py-1 mb-2.5 ${tagStyles[tag]}`}>
        {feature.tag}
      </span>
      <h3 className="font-syne text-[17px] font-bold mb-2">{feature.title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
    </div>
  )
}