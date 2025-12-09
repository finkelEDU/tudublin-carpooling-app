import Link from "next/link";
import Card from "./ChatHistory.jsx";

export default function Home(){
  return(
    <main>

      <h1>Welcome to TU Dublin's Carpooling</h1>
      <p>Many students are aware that </p>

      <body>
        <gmp-map id="google-maps"
          center = "53.404, -6.38"
          zoom = "15"
          map-id = "DEMO_MAP_ID"
        >
          <gmp-advanced-marker
            position="53.404, -6.38"
            title="TU Dublin Blanchardstown Campus"
          ></gmp-advanced-marker>
        </gmp-map>
      </body>


      <p>Search for Ride</p>

      <div id="find-carpool">
        <input type="text" placeholder="Start" className="find-carpool-field" />
        <input type="text" placeholder="Destination" className="find-carpool-field" />

        <button className="find-carpool-button">Search</button>
        <button className="find-carpool-button">Post Ride</button>
      </div>
    </main>
  );
}