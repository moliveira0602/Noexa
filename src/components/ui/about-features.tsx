import { Leaf, TrendingUp, Award, Users, Rocket, Target } from "lucide-react";

const features = [
  {
    description:
      "No jargon, no overcomplication — just clear steps you can follow to deliver robust solutions that stand the test of time.",
    icon: Leaf,
    title: "We make things simple",
  },
  {
    description:
      "Every solution we build is designed to help you launch faster, scale smarter, and achieve measurable business outcomes.",
    icon: TrendingUp,
    title: "We focus on real results",
  },
  {
    description:
      "With 21+ years of hands-on experience across industries, we bring proven strategies and practical solutions to the table.",
    icon: Award,
    title: "We know what works",
  },
  {
    description:
      "From your first requirement to full deployment, we provide ongoing support, not just a one-time deliverable.",
    icon: Users,
    title: "With you all the way",
  },
  {
    description:
      "We stay ahead of the curve, adopting emerging technologies and best practices to keep your business competitive.",
    icon: Rocket,
    title: "We innovate constantly",
  },
  {
    description:
      "Your success is our success. We measure our impact by the results we deliver to your organization.",
    icon: Target,
    title: "We deliver impact",
  },
];

export default function AboutFeatures() {
  return (
    <section id="about">
      <div className="section-inner">
        <div className="section-eyebrow reveal">About NoeXa</div>
        <h2 className="section-title reveal">Removing the roadblocks to your success</h2>
        <p className="section-sub reveal">
          It's easy to get lost in a sea of technology options, conflicting 
          opinions, and endless must-dos. We filter out the noise, focus on 
          what truly matters, and give you the kind of clarity that lets 
          your business shine in the market.
        </p>

        <div className="services-grid">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const num = String(index + 1).padStart(2, '0');
            return (
              <div className="service-card reveal" key={feature.title}>
                <div className="service-icon">
                  <Icon size={24} strokeWidth={1.5} />
                </div>
                <div className="service-num">{num} — </div>
                <div className="service-name">{feature.title}</div>
                <p className="service-desc">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}