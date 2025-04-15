import { Network, Shield, BarChart3, Zap } from "lucide-react";

export default function HomeBackgroundElements() {
  return (
    <>
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-pattern opacity-30"></div>
      
      {/* Floating Icons */}
      <div className="floating-icons">
        <div className="floating-icon" style={{ top: '10%', left: '5%' }}>
          <Network size={40} />
        </div>
        <div className="floating-icon" style={{ top: '20%', right: '5%', animationDelay: '2s' }}>
          <Shield size={30} />
        </div>
        <div className="floating-icon" style={{ bottom: '15%', left: '15%', animationDelay: '4s' }}>
          <BarChart3 size={35} />
        </div>
        <div className="floating-icon" style={{ bottom: '25%', right: '10%', animationDelay: '6s' }}>
          <Zap size={25} />
        </div>
      </div>
    </>
  );
} 