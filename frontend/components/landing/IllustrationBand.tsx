const ITEMS = [
  {
    src: "https://res.cloudinary.com/didt1ywys/image/upload/v1781002981/carrying_file_nmcdwo.png",
    title: "Bring your ideas",
    text: "Carry your files in and start building the moment you arrive.",
    rotate: -6,
  },
  {
    src: "https://res.cloudinary.com/didt1ywys/image/upload/v1781002983/happy_jump_djg2ti.png",
    title: "Build with joy",
    text: "Early access should feel exciting — we obsess over the little delights.",
    rotate: 5,
  },
  {
    src: "https://res.cloudinary.com/didt1ywys/image/upload/v1781002981/planned_files_j1sjxd.png",
    title: "Ship it organized",
    text: "Structure-first by design, so your projects stay clean as they grow.",
    rotate: -4,
  },
];

export default function IllustrationBand() {
  return (
    <section className="illus-band">
      <div className="illus-band-inner">
        <p className="illus-band-eyebrow">Made for builders</p>
        <h2 className="illus-band-title">
          A framework that&rsquo;s a little more <span>human</span>.
        </h2>

        <div className="illus-grid">
          {ITEMS.map((item) => (
            <div className="illus-card" key={item.title}>
              <div className="illus-art">
                <span className="illus-glow" aria-hidden />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  width={150}
                  height={150}
                  loading="lazy"
                  style={{ ["--r" as string]: `${item.rotate}deg` }}
                />
              </div>
              <h3 className="illus-card-title">{item.title}</h3>
              <p className="illus-card-text">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
