import styles from './Loading.module.scss';

interface LoadingProps{
    scale: number
}

export default function Loading({scale = 1}: LoadingProps){

     const size = 150 * scale;
      return (
        <div className={styles.puppySpinner} style={{ width: `${size}px`, height: `${size}px` }}>
            <div className={styles.loadingText}>LOADING...</div>
            <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Treadmill */}
            <g>
              {/* Frame */}
              <rect x="10" y="60" width="80" height="10" fill="#4b5563" rx="2" />
              {/* Belt */}
              <rect className="treadmill-belt" x="15" y="65" width="70" height="5" fill="#1f2937" />
              {/* Side Rails */}
              <rect x="10" y="55" width="5" height="15" fill="#6b7280" />
              <rect x="85" y="55" width="5" height="15" fill="#6b7280" />
              {/* Control Panel */}
              <rect x="80" y="40" width="15" height="15" fill="#374151" rx="2" />
              <rect x="82" y="42" width="5" height="5" fill="#dc2626" rx="1" />
              <rect x="88" y="42" width="5" height="5" fill="#22c55e" rx="1" />
            </g>
            {/* Puppy */}
            <g className={styles.puppy} fill="#8B4513">
              {/* Body */}
              <ellipse cx="45" cy="58" rx="12" ry="8" />
              {/* Head */}
              <ellipse cx="55" cy="48" rx="10" ry="8" />
              {/* Eyes */}
              <circle cx="53" cy="46" r="1" fill="#000" />
              <circle cx="57" cy="46" r="1" fill="#000" />
              {/* Nose */}
              <circle cx="55" cy="50" r="1.5" fill="#000" />
              {/* Ears */}
              <path d="M50 42 Q48 38 46 42 Q48 40 50 42 Z" />
              <path d="M60 42 Q62 38 64 42 Q62 40 60 42 Z" />
              {/* Legs */}
              <rect x="40" y="62" width="3" height="6" rx="1" />
              <rect x="47" y="62" width="3" height="6" rx="1" />
              <rect x="38" y="62" width="3" height="6" rx="1" transform="rotate(15 40 65)" />
              <rect x="45" y="62" width="3" height="6" rx="1" transform="rotate(-15 47 65)" />
              {/* Tail */}
              <path className="tail" d="M33 58 Q30 55 33 52" />
            </g>
          </svg>
        </div>
      );
}