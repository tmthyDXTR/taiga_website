import './App.css'

function App() {
  return (
    <div className="app">
      <div className="triangle-container">
        <svg className="triangle" viewBox="0 0 346 300" width="346" height="300">
          {/* Background image clipped to triangle */}
          <defs>
            <clipPath id="triangleClip">
              <polygon points="173,10 336,290 10,290" />
            </clipPath>
          </defs>
          
          {/* Background image */}
          <image 
            href="/images/hero/triangle-background.svg"
            x="10" 
            y="10" 
            width="326" 
            height="280"
            clipPath="url(#triangleClip)"
            opacity="0.3"
          />
          
          {/* Triangle outline */}
          <polygon 
            points="173,10 336,290 10,290" 
            fill="none" 
            stroke="black" 
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  )
}

export default App
