import { Sparkles, ShieldCheck, HeartHandshake, Timer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { teamAPI } from "@/services/api";
import teamPhoto from "@/assets/team-member.jpg";

interface TeamMember {
  _id: string;
  name: string;
  role: string;
  photo?: string;
  active?: boolean;
}

const fallbackTeam: TeamMember[] = [
  { _id: 'chinmay', name: 'Chinmay Pandey', role: 'Founder & Recipe Lead', photo: teamPhoto },
];

const CoreValues = () => {
  const values = [
    {
      icon: <ShieldCheck className="w-10 h-10 text-secondary" />,
      title: "Premium Ingredients",
      description: "Only ghee, jaggery, and grains certified by FSSAI partners make it into our mithai."
    },
    {
      icon: <Sparkles className="w-10 h-10 text-secondary" />,
      title: "Handcrafted Fresh",
      description: "Every thekua is shaped by hand in micro-batches, sealed the same day for freshness."
    },
    {
      icon: <HeartHandshake className="w-10 h-10 text-secondary" />,
      title: "Ethical Partnerships",
      description: "We work with women-led self-help groups across Bihar to ensure equitable livelihoods."
    },
    {
      icon: <Timer className="w-10 h-10 text-secondary" />,
      title: "Right On Time",
      description: "Guaranteed dispatch within 24 hours with real-time tracking to your doorstep."
    }
  ];

  // Fetch team members from database
  const { data: teamData } = useQuery({
    queryKey: ["team", "public"],
    queryFn: async () => {
      const res = await teamAPI.getAllPublic();
      return res.data?.data || [];
    },
  });

  const team = (Array.isArray(teamData) && teamData.length > 0) ? teamData : fallbackTeam;

  return (
    <section id="values" className="py-24 bg-[#f0f0d6]/80">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-secondary/50">Why Banarasi Thekua</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-secondary">
            Our Core Values
          </h2>
          <p className="text-sm sm:text-base text-secondary/70">
            Rooted in the kitchens of North India, our promise blends heritage with modern hygiene standards that every family can trust.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={index}
              className="relative overflow-hidden rounded-[24px] border border-secondary/20 bg-white/70 backdrop-blur-sm px-8 py-10 shadow-[0_32px_48px_rgba(84,48,33,0.12)]"
            >
              <div className="mb-6 flex justify-center">
                <span className="inline-flex items-center justify-center rounded-full bg-secondary/10 p-5">
                  {value.icon}

        {/* Our Team Section */}
        <div className="mt-32" id="team">
          <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-secondary/50">The People</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-secondary">
              Meet Our Team
            </h2>
            <p className="text-sm sm:text-base text-secondary/70">
              A passionate team dedicated to bringing you authentic Banarasi flavors with modern quality standards.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            {team.map((member) => (
              <div
                key={member._id}
                className="group relative overflow-hidden rounded-[32px] border border-secondary/20 bg-white shadow-[0_24px_48px_rgba(84,48,33,0.14)] hover:shadow-[0_32px_64px_rgba(84,48,33,0.2)] transition-all duration-500"
              >
                {/* Image Container */}
                <div className="relative h-80 overflow-hidden bg-gradient-to-br from-secondary/5 to-secondary/10">
                  <img
                    src={member.photo || 'https://placehold.co/400x600?text=Team+Member'}
                    alt={member.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Info Container */}
                <div className="p-6 space-y-2 text-center">
                  <h3 className="text-xl font-semibold text-secondary group-hover:text-primary transition-colors duration-300">
                    {member.name}
                  </h3>
                  <p className="text-sm tracking-[0.3em] uppercase text-secondary/60 font-medium">
                    {member.role}
                  </p>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-bold text-secondary">✨</span>
                </div>
              </div>
            ))}
          </div>
        </div>
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-secondary text-center mb-4">
                {value.title}
              </h3>
              <p className="text-sm text-secondary/70 leading-relaxed text-center">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValues;