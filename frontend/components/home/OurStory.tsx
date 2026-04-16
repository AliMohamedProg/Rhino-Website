import Image from "next/image";

export function OurStory() {
    return (
        <section className="relative py-64 px-8 min-h-[700px] flex items-center justify-center w-full overflow-hidden border-y border-gray-100">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 scale-105">
                <Image
                    src="/our-story.png"
                    alt="Our Story Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay for Text Readability */}
                <div className="absolute inset-0 bg-mahogany/40 backdrop-blur-[2px]" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center">
                <span className="text-[10px] tracking-[0.5em] font-bold text-white/80 uppercase mb-6">
                    ESTABLISHED 2024
                </span>
                
                <h2 className="text-6xl md:text-8xl font-serif text-white mb-10 italic">
                    Our Story
                </h2>

                <p className="text-xl md:text-2xl text-white/90 font-medium italic leading-relaxed mb-16 max-w-3xl px-4">
                    "Founded on the belief that beauty lies in the simplicity of form and luxury. Every piece is built to be a statement of craftsmanship, style, and a timeless piece of art."
                </p>

                <button className="bg-white text-mahogany hover:bg-mahogany hover:text-white transition-all duration-500 px-14 py-6 rounded-full text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl hover:scale-105 active:scale-95">
                    Read Our Story
                </button>
            </div>
        </section>
    );
}
