export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-stadium-darker flex items-center justify-center p-8">
      <div className="max-w-md w-full space-y-4">
        <div className="glass-card p-6 text-center">
          <h1 className="text-2xl font-bold text-stadium-green mb-2">
            Tailwind is Working! 🎉
          </h1>
          <p className="text-white/80 mb-4">
            If you can see a green glowing text and a glass card with blur effect, 
            Tailwind CSS is properly configured.
          </p>
          <button className="btn-primary w-full">
            Test Button
          </button>
        </div>
        <div className="glass-card p-4 text-center text-white/60 text-sm">
          <p>✅ Custom colors (stadium-green, stadium-darker) are working</p>
          <p>✅ Custom components (glass-card, btn-primary) are working</p>
          <p>✅ Tailwind utilities (flex, p-8, text-center) are working</p>
        </div>
      </div>
    </div>
  )
}