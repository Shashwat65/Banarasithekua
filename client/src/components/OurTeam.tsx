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
  { _id: "chinmay", name: "Chinmay Pandey", role: "Founder & Recipe Lead", photo: teamPhoto },
];

const OurTeam = () => {
  const { data: teamData } = useQuery({
    queryKey: ["team", "public"],
    queryFn: async () => {
      const res = await teamAPI.getAllPublic();
      return res.data?.data || [];
    },
  });

  const team: TeamMember[] =
    Array.isArray(teamData) && teamData.length > 0 ? teamData : fallbackTeam;

  return (
    <section id="team" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-5 mb-16">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-secondary/50">
            The People
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-secondary">
            Meet Our Team
          </h2>
          <p className="text-sm sm:text-base text-secondary/70">
            A passionate team dedicated to bringing you authentic Banarasi flavors with modern quality standards.
          </p>
        </div>

        {/* Cards — centers when fewer than 3 cards */}
        <div className="flex flex-wrap justify-center gap-10 max-w-6xl mx-auto">
          {team.map((member) => (
            <div
              key={member._id}
              className="group relative w-full sm:w-[calc(50%-20px)] lg:w-[calc(33.333%-27px)] max-w-sm overflow-hidden rounded-[32px] border border-secondary/20 bg-white shadow-[0_24px_48px_rgba(84,48,33,0.12)] hover:shadow-[0_36px_64px_rgba(84,48,33,0.2)] transition-all duration-500"
            >
              {/* Photo */}
              <div className="relative h-80 overflow-hidden bg-[#f6e9d0]">
                <img
                  src={member.photo || "https://placehold.co/400x480?text=Team+Member"}
                  alt={member.name}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Bottom gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-secondary/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Info */}
              <div className="px-6 py-5 text-center space-y-1 bg-white">
                <h3 className="text-lg font-semibold text-secondary">
                  {member.name}
                </h3>
                <p className="text-xs tracking-[0.35em] uppercase text-secondary/55 font-medium">
                  {member.role}
                </p>
              </div>

              {/* Decorative accent line */}
              <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left rounded-b-[32px]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTeam;
