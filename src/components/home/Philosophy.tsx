"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export function Philosophy() {
  return (
    <section className="flex flex-col md:flex-row min-h-[800px] bg-zinc-950 overflow-hidden">
      {/* Image Side */}
      <div className="w-full md:w-1/2 relative min-h-[500px] md:min-h-auto">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 0.6 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB91JkKDcLdPYNw6jXPEekUv0KF0tocd4RDZJ7bwNH1JW1Vo2OxeN1vu_IapPdjwnqlQPSRFsKvUCZJD-YZc3oSmSUjlSu15P7K-a2CRN1rB7D9eRmxnqR0xVpNjqxcnDllREXnTm9LVgSLCxt_4ljKdhdn5xKalTh0DmNLPLcDVXNPZdoSfRVeZBiUbTC9KOBiwkc4x8bB9KB0iJganOJ8M1tUERQCl11RQX3gEBnD20K8UUtlud26B2UQ40JD5nS9h-ua3LmxMiBF" 
            alt="Our philosophy"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
      </div>

      {/* Text Side */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-12 md:p-24 bg-[var(--color-on-surface)]">
        <div className="max-w-md text-center md:text-left">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="font-sans text-[11px] tracking-[0.2em] uppercase text-[#9d9d9b] mb-12"
          >
            Our Philosophy
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.08, ease: "easeOut" }}
            className="font-serif italic text-3xl md:text-5xl text-white mb-10 leading-tight"
          >
            &quot;Travel is not about the destination, but the perspective.&quot;
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.16, ease: "easeOut" }}
            className="text-white/70 font-light leading-relaxed mb-12 text-sm"
          >
            At Ourrika, we believe in slow travel. We curate experiences that challenge your viewpoint and immerse you in the quiet luxury of genuine human connection and raw natural beauty.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.24, ease: "easeOut" }}
          >
            <Link 
              href="/journal" 
              className="inline-flex items-center text-white font-sans text-[10px] tracking-widest uppercase group"
            >
              <span>Explore Our Story</span>
              <div className="ml-4 w-8 h-px bg-white/40 transition-all group-hover:w-12 group-hover:bg-white" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
