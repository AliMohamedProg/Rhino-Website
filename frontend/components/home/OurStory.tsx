import Image from "next/image";

export function OurStory() {
    return (
        <section id="our-story" className="relative py-64 px-8 min-h-[700px] flex items-center justify-center w-full overflow-hidden border-y border-gray-100 scroll-mt-28">
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

                <h2 className="text-6xl md:text-8xl font-serif text-white mb-10 italic">
                    Our Story
                </h2>

                <p className="text-xl md:text-2xl text-white/90 font-medium italic leading-relaxed mb-16 max-w-3xl px-4">
                    "Journey from imagination to reality.” that's how we turn wood into the elite design and unique.
                </p>

                {/* <button className="bg-white text-mahogany hover:bg-mahogany hover:text-white transition-all duration-500 px-14 py-6 rounded-full text-[10px] font-bold tracking-[0.4em] uppercase shadow-2xl hover:scale-105 active:scale-95">
                    Read Our Story
                </button> */}
            </div>
        </section>
    );
}
