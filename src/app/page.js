import Link from "next/link";

export default function Home(){
  return(
    <main>
      <h1>Welcome to TU Dublin's Carpooling!!</h1>
      <p>Test paragraph</p>

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

      <div id="find-taxi">Test - To do: Search for ride components, ratings and feedback, why use this app div</div>
    </main>
  );
}