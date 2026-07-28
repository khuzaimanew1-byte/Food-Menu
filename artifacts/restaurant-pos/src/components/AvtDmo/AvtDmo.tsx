import './AvtDmo.css';
import { Avt } from '../avatar/Avt';
import { useImgUpld } from '../../lib/upld/useImgUpld';

export function AvtDmo() {
  const icUpld = useImgUpld();
  const sqUpld = useImgUpld();

  return (
    <div className="admo">
      <h1 className="admo-ttl ff-s">Avatar Demo</h1>
      <div className="admo-grid">
        <div className="admo-cell">
          <span className="admo-lbl">Normal · Initials</span>
          <Avt name="Lamb Kofta" shape="ic" />
        </div>
        <div className="admo-cell">
          <span className="admo-lbl">Normal · AV Fallback</span>
          <Avt shape="ic" />
        </div>
        <div className="admo-cell">
          <span className="admo-lbl">Normal · Sq · Initials</span>
          <Avt name="Arabic Dish" shape="sq" />
        </div>
        <div className="admo-cell">
          <span className="admo-lbl">Normal · Single-word name</span>
          <Avt name="Kunafa" shape="ic" />
        </div>
        <div className="admo-cell">
          <span className="admo-lbl">Upload · ic</span>
          <Avt shape="ic" src={icUpld.src} uploadable onUpload={icUpld.onUpload} />
        </div>
        <div className="admo-cell">
          <span className="admo-lbl">Upload · sq</span>
          <Avt shape="sq" src={sqUpld.src} uploadable onUpload={sqUpld.onUpload} />
        </div>
      </div>
      <p className="admo-hint ff-s">
        Upload avatars: tap or drag a file to pick · image shown immediately.
      </p>
    </div>
  );
}
