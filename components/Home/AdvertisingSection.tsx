import Image from 'next/image';
import Link from 'next/link';

const campaignImages = [
  {
    src: '/newPic/ad-01.jpeg',
    alt: 'Drippy Banks campaign look 1',
    label: 'Fresh streetwear style',
  },
  {
    src: '/newPic/ad-02.jpeg',
    alt: 'Drippy Banks campaign look 2',
    label: 'Iconic premium fits',
  },
  {
    src: '/newPic/ad-03.jpeg',
    alt: 'Drippy Banks campaign look 3',
    label: 'High-shine urban essentials',
  },
  {
    src: '/newPic/ad-04.jpeg',
    alt: 'Drippy Banks campaign look 4',
    label: 'Stay fresh, stay drippy',
  },
  {
    src: '/newPic/ad-05.jpeg',
    alt: 'Drippy Banks campaign look 5',
    label: 'Bold silhouettes with edge',
  },
  {
    src: '/newPic/ad-06.jpeg',
    alt: 'Drippy Banks campaign look 6',
    label: 'Luxury street attitude',
  },
  {
    src: '/newPic/ad-07.jpeg',
    alt: 'Drippy Banks campaign look 7',
    label: 'Designed for every city corner',
  },
  {
    src: '/newPic/ad-08.jpeg',
    alt: 'Drippy Banks campaign look 8',
    label: 'Midnight-ready wardrobe pieces',
  },
  {
    src: '/newPic/ad-09.jpeg',
    alt: 'Drippy Banks campaign look 9',
    label: 'Bold, premium drops',
  },
  {
    src: '/newPic/ad-10.jpeg',
    alt: 'Drippy Banks campaign look 10',
    label: 'Next-level drip essentials',
  },
];

export function AdvertisingSection() {
  return (
    <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-12 flex flex-col gap-3 sm:gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-amber-300">Campaign spotlight</p>
          <h2 className="mt-2 sm:mt-4 text-2xl sm:text-4xl font-semibold tracking-tight text-white">Drippy Banks streetwear campaign</h2>
        </div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold uppercase tracking-[0.15em] text-slate-300 transition hover:text-white w-fit"
        >
          Shop the campaign
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {campaignImages.map((image) => (
          <div
            key={image.src}
            className="group overflow-hidden rounded-2xl sm:rounded-[2rem] border border-white/10 bg-slate-900/80 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-amber-300/40"
          >
            <div className="relative aspect-4/5 overflow-hidden">
              <Image
                fill
                src={image.src}
                alt={image.alt}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
            </div>
            <div className="p-3 sm:p-6">
              <p className="text-[9px] sm:text-xs uppercase tracking-[0.35em] text-amber-300">Campaign drop</p>
              <h3 className="mt-1.5 sm:mt-3 text-sm sm:text-xl font-semibold text-white line-clamp-1">{image.label}</h3>
              <p className="mt-1.5 sm:mt-3 text-[10px] sm:text-sm leading-5 sm:leading-6 text-slate-400 line-clamp-2">
                Discover premium essentials designed to turn heads and keep your look elevated.
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
