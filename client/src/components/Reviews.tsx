const reviewGallery = [
  {
    src: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=320&q=80",
    name: "Ritika & Aman",
    city: "Pune",
  },
  {
    src: "https://images.unsplash.com/photo-1542293787938-4d2226c12e77?auto=format&fit=crop&w=320&q=80",
    name: "Kavya",
    city: "Delhi NCR",
  },
  {
    src: "https://images.unsplash.com/photo-1530023367847-a683933f4175?auto=format&fit=crop&w=320&q=80",
    name: "The Goyal Family",
    city: "Lucknow",
  },
  {
    src: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e?auto=format&fit=crop&w=320&q=80",
    name: "Chef Ananya",
    city: "Mumbai",
  },
  {
    src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=320&q=80",
    name: "Bhaskar",
    city: "Indore",
  },
  {
    src: "https://images.unsplash.com/photo-1522770179533-24471fcdba45?auto=format&fit=crop&w=320&q=80",
    name: "Tanishka",
    city: "Bengaluru",
  },
];

import { useEffect, useState } from 'react';
import { teamAPI } from '@/services/api';

interface TeamMember { _id: string; name: string; role: string; photo?: string; active?: boolean; }

// Single current team member (as requested)
const fallbackTeam: TeamMember[] = [
  { _id: 'chinmay', name: 'Chinmay Pandey', role: 'Founder & Recipe Lead', photo: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=320&q=80' },
];

const Reviews = () => {
  return (
    <section id="reviews" className="py-24">
      <div className="container mx-auto px-6 space-y-24">
        {/* Reviews carousel */}
        <div className="space-y-12">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
            <div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.5em] text-secondary/50">Voices Of Trust</p>
              <h2 className="mt-3 text-3xl sm:text-4xl md:text-5xl font-semibold text-secondary">
                Reviews
              </h2>
            </div>
            <p className="max-w-2xl text-secondary/70 text-sm sm:text-base">
              Families across India are choosing Banarasi Thekua for their festive platters. Here are a few of them sharing the joy of mithai done right.
            </p>
          </div>
          <div className="relative">
            <div className="flex overflow-x-auto gap-8 pb-6 lg:pb-4 snap-x snap-mandatory">
              {reviewGallery.map((review, index) => (
                <figure key={`${review.name}-${index}`} className="min-w-[240px] snap-start">
                  <div className="rounded-[28px] overflow-hidden border border-border/60 bg-white shadow-[0_30px_50px_rgba(84,48,33,0.14)]">
                    <div className="relative h-64 group">
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-neutral-200/60 to-neutral-300/40 dark:from-neutral-700/40 dark:to-neutral-600/30" aria-hidden="true" />
                      <img
                        src={review.src}
                        alt={`${review.name} from ${review.city}`}
                        className="h-full w-full object-cover opacity-0 transition-opacity duration-500"
                        onLoad={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '1'; (e.currentTarget.previousElementSibling as HTMLElement)?.remove(); }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = 'https://placehold.co/600x800?text=Review';
                          (e.currentTarget as HTMLImageElement).style.opacity = '1';
                        }}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                      />
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-secondary/90 via-secondary/60 to-transparent p-5 text-white">
                        <p className="text-base font-semibold">{review.name}</p>
                        <p className="text-xs tracking-[0.35em] uppercase">{review.city}</p>
                      </div>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </div>

        {/* Team Section */}
        <TeamSection />
      </div>
    </section>
  );
};

const TeamSection = () => {
  const [team, setTeam] = useState<TeamMember[]>(fallbackTeam);
  useEffect(() => {
    (async () => {
      try {
        const res = await teamAPI.getAll();
        if (Array.isArray(res.data.data)) {
          const chinmay = res.data.data.find((m: TeamMember) => /chinmay/i.test(m.name));
          if (chinmay) {
            setTeam([{ ...chinmay }]);
            return;
          }
        }
      } catch {/* ignore network issues; fallback used */}
      // ensure only single fallback member
      setTeam(fallbackTeam);
    })();
  }, []);
  return (
    <div className="space-y-12" id="team">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.6em] text-secondary/50">Our Team</p>
            <h3 className="text-3xl sm:text-4xl font-semibold text-secondary">People Behind The Craft</h3>
            <p className="text-secondary/70 text-sm sm:text-base">A small team devoted to preserving traditional flavours while maintaining modern cleanliness and consistency.</p>
          </div>
          <div className="grid gap-10 sm:grid-cols-1 place-items-center">
            {team.map(member => (
              <div key={member._id} className="group relative overflow-hidden rounded-[28px] border border-border/60 bg-white shadow-[0_24px_40px_rgba(84,48,33,0.12)]">
                <div className="h-72">
                  <img src={member.photo || 'https://placehold.co/400x600?text=Team'} alt={member.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 space-y-1">
                  <p className="font-semibold text-secondary">{member.name}</p>
                  <p className="text-xs tracking-[0.35em] uppercase text-secondary/60">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
    </div>
  );
};

export default Reviews;