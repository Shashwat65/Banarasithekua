import { useEffect, useState } from "react";
import { bannersAPI } from "@/services/api";
import { Link } from "react-router-dom";

interface Banner {
  _id: string;
  title?: string;
  imageUrl: string;
  link?: string;
  position: string;
}

interface BannerDisplayProps {
  position: 'header' | 'main' | 'sidebar' | 'footer';
  className?: string;
}

const BannerDisplay = ({ position, className = "" }: BannerDisplayProps) => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBanners();
  }, [position]);

  const loadBanners = async () => {
    try {
      const res = await bannersAPI.getAllPublic(position);
      if (res.data?.success) {
        setBanners(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to load banners", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || banners.length === 0) {
    return null;
  }

  return (
    <div className={`banner-container ${className}`}>
      {banners.map((banner) => (
        <div key={banner._id} className="banner-item">
          {banner.link ? (
            <Link to={banner.link} className="block">
              <img
                src={banner.imageUrl}
                alt={banner.title || "Banner"}
                className="w-full h-auto rounded-lg hover:opacity-90 transition-opacity"
              />
            </Link>
          ) : (
            <img
              src={banner.imageUrl}
              alt={banner.title || "Banner"}
              className="w-full h-auto rounded-lg"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default BannerDisplay;
