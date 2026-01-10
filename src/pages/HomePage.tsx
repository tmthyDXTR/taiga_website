    import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LogoHeader from '../components/LogoHeader'
import './HomePage.css'

function HomePage() {
  const { t } = useTranslation()
  
  // ========================================
  // ADJUSTABLE DESIGN VARIABLES
  // ========================================
  
  // Triangle Geometry
  const triangleCenter = { x: 250, y: 200 }          // Center point of the triangle (SVG coordinates)
  const desktopDistanceFromCenter = 200              // Desktop: distance from triangle center to text
  const mobileDistanceFromCenter = 200               // Mobile: distance from triangle center to text
  
  // Text Box Dimensions
  const musicBoxWidth = 200                          // Width of "THE ARTIST" text box
  const workshopsBoxWidth = 200                      // Width of "WORKSHOPS" text box  
  const tdbBoxWidth = 200                            // Width of "TBD" text box
  const boxHeight = 18                               // Height of all text boxes
  const linkFontSize = 1.25                          // Font size for navigation links (rem units)
  
  // Background Image Positioning
  const defaultImageY = 30                           // Y position for default/music image
  const workshopImageY = 0                           // Y position for workshop image
  const defaultImageHeight = 280                     // Height for default/music image
  const workshopImageHeight = 500                    // Height for workshop image
  
  // Visual Feedback Animation
  const feedbackScaleFactor = 1.2                    // Scale multiplier for triangle feedback (1.2 = 20% larger)
  const feedbackDuration = 400                       // Duration of feedback animation in milliseconds
  const feedbackScaleUpSpeed = 0.4                   // Speed for scaling up (seconds)
  const feedbackScaleDownSpeed = 0.2                 // Speed for scaling down (seconds)
  const feedbackEasingUp = 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'  // Bouncy easing for scale up
  const feedbackEasingDown = 'ease-out'              // Smooth easing for scale down
  
  // Pulse Effect Animation
  const pulseEnabled = true                          // Enable/disable pulse effect
  const pulseDuration = 1000                         // Duration of pulse animation in milliseconds
  const pulseMaxScale = 1.8                          // Maximum scale of pulse triangles
  const pulseOpacityStart = 0.3                      // Starting opacity of pulse
  const pulseTriangleCount = 2                       // Number of pulse triangles
  
  // Mobile Interaction
  const mobileBreakpoint = 768                       // Screen width threshold for mobile detection
  const swipeThreshold = 50                          // Minimum swipe distance to trigger rotation
  const rotationSpeed = 0.3                          // Speed of rotation animation (seconds)

  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  const [currentImage, setCurrentImage] = useState('/images/hero/triangle-hero-bg.jpg')
  const [activeSection, setActiveSection] = useState('music') // Start with music active
  const [triangleRotation, setTriangleRotation] = useState(0) // Rotation angle in degrees
  const [isMobile, setIsMobile] = useState(false)
  const [isSelectionActive, setIsSelectionActive] = useState(false) // Visual feedback state
  const [isPulseActive, setIsPulseActive] = useState(false) // Pulse effect state

  const navigate = useNavigate()

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= mobileBreakpoint)
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

  // ========================================
  // CALCULATED VALUES
  // ========================================
  
  // Applied distance (automatically switches based on device)
  const distanceFromCenter = isMobile ? mobileDistanceFromCenter : desktopDistanceFromCenter
  
  // Calculate exact BOX CENTER positions from triangle center (mathematically perfect)
  const topBoxCenter = { 
    x: triangleCenter.x, 
    y: triangleCenter.y - distanceFromCenter 
  }
  const rightBoxCenter = { 
    x: triangleCenter.x + (distanceFromCenter * Math.cos(Math.PI / 6)), 
    y: triangleCenter.y + (distanceFromCenter * Math.sin(Math.PI / 6)) 
  }
  const leftBoxCenter = { 
    x: triangleCenter.x - (distanceFromCenter * Math.cos(Math.PI / 6)), 
    y: triangleCenter.y + (distanceFromCenter * Math.sin(Math.PI / 6)) 
  }

  // ========================================
  // UTILITY FUNCTIONS
  // ========================================
  
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

  // Handle section selection
  const handleSectionHover = (section: string, imagePath: string) => {
    if (!isMobile) { // Only on desktop
      if (section !== activeSection) { // Only trigger feedback when selecting a NEW option
        triggerSelectionFeedback()
      }
      setActiveSection(section)
      setCurrentImage(imagePath)
    }
  }

  // Visual feedback for selection
  const triggerSelectionFeedback = () => {
    setIsSelectionActive(true)
    setTimeout(() => setIsSelectionActive(false), feedbackDuration) // Reset after animation
    
    if (pulseEnabled && !isMobile) { // Only enable pulse on desktop
      setIsPulseActive(true)
      setTimeout(() => setIsPulseActive(false), pulseDuration) // Reset pulse after animation
    }
  }

  // Handle section navigation
  const handleSectionClick = (section: string) => {
    if (isMobile) {
      triggerSelectionFeedback() // Add visual feedback only on mobile
    }
    
    // Navigate to the appropriate page
    if (section === 'music') {
      navigate('/music')
    } else if (section === 'workshops') {
      navigate('/workshops')
    } else {
      console.log(`Navigating to ${section} section - page not yet implemented`)
    }
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
    
    if (Math.abs(deltaX) > swipeThreshold) {
      triggerSelectionFeedback() // Add visual feedback for swipe
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
    <div className="home-page" style={{'--link-font-size': `${linkFontSize}rem`} as React.CSSProperties}>
      {/* TAIGA Logo - Unified component */}
      <LogoHeader />
      
      <div className="triangle-container">
        {/* Mobile swipe instruction */}
        {isMobile && (
          <div className="mobile-instruction">
            {t('homepage.mobileInstruction')}
          </div>
        )}
        
        <svg 
          className="triangle" 
          viewBox="0 -50 500 600"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background image clipped to triangle */}
          <defs>
            <clipPath id="triangleClip">
              <polygon points="250,26.8 400,286.6 100,286.6" />
            </clipPath>
          </defs>
          
          {/* Triangle elements that scale */}
          <g 
            style={{ 
              transform: isMobile ? `rotate(${triangleRotation}deg) scale(${isSelectionActive ? feedbackScaleFactor : 1})` : `scale(${isSelectionActive ? feedbackScaleFactor : 1})`,
              transition: isMobile ? `transform ${rotationSpeed}s ease-out` : isSelectionActive ? `transform ${feedbackScaleUpSpeed}s ${feedbackEasingUp}` : `transform ${feedbackScaleDownSpeed}s ${feedbackEasingDown}`,
              transformOrigin: '250px 200px' // Center of triangle
            }}
          >
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
              transform={isMobile && currentImage.includes('workshop') ? `rotate(120 250 200)` : 'none'}
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
          </g>
          
          {/* Pulse triangles - outward expanding effect */}
          {isPulseActive && Array.from({ length: pulseTriangleCount }, (_, i) => (
            <polygon
              key={`pulse-${i}`}
              points="250,26.8 400,286.6 100,286.6"
              fill="none"
              stroke="black"
              strokeWidth="1"
              style={{
                transform: isMobile ? `rotate(${triangleRotation}deg)` : 'none',
                transformOrigin: '250px 200px',
                opacity: 0,
                animation: `pulseExpand ${pulseDuration}ms ease-out forwards`,
                animationDelay: `${i * 100}ms`,
                '--pulse-start-scale': 1 + (i * 0.1),
                '--pulse-end-scale': pulseMaxScale + (i * 0.2),
                '--pulse-start-opacity': pulseOpacityStart * (1 - i * 0.3)
              } as React.CSSProperties}
            />
          ))}
          
          {/* Text and interactive elements that don't scale */}
          <g 
            style={{ 
              transform: isMobile ? `rotate(${triangleRotation}deg)` : 'none',
              transition: isMobile ? `transform ${rotationSpeed}s ease-out` : 'none',
              transformOrigin: '250px 200px' // Center of triangle
            }}
          >
          
          {/* Hoverable areas and backgrounds */}
          {/* Top corner - 0° rotation */}
          <rect 
            x={topBoxCenter.x - musicBoxWidth/2} 
            y={topBoxCenter.y - boxHeight/2} 
            width={musicBoxWidth} 
            height={boxHeight} 
            fill={activeSection === 'music' ? 'black' : 'transparent'}
            transform={`rotate(0 ${topBoxCenter.x} ${topBoxCenter.y})`}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleSectionHover('music', '/images/hero/triangle-hero-bg.jpg')}
            onClick={() => handleSectionClick('music')}
          />
          <text 
            x={topBoxCenter.x} 
            y={topBoxCenter.y} 
            textAnchor="middle" 
            dominantBaseline="central"
            className={`corner-text ${activeSection === 'music' ? 'active-inverted' : ''}`}
            transform={`rotate(0 ${topBoxCenter.x} ${topBoxCenter.y})`}
            style={{ pointerEvents: 'none' }}
          >
            {t('navigation.theArtist')}
          </text>
          
          {/* Bottom right corner - 60° rotation */}
          <rect 
            x={rightBoxCenter.x - workshopsBoxWidth/2} 
            y={rightBoxCenter.y - boxHeight/2} 
            width={workshopsBoxWidth} 
            height={boxHeight} 
            fill={activeSection === 'workshops' ? 'black' : 'transparent'}
            transform={`rotate(-60 ${rightBoxCenter.x} ${rightBoxCenter.y})`}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleSectionHover('workshops', '/images/hero/triangle-hero-workshop.jpg')}
            onClick={() => handleSectionClick('workshops')}
          />
          <text 
            x={rightBoxCenter.x} 
            y={rightBoxCenter.y} 
            textAnchor="middle" 
            dominantBaseline="central"
            className={`corner-text ${activeSection === 'workshops' ? 'active-inverted' : ''}`}
            transform={`rotate(${isMobile ? 120 : -60} ${rightBoxCenter.x} ${rightBoxCenter.y})`}
            style={{ pointerEvents: 'none' }}
          >
            {t('navigation.workshops')}
          </text>
          
          {/* Bottom left corner - -60° rotation */}
          <rect 
            x={leftBoxCenter.x - tdbBoxWidth/2} 
            y={leftBoxCenter.y - boxHeight/2} 
            width={tdbBoxWidth} 
            height={boxHeight} 
            fill={activeSection === 'tbd' ? 'black' : 'transparent'}
            transform={`rotate(60 ${leftBoxCenter.x} ${leftBoxCenter.y})`}
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => handleSectionHover('tbd', '/images/hero/triangle-hero-bg.jpg')}
            onClick={() => handleSectionClick('tbd')}
          />
          <text 
            x={leftBoxCenter.x} 
            y={leftBoxCenter.y} 
            textAnchor="middle" 
            dominantBaseline="central"
            className={`corner-text ${activeSection === 'tbd' ? 'active-inverted' : ''}`}
            transform={`rotate(${isMobile ? -120 : 60} ${leftBoxCenter.x} ${leftBoxCenter.y})`}
            style={{ pointerEvents: 'none' }}
          >
            {t('navigation.tbd')}
          </text>
          </g>
        </svg>
      </div>
    </div>
  )
}

export default HomePage