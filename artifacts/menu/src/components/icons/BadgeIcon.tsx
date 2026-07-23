import React from "react";
import "./BadgeIcon.css";

/* Visual-only: bracket-corner frame + blurred backdrop.
   Number is rendered by the consumer above this. */
export function BadgeIcon() {
  return (
    <div className="bdgi" aria-hidden>
      <span className="bdgi-c bdgi-tl-h" />
      <span className="bdgi-c bdgi-tl-v" />
      <span className="bdgi-c bdgi-tr-h" />
      <span className="bdgi-c bdgi-tr-v" />
      <span className="bdgi-c bdgi-bl-h" />
      <span className="bdgi-c bdgi-bl-v" />
      <span className="bdgi-c bdgi-br-h" />
      <span className="bdgi-c bdgi-br-v" />
    </div>
  );
}
