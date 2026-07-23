import MnBrd from "./MnBrd/MnBrd";

export function CvrPg() {
  return (
    <MnBrd pg={false}>
      <div className="pg-bg absolute inset-0">
        <img
          src={`${import.meta.env.BASE_URL}img/cover.png`}
          alt="Infinity Castle's Cuisine Cover"
          className="pg-img w-full h-full"
          loading="lazy"
        />
      </div>
    </MnBrd>
  );
}
