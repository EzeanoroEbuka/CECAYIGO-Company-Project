import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { blogService } from "@/services/blogService";
import { toast } from "sonner";
import { Calendar, User, ArrowRight, Clock, Sparkles } from "lucide-react";

interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  imageUrl?: string;
  date: any;
  author: string;
  category?: string;
  readTime?: number;
}

interface LatestBlogsProps {
  maxPosts?: number;
  showViewAll?: boolean;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=75";

const BlogCard = ({
  post,
  index,
  formatDate,
}: {
  post: BlogPost;
  index: number;
  formatDate: (date: any) => string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    viewport={{ once: true, margin: "-30px" }}
    whileHover={{ y: -4 }}
    className="h-full group"
  >
    <Link href={`/blogs/${post.id}`}>
      <div
        className="relative bg-card border border-border rounded-xl md:rounded-2xl overflow-hidden
        shadow-card-light dark:shadow-card-dark
        hover:border-brand-red/30 hover:shadow-brand-red/10
        transition-all duration-300 h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden">
          <Image
            src={post.imageUrl || DEFAULT_IMAGE}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading={index < 4 ? "eager" : "lazy"}
            quality={75}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Category badge */}
          {post.category && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-brand-red text-white text-[10px] md:text-xs font-bold px-2 py-0.5 md:px-3 md:py-1 rounded-md shadow-lg z-10">
              {post.category}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 md:p-4 lg:p-5 flex flex-col flex-grow">
          {/* Meta */}
          <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-muted-foreground mb-2">
            <div className="flex items-center gap-0.5 md:gap-1">
              <User className="h-2.5 w-2.5 md:h-3 md:w-3 flex-shrink-0" />
              <span className="font-medium truncate max-w-[80px] sm:max-w-none">
                {post.author}
              </span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-0.5 md:gap-1">
              <Calendar className="h-2.5 w-2.5 md:h-3 md:w-3 flex-shrink-0" />
              <span className="whitespace-nowrap">{formatDate(post.date)}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            className="font-bold text-sm sm:text-base md:text-lg text-foreground mb-1.5 md:mb-2
            line-clamp-2 group-hover:text-brand-red transition-colors leading-tight"
          >
            {post.title}
          </h3>

          {/* Snippet */}
          <p className="hidden sm:block text-xs md:text-sm text-muted-foreground line-clamp-2 leading-relaxed mb-2 md:mb-3 flex-grow">
            {post.snippet}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 md:pt-2.5 border-t border-border mt-auto">
            <div className="flex items-center gap-0.5 md:gap-1 text-[10px] md:text-xs text-muted-foreground bg-muted px-1.5 py-0.5 md:px-2 md:py-1 rounded-full">
              <Clock className="h-2.5 w-2.5 md:h-3 md:w-3" />
              <span>{post.readTime || 5} min</span>
            </div>
            <div className="text-brand-blue font-semibold text-xs md:text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              <span className="hidden xs:inline">Read</span>
              <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  </motion.div>
);

export function LatestBlogs({
  maxPosts = 6,
  showViewAll = true,
}: LatestBlogsProps) {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  const formatDate = useCallback((date: any): string => {
    if (!date) return "N/A";
    try {
      let dateObj: Date;
      if (date.toDate && typeof date.toDate === "function") {
        dateObj = date.toDate();
      } else if (date instanceof Date) {
        dateObj = date;
      } else if (typeof date === "string" || typeof date === "number") {
        dateObj = new Date(date);
      } else {
        return "N/A";
      }
      if (!dateObj || isNaN(dateObj.getTime())) return "N/A";
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${months[dateObj.getMonth()]} ${dateObj.getDate()}, ${dateObj.getFullYear()}`;
    } catch {
      return "N/A";
    }
  }, []);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const posts = await blogService.getLatestPosts(maxPosts);
        setBlogPosts(posts);
      } catch {
        toast.error("Unable to load blog posts");
      } finally {
        setLoading(false);
      }
    };
    fetchLatestBlogs();
  }, [maxPosts]);

  if (loading) {
    return (
      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-brand-red border-t-transparent rounded-full mx-auto animate-spin" />
        </div>
      </section>
    );
  }

  if (!blogPosts.length) {
    return (
      <section className="py-10 md:py-14 bg-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm md:text-base mb-4">
            No blog posts available
          </p>
          <Link href="/blogs">
            <button className="bg-brand-red hover:bg-brand-red-dark text-white px-5 py-2 md:px-6 md:py-2.5 rounded-full font-semibold text-sm transition-all">
              Browse All Articles
            </button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 md:py-14 lg:py-20 bg-background relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 pointer-events-none opacity-60">
        <div className="absolute top-12 right-6 md:right-12 w-48 h-48 md:w-64 md:h-64 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute bottom-12 left-6 md:left-12 w-48 h-48 md:w-64 md:h-64 bg-brand-red/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-10 lg:mb-14"
        >
          <motion.div className="inline-flex items-center gap-1.5 md:gap-2 bg-brand-blue text-white px-3 py-1 md:px-4 md:py-1.5 rounded-full font-semibold text-xs md:text-sm mb-3 shadow-brand-blue">
            <Sparkles className="h-3 w-3 md:h-3.5 md:w-3.5" />
            Latest Articles
          </motion.div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
            Latest Insights
          </h2>

          <p className="text-muted-foreground text-xs md:text-sm lg:text-base max-w-2xl mx-auto px-4">
            Expert tips, guides, and updates on solar energy
          </p>
        </motion.div>

        {/* Blog Grid */}
        <div
          className={`grid gap-3 md:gap-5 lg:gap-6 mb-8 md:mb-10 lg:mb-14 ${
            blogPosts.length === 1
              ? "grid-cols-1 max-w-md mx-auto"
              : blogPosts.length === 2
                ? "grid-cols-2 max-w-3xl mx-auto"
                : "grid-cols-2 md:grid-cols-3"
          }`}
        >
          {blogPosts.map((post, index) => (
            <BlogCard
              key={post.id}
              post={post}
              index={index}
              formatDate={formatDate}
            />
          ))}
        </div>

        {/* View All */}
        {showViewAll && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link href="/blogs">
              <motion.button
                className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white px-6 py-2.5 md:px-8 md:py-3.5 rounded-full font-semibold text-sm md:text-base shadow-brand-blue transition-all"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="hidden sm:inline">View All Articles</span>
                <span className="sm:hidden">View All</span>
                <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

export default LatestBlogs;
