import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [currentImage, setCurrentImage] = useState('/images/hero/triangle-hero-bg.jpg')
  const [activeSection, setActiveSection] = useState('music') // Start with music active
  const [triangleRotation, setTriangleRotation] = useState(0) // Rotation angle in degrees
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Define sections in clockwise order
  const sections = [
    { id: 'music', image: '/images/hero/triangle-hero-bg.jpg', angle: 0 },
    { id: 'workshops', image: '/images/hero/triangle-hero-workshop.jpg', angle: 120 },
    { id: 'tbd', image: '/images/hero/triangle-hero-bg.jpg', angle: 240 }
  ]

  // Get current section based on rotation (which section is at the top)
  const getCurrentSection = (rotation: number) => {
    // Normalize rotation to 0-360 range
    const normalizedRotation = ((rotation % 360) + 360) % 360
    
    // Since we rotate the triangle, we need to think about which section ends up at the top
    // 0° = music at top, 120° = project3 at top, 240° = workshops at top
    if (normalizedRotation >= 0 && normalizedRotation < 120) return sections[0] // music
    if (normalizedRotation >= 120 && normalizedRotation < 240) return sections[2] // project3
    return sections[1] // workshops
  }

  // Easy adjustment variables for black box widths
  const musicBoxWidth = 200
  const workshopsBoxWidth = 200
  const tdbBoxWidth = 200

  // Easy adjustment variables for text distance from triangle edges
  const topTextDistance = 24      // Distance above top edge
  const rightTextDistance = 24    // Distance from right edge  
  const leftTextDistance = 24     // Distance from left edge

  // Black box positioning and size adjustments
  const boxYOffset = 2          // Vertical offset for black box positioning (0 = top of box aligns with text baseline)
  const boxHeight = 18            // Height of all black boxes
  const linkFontSize = 1.25       // Font size for navigation links (rem units - 1.25rem = 20px at 16px base)

  // Image positioning adjustments
  const defaultImageY = 70       // Y position for default/music image
  const workshopImageY = 70      // Y position for workshop image
  
  // Image height adjustments
  const defaultImageHeight = 250  // Height for default/music image
  const workshopImageHeight = 400 // Height for workshop image

  // Handle section selection
  const handleSectionHover = (section: string, imagePath: string) => {
    if (!isMobile) { // Only on desktop
      setActiveSection(section)
      setCurrentImage(imagePath)
    }
  }

  // Handle section navigation
  const handleSectionClick = (section: string) => {
    console.log(`Navigating to ${section} section`)
    // TODO: Replace with actual routing logic
  }

  // Handle triangle click (prevent SVG event cloning issues)
  const handleTriangleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleSectionClick(activeSection)
  }

  // Touch handling for mobile rotation
  const [touchStartX, setTouchStartX] = useState(0)
  
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isMobile) {
      setTouchStartX(e.touches[0].clientX)
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile) return
    
    const touchEndX = e.changedTouches[0].clientX
    const deltaX = touchEndX - touchStartX
    const threshold = 50 // Minimum swipe distance
    
    if (Math.abs(deltaX) > threshold) {
      // Swipe right = show next section (rotate triangle clockwise)
      // Swipe left = show previous section (rotate triangle counterclockwise)
      const rotationChange = deltaX > 0 ? 120 : -120
      const newRotation = triangleRotation + rotationChange
      setTriangleRotation(newRotation)
      
      // Update active section and image based on new rotation
      const currentSection = getCurrentSection(newRotation)
      setActiveSection(currentSection.id)
      setCurrentImage(currentSection.image)
    }
  } 

  return (
    <div className="app" style={{'--link-font-size': `${linkFontSize}rem`} as React.CSSProperties}>
      {/* TAIGA Logo - Classic style above triangle */}
      <div className="logo-container">
        <div className="logo-box">
          <img 
            src="/images/taiga_logo_white.png" 
            alt="TAIGA" 
            className="logo"
          />
        </div>
      </div>
      
      <div className="triangle-container">
        {/* Mobile swipe instruction */}
        {isMobile && (
          <div className="mobile-instruction">
            Swipe left or right to explore
          </div>
        )}
        
        <svg 
          className="triangle" 
          viewBox="0 0 500 500"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <g 
            style={{ 
              transform: isMobile ? `rotate(${triangleRotation}deg)` : 'none',
              transition: isMobile ? 'transform 0.3s ease-out' : 'none',
              transformOrigin: '250px 200px' // Center of triangle
            }}
          >
          {/* Background image clipped to triangle */}
          <defs>
            <clipPath id="triangleClip">
              <polygon points="250,26.8 400,286.6 100,286.6" />
            </clipPath>
          </defs>
          
          {/* Background image */}
          <image 
            href={currentImage}
            x="80" 
            y={currentImage.includes('workshop') ? workshopImageY : defaultImageY} 
            width="340" 
            height={currentImage.includes('workshop') ? workshopImageHeight : defaultImageHeight}
            clipPath="url(#triangleClip)"
            preserveAspectRatio="xMidYMid slice"
            style={{ cursor: 'pointer' }}
            onClick={handleTriangleClick}
          />
          
          {/* Triangle outline */}
          <polygon 
            points="250,26.8 400,286.6 100,286.6" 
            fill="none" 
            stroke="black" 
            strokeWidth="2"
            style={{ cursor: 'pointer' }}
            onClick={handleTriangleClick}
          />
          
          {/* Hoverable areas and backgrounds */}
          {/* Top corner - 0° rotation */}
          <rect 
            x={250 - musicBoxWidth/2} 
            y={26.8 - topTextDistance - boxHeight + boxYOffset} 
            width={musicBoxWidth} 
            height={boxHeight} 
            fill={activeSection === 'music' ? 'black' : 'transparent'}
            transform={`rotate(0 250 ${26.8 - topTextDistance})`}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleSectionHover('music', '/images/hero/triangle-hero-bg.jpg')}
            onClick={() => handleSectionClick('music')}
          />
          <text 
            x="250" 
            y={26.8 - topTextDistance} 
            textAnchor="middle" 
            className={`corner-text ${activeSection === 'music' ? 'active-inverted' : ''}`}
            transform={`rotate(0 250 ${26.8 - topTextDistance})`}
            style={{ pointerEvents: 'none' }}
          >
            THE ARTIST
          </text>
          
          {/* Bottom right corner - 60° rotation */}
          <rect 
            x={(400 + rightTextDistance) - workshopsBoxWidth/2} 
            y={(286.6 + rightTextDistance * 0.577) - boxHeight + boxYOffset} 
            width={workshopsBoxWidth} 
            height={boxHeight} 
            fill={activeSection === 'workshops' ? 'black' : 'transparent'}
            transform={`rotate(-60 ${400 + rightTextDistance} ${286.6 + rightTextDistance * 0.577})`}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleSectionHover('workshops', '/images/hero/triangle-hero-workshop.jpg')}
            onClick={() => handleSectionClick('workshops')}
          />
          <text 
            x={400 + rightTextDistance} 
            y={286.6 + rightTextDistance * 0.577} 
            textAnchor="middle" 
            className={`corner-text ${activeSection === 'workshops' ? 'active-inverted' : ''}`}
            transform={`rotate(${isMobile ? 120 : -60} ${400 + rightTextDistance} ${286.6 + rightTextDistance * 0.577})`}
            style={{ pointerEvents: 'none' }}
          >
            WORKSHOPS
          </text>
          
          {/* Bottom left corner - -60° rotation */}
          <rect 
            x={(100 - leftTextDistance) - tdbBoxWidth/2} 
            y={(286.6 + leftTextDistance * 0.577) - boxHeight + boxYOffset} 
            width={tdbBoxWidth} 
            height={boxHeight} 
            fill={activeSection === 'tbd' ? 'black' : 'transparent'}
            transform={`rotate(60 ${100 - leftTextDistance} ${286.6 + leftTextDistance * 0.577})`}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleSectionHover('tbd', '/images/hero/triangle-hero-bg.jpg')}
            onClick={() => handleSectionClick('tbd')}
          />
          <text 
            x={100 - leftTextDistance} 
            y={286.6 + leftTextDistance * 0.577} 
            textAnchor="middle" 
            className={`corner-text ${activeSection === 'tbd' ? 'active-inverted' : ''}`}
            transform={`rotate(${isMobile ? -120 : 60} ${100 - leftTextDistance} ${286.6 + leftTextDistance * 0.577})`}
            style={{ pointerEvents: 'none' }}
          >
            TBD
          </text>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default App
