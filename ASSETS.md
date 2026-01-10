# 🎵 Taiga Website - Asset Organization

## Folder Structure

```
📁 public/                    # Static assets (served directly)
├── 📁 images/               # Large images, photos
│   ├── 📁 hero/            # Landing page hero images
│   └── 📁 gallery/         # Photo galleries, press photos
├── 📁 audio/               # Music and audio files
│   ├── 📁 tracks/          # Full songs/tracks
│   └── 📁 samples/         # Short audio previews
├── vite.svg                # Keep existing
└── favicon.ico             # Site favicon

📁 src/assets/               # Bundled assets (imported in code)
├── 📁 icons/               # Small icons, UI elements
├── 📁 images/              # Component-specific images
└── react.svg               # Keep existing
```

## Usage Guidelines

### Use `public/` for:
- ✅ Hero background images
- ✅ Audio files (songs, samples)
- ✅ Large photo galleries
- ✅ Press kit downloads
- ✅ Favicon, meta images

**Access via:** Direct URLs
```tsx
<img src="/images/hero/background.jpg" />
<audio src="/audio/tracks/song1.mp3" />
```

### Use `src/assets/` for:
- ✅ UI icons and small graphics
- ✅ Component-specific images
- ✅ Logos and branding elements
- ✅ Images that need optimization

**Access via:** Import statements
```tsx
import logo from './assets/icons/logo.svg'
<img src={logo} />
```

## File Naming Convention

- **Use lowercase** with hyphens: `hero-background.jpg`
- **Be descriptive**: `music-workshop-photo-1.jpg`
- **Include size for variants**: `logo-small.svg`, `logo-large.svg`

## Recommended Formats

### Images
- **Photos**: `.jpg` (compressed)
- **Graphics/Icons**: `.svg` (scalable)
- **Screenshots**: `.png` (lossless)

### Audio
- **Music**: `.mp3` or `.wav`
- **Samples**: `.mp3` (smaller size)

## Examples for Musician Website

```
public/images/hero/
├── triangle-background.jpg      # Main triangle background
├── music-hero.jpg              # Music section hero
└── workshop-hero.jpg           # Workshop section hero

public/audio/tracks/
├── sample-track-1.mp3
├── sample-track-2.mp3
└── workshop-demo.mp3

src/assets/icons/
├── play-button.svg
├── pause-button.svg
└── logo.svg
```