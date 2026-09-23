# Eyes on you | Tracker Blocker

Sup I developed this project purely out of curiosity and for fun, just to see if I could write my own ad blocker from scratch. Instead of relying on massive, complex tools, I wanted to understand how browser extensions work under the hood and build something with my own hands.

## How It Works
This extension uses a dual-layer strategy:
1. Network-Level Control (`background.js`): Thanks to a custom background listener, it intercepts and blocks common ad, tracker, and analytics domains (like doubleclick, googlesyndication, etc.) before they even load.
2. DOM and Page-Level Handling (`content.js`): Especially on platforms like YouTube, it automatically catches stubborn in-stream video ads and skip buttons that bypass network filters, handling them smoothly.(not sure yet but works most of the time)

## Performance and Test Results
To be completely honest, this cannot compete with heavyweights like uBlock Origin, which rely on massive global filter lists. However, during rigorous ad-blocking benchmark tests, it achieves close to a 40% success rate (around 36-40%), performing quite well for a custom lightweight script.
*Tip:* If you use the Brave browser and run this extension alongside Brave Shield, the blocking performance and page cleanliness improve even further.


## Does It Work on Firefox?
Because it relies on the Manifest V2 architecture, it currently runs smoothly on Google Chrome, Microsoft Edge, and other Chromium-based browsers. Due to Firefox's different Manifest V3 transition timelines and extension standards, it might require minor adjustments to run natively there.

## Installation Guide (Developer Mode)
If you want to test or try it out on your machine, the installation is straightforward:

1. Download this project to your computer (`Code` -> `Download ZIP`, then extract it).
2. Open Chrome and type `chrome://extensions/` into the address bar, then press Enter.
3. Enable the **Developer mode** toggle in the top right corner.
4. Click the **Load unpacked** button in the top left.
5. Select the extracted extension folder and import it.

Benchmark results in test websites:
<img width="376" height="520" alt="image" src="https://github.com/user-attachments/assets/2a6bf7f6-f064-464d-9219-643ff7147972" />
https://adblock.turtlecute.org/
<img width="1111" height="149" alt="image" src="https://github.com/user-attachments/assets/8238b3b1-bd1e-4cdd-aaeb-7b2e450eb3d8" />
https://adblock-tester.com/
<img width="1221" height="632" alt="image" src="https://github.com/user-attachments/assets/4c6eb3e1-4267-416d-a3cd-7d19310044c3" />
https://superadblocktest.com/


