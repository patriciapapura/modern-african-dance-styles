Modern African Dance Styles

An interactive map showcasing modern African dance styles with country quick facts and optional videos.

Setup

- Requirements: Node 18+
- Install: `npm i`
- Run dev server: `npm run dev`
- Build: `npm run build`
- Preview production: `npm run preview`

Project Structure

- `index.html`: Markup and embedded SVG map
- `map.css`: Styles for layout, modal, and map interactions
- `map.js`: App logic for hover, modal, routing, and data rendering
- `map.json`: Country data used by the modal
- `assets/`: Background texture and flags

Data Format

Each country entry in `map.json` looks like:

```
{
  "NG": {
    "name": "Nigeria",
    "flag": "./assets/flags/Nigeria.png",
    "population": "237 - 238 million",
    "capital": "Abuja",
    "languages": ["English", "Hausa", "Yoruba", "Igbo"],
    "tribes": ["Hausa", "Yoruba", "Igbo"],
    "dance_styles": ["Naija Fusion", "Shaku", "Konto"],
    "learn_more": "https://example.com"
  }
}
```

Optional fields:
- `learn_more`: external URL
- `dance_styles_details`: array of objects with `name`, `description`, and optional `youtube` video id

Accessibility

- Modal uses role="dialog" and closes with Escape or backdrop click
- Close control is a button with an accessible label

Notes

- Update the flag paths if hosting under a sub-path
- Keep JSON values concise; long prose is better suited for `learn_more`
